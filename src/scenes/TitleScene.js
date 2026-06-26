import Phaser from 'phaser';
import { GAME_W, GAME_H } from '../constants.js';

export class TitleScene extends Phaser.Scene {
  constructor() { super('TitleScene'); }

  create() {
    this.add.image(GAME_W / 2, GAME_H / 2, 'bgTitle').setDisplaySize(GAME_W, GAME_H);

    this.add.text(GAME_W / 2, 150, 'おじさんX', {
      fontFamily: 'sans-serif', fontStyle: 'bold', fontSize: '64px', color: '#ffffff',
      stroke: '#aa2222', strokeThickness: 8,
    }).setOrigin(0.5);
    this.add.text(GAME_W / 2, 215, '〜退職金奪還〜', {
      fontFamily: 'sans-serif', fontSize: '20px', color: '#ffd24d',
    }).setOrigin(0.5);

    const hi = Number(localStorage.getItem('ojisanx_highscore') || 0);
    this.add.text(GAME_W / 2, 300, `ハイスコア ${String(hi).padStart(6, '0')}`, {
      fontFamily: 'monospace', fontSize: '18px', color: '#ffffff',
    }).setOrigin(0.5);

    const press = this.add.text(GAME_W / 2, 400, 'PUSH SPACE', {
      fontFamily: 'monospace', fontStyle: 'bold', fontSize: '28px', color: '#ffffff',
    }).setOrigin(0.5);
    this.tweens.add({ targets: press, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 });

    this.add.text(GAME_W / 2, 520, '←→ 移動   ↑ ジャンプ   ↓ しゃがみ   Z パンチ   X キック', {
      fontFamily: 'monospace', fontSize: '14px', color: '#cccccc',
    }).setOrigin(0.5);

    const start = () => this.scene.start('GameScene', { floorId: 1, score: 0, lives: undefined });
    this.input.keyboard.once('keydown-SPACE', start);
    this.input.keyboard.once('keydown-ENTER', start);
    this.input.once('pointerdown', start);
  }
}
