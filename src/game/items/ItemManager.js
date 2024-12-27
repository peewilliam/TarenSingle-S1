import { Item } from './Item.js';
import { ItemDatabase } from './ItemDatabase.js';

export class ItemManager {
  constructor() {
    this.items = new Map();
    this.itemDatabase = new ItemDatabase();
    this.initializeItems();
  }

  initializeItems() {
    this.registerItem({
      id: 'sword1',
      name: 'Iron Sword',
      type: 'weapon',
      stats: { damage: 5 },
      description: 'A basic iron sword',
      rarity: 'common'
    });

    this.registerItem({
      id: 'armor1',
      name: 'Leather Armor',
      type: 'armor',
      stats: { maxHealth: 20 },
      description: 'Basic leather protection',
      rarity: 'common'
    });
  }

  registerItem(config) {
    this.items.set(config.id, config);
  }

  createItem(itemId) {
    const config = this.items.get(itemId);
    if (config) {
      return new Item(config);
    }
    return null;
  }
}