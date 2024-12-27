export class SkillTooltip {
  constructor() {
    this.element = this.create();
  }

  create() {
    const tooltip = document.createElement('div');
    tooltip.className = 'skill-tooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);
    return tooltip;
  }

  show(skill, position, cooldownRemaining = 0) {
    const cooldownText = cooldownRemaining > 0 
      ? `${(cooldownRemaining / 1000).toFixed(1)}s` 
      : `${skill.cooldown / 1000}s`;

    this.element.innerHTML = `
      <div class="tooltip-header">
        <span class="tooltip-name" style="color: ${skill.color}">${skill.name}</span>
        <span class="tooltip-type">${skill.type}</span>
      </div>
      <div class="tooltip-stats">
        <div class="tooltip-stat">
          <span class="tooltip-stat-label">Damage:</span>
          <span>${skill.damage}</span>
        </div>
        <div class="tooltip-stat">
          <span class="tooltip-stat-label">Energy Cost:</span>
          <span>${skill.energyCost}</span>
        </div>
        <div class="tooltip-stat">
          <span class="tooltip-stat-label">Cooldown:</span>
          <span>${cooldownText}</span>
        </div>
      </div>
      <div class="tooltip-description">${skill.description}</div>
    `;

    this.element.style.display = 'block';
    this.updatePosition(position);
  }

  hide() {
    this.element.style.display = 'none';
  }

  updatePosition(position) {
    const padding = 15;
    const tooltipRect = this.element.getBoundingClientRect();
    
    let x = position.x + padding;
    let y = position.y + padding;

    // Keep tooltip within window bounds
    if (x + tooltipRect.width > window.innerWidth) {
      x = position.x - tooltipRect.width - padding;
    }
    if (y + tooltipRect.height > window.innerHeight) {
      y = position.y - tooltipRect.height - padding;
    }

    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
  }
}