import { RendererManager } from './managers/RendererManager.js';
import { CameraManager } from './managers/CameraManager.js';
import { GameStateManager } from './managers/GameStateManager.js';
import { World } from '../world/World.js';
import { Player } from '../entities/Player.js';
import { InputManager } from './InputManager.js';
import { UIManager } from '../../ui/UIManager.js';
import { EventEmitter } from '../utils/EventEmitter.js';

export class GameEngine {
  constructor() {
    // Initialize event system
    this.events = new EventEmitter();
    
    // Initialize core systems
    this.rendererManager = new RendererManager();
    this.cameraManager = new CameraManager();
    this.gameStateManager = new GameStateManager();
    
    this.renderer = this.rendererManager.renderer;
    this.camera = this.cameraManager.camera;
    
    // Initialize world first
    this.world = new World();
    
    // Initialize player with world reference
    this.player = new Player('player1', this.world);
    this.world.addObject(this.player);
    
    // Initialize UI with world and player reference
    this.uiManager = new UIManager(this.world, this.player);
    this.world.uiManager = this.uiManager;
    
    this.world.setCamera(this.camera);
    
    // Initialize input handling
    this.inputManager = new InputManager(this);
    
    this.lastTime = performance.now();
    this.animate = this.animate.bind(this);

    // Setup window resize handler
    window.addEventListener('resize', () => {
      this.rendererManager.resize();
      this.cameraManager.resize();
    });

    // Welcome message and instructions
    this.uiManager.addChatMessage('System', 'Welcome to the game!', 'system');
    this.uiManager.addChatMessage('System', 'Controls:', 'system');
    this.uiManager.addChatMessage('System', '- QWER: Use skills', 'system');
    this.uiManager.addChatMessage('System', '- Right click: Move', 'system');
    this.uiManager.addChatMessage('System', '- Left click: Select target', 'system');
    this.uiManager.addChatMessage('System', '- Enter: Open chat', 'system');
  }

  animate(currentTime) {
    if (this.gameStateManager.state.isPaused) return;
    
    requestAnimationFrame(this.animate);
    
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Update game state
    this.world.update(deltaTime);
    this.player.update(deltaTime);
    this.cameraManager.updateCamera(this.player);
    
    // Update UI with player stats
    this.uiManager.update(this.player);
    
    // Render frame
    this.renderer.render(this.world.scene, this.camera);
  }

  start() {
    this.world.spawnEnemies();
    this.animate(performance.now());
  }
}