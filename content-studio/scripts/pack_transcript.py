"""Pack words.json into a compact, LLM-friendly transcript for picking clips/beats.

python pack_transcript.py words.json packed.txt [--pause 0.6]

Each line: "[mm:ss.s–mm:ss.s] sentence"   and a "‖1.2s" marker on its own line for pauses ≥ --pause.
~12 KB per hour of speech — reason over this instead of video frames.
"""
import argparse, json
ap = argparse.ArgumentParser(); ap.add_argument("words"); ap.add_argument("out")
ap.add_argument("--pause", type=float, default=0.6)
a = ap.parse_args()
W = json.load(open(a.words, encoding="utf-8"))
fmt = lambda t: f"{int(t//60):02}:{t%60:04.1f}"
lines, cur = [], []
for i, w in enumerate(W):
    if cur and w[0] - cur[-1][1] >= a.pause:
        lines.append(f"[{fmt(cur[0][0])}-{fmt(cur[-1][1])}] " + " ".join(x[2] for x in cur)); cur = []
        lines.append(f"  ‖{w[0] - W[i-1][1]:.1f}s")
    cur.append(w)
    if w[2][-1:] in ".?!" and len(cur) > 3:
        lines.append(f"[{fmt(cur[0][0])}-{fmt(cur[-1][1])}] " + " ".join(x[2] for x in cur)); cur = []
if cur: lines.append(f"[{fmt(cur[0][0])}-{fmt(cur[-1][1])}] " + " ".join(x[2] for x in cur))
open(a.out, "w", encoding="utf-8").write("\n".join(lines) + "\n")
print(f"{len(lines)} lines -> {a.out}")
