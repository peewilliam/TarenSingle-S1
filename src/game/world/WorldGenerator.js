import * as THREE from 'three';

export class WorldGenerator {
  constructor(scene) {
    this.scene = scene;
  }

  generateTerrain() {
    const geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 0x3a8c3a,
      roughness: 0.8,
      metalness: 0.2,
      vertexColors: true
    });

    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;
    
    return terrain;
  }
}