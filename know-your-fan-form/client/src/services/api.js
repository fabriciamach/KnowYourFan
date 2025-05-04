// client/src/services/api.js
import axios from 'axios';


/**
 * Valida documento via API. Agora recebe string Base64 (data URI) do PNG ou JPEG.
 * @param {string} documentBase64 - String Base64 do documento, incluindo o prefixo data:...
 * @returns {Promise<{ isValid: boolean, error?: string }>} 
 */
export async function validateDocument(documentBase64,cpf) {
  try {
    const response = await axios.post(
      `http://localhost:8000/validate-document`,
      { document_base64: documentBase64, cpf: cpf },
    );
    return response.data;
  } catch (err) {
    console.error('Erro ao validar documento:', err);
    return { isValid: false, error: 'Falha na validação do documento.' };
  }
}
