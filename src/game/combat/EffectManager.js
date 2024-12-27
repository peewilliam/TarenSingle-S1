import * as THREE from 'three';

export class EffectManager {
  constructor(scene) {
    this.scene = scene;
  }

  createFireball(start, end, collisionCallback) {
    const geometry = new THREE.SphereGeometry(0.3, 8, 8);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xff4400,
      emissive: 0xff4400,
      emissiveIntensity: 2
    });
    
    const projectile = new THREE.Mesh(geometry, material);
    projectile.position.copy(start);
    this.scene.add(projectile);

    const direction = new THREE.Vector3()
      .subVectors(end, start)
      .normalize();
    
    const speed = 0.8; // Increased projectile speed
    const maxDistance = start.distanceTo(end);
    let distanceTraveled = 0;
    let shouldExplode = false;
    
    const animate = () => {
      // Move projectile
      const movement = direction.clone().multiplyScalar(speed);
      projectile.position.add(movement);
      
      // Create particle trail
      this.createParticles(
        projectile.position,
        0xff4400,
        3,
        { scale: 0.15, lifetime: 300 }
      );
      
      // Update distance traveled
      distanceTraveled += speed;
      
      // Check for collisions
      if (collisionCallback(projectile.position)) {
        shouldExplode = true;
      }
      
      // Check if projectile should be destroyed
      if (shouldExplode || distanceTraveled >= maxDistance) {
        this.createExplosion(projectile.position);
        this.scene.remove(projectile);
        material.dispose();
        geometry.dispose();
        return;
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  createExplosion(position) {
    // Create particle explosion
    this.createParticles(
      position,
      0xff4400,
      30,
      { scale: 0.2, lifetime: 800, spread: 1.5 }
    );

    // Create light flash
    const light = new THREE.PointLight(0xff4400, 2, 10);
    light.position.copy(position);
    this.scene.add(light);

    // Fade out light
    const startTime = Date.now();
    const duration = 500;

    const animateLight = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        this.scene.remove(light);
        return;
      }

      light.intensity = 2 * (1 - elapsed / duration);
      requestAnimationFrame(animateLight);
    };

    animateLight();
  }

  createParticles(position, color, count, options = {}) {
    const {
      scale = 0.2,
      lifetime = 1000,
      spread = 0.5
    } = options;

    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
      color,
      size: scale,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    
    const positions = [];
    const velocities = [];
    
    for (let i = 0; i < count; i++) {
      positions.push(
        position.x + (Math.random() - 0.5) * spread,
        position.y + (Math.random() - 0.5) * spread,
        position.z + (Math.random() - 0.5) * spread
      );
      
      velocities.push(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      );
    }
    
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    
    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);

    // Animate particles
    const startTime = Date.now();
    
    const animateParticles = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= lifetime) {
        this.scene.remove(particles);
        geometry.dispose();
        material.dispose();
        return;
      }

      const positions = geometry.attributes.position.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];
      }
      
      geometry.attributes.position.needsUpdate = true;
      material.opacity = 1 - (elapsed / lifetime);
      
      requestAnimationFrame(animateParticles);
    };
    
    animateParticles();
    return particles;
  }

  // Other methods remain the same...
}