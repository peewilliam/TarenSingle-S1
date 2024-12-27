import * as THREE from 'three';

export class RendererManager {
  constructor() {
    this.setupRenderer();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);
  }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}