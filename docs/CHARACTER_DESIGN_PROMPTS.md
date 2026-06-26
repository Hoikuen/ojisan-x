# 主人公デザイン発注プロンプト（参考キャラ → 3案 → 全ポーズ）

作成日: 2026-06-26
対象AI: Antigravity（Nanobanana・画像入力でキャラ一貫性が強い＝おすすめ）／ Codex(DALL-E)

> 使い方：本人が「自分のオリジナルコンテンツのキャラ画像（2〜3枚）」をAIに添付し、下の①を投げる。
> 3案から1つ選んだら、その採用画像を添付して②を投げる。
> 生成された純白背景の画像を `raw_generated/` に置けば、こちらで透過抽出＆組込（`tools/extract_raw.py`）。
> ※自分のキャラを主人公にする＝「自分が作ったゲーム」の証拠になる。だからキャラの同一性保持が最重要。

---

## ① 主人公デザイン 3パターン提案（コピペ）

```
私のオリジナルキャラクターを、横スクロール2Dアクションゲームの主人公スプライトにしたいです。
添付の参考画像（2〜3枚）が、そのキャラクターの正体です。

【絶対に守ること】
- 添付キャラと「同一人物」と分かる特徴（顔立ち・髪型・体型・服装・配色・シルエット）を必ず保持。
  別人化・若返り・画風の大きな逸脱はNG。これは私のオリジナルコンテンツのキャラなので原型を尊重する。

【お願い】
このキャラを主人公にした方向性を【3パターン】、それぞれ1枚のキャラ立ち絵で提案してください。
- 立ち絵＝idle（直立・右向き・全身）
- 世界観のテーマ：[ここに世界観を書く 例：レトロ近未来 / 和風ファンタジー / 日常コメディ]
- 3パターンは、同じキャラのidentityを保ったまま、衣装・小物・トーンの解釈を変えて差別化
  （例：A=王道コミカル / B=クールでシリアス / C=デフォルメでかわいい）。

【各立ち絵の仕様（ゲームに使うので厳守）】
- pixel art / clean cartoon style, bold outlines, flat cel shading
- side view facing right, full body, the feet touching the bottom edge of the frame
- isolated on a pure solid white background (#FFFFFF), no shadow, no floor, single character only
- 3パターンは別々の画像で出力

まずこの3案を見て、私が1つ選びます。
```

---

## ② 採用デザインで全ポーズ生成（コピペ・①で選んだ後）

> フル発注（最大なめらか）。各アクションを**複数コマ**で頼む＝ヌルヌル動く。
> コマは「同じ立ち位置・同じ画角で、動く部分だけ変える」のが鉄則（パラパラで動いて見える）。
> ファイル名は **`ポーズ名_番号.png`**（例 `punch_1.png` `punch_2.png` `punch_3.png`）。1コマだけのものは番号なし。

```
（採用したキャラの立ち絵を添付して）
このキャラクターで、横スクロール2Dアクションの主人公スプライト一式を作ってください。
添付の採用デザインと「同一人物・同一画風・同一頭身・同一サイズ感」を全コマで厳守すること。
アニメ用の連番は「同じ立ち位置・同じ画角・同じ全身サイズで、動く部位だけ変える」こと。

【共通仕様（厳守）】
- pixel art / clean cartoon style, bold outlines, flat cel shading
- side view facing right, full body, the feet touching the bottom edge of the frame
- isolated on a pure solid white background (#FFFFFF), no shadow, single character only
- 連番コマは全て同じキャンバスサイズ・同じ足元位置（パラパラ漫画として成立させる）

【必要ポーズ（合計28枚。各コマ別画像・ファイル名はポーズ名_番号）】
- idle … 2コマ（idle_1 直立 / idle_2 軽く呼吸＝肩か頭が少し上下）
- walk … 4コマ（walk_1 右足前 / walk_2 中間 / walk_3 左足前 / walk_4 中間）
- punch … 3コマ（punch_1 引き / punch_2 当て・腕が最も伸びる / punch_3 戻し）
- kick … 3コマ（kick_1 引き足 / kick_2 蹴り出し・脚が最も伸びる / kick_3 戻し）
- crouch … 2コマ（crouch_1 しゃがみ静止 / crouch_2 わずかに揺れ・低い姿勢を維持）
- crouch_attack … 3コマ（crouch_1 構え / crouch_2 下段に振り出す / crouch_3 戻し）
- jump … 1コマ（jump 上昇・脚をたたむ）
- fall … 1コマ（fall 落下・脚を開く）
- jump_attack … 2コマ（jump_attack_1 空中で構え / jump_attack_2 飛び蹴り/攻撃を出す）
- grabbed … 2コマ（grabbed_1 もがく / grabbed_2 反対側へもがく＝ジタバタに見える）
- hurt … 2コマ（hurt_1 のけぞり始め / hurt_2 のけぞり最大）
- death … 3コマ（death_1 のけぞり / death_2 倒れ込み / death_3 ダウン・目を回す）

純白背景のまま、各コマ1枚ずつ渡してください（透過処理はこちらで行います）。
```

---

## ③ ハゲ化（パワーアップ）バリアント生成（コピペ・②の後）

> ゲーム中、強化アイテムを取ると主人公が「ハゲ化＝怒りモード」になりビーム攻撃ができる。
> ②で作った同一キャラの「怒りバリアント」。動く主要アクションだけ複数コマで**合計14枚**。
> 流用が効くので、しゃがみ/空中攻撃/つかまれ/やられは作らなくてよい（通常版から自動で代用される）。

```
（②で作ったこのキャラのidle画像を添付して）
このキャラクターの「パワーアップ（怒り）バリアント」を作ってください。
同一人物・同一画風・同一頭身・同一サイズ感を厳守。変えるのは下記だけ：

【変更点（怒りモード）】
- 髪が完全に無くなる（つるつるのスキンヘッド）。または髪型を「逆立った/乱れた」激変に。
  ※キャラの世界観に合わせてどちらか。元キャラと同一人物と分かる範囲で。
- 顔を真っ赤にして激怒の表情、目に力、オーラ/湯気が出ている
- 服・体型・小物は②と同じ

【共通仕様（②と同じ・厳守）】
- pixel art / clean cartoon style, bold outlines, flat cel shading
- side view facing right, full body, the feet touching the bottom edge of the frame
- isolated on a pure solid white background (#FFFFFF), no shadow, single character only
- 連番コマは全て同じキャンバスサイズ・同じ足元位置

【必要ポーズ（合計14枚。ファイル名はポーズ名_番号）】
- idle … 2コマ（怒り待機・湯気で揺れる）
- walk … 4コマ（怒り歩き）
- punch … 2コマ（引き / 当て）
- kick … 2コマ（引き / 蹴り出し）
- jump … 1コマ / fall … 1コマ
- hurt … 2コマ（のけぞり）

純白背景のまま、各コマ1枚ずつ渡してください（透過処理はこちらで行います）。
```

---

## 必要枚数まとめ（コードと一致・正本＝合計42枚）

> フル発注。プレースホルダーは全42枚すでに用意済み（＝同名PNGを上書きするだけで差し替わる）。
> システムは「コマが2枚以上揃った動きを自動でアニメ化、揃わなければ静止画」なので、
> **足りないコマは後から追加でOK／多めに作っても損しない**（コード・テスト変更不要・RESKIN.md）。

| 区分 | ポーズ（コマ数） | 枚数 |
|---|---|---|
| 通常版（②） | idle(2) walk(4) punch(3) kick(3) crouch(2) crouch_attack(3) jump(1) fall(1) jump_attack(2) grabbed(2) hurt(2) death(3) | 28 |
| ハゲ化版（③） | idle(2) walk(4) punch(2) kick(2) jump(1) fall(1) hurt(2) | 14 |
| **合計** | | **42** |

**ファイル置き場（差し替え先）**
- 通常版：`public/assets/sprites/extracted_v2/player_ojisan/`（`idle_1.png` `punch_2.png` …）
- ハゲ化：`public/assets/sprites/extracted_v2/player_bald/`（`idle_1.png` `walk_3.png` …）
- 純白背景のまま `raw_generated/` に置けば `tools/extract_raw.py` が透過抽出＆連番整列する。

- 最優先は**通常版15枚**。ハゲ化7枚はパワーアップ時のみ＝後回しでも本編は遊べる。
- 歩行は4コマ揃えば `extract_raw.py` が共通キャンバスに整列→自動でアニメする。揃わなければ1枚静止画でも動く。

---

## メモ
- ①の世界観テーマは本人が決める。3案から選んだものが、そのままゲーム全体のトーン（敵・背景・文言）の基準になる。
- ②の歩行4コマが揃えば、`extract_raw.py`が共通キャンバスに整列→歩行アニメが自動で動く（`RESKIN.md`）。
- 別キャラ＝別ゲーム化も同じ手順（`RESKIN.md`）。今後3パターンの別ゲームを作る想定。
