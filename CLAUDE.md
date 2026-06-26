# CLAUDE.md — ojisan-x（Claude Code用）

このプロジェクトのルールは `AGENTS.md` と同一。まず `AGENTS.md` を読むこと。
共通ルールは `~/Developer/games/AGENTS.md` ＋ `~/Developer/games/PHASER3_CONSTRAINTS.md` ＋ `~/Developer/games/MISTAKES.md`。

## 要点（再掲）

- 『スパルタンX』相当の5フロア横スクロールアクション（Phaser 3 + Vite・完全オリジナル）。
- **設計フェーズ完了・実装未着手**。`docs/PRODUCTION_PLAN.md` のフェーズ②（F1素材準備）から。
- F1のvertical sliceが「面白い」と確認できるまでF2以降に進まない。
- 5フロアはデータ駆動（`src/data/floors.js`）。Sceneを5個作らない。
- 透過は純白背景生成→`extract_better.py`→目視確認。床めり込み防止のため全ポーズ足元を下端に揃える。
- git設定は匿名（hoikuen ＋ noreplyメール）。削除は `rm` でなくゴミ箱へ。
