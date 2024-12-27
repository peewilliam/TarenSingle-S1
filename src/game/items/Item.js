import { v4 as uuidv4 } from 'uuid';

export class Item {
  constructor(config) {
    this.id = config.id || uuidv4();
    this.name = config.name;
    this.type = config.type;
    this.stats = config.stats || {};
    this.description = config.description;
    this.rarity = config.rarity || 'common';
  }

  apply(player) {
    Object.entries(this.stats).forEach(([stat, value]) => {
      if (player[stat] !== undefined) {
        if (stat === 'maxHealth' || stat === 'maxEnergy') {
          player[stat] += value;
          player[stat.replace('max', '').toLowerCase()] = Math.min(
            player[stat.replace('max', '').toLowerCase()],
            player[stat]
          );
        } else {
          player[stat] += value;
        }
      }
    });
  }

  remove(player) {
    Object.entries(this.stats).forEach(([stat, value]) => {
      if (player[stat] !== undefined) {
        if (stat === 'maxHealth' || stat === 'maxEnergy') {
          player[stat] -= value;
          player[stat.replace('max', '').toLowerCase()] = Math.min(
            player[stat.replace('max', '').toLowerCase()],
            player[stat]
          );
        } else {
          player[stat] -= value;
        }
      }
    });
  }
}