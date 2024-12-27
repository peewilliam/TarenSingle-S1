export class SkillUI {
  constructor() {
    this.container = this.createSkillContainer();
    this.skillButtons = new Map();
    this.createSkillButtons();
  }

  createSkillContainer() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '100px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.display = 'flex';
    container.style.gap = '10px';
    document.body.appendChild(container);
    return container;
  }

  createSkillButtons() {
    const keys = ['Q', 'W', 'E', 'R'];
    keys.forEach(key => {
      const button = this.createSkillButton(key);
      this.skillButtons.set(key, button);
      this.container.appendChild(button);
    });
  }

  createSkillButton(key) {
    const button = document.createElement('div');
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.backgroundColor = '#333';
    button.style.border = '2px solid #666';
    button.style.borderRadius = '8px';
    button.style.display = 'flex';
    button.style.flexDirection = 'column';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.color = 'white';
    button.style.fontSize = '18px';
    button.style.position = 'relative';
    button.textContent = key;
    return button;
  }

  triggerCooldown(skill) {
    const button = this.skillButtons.get(skill.key);
    if (!button) return;

    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.bottom = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.transition = `height ${skill.cooldown}ms linear`;
    button.appendChild(overlay);

    // Start cooldown animation
    requestAnimationFrame(() => {
      overlay.style.height = '0%';
    });

    // Remove overlay when cooldown is complete
    setTimeout(() => {
      overlay.remove();
    }, skill.cooldown);
  }
}