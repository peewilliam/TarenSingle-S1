import * as THREE from 'three';
import { BaseEffect } from './BaseEffect.js';

export class FrostNovaEffect extends BaseEffect {
  createEffect(position) {
    const radius = 5;
    const segments = 32;
    const rings = 3;

    for (let i = 0; i < rings; i++) {
      const geometry = new THREE.RingGeometry(radius * i/rings, radius * (i+1)/rings, segments);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      });

      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = -Math.PI / 2;
      ring.position.copy(position);
      this.scene.add(ring);

      let scale = 0;
      const animate = () => {
        scale += 0.05;
        ring.scale.set(scale, scale, 1);
        material.opacity = Math.max(0, 0.5 - scale * 0.1);

        if (material.opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          this.scene.remove(ring);
          geometry.dispose();
          material.dispose();
        }
      };

      setTimeout(() => animate(), i * 100);
    }

    this.createExplosion(position, 0x00ffff);
  }
}