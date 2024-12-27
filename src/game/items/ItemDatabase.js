export class ItemDatabase {
  constructor() {
    this.items = new Map();
  }

  getItemTemplate(id) {
    return this.items.get(id);
  }

  registerTemplate(template) {
    this.items.set(template.id, template);
  }

  getAllTemplates() {
    return Array.from(this.items.values());
  }
}