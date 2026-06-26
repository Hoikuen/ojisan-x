#!/usr/bin/env python3
"""
おじさんX プレースホルダ生成＋流用素材コピー。
- 実画像が来たら、同じパスのPNGを上書きするだけで差し替わる（コード変更不要）。
- 再実行可能。プレースホルダは「足元をフレーム下端」に揃えてあるので床めり込み検証にも使える。
使い方: python3 tools/make_placeholders.py
"""
import os
import shutil
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SH = os.path.expanduser("~/Developer/games/spartan-hex/assets/sprites")
# Viteは public/ 配下を / で配信し build時にdistへコピーする。実行時アセットはここに置く。
DST = os.path.join(ROOT, "public", "assets", "sprites")

def ensure(p): os.makedirs(p, exist_ok=True)

# ---- 1) 流用素材のコピー（実物） ----
REUSE = [
    # (src, dst)
    ("extracted_v2/player_ojisan", "extracted_v2/player_ojisan"),
    ("extracted_v2/player_bald",   "extracted_v2/player_bald"),
    ("extracted_v2/boss",          "extracted_v2/boss"),
    ("extracted_v2/schoolgirl_fix","extracted_v2/schoolgirl_fix"),
    ("extracted_v2/gorilla_fix",   "extracted_v2/gorilla_fix"),
]
for src, dst in REUSE:
    s = os.path.join(SH, src); d = os.path.join(DST, dst)
    if os.path.isdir(s):
        ensure(d)
        for f in os.listdir(s):
            if f.endswith(".png"):
                shutil.copy(os.path.join(s, f), os.path.join(d, f))
        print(f"copied {src} -> {dst}")

# 単体ファイルの流用
SINGLE = [
    ("items/cash.png", "items/cash.png"),
    ("extracted/item_core_set/power_drink.png", "items/power_drink.png"),
    ("extracted/item_core_set/big_document.png", "items/big_document.png"),
]
for src, dst in SINGLE:
    s = os.path.join(SH, src); d = os.path.join(DST, dst)
    if os.path.isfile(s):
        ensure(os.path.dirname(d)); shutil.copy(s, d); print(f"copied {src} -> {dst}")

# ---- 2) プレースホルダ生成（未制作の新規アセット） ----
def char_placeholder(path, w, h, color, label):
    """足元をフレーム下端に揃えた人型プレースホルダ。"""
    ensure(os.path.dirname(path))
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # 体（下端に接地）
    body_top = int(h * 0.28)
    d.rounded_rectangle([int(w*0.2), body_top, int(w*0.8), h-2], radius=int(w*0.12),
                        fill=color, outline=(20, 20, 20, 255), width=3)
    # 頭
    hr = int(w * 0.18)
    cx = w // 2
    d.ellipse([cx-hr, body_top-2*hr, cx+hr, body_top], fill=color, outline=(20,20,20,255), width=3)
    # ラベル
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", max(12, w//10))
    except Exception:
        font = ImageFont.load_default()
    d.text((4, 4), label, fill=(255, 255, 255, 255), font=font)
    img.save(path)
    print(f"placeholder {os.path.relpath(path, ROOT)} ({w}x{h})")

def small_placeholder(path, w, h, color, label):
    ensure(os.path.dirname(path))
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([1, 1, w-2, h-2], radius=6, fill=color, outline=(20,20,20,255), width=2)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", max(10, w//6))
    except Exception:
        font = ImageFont.load_default()
    d.text((3, 3), label, fill=(0, 0, 0, 255), font=font)
    img.save(path)
    print(f"placeholder {os.path.relpath(path, ROOT)} ({w}x{h})")

def bg_placeholder(path, w, h, top, bottom, label):
    ensure(os.path.dirname(path))
    img = Image.new("RGB", (w, h), top)
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / h
        c = tuple(int(top[i]*(1-t) + bottom[i]*t) for i in range(3))
        d.line([(0, y), (w, y)], fill=c)
    # 床ライン
    d.line([(0, int(h*0.95)), (w, int(h*0.95))], fill=(40,40,40), width=4)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 40)
    except Exception:
        font = ImageFont.load_default()
    d.text((20, 20), label + " (placeholder)", fill=(255,255,255), font=font)
    img.save(path)
    print(f"bg {os.path.relpath(path, ROOT)} ({w}x{h})")

P = lambda *a: os.path.join(DST, *a)

# 主人公の新規ポーズ（実物が来るまで既存をコピーして仮置き＝パスを用意）
po = P("extracted_v2", "player_ojisan")
copies = [("attack.png","kick.png"), ("extra.png","crouch.png"), ("extra.png","crouch_attack.png"),
          ("jump.png","jump_attack.png"), ("hurt.png","grabbed.png"), ("hurt.png","death.png")]
for src, dst in copies:
    sp = os.path.join(po, src)
    if os.path.isfile(sp):
        shutil.copy(sp, os.path.join(po, dst)); print(f"temp pose {dst} <- {src}")

# ハゲ化の不足ポーズ（baldの既存からコピー仮置き）
pb = P("extracted_v2", "player_bald")
for src, dst in [("attack.png","kick.png"), ("idle.png","jump.png"), ("idle.png","fall.png"), ("idle.png","hurt.png")]:
    sp = os.path.join(pb, src)
    if os.path.isfile(sp):
        shutil.copy(sp, os.path.join(pb, dst)); print(f"temp bald pose {dst} <- {src}")

# ハグ魔（紫系）
HUG = (150, 90, 180, 255)
for pose in ["idle","walk","grab","hurt","death"]:
    char_placeholder(P("extracted_v2","hug",f"{pose}.png"), 200, 380, HUG, f"HUG\n{pose}")

# 名刺投げ（灰系）
CARD = (120, 130, 150, 255)
for pose in ["idle","walk","throw_high","throw_low","hurt","death"]:
    char_placeholder(P("extracted_v2","card",f"{pose}.png"), 200, 380, CARD, f"CARD\n{pose}")

# 傘おじさん（濃緑・ボスは大きめ）
UMB = (60, 110, 90, 255)
for pose in ["idle","thrust","sweep","hurt","death"]:
    char_placeholder(P("extracted_v2","umbrella",f"{pose}.png"), 260, 520, UMB, f"UMBRELLA\n{pose}")

# 弾・FX
small_placeholder(P("proj","card.png"), 48, 28, (240, 240, 230, 255), "card")
small_placeholder(P("proj","beam.png"), 90, 22, (255, 220, 80, 255), "BEAM")  # ハゲ化ビーム（仮）
small_placeholder(P("fx","hit.png"), 64, 64, (255, 230, 80, 255), "HIT")
small_placeholder(P("fx","star.png"), 64, 64, (255, 220, 120, 255), "★")
small_placeholder(P("items","powerup.png"), 48, 64, (255, 120, 60, 255), "PWR")  # power_drink流用が来たら上書き

# 背景
bg_placeholder(P("background","floor1.png"), 1600, 600, (40, 20, 30), (90, 40, 30), "F1 IZAKAYA")
bg_placeholder(P("background","title.png"), 800, 600, (20, 20, 40), (60, 40, 60), "X CORP BLDG")

print("\nDONE. 実画像が来たら同じパスのPNGを上書きするだけで差し替わる。")
