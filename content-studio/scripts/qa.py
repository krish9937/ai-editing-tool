"""Cheap delivery gate. Run on EVERY render before showing/handing it over.

python qa.py <video> [--expect-frames N] [--sheet out.jpg] [--times 0,1.5,10,...] [--safe]

Checks: decodes every frame (catches the "encoded fine but truncated" bug), duration,
fps, resolution, audio present, integrated loudness (LUFS) + true peak, silent first
second, and optionally a contact sheet of the given times with the 9:16 platform
safe-zone overlaid (--safe) so you can eyeball captions/faces vs UI.
Exit code 1 if a hard check fails.
"""
import argparse, os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(__file__))
from cs_env import FFMPEG, probe

ap = argparse.ArgumentParser()
ap.add_argument("video"); ap.add_argument("--expect-frames", type=int)
ap.add_argument("--sheet"); ap.add_argument("--times", default="")
ap.add_argument("--safe", action="store_true")
a = ap.parse_args()
fail = []
r = subprocess.run([FFMPEG, "-v", "error", "-i", a.video, "-map", "0:v:0", "-f", "null", "-", "-progress", "-"], capture_output=True, text=True)
frames = [int(m) for m in re.findall(r"frame=(\d+)", r.stdout)]
nf = frames[-1] if frames else 0
info = probe(a.video)
dur = info.get("duration") or float(info.get("format", {}).get("duration", 0))
print(f"frames decoded: {nf}   duration: {dur:.2f}s   size: {info.get('width','?')}x{info.get('height','?')}   fps: {info.get('fps','?')}")
if a.expect_frames and abs(nf - a.expect_frames) > 1:
    fail.append(f"frame count {nf} != expected {a.expect_frames}")
if r.stderr.strip():
    fail.append("decode errors: " + r.stderr.strip()[:200])
e = subprocess.run([FFMPEG, "-hide_banner", "-i", a.video, "-vn", "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
I = re.findall(r"I:\s+(-?[\d.]+) LUFS", e); TP = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", e)
if not I:
    fail.append("no audio stream")
else:
    lufs = float(I[-1]); tp = float(TP[-1]) if TP else 0
    print(f"loudness: {lufs:.1f} LUFS integrated, true peak {tp:.1f} dBTP  (social target ≈ -14 LUFS, peak ≤ -1)")
    if tp > -0.5: fail.append(f"true peak {tp} dBTP clips")
    s = subprocess.run([FFMPEG, "-hide_banner", "-t", "1", "-i", a.video, "-vn", "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.search(r"mean_volume: (-?[\d.]+) dB", s)
    if m and float(m[1]) < -45: print("WARNING: first second is near-silent — the hook should be heard at frame 0")
if a.sheet and a.times:
    ts = [float(x) for x in a.times.split(",")]
    sel = "+".join(f"eq(n\\,{round(t * (info.get('fps') or 30))})" for t in ts)
    W = 300
    vf = f"select='{sel}',scale={W}:-2"
    if a.safe:
        # Organic Reels/TikTok/Shorts safe box on 1080x1920: x 60-880, y 250-1500 (text, logos, faces inside).
        # Red = covered by platform UI (top bar, caption/username, right action column).
        vf += (",drawbox=x=0:y=0:w=iw:h=ih*0.130:color=red@0.25:t=fill"          # top 250px
               ",drawbox=x=0:y=ih*0.781:w=iw:h=ih*0.219:color=red@0.25:t=fill"  # bottom from 1500px
               ",drawbox=x=iw*0.815:y=ih*0.365:w=iw*0.185:h=ih*0.635:color=red@0.18:t=fill"  # action buttons
               ",drawbox=x=0:y=0:w=iw*0.056:h=ih:color=red@0.12:t=fill")
    vf += f",tile={len(ts)}x1"
    subprocess.run([FFMPEG, "-v", "error", "-y", "-i", a.video, "-vf", vf, "-fps_mode", "vfr", "-frames:v", "1", a.sheet], check=True)
    print("sheet:", a.sheet)
if fail:
    print("FAIL:", " | ".join(fail)); sys.exit(1)
print("PASS")
