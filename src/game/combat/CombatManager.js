import { DamageCalculator } from './DamageCalculator.js';
import { CombatEffects } from './CombatEffects.js';

export class CombatManager {
  constructor(world) {
    this.world = world;
    this.damageCalculator = new DamageCalculator();
    this.effects = new CombatEffects(world.scene);
  }

  handleCombat(attacker, target, skill) {
    const damage = this.damageCalculator.calculate(attacker, target, skill);
    if (damage > 0) {
      target.takeDamage(damage);
      this.effects.showDamageNumber(target.mesh.position, damage);
      return true;
    }
    return false;
  }
}