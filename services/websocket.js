import { storage } from '../utils/storage';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.listeners = new Map();
    this.baseUrl = 'wss://obex-edge-backend.onrender.com';
  }

  // Connect to WebSocket with auth token
  async connect() {
    try {
      const token = await storage.getToken();
      
      if (!token) {
        console.error('No auth token available for WebSocket connection');
        return;
      }

      const wsUrl = `${this.baseUrl}/ws/alerts?token=${token}`;
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.emit('connected');
        
        // Send initial ping
        this.sendPing();
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.emit('disconnected');
        this.attemptReconnect();
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      };
      
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }

  // Send ping message
  sendPing() {
    if (this.isConnected()) {
      this.ws.send(JSON.stringify({ event: 'ping' }));
    }
  }

  // Handle incoming messages
  handleMessage(data) {
    console.log('WebSocket message received:', data);
    
    switch (data.event) {
      case 'ping':
        // Handle ping - connection is alive
        this.emit('ping');
        break;
        
      case 'alert':
        // Handle security alert
        this.emit('alert', data.data);
        break;
        
      default:
        console.log('Unknown WebSocket event:', data.event);
    }
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Attempt to reconnect
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
    }
  }

  // Event listener management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in WebSocket event callback:', error);
        }
      });
    }
  }

  // Get connection status
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

export default new WebSocketService();