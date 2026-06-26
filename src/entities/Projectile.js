import Phaser from 'phaser';
import { ENEMY } from '../constants.js';

// 敵の飛び道具。level: 'high' | 'low' を持つ。
export class Projectile extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, texKey, dir, level) {
    super(scene, x, y, texKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.setVelocityX(ENEMY.projectileSpeed * dir);
    this.level = level; // high/low
    this.damage = ENEMY.card.projDamage;
    this.setFlipX(dir < 0);
  }

  // groupの runChildUpdate から update() が呼ばれる（ImageはpreUpdateが自動で回らないため）。
  update() {
    const b = this.scene.physics.world.bounds;
    if (this.x < b.x - 50 || this.x > b.x + b.width + 50) {
      this.destroy();
    }
  }
}
