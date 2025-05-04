import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import DocumentUpload from '../DocumentsUpload';
import { validateDocument } from '../../services/api';
import { toBase64 } from '../utils/to-base64';
import { validateCPF } from '../utils/validate-cpf';

const BasicInfoForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [documentFile, setDocumentFile] = useState(null);
  const [docError, setDocError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmitWithFile = async (data) => {
    setDocError('');
    if (!documentFile) {
      setDocError('Por favor, envie um documento.');
      return;
    }

    setLoading(true);
    try {
      // Converte o arquivo em Base64 antes de enviar
      //console.log(data)
      const base64File = await toBase64(documentFile);
      const result = await validateDocument(base64File,data.cpf);
      if (!result.isValid) {
        setDocError(result.error || 'Documento inválido.');
        setLoading(false);
        return;
      }
      onSubmit({ ...data, documentBase64: base64File });
    } catch (err) {
      setDocError('Erro ao processar o documento.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box component="form" onSubmit={handleSubmit(handleSubmitWithFile)} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Informações Básicas
      </Typography>
      <TextField
        fullWidth
        label="Nome Completo"
        margin="normal"
        {...register('nome', { required: 'Nome é obrigatório' })}
        error={!!errors.nome}
        helperText={errors.nome?.message}
      />
      <TextField
        fullWidth
        label="E-mail"
        margin="normal"
        type="email"
        {...register('email', {
          required: 'E-mail é obrigatório',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'E-mail inválido',
          },
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        fullWidth
        label="CPF"
        margin="normal"
        {...register('cpf', {
          required: 'CPF é obrigatório',
          validate: (value) => validateCPF(value) || 'CPF inválido',
          onChange: (e) => {
            const formattedCPF = e.target.value
              .replace(/\D/g, '') 
              .replace(/(\d{3})(\d)/, '$1.$2') 
              .replace(/(\d{3})(\d)/, '$1.$2') 
              .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = formattedCPF;
          },
        })}
        error={!!errors.cpf}
        helperText={errors.cpf?.message}
      />
      <DocumentUpload onFileChange={setDocumentFile} />
      {docError && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {docError}
        </Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <><CircularProgress size={20} sx={{ mr: 1 }} />Validando...</> : 'Próximo'}
        </Button>
      </Box>
    </Box>
  );
};

export default BasicInfoForm;
