# Adaptado para receber string Base64 (data URI) diretamente
import base64
import os
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()  # Load environment variables from .env file

async def validate_document(document_base64: str, cpf: str):
    """
    Valida documento enviado como string Base64 (data URI).
    - Aceita apenas PNG ou JPEG
    - Tamanho máximo de 2MB
    - Usa GPT-4o para confirmação de documento

    :param document_base64: string Base64 incluindo prefixo data:...;base64,...
    :returns: dict { isValid: bool, error: str | None }
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not set in the environment variables.")
    
    client = AsyncOpenAI(api_key=api_key)
    
   
    try:
        # Separar header e dados
        data_uri = document_base64
       

       
        resp = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"Extraia o texto do cpf da imagem e verifique se a imagem contém um documento de identificação válido e o cpf informado ({cpf}) corresponde ao documento ? Responda apenas 'Sim' ou 'Não'."
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": data_uri}
                    }
                ]
            }
        ],
            temperature=0
        )

        # Interpretar resposta
        is_valid = resp.choices[0].message.content.strip().lower().startswith("sim")
        
        print(f"Resposta do modelo: {is_valid}- {resp.choices[0].message.content.strip()}")  # Exibir resposta do modelo para depuração
        return {
            "isValid": is_valid,
            "error": None if is_valid else "Documento inválido ou ilegível"
        }

    except Exception as e:
        return {
            "isValid": False,
            "error": f"Erro na validação: {str(e)}"
        }
