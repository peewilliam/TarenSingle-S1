import { EffectManager } from './EffectManager.js';

export class BasicAttack {
  constructor(player, world) {
    this.player = player;
    this.world = world;
    this.effectManager = new EffectManager(world.scene);
    this.meleeRange = 3;
    this.rangedRange = 10;
    this.attackCooldown = 1000;
    this.lastAttackTime = 0;
  }

  execute(target) {
    const now = Date.now();
    if (now - this.lastAttackTime < this.attackCooldown) return false;

    const distance = this.getDistance(this.player.mesh.position, target.mesh.position);
    const range = this.player.class === 'mage' ? this.rangedRange : this.meleeRange;

    if (distance <= range) {
      target.takeDamage(this.player.damage);
      this.lastAttackTime = now;
      
      if (this.player.class === 'mage') {
        this.effectManager.createMagicProjectile(
          this.player.mesh.position,
          target.mesh.position
        );
      } else {
        this.effectManager.createMeleeSlash(target.mesh.position);
      }
      return true;
    }
    return false;
  }

  getDistance(pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1.x - pos2.x, 2) + 
      Math.pow(pos1.z - pos2.z, 2)
    );
  }
}