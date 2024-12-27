import * as THREE from 'three';

export class CombatSystem {
  constructor(world) {
    this.world = world;
    this.attackRange = 2;
    this.attackCooldown = 1000; // 1 second cooldown
    this.lastAttackTime = 0;
  }

  attack(attacker, target) {
    const now = Date.now();
    if (now - this.lastAttackTime < this.attackCooldown) {
      return false;
    }

    const distance = this.getDistance(attacker.mesh.position, target.mesh.position);
    if (distance <= this.attackRange) {
      const damage = this.calculateDamage(attacker);
      const isDead = target.takeDamage(damage);
      this.lastAttackTime = now;
      return { hit: true, damage, isDead };
    }
    return { hit: false };
  }

  calculateDamage(attacker) {
    const baseDamage = attacker.damage;
    const variation = baseDamage * 0.2; // 20% damage variation
    return Math.floor(baseDamage + (Math.random() - 0.5) * variation);
  }

  getDistance(pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1.x - pos2.x, 2) + 
      Math.pow(pos1.z - pos2.z, 2)
    );
  }
}