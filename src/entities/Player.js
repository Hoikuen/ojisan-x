import Phaser from 'phaser';
import { PLAYER, ATTACK, GRAB, POWERUP, FEEL } from '../constants.js';
import { PLAYER_TEX, PLAYER_ANIMS } from '../data/assets.js';
import { swapTexture, scaleToHeight, setBodyRatio } from '../helpers.js';

const H = PLAYER.displayHeight;
const WR = PLAYER.bodyRatioW;
const HR = PLAYER.bodyRatioH;

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'playerIdle');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    scaleToHeight(this, H);
    setBodyRatio(this, WR, HR, true);

    this.hp = PLAYER.maxHp;
    this.facing = 1;
    this.state = 'idle';
    this.stateEnteredAt = 0;
    this.invincibleUntil = 0;
    this.attackEndsAt = 0;
    this.powered = false;
    this.poweredUntil = 0;
    this.beamCdUntil = 0;
    this.grabbedBy = null;
    this.mashCount = 0;
    this.lastDrainAt = 0;
    this.dead = false;

    // 攻撃判定ボックス（GameSceneがoverlap登録）
    this.attackBox = scene.add.zone(x, y, ATTACK.punch.reachX, ATTACK.punch.h);
    scene.physics.add.existing(this.attackBox);
    this.attackBox.body.setAllowGravity(false);
    this.attackBox.body.enable = false;
    this.attackBox.damage = 0;
    this.attackBox.level = 'high';
    this.attackBox.score = 0;
    this.attackBox.hitSet = new Set(); // 1スイングで同じ敵を多重ヒットさせない

    // 入力
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keyZ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.keyX = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  get texSet() { return this.powered ? PLAYER_TEX.bald : PLAYER_TEX.normal; }
  get grounded() { return this.body.blocked.down || this.body.onFloor(); }
  get isLow() { return this.state === 'crouch' || this.state === 'crouchAttack'; } // しゃがみ＝上段回避
  get invincible() { return this.powered || this.scene.time.now < this.invincibleUntil; }

  setPlayerState(next) {
    if (this.state === next) return;
    this.state = next;
    this.stateEnteredAt = this.scene.time.now;
    this.applyVisual();
  }

  applyVisual() {
    // アニメ定義がある状態（歩き等）はアニメ再生。ハゲ化中は専用アニメ無しなので静止画。
    const anim = this.powered ? null : PLAYER_ANIMS[this.state];
    if (anim && this.scene.anims.exists(anim.key)) {
      if (!this.anims.isPlaying || this.anims.currentAnim.key !== anim.key) {
        // 先頭コマでサイズ・足元を確定してからアニメ再生（全コマ同サイズ前提で足元維持）
        swapTexture(this, anim.frames[0], H, WR, HR);
        this.play(anim.key, true);
      }
      this.setFlipX(this.facing < 0);
      return;
    }
    this.anims.stop(); // 静止状態に戻すときはアニメを止める
    const key = this.texSet[this.state] || this.texSet.idle;
    // しゃがみ系は表示高さを縮めて低く見せる（足元は維持される）
    const dh = (this.state === 'crouch' || this.state === 'crouchAttack')
      ? Math.round(H * PLAYER.crouchHeightFactor) : H;
    swapTexture(this, key, dh, WR, HR);
    this.setFlipX(this.facing < 0);
  }

  update(dt) {
    const now = this.scene.time.now;

    // ハゲ化の時間切れ
    if (this.powered && now >= this.poweredUntil) {
      this.powered = false;
      this.clearTint();
      this.applyVisual();
    }
    if (this.powered) {
      const on = Math.floor(now / (1000 / POWERUP.flashHz / 2)) % 2 === 0;
      this.setTint(on ? 0xffffff : 0xffd24d);
    }

    if (this.dead) { this.setVelocityX(0); this._syncAttackBox(false); return; }

    // つかまれ
    if (this.state === 'grabbed') {
      this.setVelocityX(0);
      this._drain(now);
      this._syncAttackBox(false);
      return;
    }

    // のけぞり
    if (this.state === 'hurt') {
      if (now - this.stateEnteredAt >= PLAYER.hurtMs) this.setPlayerState('idle');
      this._syncAttackBox(false);
      return;
    }

    // 仮想入力（タッチ）。無ければ空オブジェクトで安全に。
    const t = this.scene.touch || {};
    const left = this.cursors.left.isDown || !!t.left;
    const right = this.cursors.right.isDown || !!t.right;
    const down = this.cursors.down.isDown || !!t.down;
    // JustDownは読むと消費されるので各キー1回だけ評価する（二重消費でキックが死ぬのを防ぐ）
    const zDown = Phaser.Input.Keyboard.JustDown(this.keyZ);
    const xDown = Phaser.Input.Keyboard.JustDown(this.keyX);
    const spDown = Phaser.Input.Keyboard.JustDown(this.keySpace);
    // タッチの攻撃キュー（1回だけ消費）
    let touchAttack = false, touchKick = false;
    if (t.attackQueued) { touchAttack = true; touchKick = !!t.attackKick; t.attackQueued = false; }
    const attackPressed = zDown || xDown || spDown || touchAttack;
    const isKick = xDown || (touchAttack && touchKick);

    // ジャンプ（キーボード or タッチ）
    let jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
    if (t.jumpQueued) { jumpPressed = true; t.jumpQueued = false; }
    if (jumpPressed && this.grounded && this._canAct()) {
      this.setVelocityY(PLAYER.jumpForce);
    }

    // 攻撃入力（Xまたはキックボタンならキック）
    if (attackPressed) this._tryAttack(down, isKick);

    const attacking = now < this.attackEndsAt;

    // 横移動（攻撃中・しゃがみ中は止める）
    if (!attacking && !(down && this.grounded)) {
      if (left) { this.setVelocityX(-PLAYER.speed); this.facing = -1; }
      else if (right) { this.setVelocityX(PLAYER.speed); this.facing = 1; }
      else this.setVelocityX(0);
    } else {
      this.setVelocityX(0);
    }

    // 状態解決（攻撃中でなければ）
    if (!attacking) {
      if (!this.grounded) {
        this.setPlayerState(this.body.velocity.y < 0 ? 'jump' : 'fall');
      } else if (down) {
        this.setPlayerState('crouch');
      } else if (left || right) {
        this.setPlayerState('walk');
      } else {
        this.setPlayerState('idle');
      }
    }
    this.setFlipX(this.facing < 0);

    this._syncAttackBox(attacking);
  }

  _canAct() {
    return this.state !== 'hurt' && this.state !== 'grabbed' && !this.dead;
  }

  _tryAttack(down, isKick) {
    const now = this.scene.time.now;
    let kind, stateName;
    if (!this.grounded) { kind = 'jump'; stateName = 'jumpAttack'; }
    else if (down) { kind = 'crouch'; stateName = 'crouchAttack'; }
    else { kind = isKick ? 'kick' : 'punch'; stateName = kind; }
    const def = ATTACK[kind];
    this.attackEndsAt = now + PLAYER.attackActiveMs;
    this.attackBox.hitSet.clear();
    this.attackBox.damage = def.damage * (this.powered ? POWERUP.damageMult : 1);
    this.attackBox.level = def.level;
    this.attackBox.score = def.score;
    this._attackDef = def;
    this.setPlayerState(stateName);

    // ハゲ化中はビームを撃つ（遠距離攻撃。近接判定も同時に出る）
    if (this.powered && now >= this.beamCdUntil && this.scene.fireBeam) {
      this.scene.fireBeam(this.x + this.facing * (this.body.width / 2 + 10), this.y - 10, this.facing);
      this.beamCdUntil = now + POWERUP.beam.cooldownMs;
    }
  }

  _syncAttackBox(active) {
    const def = this._attackDef || ATTACK.punch;
    const ab = this.attackBox;
    ab.body.enable = !!active;
    if (!active) return;
    const w = def.reachX, h = def.h;
    ab.body.setSize(w, h);
    const x = this.x + this.facing * (this.body.width / 2 + w / 2);
    const y = this.y + def.yOff;
    ab.setPosition(x, y);
    ab.body.reset(x, y);
  }

  _drain(now) {
    if (this.powered) return; // ハゲ化中は吸われない
    if (now - this.lastDrainAt >= 250) {
      this.lastDrainAt = now;
      this.hp -= GRAB.drainPerSec * 0.25;
      if (this.hp <= 0) this.die();
    }
  }

  // --- 外部から呼ばれる ---
  takeDamage(amount, fromX) {
    if (this.invincible || this.dead || this.state === 'grabbed') return;
    this.hp -= amount;
    const dir = this.x < fromX ? -1 : 1;
    this.setVelocity(FEEL.knockPlayerX * dir, FEEL.knockPlayerY);
    this.invincibleUntil = this.scene.time.now + PLAYER.invincibleMs;
    this.scene.cameras.main.shake(FEEL.shakeHurtMs, FEEL.shakeHurt);
    if (this.hp <= 0) this.die();
    else { this.setPlayerState('hurt'); this._blink(); }
  }

  startGrab(gripper) {
    if (this.invincible || this.dead || this.state === 'grabbed') return false;
    this.grabbedBy = gripper;
    this.mashCount = 0;
    this.lastDrainAt = this.scene.time.now;
    this.setPlayerState('grabbed');
    return true;
  }

  tryMashEscape() {
    if (this.state !== 'grabbed') return;
    this.mashCount++;
    if (this.mashCount >= GRAB.mashToEscape) {
      const g = this.grabbedBy;
      this.grabbedBy = null;
      this.setPlayerState('idle');
      // 脱出直後の無敵＋掴み主と反対方向へノックバック
      // → 隣の2体目に即再キャッチされる無限ループを防ぐ
      this.invincibleUntil = this.scene.time.now + GRAB.escapeIframesMs;
      const dir = (g && this.x < g.x) ? -1 : 1; // 掴み主から離れる向き
      this.setVelocity(GRAB.escapePlayerKnockbackX * dir, GRAB.escapePlayerKnockbackY);
      this._blink();
      if (g && g.onEscaped) g.onEscaped();
    }
  }

  powerUp() {
    this.powered = true;
    this.poweredUntil = this.scene.time.now + POWERUP.durationMs;
    // つかまれ中ならハゲ化で振りほどく（無敵＝つかまれない不変条件を保つ）
    if (this.state === 'grabbed') {
      const g = this.grabbedBy;
      this.grabbedBy = null;
      if (g && g.onEscaped) g.onEscaped();
      this.setPlayerState('idle');
    }
    this.applyVisual();
  }

  die() {
    if (this.dead) return;
    this.dead = true;
    this.hp = 0;
    this.setVelocity(0, 0);
    this.grabbedBy = null;
    this.setPlayerState('dead');
    if (this.scene.onPlayerDead) this.scene.time.delayedCall(700, () => this.scene.onPlayerDead());
  }

  _blink() {
    this.scene.tweens.add({ targets: this, alpha: 0.3, duration: 100, yoyo: true, repeat: 3,
      onComplete: () => this.setAlpha(1) });
  }
}
