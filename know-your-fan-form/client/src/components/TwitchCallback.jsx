import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const TwitchCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('user_id');
    if (userId) {
      // Salva no localStorage e vai pra tela de sucesso
      localStorage.setItem('twitch_user_id', userId);
      navigate('/twitch-success');
    } 
  }, [navigate]);

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography>Conectando Twitch… aguarde.</Typography>
    </Box>
  );
};

export default TwitchCallback;
