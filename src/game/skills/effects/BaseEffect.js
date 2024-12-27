import * as THREE from 'three';

export class BaseEffect {
  constructor(scene) {
    this.scene = scene;
  }

  createTrail(position, color) {
    const particleCount = 5;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = position.x + (Math.random() - 0.5) * 0.2;
      positions[i3 + 1] = position.y + (Math.random() - 0.5) * 0.2;
      positions[i3 + 2] = position.z + (Math.random() - 0.5) * 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color,
      size: 0.1,
      transparent: true,
      opacity: 0.8
    });

    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);

    setTimeout(() => {
      this.scene.remove(particles);
      geometry.dispose();
      material.dispose();
    }, 200);
  }

  createExplosion(position, color) {
    const particleCount = 20;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = position.x;
      positions[i3 + 1] = position.y;
      positions[i3 + 2] = position.z;

      velocities.push(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2
      );
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color,
      size: 0.2,
      transparent: true,
      opacity: 1
    });

    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);

    let frame = 0;
    const maxFrames = 30;

    const animateExplosion = () => {
      frame++;
      const positions = geometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];
      }

      geometry.attributes.position.needsUpdate = true;
      material.opacity = 1 - (frame / maxFrames);

      if (frame < maxFrames) {
        requestAnimationFrame(animateExplosion);
      } else {
        this.scene.remove(particles);
        geometry.dispose();
        material.dispose();
      }
    };

    animateExplosion();
  }
}