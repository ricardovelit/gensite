import React, { useState, useEffect, useRef, Component, ReactNode } from 'react';
import { Box, Typography, IconButton, Tab, Tabs, TextField, Button, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FolderIcon from '@mui/icons-material/Folder';
import CodeIcon from '@mui/icons-material/Code';
import TerminalIcon from '@mui/icons-material/Terminal';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
import StyleIcon from '@mui/icons-material/Style';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { createFile, downloadProject } from '../services/fileService';
import { aiService } from '../services/aiService';
import { Sandpack } from "@codesandbox/sandpack-react";

interface CodeEditorProps {
  prompt: string;
}

interface FileTab {
  name: string;
  content: string;
  language: string;
}

interface ChatMessage {
  text: string;
  isAI: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

// ErrorBoundary para la vista previa
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    // Puedes loguear el error si lo deseas
    // console.error('Error en vista previa:', error, info);
  }
  handleReload = () => {
    this.setState({ hasError: false });
  };
  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff' }}>
          <Typography variant="h5" color="error" gutterBottom>Ocurrió un error inesperado en la vista previa.</Typography>
          <Button variant="contained" color="primary" onClick={this.handleReload}>Recargar vista previa</Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

const CodeEditor: React.FC<CodeEditorProps> = ({ prompt }) => {
  const [code, setCode] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ line: 0, ch: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const codeRef = useRef<HTMLPreElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout>();
  const [view, setView] = useState<'code' | 'preview'>('code');

  // Files state
  const [files, setFiles] = useState<{ [filename: string]: { content: string; language: string } }>({
    'App.tsx': { content: '', language: 'typescript' },
    'styles.css': { content: '', language: 'css' },
    'index.html': { content: '<div id="root"></div>', language: 'html' },
  });
  const [activeFile, setActiveFile] = useState('App.tsx');

  // Estado para saber si la IA está generando
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  // Estado para saber si es la primera respuesta de la IA
  const isFirstAIResponseRef = useRef(true);
  const [isFirstAIResponse, setIsFirstAIResponse] = useState(true);

  const isCompletedMessageSentRef = useRef(false);

  // Referencia global para saber si ya se mostró el mensaje comercial en este proyecto
  const hasShownCommercialRef = useRef(false);

  const [previewError, setPreviewError] = useState(false);

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    
    // Add user message
    setChatMessages(prev => [...prev, {
      text: chatMessage,
      isAI: false,
      timestamp: new Date(),
    }]);

    try {
      // Send message to AI
      await aiService.generateCode(chatMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages(prev => [...prev, {
        text: "Lo siento, hubo un error al procesar tu mensaje.",
        isAI: true,
        timestamp: new Date(),
      }]);
    }

    setChatMessage('');
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    const unsubscribe = aiService.onMessage(async (message) => {
      // Solo agregar el mensaje comercial la primera vez que se genera el proyecto
      if (["thinking", "writing"].includes(message.type)) {
        if (!hasShownCommercialRef.current) {
          setIsAIGenerating(true);
          setChatMessages(prev => [...prev, {
            text: getCommercialAIPhrase("first", prompt),
            isAI: true,
            timestamp: new Date(message.timestamp),
          }]);
          hasShownCommercialRef.current = true;
          isFirstAIResponseRef.current = false;
          setIsFirstAIResponse(false);
        }
      }
      if (["analyzing", "completed", "error"].includes(message.type)) {
        setIsAIGenerating(false);
        if (message.type === "completed" && !isCompletedMessageSentRef.current) {
          setChatMessages(prev => [...prev, {
            text: "¿Te gustaría hacer algún cambio o agregar algo más?",
            isAI: true,
            timestamp: new Date(message.timestamp),
          }]);
          isCompletedMessageSentRef.current = true;
        }
      }
      // Fusión robusta de archivos recibidos
      const filesData = (message.data as { files?: any }).files;
      if (filesData && typeof filesData === 'object') {
        setFiles(prevFiles => {
          // Fusiona los archivos nuevos con los anteriores
          const merged = { ...prevFiles };
          for (const [name, f] of Object.entries(filesData)) {
            const fileObj = f as { content?: string; language?: string };
            const content = typeof fileObj.content === 'string' ? fileObj.content.trim() : '';
            if (!content || content === 'undefined') continue;
            merged[name] = {
              content,
              language: typeof fileObj.language === 'string' ? fileObj.language : 'typescript',
            };
          }
          return merged;
        });
        // Si el archivo activo desaparece, selecciona el primero disponible
        setActiveFile(active => filesData[active] ? active : Object.keys({ ...files, ...filesData })[0]);
      }
    });
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Reinicia la referencia solo si el prompt cambia (nuevo proyecto)
    hasShownCommercialRef.current = false;
    isFirstAIResponseRef.current = true;
    setIsFirstAIResponse(true);
    isCompletedMessageSentRef.current = false;
    aiService.generateCode(prompt).catch(error => {
      console.error('Error generating initial code:', error);
    });
  }, [prompt]);

  useEffect(() => {
    if (isAIGenerating) {
      setChatMessages(prev => {
        if (prev.some(msg => msg.isLoading)) return prev;
        return [
          ...prev,
          {
            text: '🚀 Desarrollando... Por favor espera mientras la IA crea tu proyecto.',
            isAI: true,
            isLoading: true,
            timestamp: new Date(),
          },
        ];
      });
    } else {
      setChatMessages(prev => prev.filter(msg => !msg.isLoading));
    }
  }, [isAIGenerating]);

  const handleDownload = async () => {
    try {
      await downloadProject(files);
    } catch (error) {
      console.error('Error downloading project:', error);
    }
  };

  const requiredFiles = ["App.tsx", "index.tsx", "index.html"];
  const missingFiles = requiredFiles.filter(f => !files[f]);

  function getFileIcon(filename: string) {
    if (filename.endsWith('.tsx') || filename.endsWith('.ts') || filename.endsWith('.js') || filename.endsWith('.jsx')) return <CodeIcon fontSize="small" sx={{ mr: 1 }} />;
    if (filename.endsWith('.css') || filename.endsWith('.scss')) return <StyleIcon fontSize="small" sx={{ mr: 1 }} />;
    if (filename.endsWith('.json')) return <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />;
    return <InsertDriveFileIcon fontSize="small" sx={{ mr: 1 }} />;
  }

  // Agrupar archivos por carpeta para el sidebar
  function groupFilesByFolder(filesObj: { [filename: string]: { content: string; language: string } }) {
    const tree: { [folder: string]: string[] } = {};
    Object.keys(filesObj).forEach((file) => {
      const parts = file.split('/');
      if (parts.length > 1) {
        const folder = parts.slice(0, -1).join('/');
        if (!tree[folder]) tree[folder] = [];
        tree[folder].push(file);
      } else {
        if (!tree['.']) tree['.'] = [];
        tree['.'].push(file);
      }
    });
    return tree;
  }
  const fileTree = groupFilesByFolder(files);

  // Función para mensajes comerciales/contextuales
  function getCommercialAIPhrase(type: string, prompt: string) {
    if (type === "first") {
      return `¡Vamos a crear una sección de servicios que impacte! Basado en tu solicitud: "${prompt}", diseñaré una interfaz ultra moderna que muestre tus servicios de manera clara y atractiva. Usaré un diseño modular con tarjetas interactivas, efectos hover sutiles y una jerarquía visual que destaque lo más importante. ¿Prefieres un layout en grid o un diseño más asimétrico y dinámico? También podemos añadir microinteracciones para hacerlo más vivo.`;
    }
    if (type === "thinking") {
      return `¡Estoy analizando tu solicitud para diseñar una solución moderna y alineada a tus objetivos!`;
    }
    if (type === "writing") {
      return `Estoy desarrollando una interfaz impactante, con diseño modular, efectos visuales y microinteracciones para que tu sitio destaque. ¡Prepárate para ver resultados sorprendentes!`;
    }
    return '';
  }

  // Función de validación de archivos mínimos reforzada
  function isValidProjectFiles(files: { [filename: string]: { content: string; language: string } } | undefined): boolean {
    if (!files || typeof files !== 'object') return false;
    const required = ['index.html', 'App.tsx'];
    for (const f of required) {
      if (!(f in files)) return false;
      const fileObj = files[f];
      if (!fileObj || typeof fileObj.content !== 'string') return false;
      const content = fileObj.content.trim();
      if (!content || content === 'undefined') return false;
    }
    return true;
  }

  // Limpia archivos inválidos antes de pasar a Sandpack y asegura package.json válido
  function getSafeFiles(files: { [filename: string]: { content: string; language: string } }): { [filename: string]: { content: string; language: string } } {
    const safe: { [filename: string]: { content: string; language: string } } = {};
    for (const [k, v] of Object.entries(files)) {
      if (v && typeof v.content === 'string' && v.content.trim() && v.content.trim() !== 'undefined') {
        // Refuerzo especial para package.json
        if (k === 'package.json') {
          try {
            JSON.parse(v.content);
          } catch {
            safe[k] = {
              content: '{\n  "name": "react-minimal",\n  "version": "1.0.0",\n  "main": "index.tsx"\n}',
              language: 'json',
            };
            continue;
          }
        }
        safe[k] = v;
      }
    }
    // Si no existe package.json, agrégalo mínimo
    if (!safe['package.json']) {
      safe['package.json'] = {
        content: '{\n  "name": "react-minimal",\n  "version": "1.0.0",\n  "main": "index.tsx"\n}',
        language: 'json',
      };
    }
    return safe;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* Sidebar, Editor, etc. */}
      <Box sx={{ flex: 1, position: 'relative', minWidth: 0 }}>
        {/* Botón para alternar entre Código y Visualización */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 1, borderBottom: '1px solid #333', bgcolor: '#252526' }}>
          <Button
            variant={view === 'code' ? 'contained' : 'text'}
            onClick={() => setView('code')}
            sx={{ borderRadius: 0, color: view === 'code' ? '#fff' : '#858585', bgcolor: view === 'code' ? '#007acc' : 'transparent', mr: 1 }}
          >
            Código
          </Button>
          <Button
            variant={view === 'preview' ? 'contained' : 'text'}
            onClick={() => setView('preview')}
            sx={{ borderRadius: 0, color: view === 'preview' ? '#fff' : '#858585', bgcolor: view === 'preview' ? '#007acc' : 'transparent' }}
          >
            Vista previa del sitio
          </Button>
        </Box>
        {view === 'code' ? (
          <Box
            sx={{
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#1e1e1e',
            }}
          >
            {/* Editor Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1,
                borderBottom: '1px solid #333',
                bgcolor: '#252526',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body2" sx={{ color: '#858585' }}>
                Generando código • {prompt}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Descargar proyecto">
                  <IconButton 
                    size="small" 
                    onClick={handleDownload}
                    sx={{ color: '#858585' }}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Chat con la IA">
                  <IconButton 
                    size="small" 
                    sx={{ 
                      color: showChat ? '#fff' : '#858585',
                      '&:hover': { color: '#fff' }
                    }}
                    onClick={() => setShowChat(!showChat)}
                  >
                    <ChatIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <IconButton size="small" sx={{ color: '#858585' }}>
                  <SearchIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: '#858585' }}>
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flex: 1 }}>
              {/* Activity Bar */}
              <Box
                sx={{
                  width: 48,
                  bgcolor: '#333333',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 1,
                  gap: 1,
                }}
              >
                <IconButton sx={{ color: '#fff' }}>
                  <FolderIcon />
                </IconButton>
                <IconButton sx={{ color: '#858585' }}>
                  <CodeIcon />
                </IconButton>
                <IconButton 
                  sx={{ color: showTerminal ? '#fff' : '#858585' }}
                  onClick={() => setShowTerminal(!showTerminal)}
                >
                  <TerminalIcon />
                </IconButton>
              </Box>

              {/* Sidebar */}
              <Box
                sx={{
                  width: 240,
                  bgcolor: '#252526',
                  borderRight: '1px solid #333',
                  overflow: 'auto',
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#858585', mb: 1 }}>
                    EXPLORER
                  </Typography>
                  {Object.keys(fileTree).map((folder) => (
                    <Box key={folder} sx={{ mb: 1 }}>
                      {folder !== '.' && (
                        <Typography variant="caption" sx={{ color: '#4ecdc4', pl: 1 }}>{folder}</Typography>
                      )}
                      {fileTree[folder].map((file) => (
                        <Box
                          key={file}
                          onClick={() => setActiveFile(file)}
                          sx={{
                            p: 1,
                            cursor: 'pointer',
                            color: activeFile === file ? '#4ecdc4' : files[file].content.trim() === '' ? 'orange' : '#d4d4d4',
                            bgcolor: activeFile === file ? 'rgba(78,205,196,0.08)' : 'inherit',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.1)',
                            },
                          }}
                        >
                          {getFileIcon(file)}
                          {file}
                          {files[file].content.trim() === '' && (
                            <span style={{ color: 'orange', marginLeft: 8, fontSize: 12 }} title="Archivo vacío o no generado">⚠️</span>
                          )}
                        </Box>
                      ))}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Main Editor Area */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {/* Tabs */}
                <Tabs
                  value={Object.keys(files).indexOf(activeFile)}
                  onChange={(_, newValue) => setActiveFile(Object.keys(files)[newValue])}
                  sx={{
                    minHeight: 35,
                    '& .MuiTabs-indicator': {
                      bgcolor: '#007acc',
                    },
                  }}
                >
                  {Object.keys(files).map((file) => (
                    <Tab
                      key={file}
                      label={<span style={{ display: 'flex', alignItems: 'center' }}>{getFileIcon(file)}{file}</span>}
                      sx={{
                        minHeight: 35,
                        color: '#858585',
                        '&.Mui-selected': {
                          color: '#fff',
                        },
                      }}
                    />
                  ))}
                </Tabs>

                {/* Code Content */}
                <Box
                  sx={{
                    flex: 1,
                    overflow: 'auto',
                    position: 'relative',
                    bgcolor: '#1e1e1e',
                  }}
                >
                  <Box sx={{ display: 'flex', height: '100%' }}>
                    {/* Line Numbers */}
                    <Box
                      sx={{
                        width: 50,
                        bgcolor: '#1e1e1e',
                        p: 1,
                        textAlign: 'right',
                        borderRight: '1px solid #333',
                      }}
                    >
                      {files[activeFile]?.content.split('\n').map((_, i) => (
                        <Typography
                          key={i}
                          variant="body2"
                          sx={{
                            color: '#858585',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            lineHeight: '1.5rem',
                          }}
                        >
                          {i + 1}
                        </Typography>
                      ))}
                    </Box>

                    {/* Code */}
                    <Box sx={{ flex: 1, p: 2, position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <TextField
                          multiline
                          fullWidth
                          minRows={20}
                          value={files[activeFile]?.content ?? ''}
                          onChange={(e) => setFiles((prev) => ({ ...prev, [activeFile]: { ...prev[activeFile], content: e.target.value || '' } }))}
                          sx={{ fontFamily: 'monospace', fontSize: '1rem', bgcolor: '#181818', color: '#fff', border: 'none' }}
                        />
                      </div>
                    </Box>
                  </Box>
                </Box>

                {/* Terminal */}
                {showTerminal && (
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: '#1e1e1e',
                      borderTop: '1px solid #333',
                      p: 1,
                      color: '#d4d4d4',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      overflow: 'auto',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <TerminalIcon sx={{ fontSize: 16, color: '#858585' }} />
                      <Typography variant="body2" sx={{ color: '#858585' }}>
                        Terminal
                      </Typography>
                    </Box>
                    <Box sx={{ color: '#0a0' }}>$ </Box>
                    <Box component="span" sx={{ ml: 1 }}>
                      Iniciando generación de código...
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        ) : (
          isValidProjectFiles(files) && files['index.html'] && files['App.tsx'] ? (
            <ErrorBoundary>
              <Box sx={{ width: '100%', height: '100vh', bgcolor: '#fff', p: 0, m: 0, position: 'relative' }}>
                <Sandpack
                  template="react-ts"
                  files={getSafeFiles(files)}
                  options={{
                    showTabs: false,
                    showLineNumbers: false,
                    showConsole: false,
                    showNavigator: false,
                    editorHeight: 0,
                    editorWidthPercentage: 0,
                    autorun: true,
                    showInlineErrors: false,
                    wrapContent: true,
                    layout: 'preview',
                    externalResources: []
                  }}
                  customSetup={{
                    dependencies: {
                      "@mui/material": "latest",
                      "@mui/icons-material": "latest",
                      "framer-motion": "latest"
                    }
                  }}
                />
              </Box>
            </ErrorBoundary>
          ) : (
            <Box sx={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff' }}>
              <Typography variant="h5" color="error">No se pudo generar una previsualización válida del proyecto. Intenta de nuevo o cambia tu solicitud.</Typography>
            </Box>
          )
        )}
      </Box>
      {/* Chat Panel */}
      {showChat && (
        <Box
          sx={{
            width: 320,
            flexShrink: 0,
            height: '100vh',
            backgroundColor: '#252526',
            borderLeft: '1px solid #333',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Chat Header */}
          <Box sx={{ p: 2, borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ color: '#d4d4d4' }}>
              Chat con la IA
            </Typography>
            <IconButton size="small" onClick={() => setShowChat(false)} sx={{ color: '#858585' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          {/* Chat Messages */}
          <Box
            ref={chatContainerRef}
            sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {chatMessages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: msg.isAI ? 'flex-start' : 'flex-end',
                  maxWidth: '80%',
                  bgcolor: msg.isAI ? '#2d2d2d' : '#007acc',
                  borderRadius: 2,
                  p: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: msg.isAI ? '#4ecdc4' : '#fff', fontWeight: msg.isAI ? 600 : 400 }}>
                  {msg.isAI && msg.text.includes('error') ? '❌ ' : msg.isAI && msg.text.includes('generando') ? '🤖 ' : msg.isAI ? '💡 ' : ''}{msg.text}
                </Typography>
              </Box>
            ))}
          </Box>
          {/* Chat Input */}
          <Box sx={{ p: 2, borderTop: '1px solid #333', display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe una instrucción para la IA (ej: agrega un navbar, cambia el color, etc.)"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  bgcolor: '#3c3c3c',
                  '& fieldset': {
                    borderColor: '#3c3c3c',
                  },
                  '&:hover fieldset': {
                    borderColor: '#007acc',
                  },
                },
              }}
            />
            <IconButton onClick={handleSendMessage} sx={{ color: '#007acc' }}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CodeEditor; 