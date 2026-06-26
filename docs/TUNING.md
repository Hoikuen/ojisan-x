# おじさんX — TUNING（数値の正本）

作成日: 2026-06-26

> 物理・HP・ダメージ・タイミングの数値。コードのマジックナンバーはここを正とする。
> 値は初期案。実機テストで調整する（調整したらこのファイルを更新）。

---

## 1. 物理定数（全キャラ共通の土台）

```js
const GRAVITY = 900;          // 重力（px/s^2）
const FLOOR_Y = 575;          // 床のy（spartan-hexと統一）
```

## 2. プレイヤー

```js
const PLAYER = {
  displayHeight: 160,         // 表示高さ（固定）
  bodyRatioW: 0.40,           // 当たり判定 幅比率
  bodyRatioH: 0.85,           // 当たり判定 高さ比率（足元揃え alignBottom=true）
  speed: 220,                 // 移動速度 px/s
  jumpForce: -480,            // ジャンプ初速
  maxHp: 16,                  // 体力バーの最大値（目盛16）
  lives: 3,                   // 初期残機
  invincibleMs: 800,          // 被弾後の無敵時間
};
```

### 攻撃判定（attackBox）
```js
const ATTACK = {
  punch:  { reachX: 70, h: 50, yHigh: -40, damage: 2, scoreType: 'punch' }, // 上段
  kick:   { reachX: 80, h: 45, yHigh: -20, damage: 1, scoreType: 'kick' },
  crouch: { reachX: 70, h: 40, yLow:  +20, damage: 1, scoreType: 'kick' },  // 下段(スコアはkick相当100)
  jump:   { reachX: 75, h: 60, damage: 2, scoreType: 'jump' },              // ジャンプ攻撃
  comboIntervalMs: 120,       // 連打受付間隔
};
```

## 3. つかみ（グリップ）システム

```js
const GRAB = {
  drainPerSec: 2,             // つかまれ中、毎秒減る体力
  drainPerExtraGripper: 1.5,  // 同時つかみ1体ごとに加算
  mashToEscape: 6,            // 振りほどきに必要な連打回数
  escapeKnockback: 160,       // 振りほどき時のハグ魔ノックバック
};
```

## 4. 雑魚敵

| 敵 | displayHeight | HP | 移動速度 | 攻撃 | 接触ダメージ | スコア |
|---|---|---|---|---|---|---|
| ハグ魔 | 150 | 2 | 110 | つかみ | （吸収） | 100 |
| 名刺投げ | 150 | 2 | 90 | 名刺(上/下) | 弾2 | 150 |
| ちびリーマン | 110 | 1 | 150 | 飛びかかり | 2 | 100 |
| フルーツ眼鏡女子(流用) | 145 | 2 | 90 | 投擲 | 弾2 | 150 |
| バナナ筋肉女子(流用) | 145 | 3 | 130 | 突進 | 3 | 200 |

```js
const ENEMY_COMMON = {
  bodyRatioW: 0.44, bodyRatioH: 0.75,  // alignBottom=true
  maxActive: 4,                        // 同時出現の「ハード上限」(処理保護)。
                                       // ※フロア別の設計意図は1〜3体(ENEMY_AI難易度表)。
                                       //   maxActiveは超えさせない天井であって毎回4体出すわけではない
  projectileSpeed: 260,                // 飛び道具速度
};
```

### 敵の挙動パラメータ（ENEMY_AIの数値の正本）
ENEMY_AIの本文に出てくる間合い・クールタイム・硬直はここを正とする。

```js
const ENEMY_BEHAVIOR = {
  hug:   { grabRange: 60, regrabCooldownMs: 1000 },                 // ハグ魔
  card:  { tooClose: 140, throwMin: 140, throwMax: 420,             // 名刺投げ
           throwCdMs: 1500, windupMs: 250, recoverMs: 300 },
  chibi: { jumpRange: 180, leapCdMs: 1200, recoverMs: 500 },        // ちびリーマン
  fruit: { tooClose: 140, throwMin: 140, throwMax: 420,             // フルーツ眼鏡女子(流用)
           throwCdMs: 1600, windupMs: 250, recoverMs: 300,
           highRatio: 0.5 },                                        // 50%上段/50%下段(cardと同様の投げ分け)
  banana:{ chargeRange: 300, windupMs: 350, recoverMs: 600,         // バナナ筋肉女子(流用)
           chargeSpeed: 320 },
};
```

## 5. ボス

| ボス | displayHeight | HP | 特徴 |
|---|---|---|---|
| 傘おじさん | 200 | 8 | リーチ長い突き(硬直あり) |
| ブーメラン部長 | 200 | 10 | 往復弾。本体は接近に弱い |
| 筋肉専務 | 280 | 14 | 巨体・つかみ・突進 |
| 占い師おじさん | 210 | 12 | 変化弾(上下) |
| 大仏豚(中ボス) | 280 | 8 | 既存流用・道中関門 |
| Mr.X 第1形態 | 220 | 12 | ステッキ薙ぎ(上段)＋回し蹴り(下段) |
| Mr.X 第2形態 | 220 | +10 | HP50%で移行・高速化 |

```js
const BOSS_COMMON = {
  bodyRatioW: 0.45, bodyRatioH: 0.80,  // alignBottom=true
  hitInvincibleMs: 400,                // 連続ヒット防止
  phase2HpRatio: 0.5,                  // Mr.X 第2形態移行ライン
};
```

### ボスの挙動パラメータ（ENEMY_AIの数値の正本）
```js
const BOSS_BEHAVIOR = {
  umbrella: { idleCdMs: 800,                                        // 傘おじさん
              thrust: { reach: 120, level: 'high', windupMs: 300, recoverMs: 500 },
              sweep:  { reach: 90,  level: 'low',  windupMs: 200, recoverMs: 400 },
              thrustWeight: 0.6, sweepWeight: 0.4 },
  boomerang:{ idleCdMs: 900, throw: { windupMs: 300, recoverMs: 600 } }, // ブーメラン部長
  muscle:   { idleCdMs: 1000,                                       // 筋肉専務
              grab:   { range: 70, windupMs: 300, recoverMs: 500 },
              charge: { windupMs: 400, recoverMs: 700, speed: 360 },
              grabWeight: 0.5, chargeWeight: 0.5 },
  fortune:  { idleCdMs: 1000, cast: { windupMs: 500, recoverMs: 500 }, // 占い師
              transformAfterPx: 220 },                              // 火の玉が変化する距離
  mrx:      { idleCdMs: 700,                                        // Mr.X
              cane: { reach: 100, level: 'high', windupMs: 250, recoverMs: 450 },
              kick: { reach: 80,  level: 'low',  windupMs: 200, recoverMs: 400 },
              phase2IdleCdMs: 450 },                                // 第2形態は短縮(高速化)
  buddha:   { idleCdMs: 1100,                                       // 大仏豚(中ボス・既存流用)
              attack: { reach: 90, level: 'high', windupMs: 350, recoverMs: 600 },
              fallSnack: { intervalMs: 1500, damage: 2 } },         // 頭上からおやつを落とす道中ギミック
};
```

> ⚠️ ボスは全ポーズで足元をフレーム下端に揃える。テクスチャ切替時は
> `boss.y = oldBottom - displayHeight/2`（PHASER3_CONSTRAINTS ルール#1）。

## 6. パワーアップ（ハゲ化＝怒りモード）

```js
const POWERUP = {
  durationMs: 8000,           // 持続時間
  damageMult: 2,              // 攻撃力倍率
  invincible: true,           // 無敵（被弾しても体力減らない・つかまれない）
  flashHz: 8,                 // 点滅演出
};
```

## 7. 時間・カメラ

```js
const FLOOR_TIME = { f1:90, f2:90, f3:100, f4:100, f5:110 }; // 秒
const CAMERA = { lerp: 0.1, deadzoneW: 200 }; // 追従の滑らかさ
```

## 8. スコア

```js
const SCORE = { kick:100, punch:200, jump:200, enemyBonus:50,
                bossClear:5000, timeBonusPerSec:50, itemCash:1000,
                extendThreshold:30000 };  // このスコアごとに1UP
```

## 9. アイテム・残機

```js
const ITEM = {
  powerupDropRate: 0.08,   // 雑魚撃破時にハゲ化アイテムが落ちる確率(8%)
                           // ※各フロアのボス前には固定で1個置く(LEVEL_SPEC)
};
const LIVES = {
  start: 3,                // 初期残機(PLAYER.livesと同値・こちらを正とする)
  maxStock: 5,             // エクステンドで増える上限
};
const CONTINUE = {
  promptMs: 10000,         // コンティニュー受付時間
  unlimited: true,         // 回数無制限(家庭用寄り)
};
```

---

## 調整の指針（実機テスト時）

- 「途中で進めない」→ 敵の同時出現数(`maxActive`)・敵HP・つかみ吸収量を先に見る
- 「簡単すぎる」→ 制限時間を詰める・ウェーブ密度を上げる
- ジャンプの気持ちよさは `jumpForce` と `GRAVITY` をセットで調整（片方だけ動かさない）
- ボスは「攻撃後の硬直時間」で難度が大きく変わる。硬直を削るほど難しい
