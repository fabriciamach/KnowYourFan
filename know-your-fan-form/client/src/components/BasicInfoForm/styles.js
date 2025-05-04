import { styled } from '@mui/material/styles';

export const FormContainer = styled('form')(({ theme }) => ({
  marginTop: theme.spacing(3),
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3) // Espaçamento uniforme entre campos
}));

export const FieldContainer = styled('div')({
  width: '100%',
  '& .MuiFormHelperText-root': {
    position: 'absolute',
    bottom: '-22px'
  }
});

export const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  alignSelf: 'flex-end',
  padding: theme.spacing(1.5, 4),
  fontWeight: 'bold'
}));

// Estilo específico para campos de documento
export const DocumentField = styled(TextField)({
  '& input': {
    letterSpacing: '1px'
  }
});