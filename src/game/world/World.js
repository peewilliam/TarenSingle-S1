import * as THREE from 'three';
import { Enemy } from '../entities/Enemy.js';
import { WorldObjects } from './WorldObjects.js';
import { WorldLighting } from './WorldLighting.js';

export class World {
  constructor() {
    this.scene = new THREE.Scene();
    this.objects = new Map();
    this.uiManager = null; // Will be set by GameEngine
    
    // Initialize world components
    this.lighting = new WorldLighting(this.scene);
    this.createGround();
    this.worldObjects = new WorldObjects(this.scene);
  }

  createGround() {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x3a8c3a,
      roughness: 0.8
    });
    this.ground = new THREE.Mesh(geometry, material);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
  }

  setCamera(camera) {
    this.camera = camera;
  }

  addObject(object) {
    this.objects.set(object.id, object);
    this.scene.add(object.mesh);
  }

  removeObject(id) {
    const object = this.objects.get(id);
    if (object) {
      this.scene.remove(object.mesh);
      this.objects.delete(id);
    }
  }

  spawnEnemies() {
    for (let i = 0; i < 5; i++) {
      const x = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      const enemy = new Enemy(`enemy${i}`, { x, y: 0, z }, this);
      this.addObject(enemy);
    }
  }

  update(deltaTime) {
    this.objects.forEach(object => object.update(deltaTime));
  }
}