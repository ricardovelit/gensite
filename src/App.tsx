import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Home from './components/Home';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4ecdc4',
      light: '#45b7d1',
      dark: '#3a9c96',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff6b6b',
      light: '#ff8e8e',
      dark: '#ff4949',
      contrastText: '#fff',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#fff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '4rem',
      fontWeight: 300,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '3.5rem',
      fontWeight: 300,
      letterSpacing: '-0.00833em',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 400,
      letterSpacing: '0em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.00938em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '8px',
          padding: '8px 24px',
        },
        contained: {
          background: 'linear-gradient(135deg, #4ecdc4, #45b7d1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #45b7d1, #4ecdc4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Home />
    </ThemeProvider>
  );
}

export default App;
