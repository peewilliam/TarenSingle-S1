import './style.css';
import { GameEngine } from './game/core/GameEngine.js';

// Initialize game
const game = new GameEngine();

// Start the game loop
game.start();

// Add initial instructions to chat
game.uiManager.addChatMessage('System', 'Welcome to the game!', 'system');
game.uiManager.addChatMessage('System', 'Controls:', 'system');
game.uiManager.addChatMessage('System', '- QWER: Use skills', 'system');
game.uiManager.addChatMessage('System', '- Right click: Move', 'system');
game.uiManager.addChatMessage('System', '- Left click: Select target', 'system');
game.uiManager.addChatMessage('System', '- Enter: Open chat', 'system');