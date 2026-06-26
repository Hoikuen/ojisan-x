import Phaser from 'phaser';
import { BOSS, FEEL } from '../constants.js';
import { swapTexture, scaleToHeight, setBodyRatio } from '../helpers.js';

const TEX = {
  umbrella: { idle: 'umbrellaIdle', thrust: 'umbrellaThrust', sweep: 'umbrellaSweep',
              hurt: 'umbrellaHurt', dead: 'umbrellaDeath' },
};

// F1ボス：傘おじさん。attack1=thrust(high) / attack2=sweep(low)。
export class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    const cfg = BOSS[type];
    super(scene, x, y, TEX[type].idle);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.type = type;
    this.cfg = cfg;
    this.dh = cfg.displayHeight;
    this.maxHp = cfg.hp;
    this.hp = cfg.hp;
    this.state = 'intro';
    this.dead = false;
    this.nextActAt = 0;
    this.busyUntil = 0;
    this.lastHitAt = 0;
    this.invincible = true;
    this.facing = -1; // プレイヤーは左から来るので初期は左向き

    scaleToHeight(this, this.dh);
    setBodyRatio(this, BOSS.bodyRatioW, BOSS.bodyRatioH, true);
    this.setCollideWorldBounds(true);

    // 攻撃判定（GameSceneがoverlap登録）
    this.attackBox = scene.add.zone(x, y, 10, 10);
    scene.physics.add.existing(this.attackBox);
    this.attackBox.body.setAllowGravity(false);
    this.attackBox.body.enable = false;
    this.attackBox.damage = 0;
    this.attackBox.level = 'high';

    // 登場：少し待ってから戦闘開始
    scene.time.delayedCall(800, () => { this.invincible = false; this._setState('idle'); });
  }

  _setState(s) { this.state = s; this._tex(s); }
  _tex(stateKey) {
    const map = { intro: 'idle', idle: 'idle', move: 'idle', thrust: 'thrust', sweep: 'sweep',
                  hurt: 'hurt', dead: 'dead' };
    swapTexture(this, TEX[this.type][map[stateKey] || 'idle'], this.dh, BOSS.bodyRatioW, BOSS.bodyRatioH);
  }

  update(dt) {
    if (this.dead || this.state === 'intro') { this.setVelocityX(0); this._syncAttackBox(false); return; }
    const p = this.scene.player;
    if (!p || p.dead) { this.setVelocityX(0); this._syncAttackBox(false); return; }
    const now = this.scene.time.now;
    const dx = p.x - this.x;
    const dir = dx < 0 ? -1 : 1;
    this.facing = dir;
    this.setFlipX(dir < 0);

    // 攻撃判定が有効な間は本体に追従させる
    if (this.attackBox.body.enable) {
      const w = this._abW || 10;
      const x = this.x + this.facing * (this.body.width / 2 + w / 2);
      const y = this.y + (this._abYOff || 0);
      this.attackBox.setPosition(x, y);
      this.attackBox.body.reset(x, y);
    }

    if (now < this.busyUntil) { return; } // 攻撃モーション中（attackBoxはdelayedで制御）

    if (this.state === 'hurt') this._setState('idle');

    // 間合い調整 or 攻撃抽選
    const dist = Math.abs(dx);
    if (now >= this.nextActAt) {
      this._chooseAttack(now, dir, dist);
    } else if (dist > this.cfg.thrust.reach) {
      this.setVelocityX(this.cfg.speed * dir);
      if (this.state !== 'move') this._setState('move');
    } else {
      this.setVelocityX(0);
      if (this.state !== 'idle') this._setState('idle');
    }
    this._syncAttackBox(false);
  }

  _chooseAttack(now, dir, dist) {
    this.setVelocityX(0);
    const useThrust = Math.random() < this.cfg.thrust.weight;
    const a = useThrust ? this.cfg.thrust : this.cfg.sweep;
    const stateName = useThrust ? 'thrust' : 'sweep';
    this._setState(stateName);
    this.busyUntil = now + a.windupMs + a.recoverMs;
    this.nextActAt = now + a.windupMs + a.recoverMs + this.cfg.idleCdMs;

    // 前隙後に判定を出す（被弾でキャンセルできるようイベントを保持）
    this._windupEvent = this.scene.time.delayedCall(a.windupMs, () => {
      this._windupEvent = null;
      if (this.dead || this.state === 'hurt') return; // 前隙中に被弾したら攻撃中断
      this.attackBox.damage = a.damage;
      this.attackBox.level = a.level;
      const w = a.reach, h = a.level === 'low' ? 40 : 60;
      this.attackBox.body.setSize(w, h);
      const yOff = a.level === 'low' ? this.displayHeight * 0.25 : -this.displayHeight * 0.1;
      this._abW = w; this._abYOff = yOff; // updateで追従させるため保持
      const x = this.x + this.facing * (this.body.width / 2 + w / 2);
      const y = this.y + yOff;
      this.attackBox.setPosition(x, y);
      this.attackBox.body.reset(x, y);
      this.attackBox.body.enable = true;
      // 判定は短時間だけ
      this.scene.time.delayedCall(150, () => { this.attackBox.body.enable = false; });
    });
  }

  _syncAttackBox(active) {
    if (!active) return;
  }

  takeDamage(amount, fromX) {
    if (this.dead || this.invincible) return;
    const now = this.scene.time.now;
    if (now - this.lastHitAt < BOSS.hitInvincibleMs) return;
    this.lastHitAt = now;
    this.hp -= amount;
    const dir = this.x < fromX ? -1 : 1;
    this.setVelocityX(FEEL.knockBossX * dir);
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(80, () => { if (!this.dead) this.clearTint(); });
    // 前隙中の被弾なら保留中の攻撃発生をキャンセル
    if (this._windupEvent) { this._windupEvent.remove(false); this._windupEvent = null; }
    this.attackBox.body.enable = false;
    if (this.hp <= 0) this.die(dir);
    else { this._setState('hurt'); this.busyUntil = now + 200; }
  }

  die(dir) {
    this.dead = true;
    this.attackBox.body.enable = false;
    this._setState('dead');
    this.setVelocityX(0);
    this.scene.cameras.main.shake(FEEL.shakeBossDeathMs, FEEL.shakeBossDeath);
    if (this.scene.onBossDefeated) this.scene.time.delayedCall(600, () => this.scene.onBossDefeated());
  }
}
