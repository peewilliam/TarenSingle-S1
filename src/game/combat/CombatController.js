import { CombatSystem } from './CombatSystem.js';
import { EffectManager } from './EffectManager.js';

export class CombatController {
  constructor(world) {
    this.world = world;
    this.combatSystem = new CombatSystem(world);
    this.effectManager = new EffectManager(world.scene);
  }

  handleAttack(attacker, target) {
    const result = this.combatSystem.attack(attacker, target);
    
    if (result.hit) {
      this.effectManager.createHitEffect(target.mesh.position);
      this.world.ui?.showDamageNumber(result.damage, target.mesh.position);
      
      if (result.isDead) {
        if (target.constructor.name === 'Enemy') {
          attacker.levelSystem?.addExperience(25);
          this.world.removeObject(target.id);
        }
      }
      return true;
    }
    return false;
  }
}