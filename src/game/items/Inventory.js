export class Inventory {
  constructor(size = 20) {
    this.size = size;
    this.items = new Map();
    this.equipped = new Map();
  }

  addItem(item) {
    if (this.items.size < this.size) {
      this.items.set(item.id, item);
      return true;
    }
    return false;
  }

  removeItem(itemId) {
    return this.items.delete(itemId);
  }

  equipItem(itemId, player) {
    const item = this.items.get(itemId);
    if (item && this.canEquip(item)) {
      if (this.equipped.has(item.type)) {
        this.unequipItem(item.type, player);
      }
      this.equipped.set(item.type, item);
      item.apply(player);
      return true;
    }
    return false;
  }

  unequipItem(type, player) {
    const item = this.equipped.get(type);
    if (item) {
      item.remove(player);
      this.equipped.delete(type);
      return true;
    }
    return false;
  }

  canEquip(item) {
    return ['weapon', 'armor', 'accessory'].includes(item.type);
  }
}