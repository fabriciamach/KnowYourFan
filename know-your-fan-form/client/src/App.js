import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Stepper, Step, StepLabel, Box, Paper } from '@mui/material';
import BasicInfoForm from './components/BasicInfoForm';
import EsportsPreferencesForm from './components/EsportsPreferencesForm';
import SocialMediaForm from './components/SocialMediaForm';
import TwitchCallback from './components/TwitchCallback';
import TwitchSuccess from './components/TwitchSucess';
import { appStyles, stepperStyles } from './styles/appStyles';

// Componente que encapsula o Stepper Wizard
const StepperWizard = ({ initialData = {} }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialData);

  const steps = ['Informações Básicas', 'Preferências', 'Redes Sociais'];

  const handleNext = (data) => {
    if (activeStep === 1) {
      localStorage.setItem('esports_preferences', JSON.stringify(data));
    }
    setFormData(prev => ({ ...prev, ...data }));
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleSubmitFinal = (data) => {
    
    const finalData = { ...formData, ...data };
    console.log('Dados completos:', finalData);
    alert('Formulário enviado com sucesso!');
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <BasicInfoForm onSubmit={handleNext} />;
      case 1:
        return <EsportsPreferencesForm onSubmit={handleNext} onBack={handleBack} />;
      case 2:
        // Note que SocialMediaForm agora usa onNext para concluir
        return <SocialMediaForm onNext={handleSubmitFinal} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={appStyles.container}>
      <Paper elevation={3} sx={appStyles.paper}>
        <Stepper activeStep={activeStep} alternativeLabel sx={stepperStyles}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={appStyles.stepContent}>
          {renderStepContent(activeStep)}
        </Box>
      </Paper>
    </Box>
  );
};

// Componente principal com rotas
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/callback" element={<TwitchCallback />} />
        <Route path="/twitch-success" element={<TwitchSuccess />} />
        <Route path="/*" element={<StepperWizard />} />
      </Routes>
    </Router>
  );
}

export default App;
