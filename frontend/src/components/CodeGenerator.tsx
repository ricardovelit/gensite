import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';

const CodeGenerator = () => {
  const [code, setCode] = useState('');
  
  const handleGenerate = async (prompt: string) => {
    // Lógica para generar código basado en el prompt
    // Esto se conectará con la API de IA en el futuro
    setCode(`// Código generado para: ${prompt}`);
  };

  return (
    <div className="code-generator" style={{ padding: '20px' }}>
      <h1>Generador de Código</h1>
      <CodeEditor 
        code={code} 
        onGenerate={handleGenerate}
        height="70vh"
      />
    </div>
  );
};

export default CodeGenerator;