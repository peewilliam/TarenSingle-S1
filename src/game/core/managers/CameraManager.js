import * as THREE from 'three';

export class CameraManager {
  constructor() {
    this.setupCamera();
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 30, 20);
    this.camera.lookAt(0, 0, 0);
  }

  updateCamera(player) {
    if (player && player.mesh) {
      this.camera.position.x = player.mesh.position.x;
      this.camera.position.z = player.mesh.position.z + 20;
      this.camera.lookAt(player.mesh.position);
    }
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}