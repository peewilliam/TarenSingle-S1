export class EnemyAI {
  constructor(enemy, world) {
    this.enemy = enemy;
    this.world = world;
    this.state = 'idle';
    this.target = null;
    this.patrolPoints = this.generatePatrolPoints();
    this.currentPatrolIndex = 0;
    this.detectionRange = 15;
    this.attackRange = 2;
    this.lastAttackTime = 0;
    this.attackCooldown = 2000;
  }

  generatePatrolPoints() {
    const points = [];
    const radius = 10;
    const centerX = this.enemy.mesh.position.x;
    const centerZ = this.enemy.mesh.position.z;
    
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      points.push({
        x: centerX + Math.cos(angle) * radius,
        z: centerZ + Math.sin(angle) * radius
      });
    }
    return points;
  }

  update() {
    switch (this.state) {
      case 'idle':
        this.updateIdle();
        break;
      case 'patrol':
        this.updatePatrol();
        break;
      case 'chase':
        this.updateChase();
        break;
      case 'attack':
        this.updateAttack();
        break;
    }
  }

  updateIdle() {
    if (this.detectPlayer()) {
      this.state = 'chase';
    } else if (Math.random() < 0.01) {
      this.state = 'patrol';
    }
  }

  updatePatrol() {
    const target = this.patrolPoints[this.currentPatrolIndex];
    const distance = this.getDistance(
      this.enemy.mesh.position,
      { x: target.x, z: target.z }
    );

    if (this.detectPlayer()) {
      this.state = 'chase';
      return;
    }

    if (distance < 0.5) {
      this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
    } else {
      this.moveTowards(target);
    }
  }

  updateChase() {
    if (!this.target || !this.detectPlayer()) {
      this.state = 'idle';
      this.target = null;
      return;
    }

    const distance = this.getDistance(
      this.enemy.mesh.position,
      this.target.mesh.position
    );

    if (distance <= this.attackRange) {
      this.state = 'attack';
    } else {
      this.moveTowards(this.target.mesh.position);
    }
  }

  updateAttack() {
    if (!this.target || !this.detectPlayer()) {
      this.state = 'idle';
      this.target = null;
      return;
    }

    const now = Date.now();
    if (now - this.lastAttackTime >= this.attackCooldown) {
      const distance = this.getDistance(
        this.enemy.mesh.position,
        this.target.mesh.position
      );

      if (distance <= this.attackRange) {
        this.target.takeDamage(this.enemy.damage);
        this.lastAttackTime = now;
      }
    }

    if (this.getDistance(this.enemy.mesh.position, this.target.mesh.position) > this.attackRange) {
      this.state = 'chase';
    }
  }

  detectPlayer() {
    const players = Array.from(this.world.objects.values())
      .filter(obj => obj.constructor.name === 'Player');

    for (const player of players) {
      const distance = this.getDistance(
        this.enemy.mesh.position,
        player.mesh.position
      );

      if (distance <= this.detectionRange) {
        this.target = player;
        return true;
      }
    }
    return false;
  }

  getDistance(pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1.x - pos2.x, 2) + 
      Math.pow(pos1.z - pos2.z, 2)
    );
  }

  moveTowards(target) {
    const dx = target.x - this.enemy.mesh.position.x;
    const dz = target.z - this.enemy.mesh.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance > 0.1) {
      this.enemy.mesh.position.x += (dx / distance) * this.enemy.speed;
      this.enemy.mesh.position.z += (dz / distance) * this.enemy.speed;
      this.enemy.mesh.rotation.y = Math.atan2(dx, dz);
    }
  }
}