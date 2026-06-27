#!/usr/bin/env python3
"""レトロ風の効果音(SE)とループBGMを波形合成して public/assets/audio/ に書き出す。
外部素材不要（numpy+標準waveのみ）。差し替え前提の"仮"音源だが、無音よりずっと良い。
"""
import numpy as np, wave, os

SR = 22050
OUT = 'public/assets/sprites/../audio'  # = public/assets/audio
OUT = 'public/assets/audio'

def _osc(freq, n, kind='square'):
    t = np.arange(n) / SR
    if np.isscalar(freq):
        phase = 2 * np.pi * freq * t
    else:
        phase = 2 * np.pi * np.cumsum(freq) / SR
    if kind == 'square':  return np.sign(np.sin(phase))
    if kind == 'sine':    return np.sin(phase)
    if kind == 'saw':     return 2 * (t * (freq if np.isscalar(freq) else freq.mean()) % 1) - 1
    if kind == 'tri':     return 2 / np.pi * np.arcsin(np.sin(phase))
    return np.sin(phase)

def tone(freq, dur, kind='square', vol=0.5):
    return vol * _osc(freq, int(SR * dur), kind)

def sweep(f0, f1, dur, kind='square', vol=0.5):
    n = int(SR * dur)
    f = np.linspace(f0, f1, n)
    return vol * _osc(f, n, kind)

def noise(dur, vol=0.5):
    return vol * np.random.uniform(-1, 1, int(SR * dur))

def adsr(sig, a=0.004, r=0.05, curve=1.6):
    n = len(sig); e = np.ones(n)
    na = max(1, int(SR * a)); nr = max(1, int(SR * r))
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] = np.linspace(1, 0, nr) ** curve
    return sig * e

def pad(*sigs):
    n = max(len(s) for s in sigs)
    return sum(np.pad(s, (0, n - len(s))) for s in sigs)

def seq(*sigs):
    return np.concatenate(sigs)

def save(name, sig, peak=0.85):
    sig = np.asarray(sig, dtype=np.float64)
    m = np.max(np.abs(sig)) or 1.0
    sig = sig / m * peak
    data = (np.clip(sig, -1, 1) * 32767).astype('<i2')
    os.makedirs(OUT, exist_ok=True)
    with wave.open(os.path.join(OUT, name), 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(data.tobytes())
    print(f"  {name:16s} {len(sig)/SR:.2f}s")

# --- SE ---
def gen_se():
    print("SE:")
    save('jump.wav',       adsr(sweep(300, 760, 0.13, 'square', 0.5), r=0.05))
    save('punch.wav',      adsr(pad(noise(0.06, 0.5), tone(95, 0.07, 'square', 0.5)), r=0.05))
    save('kick.wav',       adsr(pad(noise(0.09, 0.45), tone(68, 0.10, 'square', 0.5)), r=0.07))
    save('hurt.wav',       adsr(sweep(440, 130, 0.20, 'square', 0.5), r=0.08))
    save('enemy_down.wav', adsr(pad(sweep(560, 110, 0.22, 'square', 0.45), noise(0.22, 0.25)), r=0.1))
    save('boss_down.wav',  adsr(pad(noise(0.55, 0.5), tone(55, 0.55, 'sine', 0.6),
                                    sweep(400, 60, 0.55, 'saw', 0.3)), a=0.002, r=0.3, curve=2.2))
    save('powerup.wav',    adsr(seq(tone(392, 0.07), tone(523, 0.07), tone(659, 0.07),
                                    tone(784, 0.13, 'square', 0.6)), r=0.08))
    save('cash.wav',       adsr(seq(tone(988, 0.06, 'square', 0.5), tone(1319, 0.12, 'square', 0.5)), r=0.06))
    save('throw.wav',      adsr(sweep(820, 300, 0.10, 'sine', 0.35), r=0.05))
    save('beam.wav',       adsr(sweep(1300, 380, 0.16, 'square', 0.4), r=0.06))

# --- BGM（C調・I-V-vi-IV のループ。ベース＋アルペジオ）---
def note(name, octave=4):
    base = {'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
    semis = base[name] + (octave - 4) * 12
    return 440 * 2 ** ((semis - 9) / 12)  # A4=440

def gen_bgm():
    print("BGM:")
    bpm = 132
    beat = 60 / bpm           # 1拍の秒
    # 進行：C  G  Am  F（各2拍）×2 = 16拍 ≈ 7.3s ループ
    prog = [('C','C','E','G'), ('G','B','D','G'), ('A','C','E','A'), ('F','A','C','F')]
    track = []
    for _ in range(2):
        for root_name, a1, a2, a3 in prog:
            # ベース：ルート2拍（低オクターブ）
            bass = adsr(tone(note(root_name, 2), beat * 2, 'tri', 0.5), a=0.005, r=0.15)
            # アルペジオ：8分音符で root,a1,a2,a3 を繰り返し（高オクターブ）
            arp_notes = [a1, a2, a3, a1, a2, a3, a1, a2]
            arp = np.concatenate([adsr(tone(note(n, 5), beat / 4, 'square', 0.28), a=0.003, r=0.03)
                                  for n in arp_notes])
            seg = pad(bass, arp[:len(bass)] if len(arp) >= len(bass) else np.pad(arp, (0, len(bass)-len(arp))))
            track.append(seg)
    bgm = np.concatenate(track)
    # ループ継ぎ目を滑らかに（先頭/末尾に極短フェード）
    f = int(SR * 0.01)
    bgm[:f] *= np.linspace(0, 1, f); bgm[-f:] *= np.linspace(1, 0, f)
    save('bgm_main.wav', bgm, peak=0.6)

if __name__ == '__main__':
    gen_se()
    gen_bgm()
    print("done ->", OUT)
