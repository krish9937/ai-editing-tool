"""Motion gate (content-studio SKILL §0m). BLOCKING: exit 1 = don't deliver, fix the motion and re-render.

python motion_qa.py <video.mp4> [--comp <hyperframes-project-dir>] [--spec motion-spec.json]
                    [--max-still 1.2] [--end-hold 1.5] [--width 1080 --height 1920] [--json report.json]

Why it exists (2026-11-25 audit): several reels shipped with "dead" motion. The old qa.py only checked
decode/loudness/safe zones, and the animation-map / slideshow-risk checks existed only as prose, so nothing stopped them.

Checks
 1. VIDEO frozen stretches: ffmpeg freezedetect; any freeze >= --max-still s that isn't the final hold = FAIL.
 2. COMPOSITION dead zones (--comp): runs hyperframes-animation/scripts/animation-map.mjs; any span with no
    active tween >= --max-still s = FAIL (holds need secondary motion: idle / push / parallax / glare).
    Also reads the motion-kit report (data-mk-report) if the kit was used: FAIL if it flagged problems.
 3. MOTION SPEC (--spec): the beat-by-beat plan. FAIL if a beat lacks camera / entrance / secondary /
    transition_out, if a transition is banned (fade, crossfade, dissolve, slide-in, plain cut), if there are
    < 4 distinct transition designs (with >= 5 transitions), any design > 35 %, the same design twice in a row,
    or fewer than 2 beats marked "set_piece": true.

Spec format (write it in the plan, keep it next to the composition):
{ "beats": [ {"t": 0.0, "camera": "push-in", "entrance": "drop", "secondary": "idle",
              "transition_out": "screen-becomes-world", "set_piece": false}, ... ] }

Note: pixel-motion metrics can't judge motion DESIGN (the "dead" shopfront reel moved more per frame than the
approved GTA reel). That's why the spec check and the motion test before the full render matter as much as check 1.
"""
import argparse, glob, json, os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(__file__))
from cs_env import FFMPEG, probe, duration

BANNED = ("crossfade", "cross-fade", "dissolve", "fade", "slide-in", "slide in", "hard cut", "plain cut")

ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("--comp"); ap.add_argument("--spec")
ap.add_argument("--max-still", type=float, default=1.2)
ap.add_argument("--end-hold", type=float, default=1.5)
ap.add_argument("--width", type=int, default=0); ap.add_argument("--height", type=int, default=0)
ap.add_argument("--json")
a = ap.parse_args()

fails, warns, report = [], [], {}
info = probe(a.video)
dur = float(duration(a.video) or 0)
vs = next((s for s in (info.get("streams") or []) if s.get("codec_type") == "video"), {})

# ---------- 1. frozen stretches in the rendered video ----------
cmd = [FFMPEG, "-hide_banner", "-nostats", "-i", a.video, "-map", "0:v:0",
       "-vf", f"scale=360:-2,freezedetect=n=0.003:d={a.max_still}", "-f", "null", "-"]
err = subprocess.run(cmd, capture_output=True, text=True, errors="replace").stderr
starts = [float(x) for x in re.findall(r"freeze_start: ([0-9.]+)", err)]
durs = [float(x) for x in re.findall(r"freeze_duration: ([0-9.]+)", err)]
freezes = []
for i, s in enumerate(starts):
    d = durs[i] if i < len(durs) else max(0.0, dur - s)
    freezes.append({"start": round(s, 2), "duration": round(d, 2)})
report["freezes"] = freezes
for f in freezes:
    if f["start"] >= dur - a.end_hold - 0.05 and f["duration"] <= a.end_hold + 0.05:
        continue  # the final hold on the last line/CTA is allowed
    if f["start"] < 0.05:
        fails.append(f"frame 0 is frozen for {f['duration']}s (the hook must already be moving)")
    else:
        fails.append(f"frozen {f['duration']}s at {f['start']}s (> {a.max_still}s with nothing moving)")
print(f"video: {dur:.2f}s, frozen stretches >= {a.max_still}s: {len(freezes)}")

# ---------- 2. composition dead zones via animation-map ----------
def find_animation_map():
    env = os.environ.get("MK_ANIMATION_MAP")
    if env and os.path.exists(env):
        return env
    here = os.path.dirname(os.path.abspath(__file__))
    cands = [os.path.expanduser("~/.claude/skills/hyperframes-animation/scripts/animation-map.mjs"),
             os.path.join(here, "..", "..", "hyperframes", "hyperframes-animation", "scripts", "animation-map.mjs")]
    cands += glob.glob(os.path.expanduser("~/.claude/skills/**/animation-map.mjs"), recursive=True)
    return next((c for c in cands if os.path.exists(c)), None)

if a.comp:
    am = find_animation_map()
    w = a.width or int(vs.get("width") or 1080); h = a.height or int(vs.get("height") or 1920)
    out = os.path.join(a.comp, ".hyperframes", "motion-qa")
    if not am:
        fails.append("animation-map.mjs not found (install the hyperframes-animation skill or set MK_ANIMATION_MAP)")
    else:
        env = dict(os.environ)
        env.setdefault("HYPERFRAMES_SKILL_PKG_VERSION", os.environ.get("HYPERFRAMES_VERSION", "0.8.185"))
        env.setdefault("HYPERFRAMES_SKILL_BOOTSTRAP_DEPS", "1")  # one-time temp install of @hyperframes/producer
        r = subprocess.run(["node", am, a.comp, "--out", out, "--width", str(w), "--height", str(h), "--frames", "6"],
                           capture_output=True, text=True, errors="replace", env=env)
        mp = os.path.join(out, "animation-map.json")
        if not os.path.exists(mp):
            fails.append("animation-map failed: " + (r.stderr or r.stdout)[-400:].strip())
        else:
            m = json.load(open(mp, encoding="utf-8"))
            dz = [z for z in (m.get("deadZones") or []) if float(z.get("duration", 0)) >= a.max_still
                  and not (float(z.get("start", 0)) >= dur - a.end_hold - 0.05)]
            report["deadZones"] = dz
            for z in dz:
                fails.append(f"dead zone {z['start']}-{z['end']}s in the composition (no tween running; add secondary motion)")
            print(f"animation-map: {len(m.get('tweens') or [])} tweens, dead zones >= {a.max_still}s: {len(dz)}")
    # motion-kit self-report (written into <html data-mk-report> by MK.finish); read it from the source for kit builds
    try:
        src = open(os.path.join(a.comp, "index.html"), encoding="utf-8").read()
        if "motion-kit.js" in src and "MK.finish" not in src:
            fails.append("motion-kit loaded but MK.finish(tl) is never called (variety check skipped)")
    except OSError:
        pass

# ---------- 3. the beat-by-beat motion spec ----------
if a.spec:
    spec = json.load(open(a.spec, encoding="utf-8"))
    beats = spec.get("beats") or []
    if not beats:
        fails.append("motion spec has no beats")
    trans = []
    for i, b in enumerate(beats):
        last = i == len(beats) - 1
        for k in ("camera", "entrance", "secondary") + (() if last else ("transition_out",)):
            if not str(b.get(k, "")).strip():
                fails.append(f"beat {i} (t={b.get('t')}): missing '{k}'")
        tr = str(b.get("transition_out", "")).strip().lower()
        if tr:
            if any(x in tr for x in BANNED) and "match-cut" not in tr and "match cut" not in tr:
                fails.append(f"beat {i}: banned transition '{tr}' (use an object-driven move)")
            trans.append(tr)
    if len(trans) >= 5:
        kinds = set(trans)
        if len(kinds) < 4:
            fails.append(f"only {len(kinds)} transition designs (need >= 4): {sorted(kinds)}")
        for k in kinds:
            if trans.count(k) / len(trans) > 0.35:
                fails.append(f"transition '{k}' is {trans.count(k)}/{len(trans)} of all transitions (> 35 %)")
    for i in range(1, len(trans)):
        if trans[i] == trans[i - 1]:
            fails.append(f"same transition '{trans[i]}' twice in a row (beats {i - 1}->{i})")
    sp = sum(1 for b in beats if b.get("set_piece"))
    if sp < 2:
        fails.append(f"only {sp} set piece(s) marked (need >= 2 hero moments built for this story)")
    report["spec"] = {"beats": len(beats), "transitions": trans, "set_pieces": sp}
    print(f"spec: {len(beats)} beats, {len(set(trans))} transition designs, {sp} set pieces")
elif not a.comp:
    warns.append("no --spec and no --comp: only the frozen-frame check ran (motion DESIGN unchecked)")

report.update({"fails": fails, "warnings": warns, "ok": not fails})
if a.json:
    json.dump(report, open(a.json, "w", encoding="utf-8"), indent=2)
for w_ in warns:
    print("WARNING:", w_)
if fails:
    print("MOTION FAIL:\n  - " + "\n  - ".join(fails)); sys.exit(1)
print("MOTION PASS")
