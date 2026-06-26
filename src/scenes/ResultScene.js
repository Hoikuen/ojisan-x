import Phaser from 'phaser';
import { GAME_W, GAME_H } from '../constants.js';

export class ResultScene extends Phaser.Scene {
  constructor() { super('ResultScene'); }

  init(data) { this.result = data || {}; }

  create() {
    const r = this.result;
    this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0x000000, 0.85);

    const cleared = r.outcome === 'cleared';
    const title = cleared ? '退職金を取り戻した！' : 'GAME OVER';
    this.add.text(GAME_W / 2, 160, title, {
      fontFamily: 'sans-serif', fontStyle: 'bold', fontSize: '44px',
      color: cleared ? '#ffd24d' : '#ff5555',
    }).setOrigin(0.5);

    if (!cleared && r.floorLabel) {
      this.add.text(GAME_W / 2, 230, `到達フロア  ${r.floorLabel}`, {
        fontFamily: 'monospace', fontSize: '20px', color: '#ffffff',
      }).setOrigin(0.5);
    }

    const score = r.score || 0;
    const hi = Number(localStorage.getItem('ojisanx_highscore') || 0);
    const newHi = score > hi;
    if (newHi) localStorage.setItem('ojisanx_highscore', String(score));

    this.add.text(GAME_W / 2, 290, `スコア  ${String(score).padStart(6, '0')}`, {
      fontFamily: 'monospace', fontSize: '24px', color: '#ffffff',
    }).setOrigin(0.5);
    this.add.text(GAME_W / 2, 330, newHi ? 'ハイスコア更新！' : `ハイスコア ${String(Math.max(hi, score)).padStart(6, '0')}`, {
      fontFamily: 'monospace', fontSize: '16px', color: newHi ? '#ffd24d' : '#cccccc',
    }).setOrigin(0.5);

    // ゲームオーバー時のみコンティニュー（フロア頭から残機リセット）
    let prompt;
    if (!cleared && r.floorId) {
      let count = 10;
      prompt = this.add.text(GAME_W / 2, 420, `CONTINUE?  Spaceで継続 (${count})`, {
        fontFamily: 'monospace', fontStyle: 'bold', fontSize: '22px', color: '#ffffff',
      }).setOrigin(0.5);
      const timer = this.time.addEvent({ delay: 1000, repeat: 9, callback: () => {
        count--; prompt.setText(`CONTINUE?  Spaceで継続 (${count})`);
        if (count <= 0) { timer.remove(); this._toTitle(); }
      }});
      this.input.keyboard.once('keydown-SPACE', () => {
        timer.remove();
        this.scene.start('GameScene', { floorId: r.floorId, score: r.score, lives: undefined });
      });
    } else {
      this.add.text(GAME_W / 2, 440, 'PUSH SPACE → タイトル', {
        fontFamily: 'monospace', fontSize: '18px', color: '#ffffff',
      }).setOrigin(0.5);
      this.input.keyboard.once('keydown-SPACE', () => this._toTitle());
    }
  }

  _toTitle() { this.scene.start('TitleScene'); }
}
