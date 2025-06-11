import React from 'react';
import { Box } from '@mui/material';

const AsciiBackground: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        opacity: 0.07,
        pointerEvents: 'none',
        overflow: 'hidden',
        fontFamily: 'monospace',
        fontSize: '14px',
        lineHeight: 1,
        color: 'primary.main',
        whiteSpace: 'pre',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, transparent, #0a0a0a)',
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'asciiFloat 20s linear infinite',
          fontSize: {
            xs: '10px',
            sm: '12px',
            md: '14px',
          },
        }}
      >
{`
   O                M
      ;MMx         ;MMW.
      XM'Mk        WM,Mk
     oM' Mk       kM' Mk       M
    :M'  Mk      xM'  Mk      M
   .M'   Mk     NM'   Mk     M.
  .M'    Mk    WM'    Mk    'M.
 .M'     Mk   NM'     Mk    'M.
,M'      Mk  WM'      Mk     'M,
M'       Mk NM'       Mk      'M
         Mk.M'        Mk
         MkN'         Mk
         Mk'          Mk
         Mk           Mk
         Mk           Mk
         Mk           Mk
         Mk           Mk
         MK           Mk
         Mk           Mk
         Mk           Mk
         Mk           Mk
         Mk           Mk
         Mk           Mk
`}</Box>
    </Box>
  );
};

export default AsciiBackground; 