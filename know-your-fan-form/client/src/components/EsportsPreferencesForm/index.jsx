import React from 'react';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { games } from './formConfig';
import { formContainerStyles, actionsContainerStyles } from './styles';

const EsportsPreferencesForm = ({ onSubmit, onBack }) => {
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors } 
  } = useForm();

  const attendedEvents = watch('attendedEvents');

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit(onSubmit)} 
      sx={formContainerStyles}
    >
      <Typography variant="h6" gutterBottom>
        Preferências de eSports
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Jogo Favorito</InputLabel>
        <Select
          label="Jogo Favorito"
          {...register('favoriteGame', { required: 'Selecione um jogo' })}
          error={!!errors.favoriteGame}
        >
          {games.map(game => (
            <MenuItem key={game} value={game}>{game}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Última compra relacionada a e-sports"
        margin="normal"
        {...register('lastBought')}
      />

      <FormControlLabel
        control={<Checkbox {...register('attendedEvents')} />}
        label="Participei de eventos de eSports no último ano"
      />

      {attendedEvents && (
        <TextField
          fullWidth
          label="Quais eventos?"
          margin="normal"
          multiline
          rows={3}
          {...register('eventsList')}
        />
      )}

      <Box sx={actionsContainerStyles}>
        <Button variant="outlined" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Próximo
        </Button>
      </Box>
    </Box>
  );
};

export default EsportsPreferencesForm;