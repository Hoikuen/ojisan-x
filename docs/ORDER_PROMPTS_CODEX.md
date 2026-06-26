# おじさんX Codex(画像生成)用 完全プロンプト集

作成日: 2026-06-27 ／ 対象: ojisan-x ／ 渡す先: Codex（テキスト→画像）

> 各プロンプトは**完全自己完結**（キャラ全描写入り＝参照画像なしで成立）。英語＝画像AIの精度が高い。
> 1キャラ＝1スプライトシート（全ポーズを横1列・緑背景#00FF00）。
> 納品されたら私が `extract_sheet.py --bg green` で分割→対象パスへ配置。
>
> ※**主人公(player_ojisan / player_bald)はここに含めない** — A案と同一人物にするため参照画像が要るので
>   Antigravity（A案立ち絵を添付）で `CHARACTER_DESIGN_PROMPTS.md ②③`（背景は緑に）を使う方が安全。
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

### Codexにそのまま渡す指示（MDを自動で順に処理させる）
```
このリポジトリの docs/ORDER_PROMPTS_CODEX.md を読み、P0→P1→P2の順に各イラストを生成してください。
- キャラの緑スクリーンシートは public/assets/sprites/raw_generated/ に「キャラ名_sheet.png」で保存
- 背景の不透明1枚絵は public/assets/sprites/background/ に指定ファイル名で保存
- 主人公(player_*)はスキップ（別途Antigravityで作る）
- 1枚ごとに、生成したファイル名と対応するマニフェスト項目を報告
- 緑が濁る/シートが崩れる時は、そのキャラを「1ポーズ1画像」に分けて生成し直す
```
> 補足：抽出まで自動化したい場合は、`_starter-kit/pipeline/extract_sheet.py` をこのリポジトリにコピーし、
> 「raw_generated の緑シートを extract_sheet.py で extracted_v2/<キャラ> へ展開して」と続けて指示する。
> 不安なら緑シートまでCodex／抽出はClaude、の分担が安全（コマ数や足元ズレを目視確認できる）。

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

## 主人公（参考・Antigravity推奨）
A案と同一人物にするため画像添付が要る。`CHARACTER_DESIGN_PROMPTS.md ②(通常28)③(ハゲ化14)` を使い、
背景指定だけ「pure white」→「solid flat pure green (#00FF00)」に置換して発注する。
```
（A案立ち絵を添付して）[CHARACTER_DESIGN_PROMPTS.md ②の本文]…背景は solid flat pure green (#00FF00)。
```
