import { v4 as uuidv4 } from 'uuid';

interface AIMessage {
  type: 'thinking' | 'writing' | 'analyzing' | 'completed';
  data: {
    code?: string;
    message: string;
  };
  timestamp: string;
}

class AIService {
  private ws: WebSocket | null = null;
  private clientId: string;
  private messageHandlers: ((message: AIMessage) => void)[] = [];

  constructor() {
    this.clientId = uuidv4();
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(`ws://localhost:3000/ws/${this.clientId}`);

    this.ws.onmessage = (event) => {
      const message: AIMessage = JSON.parse(event.data);
      console.log('[WebSocket][aiService] Mensaje recibido:', message);
      this.messageHandlers.forEach(handler => handler(message));
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed. Reconnecting...');
      setTimeout(() => this.connect(), 1000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  public onMessage(handler: (message: AIMessage) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  public async generateCode(prompt: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket connection not ready');
    }

    this.ws.send(JSON.stringify({
      type: 'generate',
      prompt,
      timestamp: new Date().toISOString()
    }));
  }
}

export const aiService = new AIService(); 