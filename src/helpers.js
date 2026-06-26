// 物理ヘルパー。spartan-hexの教訓（PHASER3_CONSTRAINTS）を反映。

// 表示サイズを目標高さに正規化（原寸がバラバラでもOK）。
export function scaleToHeight(go, targetHeight) {
  go.setScale(targetHeight / go.height);
  return go;
}

// 当たり判定をフレーム空間比率で設定。alignBottom=trueで足元揃え。
export function setBodyRatio(go, widthRatio, heightRatio, alignBottom = false) {
  const bw = go.width * widthRatio;
  const bh = go.height * heightRatio;
  go.body.setSize(bw, bh, false);
  go.body.setOffset(
    (go.width - bw) / 2,
    alignBottom ? go.height - bh : (go.height - bh) / 2
  );
}

// テクスチャ切替（見た目だけ変える。位置は一切いじらない）。
// ★重要：displayHeight を一定に正規化しているので body のworldサイズは全テクスチャで一定
//   （body高 = displayHeight × heightRatio）。つまりテクスチャ切替で body の大きさも
//   足元位置も変わらない＝床めり込み補正は不要。
//   以前は go.y= で位置を補正していたが、Arcadeは body が sprite を駆動するため、
//   この「位置の手動補正」がジャンプ中の物理と衝突してプレイヤーを落としていた。
//   位置を触らず、setTexture＋scale＋body再設定（同サイズ）だけ行うのが正解。
export function swapTexture(go, texKey, displayHeight, wRatio, hRatio) {
  if (go.texture.key === texKey) return;
  go.setTexture(texKey);
  scaleToHeight(go, displayHeight);
  setBodyRatio(go, wRatio, hRatio, true);
}

export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
