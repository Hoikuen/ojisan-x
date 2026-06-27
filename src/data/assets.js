// 全アセットのキー→パス対応（差し替えの単一窓口）。
// 実画像が来たら public/ 配下の同じパスのPNGを上書きするだけで差し替わる。
// 仮グラフィックは tools/make_placeholders.py で生成（再実行可）。

const S = 'assets/sprites';

export const IMAGES = {
  // ── 主人公（通常）アニメコマ ───────────────────────────────
  // 命名規則：動くポーズは連番(_1始まり)、1コマだけの動きは番号なし。
  // ★差し替え：public配下の同名PNGを上書きするだけ。コマを増減したい時は
  //   こことPLAYER_ANIMSのframes配列を合わせるだけで自動でアニメ化する（RESKIN.md）。
  // idle（待機・2コマ：呼吸）
  playerIdle1: `${S}/extracted_v2/player_ojisan/idle_1.png`,
  playerIdle2: `${S}/extracted_v2/player_ojisan/idle_2.png`,
  // walk（歩行・4コマ）
  playerWalk1: `${S}/extracted_v2/player_ojisan/walk_1.png`,
  playerWalk2: `${S}/extracted_v2/player_ojisan/walk_2.png`,
  playerWalk3: `${S}/extracted_v2/player_ojisan/walk_3.png`,
  playerWalk4: `${S}/extracted_v2/player_ojisan/walk_4.png`,
  // punch（殴り・3コマ：引き→当て→戻し）
  playerPunch1: `${S}/extracted_v2/player_ojisan/punch_1.png`,
  playerPunch2: `${S}/extracted_v2/player_ojisan/punch_2.png`,
  playerPunch3: `${S}/extracted_v2/player_ojisan/punch_3.png`,
  // kick（蹴り・3コマ）
  playerKick1: `${S}/extracted_v2/player_ojisan/kick_1.png`,
  playerKick2: `${S}/extracted_v2/player_ojisan/kick_2.png`,
  playerKick3: `${S}/extracted_v2/player_ojisan/kick_3.png`,
  // crouch（しゃがみ・2コマ）
  playerCrouch1: `${S}/extracted_v2/player_ojisan/crouch_1.png`,
  playerCrouch2: `${S}/extracted_v2/player_ojisan/crouch_2.png`,
  // crouch_attack（しゃがみ攻撃・3コマ）
  playerCrouchAtk1: `${S}/extracted_v2/player_ojisan/crouch_attack_1.png`,
  playerCrouchAtk2: `${S}/extracted_v2/player_ojisan/crouch_attack_2.png`,
  playerCrouchAtk3: `${S}/extracted_v2/player_ojisan/crouch_attack_3.png`,
  // jump / fall（各1コマ）
  playerJump: `${S}/extracted_v2/player_ojisan/jump.png`,
  playerFall: `${S}/extracted_v2/player_ojisan/fall.png`,
  // jump_attack（空中攻撃・2コマ）
  playerJumpAtk1: `${S}/extracted_v2/player_ojisan/jump_attack_1.png`,
  playerJumpAtk2: `${S}/extracted_v2/player_ojisan/jump_attack_2.png`,
  // grabbed（つかまれ・2コマ：もがき）
  playerGrabbed1: `${S}/extracted_v2/player_ojisan/grabbed_1.png`,
  playerGrabbed2: `${S}/extracted_v2/player_ojisan/grabbed_2.png`,
  // hurt（被弾・2コマ）
  playerHurt1: `${S}/extracted_v2/player_ojisan/hurt_1.png`,
  playerHurt2: `${S}/extracted_v2/player_ojisan/hurt_2.png`,
  // death（やられ・3コマ：のけぞり→倒れ→ダウン）
  playerDeath1: `${S}/extracted_v2/player_ojisan/death_1.png`,
  playerDeath2: `${S}/extracted_v2/player_ojisan/death_2.png`,
  playerDeath3: `${S}/extracted_v2/player_ojisan/death_3.png`,
  // ── 主人公（ハゲ化＝パワーアップ）アニメコマ ─────────────────
  baldIdle1: `${S}/extracted_v2/player_bald/idle_1.png`,
  baldIdle2: `${S}/extracted_v2/player_bald/idle_2.png`,
  baldWalk1: `${S}/extracted_v2/player_bald/walk_1.png`,
  baldWalk2: `${S}/extracted_v2/player_bald/walk_2.png`,
  baldWalk3: `${S}/extracted_v2/player_bald/walk_3.png`,
  baldWalk4: `${S}/extracted_v2/player_bald/walk_4.png`,
  baldPunch1: `${S}/extracted_v2/player_bald/punch_1.png`,
  baldPunch2: `${S}/extracted_v2/player_bald/punch_2.png`,
  baldKick1: `${S}/extracted_v2/player_bald/kick_1.png`,
  baldKick2: `${S}/extracted_v2/player_bald/kick_2.png`,
  baldJump: `${S}/extracted_v2/player_bald/jump.png`,
  baldFall: `${S}/extracted_v2/player_bald/fall.png`,
  baldHurt1: `${S}/extracted_v2/player_bald/hurt_1.png`,
  baldHurt2: `${S}/extracted_v2/player_bald/hurt_2.png`,
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
  bananaIdle: `${S}/extracted_v2/gorilla_fix/walk_1.png`, // idle.pngが仮素材のためwalk_1で代用
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
  buddhaHurt: `${S}/extracted_v2/boss/boss_idle.png`, // boss_hurt.pngが仮素材のためidleで代用（被弾時は白点滅）
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
  bgFloor2: `${S}/background/floor2.png`,
  bgFloor3: `${S}/background/floor3.png`,
  bgFloor4: `${S}/background/floor4.png`,
  bgFloor5: `${S}/background/floor5.png`,
};

// 音（合成生成の仮音源。tools/gen_audio.py で再生成可。差し替え自由）
const A = 'assets/audio';
export const SOUNDS = {
  jump: `${A}/jump.wav`,
  punch: `${A}/punch.wav`,
  kick: `${A}/kick.wav`,
  hurt: `${A}/hurt.wav`,
  enemy_down: `${A}/enemy_down.wav`,
  boss_down: `${A}/boss_down.wav`,
  powerup: `${A}/powerup.wav`,
  cash: `${A}/cash.wav`,
  throw: `${A}/throw.wav`,
  beam: `${A}/beam.wav`,
  bgm_main: `${A}/bgm_main.wav`,
};

// 状態→テクスチャキー（静止画フォールバック）。
// アニメ(PLAYER_ANIMS)のコマが2枚未満しか無い状態だけ、ここの1枚絵が使われる。
// 各stateはアニメの先頭コマを指す（コマが1枚も無くても必ず表示できる）。
export const PLAYER_TEX = {
  normal: {
    idle: 'playerIdle1', walk: 'playerWalk1', jump: 'playerJump', fall: 'playerFall',
    crouch: 'playerCrouch1', punch: 'playerPunch2', kick: 'playerKick2',
    crouchAttack: 'playerCrouchAtk2', jumpAttack: 'playerJumpAtk1',
    grabbed: 'playerGrabbed1', hurt: 'playerHurt1', dead: 'playerDeath1',
  },
  bald: {
    idle: 'baldIdle1', walk: 'baldWalk1', jump: 'baldJump', fall: 'baldFall',
    crouch: 'baldIdle1', punch: 'baldPunch1', kick: 'baldKick1',
    crouchAttack: 'baldPunch1', jumpAttack: 'baldKick1',
    grabbed: 'baldHurt1', hurt: 'baldHurt1', dead: 'baldHurt1',
  },
};

// 状態→アニメーション定義（通常版 normal / ハゲ化版 bald の2セット）。
// frames が2枚以上ロードできていれば BootScene がアニメを生成し、Player が再生する。
// 揃わない状態は PLAYER_TEX の静止画に自動フォールバック（1枚でも必ず動く）。
// repeat:-1=ループ（待機/歩行/もがき）、repeat:0=ワンショット（攻撃/被弾/やられ）。
// ★リスキン/コマ追加：同名の連番PNGを置いて frames を増減するだけ。コード変更不要（RESKIN.md）。
export const PLAYER_ANIMS = {
  normal: {
    idle:         { key: 'anim_pn_idle',  frames: ['playerIdle1', 'playerIdle2'], frameRate: 3, repeat: -1 },
    walk:         { key: 'anim_pn_walk',  frames: ['playerWalk1', 'playerWalk2', 'playerWalk3', 'playerWalk4'], frameRate: 8, repeat: -1 },
    // punch_1=構え→punch_2=突き(frame2)で終わる。punch_3(frame3)は戻し動作なので外す（当てポーズを保持）
    punch:        { key: 'anim_pn_punch', frames: ['playerPunch1', 'playerPunch2'], frameRate: 14, repeat: 0 },
    // kick_2（蹴り当てコマ）だけ残す。1コマ→アニメ未生成→静止画フォールバック(PLAYER_TEX.kick=playerKick2)
    // これにより攻撃全180msでkick_2を表示。kick_1(踏み込み)を見せると「蹴ってない」と誤認されるため省く。
    kick:         { key: 'anim_pn_kick',  frames: ['playerKick2'], frameRate: 14, repeat: 0 },
    crouch:       { key: 'anim_pn_crch',  frames: ['playerCrouch1', 'playerCrouch2'], frameRate: 4, repeat: -1 },
    // catk_1=構え→catk_2=当て(frame4・インパクト有)で終わる。catk_3(戻し)は外す
    crouchAttack: { key: 'anim_pn_catk',  frames: ['playerCrouchAtk1', 'playerCrouchAtk2'], frameRate: 14, repeat: 0 },
    jumpAttack:   { key: 'anim_pn_jatk',  frames: ['playerJumpAtk1', 'playerJumpAtk2'], frameRate: 16, repeat: 0 },
    grabbed:      { key: 'anim_pn_grab',  frames: ['playerGrabbed1', 'playerGrabbed2'], frameRate: 6, repeat: -1 },
    hurt:         { key: 'anim_pn_hurt',  frames: ['playerHurt1', 'playerHurt2'], frameRate: 12, repeat: 0 },
    dead:         { key: 'anim_pn_dead',  frames: ['playerDeath1', 'playerDeath2', 'playerDeath3'], frameRate: 10, repeat: 0 },
    // jump / fall は1コマ運用 → 静止画（PLAYER_TEX）で表示
  },
  bald: {
    idle:  { key: 'anim_pb_idle',  frames: ['baldIdle1', 'baldIdle2'], frameRate: 4, repeat: -1 },
    walk:  { key: 'anim_pb_walk',  frames: ['baldWalk1', 'baldWalk2', 'baldWalk3', 'baldWalk4'], frameRate: 9, repeat: -1 },
    punch: { key: 'anim_pb_punch', frames: ['baldPunch1', 'baldPunch2'], frameRate: 20, repeat: 0 },
    kick:  { key: 'anim_pb_kick',  frames: ['baldKick1', 'baldKick2'], frameRate: 20, repeat: 0 },
    hurt:  { key: 'anim_pb_hurt',  frames: ['baldHurt1', 'baldHurt2'], frameRate: 12, repeat: 0 },
    // crouch/jumpAttack/grabbed/dead は bald 用アニメ無し → PLAYER_TEX.bald の静止画にフォールバック
  },
};
