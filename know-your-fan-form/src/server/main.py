import base64
import io
from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.document_validator import validate_document
import uvicorn

app = FastAPI()

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


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)