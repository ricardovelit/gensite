import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Grid,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { motion } from 'framer-motion';
import CodeEditor from './CodeEditor';

const steps = ['Descripción', 'Generación', 'Previsualización', 'Descarga'];

export const WebsiteBuilder: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [sessionId, setSessionId] = useState('');

  const handleStart = () => {
    if (prompt.trim()) {
      setSessionId(crypto.randomUUID());
      setActiveStep(1);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Describe tu sitio web ideal
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Cuéntanos cómo quieres que sea tu sitio web. Incluye detalles sobre el diseño,
                funcionalidades y cualquier característica específica que desees.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Por ejemplo: Quiero un sitio web moderno para mi restaurante con un menú interactivo, sistema de reservas y galería de fotos..."
                variant="outlined"
                sx={{ mt: 2 }}
              />
              <Button
                variant="contained"
                size="large"
                onClick={handleStart}
                disabled={!prompt.trim()}
                sx={{ mt: 3 }}
              >
                Comenzar Generación
              </Button>
            </Paper>
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CodeEditor prompt={prompt} />
          </motion.div>
        );
      // Implementar casos para los otros pasos...
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Constructor de Sitios Web con IA
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" paragraph>
          Observa cómo la IA construye tu sitio web en tiempo real
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mt: 4, mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStep()}
      </Box>
    </Container>
  );
};

export default WebsiteBuilder; 