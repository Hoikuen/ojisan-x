#!/usr/bin/env python3
"""複数の横1列・緑シートを「1つの共通キャンバス」に揃えて透過抽出する。
主人公のように複数シートにまたがるキャラで、シート間の体サイズ/足元を完全一致させる用。

各シートを個別にN分割（均等目安×最小インク）→ 全シートの全フレームbboxを集計
→ 共通キャンバス(全フレーム最大幅×最大高)に foot下端揃え・水平センタリングで配置
→ 単一スケールで縮小。これで idle↔punch↔jump↔hurt が同スケール・同足元になる。

使い方:
  python3 tools/extract_multi_sheet.py --out <dir> --max-h 360 \
    --sheet basic.png idle_1,idle_2,walk_1,walk_2,walk_3,walk_4 \
    --sheet attack.png punch_1,punch_2,punch_3,kick_1,kick_2,kick_3 ...
"""
import argparse, os
import numpy as np
from PIL import Image

SPILL_FULL, SPILL_LOW = 90, 18

def dechroma(im):
    a = np.asarray(im.convert('RGBA')).astype(np.int16)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    spill = g - np.maximum(r, b)
    t = np.clip((spill - SPILL_LOW) / (SPILL_FULL - SPILL_LOW), 0, 1)
    na = (al * (1 - t)).astype(np.uint8)
    ng = np.where(spill > SPILL_LOW, np.maximum(r, b), g)
    out = np.zeros(a.shape, np.uint8)
    out[..., 0], out[..., 1], out[..., 2], out[..., 3] = (
        np.clip(r, 0, 255), np.clip(ng, 0, 255), np.clip(b, 0, 255), na)
    return out

def cut_sheet(arr, names):
    """1シートを len(names) 個に分割し、各フレームの (array, bbox) を返す。"""
    N = len(names)
    alpha = arr[..., 3]
    colink = (alpha > 16).sum(axis=0)
    xs = np.where(colink > max(2, colink.max() * 0.02))[0]
    x0, x1 = int(xs[0]), int(xs[-1]) + 1
    span = x1 - x0
    cuts = [x0]
    for i in range(1, N):
        target = x0 + span * i / N
        half = span / (2 * N) * 0.85
        lo, hi = int(max(x0 + 1, target - half)), int(min(x1 - 1, target + half))
        win = colink[lo:hi]
        cut = lo + int(np.argmin(win)) if len(win) > 0 else int(target)
        cuts.append(cut)
    cuts.append(x1)
    frames = []
    for i in range(N):
        cx0, cx1 = cuts[i], cuts[i + 1]
        sub = alpha[:, cx0:cx1]
        ys = np.where((sub > 16).sum(axis=1) > 0)[0]
        xs2 = np.where((sub > 16).sum(axis=0) > 0)[0]
        if len(ys) == 0 or len(xs2) == 0:
            frames.append((names[i], None)); continue
        box = (cx0 + int(xs2[0]), int(ys[0]), cx0 + int(xs2[-1]) + 1, int(ys[-1]) + 1)
        frames.append((names[i], box))
    return frames

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', required=True)
    ap.add_argument('--max-h', type=int, default=360)
    ap.add_argument('--sheet', nargs=2, action='append', metavar=('PATH', 'FRAMES'),
                    required=True, help='シートPNGと、そのフレーム名(カンマ区切り)')
    a = ap.parse_args()

    all_frames = []  # (name, src_img(PIL RGBA), box)
    for path, frames_csv in a.sheet:
        names = [s.strip() for s in frames_csv.split(',') if s.strip()]
        arr = dechroma(Image.open(path))
        src_img = Image.fromarray(arr)
        for name, box in cut_sheet(arr, names):
            all_frames.append((name, src_img, box, os.path.basename(path)))

    valid = [(n, s, b, sh) for (n, s, b, sh) in all_frames if b]
    cw = max(b[2] - b[0] for (_, _, b, _) in valid)
    ch = max(b[3] - b[1] for (_, _, b, _) in valid)
    pad = int(cw * 0.06)
    canvas_w, canvas_h = cw + 2 * pad, ch + pad
    scale = min(1.0, a.max_h / canvas_h)
    out_w, out_h = round(canvas_w * scale), round(canvas_h * scale)
    os.makedirs(a.out, exist_ok=True)

    print(f"共通キャンバス: {canvas_w}x{canvas_h} -> 出力 {out_w}x{out_h} (scale={scale:.3f})")
    print(f"{'frame':18s} {'sheet':22s} {'fig_w':>6s} {'fig_h':>6s}  注記")
    frames_for_prev = []
    widths = [b[2] - b[0] for (_, _, b, _) in valid]
    med_w = sorted(widths)[len(widths) // 2]
    for name, src_img, box, sheet in all_frames:
        cv = Image.new('RGBA', (canvas_w, canvas_h), (0, 0, 0, 0))
        note = ''
        if box:
            bw, bh = box[2] - box[0], box[3] - box[1]
            crop = src_img.crop(box)
            px = (canvas_w - bw) // 2
            py = canvas_h - bh
            cv.alpha_composite(crop, (px, py))
            if bw > med_w * 1.5:
                note = f'幅外れ値(>{med_w}x1.5)'
            print(f"{name:18s} {sheet:22s} {bw:6d} {bh:6d}  {note}")
        else:
            print(f"{name:18s} {sheet:22s} {'--':>6s} {'--':>6s}  空フレーム!!")
        cv = cv.resize((out_w, out_h), Image.LANCZOS)
        cv.save(os.path.join(a.out, f'{name}.png'))
        frames_for_prev.append((name, cv))

    # チェッカープレビュー（横並び）
    tile, n = 10, len(frames_for_prev)
    prev = Image.new('RGBA', (out_w * n, out_h), (235, 235, 235, 255))
    p = prev.load()
    for y in range(out_h):
        for x in range(out_w * n):
            if (x // tile + y // tile) % 2 == 0: p[x, y] = (200, 200, 200, 255)
    for i, (_, fr) in enumerate(frames_for_prev):
        prev.alpha_composite(fr, (i * out_w, 0))
    pp = os.path.join(a.out, '_preview_checker.png')
    prev.save(pp)
    print(f"saved {n} frames -> {a.out}\npreview -> {pp}")

if __name__ == '__main__':
    main()
