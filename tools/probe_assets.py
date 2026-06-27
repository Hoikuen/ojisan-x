#!/usr/bin/env python3
"""目視の代替：画像を客観計測する。各画像について
  寸法 / 四隅RGB / 緑率 / マゼンタ率 / 不透明率 / コマ分割数(横ブロブ)
を出す。背景がクロマ(緑/マゼンタ)か、不透明絵か、既に透過済みかを判定する。
"""
import sys, os
import numpy as np
from PIL import Image

def classify_corner(rgb):
    r, g, b = int(rgb[0]), int(rgb[1]), int(rgb[2])
    if g > 150 and g - max(r, b) > 60: return 'GREEN'
    if r > 150 and b > 150 and r + b - 2 * g > 120: return 'MAGENTA'
    if r > 230 and g > 230 and b > 230: return 'WHITE'
    if r < 30 and g < 30 and b < 30: return 'BLACK'
    return f'({r},{g},{b})'

def horizontal_blobs(alpha, thresh=16):
    col = (alpha > thresh).sum(axis=0)
    on = col > max(2, col.max() * 0.02) if col.max() > 0 else np.zeros_like(col, bool)
    # 連続ON区間の数（=おおまかなコマ数の目安。ただし密着コマは1つに見える）
    blobs, prev = 0, False
    for v in on:
        if v and not prev: blobs += 1
        prev = v
    return blobs

def probe(path):
    im = Image.open(path).convert('RGBA')
    a = np.asarray(im).astype(np.int16)
    h, w, _ = a.shape
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    corners = [classify_corner(a[0, 0]), classify_corner(a[0, w-1]),
               classify_corner(a[h-1, 0]), classify_corner(a[h-1, w-1])]
    n = h * w
    green = ((g > 120) & (g - np.maximum(r, b) > 50)).sum() / n
    mag = ((r > 120) & (b > 120) & (r + b - 2 * g > 100)).sum() / n
    opaque = (al > 250).sum() / n
    transp = (al < 8).sum() / n
    blobs = horizontal_blobs(al if transp > 0.05 else (al * 0 + 255))
    # クロマ除去後のブロブ（緑/マゼンタを透過したと仮定）
    if corners[0] == 'GREEN' or green > 0.2:
        keymask = (g > 120) & (g - np.maximum(r, b) > 50)
    elif corners[0] == 'MAGENTA' or mag > 0.1:
        keymask = (r > 120) & (b > 120) & (r + b - 2 * g > 100)
    else:
        keymask = np.zeros((h, w), bool)
    fg_alpha = np.where(keymask, 0, 255).astype(np.int16)
    chroma_blobs = horizontal_blobs(fg_alpha)
    return dict(path=os.path.relpath(path), wh=f'{w}x{h}', corners=corners,
                green=f'{green:.2f}', mag=f'{mag:.2f}', opaque=f'{opaque:.2f}',
                transp=f'{transp:.2f}', blobs=chroma_blobs)

def main():
    files = sys.argv[1:]
    rows = []
    for f in files:
        if not os.path.exists(f):
            rows.append({'path': f, 'wh': 'MISSING'}); continue
        try:
            rows.append(probe(f))
        except Exception as e:
            rows.append({'path': f, 'wh': f'ERR {e}'})
    for r in rows:
        if r.get('wh') in (None,) or 'MISSING' in str(r.get('wh')) or 'ERR' in str(r.get('wh')):
            print(f"{r['path']:60s} {r['wh']}"); continue
        print(f"{r['path']:54s} {r['wh']:>11s} corners={'/'.join(r['corners']):24s} "
              f"green={r['green']} mag={r['mag']} opaque={r['opaque']} transp={r['transp']} blobs={r['blobs']}")

if __name__ == '__main__':
    main()
