import Phaser from 'phaser';
import { ENEMY, FEEL, GRAB } from '../constants.js';
import { Projectile } from './Projectile.js';
import { swapTexture, scaleToHeight, setBodyRatio } from '../helpers.js';

const TEX = {
  hug:  { idle: 'hugIdle', walk: 'hugWalk', grab: 'hugGrab', hurt: 'hugHurt', dead: 'hugDeath' },
  card: { idle: 'cardIdle', walk: 'cardWalk', throwHigh: 'cardThrowHigh', throwLow: 'cardThrowLow',
          hurt: 'cardHurt', dead: 'cardDeath' },
  fruit: { idle: 'fruitIdle', walk: 'fruitWalk', throwHigh: 'fruitThrow', throwLow: 'fruitThrow',
           hurt: 'fruitHurt' }, // deadは無し→hurtにフォールバック
  chibi: { idle: 'chibiIdle', walk: 'chibiIdle', jump: 'chibiJump', hurt: 'chibiHurt', dead: 'chibiDeath' },
  banana: { idle: 'bananaIdle', walk: 'bananaWalk', charge: 'bananaCharge', hurt: 'bananaHurt' }, // deadは無し→hurt
};

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    const cfg = ENEMY[type];
    super(scene, x, y, TEX[type].idle);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.type = type;
    this.cfg = cfg;
    this.dh = cfg.displayHeight;
    this.hp = cfg.hp;
    this.state = 'approach';
    this.dead = false;
    this.nextActAt = 0;
    this.recoverUntil = 0;

    scaleToHeight(this, this.dh);
    setBodyRatio(this, ENEMY.bodyRatioW, ENEMY.bodyRatioH, true);
    this.setCollideWorldBounds(false);
  }

  _tex(stateKey) {
    const t = TEX[this.type];
    const key = t[stateKey] || t.hurt || t.idle; // 未定義(dead等)はhurt/idleにフォールバック
    swapTexture(this, key, this.dh, ENEMY.bodyRatioW, ENEMY.bodyRatioH);
  }

  update(dt) {
    if (this.dead) return;
    const p = this.scene.player;
    if (!p || p.dead) { this.setVelocityX(0); return; }
    const now = this.scene.time.now;
    const dx = p.x - this.x;
    const dist = Math.abs(dx);
    const dir = dx < 0 ? -1 : 1;
    if (this.type !== 'chibi' || this.grounded) this.setFlipX(dir < 0);

    if (now < this.recoverUntil) { if (this.grounded) this.setVelocityX(this.type === 'chibi' ? this.body.velocity.x : 0); return; }
    if (this.type === 'hug') this._updateHug(now, dist, dir, p);
    else if (this.type === 'chibi') this._updateChibi(now, dist, dir, p);
    else if (this.type === 'banana') this._updateBanana(now, dist, dir, p);
    else this._updateRanged(now, dist, dir, p); // card / fruit
  }

  get grounded() { return this.body.blocked.down || this.body.onFloor(); }

  _updateChibi(now, dist, dir, p) {
    const c = this.cfg;
    if (!this.grounded) { if (this.state !== 'jump') { this.state = 'jump'; this._tex('jump'); } return; }
    if (dist > c.jumpRange) {
      this.setVelocityX(c.speed * dir);
      if (this.state !== 'walk') { this.state = 'walk'; this._tex('walk'); }
    } else if (now >= this.nextActAt) {
      // 飛びかかり
      this.setVelocity(c.leapVX * dir, c.leapVY);
      this.state = 'jump'; this._tex('jump');
      this.nextActAt = now + c.leapCdMs;
      this.recoverUntil = now + c.recoverMs; // 着地後の硬直
    } else {
      this.setVelocityX(0);
      if (this.state !== 'idle') { this.state = 'idle'; this._tex('idle'); }
    }
  }

  _updateBanana(now, dist, dir, p) {
    const c = this.cfg;
    if (this.charging) return; // 突進中（速度維持）
    if (dist > c.chargeRange) {
      this.setVelocityX(c.speed * dir);
      if (this.state !== 'walk') { this.state = 'walk'; this._tex('walk'); }
    } else if (now >= this.nextActAt) {
      // 予備動作→突進
      this.setVelocityX(0);
      this.state = 'charge'; this._tex('charge');
      this.scene.time.delayedCall(c.windupMs, () => {
        if (!this.active || this.dead) return; // destroy済み（this.scene消失）でも安全に抜ける
        this.charging = true;
        this.setVelocityX(c.chargeSpeed * dir);
        this.scene.time.delayedCall(500, () => { if (this.active && !this.dead) { this.charging = false; this.setVelocityX(0); } });
      });
      this.nextActAt = now + c.windupMs + 500 + c.recoverMs;
      this.recoverUntil = now + c.windupMs + 500 + c.recoverMs;
    } else {
      this.setVelocityX(0);
      if (this.state !== 'idle') { this.state = 'idle'; this._tex('idle'); }
    }
  }

  _updateRanged(now, dist, dir, p) {
    const c = this.cfg;
    if (dist < c.tooClose) {
      this.setVelocityX(-c.speed * dir);
      if (this.state !== 'walk') { this.state = 'walk'; this._tex('walk'); }
      return;
    }
    if (dist >= c.throwMin && dist <= c.throwMax && now >= this.nextActAt) {
      this.setVelocityX(0);
      const high = Math.random() < c.highRatio;
      this.state = 'throw'; this._tex(high ? 'throwHigh' : 'throwLow');
      this.scene.time.delayedCall(c.windupMs, () => {
        if (!this.active || this.dead) return; // destroy済みなら弾を出さない（this.scene消失対策）
        const py = high ? this.y - 30 : this.y + 20;
        const proj = new Projectile(this.scene, this.x + dir * 30, py, c.proj || 'projCard', dir, high ? 'high' : 'low');
        this.scene.projectiles.add(proj);
        this.scene.sfx?.('throw');
      });
      this.nextActAt = now + c.throwCdMs;
      this.recoverUntil = now + c.windupMs + c.recoverMs;
      return;
    }
    this.setVelocityX(0);
    if (this.state !== 'idle') { this.state = 'idle'; this._tex('idle'); }
  }

  _updateHug(now, dist, dir, p) {
    if (this.grabbing) { // プレイヤーに張り付く
      this.x = p.x - dir * 20;
      this.setVelocity(0, 0);
      return;
    }
    if (dist > this.cfg.grabRange) {
      this.setVelocityX(this.cfg.speed * dir);
      if (this.state !== 'walk') { this.state = 'walk'; this._tex('walk'); }
    } else {
      // つかみ
      this.setVelocityX(0);
      if (p.startGrab(this)) {
        this.grabbing = true;
        this.state = 'grab'; this._tex('grab');
      }
    }
  }

  onEscaped() {
    this.grabbing = false;
    this.setVelocityX(-FEEL.escapeKnockback * (this.scene.player.x < this.x ? -1 : 1));
    this.recoverUntil = this.scene.time.now + GRAB.regrabCooldownMs;
    this.state = 'approach'; this._tex('idle');
  }

  takeDamage(amount, fromX) {
    if (this.dead) return;
    this.hp -= amount;
    this.grabbing = false;
    if (this.scene.player && this.scene.player.grabbedBy === this) {
      this.scene.player.grabbedBy = null;
      if (this.scene.player.state === 'grabbed') this.scene.player.setPlayerState('idle');
    }
    const dir = this.x < fromX ? -1 : 1;
    if (this.hp <= 0) {
      this.die(dir);
    } else {
      this.setVelocity(FEEL.knockEnemyX * dir, FEEL.knockEnemyY);
      this.recoverUntil = this.scene.time.now + 300;
      this.state = 'hurt'; this._tex('hurt');
      this.setTintFill(0xffffff);
      this.scene.time.delayedCall(60, () => { if (!this.dead) this.clearTint(); });
    }
  }

  die(dir) {
    this.dead = true;
    this._tex('dead');
    this.body.checkCollision.none = true;
    this.setVelocity(FEEL.knockDefeatX * dir, FEEL.knockDefeatY);
    this.scene.time.delayedCall(500, () => this.destroy());
    if (this.scene.onEnemyDefeated) this.scene.onEnemyDefeated(this);
  }
}
