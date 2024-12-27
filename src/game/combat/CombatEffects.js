import * as THREE from 'three';

export class CombatEffects {
  constructor(scene) {
    this.scene = scene;
  }

  showDamageNumber(position, amount, isCritical = false) {
    const color = isCritical ? 0xff0000 : 0xffffff;
    const size = isCritical ? 24 : 20;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 64;
    
    ctx.font = `bold ${size}px Arial`;
    ctx.fillStyle = `#${color.toString(16)}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(amount.toString(), canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });
    
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.position.y += 2;
    
    this.scene.add(sprite);
    
    // Animate the damage number
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > 1000) {
        this.scene.remove(sprite);
        material.dispose();
        texture.dispose();
        return;
      }
      
      sprite.position.y += 0.01;
      material.opacity = 1 - (elapsed / 1000);
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
}