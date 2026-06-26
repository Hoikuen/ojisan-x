# AGENTS.md — ojisan-x

共通ルールは `~/Developer/games/AGENTS.md` に書いてある。ここには本プロジェクト固有の情報だけを書く。

---

## このプロジェクト

『スパルタンX』(Kung-Fu Master) 相当のボリュームを目指す横スクロール2Dアクション（Phaser 3 + Vite・完全オリジナル）。
主人公「オジサンホックス」が魔の摩天楼「X商事ビル」を5フロア登り、各フロアのボスを倒して最上階のMr.Xから退職金を奪還する。
場所：`~/Developer/games/ojisan-x`（Dropbox外）/ GitHub：`Hoikuen/ojisan-x`（予定・Private）

## 現在のステータス

**設計フェーズ完了・実装未着手。** まず `docs/PRODUCTION_PLAN.md` のフェーズ②（F1素材準備）から進める。
設計を確定する前・F1の手触りが固まる前に、F2以降の実装へ進まないこと（spartan-hexの後付け崩壊の反省）。

## 着手前に必ず読む

1. `~/Developer/games/PHASER3_CONSTRAINTS.md`（共通技術ルール・必読）
2. `~/Developer/games/MISTAKES.md`（繰り返しミスの記録）
3. `docs/GAME_DESIGN.md`（コンセプト・キャラ・5フロア）
4. `docs/TECH_SPEC.md`（ワールドサイズ・シーン構成・データ駆動設計）
5. `docs/LEVEL_SPEC.md`（各フロアの中身）
6. `docs/ASSET_LIST.md`（必要素材・流用可否）
7. `docs/TUNING.md`（数値の正本）
8. `docs/PRODUCTION_PLAN.md`（進め方・作業順）

## 起動コマンド（雛形作成後）

```bash
nvm use          # Node.js 20
npm install
npm run dev      # http://127.0.0.1:5173/
npm run build
```

## プロジェクト固有の鉄則

- **5フロアをデータ駆動で**：`src/data/floors.js` の配列を `GameScene` が読む。フロア追加＝データ追加。Sceneを5個作らない。
- **スプライトは純白背景生成→`extract_better.py`抽出→目視確認**。しきい値除去は禁止。
- **全ポーズで足元をフレーム下端に揃える**（床めり込み防止）。
- 流用元はspartan-hex（主人公・フルーツ眼鏡女子・バナナ筋肉女子・大仏豚ボス・物理ヘルパー）。
- コードはspartan-hexから移植するが、1ファイル肥大化を避けてファイル分割する。
- **AIが画像を生成した場合**: 生成された生画像（アーティファクトディレクトリに保存された画像）は、ユーザーの指定がない限り必ずプロジェクト内の作業フォルダ（`public/assets/sprites/raw_generated/`）に一括コピーし、次回以降も手動で探さなくて済むようにすること。
