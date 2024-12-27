import * as THREE from 'three';
import { MeshFactory } from '../utils/MeshFactory.js';

export class Enemy {
  constructor(id, position = { x: 0, y: 0, z: 0 }, world) {
    this.id = id;
    this.name = `Enemy ${id}`;
    this.maxHealth = 50;
    this.health = this.maxHealth;
    this.damage = 10;
    this.speed = 0.05;
    this.level = Math.floor(Math.random() * 3) + 1;
    this.mesh = MeshFactory.createEnemyMesh();
    this.mesh.position.set(position.x, 1, position.z);
    this.world = world;
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    
    // Show damage number
    if (this.world?.uiManager) {
      const position = this.mesh.position.clone();
      position.y += 2; // Offset above enemy
      this.world.uiManager.showDamageNumber(position, amount);
      
      // Update target frame if this enemy is currently targeted
      const players = Array.from(this.world.objects.values())
        .filter(obj => obj.constructor.name === 'Player');
      
      players.forEach(player => {
        if (player.target === this) {
          this.world.uiManager.showTarget(this);
        }
      });
    }
    
    return this.health <= 0;
  }

  update(deltaTime) {
    // Enemy behavior implementation
    // For now, just a placeholder
  }
}