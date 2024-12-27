import { SKILLS } from '../../ui/constants/skills.js';
import { SkillEffects } from './SkillEffects.js';
import { DamageSystem } from './DamageSystem.js';
import * as THREE from 'three';

export class SkillSystem {
  constructor(player, world) {
    this.player = player;
    this.world = world;
    this.effects = new SkillEffects(world.scene);
    this.damageSystem = new DamageSystem(world);
    this.cooldowns = new Map();
  }

  canUseSkill(skill) {
    const lastUsed = this.cooldowns.get(skill.key) || 0;
    const now = Date.now();
    return now - lastUsed >= skill.cooldown;
  }

  startCooldown(skill) {
    this.cooldowns.set(skill.key, Date.now());
    this.world.uiManager?.showSkillCooldown(skill.key, skill.cooldown);
  }

  useSkill(key, mousePosition) {
    const skill = SKILLS.find(s => s.key === key);
    if (!skill) return;

    if (!this.canUseSkill(skill)) {
      const remainingCooldown = Math.ceil((skill.cooldown - (Date.now() - (this.cooldowns.get(key) || 0))) / 1000);
      this.world.uiManager?.addChatMessage('System', `${skill.name} is on cooldown (${remainingCooldown}s)`, 'system');
      return;
    }

    if (!this.player.useEnergy(skill.energyCost)) {
      this.world.uiManager?.addChatMessage('System', 'Not enough energy!', 'error');
      return;
    }

    let success = false;
    const playerPos = this.player.mesh.position.clone();

    switch (key) {
      case 'Q': // Fireball
        if (mousePosition) {
          this.effects.createFireball(playerPos, mousePosition);
          this.damageSystem.checkLineDamage(playerPos, mousePosition, 1.5, skill.damage);
          success = true;
        }
        break;

      case 'W': // Frost Nova
        this.effects.createFrostNova(playerPos);
        this.damageSystem.checkAreaDamage(playerPos, 5, skill.damage);
        success = true;
        break;

      case 'E': // Lightning
        if (mousePosition) {
          this.effects.createLightning(mousePosition);
          this.damageSystem.checkAreaDamage(mousePosition, 3, skill.damage);
          success = true;
        }
        break;

      case 'R': // Earthquake
        if (mousePosition) {
          this.effects.createEarthquake(mousePosition);
          this.damageSystem.checkAreaDamage(mousePosition, 8, skill.damage);
          success = true;
        }
        break;
    }

    if (success) {
      this.startCooldown(skill);
      this.world.uiManager?.addChatMessage('System', `Cast ${skill.name}!`, 'skill');
    }
  }
}