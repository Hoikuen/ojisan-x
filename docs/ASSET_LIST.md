# おじさんX — ASSET LIST（必要素材の全リスト）

作成日: 2026-06-26

> 「最初に何を準備すればいいか」の答え。コードを書く前にこの表の素材を揃える。
> ✅=spartan-hexから流用可 / 🆕=新規生成が必要 / 🔧=流用＋一部追加

> 📁 **流用元のベースディレクトリは2系統あるので取り違え注意**（実物照合済み・2026-06-26）：
> - キャラ・ボス・流用敵 → `spartan-hex/assets/sprites/extracted_v2/...`（本表でフォルダ名のみ記載＝この配下）
> - アイテム・ハザード・一部の弾の流用元 → `spartan-hex/assets/sprites/extracted/...`（`extracted_v2`では**ない**。big_document/power_drink/projectile_candy 等）
> - 札束 → `spartan-hex/assets/sprites/items/cash.png`
> おじさんX側へコピーする際は `ojisan-x/assets/sprites/extracted_v2/` 配下に統一して置く。

---

## 1. スプライト：主人公

| キー | ポーズ | サイズ目安 | 状態 | 入手元 |
|---|---|---|---|---|
| playerIdle | 待機 | displayHeight 約160px | ✅ | `player_ojisan/idle.png` |
| playerWalk | 歩き | 〃 | ✅ | `player_ojisan/walk.png` |
| playerPunch | パンチ（ブリーフケース） | 〃 | ✅ | `player_ojisan/attack.png` |
| playerKick | キック | 〃 | 🆕 | 新規（attackと別ポーズが理想・無ければattack流用） |
| playerCrouch | しゃがみ | 〃 | 🔧 | `player_ojisan/extra.png`流用 or 新規 |
| playerCrouchAttack | 下段攻撃 | 〃 | 🆕 | 新規 |
| playerJump | ジャンプ | 〃 | ✅ | `player_ojisan/jump.png` |
| playerFall | 落下 | 〃 | ✅ | `player_ojisan/fall.png` |
| playerJumpAttack | ジャンプ攻撃 | 〃 | 🆕 | 新規（無ければjump流用） |
| playerHurt | 被弾 | 〃 | ✅ | `player_ojisan/hurt.png` |
| playerGrabbed | つかまれ | 〃 | 🆕 | 新規（もがく姿） |
| playerDeath | やられ・ダウン | 〃 | 🆕 | 新規 |

### 主人公・ハゲ化（怒りモード）

| キー | ポーズ | 状態 | 入手元 |
|---|---|---|---|
| playerBaldIdle/Walk/Punch | 待機/歩き/パンチ | ✅ | `player_bald/`（idle walk attack） |
| playerBaldKick/Jump/Fall/Hurt | キック/ジャンプ/落下/被弾 | 🆕 | 新規（不足分） |

---

## 2. スプライト：雑魚敵

### ハグ魔（酔っぱらいおじさん）＝グリッパー 🆕全新規
| キー | ポーズ |
|---|---|
| hugIdle | 待機 |
| hugWalk | 近づく |
| hugGrab | つかみ（プレイヤーに張り付く） |
| hugHurt | 被弾 |
| hugDeath | やられ |

### 名刺投げ（営業おじさん）＝ナイフ投げ 🆕全新規
| キー | ポーズ |
|---|---|
| cardIdle / cardWalk | 待機/移動 |
| cardThrowHigh / cardThrowLow | 上段投げ/下段投げ |
| cardHurt / cardDeath | 被弾/やられ |

### ちびリーマン（新入社員）＝トムトム 🆕全新規
| キー | ポーズ |
|---|---|
| chibiIdle / chibiJump | 待機/飛びかかり |
| chibiHurt / chibiDeath | 被弾/やられ |

### 追加バリエ（既存流用で中盤フロアに投入）
> ⚠️ 実ファイル名に注意（2026-06-26 実物照合済み）。`schoolgirl_fix/`・`gorilla_fix/` の中身は
> どちらも `idle.png` / `walk_1.png` / `throw.png` / `hurt.png` の4枚のみ（`walk.png`は無い）。

| 敵 | キー → 実ファイル | death | 入手元 |
|---|---|---|---|
| フルーツ眼鏡女子（遠距離・投擲） | fruitIdle→idle / fruitWalk→**walk_1** / fruitThrow→throw / fruitHurt→hurt | hurt流用 | `schoolgirl_fix/` |
| バナナ筋肉女子（突進） | bananaIdle→idle / bananaWalk→**walk_1** / **bananaCharge→throw**（突進ポーズに転用） / bananaHurt→hurt | hurt流用 | `gorilla_fix/` |

- バナナ筋肉女子は**突進敵**なので「投げ(Throw)」は使わない。`throw.png`を**突進の踏み込みポーズ**として`bananaCharge`に転用する（キー名を`bananaThrow`にしない）。
- 流用2種の`death`は専用画像を作らず**hurtを流用**（撃破時は一瞬hurt表示→吹き飛び消滅）。新規で作るなら🆕で追加。

---

## 3. スプライト：ボス（5体）

| F | ボス | 必要ポーズ | 状態 |
|---|---|---|---|
| 1 | 傘おじさん | idle / attack(突き) / attack2(払い) / hurt / death | 🆕 |
| 2 | ブーメラン部長 | idle / throw / hurt / death | 🆕 |
| 3 | 筋肉専務 | idle / grab / charge(突進) / hurt / death | 🆕 |
| 4 | 占い師おじさん | idle / cast(詠唱) / hurt / death | 🆕 |
| 4 | 大仏豚おやつボス（中ボス） | idle→boss_idle / attack→boss_attack / hurt→boss_hurt / **death→boss_pose_5** | ✅ `boss/`流用 |
| 5 | Mr.X（会長） | idle / attack1 / attack2 / phase2 / hurt / death | 🆕 |

- ボスのdisplayHeightは大きめ（`TUNING.md`参照）。フレーム構成は**全ポーズで足元をフレーム下端に揃える**（spartan-hexのボス床めり込みの教訓・武器が上に出る場合は上部余白で吸収）。

---

## 4. 弾・エフェクト・アイテム

| キー | 用途 | 状態 |
|---|---|---|
| projCard | 名刺（敵の飛び道具） | 🆕 |
| projFile | 書類ファイル（ブーメラン部長） | 🆕 |
| projFireball | 火の玉（占い師） | 🆕 |
| projSnake / projMoth | 火の玉の変化形（蛇/蛾） | 🆕 |
| projSnack | 火の玉の変化形（おやつ） | 🔧 流用元：`spartan-hex/assets/sprites/extracted/enemy_final_buddha_pig_boss/projectile_candy.png`（※`extracted`配下・`extracted_v2`ではない） |
| itemCash | 退職金（札束＝ゴール／加点） | ✅ 流用元：`spartan-hex/assets/sprites/items/cash.png`（※`extracted_v2`配下ではない） |
| itemPowerup | ハゲ化アイテム | 🔧 流用元：`spartan-hex/assets/sprites/extracted/item_core_set/power_drink.png`（パワードリンク・実在確認済）。気に入らなければ🆕新規（ART_PROMPTS §5） |
| fxHit | ヒットエフェクト | 🆕（白背景抽出に注意・ART_PROMPTS §6.6） |
| fxStar | やられ星 | 🆕 |

> 💡 流用元 `extracted/item_core_set/` には他に `checkpoint.png`（チェックポイント表示用）・`coin_receipt.png`・`secret_key.png`・`wing_shoe.png` が実在。スコアアイテムやチェックポイント演出に流用可（任意）。

## 4.5 ハザード（落下物・F2/F3）

| キー | 用途 | フロア | 状態 |
|---|---|---|---|
| hazDocument | 落ちてくる書類束（当たると小ダメージ） | F2 | 🔧 流用元：`spartan-hex/assets/sprites/extracted/item_core_set/big_document.png`（実在確認済） |
| hazBeam | 落下する鉄骨（当たると小ダメージ） | F3 | 🆕 ART_PROMPTS §6.7。※鉄骨はほぼ長方形なので**Phaserの矩形描画で代替可**（画像必須ではない） |

- どちらも**MVP(F1)では使わない**（F2/F3のハザード。LEVEL_SPECで「MVP外でも可」）。F2/F3着手時に用意。
- ハザードの当たり判定数値（落下間隔・ダメージ）はTUNINGに `buddha.fallSnack` 同様の形式で追記する（F2/F3着手時）。

## 4.6 UI（画面表示）— 原則コード描画・画像不要

| 要素 | 方針 |
|---|---|
| 体力バー / ボス体力バー / ハゲ化ゲージ | **コード描画**（Phaser `Graphics` の矩形＋色）。画像アセット不要 |
| スコア / 残り時間 / フロア表示 | **テキスト描画**（フォントのみ）。画像不要 |
| 残機アイコン | **playerIdleを縮小して流用**（専用画像を作らない）。画像不要 |
| ハート（体力目盛） | コード描画の矩形目盛で代用（♥画像にしたい場合のみ🆕1枚） |
| タイトルロゴ「おじさんX」 | MVPは**装飾フォントのテキスト**で可。ロゴ画像化は任意（後から1枚追加できる・ゲーム性に影響なし） |
| 挑戦状（オープニング）/ エンディング画面 | MVPは**テキストオーバーレイ**で可。1枚絵にするかは任意（後から追加可） |
| フロア遷移ゴール | **itemCash（札束）到達**で表現。専用の階段/ドア画像は作らない（`checkpoint.png`流用も可） |

> ⚠️ UI・ロゴ・演出は「コード描画/テキストで画像不要」を基本方針とする。
> 画像化したくなった要素だけ後から1枚ずつ足せばよく、**ゲーム本体のスプライト発注をブロックしない**。

---

## 5. 背景（5フロア＋タイトル）

| キー | フロア | 状態 |
|---|---|---|
| bgTitle | タイトル（ビル外観） | 🆕 |
| bgFloor1 | 居酒屋街 | 🔧 `background/school.png`は不適→新規推奨 |
| bgFloor2 | オフィス | 🆕 |
| bgFloor3 | 工事現場 | 🆕 |
| bgFloor4 | 占いバー | 🆕 |
| bgFloor5 | 社長室（屋上・夜景） | 🆕 |

- 背景は横長（ワールド幅3600px相当）。タイル/パターンの繰り返し＋ランドマークでも可（全部描かなくてよい）。

---

## 6. 音（SE / BGM）

| キー | 種別 | 用途 | 状態 |
|---|---|---|---|
| sePunch / seKick | SE | 攻撃 | 🆕 |
| seHit | SE | ヒット | 🆕 |
| seHurt | SE | 被弾 | 🆕 |
| seGrab | SE | つかまれ | 🆕 |
| seJump | SE | ジャンプ | 🆕 |
| sePowerup | SE | ハゲ化 | 🆕 |
| seEnemyDown | SE | 敵撃破 | 🆕 |
| seBossDown | SE | ボス撃破 | 🆕 |
| seStageClear | SE | フロアクリア | 🆕 |
| seGameOver | SE | ゲームオーバー | 🆕 |
| bgmTitle | BGM | タイトル | 🆕 |
| bgmStage | BGM | 通常フロア（ループ） | 🆕 |
| bgmBoss | BGM | ボス戦 | 🆕 |
| bgmClear | BGM | 全クリア | 🆕 |

- 音はフリー素材／生成でも可。MVPは最低限（攻撃・ヒット・被弾・クリア・BGM1種）から。

---

## 7. 素材数サマリー（規模感）

| カテゴリ | 流用✅ | 新規🆕 | 合計の目安 |
|---|---|---|---|
| 主人公スプライト | 7 | 約7 | 約14 |
| 雑魚敵スプライト | 8（女子2種） | 約14（おじさん3種） | 約22 |
| ボススプライト | 3（大仏豚） | 約24（5体分） | 約27 |
| 弾・アイテム・FX | 2 | 約8 | 約10 |
| 背景 | 0〜1 | 約6 | 約6 |
| 音 | 0 | 約18 | 約18 |
| **合計** | **約20** | **約77** | **約97素材** |

→ ざっくり**新規生成が必要なのは約75〜80点**。うち多くはボスと背景。MVP（F1のみ）で必要なのはこのうち**約25点**に絞れる（`PRODUCTION_PLAN.md`参照）。

---

## 8. 透過抽出ルール（厳守）

- 画像生成時は **純白背景 `#FFFFFF`** で出力（プロンプトに `isolated on pure white background, no shadows, flat background, pixel art` を含める）
- 抽出は `extract_better.py`（四隅flood-fill）**のみ**使用。しきい値除去は禁止（シャツが透過する）
- 抽出後はClaudeで目視確認（黒枠・透過漏れチェック）
- **全ポーズで足元をフレーム下端に揃える**（床めり込み防止）
- 詳細：`~/Developer/games/PHASER3_CONSTRAINTS.md` ルール#5・#9
