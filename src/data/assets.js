// 全アセットのキー→パス対応（差し替えの単一窓口）。
// 実画像が来たら public/ 配下の同じパスのPNGを上書きするだけで差し替わる。
// 仮グラフィックは tools/make_placeholders.py で生成（再実行可）。

const S = 'assets/sprites';

export const IMAGES = {
  // 主人公（通常）
  playerIdle: `${S}/extracted_v2/player_ojisan/idle.png`,
  playerWalk: `${S}/extracted_v2/player_ojisan/walk.png`,
  playerPunch: `${S}/extracted_v2/player_ojisan/attack.png`,
  playerKick: `${S}/extracted_v2/player_ojisan/kick.png`,
  playerCrouch: `${S}/extracted_v2/player_ojisan/crouch.png`,
  playerCrouchAttack: `${S}/extracted_v2/player_ojisan/crouch_attack.png`,
  playerJump: `${S}/extracted_v2/player_ojisan/jump.png`,
  playerFall: `${S}/extracted_v2/player_ojisan/fall.png`,
  // 歩行アニメ用フレーム（複数コマ。差し替えで本物の歩きに）
  playerWalk1: `${S}/extracted_v2/player_ojisan/walk_1.png`,
  playerWalk2: `${S}/extracted_v2/player_ojisan/walk_2.png`,
  playerWalk3: `${S}/extracted_v2/player_ojisan/walk_3.png`,
  playerWalk4: `${S}/extracted_v2/player_ojisan/walk_4.png`,
  playerJumpAttack: `${S}/extracted_v2/player_ojisan/jump_attack.png`,
  playerHurt: `${S}/extracted_v2/player_ojisan/hurt.png`,
  playerGrabbed: `${S}/extracted_v2/player_ojisan/grabbed.png`,
  playerDeath: `${S}/extracted_v2/player_ojisan/death.png`,
  // 主人公（ハゲ化）
  baldIdle: `${S}/extracted_v2/player_bald/idle.png`,
  baldWalk: `${S}/extracted_v2/player_bald/walk.png`,
  baldPunch: `${S}/extracted_v2/player_bald/attack.png`,
  baldKick: `${S}/extracted_v2/player_bald/kick.png`,
  baldJump: `${S}/extracted_v2/player_bald/jump.png`,
  baldFall: `${S}/extracted_v2/player_bald/fall.png`,
  baldHurt: `${S}/extracted_v2/player_bald/hurt.png`,
  // 敵：ハグ魔
  hugIdle: `${S}/extracted_v2/hug/idle.png`,
  hugWalk: `${S}/extracted_v2/hug/walk.png`,
  hugGrab: `${S}/extracted_v2/hug/grab.png`,
  hugHurt: `${S}/extracted_v2/hug/hurt.png`,
  hugDeath: `${S}/extracted_v2/hug/death.png`,
  // 敵：名刺投げ
  cardIdle: `${S}/extracted_v2/card/idle.png`,
  cardWalk: `${S}/extracted_v2/card/walk.png`,
  cardThrowHigh: `${S}/extracted_v2/card/throw_high.png`,
  cardThrowLow: `${S}/extracted_v2/card/throw_low.png`,
  cardHurt: `${S}/extracted_v2/card/hurt.png`,
  cardDeath: `${S}/extracted_v2/card/death.png`,
  // 敵：ちびリーマン（F2〜・飛びかかり）
  chibiIdle: `${S}/extracted_v2/chibi/idle.png`,
  chibiJump: `${S}/extracted_v2/chibi/jump.png`,
  chibiHurt: `${S}/extracted_v2/chibi/hurt.png`,
  chibiDeath: `${S}/extracted_v2/chibi/death.png`,
  // 敵：フルーツ眼鏡女子（F4・遠距離／流用）
  fruitIdle: `${S}/extracted_v2/schoolgirl_fix/idle.png`,
  fruitWalk: `${S}/extracted_v2/schoolgirl_fix/walk_1.png`,
  fruitThrow: `${S}/extracted_v2/schoolgirl_fix/throw.png`,
  fruitHurt: `${S}/extracted_v2/schoolgirl_fix/hurt.png`,
  // 敵：バナナ筋肉女子（F3・突進／流用。throwを突進ポーズに転用）
  bananaIdle: `${S}/extracted_v2/gorilla_fix/idle.png`,
  bananaWalk: `${S}/extracted_v2/gorilla_fix/walk_1.png`,
  bananaCharge: `${S}/extracted_v2/gorilla_fix/throw.png`,
  bananaHurt: `${S}/extracted_v2/gorilla_fix/hurt.png`,
  // ボス：傘おじさん(F1)
  umbrellaIdle: `${S}/extracted_v2/umbrella/idle.png`,
  umbrellaThrust: `${S}/extracted_v2/umbrella/thrust.png`,
  umbrellaSweep: `${S}/extracted_v2/umbrella/sweep.png`,
  umbrellaHurt: `${S}/extracted_v2/umbrella/hurt.png`,
  umbrellaDeath: `${S}/extracted_v2/umbrella/death.png`,
  // ボス：ブーメラン部長(F2)
  boomerangIdle: `${S}/extracted_v2/boomerang/idle.png`,
  boomerangThrow: `${S}/extracted_v2/boomerang/throw.png`,
  boomerangHurt: `${S}/extracted_v2/boomerang/hurt.png`,
  boomerangDeath: `${S}/extracted_v2/boomerang/death.png`,
  // ボス：筋肉専務(F3)
  muscleIdle: `${S}/extracted_v2/muscle/idle.png`,
  muscleGrab: `${S}/extracted_v2/muscle/grab.png`,
  muscleCharge: `${S}/extracted_v2/muscle/charge.png`,
  muscleHurt: `${S}/extracted_v2/muscle/hurt.png`,
  muscleDeath: `${S}/extracted_v2/muscle/death.png`,
  // ボス：占い師おじさん(F4)
  fortuneIdle: `${S}/extracted_v2/fortune/idle.png`,
  fortuneCast: `${S}/extracted_v2/fortune/cast.png`,
  fortuneHurt: `${S}/extracted_v2/fortune/hurt.png`,
  fortuneDeath: `${S}/extracted_v2/fortune/death.png`,
  // 中ボス：大仏豚(F4・流用)
  buddhaIdle: `${S}/extracted_v2/boss/boss_idle.png`,
  buddhaAttack: `${S}/extracted_v2/boss/boss_attack.png`,
  buddhaHurt: `${S}/extracted_v2/boss/boss_hurt.png`,
  buddhaDeath: `${S}/extracted_v2/boss/boss_pose_5.png`,
  // ボス：Mr.X(F5・ラスボス)
  mrxIdle: `${S}/extracted_v2/mrx/idle.png`,
  mrxAttack1: `${S}/extracted_v2/mrx/attack1.png`,
  mrxAttack2: `${S}/extracted_v2/mrx/attack2.png`,
  mrxPhase2: `${S}/extracted_v2/mrx/phase2.png`,
  mrxHurt: `${S}/extracted_v2/mrx/hurt.png`,
  mrxDeath: `${S}/extracted_v2/mrx/death.png`,
  // 弾・FX・アイテム
  projCard: `${S}/proj/card.png`,
  projFile: `${S}/proj/file.png`,
  projFireball: `${S}/proj/fireball.png`,
  projSnake: `${S}/proj/snake.png`,
  projMoth: `${S}/proj/moth.png`,
  beam: `${S}/proj/beam.png`,
  fxHit: `${S}/fx/hit.png`,
  fxStar: `${S}/fx/star.png`,
  itemPowerup: `${S}/items/powerup.png`,
  itemCash: `${S}/items/cash.png`,
  // 背景
  bgTitle: `${S}/background/title.png`,
  bgFloor1: `${S}/background/floor1.png`,
};

// 状態→テクスチャキー（プレイヤーの見た目解決に使う）
export const PLAYER_TEX = {
  normal: {
    idle: 'playerIdle', walk: 'playerWalk', jump: 'playerJump', fall: 'playerFall',
    crouch: 'playerCrouch', punch: 'playerPunch', kick: 'playerKick',
    crouchAttack: 'playerCrouchAttack', jumpAttack: 'playerJumpAttack',
    grabbed: 'playerGrabbed', hurt: 'playerHurt', dead: 'playerDeath',
  },
  bald: {
    idle: 'baldIdle', walk: 'baldWalk', jump: 'baldJump', fall: 'baldFall',
    crouch: 'baldIdle', punch: 'baldPunch', kick: 'baldKick',
    crouchAttack: 'baldPunch', jumpAttack: 'baldKick',
    grabbed: 'baldHurt', hurt: 'baldHurt', dead: 'baldHurt',
  },
};

// 状態→アニメーション定義（複数コマで動かす状態だけ書く）。
// frames が2枚以上ロードできていれば BootScene がアニメを生成し、Player が再生する。
// 1枚しか無い状態は PLAYER_TEX の静止画にフォールバック。
// ★別キャラに差し替える時：同名のコマ画像（walk_1..4 等）を置けば、そのまま動く。
//   アニメさせたい動きを増やしたい場合はここに状態を追加してコマ画像を用意するだけ。
export const PLAYER_ANIMS = {
  walk: { key: 'anim_player_walk',
          frames: ['playerWalk1', 'playerWalk2', 'playerWalk3', 'playerWalk4'],
          frameRate: 8, repeat: -1 },
};
