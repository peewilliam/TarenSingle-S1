import * as THREE from 'three';

export class WorldObjects {
  constructor(scene) {
    this.scene = scene;
    this.createTrees();
    this.createRocks();
  }

  createTrees() {
    const treeGeometry = new THREE.CylinderGeometry(0, 1.5, 4, 6);
    const treeTrunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
    const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5a27 });
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a2f1b });

    for (let i = 0; i < 30; i++) {
      const tree = new THREE.Group();
      tree.userData.type = 'tree'; // Add type for minimap identification

      const trunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);
      trunk.position.y = 1;
      tree.add(trunk);

      const leaves = new THREE.Mesh(treeGeometry, treeMaterial);
      leaves.position.y = 3;
      tree.add(leaves);

      tree.position.x = (Math.random() - 0.5) * 90;
      tree.position.z = (Math.random() - 0.5) * 90;
      tree.castShadow = true;
      tree.receiveShadow = true;

      this.scene.add(tree);
    }
  }

  createRocks() {
    const rockGeometry = new THREE.DodecahedronGeometry(1);
    const rockMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x666666,
      roughness: 0.8 
    });

    for (let i = 0; i < 20; i++) {
      const rock = new THREE.Mesh(rockGeometry, rockMaterial);
      rock.userData.type = 'rock'; // Add type for minimap identification
      rock.position.x = (Math.random() - 0.5) * 90;
      rock.position.z = (Math.random() - 0.5) * 90;
      rock.position.y = 0.5;
      rock.rotation.y = Math.random() * Math.PI;
      rock.scale.set(
        0.5 + Math.random() * 1,
        0.5 + Math.random() * 1,
        0.5 + Math.random() * 1
      );
      rock.castShadow = true;
      rock.receiveShadow = true;
      this.scene.add(rock);
    }
  }
}