import { GAME_W, GAME_H } from '../constants.js';

// 画面オンスクリーン操作ボタン。scene.touch に仮想入力状態を書き込む。
// keyboardと併用（Player側で両方を見る）。デスクトップではクリックでも動く。
export class TouchControls {
  constructor(scene) {
    this.scene = scene;
    // 仮想入力状態（Player.updateが参照）
    scene.touch = {
      left: false, right: false, down: false,
      jumpQueued: false, attackQueued: false, attackKick: false,
    };
    this.t = scene.touch;

    // 同時タッチを許可（移動＋ジャンプ＋攻撃を同時に）
    scene.input.addPointer(3);

    const R = 52;          // 大きめに（スマホ実寸で直径68px相当）
    const y1 = GAME_H - 65;  // 下段
    const y2 = GAME_H - 168; // 上段（ジャンプ）
    // 左側：移動
    this._held('←', 65, y1, R, 'left');
    this._held('→', 182, y1, R, 'right');
    this._held('↓', 123, y2, R, 'down');
    // 右側：パンチ・キック(下段)、JUMP(上段・中央)
    this._attack('パンチ', GAME_W - 182, y1, R, false);
    this._attack('キック', GAME_W - 65, y1, R, true);
    this._jump('JUMP', GAME_W - 123, y2, R);
  }

  _circle(label, x, y, r) {
    const c = this.scene.add.circle(x, y, r, 0xffffff, 0.18)
      .setScrollFactor(0).setDepth(2000).setStrokeStyle(2, 0xffffff, 0.5)
      .setInteractive({ useHandCursor: true });
    this.scene.add.text(x, y, label, {
      fontFamily: 'sans-serif', fontSize: label.length > 2 ? '13px' : '22px',
      color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(2001);
    return c;
  }

  _held(label, x, y, r, key) {
    const c = this._circle(label, x, y, r);
    c.on('pointerdown', () => { this.t[key] = true; });
    c.on('pointerup', () => { this.t[key] = false; });
    c.on('pointerout', () => { this.t[key] = false; });
  }

  _jump(label, x, y, r) {
    const c = this._circle(label, x, y, r);
    c.on('pointerdown', () => { this.t.jumpQueued = true; });
  }

  _attack(label, x, y, r, isKick) {
    const c = this._circle(label, x, y, r);
    c.on('pointerdown', () => { this.t.attackQueued = true; this.t.attackKick = isKick; });
  }
}
