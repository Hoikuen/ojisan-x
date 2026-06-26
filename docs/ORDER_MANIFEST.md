# おじさんX イラスト発注マニフェスト（優先順位つき・上から順に）

作成日: 2026-06-27 ／ 対象: ojisan-x（スパルタンX風・横スクロール格闘）
対象AI: Antigravity（Nanobanana・画像入力でキャラ一貫性が強い＝おすすめ）／ Codex(DALL-E)

> **使い方**：上から順に1ブロックずつ発注する。各ブロックは「対象ファイル・コマ数・仕様・そのまま投げるプロンプト」のセット。
> Antigravity/Codexに**このファイルごと渡して「上から順に生成して」**でもよい。
> 納品されたら私（Claude）が `extract_sheet.py` で透過抽出 → 下記の対象パスへ配置（**同名上書きで差し替わる・コード変更不要**）。

---

## 0. 全体ルール（毎回守る）

- **キャラは全面ベタの純緑グリーンスクリーン `#00FF00`**（濃紺スーツ・黒髪と分離しやすい。白フチ問題を回避＝ojisan-hopで実績）。
- **背景イラストは不透明な1枚絵**（緑不要）。
- **横向き・右向き**（side view, facing right）。左はコードで反転。
- 1キャラ＝**全コマを1枚の横並びシート**（{N}列×1行、各コマ等間隔・**足元をコマ下端に揃える**）。武器/傘が上に出るボスは上部に余白。
- 連番アニメは**同じ立ち位置・同じ画角・同じ全身サイズ**（パラパラで動いて見える）。
- pixel art / clean cartoon, bold outlines, flat cel shading。既存おじさんと線の太さ・色密度を揃える。

### 共有キャラ同一性ブロック（主人公に毎回貼る＝A案おじさん）
```
中年の日本人サラリーマン。白フレームのサングラス、横分けの黒髪（やや後退）、黒い口ひげ、
血色のいいピンクほっぺ、濃紺スーツ＋白シャツ＋赤ネクタイ、ぽっちゃり丸い腹、短い手足、二重あご。
かわいい16bit寄りドット絵。※メガネは大きな黒反射NG、レンズ端の薄グレー反射だけ。
（英）A friendly chubby middle-aged Japanese salaryman, white-framed sunglasses, black mustache,
side-parted black hair, rosy cheeks, navy suit, white shirt, red tie, plump body, short limbs.
Cute retro 16-bit pixel-art, bold outlines, flat cel shading. Glasses: thin gray edge reflection only.
```

---

## ★流用（発注不要・私がojisan-hopからコピー＆マッピング）

| ojisan-x で必要 | 流用元(ojisan-hop) | 対応 |
|---|---|---|
| fruit（果物メガネ女子）idle/walk/throw/hurt | `enemy_fruit_glasses_girl/`（idle/walk_1/throw/hurt 完全一致） | そのままコピー |
| banana（バナナ筋肉女子）idle/walk/charge/hurt | `enemy_banana_muscle_girl/`（idle/throw/hurt＋ready_throw） | throw→charge等にマッピング |
| 大仏豚ボス（F4中ボス）idle/attack/hurt/death | `enemy_final_buddha_pig_boss/`（idle/throw/prepare/hurt） | マッピングしてコピー |
| 弾・アイテムの一部（苺/お菓子/栄養ドリンク） | `item_core_set/`等 | 必要に応じ流用 |

→ これらは**発注しなくてよい**。私の方でコピー＆パス調整する。

---

# P0：F1（最優先・これが揃えば1面が本物になる）

## P0-1 主人公A案 通常版（28コマ）★最重要 [NEW]
- 対象：`public/assets/sprites/extracted_v2/player_ojisan/`（idle_1.png 等の連番）
- 詳細なコマ割りは `CHARACTER_DESIGN_PROMPTS.md ②` が正本（idle2/walk4/punch3/kick3/crouch2/crouch_attack3/jump1/fall1/jump_attack2/grabbed2/hurt2/death3）。
- **背景だけ緑(#00FF00)に変更**して発注（旧docの白背景指定より緑のほうが綺麗に抜ける）。
```
（自分のA案立ち絵を参照画像として添付）
[共有キャラ同一性ブロック] のおじさんで、横スクロール格闘ゲームの主人公スプライト一式を作成。
同一人物・同一画風・同一頭身・同一サイズ感を全コマ厳守。連番は同じ立ち位置で動く部位だけ変える。
必要ポーズ（CHARACTER_DESIGN_PROMPTS.md ②の通り・各コマ別画像／ファイル名はポーズ名_番号）：
 idle(2) walk(4) punch(3) kick(3) crouch(2) crouch_attack(3) jump(1) fall(1) jump_attack(2) grabbed(2) hurt(2) death(3)
背景は全面ベタの純緑(#00FF00)、影・床なし、side view facing right、足元をコマ下端に揃える。
```

## P0-2 ハグ魔（酔っぱらい）5コマ [NEW]
- 対象：`extracted_v2/hug/` → idle, walk, grab, hurt, death ／ 5列×1行
```
[共有スタイル] 酔っぱらった赤ら顔の中年男。ネクタイを額に巻き、よれた半開きシャツ、腕まくり、
日本酒の小瓶、だらしない笑み、太鼓腹。緑背景(#00FF00)で全身横向き・右向き・足元下端揃え。
5ポーズを横1列に等間隔で：idle(ふらふら立つ)／walk(両腕広げ前へ)／grab(両腕全開で抱きつき突進)／hurt(のけぞる)／death(目を回して倒れる)。
```

## P0-3 名刺投げ（営業）6コマ [NEW]
- 対象：`extracted_v2/card/` → idle, walk, throw_high, throw_low, hurt, death ／ 6列×1行
```
[共有スタイル] 押しの強い若手営業マン。安っぽいグレースーツ、撫でつけ髪、作り笑顔、名刺の束、派手なネクタイ。
緑背景(#00FF00)・横向き右・足元下端揃え。6ポーズを横1列：idle(名刺を扇状に持つ)／walk(自信満々に前進)／
throw_high(頭の高さへ名刺を投げる・腕上)／throw_low(膝の高さへ投げる・腕下)／hurt(のけぞる)／death(名刺を撒き散らし倒れる)。
```

## P0-4 ボス：傘おじさん（F1）5コマ [NEW]
- 対象：`extracted_v2/umbrella/` → idle, thrust, sweep, hurt, death ／ 5列×1行（傘が横に伸びるので横長セル）
```
[共有スタイル] 背の高い厳格な中年男。痩せて筋張り、スーツの上に黒いロングトレンチコート、鋭い目、
撫でつけた灰髪、透明ビニール傘をフェンシングの剣のように構える。通常敵より少し大きくボスの存在感。
緑背景(#00FF00)・横向き右・足元下端揃え。5ポーズ横1列：idle(傘を槍のように構え)／
thrust(傘先を前へまっすぐ突く＝胸の高さ/上段)／sweep(傘を低く横に薙ぐ＝足払い/下段)／hurt(よろける)／death(崩れ落ち傘が飛ぶ)。
```

## P0-5 F1背景「居酒屋街」[NEW]
- 対象：`public/assets/sprites/background/floor1.png`（不透明・横長ループ）
```
2D横スクロール用の背景。夜の昭和レトロな居酒屋横丁：赤提灯が並ぶ小さな飲み屋、木の看板、ネオン、
狭い路地、暖かくのどかな雰囲気。retro pixel-art game background, side-scrolling, horizontal layout, NO characters, flat colors。
サイズ 1536x864（横にループできる構図）。キャラが動く中央〜下の帯は彩度控えめ。文字・キャラは描かない。不透明1枚絵。
```

## P0-6 弾・アイテム・FX（小物）[NEW/一部流用]
- `proj/card.png`（名刺の弾）：a single white business card flying, motion lines。緑背景。
- `items/powerup.png`（ハゲ化＝栄養ドリンク）：glowing energy drink bottle, golden sparkles。※ojisan-hop power_drink流用可。
- `items/cash.png`（札束）：a small stack of cash/bills。
- `fx/hit.png`（ヒット）：small comic impact burst "POW", yellow/white。※白系FXは**マゼンタ背景**で出すと抜きやすい。
- `fx/star.png`（やられ星）：ring of small yellow dizzy stars。マゼンタ背景。

---

# P1：F2–F3

## P1-1 主人公A案 ハゲ化版（14コマ）[NEW]
- 対象：`extracted_v2/player_bald/`。詳細は `CHARACTER_DESIGN_PROMPTS.md ③`。
- 変化：完全なスキンヘッド＋激怒の赤面＋湯気。idle(2)/walk(4)/punch(2)/kick(2)/jump(1)/fall(1)/hurt(2)。緑背景(#00FF00)。
```
（A案idleを参照添付）このおじさんの「ハゲ化＝怒りモード」版。同一人物のまま、髪を完全になくし、顔を真っ赤に激怒、湯気/オーラ。
idle2/walk4/punch2/kick2/jump1/fall1/hurt2 を緑背景(#00FF00)で。足元下端揃え・横向き右。
```

## P1-2 ちびリーマン（新入社員・飛びかかり）4コマ [NEW]
- 対象：`extracted_v2/chibi/` → idle, jump, hurt, death ／ 4列×1行（**他キャラより小さく描く**）
```
[共有スタイル] 小柄な新入社員。ぶかぶかの安スーツ、緊張した必死の顔、ボサボサ髪、小さなカバン、子供のような頭身（他より小さい）。
緑背景(#00FF00)。4ポーズ横1列：idle(おどおど低姿勢)／jump(両腕広げ空中へ飛びかかる)／hurt(のけぞる)／death(転がって目を回す)。
```

## P1-3 ボス：ブーメラン部長（F2）4コマ [NEW]
- 対象：`extracted_v2/boomerang/` → idle, throw, hurt, death ／ 4列×1行
```
[共有スタイル] 恰幅のいい得意げな部長。撫でつけ髪、高そうなピンストライプスーツ、金時計、ニヤけ顔、
マニラ書類フォルダをブーメランのように投げる。緑背景(#00FF00)。4ポーズ：idle／throw(書類を振りかぶって投げる)／hurt／death。
```

## P1-4 ボス：筋肉専務（F3）5コマ [NEW]
- 対象：`extracted_v2/muscle/` → idle, grab, charge, hurt, death ／ 5列×1行（**巨体・他ボスより大きく**）
```
[共有スタイル] 巨大な筋肉ハゲの専務。破れたスーツからはみ出す巨腕、威圧感、工事現場の親玉。武器なし。
緑背景(#00FF00)・全ポーズ同じ高さ感・足元下端揃え。5ポーズ：idle／grab(両腕を前に広げ掴み)／charge(肩から突進する走り)／hurt／death。
```

## P1-5 F2「オフィス」/ F3「工事現場」背景 [NEW]
- 対象：`background/floor2.png`, `floor3.png`（不透明・横長1536x864・ループ・キャラ/文字なし）
```
[floor2] 蛍光灯の狭い日本のオフィス内：机の列、PC、書類の山、ホワイトボード、冷たい事務的な空気。
[floor3] 改装中ビルの夜の工事現場：鉄骨、足場、剥き出しの梁、警告灯、無骨で工業的。
（共通）retro pixel-art game background, side-scrolling, horizontal layout 1536x864, NO characters, flat colors。
```

## P1-6 弾：projFile（書類ファイル）[NEW]
- `proj/file.png`：a manila document folder spinning like a boomerang, motion lines。緑背景。

---

# P2：F4–F5（ラスト）

## P2-1 ボス：占い師おじさん（F4）4コマ [NEW]
- 対象：`extracted_v2/fortune/` → idle, cast, hurt, death ／ 4列×1行
```
[共有スタイル] 怪しい老人。紫のローブとターバン、長い髭、光る水晶玉、不気味な笑み。
緑背景(#00FF00)。4ポーズ：idle／cast(水晶玉を掲げ魔法の光)／hurt／death。
```

## P2-2 ボス：Mr.X（F5ラスボス）6コマ [NEW]
- 対象：`extracted_v2/mrx/` → idle, attack1(杖), attack2(蹴り), phase2, hurt, death ／ 6列×1行
```
[共有スタイル] 邪悪な会長。上品な黒のフォーマルスーツ、銀の撫でつけ髪、黒サングラス、不敵な笑み、金のタイピン、ステッキ。
ラスボスの風格。緑背景(#00FF00)。6ポーズ：idle／attack1(杖を振る)／attack2(キック)／
phase2(激昂・サングラスを外し目が光る・上着がはだける)／hurt／death。
```

## P2-3 弾：火の玉と変化形（占い師用）[NEW]
- `proj/fireball.png`(オレンジの火の玉) / `proj/snake.png`(小さな漫画調の蛇) / `proj/moth.png`(蛾)。各小さめ・緑背景。

## P2-4 ビーム（ハゲ化攻撃）[NEW]
- `proj/beam.png`：a short bright energy beam, yellow/white。緑 or マゼンタ背景。

## P2-5 F4「占いバー」/ F5「社長室」背景 [NEW]
- 対象：`background/floor4.png`, `floor5.png`（不透明・1536x864・ループ・キャラ/文字なし）
```
[floor4] 薄暗い占いバー：紫とマゼンタの照明、水晶玉、タロット、ネオン、妖しい夜の雰囲気。
[floor5] 最上階の豪華な社長室の夜：きらめく夜景の大窓、高級デスク、革張り椅子、ラスボス部屋の演出。
（共通）retro pixel-art game background, side-scrolling, horizontal 1536x864, NO characters, flat colors。
```

## P2-6 タイトル背景（任意・後でも可）[NEW]
- `background/title.png`：少しうらぶれた日本の雑居ビル「Xコーポビル」夜景、登るべき塔、不穏だがコミカル。

---

## 発注後にこちらで行う処理（参考）
1. 緑シート → `_starter-kit/pipeline/extract_sheet.py --bg green --cols N --rows 1` で分割・透過
2. 上記の各「対象パス」へ配置（同名上書き）
3. 背景は floors.js に `bgFloor2..5` キー追加＋差し替え（**この時だけ軽いコード変更**）
4. ビルド＆Playwright＆実機で確認 → push（自動デプロイ）

## 優先順位の考え方
- **P0だけ揃えば1面が完全に本物**（主人公・F1敵2種・F1ボス・F1背景・小物）。まずここを集中。
- P1→P2の順で2〜5面を埋める。流用3キャラ（fruit/banana/buddha）は発注不要なので、その分はP1/P2が軽い。
