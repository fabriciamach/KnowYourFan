import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button, CircularProgress, Card, CardContent, Grid, Avatar, Chip, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LiveTvIcon from '@mui/icons-material/LiveTv';

const API = 'http://localhost:8000';

const TwitchSuccess = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const userId = localStorage.getItem('twitch_user_id');
    const esportsPrefs = JSON.parse(localStorage.getItem('esports_preferences') || '{}');

    if (!userId) {
      return navigate('/');
    }

    fetch(`${API}/follows/${userId}`)
      .then(res => res.json())
      .then(followData => {
        const streamers = followData.data.map(f => f.broadcaster_name);
        return fetch(`${API}/recommendations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, esports_preferences: esportsPrefs, streamers })
        });
      })
      .then(res => res.json())
      .then(data => {
        setRecommendations(data.recommendations);
        setLoading(false);
      })
      .catch(() => navigate('/'));
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        textAlign: 'center'
      }}>
        <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>Analisando seus interesses...</Typography>
        <Typography variant="body2" color="text.secondary">
          Estamos preparando recomendações personalizadas para você
        </Typography>
      </Box>
    );
  }


  const formatRecommendations = (text) => {
    if (!text) return null;
    
    // Divide por quebras de linha e remove linhas vazias
    const lines = text.split('\n').filter(line => line.trim() !== '');
  
    return lines.map((line, index) => {
      if (line.startsWith('#')) {  // Se for um título (ex: "#Recomendações")
        return (
          <Typography key={index} variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
            {line.replace('#', '')}
          </Typography>
        );
      }
      
      if (line.startsWith('-')) {  // Se for uma lista
        return (
          <Box key={index} component="li" sx={{ ml: 3, mb: 1 }}>
            {line.replace('-', '')}
          </Box>
        );
      }
  
      // Parágrafo comum
      return (
        <Typography key={index} paragraph sx={{ mb: 2 }}>
          {line}
        </Typography>
      );
    });
  };
  
  return (
    <Box sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      p: { xs: 2, md: 4 },
      my: 4
    }}>
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Conta Twitch vinculada com sucesso!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Agora podemos te recomendar conteúdos baseados no que você mais curte
          </Typography>
          <Chip 
            label={`ID: ${localStorage.getItem('twitch_user_id')}`} 
            variant="outlined" 
            sx={{ mt: 1 }}
          />
        </CardContent>
      </Card>

      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            p: 2,
            backgroundColor: 'primary.light',
            borderRadius: 1,
            color: 'primary.contrastText'
          }}>
            <SportsEsportsIcon sx={{ mr: 2, fontSize: 30 }} />
            <Typography variant="h5" component="div">
              Suas recomendações exclusivas
            </Typography>
          </Box>


          
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ 
            textAlign: 'left'}}>
            {formatRecommendations(recommendations)}
          </Box>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} md={6}>
              <Button 
                fullWidth 
                variant="outlined" 
                size="large"
                onClick={() => navigate('/')}
                sx={{ py: 1.5 }}
              >
                Voltar ao início
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TwitchSuccess;