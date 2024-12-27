import * as THREE from 'three';

export class Minimap {
  constructor(world, player) {
    this.world = world;
    this.player = player;
    this.size = 200; // Size in pixels
    this.mapScale = 0.5; // Scale factor for the map view
    
    this.setupCanvas();
    this.setupScene();
    this.animate();
  }

  setupCanvas() {
    this.container = document.createElement('div');
    this.container.className = 'minimap';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: ${this.size}px;
      height: ${this.size}px;
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      overflow: hidden;
      z-index: 1000;
    `;

    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    this.renderer.setSize(this.size, this.size);
    this.container.appendChild(this.renderer.domElement);
    document.body.appendChild(this.container);
  }

  setupScene() {
    this.scene = new THREE.Scene();
    
    // Setup orthographic camera for top-down view
    const frustumSize = 100;
    const aspect = 1; // Square minimap
    this.camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    this.camera.position.set(0, 50, 0);
    this.camera.lookAt(0, 0, 0);

    // Add ground plane
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x1a472a,
      side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);

    // Create player marker
    const playerGeometry = new THREE.CircleGeometry(2, 16);
    const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.playerMarker = new THREE.Mesh(playerGeometry, playerMaterial);
    this.playerMarker.position.y = 0.1;
    this.scene.add(this.playerMarker);

    // Initialize collections
    this.enemyMarkers = new Map();
    this.staticMarkers = new Set();

    // Create initial markers
    this.createWorldObjectMarkers();
    this.updateEnemyMarkers();
  }

  createWorldObjectMarkers() {
    // Clear existing static markers
    this.staticMarkers.forEach(marker => {
      this.scene.remove(marker);
      marker.geometry.dispose();
      marker.material.dispose();
    });
    this.staticMarkers.clear();

    // Create tree markers
    this.world.scene.children
      .filter(obj => obj.userData.type === 'tree')
      .forEach(tree => {
        const marker = new THREE.Mesh(
          new THREE.CircleGeometry(1, 16),
          new THREE.MeshBasicMaterial({ color: 0x2d5a27 })
        );
        marker.position.set(tree.position.x, 0.1, tree.position.z);
        this.scene.add(marker);
        this.staticMarkers.add(marker);
      });

    // Create rock markers
    this.world.scene.children
      .filter(obj => obj.userData.type === 'rock')
      .forEach(rock => {
        const marker = new THREE.Mesh(
          new THREE.CircleGeometry(0.8, 16),
          new THREE.MeshBasicMaterial({ color: 0x666666 })
        );
        marker.position.set(rock.position.x, 0.1, rock.position.z);
        this.scene.add(marker);
        this.staticMarkers.add(marker);
      });
  }

  updateEnemyMarkers() {
    // Remove old markers
    this.enemyMarkers.forEach(marker => {
      this.scene.remove(marker);
      marker.geometry.dispose();
      marker.material.dispose();
    });
    this.enemyMarkers.clear();

    // Create new enemy markers
    Array.from(this.world.objects.values())
      .filter(obj => obj.constructor.name === 'Enemy')
      .forEach(enemy => {
        const marker = new THREE.Mesh(
          new THREE.CircleGeometry(1.5, 16),
          new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        marker.position.y = 0.1;
        this.enemyMarkers.set(enemy.id, marker);
        this.scene.add(marker);
      });
  }

  update() {
    if (!this.player?.mesh) return;

    // Update player marker position
    this.playerMarker.position.x = this.player.mesh.position.x;
    this.playerMarker.position.z = this.player.mesh.position.z;

    // Update enemy markers
    this.enemyMarkers.forEach((marker, enemyId) => {
      const enemy = this.world.objects.get(enemyId);
      if (enemy) {
        marker.position.x = enemy.mesh.position.x;
        marker.position.z = enemy.mesh.position.z;
      }
    });

    // Update camera position to follow player
    this.camera.position.x = this.player.mesh.position.x;
    this.camera.position.z = this.player.mesh.position.z;
    this.camera.lookAt(
      this.player.mesh.position.x,
      0,
      this.player.mesh.position.z
    );
  }

  animate() {
    this.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }
}