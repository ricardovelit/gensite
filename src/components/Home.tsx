import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import AsciiBackground from './AsciiBackground';
import CodeEditor from './CodeEditor';

const templateSuggestions = [
  { label: 'E-commerce', icon: '🛍️' },
  { label: 'Blog Personal', icon: '📝' },
  { label: 'Portfolio', icon: '🎨' },
  { label: 'Landing Page', icon: '🚀' },
];

const Home: React.FC = () => {
  const [message, setMessage] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setPrompt(message);
    setShowEditor(true);
  };

  const handleTemplateClick = (template: string) => {
    setMessage(`Quiero crear un sitio tipo ${template}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (showEditor) {
    return <CodeEditor prompt={prompt} />;
  }

  return (
    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1a1a',
          position: 'relative',
          overflow: 'hidden',
          px: { xs: 2, md: 4 },
        }}
      >
        <AsciiBackground />
        
        <Box
          sx={{
            maxWidth: '800px',
            width: '100%',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                fontWeight: 300,
                color: '#4ecdc4',
                mb: 2,
                letterSpacing: '-0.02em',
              }}
            >
              GENSITE AI
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                mb: 6,
                fontWeight: 300,
              }}
            >
              Generate and launch realtime full-stack apps you never thought possible
            </Typography>
          </motion.div>

          <Paper
            elevation={0}
            sx={{
              background: '#222',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              p: 0.5,
              mb: 3,
            }}
          >
            <TextField
              fullWidth
              multiline
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What app do you want to serve?"
              variant="standard"
              sx={{
                '& .MuiInputBase-root': {
                  padding: 2,
                  fontSize: '1.1rem',
                  color: '#fff',
                  '&::before, &::after': {
                    display: 'none',
                  },
                },
                '& .MuiInputBase-input': {
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                    opacity: 1,
                  },
                },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                py: 1.5,
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label="Auto"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                    },
                  }}
                />
              </Box>
              <Button
                variant="contained"
                onClick={handleSendMessage}
                endIcon={<SendIcon />}
                sx={{
                  bgcolor: '#4ecdc4',
                  '&:hover': {
                    bgcolor: '#45b7d1',
                  },
                }}
              >
                Generate
              </Button>
            </Box>
          </Paper>

          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ mb: 4 }}
          >
            {templateSuggestions.map((template) => (
              <Chip
                key={template.label}
                label={template.label}
                icon={<span style={{ fontSize: '1.2rem' }}>{template.icon}</span>}
                onClick={() => handleTemplateClick(template.label)}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  },
                  '& .MuiChip-icon': {
                    color: 'inherit',
                  },
                }}
              />
            ))}
          </Stack>

          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Conecta tu backend, compra un dominio y lanza tu web en minutos.
            Todo desde una sola plataforma.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 