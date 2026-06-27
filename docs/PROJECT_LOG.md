# PROJECT_LOG — おじさんX（ojisan-x）

進捗・判断ログと、チャット間の引き継ぎ。新しいチャットは末尾の最新「🔄 引き継ぎ」をまず読む。

---

## 🔄 引き継ぎ（2026-06-27）

### 0. 一行で
F1の絵は本物化して反映済み。**Codexから主人公・F2〜F5の敵ボス・弾・背景が大量に届いたが、まだ抽出/統合していない**。次チャットはこれらを抽出して組み込むのが主タスク。

### 1. 今セッションでやったこと（commit済み）
- F2〜F5（全5フロア）をプレースホルダで実装。ボスをデータ駆動化（umbrella/boomerang/muscle/fortune/buddha/mrx、攻撃kind=melee/projectile/charge/grab＋mrxフェーズ2）。`reading 'sys'` クラッシュを `!this.active` ガードで修正。
- 主人公フルアニメ対応（通常28＋ハゲ化14＝42コマ）。`PLAYER_ANIMS` を normal/bald の2セット化、`BootScene` が2セット総なめでアニメ自動生成、`Player.applyVisual` を攻撃ワンショット/しゃがみ高さ/ハゲ化アニメ対応に。
- 発注ドキュメント整備：`docs/ORDER_MANIFEST.md`（全体）、`docs/ORDER_PROMPTS_CODEX.md`（Codex用・完全プロンプト＋グループ単位発注＋主人公P0-0/P1-0＋出力先ルール）。
- 抽出ツール `tools/extract_row_sheet.py` 新規（横1列の緑シート→「均等目安×最小インク切れ」で分割→共通キャンバス足元揃え）。
- **F1の絵を本物化して反映・push・デプロイ済み**：hug/card/umbrella（extract_row_sheetで抽出）、proj/card・items/powerup・items/cash・fx/hit（マゼンタ抜き）、floor1背景（居酒屋街）。全18 Playwrightテストgreen。
- 全コミットは匿名ID（hoikuen）。最新コミット `e7ddb9e`。

### 2. 今まさに作業中＝未コミットの変更（重要・次の主タスク）
Codexが `public/assets/sprites/raw_generated/` に**新規納品（緑シート、未抽出）**：
- **主人公・通常 5シート**（バルド版はまだ未納品）：
  - `player_basic_sheet.png` → idle_1,idle_2,walk_1,walk_2,walk_3,walk_4（6コマ）
  - `player_attack_sheet.png` → punch_1,punch_2,punch_3,kick_1,kick_2,kick_3（6）
  - `player_crouch_sheet.png` → crouch_1,crouch_2,crouch_attack_1,crouch_attack_2,crouch_attack_3（5）
  - `player_air_sheet.png` → jump,fall,jump_attack_1,jump_attack_2（4）
  - `player_react_sheet.png` → grabbed_1,grabbed_2,hurt_1,hurt_2,death_1,death_2,death_3（7）
  - 出力先 `public/assets/sprites/extracted_v2/player_ojisan/`
- **F2〜F5 敵・ボス 緑シート**：
  - `chibi_sheet.png` → idle,jump,hurt,death（4）→ `extracted_v2/chibi/`
  - `boomerang_sheet.png` → idle,throw,hurt,death（4）→ `extracted_v2/boomerang/`
  - `muscle_sheet.png` → idle,grab,charge,hurt,death（5）→ `extracted_v2/muscle/`
  - `fortune_sheet.png` → idle,cast,hurt,death（4）→ `extracted_v2/fortune/`
  - `mrx_sheet.png` → idle,attack1,attack2,phase2,hurt,death（6）→ `extracted_v2/mrx/`
  - ※正確なコマ名は `src/entities/Enemy.js`・`Boss.js` の TEX を必ず確認して合わせる。
- **弾ソース（背景色は要確認＝緑かマゼンタか）**：`proj_file_source.png` `proj_fireball_source.png` `proj_snake_source.png` `proj_moth_source.png` `proj_beam_source.png` → `proj/file.png` `fireball.png` `snake.png` `moth.png` `beam.png`
- **背景（不透明・配置済み）**：`background/floor2.png` floor3 floor4 floor5 title.png は**もう置かれている**（_source_generated付き）。

その他の未コミット：
- `public/assets/sprites/proj/*`（beam/file/fireball/moth/snake）, `fx/star.png`, `fx/hit.png`, `items/*`, `proj/card.png`, `background/title.png` が「M（変更）」。**私(Claude)が触っていないものも含むので、次チャットは中身を必ず目視確認**（緑が残った生シートが直接置かれていないか）してから採用/コミットすること。
- `.claude/`（サンドボックス設定。次回サンドボックス起動に必要なので消さない）。

### 3. 既知の問題・未解決
- **主人公の整列**：`extract_row_sheet.py` は「1シート内」で共通キャンバスを作る。主人公は**5シートにまたがる**ので、そのまま個別抽出するとシート間で体の大きさがズレてidle↔punchでガクつく恐れ。→ **5シート全28コマを"1つの共通キャンバス"で揃えて出す**処理が必要（ツール拡張 or 5シートまとめ読みして最大bboxを共有）。ここが今回の一番の注意点。
- **floor2〜5 背景が未使用**：`src/data/floors.js` は全フロア `background: 'bgFloor1'` のまま。floor2-5を使うには `src/data/assets.js` の IMAGES に `bgFloor2..5` キー追加＋floors.jsの各フロアbg差し替え（＝軽いコード変更）。title背景も同様に未配線の可能性あり。
- **主人公ハゲ化（bald）未納品**：`bald_basic_sheet/bald_attack_sheet/bald_air_sheet` がまだ来ていない（ORDER_PROMPTS_CODEX P1-0で発注）。
- **流用キャラ未コピー**：fruit(schoolgirl_fix)・banana(gorilla_fix)・大仏豚(boss) は ojisan-hop から未コピー。`extracted_v2/` は今プレースホルダ。
- raw_generated が public配下で公開サイトにも出る（容量増。優先度低・未対応）。

### 4. 次にやること（手順）
1. **主人公・通常を抽出**：5シートを**全28コマ共通キャンバスで**整列して `extracted_v2/player_ojisan/` へ（上記コマ名で）。チェッカーで透過＋足元＋サイズ一貫を目視確認。
2. **F2-5 敵ボスを抽出**：`extract_row_sheet.py --src raw_generated/<x>_sheet.png --out public/assets/sprites/extracted_v2/<x> --frames <Enemy/Boss.jsのTEX順>`。各チェッカー確認。
3. **弾を抽出**：各 `proj_*_source.png` の四隅色で緑/マゼンタ判定 → dechroma+autocrop → `proj/*.png`。
4. **背景を配線**：assets.js に bgFloor2..5（＋title）キー追加 → floors.js の各フロア background を差し替え。
5. **流用コピー**：ojisan-hop の fruit_glasses_girl→schoolgirl_fix、banana_muscle_girl→gorilla_fix、final_buddha_pig_boss→boss、へファイルをコピー＆名前マッピング（ORDER_MANIFESTの「流用」表参照）。
6. **「M」ファイル群を目視確認**してから採用。
7. `npm run build` → `npx playwright test`（18件green維持）→ 匿名IDで commit → push（自動デプロイ）。
8. ハゲ化シート（bald_*）が届いたら同様に抽出。

### 5. 起動・URL・主要ファイル
- ローカル：`npm run dev`（Vite, http://localhost:5173/）。本番：https://hoikuen.github.io/ojisan-x/ 。テスト：`npx playwright test`。
- 主に触る：`src/data/assets.js`（IMAGESマニフェスト/PLAYER_ANIMS/TEX）、`src/data/floors.js`、`src/entities/{Player,Enemy,Boss,Projectile}.js`、`src/scenes/{BootScene,GameScene}.js`、`tools/extract_row_sheet.py`、`docs/ORDER_PROMPTS_CODEX.md`、`public/assets/sprites/{raw_generated,extracted_v2,background,proj,items,fx}/`。

### 6. 今セッションで決めた方針・判断
- **緑スクリーン(#00FF00)シート方式**に統一（旧白背景の白フチ問題を回避）。白系FX/ビームは**マゼンタ(#FF00FF)背景**で発注。
- **発注はグループ単位で区切る**（一括しない）。推奨順：F1敵→主人公通常→主人公ハゲ化→F2-3→F4-5。各グループ指示テンプレは ORDER_PROMPTS_CODEX §0（先頭にgit pull内包）。
- **主人公もCodexで生成**（Antigravity限定をやめた）。A案シートを参照画像に使い、全シートで頭身/サイズ/足元を統一させる。**緑抜き＆整列はClaude側**でやる（Codexはシートまで）。
- Codex出力先：キャラ緑シート→`raw_generated/`、背景の不透明絵→`background/`。
- fruit/banana/大仏豚は ojisan-hop から流用（発注しない）。
- git identity は匿名固定。公開リポジトリなので実名混入を毎回チェック。
