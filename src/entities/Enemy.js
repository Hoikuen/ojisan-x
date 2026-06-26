import Phaser from 'phaser';
import { ENEMY, FEEL, GRAB } from '../constants.js';
import { Projectile } from './Projectile.js';
import { swapTexture, scaleToHeight, setBodyRatio } from '../helpers.js';

const TEX = {
  hug:  { idle: 'hugIdle', walk: 'hugWalk', grab: 'hugGrab', hurt: 'hugHurt', dead: 'hugDeath' },
  card: { idle: 'cardIdle', walk: 'cardWalk', throwHigh: 'cardThrowHigh', throwLow: 'cardThrowLow',
          hurt: 'cardHurt', dead: 'cardDeath' },
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
    swapTexture(this, TEX[this.type][stateKey], this.dh, ENEMY.bodyRatioW, ENEMY.bodyRatioH);
  }

  update(dt) {
    if (this.dead) return;
    const p = this.scene.player;
    if (!p || p.dead) { this.setVelocityX(0); return; }
    const now = this.scene.time.now;
    const dx = p.x - this.x;
    const dist = Math.abs(dx);
    const dir = dx < 0 ? -1 : 1;
    this.setFlipX(dir < 0);

    if (now < this.recoverUntil) { this.setVelocityX(0); return; }
    if (this.type === 'hug') this._updateHug(now, dist, dir, p);
    else this._updateCard(now, dist, dir, p);
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

  _updateCard(now, dist, dir, p) {
    const c = this.cfg;
    if (dist < c.tooClose) {
      // 近すぎ→後退
      this.setVelocityX(-c.speed * dir);
      if (this.state !== 'walk') { this.state = 'walk'; this._tex('walk'); }
      return;
    }
    if (dist >= c.throwMin && dist <= c.throwMax && now >= this.nextActAt) {
      // 投げ
      this.setVelocityX(0);
      const high = Math.random() < c.highRatio;
      this.state = 'throw'; this._tex(high ? 'throwHigh' : 'throwLow');
      this.scene.time.delayedCall(c.windupMs, () => {
        if (this.dead) return;
        const py = high ? this.y - 30 : this.y + 20;
        const proj = new Projectile(this.scene, this.x + dir * 30, py, 'projCard', dir, high ? 'high' : 'low');
        this.scene.projectiles.add(proj);
      });
      this.nextActAt = now + c.throwCdMs;
      this.recoverUntil = now + c.windupMs + c.recoverMs;
      return;
    }
    // 間合い調整（ゆっくり）
    this.setVelocityX(0);
    if (this.state !== 'idle') { this.state = 'idle'; this._tex('idle'); }
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
