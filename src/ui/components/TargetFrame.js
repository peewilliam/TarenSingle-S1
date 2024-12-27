export class TargetFrame {
  constructor() {
    this.element = this.create();
  }

  create() {
    const frame = document.createElement('div');
    frame.className = 'game-ui target-frame panel';
    frame.style.position = 'fixed';
    frame.style.top = '20px';
    frame.style.left = '50%';
    frame.style.transform = 'translateX(-50%)';
    frame.style.width = '300px';
    frame.style.display = 'none';
    frame.style.padding = '15px';
    frame.style.background = 'rgba(0, 0, 0, 0.85)';
    frame.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    frame.style.borderRadius = '8px';
    frame.style.color = 'white';
    frame.style.zIndex = '1000';

    frame.innerHTML = `
      <div class="target-info" style="display: flex; align-items: center; margin-bottom: 10px;">
        <div style="flex: 1">
          <div class="target-name" style="font-size: 18px; font-weight: bold; margin-bottom: 4px;">Enemy</div>
          <div class="target-level" style="font-size: 14px; color: #4a90e2;">Level 1</div>
        </div>
      </div>
      <div class="target-health">
        <div class="progress-bar" style="height: 12px; background: rgba(0, 0, 0, 0.4); border-radius: 6px; overflow: hidden;">
          <div class="progress-fill" style="height: 100%; background: #e74c3c; transition: width 0.3s ease;"></div>
        </div>
        <div class="health-text" style="text-align: center; font-size: 14px; margin-top: 4px;">100/100</div>
      </div>
    `;

    document.body.appendChild(frame);
    return frame;
  }

  show(target) {
    this.element.style.display = 'block';
    this.update(target);
  }

  hide() {
    this.element.style.display = 'none';
  }

  update(target) {
    const nameEl = this.element.querySelector('.target-name');
    const levelEl = this.element.querySelector('.target-level');
    const healthBar = this.element.querySelector('.progress-fill');
    const healthText = this.element.querySelector('.health-text');

    nameEl.textContent = target.name || `Enemy ${target.id}`;
    levelEl.textContent = `Level ${target.level || 1}`;
    
    const healthPercent = (target.health / target.maxHealth) * 100;
    healthBar.style.width = `${healthPercent}%`;
    healthBar.style.backgroundColor = this.getHealthColor(healthPercent);
    healthText.textContent = `${target.health}/${target.maxHealth}`;
  }

  getHealthColor(percentage) {
    if (percentage > 60) return '#2ecc71'; // Green
    if (percentage > 30) return '#f1c40f'; // Yellow
    return '#e74c3c'; // Red
  }
}