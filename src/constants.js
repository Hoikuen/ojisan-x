// おじさんX 数値定数。docs/TUNING.md が正本。マジックナンバーはここに集約する。

export const GAME_W = 1200; // 2:1 横長（スマホ横向きにフィット）。高さは据え置きで縦レイアウト不変
export const GAME_H = 600;
export const GRAVITY = 900;
export const FLOOR_Y = 575;

export const PLAYER = {
  displayHeight: 160,
  crouchHeightFactor: 0.7, // しゃがみ時は表示高さを縮める（見た目が低くなる）
  bodyRatioW: 0.40,
  bodyRatioH: 0.85,
  speed: 220,
  jumpForce: -480,
  maxHp: 16,
  invincibleMs: 800,
  hurtMs: 350,
  attackActiveMs: 180,   // 攻撃判定が出ている時間
  attackRecoverMs: 120,  // = comboInterval。これ以内の再入力で連打継続
};

export const ATTACK = {
  punch:  { reachX: 70, h: 50, yOff: -40, damage: 2, level: 'high', score: 200 },
  kick:   { reachX: 80, h: 45, yOff: -20, damage: 1, level: 'high', score: 100 },
  crouch: { reachX: 70, h: 40, yOff: +20, damage: 1, level: 'low',  score: 100 },
  jump:   { reachX: 75, h: 60, yOff: 0,   damage: 2, level: 'high', score: 200 },
};

export const GRAB = {
  drainPerSec: 2,
  mashToEscape: 6,
  escapeKnockback: 160,        // 振りほどき時に「掴んでいた敵」を吹き飛ばす量
  regrabCooldownMs: 1000,
  escapeIframesMs: 900,        // 脱出直後の無敵（この間は再つかみされない）＝複数体の連続つかみ防止
  escapePlayerKnockbackX: 200, // 脱出時にプレイヤーを掴み主と反対へ飛ばす
  escapePlayerKnockbackY: -150,
};

export const ENEMY = {
  maxActive: 4,
  projectileSpeed: 260,
  bodyRatioW: 0.44,
  bodyRatioH: 0.75,
  hug:  { displayHeight: 150, hp: 2, speed: 110, score: 100, grabRange: 60 },
  card: { displayHeight: 150, hp: 2, speed: 90,  score: 150,
          tooClose: 140, throwMin: 140, throwMax: 420, throwCdMs: 1500,
          windupMs: 250, recoverMs: 300, highRatio: 0.5, contactDamage: 2, projDamage: 2 },
};

export const BOSS = {
  hitInvincibleMs: 400,
  phase2HpRatio: 0.5,
  bodyRatioW: 0.45,
  bodyRatioH: 0.80,
  umbrella: {
    displayHeight: 200, hp: 8, idleCdMs: 800, speed: 80,
    thrust: { reach: 120, level: 'high', windupMs: 300, recoverMs: 500, damage: 3, weight: 0.6 },
    sweep:  { reach: 90,  level: 'low',  windupMs: 200, recoverMs: 400, damage: 2, weight: 0.4 },
  },
};

export const POWERUP = {
  durationMs: 8000,
  damageMult: 2,
  flashHz: 8,
  // ハゲ化中はビームを撃てる（遠距離攻撃）
  beam: { speed: 520, damage: 2, cooldownMs: 250, displayHeight: 22 },
};

export const SCORE = {
  enemyBonus: 50,
  bossClear: 5000,
  timeBonusPerSec: 50,
  itemCash: 1000,
  extendThreshold: 30000,
};

export const LIVES = { start: 3, maxStock: 5 };

export const FEEL = {
  hitStopEnemyMs: 50,
  hitStopBossMs: 80,
  hitStopBossDeathMs: 200,
  knockEnemyX: 160, knockEnemyY: -80,
  knockDefeatX: 260, knockDefeatY: -160,
  knockBossX: 60,
  knockPlayerX: 120, knockPlayerY: -80,
  shakeBossDeath: 0.012, shakeBossDeathMs: 300,
  shakeHurt: 0.004, shakeHurtMs: 120,
};

export const CAMERA = { lerp: 0.1 };
