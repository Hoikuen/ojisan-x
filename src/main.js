import Phaser from 'phaser';
import { GAME_W, GAME_H, GRAVITY } from './constants.js';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { GameScene } from './scenes/GameScene.js';
import { ResultScene } from './scenes/ResultScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_W,
  height: GAME_H,
  // 高精細イラストを高さ約160pxへ縮小するため、リニア補間で滑らかに（ニアレストだとギザつく）
  pixelArt: false,
  antialias: true,
  roundPixels: true,
  backgroundColor: '#101018',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: GRAVITY }, debug: false },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, TitleScene, GameScene, ResultScene],
};

const game = new Phaser.Game(config);
// デバッグ用に公開（動作確認に使用。リリース時は影響なし）
if (typeof window !== 'undefined') window.__game = game;
