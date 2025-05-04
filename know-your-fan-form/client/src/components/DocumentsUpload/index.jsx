import React, { useState } from 'react';
import { 
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { uploadContainer, previewStyle } from './styles';

const DocumentUpload = ({ onFileChange }) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validação do tipo de arquivo
    if (file.type !== 'image/png') {
      setError('Apenas arquivos PNG são permitidos');
      return;
    }
    
    // Validação do tamanho (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('O arquivo deve ter no máximo 2MB');
      return;
    }

    setError('');
    
    // Cria preview da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onFileChange(file); // Envia o arquivo para o componente pai
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onFileChange(null);
    setError('');
  };

  return (
    <Box sx={uploadContainer}>
      <Typography variant="subtitle1" gutterBottom>
        Upload de Documento (PNG)
      </Typography>
      
      {preview ? (
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={preview}
            alt="Preview do documento"
            sx={previewStyle}
          />
          <IconButton
            onClick={handleRemove}
            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'error.main' }}
          >
            <DeleteIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      ) : (
        <>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Selecionar Arquivo
            <input
              type="file"
              hidden
              accept="image/png"
              onChange={handleFileChange}
            />
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Tamanho máximo: 2MB | Formato: PNG
          </Typography>
        </>
      )}
      
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default DocumentUpload;