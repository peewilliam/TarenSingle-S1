import { SKILLS } from '../constants/skills.js';
import { SkillTooltip } from './SkillTooltip.js';

export class SkillBar {
  constructor() {
    this.buttons = new Map();
    this.tooltip = new SkillTooltip();
    this.element = this.create();
    this.cooldowns = new Map();
  }

  create() {
    const skillBar = document.createElement('div');
    skillBar.className = 'game-ui skill-bar';
    
    SKILLS.forEach(skill => {
      const button = this.createSkillButton(skill);
      this.buttons.set(skill.key, button);
      skillBar.appendChild(button);
    });

    document.body.appendChild(skillBar);
    return skillBar;
  }

  createSkillButton(skill) {
    const button = document.createElement('div');
    button.className = 'skill-button';
    button.style.borderColor = skill.color;
    
    button.innerHTML = `
      <div class="skill-icon">${skill.icon}</div>
      <div class="skill-key">${skill.key}</div>
      <div class="skill-name">${skill.name}</div>
      <div class="skill-cooldown"></div>
    `;

    // Add hover events for tooltip
    button.addEventListener('mouseenter', (e) => {
      const cooldownRemaining = this.getRemainingCooldown(skill.key);
      this.tooltip.show(skill, {
        x: e.clientX,
        y: e.clientY
      }, cooldownRemaining);
    });

    button.addEventListener('mouseleave', () => {
      this.tooltip.hide();
    });

    button.addEventListener('mousemove', (e) => {
      this.tooltip.updatePosition({
        x: e.clientX,
        y: e.clientY
      });
    });

    return button;
  }

  getRemainingCooldown(skillKey) {
    const startTime = this.cooldowns.get(skillKey);
    if (!startTime) return 0;

    const skill = SKILLS.find(s => s.key === skillKey);
    const elapsed = Date.now() - startTime;
    return Math.max(0, skill.cooldown - elapsed);
  }

  showCooldown(skillKey, duration) {
    const button = this.buttons.get(skillKey);
    if (!button) return;

    const cooldown = button.querySelector('.skill-cooldown');
    this.cooldowns.set(skillKey, Date.now());

    // Reset the cooldown overlay
    cooldown.style.transition = 'none';
    cooldown.style.height = '100%';
    
    // Force a reflow to ensure the transition works
    cooldown.offsetHeight;
    
    // Start the cooldown animation
    cooldown.style.transition = `height ${duration}ms linear`;
    cooldown.style.height = '0%';

    // Add disabled state to button
    button.classList.add('disabled');

    // Remove disabled state when cooldown is complete
    setTimeout(() => {
      button.classList.remove('disabled');
      this.cooldowns.delete(skillKey);
    }, duration);
  }
}