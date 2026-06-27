import { GAME_W, PLAYER } from '../constants.js';

// HUDは原則コード描画（画像不要・ASSET_LIST §4.6）。
export class UiManager {
  constructor(scene) {
    this.scene = scene;
    this.g = scene.add.graphics().setScrollFactor(0).setDepth(1000);
    const ts = { fontFamily: 'monospace', fontStyle: 'bold', color: '#ffffff' };
    this.scoreText = scene.add.text(GAME_W / 2, 10, '', { ...ts, fontSize: '18px' })
      .setOrigin(0.5, 0).setScrollFactor(0).setDepth(1001);
    this.timeText = scene.add.text(GAME_W - 150, 10, '', { ...ts, fontSize: '18px' })
      .setScrollFactor(0).setDepth(1001);
    this.floorText = scene.add.text(GAME_W - 60, 10, '', { ...ts, fontSize: '18px', color: '#7fd4ff' })
      .setScrollFactor(0).setDepth(1001);
    this.livesText = scene.add.text(12, 36, '', { ...ts, fontSize: '16px' })
      .setScrollFactor(0).setDepth(1001);
    this.bossName = scene.add.text(GAME_W / 2, 40, '', { ...ts, fontSize: '14px', color: '#ff8888' })
      .setOrigin(0.5, 0).setScrollFactor(0).setDepth(1001).setVisible(false);
    this.center = scene.add.text(GAME_W / 2, 260, '', { ...ts, fontSize: '40px', align: 'center' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(1002).setVisible(false);
    this.grabPrompt = scene.add.text(GAME_W / 2, 200, 'つかまれた！ パンチ／キック連打で脱出！', {
      ...ts, fontSize: '22px', color: '#ffea4d', backgroundColor: '#000000aa', padding: { x: 8, y: 4 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1002).setVisible(false);
    this.bossHpRatio = -1;
  }

  update(s) {
    const g = this.g;
    g.clear();
    // プレイヤー体力バー
    const hpW = 240, hpH = 16, x = 12, y = 12;
    g.fillStyle(0x000000, 0.5).fillRect(x - 2, y - 2, hpW + 4, hpH + 4);
    g.fillStyle(0x442222, 1).fillRect(x, y, hpW, hpH);
    const hpRatio = Math.max(0, s.hp / PLAYER.maxHp);
    const lowHp = hpRatio < 0.25;
    g.fillStyle(lowHp ? 0xff5555 : 0xff3344, 1).fillRect(x, y, hpW * hpRatio, hpH);
    g.lineStyle(2, 0xffffff, 0.8).strokeRect(x, y, hpW, hpH);

    // ボス体力バー
    if (this.bossHpRatio >= 0) {
      const bw = 320, bh = 14, bx = GAME_W / 2 - bw / 2, by = 58;
      g.fillStyle(0x000000, 0.5).fillRect(bx - 2, by - 2, bw + 4, bh + 4);
      g.fillStyle(0x442222, 1).fillRect(bx, by, bw, bh);
      g.fillStyle(0xff3344, 1).fillRect(bx, by, bw * this.bossHpRatio, bh);
      g.lineStyle(2, 0xffffff, 0.8).strokeRect(bx, by, bw, bh);
    }

    this.scoreText.setText(`SCORE ${String(s.score).padStart(6, '0')}`);
    const t = Math.ceil(s.time);
    this.timeText.setText(`TIME ${String(Math.max(0, t)).padStart(3, '0')}`)
      .setColor(t <= 10 ? '#ff5555' : '#ffffff');
    this.floorText.setText(s.floorLabelShort);
    this.livesText.setText(`残機 x${s.lives}`);
  }

  setGrabPrompt(show) { this.grabPrompt.setVisible(show); }

  showBoss(name) { this.bossName.setText(name).setVisible(true); this.bossHpRatio = 1; }
  setBossHp(ratio) { this.bossHpRatio = Math.max(0, ratio); }
  hideBoss() { this.bossName.setVisible(false); this.bossHpRatio = -1; }

  showCenter(text, ms) {
    this.center.setText(text).setVisible(true).setAlpha(1);
    if (ms) {
      this.scene.tweens.add({ targets: this.center, alpha: 0, delay: ms, duration: 300,
        onComplete: () => this.center.setVisible(false) });
    }
  }
  hideCenter() { this.center.setVisible(false); }
}
