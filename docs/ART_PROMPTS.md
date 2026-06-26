# おじさんX — ART PROMPTS（イラスト発注用プロンプト集）

作成日: 2026-06-26
対象AI: DALL-E 3（ChatGPT）／ Nanobanana（Gemini・Antigravity）

> 他のAIにスプライトを発注するときのプロンプト集。
> 既存の主人公スプライト（spartan-hex `player_ojisan/`）とスタイルを揃える前提で書いている。

---

## 0. 発注前に必ず守る4つのルール

1. **背景は純白 `#FFFFFF`** ─ 透過抽出（flood-fill）が確実に効く。影・グラデ背景を出さない
2. **キャラの足元をフレーム下端に揃える** ─ 床めり込み防止。武器が上に飛び出すボスは「上部に余白」を取る
3. **横向き・右向き**（side view, facing right）で統一 ─ ゲームは右向き基準、左はコードで反転
4. **抽出は `extract_better.py`**（しきい値除去は禁止）→ 生成後にClaudeで目視確認

---

## 1. 共通スタイルブロック（全プロンプトに付ける定型文）

英語の方が画像AIの精度が高い。下の `STYLE` を各プロンプトの末尾に貼る。

```
STYLE: retro video game character sprite, clean cartoon pixel-art illustration,
bold dark outlines, flat cel shading, vibrant colors, side view facing right,
full body, character standing on the bottom edge of the frame,
isolated on a pure solid white background (#FFFFFF), no shadow, no floor,
no background scenery, no text, single character, high detail pixel art.
```

日本語UIのChatGPTでも、上の英語ブロックをそのまま貼れば効く。

---

## 2. 主人公デザイン定義（この姿で全ポーズを統一）

新しいポーズを発注するときは、毎回この `CHARACTER` 文を入れて同一人物を保つ。

```
CHARACTER: "Ojisan Hox" — a friendly middle-aged Japanese salaryman, late 40s,
chubby kind face with rosy cheeks and a black mustache, round glasses,
black hair combed back with a slightly receding hairline,
wearing a dark navy business suit, white dress shirt, blue necktie,
black leather dress shoes. He carries a black hard briefcase in one hand.
```

> ⭐ **一貫性のコツ**：まず `idle`（待機）を1枚生成してデザインを確定 → そのidle画像を
> Nanobanana（画像入力で編集可）に渡し「same character, change pose to ◯◯」で他ポーズを作ると、
> 顔・服がブレない。DALL-E 3単体なら毎回 `CHARACTER` 文を必ず入れる。

### 主人公・不足ポーズのプロンプト（🆕新規が必要なぶん）

既にある（流用）：idle / walk / punch / jump / fall / hurt
以下が新規に必要：

**キック（kick）**
```
[CHARACTER]
POSE: throwing a strong forward kick with one leg extended horizontally,
briefcase held back in the other hand, dynamic action pose, leaning into the kick.
[STYLE]
```

**しゃがみ（crouch）**
```
[CHARACTER]
POSE: crouching down low, knees bent, guarding, briefcase held close,
compact low stance, head ducked.
[STYLE]
```

**しゃがみ攻撃（crouch attack）**
```
[CHARACTER]
POSE: crouching low and swinging the briefcase forward at ankle height,
low sweeping attack, determined expression.
[STYLE]
```

**ジャンプ攻撃（jump attack）**
```
[CHARACTER]
POSE: leaping through the air with one leg out in a flying kick,
briefcase swung forward, airborne dynamic mid-air attack pose.
[STYLE]
```

**つかまれ（grabbed）**
```
[CHARACTER]
POSE: struggling and flailing, arms up, distressed comical expression,
being held / squeezed, trying to break free.
[STYLE]
```

**やられ・ダウン（death）**
```
[CHARACTER]
POSE: knocked down, fallen on his back, dizzy with spinning stars,
comical defeated expression, briefcase dropped beside him.
[STYLE]
```

### ハゲ化（怒りモード）の不足ポーズ
既にある：idle / walk / punch（`player_bald/`）。不足＝kick / jump / fall / hurt。
上の各ポーズ文の `CHARACTER` を下に差し替えて発注：

```
CHARACTER: same salaryman "Ojisan Hox" but now COMPLETELY BALD (no hair),
face red with fury, veins popping, intense angry expression, glasses gleaming,
same dark navy suit and blue tie, "rage mode".
```

---

## 3. F1 雑魚敵（最優先・新規）

### ハグ魔（酔っぱらいおじさん）＝つかみ敵
```
CHARACTER: a tipsy drunk middle-aged Japanese man, red flushed face,
loosened necktie around the forehead, wrinkled half-open dress shirt,
rolled-up sleeves, holding a small sake bottle, sloppy grin, pot belly.
POSE A (idle): standing and swaying drunkenly.
POSE B (walk): stumbling forward with arms reaching out.
POSE C (grab): lunging forward with both arms wide open for a bear hug.
POSE D (hurt): recoiling backward, surprised.
POSE E (death): falling over knocked out, stars spinning.
[STYLE]   ※ポーズは1枚ずつ別々に生成する（POSE A〜Eを個別に）
```

### 名刺投げ（営業おじさん）＝遠距離敵
```
CHARACTER: an aggressive young-ish salesman in a cheap grey suit,
slicked hair, big fake smile, holding a stack of business cards,
flashy tie, energetic pushy posture.
POSE A (idle): standing holding a fan of business cards.
POSE B (walk): striding forward confidently.
POSE C (throw high): flinging a business card forward at head height, arm up.
POSE D (throw low): flinging a business card forward at knee height, arm low.
POSE E (hurt): flinching back. POSE F (death): falling over, cards scattering.
[STYLE]
```

---

## 4. F1 ボス：傘おじさん（最優先・新規）

```
CHARACTER: "Umbrella Ojisan", a tall stern middle-aged Japanese man,
thin and wiry, wearing a long dark trench coat over a suit,
sharp narrow eyes, slicked-back grey hair, wielding a clear plastic vinyl
umbrella like a fencing spear. Slightly larger than a normal enemy, boss presence.
POSE A (idle): standing on guard holding the umbrella like a spear.
POSE B (attack thrust): lunging forward thrusting the umbrella tip straight ahead.
POSE C (attack sweep): swinging the umbrella horizontally in a wide sweep.
POSE D (hurt): staggering back. POSE E (death): collapsing, umbrella flying off.
[STYLE]   ※傘は前方に伸ばす（上ではなく横）。足元はフレーム下端に揃える
```
> 当たり判定の高さ（TUNING `BOSS_BEHAVIOR.umbrella` と一致させる）：
> **thrust=上段/high**（胸の高さに突く）、**sweep=下段/low**（足払い気味に横振り）。
> ポーズ作画もこの高さに合わせる（thrustは水平〜やや上、sweepは低い位置で横振り）。

---

## 5. F1 背景・アイテム・弾（最優先）

**F1背景（居酒屋街）** ※横長・繰り返し可
```
SCENE: a nostalgic Japanese izakaya alley street at night, rows of small bars
with glowing red lanterns (akachochin), wooden signs, narrow neon-lit alley,
warm cozy atmosphere, retro pixel-art game background, side-scrolling stage,
horizontal layout, NO characters. flat colors, clean pixel art.
```
※背景はキャラと違い「白背景」不要。横長（ワールド幅3600px相当）を意識。

**ハゲ化アイテム（itemPowerup）**
```
ITEM: a glowing energy drink bottle (or a steaming cup of strong coffee),
golden sparkles around it, power-up item icon,
side view, isolated on pure solid white background (#FFFFFF), no shadow,
clean pixel-art style. small object.
```

**名刺の弾（projCard）**
```
ITEM: a single white business card flying through the air, motion lines behind it,
side view, isolated on pure solid white background (#FFFFFF), no shadow, pixel art.
```

---

## 5.5 F2以降の雑魚敵（新規）

### ちびリーマン（新入社員）＝飛びかかり敵・小型
```
CHARACTER: a tiny short rookie office worker, oversized ill-fitting cheap suit,
nervous eager face, messy hair, much smaller than other characters (child-like proportions),
carrying a small bag. comical underdog look.
POSE A (idle): standing nervously, hunched low.
POSE B (jump/leap): leaping forward through the air arms out, flying tackle.
POSE C (hurt): flinching back. POSE D (death): tumbling over, stars.
[STYLE]   ※ポーズは1枚ずつ別々に生成。小型なので他キャラより小さく描く
```

---

## 6. F2〜F5 ボス（後続フェーズ用・参考プロンプト）

> F1完成後に発注。`[STYLE]` と「ポーズ別に生成」「足元下端」は同じ。

**F2 ブーメラン部長**
```
CHARACTER: "Boomerang Bucho", a stout proud department manager, slicked hair,
expensive pinstripe suit, gold watch, smug face, holding manila document files
that he throws like boomerangs. Poses: idle / throw (winding up to throw a file) / hurt / death.
```

**F3 筋肉専務**
```
CHARACTER: "Muscle Senmu", a HUGE muscular bald executive bursting out of a
torn suit, enormous arms, intimidating, construction-site boss. Much larger than other bosses.
Poses: idle / grab (arms out) / charge (shoulder-ramming run) / hurt / death.
※巨体。武器なし。足元をフレーム下端に揃え、全ポーズで同じ高さ感を保つ。
```

**F4 占い師おじさん**
```
CHARACTER: "Fortune-Teller Ojisan", a mysterious old man in purple robes and
a turban, long beard, holding a glowing crystal ball, eerie smile.
Poses: idle / cast (raising crystal ball, magic glow) / hurt / death.
```
火の玉の弾＋変化形（蛇/蛾/おやつ）も別途。**4キー（projFireball / projSnake / projMoth / projSnack）を1枚ずつ個別に生成**する（1ポーズ1枚方針）：
```
PROJECTILE A (projFireball): a glowing orange fireball.
PROJECTILE B (projSnake): a small cartoon snake.
PROJECTILE C (projMoth): a fluttering moth.
PROJECTILE D (projSnack): a small snack (donut/cookie ※既存candy等で代替可).
（各々）side view, isolated on pure white background (#FFFFFF), no shadow, pixel art, small.
```

**F5 Mr.X（会長・ラスボス）**
```
CHARACTER: "Mr. X", the sinister company chairman, elegant black formal suit,
silver hair slicked back, dark sunglasses, evil confident grin, gold tie pin,
holding a cane. Final boss aura. PHASE 2 variant: same man but enraged,
sunglasses off revealing glowing eyes, jacket torn open, dramatic.
Poses: idle / attack1 (cane swing) / attack2 (kick) / phase2 idle / hurt / death.
```

---

## 6.5 残りの背景（タイトル＋F2〜F5）

> 背景は白背景不要。横長（ワールド幅3000〜4000px相当）・キャラなし・繰り返し可。
> 末尾に共通で付ける：`retro pixel-art game background, side-scrolling stage, horizontal layout, NO characters, flat colors, clean pixel art.`

**bgTitle（タイトル・ビル外観）**
```
SCENE: the exterior of a slightly shabby Japanese multi-tenant office building
at night, "X Corp Building", glowing windows, neon signs, ominous but comical mood,
a tall tower to climb. retro pixel-art game background, NO characters, flat colors.
```

**bgFloor2（オフィスフロア）**
```
SCENE: a cramped fluorescent-lit Japanese office interior, rows of desks,
PCs, paper stacks, whiteboards, cold sterile corporate atmosphere.
[背景共通文]
```

**bgFloor3（工事現場フロア）**
```
SCENE: a night construction site inside a building under renovation,
steel beams, scaffolding, exposed girders, warning lights, gritty industrial.
[背景共通文]
```

**bgFloor4（占いバーフロア）**
```
SCENE: a mysterious dimly-lit fortune-teller bar, purple and magenta lighting,
crystal balls, tarot cards, neon signs, smoky eerie nightlife mood.
[背景共通文]
```

**bgFloor5（社長室・屋上）**
```
SCENE: a luxurious top-floor executive office at night, huge windows with a
glittering city skyline, expensive desk, leather chair, dramatic final-boss room.
[背景共通文]
```

---

## 6.6 残りの弾・エフェクト

**projFile（書類ファイル弾／ブーメラン部長）**
```
ITEM: a manila document folder flying through the air spinning like a boomerang,
motion lines, side view, isolated on pure solid white background (#FFFFFF),
no shadow, pixel art.
```

**fxHit（ヒットエフェクト）**
```
EFFECT: a small comic-style impact burst / "POW" star flash, bright yellow and white,
isolated on pure solid white background (#FFFFFF), no shadow, pixel art, small.
```
> ※白背景上の白系エフェクトは抽出しにくい。**マゼンタ背景**で出すか、縁取りを濃くする。
> または透過PNGを生成AIに直接頼める場合はそちらで（要確認）。

**fxStar（やられ星）**
```
EFFECT: cartoon spinning dizzy stars (a ring of small yellow stars),
isolated on pure solid white background (#FFFFFF), no shadow, pixel art, small.
```

---

## 6.7 ハザード（F2/F3・後続フェーズ用）

> F1では不要。F2/F3着手時に。流用で済むものは流用優先。

**hazDocument（F2・落ちてくる書類束）** … 🔧 **流用優先**
- まず `spartan-hex/assets/sprites/extracted/item_core_set/big_document.png` を流用（実在確認済）。
- 新規で作るなら：
```
ITEM: a falling bundle of paper documents / a stack of office papers tumbling down,
side view, isolated on pure solid white background (#FFFFFF), no shadow, pixel art, small.
```

**hazBeam（F3・落下する鉄骨）** … 🆕 or 矩形描画で代替
- 鉄骨はほぼ長方形なので Phaser の矩形（灰色）で代替可。画像にするなら：
```
ITEM: a falling steel construction I-beam (gray metal girder), industrial,
side view, isolated on pure solid white background (#FFFFFF), no shadow, pixel art.
```

## 6.8 アイテム流用メモ
- **itemPowerup（ハゲ化アイテム）**：新規発注の前に `spartan-hex/assets/sprites/extracted/item_core_set/power_drink.png`（実在）の流用を検討。世界観が合えば発注不要。
- UI・タイトルロゴ・挑戦状・エンディングは原則コード描画/テキスト（ASSET_LIST §4.6）。画像発注は任意。

---

## 7. 発注の優先順（PRODUCTION_PLANフェーズ②と対応）

**まずF1ぶんだけ（約25点）発注する：**
1. 主人公の不足ポーズ 6種（kick / crouch / crouchAttack / jumpAttack / grabbed / death）
2. ハグ魔 5ポーズ
3. 名刺投げ 6ポーズ
4. 傘おじさん 5ポーズ
5. F1背景・ハゲ化アイテム・名刺の弾

F1が完成して手触りOKになってから、F2〜F5のボス・敵・背景を発注する。

---

## 8. うまくいかない時のコツ

- **顔や服がポーズごとに変わる** → idleを1枚決め、それを参照画像にしてNanobananaで「同じキャラのままポーズだけ変更」。DALL-E 3単体なら`CHARACTER`文を毎回フル記載
- **背景が白くならない** → プロンプトに `pure solid white background #FFFFFF, no shadow, no gradient` を強調。それでも残るなら生成後 `extract_better.py` が四隅から消す
- **足が見切れる/浮く** → `full body, standing on the bottom edge of the frame, feet visible` を追加
- **画風が写実的になる** → `pixel art, flat cel shading, bold outlines, retro game sprite` を前に出す
- **複数キャラが出る** → `single character only, one person` を追加
