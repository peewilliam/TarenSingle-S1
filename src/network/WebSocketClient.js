export class WebSocketClient {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.messageHandlers = new Map();
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const handler = this.messageHandlers.get(data.type);
      if (handler) {
        handler(data.payload);
      }
    };
  }

  on(type, handler) {
    this.messageHandlers.set(type, handler);
  }

  send(type, payload) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    }
  }

  disconnect() {
    this.socket.close();
  }
}