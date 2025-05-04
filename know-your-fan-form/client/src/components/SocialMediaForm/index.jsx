import React, { useState } from 'react';
import { Button, Box, Alert } from '@mui/material';
import { SiTwitch } from 'react-icons/si';

const TwitchConnectButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleTwitchLogin = () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Redirecionamento para o endpoint de login da sua API
      window.location.href = 'http://localhost:8000/login';
      
      // Simulação de conexão bem-sucedida (remova isso na implementação real)
      setTimeout(() => {
        setIsConnected(true);
      }, 2000);
      
    } catch (err) {
      setError('Erro ao iniciar conexão com Twitch');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
      {/* Botão Twitch Estilizado */}
      <Button
        variant="contained"
        color={isConnected ? "success" : "primary"}
        startIcon={<SiTwitch size={20} />}
        onClick={handleTwitchLogin}
        disabled={isLoading || isConnected}
        fullWidth
        sx={{
          py: 1.5,
          borderRadius: 2,
          bgcolor: isConnected ? '#6441a5' : '', 
          '&:hover': {
            bgcolor: isConnected ? '#6441a5' : '',
          },
          fontSize: 16,
          fontWeight: 'bold',
          textTransform: 'none',
          letterSpacing: 0.5
        }}
      >
        {isLoading 
          ? 'Conectando...' 
          : isConnected 
            ? 'Conta Twitch Conectada' 
            : 'Conectar com Twitch'}
      </Button>

      {/* Feedback de erro */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Status de conexão */}
      {isConnected && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Conexão com Twitch estabelecida com sucesso!
        </Alert>
      )}
    </Box>
  );
};

export default TwitchConnectButton;