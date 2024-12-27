import * as THREE from 'three';
import { BaseEffect } from './BaseEffect.js';

export class LightningEffect extends BaseEffect {
  createEffect(position) {
    const segments = 8;
    const height = 15;
    const points = [];
    
    for (let i = 0; i <= segments; i++) {
      points.push(new THREE.Vector3(
        position.x + (Math.random() - 0.5) * (i === 0 || i === segments ? 0 : 1),
        height - (height / segments) * i,
        position.z + (Math.random() - 0.5) * (i === 0 || i === segments ? 0 : 1)
      ));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: 0xffff00,
      linewidth: 3
    });
    
    const lightning = new THREE.Line(geometry, material);
    this.scene.add(lightning);

    // Create light flash
    const light = new THREE.PointLight(0xffff00, 2, 10);
    light.position.copy(position);
    this.scene.add(light);

    // Animation
    let frame = 0;
    const maxFrames = 10;
    const animate = () => {
      frame++;
      light.intensity = 2 * (1 - frame / maxFrames);

      if (frame < maxFrames) {
        requestAnimationFrame(animate);
      } else {
        this.scene.remove(lightning);
        this.scene.remove(light);
        geometry.dispose();
        material.dispose();
      }
    };

    animate();
    this.createExplosion(position, 0xffff00);
  }
}