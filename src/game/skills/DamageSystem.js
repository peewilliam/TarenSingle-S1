import * as THREE from 'three';

export class DamageSystem {
  constructor(world) {
    this.world = world;
  }

  // Verifica colisão com inimigos em uma área circular
  checkAreaDamage(position, radius, damage) {
    const enemies = Array.from(this.world.objects.values())
      .filter(obj => obj.constructor.name === 'Enemy');

    enemies.forEach(enemy => {
      const distance = enemy.mesh.position.distanceTo(position);
      if (distance <= radius) {
        // Aplica dano com falloff baseado na distância
        const falloff = 1 - (distance / radius);
        const finalDamage = Math.round(damage * falloff);
        enemy.takeDamage(finalDamage);
      }
    });
  }

  // Verifica colisão com inimigos em uma linha
  checkLineDamage(start, end, radius, damage) {
    const direction = new THREE.Vector3().subVectors(end, start).normalize();
    const length = start.distanceTo(end);

    const enemies = Array.from(this.world.objects.values())
      .filter(obj => obj.constructor.name === 'Enemy');

    enemies.forEach(enemy => {
      // Calcula a distância do inimigo até a linha do projétil
      const enemyToStart = new THREE.Vector3().subVectors(enemy.mesh.position, start);
      const projection = enemyToStart.dot(direction);
      
      if (projection >= 0 && projection <= length) {
        const closestPoint = start.clone().add(direction.clone().multiplyScalar(projection));
        const distance = enemy.mesh.position.distanceTo(closestPoint);
        
        if (distance <= radius) {
          enemy.takeDamage(damage);
        }
      }
    });
  }
}