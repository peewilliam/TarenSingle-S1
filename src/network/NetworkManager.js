import { io } from 'socket.io-client';

export class NetworkManager {
  constructor(game) {
    this.game = game;
    this.socket = io('http://localhost:3000');
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.socket.emit('player:join', {
        id: this.game.player.id,
        position: this.game.player.mesh.position
      });
    });

    this.socket.on('player:joined', (player) => {
      if (player.id !== this.game.player.id) {
        this.game.addRemotePlayer(player);
      }
    });

    this.socket.on('player:left', (playerId) => {
      this.game.removeRemotePlayer(playerId);
    });

    this.socket.on('player:moved', (data) => {
      if (data.id !== this.game.player.id) {
        this.game.updateRemotePlayer(data);
      }
    });

    this.socket.on('chat:message', (data) => {
      this.game.ui.addChatMessage(data.sender, data.message);
    });
  }

  sendPosition(position) {
    this.socket.emit('player:move', {
      id: this.game.player.id,
      position: position
    });
  }

  sendChatMessage(message) {
    this.socket.emit('chat:message', {
      sender: this.game.player.id,
      message: message
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
}