import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Box, Paper, Typography } from '@mui/material';
import BasicInfoForm from './components/BasicInfoForm'; 
import EsportsPreferencesForm from './components/EsportsPreferencesForm';
import SocialMediaForm from './components/SocialMediaForm';
import { appStyles, stepperStyles } from './styles/appStyles';

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});

  const steps = ['Informações Básicas', 'Preferências', 'Redes Sociais'];

  const handleNext = (data) => {
    setFormData({ ...formData, ...data });
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

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
        return <SocialMediaForm onSubmit={handleSubmitFinal} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={appStyles.container}>
      <Paper elevation={3} sx={appStyles.paper}>
        <Stepper activeStep={activeStep} alternativeLabel sx={stepperStyles}>
          {steps.map((label) => (
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
}

export default App;