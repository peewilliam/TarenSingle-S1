// Previous SkillManager.js content remains the same, but update the effect implementations:

initializeSkills() {
  this.registerSkill({
    key: 'Q',
    name: 'Fireball',
    damage: 30,
    cooldown: 5000,
    energyCost: 20,
    color: '#ff4400',
    effect: (target) => {
      if (target) {
        target.takeDamage(30);
        this.world.effectManager.createMagicProjectile(
          this.player.mesh.position,
          target.mesh.position,
          0xff4400
        );
      }
    }
  });

  // Similar updates for other skills with visual effects
  // ... rest of the skills remain the same
}