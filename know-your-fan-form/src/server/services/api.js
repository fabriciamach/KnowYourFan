import config from '../config';

const API_BASE = "http://localhost:8000";
const API_URLS = {
  documentValidation: `${config.API_BASE}/validate-document`
};


// Função para validar documento
export const validateDocument = async (file) => {
  const formData = new FormData();
  formData.append('document', file);

  try {
    const response = await fetch(API_URLS.documentValidation, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Erro na validação');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro na conexão com a API:', error);
    return { 
      isValid: false, 
      error: 'Falha na validação do documento' 
    };
  }
};