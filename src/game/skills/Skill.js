export class Skill {
  constructor(config) {
    this.key = config.key;
    this.name = config.name;
    this.damage = config.damage;
    this.cooldown = config.cooldown;
    this.energyCost = config.energyCost;
    this.color = config.color;
    this.effect = config.effect;
    this.lastUsed = 0;
    this.isOnCooldown = false;
  }

  canUse(player) {
    const now = Date.now();
    return now - this.lastUsed >= this.cooldown && player.energy >= this.energyCost;
  }

  use(player, target) {
    if (!this.canUse(player)) return false;
    
    player.energy -= this.energyCost;
    this.lastUsed = Date.now();
    this.effect(target);
    return true;
  }
}