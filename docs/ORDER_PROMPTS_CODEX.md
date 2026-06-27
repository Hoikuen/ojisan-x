# おじさんX Codex(画像生成)用 完全プロンプト集

作成日: 2026-06-27 ／ 対象: ojisan-x ／ 渡す先: Codex（テキスト→画像）

> 各プロンプトは**完全自己完結**（キャラ全描写入り＝参照画像なしで成立）。英語＝画像AIの精度が高い。
> 1キャラ＝1スプライトシート（全ポーズを横1列・緑背景#00FF00）。
> 納品されたら私が `extract_sheet.py --bg green` で分割→対象パスへ配置。
>
> 主人公(player_ojisan / player_bald)もCodexで生成する（P0-0・P1-0）。同一人物を保つため、可能なら
>   ojisan-hopのA案シートを参照画像に渡す。参照不可でも下の文章記述だけで同一おじさんとして成立する。
>
> ⚠️ DALL-E系は単色背景にシーンを足したがる癖がある。各プロンプト末尾の「solid flat pure green」を強調。
>   もしシートが崩れる/緑が濁る場合は「make each pose as a SEPARATE image」に切替（各ポーズ単体生成）。

---

## 0. Codexへの渡し方・出力先（最初に読む）

### 保存先（種類で違う・重要）
| 種類 | 保存先 | 理由 |
|---|---|---|
| **キャラの緑シート**（敵・ボス・弾・FX） | `public/assets/sprites/raw_generated/` | 緑のまま。**まだ最終フォルダに入れない**。Claude側が緑抜き＆分割して `extracted_v2/` へ移す |
| **背景・タイトル**（不透明1枚絵） | `public/assets/sprites/background/`（`floor1.png`等） | 加工不要。そのまま配置＝今マップ等が出てる場所でOK |

⚠️ 緑シートを `extracted_v2/` に直接入れると、緑背景の8枚並び画像が1キャラとして表示され壊れる。必ず `raw_generated/` へ。

### 発注は「グループ単位」で区切って出す（推奨・重要）
一括（P0→P2を一気に）ではなく、**1グループずつ指示 → 納品確認 → 次**、で進める。
理由：Codexが各キャラに集中でき品質が安定／こちら(Claude)が緑抜き・整列・コマ数を都度確認できて事故が減る。

**推奨の順番（1グループ＝1キャラ群 or 1テーマ）：**
1. F1 敵・ボス・背景（hug / card / umbrella / floor1 / 小物）　※ほぼ完了
2. **主人公・通常**（P0-0／5シート）
3. **主人公・ハゲ化**（P1-0／3シート）
4. F2-F3（chibi / boomerang / muscle / floor2・floor3 背景）
5. F4-F5（fortune / mrx / floor4・floor5 背景 / 変化弾・ビーム）

**各グループはこのテンプレで指示（{ } を埋める）：**
```
まず git pull で最新の docs/ORDER_PROMPTS_CODEX.md を取得（ローカルが最新ならスキップ）。
そのうえで {対象セクション 例: P0-0（主人公・通常）} だけを生成してください。
- キャラの緑シートは public/assets/sprites/raw_generated/ に「シート名_sheet.png」で保存
- 背景の不透明1枚絵は public/assets/sprites/background/ に指定ファイル名で保存
- 1枚ごとにファイル名を報告。緑が濁る/崩れる時はそのシートを作り直す
- （主人公の時だけ）全シートで頭身・体の大きさ・足元位置を統一。可能ならA案シートを参照画像に
このグループだけ。次のグループは私（人間）が改めて指示します。
```
> 「git pull」を先頭に入れてあるのは、Codexがクローン/別環境で作業するタイプでも最新MDを確実に読むため。
> Codexがローカルリポジトリ（`~/Developer/games/ojisan-x`）を直接編集するタイプなら、MDは既に最新なのでpullは何も起きない（害なし）。
> ＝ **「git pullして」と別メッセージにする必要はない**。上のテンプレ1枚を貼ればOK。

> 補足：緑抜き＆配置はClaude側でやる分担が安全（コマ数・足元ズレを目視確認できる）。
> 抽出までCodexに任せたい場合のみ `_starter-kit/pipeline/extract_sheet.py` をコピーして指示する。

---

## 共通スタイル（各プロンプト末尾に自動で入れてある定型）
```
Style: cute retro 16-bit pixel-art game sprite, bold dark outlines, flat cel shading, vibrant colors.
Side view, facing right, full body, feet resting on the very bottom edge of the frame.
Isolated on a SOLID FLAT pure green chroma-key background (#00FF00) filling the entire image —
no gradient, no scenery, no shadow, no floor, no text. Single character only.
Lay out all poses in ONE horizontal row, evenly spaced, the SAME character at the SAME scale in every pose,
all feet aligned to the bottom. (If multi-pose is unreliable, make each pose as a separate image with this exact description.)
```

---

# P0（F1・最優先）

## P0-0 主人公おじさん（通常版・格闘28コマ）→ `extracted_v2/player_ojisan/` ★最重要 [Codexで生成]
- **5枚の緑シート**に分けて発注（コマ多数のため）。**全シートで同一人物・同一頭身・同一スケール・足元下端を厳守**（ここが崩れると後で全部やり直し）。
- 可能なら ojisan-hop の `assets/sprites/player/source/player_normal_a_classic_sheet_chromakey_20260626.png` を**参照画像**に使う（同じA案おじさんにするため）。
- 保存名：`player_basic_sheet.png` / `player_attack_sheet.png` / `player_crouch_sheet.png` / `player_air_sheet.png` / `player_react_sheet.png`
- 共通キャラ記述（毎回入れる）：
```
A friendly chubby middle-aged Japanese salaryman ("Ojisan"): white-framed sunglasses, black mustache,
side-parted black hair (slightly receding), rosy pink cheeks, dark navy business suit, white shirt, red necktie,
plump round belly, short limbs, soft double chin. Cute retro 16-bit pixel-art, bold outlines, flat cel shading.
Glasses: only a thin light-gray reflection at the lens edge, NO large black reflection.
KEEP THE EXACT SAME character, same head-to-body ratio and SAME overall size in every pose across ALL sheets.
Side view facing right, full body, feet on the very bottom edge.
Solid flat pure green chroma-key background (#00FF00), no gradient/scenery/shadow/text. One pose per cell, evenly spaced in one row, feet aligned.
```
- 各シートのポーズ（↑の記述の後に続ける）：
  - **player_basic_sheet**（6コマ：idle_1, idle_2, walk_1, walk_2, walk_3, walk_4）
    `Poses: (1) idle standing relaxed; (2) idle slight breathing (shoulders a touch higher); (3-6) a 4-frame walk cycle (right foot fwd / passing / left foot fwd / passing).`
  - **player_attack_sheet**（6コマ：punch_1, punch_2, punch_3, kick_1, kick_2, kick_3）
    `Poses: (1) punch wind-up; (2) punch full extension (briefcase/fist forward); (3) punch recover; (4) kick wind-up (leg back); (5) kick full extension (leg forward); (6) kick recover.`
  - **player_crouch_sheet**（5コマ：crouch_1, crouch_2, crouch_attack_1, crouch_attack_2, crouch_attack_3）
    `Poses: (1) crouch low guard; (2) crouch slight shift (still low); (3) crouch-attack wind-up low; (4) crouch-attack swing forward at ankle height; (5) crouch-attack recover. (Crouch poses are clearly lower/compact.)`
  - **player_air_sheet**（4コマ：jump, fall, jump_attack_1, jump_attack_2）
    `Poses: (1) jump rising (legs tucked); (2) fall descending (legs apart); (3) jump-attack air wind-up; (4) jump-attack flying kick/strike.`
  - **player_react_sheet**（7コマ：grabbed_1, grabbed_2, hurt_1, hurt_2, death_1, death_2, death_3）
    `Poses: (1) grabbed struggling one way; (2) grabbed struggling the other (jitter); (3) hurt recoil start; (4) hurt recoil max; (5) death stagger; (6) death falling; (7) knocked-out on the ground with dizzy stars.`

## P0-2 ハグ魔（酔っぱらい）→ `extracted_v2/hug/`（5ポーズ: idle, walk, grab, hurt, death）
```
A tipsy drunk middle-aged Japanese salaryman: red flushed face, a loosened necktie tied around his forehead,
a wrinkled half-open dress shirt with rolled-up sleeves, a round pot belly, holding a small sake bottle, sloppy drunken grin.
Make these 5 poses in one horizontal row:
(1) idle = standing and swaying drunkenly;
(2) walk = stumbling forward with both arms reaching out;
(3) grab = lunging forward with BOTH arms wide open for a big bear hug;
(4) hurt = recoiling backward, surprised;
(5) death = falling over knocked out with little spinning stars.
Style: cute retro 16-bit pixel-art game sprite, bold dark outlines, flat cel shading, vibrant colors.
Side view, facing right, full body, feet on the very bottom edge. Solid flat pure green background (#00FF00),
no gradient/scenery/shadow/text. Same character, same scale, feet aligned, evenly spaced in one row.
```

## P0-3 名刺投げ（営業）→ `extracted_v2/card/`（6ポーズ: idle, walk, throw_high, throw_low, hurt, death）
```
An aggressive young-ish Japanese salesman in a cheap shiny grey suit, slicked-back hair, big fake smile,
a flashy necktie, holding a stack of business cards.
Make these 6 poses in one horizontal row:
(1) idle = standing holding a fan of business cards;
(2) walk = striding forward confidently;
(3) throw_high = flinging a business card forward at HEAD height, throwing arm raised;
(4) throw_low = flinging a business card forward at KNEE height, throwing arm low;
(5) hurt = flinching back;
(6) death = falling over as business cards scatter around him.
Style: cute retro 16-bit pixel-art sprite, bold outlines, flat cel shading. Side view facing right, full body,
feet on bottom edge. Solid flat pure green background (#00FF00), no gradient/scenery/shadow/text.
Same character, same scale, feet aligned, evenly spaced in one row.
```

## P0-4 ボス：傘おじさん → `extracted_v2/umbrella/`（5ポーズ: idle, thrust, sweep, hurt, death）
```
"Umbrella Ojisan", a tall, thin, stern middle-aged Japanese man, wiry build, wearing a long dark trench coat
over a suit, sharp narrow eyes, slicked-back grey hair, wielding a CLEAR PLASTIC VINYL UMBRELLA like a fencing spear.
Slightly larger than a normal enemy, with boss presence. Leave extra room around the umbrella (it extends sideways).
Make these 5 poses in one horizontal row:
(1) idle = on guard, holding the umbrella forward like a spear;
(2) thrust = lunging forward, thrusting the umbrella tip straight ahead at chest height;
(3) sweep = swinging the umbrella LOW in a wide horizontal foot-sweep;
(4) hurt = staggering backward;
(5) death = collapsing as the umbrella flies off.
Style: cute retro 16-bit pixel-art sprite, bold outlines, flat cel shading. Side view facing right, full body,
feet on bottom edge. Solid flat pure green background (#00FF00), no gradient/scenery/shadow/text.
Same character, same scale, feet aligned, evenly spaced in one row.
```

## P0-5 F1背景「居酒屋街」→ `background/floor1.png`（不透明・緑不要）
```
A side-scrolling 2D game background: a nostalgic Showa-era Japanese izakaya alley at night — rows of tiny bars
with glowing red paper lanterns (akachochin), wooden signs, warm neon glow, a narrow cozy alley. Cheerful, not scary.
Retro 16-bit pixel-art game background, flat colors, horizontal side-scrolling layout, designed to tile/repeat
left-to-right. Keep the middle-and-lower band low in detail and saturation so foreground characters stand out.
NO characters, NO text, NO logos. Size 1536x864. Opaque full illustration (no transparency).
```

## P0-6 小物（弾・アイテム・FX）
```
[proj/card.png]   A single white business card flying through the air with motion lines. Pixel-art, small object,
                  solid flat pure green background (#00FF00), no shadow.
[items/powerup.png] A glowing energy-drink bottle with golden sparkles, power-up item icon. Pixel-art, small,
                  solid flat pure green background (#00FF00), no shadow.   ※ojisan-hopのpower_drink流用も可
[items/cash.png]  A small neat stack of cash / bills with a paper band. Pixel-art, small, solid green bg (#00FF00).
[fx/hit.png]      A small comic-style impact burst "POW", bright yellow and white. Pixel-art, small.
                  ※白系FXは緑だと縁が出やすい→ solid flat pure MAGENTA background (#FF00FF) で出す。
[fx/star.png]     A ring of small yellow cartoon dizzy stars. Pixel-art, small, solid flat MAGENTA background (#FF00FF).
```

---

# P1（F2–F3）

## P1-0 主人公おじさん（ハゲ化＝パワーアップ版・14コマ）→ `extracted_v2/player_bald/` [Codexで生成]
- **3枚の緑シート**で発注。P0-0と**同一人物・同一スケール・足元下端**。変えるのは「完全なスキンヘッド＋激怒の赤面＋湯気/オーラ」だけ。
- 可能なら ojisan-hop の `player_powered_a_classic_sheet_chromakey_20260627.png` を参照画像に。
- 保存名：`bald_basic_sheet.png` / `bald_attack_sheet.png` / `bald_air_sheet.png`
- 共通キャラ記述：
```
The SAME "Ojisan" salaryman as the normal version but now COMPLETELY BALD (shiny skinhead, no hair),
face red with fury, steam/aura around him, intense angry eyes. Same navy suit, white shirt, red tie, plump body,
white-framed sunglasses. Same head-to-body ratio and SAME overall size as the normal version, feet on bottom edge.
Cute retro 16-bit pixel-art, bold outlines, flat cel shading. Solid flat pure green background (#00FF00), one pose per cell, feet aligned.
```
- 各シートのポーズ：
  - **bald_basic_sheet**（6コマ：idle_1, idle_2, walk_1, walk_2, walk_3, walk_4）＝怒り待機×2＋怒り歩き4コマ
  - **bald_attack_sheet**（4コマ：punch_1, punch_2, kick_1, kick_2）＝殴り引き/当て・蹴り引き/当て
  - **bald_air_sheet**（4コマ：jump, fall, hurt_1, hurt_2）＝ジャンプ・落下・被弾×2

## P1-2 ちびリーマン（新入社員・小型）→ `extracted_v2/chibi/`（4ポーズ: idle, jump, hurt, death）
```
A tiny short rookie Japanese office worker, MUCH SMALLER than other characters (child-like proportions),
wearing an oversized ill-fitting cheap suit, a nervous eager face, messy hair, carrying a small bag.
Make these 4 poses in one horizontal row:
(1) idle = standing nervously, hunched low;
(2) jump = leaping forward through the air with both arms out, a flying tackle;
(3) hurt = flinching back;
(4) death = tumbling over with little stars.
Style: cute retro 16-bit pixel-art sprite, bold outlines, flat cel shading. Side view facing right, full body,
feet on bottom edge. Solid flat pure green background (#00FF00), no gradient/scenery/shadow/text.
Same character, same scale, feet aligned, evenly spaced in one row. (Draw him clearly smaller than a normal adult.)
```

## P1-3 ボス：ブーメラン部長 → `extracted_v2/boomerang/`（4ポーズ: idle, throw, hurt, death）
```
"Boomerang Bucho", a stout, proud Japanese department manager, slicked-back hair, an expensive pinstripe suit,
a gold wristwatch, a smug face, who throws manila document folders like boomerangs.
Make these 4 poses in one horizontal row:
(1) idle = standing smugly with arms crossed;
(2) throw = winding up and hurling a manila document folder forward;
(3) hurt = flinching;
(4) death = falling over.
Style: cute retro 16-bit pixel-art sprite, bold outlines, flat cel shading. Side view facing right, full body,
feet on bottom edge. Solid flat pure green background (#00FF00), no gradient/scenery/shadow/text.
Same character, same scale, feet aligned, evenly spaced in one row.
```

## P1-4 ボス：筋肉専務（巨体）→ `extracted_v2/muscle/`（5ポーズ: idle, grab, charge, hurt, death）
```
"Muscle Senmu", a HUGE muscular bald Japanese executive bursting out of a torn business suit, enormous arms,
intimidating, a construction-site boss, MUCH larger than other bosses, no weapon.
Make these 5 poses in one horizontal row, all at the same LARGE scale with feet aligned:
(1) idle = standing menacingly;
(2) grab = both arms spread wide to grab;
(3) charge = a shoulder-ramming forward run;
(4) hurt = staggering;
(5) death = collapsing.
Style: cute retro 16-bit pixel-art sprite, bold outlines, flat cel shading. Side view facing right, full body,
feet on bottom edge. Solid flat pure green background (#00FF00), no gradient/scenery/shadow/text.
Same character, same scale, feet aligned, evenly spaced in one row.
```

## P1-5 背景 F2「オフィス」/ F3「工事現場」→ `background/floor2.png`,`floor3.png`（不透明）
```
[floor2] A side-scrolling 2D game background: a cramped fluorescent-lit Japanese office interior — rows of desks,
PCs, stacks of paper, whiteboards, a cold sterile corporate mood. Retro 16-bit pixel-art, flat colors, horizontal
tileable layout. Middle-lower band low detail/saturation. NO characters/text/logos. Size 1536x864. Opaque.

[floor3] A side-scrolling 2D game background: a night construction site inside a building under renovation —
steel beams, scaffolding, exposed girders, warning lights, gritty industrial mood. Retro 16-bit pixel-art, flat colors,
horizontal tileable layout. Middle-lower band low detail/saturation. NO characters/text/logos. Size 1536x864. Opaque.
```

## P1-6 弾：projFile → `proj/file.png`
```
A manila document folder spinning through the air like a boomerang, with motion lines. Pixel-art, small object,
solid flat pure green background (#00FF00), no shadow.
```

---

# P2（F4–F5・ラスト）

## P2-1 ボス：占い師おじさん → `extracted_v2/fortune/`（4ポーズ: idle, cast, hurt, death）
```
"Fortune-Teller Ojisan", a mysterious old man in flowing purple robes and a turban, a long beard, holding a glowing
crystal ball, an eerie smile.
Make these 4 poses in one horizontal row:
(1) idle = standing calmly;
(2) cast = raising the crystal ball high with a magical glow;
(3) hurt = flinching;
(4) death = collapsing.
Style: cute retro 16-bit pixel-art sprite, bold outlines, flat cel shading. Side view facing right, full body,
feet on bottom edge. Solid flat pure green background (#00FF00), no gradient/scenery/shadow/text.
Same character, same scale, feet aligned, evenly spaced in one row.
```

## P2-2 ボス：Mr.X（ラスボス）→ `extracted_v2/mrx/`（6ポーズ: idle, attack1, attack2, phase2, hurt, death）
```
"Mr. X", the sinister Japanese company chairman: an elegant black formal suit, silver slicked-back hair,
dark sunglasses, an evil confident grin, a gold tie pin, holding a cane. Final-boss aura.
Make these 6 poses in one horizontal row:
(1) idle = standing with the cane;
(2) attack1 = swinging the cane forward;
(3) attack2 = a sharp kick;
(4) phase2 = ENRAGED — sunglasses off revealing glowing eyes, jacket torn open, dramatic;
(5) hurt = staggering;
(6) death = collapsing.
Style: cute retro 16-bit pixel-art sprite, bold outlines, flat cel shading. Side view facing right, full body,
feet on bottom edge. Solid flat pure green background (#00FF00), no gradient/scenery/shadow/text.
Same character (poses 1-3,5-6 with sunglasses; pose 4 enraged), same scale, feet aligned, evenly spaced in one row.
```

## P2-3 弾：火の玉と変化形（占い師）→ `proj/fireball.png`,`snake.png`,`moth.png`
```
[fireball] A glowing orange fireball with a little flame trail. Pixel-art, small, solid flat green bg (#00FF00).
[snake]    A small cute cartoon snake, coiled and flying forward. Pixel-art, small, solid flat green bg (#00FF00).
[moth]     A small fluttering moth. Pixel-art, small, solid flat green bg (#00FF00).
```

## P2-4 ビーム（ハゲ化攻撃）→ `proj/beam.png`
```
A short bright horizontal energy beam, yellow and white, with a glowing tip. Pixel-art, small,
solid flat pure MAGENTA background (#FF00FF) (so the bright beam edges extract cleanly), no shadow.
```

## P2-5 背景 F4「占いバー」/ F5「社長室」→ `background/floor4.png`,`floor5.png`（不透明）
```
[floor4] A side-scrolling 2D game background: a dim mysterious fortune-teller bar — purple and magenta lighting,
crystal balls, tarot cards, neon signs, a smoky eerie nightlife mood. Retro 16-bit pixel-art, flat colors,
horizontal tileable layout. Middle-lower band low detail/saturation. NO characters/text/logos. Size 1536x864. Opaque.

[floor5] A side-scrolling 2D game background: a luxurious top-floor executive office at night — huge windows with a
glittering city skyline, an expensive desk, a leather chair, a dramatic final-boss room. Retro 16-bit pixel-art,
flat colors, horizontal tileable layout. Middle-lower band low detail/saturation. NO characters/text/logos. Size 1536x864. Opaque.
```

## P2-6 タイトル背景（任意）→ `background/title.png`
```
A 2D game title screen background: the exterior of a slightly shabby Japanese multi-tenant office building at night,
"X Corp" tower to climb, glowing windows, neon signs, an ominous but comical mood. Retro 16-bit pixel-art, flat colors.
NO characters, NO readable text/logos. Size 1536x864. Opaque.
```

---

## 主人公の発注について（CodexでOK）
主人公はこのファイルの **P0-0（通常28コマ／5シート）** と **P1-0（ハゲ化14コマ／3シート）** で発注する。
他キャラと同じくCodexで生成。同一人物を保つコツ：
- 可能なら ojisan-hop の A案シート（`assets/sprites/player/source/player_normal_a_classic_sheet_chromakey_20260626.png` ／ powered版）を**参照画像**に渡す。
- **全シートで頭身・体の大きさ・足元位置を統一**するよう毎回強調（バラつくと後で全コマ整列し直しになる）。
- 納品後はClaude側が**通常28コマ／ハゲ化14コマを"全コマ共通キャンバス"で一括整列**して `player_ojisan/`・`player_bald/` に配置する（サイズのガクつき防止）。
- 詳しいコマ割りの正本は `CHARACTER_DESIGN_PROMPTS.md ②③`（背景は緑#00FF00に読み替え）。
