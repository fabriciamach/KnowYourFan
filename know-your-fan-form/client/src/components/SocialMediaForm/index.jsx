import React, { useState } from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';
import { SiTwitch } from 'react-icons/si';
import { socialStyles } from './styles';


const SocialMediaForm = ({ onSubmit, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTwitchLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Substitua por sua lógica real de autenticação
      const isAuthenticated = await authenticateWithTwitch(); 
      
      if (isAuthenticated) {
        onSubmit({ twitch: 'connected' }); // Envia status para o form pai
      } else {
        setError('Falha ao conectar com Twitch');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={socialStyles.container}>
      <Typography variant="h6" gutterBottom>
        Conexão com Twitch
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Conecte sua conta Twitch para acessar conteúdos exclusivos
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<SiTwitch />}
        onClick={() => window.location.href = 'https://1ce8-2804-4f90-27a-d100-45b6-935a-56ae-525e.ngrok-free.app/login'}
        disabled={isLoading}
        fullWidth
        sx={socialStyles.twitchButton}
      >
        {isLoading ? 'Conectando...' : 'Conectar com Twitch'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={socialStyles.actions}>
        <Button variant="outlined" onClick={onBack}>
          Voltar
        </Button>
      </Box>
    </Box>
  );
};

// Mock da função de autenticação (substitua pela sua implementação real)
const authenticateWithTwitch = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simula autenticação bem-sucedida
      resolve(true); 
      // Para simular erro:
      // resolve(false);
    }, 1500);
  });
};

export default SocialMediaForm;