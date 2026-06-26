import Phaser from 'phaser';
import { IMAGES } from '../data/assets.js';
import { GAME_W, GAME_H } from '../constants.js';

export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload() {
    const bar = this.add.graphics();
    const label = this.add.text(GAME_W / 2, GAME_H / 2 - 30, 'LOADING...', {
      fontFamily: 'monospace', fontSize: '18px', color: '#ffffff',
    }).setOrigin(0.5);
    this.load.on('progress', (v) => {
      bar.clear().fillStyle(0xffffff, 1).fillRect(GAME_W / 2 - 150, GAME_H / 2, 300 * v, 16);
    });
    this.load.on('complete', () => { bar.destroy(); label.destroy(); });

    // ASSETSキーを全てロード（プリロード漏れ防止・PHASER3 #4）
    for (const [key, path] of Object.entries(IMAGES)) {
      this.load.image(key, path);
    }
    // 音はAUDIO_PLAN手配後にここへ追加（this.load.audio(...)）
  }

  create() { this.scene.start('TitleScene'); }
}
