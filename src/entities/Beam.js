import Phaser from 'phaser';
import { POWERUP } from '../constants.js';
import { scaleToHeight } from '../helpers.js';

// ハゲ化中に撃つプレイヤーの飛び道具。前方へ直進し、敵/ボスにダメージ。
export class Beam extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, dir) {
    super(scene, x, y, 'beam');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    scaleToHeight(this, POWERUP.beam.displayHeight);
    this.setVelocityX(POWERUP.beam.speed * dir);
    this.setFlipX(dir < 0);
    this.damage = POWERUP.beam.damage;
    this.hitSet = new Set(); // 同じ対象を多重ヒットさせない（貫通中）
    this.setDepth(50);
  }

  // groupの runChildUpdate から呼ばれる。画面外で消滅（オブジェクトリーク防止）。
  update() {
    const b = this.scene.physics.world.bounds;
    if (this.x < b.x - 60 || this.x > b.x + b.width + 60) {
      this.destroy();
    }
  }
}
