"""Fast burned-in captions without a browser: words.json -> .ass (+ optional burn).

python captions_ass.py words.json out.ass [--style typewriter|subtitle|bold] [--burn in.mp4 out.mp4]
                       [--size 1080x1920] [--y 1330] [--per 4] [--font "Inter"] [--first-frame-text "WAIT! ..."]

typewriter : dark rounded strip, monospace, words appear as spoken (the style this user liked)
subtitle   : clean white bold text, soft shadow, 2 lines max, no box
bold       : white bold, black outline (high contrast for busy footage)
--first-frame-text shows a static line from 0 s until the first word (frame 0 = feed thumbnail).
Burn: ffmpeg subtitles filter at ffmpeg speed (>10x realtime).
"""
import argparse, json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(__file__))
from cs_env import FFMPEG

ap = argparse.ArgumentParser()
ap.add_argument("words"); ap.add_argument("out")
ap.add_argument("--style", default="typewriter"); ap.add_argument("--size", default="1080x1920")
ap.add_argument("--y", type=int, default=1330); ap.add_argument("--per", type=int, default=4, help="words per caption chunk")
ap.add_argument("--font", default=None); ap.add_argument("--fs", type=int, default=None)
ap.add_argument("--first-frame-text", default=None)
ap.add_argument("--burn", nargs=2, default=None)
a = ap.parse_args()
W, H = map(int, a.size.split("x"))
font = a.font or ("Consolas" if a.style == "typewriter" else "Inter")
fs = a.fs or (58 if a.style == "typewriter" else 68)
if a.style == "typewriter":
    st = f"Style: C,{font},{fs},&H00E4ECF1,&H00E4ECF1,&H00000000,&H1A0B0D0F,0,0,0,0,100,100,0,0,3,18,0,2,70,70,{H - a.y},1"
elif a.style == "subtitle":
    st = f"Style: C,{font},{fs},&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,0,3,2,80,80,{H - a.y},1"
else:
    st = f"Style: C,{font},{fs},&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,5,0,2,80,80,{H - a.y},1"
hdr = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
{st}

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
T = lambda t: f"{int(t//3600)}:{int(t%3600//60):02}:{t%60:05.2f}"
words = json.load(open(a.words, encoding="utf-8"))
chunks, cur = [], []
for w in words:
    cur.append(w)
    if len(cur) >= a.per or w[2][-1:] in ".?!,":
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
ev = []
if a.first_frame_text and words:
    ev.append(f"Dialogue: 0,{T(0)},{T(max(0.05, words[0][0] - 0.02))},C,,0,0,0,,{a.first_frame_text}")
for i, c in enumerate(chunks):
    end = chunks[i + 1][0][0] - 0.02 if i + 1 < len(chunks) else c[-1][1] + 0.4
    if a.style == "typewriter":  # reveal word by word within the chunk
        for j, w in enumerate(c):
            s = w[0]; e = c[j + 1][0] if j + 1 < len(c) else end
            ev.append(f"Dialogue: 0,{T(s)},{T(max(e, s + 0.04))},C,,0,0,0,," + " ".join(x[2] for x in c[: j + 1]) + "▌")
    else:
        ev.append(f"Dialogue: 0,{T(c[0][0])},{T(end)},C,,0,0,0,," + " ".join(x[2] for x in c))
open(a.out, "w", encoding="utf-8").write(hdr + "\n".join(ev) + "\n")
print(f"{len(ev)} events -> {a.out}")
if a.burn:
    src, dst = a.burn
    p = os.path.abspath(a.out).replace("\\", "/").replace(":", "\\:")
    subprocess.run([FFMPEG, "-v", "error", "-y", "-i", src, "-vf", f"subtitles='{p}'", "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-c:a", "copy", dst], check=True)
    print("burned ->", dst)
