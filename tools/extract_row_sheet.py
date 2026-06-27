#!/usr/bin/env python3
"""
横1列の緑スクリーン・キャラシート → Nフレームに分割して透過抽出。
コマ間隔が不均等／死亡ポーズで小物が分離していても割れにくい：
  「均等な目安境界の近傍で、最もインク(非緑)が薄い列」を切れ目にする。
各フレームは共通キャンバス（同サイズ・足元下端揃え・水平センタリング）に配置＝ゲームで安定。

使い方:
  python3 tools/extract_row_sheet.py --src raw_generated/hug_sheet.png \
    --out public/assets/sprites/extracted_v2/hug --frames idle,walk,grab,hurt,death
"""
import argparse, os
import numpy as np
from PIL import Image

SPILL_FULL, SPILL_LOW = 90, 18  # 緑スピル透過しきい値

def dechroma(im):
    a = np.asarray(im.convert('RGBA')).astype(np.int16)
    r,g,b,al = a[...,0],a[...,1],a[...,2],a[...,3]
    spill = g - np.maximum(r,b)
    t = np.clip((spill-SPILL_LOW)/(SPILL_FULL-SPILL_LOW),0,1)
    na = (al*(1-t)).astype(np.uint8)
    ng = np.where(spill>SPILL_LOW, np.maximum(r,b), g)
    out = np.zeros(a.shape, np.uint8)
    out[...,0],out[...,1],out[...,2],out[...,3] = np.clip(r,0,255),np.clip(ng,0,255),np.clip(b,0,255),na
    return out  # HxWx4

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--frames', required=True)
    ap.add_argument('--max-h', type=int, default=320, help='共通キャンバス高さ上限(縮小)')
    ap.add_argument('--cuts', default='', help='手動カット位置(カンマ区切り,N+1個)。傘等が均等分割で切れる時に指定')
    ap.add_argument('--keep-largest', action='store_true',
                    help='各コマで最大連結成分のみ残す（隣コマの紛れ込み小片を除去）。本体が1塊のキャラ向け')
    ap.add_argument('--root', default=os.getcwd())
    a = ap.parse_args()
    names = [s.strip() for s in a.frames.split(',') if s.strip()]
    N = len(names)
    arr = dechroma(Image.open(a.src))
    H,W,_ = arr.shape
    alpha = arr[...,3]
    colink = (alpha>16).sum(axis=0)
    if a.cuts.strip():
        cuts = [int(s) for s in a.cuts.split(',')]
        assert len(cuts) == N+1, f'--cuts は {N+1} 個必要（実際 {len(cuts)}）'
    else:
        xs = np.where(colink > max(2, colink.max()*0.02))[0]
        x0,x1 = int(xs[0]), int(xs[-1])+1
        span = x1-x0
        # 均等目安境界の近傍で最小インク列を切れ目に
        cuts=[x0]
        for i in range(1,N):
            target = x0 + span*i/N
            half = span/(2*N)*0.85
            lo,hi = int(max(x0+1,target-half)), int(min(x1-1,target+half))
            win = colink[lo:hi]
            cut = lo + int(np.argmin(win)) if len(win)>0 else int(target)
            cuts.append(cut)
        cuts.append(x1)
    # 必要なら各セルで最大連結成分のみ残す（隣コマの足・傘先などの紛れ込みを除去）
    if a.keep_largest:
        import cv2
        for i in range(N):
            cx0,cx1 = cuts[i],cuts[i+1]
            cell = arr[:,cx0:cx1]
            m = (cell[...,3]>16).astype(np.uint8)
            ncomp,lab,stats,_ = cv2.connectedComponentsWithStats(m,connectivity=8)
            if ncomp>2:  # 背景＋2塊以上 → 最大塊以外を消す
                biggest = 1+int(np.argmax(stats[1:,cv2.CC_STAT_AREA]))
                cell[lab!=biggest] = 0
        alpha = arr[...,3]
    # 各セグメントの内容bboxを取る
    boxes=[]
    for i in range(N):
        cx0,cx1 = cuts[i],cuts[i+1]
        sub = alpha[:,cx0:cx1]
        ys = np.where((sub>16).sum(axis=1)>0)[0]
        xs2 = np.where((sub>16).sum(axis=0)>0)[0]
        if len(ys)==0 or len(xs2)==0:
            boxes.append(None); continue
        boxes.append((cx0+int(xs2[0]), int(ys[0]), cx0+int(xs2[-1])+1, int(ys[-1])+1))
    valid=[b for b in boxes if b]
    cw = max(b[2]-b[0] for b in valid)
    ch = max(b[3]-b[1] for b in valid)
    pad = int(cw*0.06)
    canvas_w, canvas_h = cw+2*pad, ch+pad
    src_img = Image.fromarray(arr)
    scale = min(1.0, a.max_h/canvas_h)
    out_w,out_h = round(canvas_w*scale), round(canvas_h*scale)
    os.makedirs(a.out, exist_ok=True)
    frames=[]
    for name,box in zip(names,boxes):
        cv = Image.new('RGBA',(canvas_w,canvas_h),(0,0,0,0))
        if box:
            crop = src_img.crop(box)
            bw,bh = crop.size
            px = (canvas_w-bw)//2
            py = canvas_h-bh  # 足元を下端に
            cv.alpha_composite(crop,(px,py))
        cv = cv.resize((out_w,out_h), Image.LANCZOS)
        cv.save(os.path.join(a.out,f'{name}.png'))
        frames.append(cv)
    print(f"saved {len(frames)} -> {a.out}  (canvas {out_w}x{out_h}, cuts={cuts})")
    # チェッカープレビュー
    tile=10
    prev=Image.new('RGBA',(out_w*N,out_h),(235,235,235,255))
    p=prev.load()
    for y in range(out_h):
        for x in range(out_w*N):
            if (x//tile+y//tile)%2==0: p[x,y]=(200,200,200,255)
    for i,fr in enumerate(frames): prev.alpha_composite(fr,(i*out_w,0))
    pp=os.path.join(a.out,'_preview_checker.png'); prev.save(pp)
    print(f"preview -> {pp}")

if __name__=='__main__':
    main()
