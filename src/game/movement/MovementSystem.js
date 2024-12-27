import * as THREE from 'three';

export class MovementSystem {
  moveTowards(object, target, speed) {
    const direction = new THREE.Vector3(
      target.x - object.position.x,
      0,
      target.z - object.position.z
    );
    
    if (direction.length() > 0.1) {
      direction.normalize();
      object.position.x += direction.x * speed;
      object.position.z += direction.z * speed;
      object.rotation.y = Math.atan2(direction.x, direction.z);
      return false;
    }
    return true;
  }
}