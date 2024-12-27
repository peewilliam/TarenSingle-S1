import * as THREE from 'three';
import { MovementSystem } from '../movement/MovementSystem.js';
import { SkillSystem } from '../skills/SkillSystem.js';
import { MeshFactory } from '../utils/MeshFactory.js';

export class Player {
  constructor(id, world) {
    this.id = id;
    this.world = world;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.damage = 15;
    this.speed = 0.1;
    this.level = 1;
    this.experience = 0;
    this.nextLevelExp = 100;
    this.target = null;
    this.mesh = MeshFactory.createPlayerMesh();
    this.moveTarget = null;
    this.skillSystem = new SkillSystem(this, world);
    this.movementSystem = new MovementSystem();
  }

  moveTo(target) {
    this.moveTarget = new THREE.Vector3(target.x, this.mesh.position.y, target.z);
  }

  setTarget(enemy) {
    this.target = enemy;
    if (this.world.uiManager) {
      this.world.uiManager.showTarget(enemy);
    }
  }

  clearTarget() {
    this.target = null;
    if (this.world.uiManager) {
      this.world.uiManager.hideTarget();
    }
  }

  update(deltaTime) {
    if (this.moveTarget) {
      const arrived = this.movementSystem.moveTowards(
        this.mesh,
        this.moveTarget,
        this.speed
      );
      if (arrived) {
        this.moveTarget = null;
      }
    }

    // Update energy regeneration
    if (this.energy < this.maxEnergy) {
      this.energy = Math.min(this.maxEnergy, this.energy + 0.1);
    }
  }

  useEnergy(amount) {
    if (this.energy >= amount) {
      this.energy -= amount;
      return true;
    }
    return false;
  }

  gainExperience(amount) {
    this.experience += amount;
    while (this.experience >= this.nextLevelExp) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.experience -= this.nextLevelExp;
    this.nextLevelExp = Math.floor(this.nextLevelExp * 1.5);
    this.maxHealth += 20;
    this.health = this.maxHealth;
    this.maxEnergy += 10;
    this.energy = this.maxEnergy;
    this.damage += 5;

    if (this.world.uiManager) {
      this.world.uiManager.addChatMessage('System', `Level up! You are now level ${this.level}!`, 'system');
    }
  }
}