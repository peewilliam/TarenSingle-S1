export class LevelSystem {
  constructor(player) {
    this.player = player;
    this.level = 1;
    this.experience = 0;
    this.skillPoints = 0;
    this.skills = new Map();
  }

  getRequiredXP(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  addExperience(amount) {
    this.experience += amount;
    while (this.experience >= this.getRequiredXP(this.level)) {
      this.levelUp();
    }
  }

  levelUp() {
    this.experience -= this.getRequiredXP(this.level);
    this.level++;
    this.skillPoints += 2;
    
    // Increase player stats
    this.player.maxHealth += 10;
    this.player.health = this.player.maxHealth;
    this.player.maxEnergy += 5;
    this.player.energy = this.player.maxEnergy;
    this.player.damage += 2;
  }

  addSkill(skillName, config) {
    this.skills.set(skillName, {
      level: 0,
      maxLevel: config.maxLevel || 5,
      cost: config.cost || 1,
      effect: config.effect
    });
  }

  upgradeSkill(skillName) {
    const skill = this.skills.get(skillName);
    if (skill && 
        skill.level < skill.maxLevel && 
        this.skillPoints >= skill.cost) {
      skill.level++;
      this.skillPoints -= skill.cost;
      skill.effect(this.player, skill.level);
      return true;
    }
    return false;
  }
}