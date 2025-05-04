export const appStyles = {
    container: {
      maxWidth: 800,
      margin: 'auto',
      mt: 4,
      p: 2
    },
    paper: {
      p: 4,
      borderRadius: 2
    },
    stepContent: {
      mt: 4,
      minHeight: 300
    }
  };
  
  export const stepperStyles = {
    mb: 4,
    '& .MuiStepIcon-root.Mui-completed': {
      color: 'success.main'
    },
    '& .MuiStepIcon-root.Mui-active': {
      color: 'primary.main'
    }
  };