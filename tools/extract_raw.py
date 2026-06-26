#!/usr/bin/env python3
"""
raw_generated/ の白背景画像（JPG/PNG）を高品質に透過抽出して extracted_v2/ へ配置。
- 角から固定レンジflood-fill（内部の白＝シャツ等は連結していないので保護）
- 小さなゴミ（孤立成分）除去 ＋ 穴埋め
- 白フチ除去（前景を2px収縮）
- アンチエイリアス（alphaを軽くぼかす）→ 縁が滑らか
- bboxトリム（足元をフレーム下端へ）
使い方: python3 tools/extract_raw.py
新しい生成画像を raw_generated/ に置いて再実行すれば、MAPの接頭辞に従って振り分ける。
"""
import cv2, numpy as np, os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "public/assets/sprites/raw_generated")
DST = os.path.join(ROOT, "public/assets/sprites/extracted_v2")

# raw接頭辞 → (出力サブフォルダ, 出力ファイル名)
MAP = {
    "ojisan_kick": ("player_ojisan", "kick"),
    "ojisan_crouch_attack": ("player_ojisan", "crouch_attack"),
    "ojisan_crouch": ("player_ojisan", "crouch"),
    "ojisan_jump_attack": ("player_ojisan", "jump_attack"),
    "ojisan_grabbed": ("player_ojisan", "grabbed"),
    "ojisan_death": ("player_ojisan", "death"),
    "hugger_idle": ("hug", "idle"), "hugger_walk": ("hug", "walk"),
    "hugger_grab": ("hug", "grab"), "hugger_hurt": ("hug", "hurt"), "hugger_death": ("hug", "death"),
    "card_thrower_idle": ("card", "idle"), "card_thrower_walk": ("card", "walk"),
    "card_thrower_throw_high": ("card", "throw_high"), "card_thrower_throw_low": ("card", "throw_low"),
    "card_thrower_hurt": ("card", "hurt"), "card_thrower_death": ("card", "death"),
    # 傘おじさん（ボス・到着したら自動振り分け）
    "umbrella_idle": ("umbrella", "idle"), "umbrella_thrust": ("umbrella", "thrust"),
    "umbrella_sweep": ("umbrella", "sweep"), "umbrella_hurt": ("umbrella", "hurt"),
    "umbrella_death": ("umbrella", "death"),
}

def match_key(fname):
    b = os.path.basename(fname)
    for k in sorted(MAP, key=len, reverse=True):
        if b.startswith(k):
            return k
    return None

def extract(src, dst):
    img = cv2.imread(src)
    if img is None:
        return None
    h, w = img.shape[:2]
    mask = np.zeros((h + 2, w + 2), np.uint8)
    tol = 28
    flags = 4 | cv2.FLOODFILL_FIXED_RANGE | cv2.FLOODFILL_MASK_ONLY | (255 << 8)
    for c in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        if (img[c[1], c[0]] > 255 - tol).all():
            cv2.floodFill(img.copy(), mask, c, 0, (tol,) * 3, (tol,) * 3, flags)
    bg = mask[1:-1, 1:-1] > 0
    fg = (~bg).astype(np.uint8) * 255
    # ゴミ除去（最大成分の1%未満を消す）
    n, lab, stats, _ = cv2.connectedComponentsWithStats(fg, 8)
    if n > 1:
        areas = stats[1:, cv2.CC_STAT_AREA]
        keep = list(np.where(areas >= areas.max() * 0.01)[0] + 1)
        fg = np.where(np.isin(lab, keep), 255, 0).astype(np.uint8)
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))  # 穴埋め
    alpha = cv2.erode(fg, np.ones((3, 3), np.uint8), iterations=2)         # 白フチ除去
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)                             # AA
    bgra = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    bgra[:, :, 3] = alpha
    ys, xs = np.where(alpha > 10)
    if len(xs) == 0:
        return None
    crop = bgra[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    cv2.imwrite(dst, crop)
    return crop.shape

if __name__ == "__main__":
    files = sorted(glob.glob(os.path.join(RAW, "*.jpg")) + glob.glob(os.path.join(RAW, "*.png")))
    n = 0
    for f in files:
        k = match_key(f)
        if not k:
            print("  マップ不明（スキップ）:", os.path.basename(f)); continue
        sub, name = MAP[k]
        shp = extract(f, os.path.join(DST, sub, name + ".png"))
        if shp:
            print(f"  {sub}/{name}.png  {shp[1]}x{shp[0]}"); n += 1
    print(f"\n抽出完了: {n} 枚（白フチ除去＋AA＋ゴミ除去）")
