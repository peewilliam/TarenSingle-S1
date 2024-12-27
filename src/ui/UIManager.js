import { PlayerStats } from './components/PlayerStats.js';
import { SkillBar } from './components/SkillBar.js';
import { TargetFrame } from './components/TargetFrame.js';
import { ChatBox } from './components/ChatBox.js';
import { DamageNumbers } from './components/DamageNumbers.js';
import { Minimap } from './components/Minimap.js';

import './styles/ui.css';
import './styles/components/avatar.css';
import './styles/components/chat.css';
import './styles/components/player-stats.css';
import './styles/components/skill-tooltip.css';

export class UIManager {
  constructor(world, player) {
    this.world = world;
    this.player = player;
    
    // Initialize UI components
    this.playerStats = new PlayerStats();
    this.skillBar = new SkillBar();
    this.targetFrame = new TargetFrame();
    this.chatBox = new ChatBox();
    this.damageNumbers = new DamageNumbers(world.scene);
    this.minimap = new Minimap(world, player);
  }

  update(player) {
    this.playerStats.update(player);
  }

  showTarget(target) {
    this.targetFrame.show(target);
  }

  hideTarget() {
    this.targetFrame.hide();
  }

  showSkillCooldown(skillKey, duration) {
    this.skillBar.showCooldown(skillKey, duration);
  }

  addChatMessage(sender, message, type = 'normal') {
    this.chatBox.addMessage(sender, message, type);
  }

  showDamageNumber(position, amount, type = 'normal') {
    this.damageNumbers.show(position, amount, type);
  }
}