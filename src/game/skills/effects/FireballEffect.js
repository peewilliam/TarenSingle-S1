import * as THREE from 'three';
import { BaseEffect } from './BaseEffect.js';

export class FireballEffect extends BaseEffect {
  createEffect(start, end) {
    const geometry = new THREE.SphereGeometry(0.3);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xff4400,
      emissive: 0xff4400,
      emissiveIntensity: 2
    });
    
    const fireball = new THREE.Mesh(geometry, material);
    fireball.position.copy(start);
    this.scene.add(fireball);

    const direction = new THREE.Vector3()
      .subVectors(end, start)
      .normalize();

    const speed = 0.5;
    const maxDistance = start.distanceTo(end);
    let distanceTraveled = 0;

    const animate = () => {
      fireball.position.add(direction.clone().multiplyScalar(speed));
      distanceTraveled += speed;

      this.createTrail(fireball.position, 0xff4400);

      if (distanceTraveled >= maxDistance) {
        this.createExplosion(fireball.position, 0xff4400);
        this.scene.remove(fireball);
        geometry.dispose();
        material.dispose();
        return;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }
}