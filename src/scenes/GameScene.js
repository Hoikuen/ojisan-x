import Phaser from 'phaser';
import {
  GAME_W, GAME_H, GRAVITY, FLOOR_Y, PLAYER, ENEMY, BOSS, SCORE, LIVES, FEEL, CAMERA,
} from '../constants.js';
import { getFloor } from '../data/floors.js';
import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { Boss } from '../entities/Boss.js';
import { Beam } from '../entities/Beam.js';
import { UiManager } from '../systems/ui.js';
import { TouchControls } from '../systems/touch.js';

const BOSS_ROOM_W = 800;

export class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  init(data) {
    this.floorId = data.floorId || 1;
    this.startScore = data.score || 0;
    this.lives = data.lives === undefined ? LIVES.start : data.lives;
  }

  create() {
    const floor = getFloor(this.floorId);
    this.floor = floor;
    this.worldW = floor.worldWidth;
    this.score = this.startScore;
    this.timeLeft = floor.timeLimit;
    this.mode = 'playing';
    this.ending = false;
    this.wavesSpawned = new Set();
    this.boss = null;

    this.physics.world.setBounds(0, 0, this.worldW, GAME_H);
    this.physics.world.gravity.y = GRAVITY;

    // 背景（ワールド幅にタイル）。画像は1536x864だが画面は600px高。
    // デフォルトだと上600pxだけ表示され、画像下部の「地面帯」が画面外に切れて
    // 主人公/敵が浮いて(埋まって)見える。tilePositionYで画像下端=地面を画面下端に合わせる。
    const bg = this.add.tileSprite(0, 0, this.worldW, GAME_H, floor.background)
      .setOrigin(0, 0).setDepth(-10);
    const bgTexH = this.textures.get(floor.background).getSourceImage().height;
    bg.tilePositionY = Math.max(0, bgTexH - GAME_H);

    // 地面（不可視の静的ボディ。上端=FLOOR_Y）
    this.ground = this.add.rectangle(this.worldW / 2, FLOOR_Y + 40, this.worldW, 80, 0x000000, 0);
    this.physics.add.existing(this.ground, true);

    // グループ
    this.enemies = this.add.group({ runChildUpdate: true });
    this.projectiles = this.add.group({ runChildUpdate: true });
    this.playerBeams = this.add.group({ runChildUpdate: true }); // ハゲ化ビーム

    // プレイヤー（接地状態で出す。空中spawn→落下で「最初2段に見える」のを防ぐ）
    this.player = new Player(this, 100, FLOOR_Y - PLAYER.displayHeight / 2);
    this.player.body.reset(100, FLOOR_Y - PLAYER.displayHeight / 2);
    this.physics.add.collider(this.player, this.ground);

    // ハゲ化アイテム（ボス手前に固定配置）
    this.powerup = this.physics.add.image(floor.powerupX, FLOOR_Y - 30, 'itemPowerup');
    this.powerup.body.setAllowGravity(false);
    this.physics.add.overlap(this.player, this.powerup, () => {
      if (!this.powerup.active) return;
      this.player.powerUp();
      this.ui.showCenter('ブチギレ！！', 800);
      this.powerup.destroy();
    });

    // 衝突・当たり判定
    this.physics.add.collider(this.enemies, this.ground);
    this.physics.add.overlap(this.player.attackBox, this.enemies, this._hitEnemy, undefined, this);
    this.physics.add.overlap(this.projectiles, this.player, this._projHitPlayer, undefined, this);
    this.physics.add.overlap(this.enemies, this.player, this._enemyTouch, undefined, this);
    this.physics.add.overlap(this.playerBeams, this.enemies, this._beamHitEnemy, undefined, this);

    // カメラ
    this.cameras.main.setBounds(0, 0, this.worldW, GAME_H);
    this.cameras.main.startFollow(this.player, true, CAMERA.lerp, CAMERA.lerp);

    // UI
    this.ui = new UiManager(this);
    this.ui.showCenter(floor.label, 1600);

    // オンスクリーン操作（タップ／クリック。キーボードと併用）
    this.touchControls = new TouchControls(this);

    // 入力（ポーズ・つかみ連打）
    this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.keyX2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.keySpace2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.paused = false;
  }

  update(time, delta) {
    if (this.ending) return;
    const dt = delta / 1000;

    // ポーズ
    if (Phaser.Input.Keyboard.JustDown(this.keyP)) this._togglePause();
    if (this.paused) return;

    this.player.update(dt);

    // つかまれ中の連打脱出＋脱出プロンプト表示
    if (this.player.state === 'grabbed') {
      this.ui.setGrabPrompt(true);
      // キーボード(Z/X/Space) と タッチ(パンチ/キック/JUMPボタン) のどれでも"連打"としてカウント
      const t = this.touch || {};
      let mashed = Phaser.Input.Keyboard.JustDown(this.keyZ) ||
                   Phaser.Input.Keyboard.JustDown(this.keyX2) ||
                   Phaser.Input.Keyboard.JustDown(this.keySpace2);
      if (t.attackQueued) { mashed = true; t.attackQueued = false; }
      if (t.jumpQueued) { mashed = true; t.jumpQueued = false; }
      if (mashed) {
        this.player.tryMashEscape();
      }
    } else {
      this.ui.setGrabPrompt(false);
    }

    if (this.boss) this.boss.update(dt);

    // 時間
    if (this.mode !== 'cleared') {
      this.timeLeft -= dt;
      if (this.timeLeft <= 0) { this.timeLeft = 0; this._loseLife('time'); return; }
    }

    if (this.mode === 'playing') {
      this._checkWaves();
      this._checkBossTrigger();
    }

    this.ui.update({
      hp: this.player.hp, score: this.score, time: this.timeLeft,
      floorLabelShort: this._floorShort(), lives: this.lives,
    });
    if (this.boss && !this.boss.dead) this.ui.setBossHp(this.boss.hp / this.boss.maxHp);
  }

  _floorShort() {
    return this.floorId <= 4 ? `${this.floorId}F` : 'RF';
  }

  _checkWaves() {
    this.floor.waves.forEach((wave, i) => {
      if (this.wavesSpawned.has(i)) return;
      if (this.player.x >= wave.x) {
        this.wavesSpawned.add(i);
        const bossRoomLeft = this.worldW - BOSS_ROOM_W;
        const cam = this.cameras.main;
        // カメラは追従でこのあと右へ動く。現在の右端と「追従後の右端」の大きい方の外側に出す
        // （でないと湧いた直後にカメラが追いついて画面内に見えてしまう）。
        const camRightNow = cam.scrollX + cam.width;
        const eventualScrollX = Phaser.Math.Clamp(this.player.x - cam.width / 2, 0, this.worldW - cam.width);
        const baseX = Math.max(camRightNow, eventualScrollX + cam.width) + 70;
        wave.enemies.forEach((e, j) => {
          // 画面外の右端から登場（見えないところから歩いて入る）。ボス部屋手前でクランプ。
          const sx = Math.min(baseX + j * 70, bossRoomLeft - 60, this.worldW - 40);
          const en = new Enemy(this, sx, FLOOR_Y - 120, e.type);
          this.enemies.add(en);
          // 接地状態で出す（空中spawn→落下で「1段上に見える」のを防ぐ）
          en.body.reset(sx, FLOOR_Y - en.displayHeight / 2);
        });
      }
    });
  }

  _checkBossTrigger() {
    const bossRoomLeft = this.worldW - BOSS_ROOM_W;
    if (this.player.x >= bossRoomLeft + 120) this._startBoss(bossRoomLeft);
  }

  _startBoss(bossRoomLeft) {
    this.mode = 'bossLock';
    // 残存雑魚を退場
    this.enemies.getChildren().slice().forEach((e) => { if (!e.dead) e.destroy(); });

    // カメラ＆進行をボス部屋にロック
    this.cameras.main.stopFollow();
    this.cameras.main.scrollX = bossRoomLeft;
    this.physics.world.setBounds(bossRoomLeft, 0, BOSS_ROOM_W, GAME_H);

    // ボス生成
    this.boss = new Boss(this, this.worldW - 150, FLOOR_Y - 200, this.floor.boss.type);
    this.physics.add.collider(this.boss, this.ground);
    this.physics.add.overlap(this.player.attackBox, this.boss, this._hitBoss, undefined, this);
    this.physics.add.overlap(this.boss.attackBox, this.player, this._bossHitPlayer, undefined, this);
    this.physics.add.overlap(this.playerBeams, this.boss, this._beamHitBoss, undefined, this);
    // 突進中のボス本体に当たると接触ダメージ
    this.physics.add.overlap(this.boss, this.player, (boss, pl) => {
      if (boss.charging) pl.takeDamage(boss.chargeDamage || 3, boss.x);
    }, undefined, this);
    this.ui.showBoss(this.boss.displayName);
  }

  // ハゲ化ビーム発射（Playerから呼ばれる）
  fireBeam(x, y, dir) {
    const beam = new Beam(this, x, y, dir);
    this.playerBeams.add(beam);
  }

  _beamHitEnemy(beam, enemy) {
    if (enemy.dead || beam.hitSet.has(enemy)) return;
    beam.hitSet.add(enemy);
    enemy.takeDamage(beam.damage, beam.x);
    this.score += SCORE.enemyBonus;
    this._fxHit(enemy.x, enemy.y - 20);
    beam.destroy(); // 貫通させない（最初の敵で消える）
  }

  _beamHitBoss(beam, boss) {
    if (boss.dead || boss.invincible || beam.hitSet.has(boss)) return;
    beam.hitSet.add(boss);
    const before = boss.hp;
    boss.takeDamage(beam.damage, beam.x);
    if (boss.hp < before) this._fxHit(boss.x, boss.y - 30);
    beam.destroy();
  }

  // --- 当たり判定コールバック ---
  _hitEnemy(attackBox, enemy) {
    if (!attackBox.body.enable || enemy.dead) return;
    if (attackBox.hitSet.has(enemy)) return;
    attackBox.hitSet.add(enemy);
    enemy.takeDamage(attackBox.damage, this.player.x);
    this.score += attackBox.score;
    this._fxHit(enemy.x, enemy.y - 20);
    this._hitStop(FEEL.hitStopEnemyMs);
  }

  _hitBoss(attackBox, boss) {
    if (!attackBox.body.enable || boss.dead || boss.invincible) return;
    if (attackBox.hitSet.has(boss)) return;
    attackBox.hitSet.add(boss);
    const before = boss.hp;
    boss.takeDamage(attackBox.damage, this.player.x);
    if (boss.hp < before) {
      this.score += attackBox.score;
      this._fxHit(boss.x, boss.y - 30);
      this._hitStop(FEEL.hitStopBossMs);
    }
  }

  _bossHitPlayer(bossAttack, player) {
    if (!bossAttack.body.enable) return;
    // しゃがみで上段(high)回避 / ジャンプで下段(low)回避
    if ((bossAttack.level === 'high' && player.isLow) ||
        (bossAttack.level === 'low' && !player.grounded)) return;
    player.takeDamage(bossAttack.damage, this.boss.x);
  }

  // ★overlap(object1=projectiles, object2=player) のコールバックは (proj, player) の順で渡る。
  //   以前は (player, proj) と取り違えており、弾が当たるとプレイヤーを破棄＋projectile.takeDamage()で
  //   例外→ゲーム停止（遠距離攻撃でフリーズ）していた。
  _projHitPlayer(proj, player) {
    if (proj.passed) return; // 既に回避成立した弾＝無害で通過中（再ヒットしない）
    // 接触した瞬間にしゃがみ(上段)/ジャンプ(下段)なら回避成立。
    // 弾は消さず「無害フラグ」を立てて通過させる（頭上/足元を飛び抜ける見た目＋確実に回避）。
    if ((proj.level === 'high' && player.isLow) ||
        (proj.level === 'low' && !player.grounded)) {
      proj.passed = true;
      return;
    }
    const damage = proj.damage;
    const fromX = proj.x;
    proj.destroy();
    player.takeDamage(damage, fromX);
  }

  _enemyTouch(enemy, player) {
    if (enemy.dead) return;
    // 接触ダメージ系（card/fruit/banana/chibi）。hugのつかみは Enemy._updateHug 内で処理
    const dmg = enemy.cfg.contactDamage;
    if (dmg && enemy.type !== 'hug') player.takeDamage(dmg, enemy.x);
  }

  onEnemyDefeated(enemy) {
    this.score += enemy.cfg.score + SCORE.enemyBonus;
  }

  onBossDefeated() {
    if (this.ending) return;
    this.mode = 'cleared';
    this.ui.hideBoss();
    this.ui.showCenter('FLOOR CLEAR!', 0);
    const bonus = Math.ceil(this.timeLeft) * SCORE.timeBonusPerSec + SCORE.bossClear;
    this.score += bonus;
    this.time.delayedCall(1800, () => this._advanceFloor());
  }

  onPlayerDead() { this._loseLife('hp'); }

  _advanceFloor() {
    const next = getFloor(this.floorId + 1);
    // 次フロアが実装済み（スタブでない）なら進む。なければクリア扱い（vertical slice完了）。
    if (next && next.id === this.floorId + 1 && !next.stub) {
      this.scene.start('GameScene', { floorId: next.id, score: this.score, lives: this.lives });
    } else {
      this._end('cleared');
    }
  }

  _loseLife(reason) {
    if (this.ending) return;
    this.lives -= 1;
    if (this.lives <= 0) {
      this._end('gameover');
    } else {
      // チェックポイント最簡版＝フロア頭から（LEVEL_SPEC MVP許容）
      this.ending = true;
      this.cameras.main.fade(500, 0, 0, 0);
      this.time.delayedCall(550, () =>
        this.scene.start('GameScene', { floorId: this.floorId, score: this.score, lives: this.lives }));
    }
  }

  _end(outcome) {
    if (this.ending) return;
    this.ending = true;
    this.time.delayedCall(outcome === 'cleared' ? 0 : 800, () => {
      this.scene.start('ResultScene', {
        outcome, score: this.score, floorId: this.floorId,
        floorLabel: this.floor.label,
      });
    });
  }

  // --- 演出 ---
  _fxHit(x, y) {
    const fx = this.add.image(x, y, 'fxHit').setDepth(900);
    this.tweens.add({ targets: fx, alpha: 0, scale: 1.4, duration: 180,
      onComplete: () => fx.destroy() });
  }

  _hitStop(ms) {
    if (this._hitStopActive || this.paused) return;
    this._hitStopActive = true;
    this.physics.world.pause();
    this.time.delayedCall(ms, () => {
      this._hitStopActive = false;
      if (!this.paused) this.physics.world.resume(); // ポーズ中なら再開しない
    });
  }

  _togglePause() {
    this.paused = !this.paused;
    if (this.paused) {
      this.physics.world.pause();
      this.ui.showCenter('PAUSED\n(P:再開)', 0);
    } else {
      this.physics.world.resume();
      this.ui.hideCenter();
    }
  }
}
