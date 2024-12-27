import { FireballEffect } from './effects/FireballEffect.js';
import { FrostNovaEffect } from './effects/FrostNovaEffect.js';
import { LightningEffect } from './effects/LightningEffect.js';
import { EarthquakeEffect } from './effects/EarthquakeEffect.js';

export class SkillEffects {
  constructor(scene) {
    this.scene = scene;
    this.effects = {
      fireball: new FireballEffect(scene),
      frostNova: new FrostNovaEffect(scene),
      lightning: new LightningEffect(scene),
      earthquake: new EarthquakeEffect(scene)
    };
  }

  createFireball(start, end) {
    this.effects.fireball.createEffect(start, end);
  }

  createFrostNova(position) {
    this.effects.frostNova.createEffect(position);
  }

  createLightning(position) {
    this.effects.lightning.createEffect(position);
  }

  createEarthquake(position) {
    this.effects.earthquake.createEffect(position);
  }
}