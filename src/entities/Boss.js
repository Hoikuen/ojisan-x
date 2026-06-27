import Phaser from 'phaser';
import { BOSS, FEEL, GRAB } from '../constants.js';
import { Projectile } from './Projectile.js';
import { swapTexture, scaleToHeight, setBodyRatio } from '../helpers.js';

// 状態(またはattack名)→テクスチャキー
const TEX = {
  umbrella: { idle: 'umbrellaIdle', thrust: 'umbrellaThrust', sweep: 'umbrellaSweep', hurt: 'umbrellaHurt', dead: 'umbrellaDeath' },
  boomerang: { idle: 'boomerangIdle', throw: 'boomerangThrow', hurt: 'boomerangHurt', dead: 'boomerangDeath' },
  muscle: { idle: 'muscleIdle', grab: 'muscleGrab', charge: 'muscleCharge', hurt: 'muscleHurt', dead: 'muscleDeath' },
  fortune: { idle: 'fortuneIdle', cast: 'fortuneCast', hurt: 'fortuneHurt', dead: 'fortuneDeath' },
  buddha: { idle: 'buddhaIdle', attack: 'buddhaAttack', hurt: 'buddhaHurt', dead: 'buddhaDeath' },
  mrx: { idle: 'mrxIdle', cane: 'mrxAttack1', kick: 'mrxAttack2', phase2: 'mrxPhase2', hurt: 'mrxHurt', dead: 'mrxDeath' },
};

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
    this.idleCdMs = cfg.idleCdMs;
    this.attacks = cfg.attacks;
    this.state = 'intro';
    this.dead = false;
    this.nextActAt = 0;
    this.busyUntil = 0;
    this.lastHitAt = 0;
    this.invincible = true;
    this.facing = -1;
    this.charging = false;
    this.grabbing = false;
    this.phase2 = false;

    scaleToHeight(this, this.dh);
    setBodyRatio(this, BOSS.bodyRatioW, BOSS.bodyRatioH, true);
    this.setCollideWorldBounds(true);

    this.attackBox = scene.add.zone(x, y, 10, 10);
    scene.physics.add.existing(this.attackBox);
    this.attackBox.body.setAllowGravity(false);
    this.attackBox.body.enable = false;
    this.attackBox.damage = 0;
    this.attackBox.level = 'high';

    scene.time.delayedCall(BOSS.introMs, () => { if (!this.active) return; this.invincible = false; this._setState('idle'); });
  }

  get displayName() { return this.cfg.name; } // ※Phaserのnameプロパティと衝突するのでdisplayName

  _texFor(stateKey) {
    const t = TEX[this.type];
    if (this.phase2 && (stateKey === 'idle' || stateKey === 'move') && t.phase2) return t.phase2;
    return t[stateKey] || t.idle;
  }
  _setState(s) { this.state = s; swapTexture(this, this._texFor(s), this.dh, BOSS.bodyRatioW, BOSS.bodyRatioH); }

  update(dt) {
    if (this.dead || this.state === 'intro') { this.setVelocityX(0); return; }
    const p = this.scene.player;
    if (!p || p.dead) { this.setVelocityX(0); return; }
    const now = this.scene.time.now;
    const dir = p.x < this.x ? -1 : 1;
    this.facing = dir;
    this.setFlipX(dir < 0);

    // 攻撃判定が有効な間は本体に追従
    if (this.attackBox.body.enable) {
      const w = this._abW || 10;
      const x = this.x + this.facing * (this.body.width / 2 + w / 2);
      const y = this.y + (this._abYOff || 0);
      this.attackBox.setPosition(x, y);
      this.attackBox.body.reset(x, y);
    }

    if (this.grabbing) { this.setVelocity(0, 0); return; } // つかみ中
    if (this.charging) return; // 突進中は速度維持
    if (now < this.busyUntil) return;
    if (this.state === 'hurt') this._setState('idle');

    const dist = Math.abs(p.x - this.x);
    const reach = this._maxReach();
    if (now >= this.nextActAt) {
      this._chooseAttack(now, dir, dist, p);
    } else if (dist > reach) {
      this.setVelocityX(this.cfg.speed * dir);
      if (this.state !== 'move') this._setState('move');
    } else {
      this.setVelocityX(0);
      if (this.state !== 'idle') this._setState('idle');
    }
  }

  _maxReach() {
    // 接近する目安（最大のmelee reach / grab range / 突進は近づきたい）
    let r = 120;
    for (const a of this.attacks) r = Math.max(r, a.reach || a.range || 300);
    return r;
  }

  _chooseAttack(now, dir, dist, p) {
    this.setVelocityX(0);
    const total = this.attacks.reduce((s, a) => s + a.weight, 0);
    let roll = Math.random() * total;
    let a = this.attacks[0];
    for (const cand of this.attacks) { if ((roll -= cand.weight) <= 0) { a = cand; break; } }

    this._setState(a.name);
    this.busyUntil = now + a.windupMs + a.recoverMs;
    this.nextActAt = this.busyUntil + this.idleCdMs;

    if (a.kind === 'melee') {
      this.scene.time.delayedCall(a.windupMs, () => {
        if (!this.active || this.dead || this.state === 'hurt') return;
        const w = a.reach, h = a.h || 50;
        this.attackBox.damage = a.damage; this.attackBox.level = a.level;
        this.attackBox.body.setSize(w, h);
        this._abW = w; this._abYOff = (a.yOff || 0) * this.displayHeight;
        const x = this.x + this.facing * (this.body.width / 2 + w / 2);
        const y = this.y + this._abYOff;
        this.attackBox.setPosition(x, y); this.attackBox.body.reset(x, y);
        this.attackBox.body.enable = true;
        this.scene.time.delayedCall(150, () => { if (this.attackBox && this.attackBox.body) this.attackBox.body.enable = false; });
      });
    } else if (a.kind === 'projectile') {
      this.scene.time.delayedCall(a.windupMs, () => {
        if (!this.active || this.dead || this.state === 'hurt') return;
        const high = a.level === 'any' ? Math.random() < 0.5 : a.level === 'high';
        const py = high ? this.y - 40 : this.y + 20;
        const proj = new Projectile(this.scene, this.x + this.facing * (this.body.width / 2 + 20), py,
          a.proj, this.facing, high ? 'high' : 'low',
          { speed: a.speed, damage: a.damage, returnAfterMs: a.returnAfterMs,
            transformTo: a.transformTo, transformAfterMs: a.transformAfterMs });
        this.scene.projectiles.add(proj);
        this.scene.sfx?.('throw');
      });
    } else if (a.kind === 'charge') {
      this.scene.time.delayedCall(a.windupMs, () => {
        if (!this.active || this.dead || this.state === 'hurt') return;
        this.charging = true;
        this.setVelocityX(a.speed * this.facing);
        this.chargeDamage = a.damage;
        this.scene.time.delayedCall(a.durMs, () => { if (this.active) { this.charging = false; this.setVelocityX(0); } });
      });
    } else if (a.kind === 'grab') {
      this.scene.time.delayedCall(a.windupMs, () => {
        if (!this.active || this.dead || this.state === 'hurt') return;
        if (Math.abs(p.x - this.x) <= a.range && p.startGrab(this)) {
          this.grabbing = true;
        }
      });
    }
  }

  onEscaped() {
    this.grabbing = false;
    this.setVelocityX(-FEEL.escapeKnockback * 0.3 * this.facing);
    this.busyUntil = this.scene.time.now + 400;
    this._setState('idle');
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
    this.scene.time.delayedCall(80, () => { if (this.active && !this.dead) this.clearTint(); });
    // 保留中の攻撃をキャンセル
    if (this._windupEvent) { this._windupEvent = null; }
    this.attackBox.body.enable = false;
    this.charging = false;
    if (this.hp <= 0) { this.die(dir); return; }
    // フェーズ2移行（mrx）
    if (this.cfg.phase2 && !this.phase2 && this.hp <= this.maxHp * BOSS.phase2HpRatio) {
      this.phase2 = true;
      this.idleCdMs = this.cfg.phase2.idleCdMs;
    }
    this._setState('hurt'); this.busyUntil = now + 200;
  }

  die(dir) {
    this.dead = true;
    this.attackBox.body.enable = false;
    this.charging = false; this.grabbing = false;
    this._setState('dead');
    this.setVelocityX(0);
    this.scene.cameras.main.shake(FEEL.shakeBossDeathMs, FEEL.shakeBossDeath);
    if (this.scene.onBossDefeated) this.scene.time.delayedCall(600, () => this.scene.onBossDefeated());
  }
}
