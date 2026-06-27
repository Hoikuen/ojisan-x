# CLAUDE.md — ojisan-x（Claude Code用）

**最優先：`docs/PROJECT_LOG.md` の最新「🔄 引き継ぎ」を最初に読む**（前回状態・未統合の納品物・次の手順・検証の落とし穴）。
このプロジェクトのルールは `AGENTS.md` と同一。共通ルールは `~/Developer/games/AGENTS.md` ＋ `PHASER3_CONSTRAINTS.md` ＋ `MISTAKES.md`。

## 要点（現状 2026-06-27）

- 『スパルタンX』相当の5フロア横スクロールアクション（Phaser 3 + Vite・完全オリジナル）。
- **実装進行中**：全5フロアはプレースホルダで動作（全18 Playwrightテストgreen）。**F1の絵は本物化済み**（ハグ魔/名刺/傘ボス/居酒屋街背景/弾/アイテム/FX）。主人公とF2〜F5の絵は **Codex納品分が `public/assets/sprites/raw_generated/` に届いていて未抽出**（PROJECT_LOG参照）。
- 5フロアはデータ駆動（`src/data/floors.js`）。Sceneを5個作らない。ボスもデータ駆動（`src/entities/Boss.js`）。
- **透過＝緑スクリーン(#00FF00)方式**。横1列シートは `tools/extract_row_sheet.py` で抽出（白系FXはマゼンタ背景）。全ポーズ足元を下端に揃える。
- 発注は `docs/ORDER_PROMPTS_CODEX.md`（Codex用・グループ単位）／`docs/ORDER_MANIFEST.md`（全体）。
- git設定は匿名（hoikuen ＋ noreplyメール）。公開リポジトリなので実名混入を毎回チェック。削除は `rm` でなくゴミ箱へ。
