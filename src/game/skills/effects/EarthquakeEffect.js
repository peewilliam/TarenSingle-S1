import * as THREE from 'three';
import { BaseEffect } from './BaseEffect.js';

export class EarthquakeEffect extends BaseEffect {
  createEffect(position) {
    const waves = 3;
    const duration = 1000;

    for (let i = 0; i < waves; i++) {
      setTimeout(() => {
        this.createWave(position, i);
      }, i * (duration / waves));
    }
  }

  createWave(position, wave) {
    const geometry = new THREE.RingGeometry(0, 8, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x8b4513,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });

    const ring = new THREE.Mesh(geometry, material);
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(position);
    this.scene.add(ring);

    // Create ground debris
    this.createDebris(position);

    let scale = 0;
    const animate = () => {
      scale += 0.1;
      ring.scale.set(scale, scale, 1);
      material.opacity = Math.max(0, 0.6 - scale * 0.1);

      if (material.opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        this.scene.remove(ring);
        geometry.dispose();
        material.dispose();
      }
    };

    animate();
  }

  createDebris(position) {
    const particleCount = 20;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const radius = Math.random() * 5;
      const i3 = i * 3;

      positions[i3] = position.x + Math.cos(angle) * radius;
      positions[i3 + 1] = position.y;
      positions[i3 + 2] = position.z + Math.sin(angle) * radius;

      velocities.push(
        0,
        Math.random() * 0.2,
        0
      );
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x8b4513,
      size: 0.2,
      transparent: true,
      opacity: 1
    });

    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);

    let frame = 0;
    const maxFrames = 30;

    const animateDebris = () => {
      frame++;
      const positions = geometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += velocities[i * 3 + 1];
        velocities[i * 3 + 1] -= 0.01; // Gravity
      }

      geometry.attributes.position.needsUpdate = true;
      material.opacity = 1 - (frame / maxFrames);

      if (frame < maxFrames) {
        requestAnimationFrame(animateDebris);
      } else {
        this.scene.remove(particles);
        geometry.dispose();
        material.dispose();
      }
    };

    animateDebris();
  }
}