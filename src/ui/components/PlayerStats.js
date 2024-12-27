import { getHealthColor, getExpColor } from '../utils/colorUtils.js';
import { createPlayerAvatar } from '../utils/avatarUtils.js';

export class PlayerStats {
  constructor() {
    this.element = this.create();
    this.lastUpdate = 0;
    this.updateThrottle = 16; // ~60fps
  }

  create() {
    const stats = document.createElement('div');
    stats.className = 'panel player-stats';

    stats.innerHTML = `
      <div class="player-info">
        <div class="player-avatar">
          ${createPlayerAvatar()}
        </div>
        <div class="player-details">
          <div class="player-name">Player</div>
          <div class="player-level">Level 1</div>
          <div class="player-exp-bar">
            <div class="exp-fill"></div>
            <span class="exp-text">0/100 XP</span>
          </div>
        </div>
      </div>

      <div class="stat-bar">
        <div class="stat-label">
          <span class="stat-icon">❤️</span>
          <span class="stat-name">Health</span>
          <span class="health-value">100/100</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill health-fill"></div>
        </div>
      </div>

      <div class="stat-bar">
        <div class="stat-label">
          <span class="stat-icon">⚡</span>
          <span class="stat-name">Energy</span>
          <span class="energy-value">100/100</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill energy-fill"></div>
        </div>
      </div>
    `;

    document.body.appendChild(stats);
    return stats;
  }

  update(player) {
    const now = performance.now();
    if (now - this.lastUpdate < this.updateThrottle) return;
    this.lastUpdate = now;

    this.updateHealth(player);
    this.updateEnergy(player);
    this.updateExperience(player);
  }

  updateHealth(player) {
    const healthPercent = (player.health / player.maxHealth) * 100;
    const healthValue = this.element.querySelector('.health-value');
    const healthBar = this.element.querySelector('.health-fill');
    
    healthValue.textContent = `${Math.round(player.health)}/${player.maxHealth}`;
    healthBar.style.width = `${healthPercent}%`;
    healthBar.style.backgroundColor = getHealthColor(healthPercent);
  }

  updateEnergy(player) {
    const energyPercent = (player.energy / player.maxEnergy) * 100;
    const energyValue = this.element.querySelector('.energy-value');
    const energyBar = this.element.querySelector('.energy-fill');
    
    energyValue.textContent = `${Math.round(player.energy)}/${player.maxEnergy}`;
    energyBar.style.width = `${energyPercent}%`;
  }

  updateExperience(player) {
    const levelEl = this.element.querySelector('.player-level');
    const expFill = this.element.querySelector('.exp-fill');
    const expText = this.element.querySelector('.exp-text');
    
    levelEl.textContent = `Level ${player.level}`;
    
    const expPercent = (player.experience / player.nextLevelExp) * 100;
    expFill.style.width = `${expPercent}%`;
    expFill.style.backgroundColor = getExpColor(expPercent);
    expText.textContent = `${player.experience}/${player.nextLevelExp} XP`;
  }
}