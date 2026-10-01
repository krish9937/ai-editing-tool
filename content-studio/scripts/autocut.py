"""Build a tight EDIT LIST from word timestamps: drop long pauses, fillers and
false starts, keep natural breaths. Output feeds cut.py.

python autocut.py words.json segs.json [--from 767.0 --to 834.2] [--maxgap 0.35]
                  [--keepgap 0.18] [--fillers "um,uh,erm,you know"] [--drop "830.05-830.71,..."]

segs.json = [{"a": src_start, "b": src_end, "dst": out_start}, ...]  plus "end": total.
Each kept run of words becomes a segment; gaps longer than --maxgap shrink to --keepgap.
Pads 0.06s before / 0.08s after speech so plosives and word tails are never clipped.
"""
import argparse, json, re

ap = argparse.ArgumentParser()
ap.add_argument("words"); ap.add_argument("out")
ap.add_argument("--from", dest="t0", type=float, default=0.0)
ap.add_argument("--to", dest="t1", type=float, default=1e9)
ap.add_argument("--maxgap", type=float, default=0.35)
ap.add_argument("--keepgap", type=float, default=0.18)
ap.add_argument("--lead", type=float, default=0.0, help="silence before the first word in the output")
ap.add_argument("--fillers", default="um,uh,erm,uhm,ah")
ap.add_argument("--drop", default="", help="extra source ranges to remove, 'a-b,a-b'")
a = ap.parse_args()

W = [w for w in json.load(open(a.words)) if a.t0 - 0.01 <= w[0] <= a.t1]
fill = {f.strip().lower() for f in a.fillers.split(",") if f.strip()}
drops = [tuple(map(float, d.split("-"))) for d in a.drop.split(",") if "-" in d]
keep = [w for w in W if re.sub(r"[^\w' ]", "", w[2]).lower() not in fill and not any(x <= w[0] < y for x, y in drops)]

PAD_A, PAD_B = 0.06, 0.08
segs = []
for w in keep:
    s, e = w[0] - PAD_A, w[1] + PAD_B
    if segs and s - segs[-1][1] <= a.maxgap:
        segs[-1][1] = max(segs[-1][1], e)
    else:
        segs.append([s, e])

out, t = [], a.lead
for i, (s, e) in enumerate(segs):
    if i:
        t += a.keepgap
    out.append({"a": round(s, 3), "b": round(e, 3), "dst": round(t, 3)})
    t += e - s
# remapped words (output timeline) for captions
rm = []
for w in keep:
    for sg in out:
        if sg["a"] <= w[0] <= sg["b"]:
            rm.append([round(sg["dst"] + w[0] - sg["a"], 3), round(sg["dst"] + min(w[1], sg["b"]) - sg["a"], 3), w[2]]); break
json.dump({"segments": out, "end": round(t, 3), "words": rm}, open(a.out, "w"), indent=1)
print(f"{len(out)} segments, {round(t,2)}s (from {round(sum(x[1]-x[0] for x in [[W[0][0],W[-1][1]]]),2) if W else 0}s of source)")
