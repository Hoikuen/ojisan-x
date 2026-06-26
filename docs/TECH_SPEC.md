# おじさんX — TECH SPEC（技術仕様）

作成日: 2026-06-26

> 共通技術ルールは必ず `~/Developer/games/PHASER3_CONSTRAINTS.md` を読むこと。
> ここにはおじさんX固有の技術設計を書く。

---

## 1. エンジン・環境

- **エンジン**：Phaser 3（arcade physics）
- **ビルド**：Vite
- **言語**：JavaScript（ES Modules）
- **Node.js**：20以上（`.nvmrc` = 20）
- **配布**：ブラウザ（最終的にGitHub Pages / Cloudflare Pages でURL化も視野）

理由：spartan-hexと同じ構成にすることで、`extract_better.py`・物理ヘルパー・既存スプライトをそのまま流用できる。

---

## 2. 画面・解像度

- **キャンバス**：800 × 600（固定。spartan-hexと統一）
- **スケールモード**：`Phaser.Scale.FIT`（ウィンドウに合わせて拡大・アスペクト維持）
- **ピクセルアート設定**：`pixelArt: true`（スプライトのにじみ防止）

---

## 3. ワールドサイズ（「必要な広さ」）

スパルタンXの各フロアは「右へ歩いてドアに到達」する一方向ステージ。これに合わせる。

| 項目 | 値 | 補足 |
|---|---|---|
| 1フロアのワールド幅 | **3600px**（基準） | 画面4.5枚分。歩いて30〜45秒で踏破する長さ |
| ワールド高さ | 600px | 画面と同じ（縦スクロールなし。ジャンプは画面内） |
| カメラ | プレイヤー追従（横方向のみ） | `camera.startFollow`、`setBounds(0,0,3600,600)` |
| ボス部屋 | ワールド右端の固定エリア（幅約800px） | ボス出現で左右の進行をロック（カメラ固定） |
| 床(FLOOR_Y) | 575 | spartan-hexと同値で統一（既存スプライトの足元計算を流用） |

- フロアごとに幅は微調整可（F3工事現場はやや長く等）。基準3600pxを `LEVEL_SPEC.md` でフロア別に指定。

---

## 4. シーン構成（Phaser Scene）

| シーン | 役割 |
|---|---|
| `BootScene` | アセットのプリロード（全テクスチャ・音）＋ローディング表示 |
| `TitleScene` | タイトル画面・操作説明・スタート |
| `GameScene` | 本編（フロアを引数で受け取り、共通ロジックで全5フロアを処理） |
| `BossIntroScene`（任意） | ボス登場演出（オーバーレイでも可） |
| `ResultScene` | ステージクリア／ゲームオーバー／全クリア表示・スコア |

**重要**：5フロアを5つのSceneにしない。**1つの`GameScene`がフロア定義データ（`LEVEL_SPEC`の配列）を読み込んで動く**設計にする。これにより後からフロアを足すのが「データ追加」だけで済む（spartan-hexで後付け機能が壊れた反省）。

---

## 5. フロアをデータ駆動にする（最重要設計）

```js
// フロア定義は配列。GameScene はこれを読むだけ。コードは共通。
const FLOORS = [
  {
    id: 1,
    name: '居酒屋街',
    worldWidth: 3600,
    background: 'bgFloor1',
    bgm: 'bgmStage',
    timeLimit: 90,
    waves: [ /* x座標と敵タイプの配列。キー名は `waves` で統一（LEVEL_SPECのスキーマと一致） */ ],
    boss: { type: 'umbrella' },   // 傘おじさん。敵と同じ {type:...} 形式で統一（LEVEL_SPECと一致）
  },
  // F2〜F5 も同形式で追加するだけ
];
```

- 敵の出現は「x座標トリガー方式」：プレイヤーが一定x座標を超えたらそのウェーブをspawn。
- ボスはワールド右端で出現。出現したらカメラ・進行をロック。

---

## 6. 物理・当たり判定の方針

共通ルール（`PHASER3_CONSTRAINTS.md`）を厳守。特に：

- **テクスチャ切替後は `body.bottom` を読まない**。`y = oldBottom - displayHeight/2` で直接補正（床めり込み防止・ルール#1）。
- **overlap登録は1箇所**（`createCollisions`に集約・ルール#3）。
- **ASSETSキーは全て`preload`でロード**（プリロード漏れクラッシュ防止・ルール#4）。
- キャラのdisplayHeightは固定（プレイヤー・敵・ボスで決め打ち、`TUNING.md`参照）。
- 攻撃判定は独立した不可視の`attackBox`（プレイヤーの向き・しゃがみで位置とサイズを変える）。
- 上段/下段の概念：攻撃boxのY位置と高さで上段・下段を表現。敵/弾にも「高さ属性（high/low）」を持たせ、当たり判定の上下を区別する。

---

## 7. つかみ（グリップ）システム ※おじさんX独自

スパルタンXのグリッパー（つかんで体力を吸う）を再現する専用ステート。

- ハグ魔がプレイヤーに接触 → `grabbed`状態に遷移
- `grabbed`中：プレイヤー移動不可、体力が毎フレーム微減、画面に「連打で振りほどけ！」表示
- Z/X連打でゲージを稼ぐ → 一定で振りほどき、ハグ魔をノックバック
- 複数のハグ魔に同時につかまれると体力減少が加速（原作再現）

これは状態管理で実装。`TUNING.md`に吸収量・振りほどき必要連打数を定義。

---

## 8. ディレクトリ構成

```
~/Developer/games/ojisan-x/
├── CLAUDE.md / AGENTS.md      # 共通ルールへの参照＋固有注意
├── .nvmrc / package.json / vite 設定
├── index.html
├── src/
│   ├── main.js                # エントリ・Scene登録
│   ├── scenes/                # Boot / Title / Game / Result
│   ├── data/floors.js         # フロア定義（データ駆動）
│   ├── entities/              # Player / Enemy / Boss / Projectile
│   └── helpers.js             # scaleToHeight / setBodyRatio 等（spartan-hexから流用）
├── assets/
│   ├── sprites/extracted_v2/  # 抽出済みスプライト
│   ├── audio/
│   └── background/
├── extract_better.py          # spartan-hexからコピー（透過抽出の正規ツール）
└── docs/                      # 本設計書一式
```

---

## 9. 流用元（spartan-hex）

以下はspartan-hexから移植して土台にできる：
- `src/main.js` の物理ヘルパー（`scaleToHeight` / `setBodyRatio`）と修正済みのテクスチャ切替ロジック
- `extract_better.py`（透過抽出）
- スプライト：主人公・フルーツ眼鏡女子・バナナ筋肉女子・大仏豚ボス（`ASSET_LIST.md`参照）

ただし**コードは「設計に合わせて書き直す」**。spartan-hexのmain.jsは1ファイル肥大化していたため、おじさんXでは上記のようにファイル分割する。

---

## 10. アニメーション方式（重要な決定）

**MVPは「1ポーズ＝1枚絵」のポーズ差し替え方式**（spartan-hexと同じ）。
- 各状態（idle/walk/attack…）に静止画を1枚割り当て、状態遷移でテクスチャを差し替える。
- 歩きなどは1枚でも成立する（ファミコン感としても許容）。
- **これによりASSET_LISTのスプライト枚数＝そのまま必要枚数**になる（複数フレームを前提にしない）。

**将来の拡張（任意・MVP外）**：歩き・攻撃を2〜3コマにしたくなったら、
`walk_1/walk_2` のように番号付きで追加し、`anims.create` でフレームアニメ化する。
ただし**全コマで足元をフレーム下端に揃える**こと（PHASER3 #1）。MVPでは増やさない。

> ⚠️ 生成AIに発注するときも「1ポーズ1枚」。スプライトシート（複数ポーズ1枚）は
> キャラがブレやすく抽出も難しいので使わない（ART_PROMPTS方針）。

---

## 11. パフォーマンス目標

spartan-hexはバンドルが約1.5MB（gzip 346KB）で警告が出た。おじさんXでは意識する。

| 指標 | 目標 |
|---|---|
| フレームレート | 60 FPS 維持（中位スペックのPCブラウザ） |
| 画面内同時スプライト | 雑魚 最大4＋弾 数個＋プレイヤー＝十数体まで |
| 1スプライト画像 | 表示サイズの2倍程度に抑える（過大な原寸PNGを持たない・書き出し時に縮小） |
| 背景画像 | 横長でも圧縮（PNG最適化 or 分割タイル）。1枚で数百KB以内を目安 |
| 総アセット | 画像は事前に減色・最適化（pngquant等）。音は ogg/mp3 で圧縮 |
| バンドル | Phaser本体が重いのは不可避。**自前アセットの肥大化を防ぐ**ことに注力 |

- オブジェクトは使い回す（弾・エフェクトはプール化を検討）。毎フレームの`new`を避ける。
- パーティクルは少数・短寿命（GAME_FEEL方針と一致）。

---

## 12. コードアーキテクチャ（モジュール責務）

複数AIが触っても一貫するよう、各ファイルの責務を固定する。

| ファイル | 責務 | 触ってよい範囲 |
|---|---|---|
| `src/main.js` | Phaser初期化・Scene登録・グローバル設定のみ | 薄く保つ |
| `src/scenes/BootScene.js` | 全アセットの`preload`（ASSETSキー一元管理）＋ローディング表示 | アセット追加時 |
| `src/scenes/TitleScene.js` | タイトル・操作説明・ハイスコア表示・スタート | |
| `src/scenes/GameScene.js` | 本編。フロアデータを読み、各エンティティを生成・更新・衝突・UI更新 | 中核 |
| `src/scenes/ResultScene.js` | クリア/ゲームオーバー/全クリア表示・スコア・ハイスコア保存 | |
| `src/data/floors.js` | 全フロア定義（ウェーブ・ボス・背景・時間）。**データのみ・ロジック無し** | フロア追加 |
| `src/entities/Player.js` | プレイヤーの状態機械・入力処理・攻撃box | STATE_MACHINES準拠 |
| `src/entities/Enemy.js` | 雑魚の基底（状態機械＋`decide()`）。タイプは設定で分岐 | ENEMY_AI準拠 |
| `src/entities/Boss.js` | ボスの基底（状態機械＋攻撃テーブル＋フェーズ） | ENEMY_AI準拠 |
| `src/entities/Projectile.js` | 弾の共通クラス（`level: high/low`・変化オプション） | |
| `src/systems/combat.js` | `onHit()`・`hitStop()`・ノックバック・ダメージ判定の一元化 | GAME_FEEL/TUNING準拠 |
| `src/systems/ui.js` | HUD描画・更新（`updateUi`・`showCenterText`） | UI_FLOW準拠 |
| `src/helpers.js` | `scaleToHeight`/`setBodyRatio`/テクスチャ切替（足元補正） | spartan-hex移植 |
| `src/constants.js` | TUNINGの数値をJS定数として一元定義 | TUNINGと同期 |

**データの流れ**：`floors.js`（データ）→ `GameScene`（読込・生成）→ 各`entity`（自律更新）
→ `combat.js`（衝突時の共通処理）→ `ui.js`（表示更新）。

**鉄則**：数値は `constants.js`（＝TUNING由来）に集約。各ファイルにマジックナンバーを直書きしない。
