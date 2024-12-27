import * as THREE from 'three';
import { Enemy } from '../entities/Enemy.js';

export class InputManager {
  constructor(game) {
    this.game = game;
    this.mousePosition = new THREE.Vector3();
    this.isChatActive = false;
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // Global event listeners
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Canvas-specific event listeners
    this.game.renderer.domElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.game.renderer.domElement.addEventListener('mousemove', this.handleMouseMove.bind(this));

    // Chat focus handling
    const chatInput = document.querySelector('.chat-input');
    if (chatInput) {
      chatInput.addEventListener('focus', () => {
        this.isChatActive = true;
      });
      chatInput.addEventListener('blur', () => {
        this.isChatActive = false;
      });
    }

    // Make canvas focusable
    this.game.renderer.domElement.tabIndex = 1;
    this.game.renderer.domElement.style.outline = 'none';
    
    // Auto-focus canvas on start
    this.game.renderer.domElement.focus();
  }

  handleKeyDown(event) {
    // Ignore keyboard events when chat is active
    if (this.isChatActive) {
      return;
    }

    const key = event.key.toUpperCase();
    if (['Q', 'W', 'E', 'R'].includes(key)) {
      event.preventDefault();
      this.game.player.skillSystem.useSkill(key, this.mousePosition);
    }

    // Handle Enter key for chat
    if (event.key === 'Enter') {
      const chatInput = document.querySelector('.chat-input');
      if (chatInput) {
        chatInput.focus();
      }
    }
  }

  handleMouseMove(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    
    raycaster.setFromCamera(mouse, this.game.camera);
    const intersects = raycaster.intersectObject(this.game.world.ground);
    
    if (intersects.length > 0) {
      this.mousePosition.copy(intersects[0].point);
    }
  }

  handleMouseDown(event) {
    event.preventDefault();
    
    // Focus canvas on click
    this.game.renderer.domElement.focus();
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    
    raycaster.setFromCamera(mouse, this.game.camera);
    const intersects = raycaster.intersectObjects(this.game.world.scene.children);
    
    if (intersects.length > 0) {
      if (event.button === 0) { // Left click
        const clickedObject = intersects[0].object;
        const enemy = Array.from(this.game.world.objects.values())
          .find(obj => obj.mesh === clickedObject && obj instanceof Enemy);

        if (enemy) {
          this.game.player.setTarget(enemy);
        }
      } else if (event.button === 2) { // Right click
        this.game.player.moveTo(intersects[0].point);
      }
    }
  }

  handleResize() {
    this.game.camera.aspect = window.innerWidth / window.innerHeight;
    this.game.camera.updateProjectionMatrix();
    this.game.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}