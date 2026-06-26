#!/usr/bin/env python3
"""
raw_generated/ の白背景画像（JPG/PNG）を高品質に透過抽出して extracted_v2/ へ配置。
- 角から固定レンジflood-fill（内部の白＝シャツ等は連結していないので保護）
- 小さなゴミ除去＋穴埋め＋白フチ収縮＋アンチエイリアス
- アニメ用の連番フレーム（walk_1, walk_2 …）は「共通キャンバス（同サイズ・足元揃え）」に
  整列して出力する → アニメ再生時に足元がブレない。
使い方: python3 tools/extract_raw.py
新規生成画像を raw_generated/ に置いて再実行すれば、MAPの接頭辞に従って振り分ける。

★アニメさせたい動きは「<キャラ>_<動き>_<番号>」で複数枚生成して置けばよい
  （例: ojisan_walk_1, ojisan_walk_2, ...）。
"""
import cv2, numpy as np, os, glob, re

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
    # 歩行アニメ用の連番（複数枚置けばアニメ化される）
    "ojisan_walk_1": ("player_ojisan", "walk_1"), "ojisan_walk_2": ("player_ojisan", "walk_2"),
    "ojisan_walk_3": ("player_ojisan", "walk_3"), "ojisan_walk_4": ("player_ojisan", "walk_4"),
    "hugger_idle": ("hug", "idle"), "hugger_walk": ("hug", "walk"),
    "hugger_grab": ("hug", "grab"), "hugger_hurt": ("hug", "hurt"), "hugger_death": ("hug", "death"),
    "card_thrower_idle": ("card", "idle"), "card_thrower_walk": ("card", "walk"),
    "card_thrower_throw_high": ("card", "throw_high"), "card_thrower_throw_low": ("card", "throw_low"),
    "card_thrower_hurt": ("card", "hurt"), "card_thrower_death": ("card", "death"),
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

def extract_alpha(src):
    """白背景を抜いたBGRA画像と、可視領域のbboxを返す（トリムはしない）。"""
    img = cv2.imread(src)
    if img is None:
        return None, None
    h, w = img.shape[:2]
    mask = np.zeros((h + 2, w + 2), np.uint8)
    tol = 28
    flags = 4 | cv2.FLOODFILL_FIXED_RANGE | cv2.FLOODFILL_MASK_ONLY | (255 << 8)
    for c in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        if (img[c[1], c[0]] > 255 - tol).all():
            cv2.floodFill(img.copy(), mask, c, 0, (tol,) * 3, (tol,) * 3, flags)
    bg = mask[1:-1, 1:-1] > 0
    fg = (~bg).astype(np.uint8) * 255
    n, lab, stats, _ = cv2.connectedComponentsWithStats(fg, 8)
    if n > 1:
        areas = stats[1:, cv2.CC_STAT_AREA]
        keep = list(np.where(areas >= areas.max() * 0.01)[0] + 1)
        fg = np.where(np.isin(lab, keep), 255, 0).astype(np.uint8)
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    a = cv2.erode(fg, np.ones((3, 3), np.uint8), iterations=2)
    a = cv2.GaussianBlur(a, (3, 3), 0)
    bgra = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    bgra[:, :, 3] = a
    ys, xs = np.where(a > 10)
    if len(xs) == 0:
        return None, None
    return bgra, (ys.min(), ys.max() + 1, xs.min(), xs.max() + 1)

def anim_group(sub, name):
    """連番(walk_1)はベース(walk)でグループ化。単発はそれ自身。"""
    m = re.match(r"^(.*)_(\d+)$", name)
    base = m.group(1) if m else name
    return (sub, base)

if __name__ == "__main__":
    files = sorted(glob.glob(os.path.join(RAW, "*.jpg")) + glob.glob(os.path.join(RAW, "*.png")))
    # 1) 全部抽出してメモリに保持（グループごとに共通キャンバスへ整列するため）
    items = {}  # (sub,name) -> (bgra, bbox)
    for f in files:
        k = match_key(f)
        if not k:
            print("  マップ不明（スキップ）:", os.path.basename(f)); continue
        sub, name = MAP[k]
        bgra, bbox = extract_alpha(f)
        if bgra is not None:
            items[(sub, name)] = (bgra, bbox)
    # 2) グループごとに共通キャンバス（最大幅×最大高・足元下端・横中央）で出力
    groups = {}
    for (sub, name) in items:
        groups.setdefault(anim_group(sub, name), []).append((sub, name))
    n = 0
    for g, members in groups.items():
        maxw = max(items[m][1][3] - items[m][1][2] for m in members)
        maxh = max(items[m][1][1] - items[m][1][0] for m in members)
        for (sub, name) in members:
            bgra, (y0, y1, x0, x1) = items[(sub, name)]
            content = bgra[y0:y1, x0:x1]
            ch, cw = content.shape[:2]
            canvas = np.zeros((maxh, maxw, 4), np.uint8)
            ox = (maxw - cw) // 2          # 横中央
            oy = maxh - ch                 # 足元を下端に
            canvas[oy:oy + ch, ox:ox + cw] = content
            dst = os.path.join(DST, sub, name + ".png")
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            cv2.imwrite(dst, canvas)
            tag = "(anim frame)" if len(members) > 1 else ""
            print(f"  {sub}/{name}.png  {maxw}x{maxh} {tag}"); n += 1
    print(f"\n抽出完了: {n} 枚（白フチ除去＋AA＋連番は共通キャンバス整列）")
