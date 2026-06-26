import Phaser from 'phaser';
import { ENEMY } from '../constants.js';

// 敵／ボスの飛び道具。level: 'high' | 'low' を持つ。
// opts: { speed, damage, returnAfterMs(ブーメラン), transformTo+transformAfterMs(変化) }
export class Projectile extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, texKey, dir, level, opts = {}) {
    super(scene, x, y, texKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    const speed = opts.speed || ENEMY.projectileSpeed;
    this.setVelocityX(speed * dir);
    this.level = level;
    this.damage = opts.damage || ENEMY.card.projDamage;
    this.setFlipX(dir < 0);
    const now = scene.time.now;
    this._returnAt = opts.returnAfterMs ? now + opts.returnAfterMs : 0;
    this._transformTo = opts.transformTo;
    this._transformAt = opts.transformAfterMs ? now + opts.transformAfterMs : 0;
  }

  // groupの runChildUpdate から呼ばれる（Imageは自動でpreUpdateが回らないため）。
  update() {
    const now = this.scene.time.now;
    if (this._returnAt && now >= this._returnAt) { // ブーメラン：反転して戻る
      this._returnAt = 0;
      this.setVelocityX(-this.body.velocity.x);
      this.setFlipX(this.body.velocity.x < 0);
    }
    if (this._transformAt && now >= this._transformAt) { // 変化（火の玉→蛇等）
      this._transformAt = 0;
      if (this._transformTo) this.setTexture(this._transformTo);
    }
    const b = this.scene.physics.world.bounds;
    if (this.x < b.x - 60 || this.x > b.x + b.width + 60) this.destroy();
  }
}
