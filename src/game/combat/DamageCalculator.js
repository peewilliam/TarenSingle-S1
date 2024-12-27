export class DamageCalculator {
  calculate(attacker, target, skill) {
    const baseDamage = skill.damage;
    const variation = 0.2; // 20% damage variation
    
    // Apply random variation
    const randomFactor = 1 + (Math.random() - 0.5) * variation;
    const finalDamage = Math.round(baseDamage * randomFactor);
    
    return Math.max(1, finalDamage); // Minimum 1 damage
  }
}