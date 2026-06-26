# おじさんX — STATE MACHINES（状態遷移設計）

作成日: 2026-06-26

> 主人公・敵・ボスの「状態」と「遷移条件」を確定する。
> これを先に固めることで、後から技を足しても既存が壊れない（spartan-hexの後付け崩壊の最大の対策）。
> 実装は各エンティティに `state` プロパティを持たせ、`setState(next)` で一元管理する。

---

## 0. 状態管理の鉄則

1. **状態遷移は必ず `setState(next)` 経由**。`this.state = ...` を直書きしない
2. **テクスチャ変更は `applyStateVisual()` に集約**し、`PHASER3_CONSTRAINTS.md` ルール#1（足元補正）を必ず通す
3. **各状態に「入った時刻 `stateEnteredAt`」を記録**し、硬直・持続時間の判定に使う
4. **遷移できる組み合わせを表で固定**。表にない遷移は禁止（バグの温床）

```js
setState(next) {
  if (this.state === next) return;
  this.state = next;
  this.stateEnteredAt = scene.time.now;
  this.applyStateVisual();   // ここでテクスチャ＋足元補正
}
```

---

## 1. プレイヤー状態

### 状態一覧
| 状態 | 説明 | 行動可否 |
|---|---|---|
| `idle` | 待機 | 全入力可 |
| `walk` | 歩行 | 全入力可 |
| `jump` | 上昇中 | 空中攻撃可・左右制御可 |
| `fall` | 落下中 | 空中攻撃可・左右制御可 |
| `crouch` | しゃがみ | 下段攻撃・解除のみ |
| `attack` | 地上攻撃（punch/kick） | 硬直中（連打で継続） |
| `crouchAttack` | 下段攻撃 | 硬直中 |
| `jumpAttack` | 空中攻撃 | 着地で解除 |
| `grabbed` | つかまれ | 連打のみ（移動不可） |
| `hurt` | 被弾のけぞり | 入力不可（短時間） |
| `dead` | ダウン | 入力不可→リスポーン/ミス |

### 遷移表（◯=許可 / ✕=禁止）
| from＼to | idle | walk | jump | crouch | attack | jumpAtk | grabbed | hurt | dead |
|---|---|---|---|---|---|---|---|---|---|
| idle | – | ◯ | ◯ | ◯ | ◯ | ✕ | ◯ | ◯ | ◯ |
| walk | ◯ | – | ◯ | ◯ | ◯ | ✕ | ◯ | ◯ | ◯ |
| jump/fall | ◯(着地) | ◯(着地) | – | ✕ | ✕ | ◯ | ◯ | ◯ | ◯ |
| crouch | ◯ | ✕ | ◯ | – | ✕ | ✕ | ◯ | ◯ | ◯ |
| attack | ◯(硬直後) | ◯(硬直後) | ✕ | ✕ | ◯(連打) | ✕ | ◯ | ◯ | ◯ |
| jumpAttack | ◯(着地) | ◯(着地) | ✕ | ✕ | ✕ | – | ◯ | ◯ | ◯ |
| grabbed | ◯(脱出) | ✕ | ✕ | ✕ | ✕ | ✕ | – | ◯ | ◯ |
| hurt | ◯(復帰) | ✕ | ✕ | ✕ | ✕ | ✕ | ◯ | – | ◯ |
| dead | (リスポーンでidle) | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | ✕ | – |

### 遷移条件（要点）
- `idle/walk → attack`：Z/X押下。攻撃硬直 `comboIntervalMs`(120ms) 中に再入力で連打継続
- `attack → idle`：硬直終了かつ入力なし
- `idle → jump`：↑押下。`jump → fall`：上昇速度が0以下
- `fall → idle/walk`：着地（`body.onFloor()`）
- `* → grabbed`：ハグ魔と接触（hurt/dead以外から）
- `grabbed → idle`：連打が `mashToEscape`(6回) 到達
- `* → hurt`：被弾（無敵時間外）。`hurt → idle`：`hurtDurationMs` 経過
- `* → dead`：HP0。一定後に残機チェック→リスポーン or ゲームオーバー
- **ハゲ化中**：被弾しても `hurt`/`grabbed` に行かない（無敵）。状態機械は同じ、被弾遷移だけ無効化

---

## 2. 雑魚敵 共通状態

| 状態 | 説明 |
|---|---|
| `spawn` | 出現（画面外→歩いて入る） |
| `approach` | プレイヤーへ接近 |
| `attack` | 攻撃（敵ごとに中身が違う：つかみ/投げ/飛びかかり） |
| `recover` | 攻撃後の硬直 |
| `hurt` | 被弾のけぞり |
| `dead` | やられ（数百ms表示して消滅／落下） |

### 共通遷移
```
spawn → approach → (間合い/タイミング) → attack → recover → approach …
любой → hurt（被弾・無敵時間外）→ approach（復帰）
любой → dead（HP0）→ 消滅
```
- `attack` の発生条件・中身は敵タイプ別（`ENEMY_AI.md` で定義）
- `hurt` 中は攻撃判定を出さない。`dead` は当たり判定を消してから演出

---

## 3. ボス状態（共通フレーム＋固有攻撃）

ボスは雑魚より状態が多く、「攻撃の選択（AI）」と「形態（フェーズ）」を持つ。

| 状態 | 説明 |
|---|---|
| `intro` | 登場演出（無敵・操作ロック） |
| `idle` | 待機（次の攻撃を抽選するクールタイム） |
| `move` | 間合い調整（前後移動） |
| `attackN` | 固有攻撃（ボスにより複数：attack1/attack2…） |
| `recover` | 攻撃後の硬直（最大の崩しポイント） |
| `hurt` | 被弾（`hitInvincibleMs` で多段ヒット防止） |
| `phase2` | （Mr.X専用）形態移行演出→以降パターン拡張 |
| `dead` | 撃破演出→クリアトリガー |

### 共通遷移
```
intro → idle → (AI抽選) → move → attackN → recover → idle …
любой → hurt（被弾）→ 直前の行動 or idle へ復帰
HP<=phase2HpRatio（Mr.X）→ phase2 → 以降 idle に戻るが攻撃テーブル拡張
HP<=0 → dead
```

### ボス別の attackN 一覧（中身は ENEMY_AI.md）
| ボス | 攻撃状態 |
|---|---|
| 傘おじさん | attack1=突き / attack2=払い |
| ブーメラン部長 | attack1=ファイル投げ |
| 筋肉専務 | attack1=つかみ / attack2=突進 |
| 占い師おじさん | attack1=火の玉詠唱（変化弾） |
| Mr.X | attack1=ステッキ / attack2=キック / phase2で attack3 追加 |

---

## 4. ゲーム全体のステート（GameSceneのモード）

エンティティとは別に、シーン全体の進行状態も持つ。

| モード | 説明 | カメラ |
|---|---|---|
| `playing` | 通常進行（雑魚ウェーブ） | プレイヤー追従 |
| `bossLock` | ボス部屋（左右進行ロック） | 固定 |
| `cleared` | フロアクリア（入力ロック→Result） | 固定 |
| `gameover` | ミス→残機0（→Result） | 固定 |
| `paused` | ポーズ | 固定 |

```
playing →(ボス部屋到達)→ bossLock →(ボス撃破)→ cleared
playing/bossLock →(HP0&残機0)→ gameover
любой →(Pキー)→ paused →(解除)→ 元のモード
```

---

## 5. 実装メモ

- 状態機械は各エンティティクラス（Player/Enemy/Boss）に持たせ、`update(dt)` 内で
  `switch(this.state)` で分岐。AI判断は別メソッド `decide()` に切り出す
- テクスチャ⇔状態の対応は `applyStateVisual()` の1箇所だけで定義（散らさない）
- 「攻撃中は移動入力を無視」など、行動可否は遷移表に従う。表外の遷移を書かない
- フェーズ移行・つかみなど特殊遷移も必ず `setState` を通す（直書き禁止）
