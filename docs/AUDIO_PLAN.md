# おじさんX — AUDIO PLAN（音源の方針）

作成日: 2026-06-26

> 音をどこから・どう用意するか。必要な音のリストは `ASSET_LIST.md` 第6項が正。
> ファミコン風アクションなので **8bit/チップチューン系** が世界観に合う。

---

## 0. 結論（おすすめルート）

| 種別 | おすすめ手段 | 理由 |
|---|---|---|
| **SE（効果音）** | **jsfxr / sfxr / ChipTone**（ブラウザの8bit効果音ジェネレータ） | レトロゲームSEを無料・即・大量に生成できる。世界観にドンピシャ |
| SE（実音系） | 効果音ラボ・OtoLogic（商用可フリー素材） | パンチ/ヒット等で実音が欲しい時 |
| **BGM** | **Suno AI**（チップチューン指定で生成） or フリーチップチューン素材 | フロア別BGMを手早く。AIなら雰囲気を細かく指定可 |
| BGM（フリー素材） | 魔王魂・DOVA-SYNDROME 等 | AIを使わない場合 |

> ⚠️ **私（Claude Code）は音声・音楽を生成できない。** 上記の外部ツール/素材を使う。
> どれもMac上のブラウザで完結する。

---

## 1. SE：jsfxr系ジェネレータの使い方（最優先・最も手軽）

8bitゲームのSEは「ジェネレータで作る」のが定番。コードや素材を探すより速い。

- **jsfxr**（ブラウザ）：`https://sfxr.me/` 等。プリセットボタンが秀逸：
  - **Pickup/Coin** → アイテム取得・スコア
  - **Laser/Shoot** → 名刺/弾の発射
  - **Hit/Hurt** → ヒット・被弾
  - **Jump** → ジャンプ
  - **Explosion** → 敵撃破・ボス撃破
  - **Powerup** → ハゲ化
- 「Randomize」連打→気に入ったものを **Export (.wav)** → `assets/audio/` に保存
- 1音数秒で作れる。`ASSET_LIST` のSE約10種は30分で揃う

### ASSET_LIST SE ↔ ジェネレータ対応

| キー | 用途 | プリセット目安 |
|---|---|---|
| sePunch | パンチ | Hit/Hurt（短く硬め） |
| seKick | キック | Hit/Hurt（やや低め） |
| seHit | ヒット | Hit/Hurt（抜けの良い音） |
| seHurt | 被弾 | Hurt（下降音） |
| seGrab | つかまれ | Hurt/低い唸り（焦り感） |
| seJump | ジャンプ | Jump |
| sePowerup | ハゲ化 | Powerup（上昇音） |
| seEnemyDown | 敵撃破 | Explosion（軽め） |
| seBossDown | ボス撃破 | Explosion（大きめ・派手） |
| seStageClear | クリア | Powerup/上昇ジングル |
| seGameOver | ゲームオーバー | 下降ジングル |

---

## 2. BGM：Suno AI での発注例（チップチューン）

フロア別に雰囲気を変えると「登っている」感が出る。Sunoのプロンプト例：

```
chiptune, 8-bit, retro NES game music, upbeat fast-paced action,
looping, energetic, [フロアの雰囲気]
```

| キー | フロア/場面 | 雰囲気プロンプト追記 |
|---|---|---|
| bgmTitle | タイトル | catchy, inviting, a bit comedic |
| bgmStage | 通常フロア | driving beat, adventurous, climbing tension |
| bgmBoss | ボス戦 | intense, dramatic, urgent |
| bgmClear | 全クリア | triumphant, victorious fanfare |

- ループ素材として書き出す。長さは1〜2分でループさせれば十分。
- AIを使わないなら「魔王魂」等のチップチューンBGM（商用可・クレジット規定を確認）。

---

## 3. ファイル形式・実装

- 形式：**.wav（SE）/ .mp3 or .ogg（BGM）**。Phaserは両対応
- 置き場所：`assets/audio/`
- **全キーを `preload()` でロード**（プリロード漏れ＝再生時クラッシュ・PHASER3 #4）
- 音量：SEは小さめ（0.4前後）、BGMはさらに小さめ（0.25前後）。`TUNING`で一元管理してもよい
- ブラウザの自動再生制限：最初のユーザー操作（スタート押下）後にBGM開始する

---

## 4. 著作権・ライセンス（重要）

- **フリー素材でも利用規約を必ず確認**（商用可否・クレジット表記・改変可否）。
- 効果音ラボ／魔王魂／OtoLogic／DOVA等は規約が異なる。公開・収益化する場合は要確認。
- jsfxrで自分が生成した音・Sunoの生成物は基本自由度が高いが、各サービスの規約に従う。
- 市販ゲームのBGM/SEの吸い出し・流用はしない（オリジナルで作る）。

---

## 5. MVP（F1）に必要な音だけ先に

F1を遊べるようにするなら、まずこれだけ：
- sePunch / seHit / seHurt / seJump / seEnemyDown / seBossDown / seStageClear
- bgmStage（通常）/ bgmBoss（ボス戦）

→ **jsfxrでSE7種（30分）＋ SunoでBGM2種**で、F1の音は完成する。
残り（タイトルBGM・ゲームオーバー等）はF1の手触り確認後でよい。

---

## 6. まとめ：今やること

1. 画像素材（`ART_PROMPTS.md`）でF1ぶんを発注・抽出
2. 並行して **jsfxrでF1のSE7種**を作る（最速・無料）
3. **SunoでbgmStage / bgmBoss** を生成
4. これでF1 vertical sliceに必要な「画像＋音」が揃う
