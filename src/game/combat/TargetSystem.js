import { TargetUI } from '../../ui/TargetUI.js';

export class TargetSystem {
  constructor(game) {
    this.game = game;
    this.currentTarget = null;
    this.ui = new TargetUI();
  }

  setTarget(target) {
    this.currentTarget = target;
    this.ui.showTarget(target);
  }

  clearTarget() {
    this.currentTarget = null;
    this.ui.hideTarget();
  }

  getCurrentTarget() {
    return this.currentTarget;
  }
}