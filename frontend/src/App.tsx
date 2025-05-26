import { Canvas } from '@react-three/fiber';
import { MotionConfig } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useState, useEffect } from 'react';
import './App.css';
import CodeEditor from './components/CodeEditor';
import axios from 'axios';

gsap.registerPlugin(ScrollTrigger);

const API_URL = 'http://localhost:5000/api/generate';

function App() {
  const [code, setCode] = useState('// Escribe tu código aquí\n');
  
  const generateCodeWithAI = async (prompt: string) => {
    try {
      const response = await axios.post(API_URL, { prompt });
      setCode(response.data.code);
    } catch (error) {
      console.error('Error al conectar con el backend de IA:', error);
    }
  };

  useEffect(() => {
    // Ejemplo: Generar código inicial al cargar la aplicación
    generateCodeWithAI('Crea un sitio web básico');
  }, []);

  return (
    <MotionConfig>
      <div className="app">
        <div className="editor-container">
          <CodeEditor 
            code={code} 
            onChange={setCode}
            height="100%"
            onGenerate={generateCodeWithAI}
          />
          <div className="preview-pane">
            <Canvas>
              {/* Aquí irán nuestros componentes 3D */}
            </Canvas>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

export default App;