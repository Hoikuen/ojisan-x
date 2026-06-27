import Phaser from 'phaser';
import { IMAGES, SOUNDS, PLAYER_ANIMS } from '../data/assets.js';
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
    // 音（SE＋BGM）。合成生成の仮音源
    for (const [key, path] of Object.entries(SOUNDS)) {
      this.load.audio(key, path);
    }
  }

  create() {
    // アニメ生成（normal/baldの2セット）。全コマがロードできているものだけ作る。
    // コマが2枚未満の状態はアニメを作らず、Player側が静止画にフォールバックする。
    for (const set of Object.values(PLAYER_ANIMS)) {
      for (const cfg of Object.values(set)) {
        const frames = cfg.frames.filter((k) => this.textures.exists(k));
        if (frames.length >= 2 && !this.anims.exists(cfg.key)) {
          this.anims.create({
            key: cfg.key,
            frames: frames.map((k) => ({ key: k })),
            frameRate: cfg.frameRate,
            repeat: cfg.repeat,
          });
        }
      }
    }
    this.scene.start('TitleScene');
  }
}
