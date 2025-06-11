import React, { useEffect, useState, useRef } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeGenerationEvent {
  type: 'thinking' | 'writing' | 'analyzing' | 'completed' | 'error';
  data: {
    message?: string;
    code?: string;
    error?: string;
  };
  timestamp: number;
}

interface CodeGeneratorProps {
  sessionId: string;
  wsUrl: string;
}

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({ sessionId, wsUrl }) => {
  const [events, setEvents] = useState<CodeGenerationEvent[]>([]);
  const [code, setCode] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const ws = new WebSocket(`${wsUrl}/${sessionId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const newEvent: CodeGenerationEvent = JSON.parse(event.data);
      setEvents(prev => [...prev, newEvent]);

      switch (newEvent.type) {
        case 'thinking':
        case 'writing':
        case 'analyzing':
          setStatus(newEvent.data.message || '');
          break;
        case 'completed':
          if (newEvent.data.code) {
            setCode(newEvent.data.code);
            animateCodeTyping(newEvent.data.code);
          }
          setStatus('');
          break;
        case 'error':
          setStatus(`Error: ${newEvent.data.error}`);
          break;
      }
    };

    return () => {
      ws.close();
    };
  }, [sessionId, wsUrl]);

  const animateCodeTyping = (finalCode: string) => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= finalCode.length) {
        setCode(finalCode.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Ajusta la velocidad de escritura aquí
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', margin: '0 auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, backgroundColor: '#1e1e1e' }}>
        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CircularProgress size={20} sx={{ mr: 2 }} />
                <Typography color="primary">{status}</Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <Box
          component="pre"
          ref={codeRef}
          sx={{
            backgroundColor: '#1e1e1e',
            color: '#d4d4d4',
            padding: 2,
            borderRadius: 1,
            overflow: 'auto',
            fontSize: '14px',
            lineHeight: 1.5,
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#484848',
              borderRadius: '4px',
            },
          }}
        >
          <code>{code}</code>
        </Box>
      </Paper>
    </Box>
  );
};

export default CodeGenerator; 