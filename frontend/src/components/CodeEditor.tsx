import React, { useState, KeyboardEvent } from 'react';
import Editor from '@monaco-editor/react';
import { Button, CircularProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
type CodeEditorProps = {
  code: string;
  language?: string;
  onChange?: (value: string) => void;
  height?: string | number;
  onGenerate?: (prompt: string) => Promise<void>;
};

export function CodeEditor({
  code,
  language = 'javascript',
  onChange,
  height = '500px',
  onGenerate
}: CodeEditorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <input 
          type="text" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe lo que quieres generar"
          style={{ flex: 1, padding: '8px' }}
        />
        <Button 
          variant="contained" 
          startIcon={!isGenerating && <PlayArrowIcon />}
          onClick={() => {
            if (onGenerate && prompt) {
              setIsGenerating(true);
              onGenerate(prompt).finally(() => setIsGenerating(false));
            }
          }}
          onKeyDown={(e: KeyboardEvent) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (onGenerate && prompt && !isGenerating) {
                setIsGenerating(true);
                onGenerate(prompt).finally(() => setIsGenerating(false));
              }
            }
          }}
          disabled={isGenerating || !prompt}
        >
          {isGenerating ? <CircularProgress size={24} /> : 'Iniciar'}
        </Button>
      </div>
      <Editor
        height={height}
        language={language}
        value={code}
        onChange={(value) => onChange && onChange(value || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
        }}
      />
    </div>
  );
}

export default CodeEditor;