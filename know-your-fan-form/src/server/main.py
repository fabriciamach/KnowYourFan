import base64
import io
import os
import secrets
from urllib.parse import urlencode
from fastapi import FastAPI, Request, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import httpx
from pydantic import BaseModel
from services.document_validator import validate_document
import uvicorn

app = FastAPI()
from openai import AsyncOpenAI

CLIENT_ID = "dmlpzr8frhdndtogcjerplxvatf3xs"
CLIENT_SECRET = "00m8k0ygt02lj0napnswkvm6n3jwes"
REDIRECT_URI = "http://localhost:8000/callback"
FRONTEND_CALLBACK_URI = "http://localhost:3000/callback"

_state_cache = {}
_token_cache = {}


# Configura CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class DocumentPayload(BaseModel):
    document_base64: str
    cpf : str

class RecommendationRequest(BaseModel):
    user_id: str
    esports_preferences: dict
    streamers: list[str]

# Modelo de response
class RecommendationResponse(BaseModel):
    recommendations: str


@app.post("/recommendations", response_model=RecommendationResponse)
async def generate_recommendations(req: RecommendationRequest):
    """
    Gera recomendações de produtos de e-sports com base no perfil e nos streamers seguidos.
    Retorna um texto com produtos reais e links.
    """
    # Inicializa cliente OpenAI
    client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # Constrói prompt para a IA
    prompt = (
        "Você é um assistente especializado em criar recomendações personalizadas para fãs de e-sports, "
        "utilizando a estratégia Know Your Fan. Seu objetivo é ajudar clubes e organizações a oferecerem experiências "
        "e serviços exclusivos para seus fãs. Com base nas informações fornecidas, crie recomendações detalhadas e úteis. "
        f"Perfil do usuário: {req.esports_preferences}. "
        f"Streamers seguidos: {', '.join(req.streamers)}. "
        "Verifique de quais jogos, equipes e streamers o usuário é fã e crie recomendações personalizadas. "
        "As recomendações devem ser relevantes e específicas, evitando generalizações. "
        "Use uma linguagem clara e amigável, como se estivesse conversando com um amigo. "
        "As recomendações devem incluir:\n"
        "1. Notícias recentes e relevantes sobre os jogos, equipes e streamers favoritos do usuário.\n"
        "2. Sugestões de jogos e lançamentos que estejam alinhados com as preferências do usuário.\n"
        "3. Streamers ou criadores de conteúdo semelhantes aos que o usuário já segue, com links para seus canais.\n"
        "4. Eventos, competições ou torneios futuros que possam interessar ao usuário, com datas e links para mais informações.\n"
        "5. Produtos oficiais, mercadorias ou itens colecionáveis relacionados aos interesses do usuário, com links para compra.\n"
        "Certifique-se de formatar a resposta de forma clara, organizada e atrativa, utilizando seções ou listas numeradas. "
        "Inclua links ativos sempre que possível e evite respostas genéricas."
    )

    # Chama o modelo de chat
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Você é um assistente especializado em experiências e recomendações para fãs de e-sports, focado na estratégia Know Your Fan."},
            {"role": "user",   "content": prompt}
        ]
    )

    # Obtém o texto da recomendação
    content = response.choices[0].message.content

    return {"recommendations": content}


@app.post("/validate-document")
async def validate_document_endpoint(payload: DocumentPayload):
    """
    Endpoint que recebe JSON com campo 'document_base64' (data URI) e retorna {'isValid': bool, 'error': str | None}.
    """
    try:
        result = await validate_document(payload.document_base64, payload.cpf)
        return result
    except HTTPException as e:
        # Propaga erros HTTP gerados na validação
        raise e
    except Exception as e:
        # Erro inesperado
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/login")
async def login():
    state = secrets.token_urlsafe(16)
    _state_cache[state] = True
    params = {
        "response_type": "code",
        "client_id":     CLIENT_ID,
        "redirect_uri":  REDIRECT_URI,
        "scope":         "user:read:email user:read:follows channel:read:subscriptions",
        "state":         state,
    }
    url = "https://id.twitch.tv/oauth2/authorize?" + urlencode(params)
    return RedirectResponse(url)

@app.get("/callback")
async def callback(request: Request):
    error = request.query_params.get("error")
    if error:
        raise HTTPException(400, detail=f"{error}: {request.query_params.get('error_description')}")

    code  = request.query_params.get("code")
    state = request.query_params.get("state")
    if state not in _state_cache:
        raise HTTPException(400, detail="Invalid state")
    _state_cache.pop(state)

    # 1) Troca code por tokens de usuário
    token_url = "https://id.twitch.tv/oauth2/token"
    data = {
        "client_id":     CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code":          code,
        "grant_type":    "authorization_code",
        "redirect_uri":  REDIRECT_URI
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    async with httpx.AsyncClient() as client:
        resp = await client.post(token_url, data=data, headers=headers)
        resp.raise_for_status()
        token_data = resp.json()

    access_token  = token_data["access_token"]
    refresh_token = token_data.get("refresh_token")

    # 2) Valida token para obter user_id/login
    async with httpx.AsyncClient() as client:
        val = await client.get(
            "https://id.twitch.tv/oauth2/validate",
            headers={"Authorization": f"OAuth {access_token}"}
        )
        val.raise_for_status()
        info = val.json()
        user_id = info["user_id"]

    # 3) Armazena tokens em memória
    _token_cache[user_id] = {
        "access_token":  access_token,
        "refresh_token": refresh_token
    }

    return RedirectResponse(f"{FRONTEND_CALLBACK_URI}?user_id={user_id}&login={info['login']}")

@app.get("/token/{user_id}")
async def get_stored_token(user_id: str):
    tokens = _token_cache.get(user_id)
    if not tokens:
        raise HTTPException(404, detail="Tokens não encontrados para esse user_id")
    return tokens

@app.get("/follows/{user_id}")
async def get_follows(
    user_id: str,
    first: int = 100
    
):
    """
    Retorna os canais que o usuário segue.
    - first: quantos resultados buscar (máx. 100, padrão 100)
    - after: cursor para paginação
    """
    tokens = _token_cache.get(user_id)
    if not tokens:
        raise HTTPException(404, detail="Tokens não encontrados para esse user_id")
    access_token = tokens["access_token"]

    params = {"user_id": user_id, "first": first}


    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://api.twitch.tv/helix/channels/followed",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Client-Id":      CLIENT_ID
            },
            params=params
        )
        if resp.status_code == 401:
            raise HTTPException(401, detail="Access token expirado ou inválido")
        resp.raise_for_status()
        return resp.json()


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)