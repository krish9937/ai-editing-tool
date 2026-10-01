"""Render an edit list (from autocut.py or hand-made) into frame-exact media:

python cut.py <source> <segs.json> <out_prefix> [--fps 30] [--crop W:H:X:Y] [--scale 630:630]
              [--zones "817.2-819.3=W:H:X:Y,..."] [--freeze "819.3-821.45@819.22,..."]
              [--voice] [--video] [--clean]

--voice  -> <out_prefix>_voice.wav : segments placed on the output timeline with 20/30 ms fades,
            optional --clean chain (highpass, FFT denoise, speechnorm, limiter -1 dBFS).
--video  -> <out_prefix>_video.mp4 : the SAME edit as frames, continuing through gaps so a face
            keeps moving naturally (lip-sync stays exact). Optional crop/scale (e.g. a webcam
            bubble), per-source-time crop zones (when an on-screen cam moves) and freeze ranges
            (use a still frame while the cam is mid-slide).
"""
import argparse, json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(__file__))
from cs_env import FFMPEG

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("segs"); ap.add_argument("out")
ap.add_argument("--fps", type=int, default=30)
ap.add_argument("--crop", default=None); ap.add_argument("--scale", default=None)
ap.add_argument("--zones", default=""); ap.add_argument("--freeze", default="")
ap.add_argument("--voice", action="store_true"); ap.add_argument("--video", action="store_true")
ap.add_argument("--clean", action="store_true")
a = ap.parse_args()
D = json.load(open(a.segs)); S = D["segments"]; END = D.get("end") or (S[-1]["dst"] + S[-1]["b"] - S[-1]["a"])

if a.voice:
    parts, labs = [], []
    for i, s in enumerate(S):
        d = s["b"] - s["a"]; ms = int(round(s["dst"] * 1000))
        parts.append(f"[0:a]atrim={s['a']:.3f}:{s['b']:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={max(0,d-0.03):.3f}:d=0.03,adelay={ms}|{ms}[v{i}]")
        labs.append(f"[v{i}]")
    chain = "highpass=f=85,afftdn=nf=-28,speechnorm=p=0.9:e=6,alimiter=limit=0.89:level=disabled," if a.clean else ""
    fc = ";".join(parts) + ";" + "".join(labs) + f"amix=inputs={len(labs)}:normalize=0,{chain}apad,atrim=0:{END + 0.3:.3f}[o]"
    subprocess.run([FFMPEG, "-v", "error", "-y", "-i", a.src, "-filter_complex", fc, "-map", "[o]", "-ar", "48000", "-ac", "2", "-t", f"{END + 0.3:.3f}", a.out + "_voice.wav"], check=True)
    print("wrote", a.out + "_voice.wav")

if a.video:
    F = a.fps
    zones = []
    for z in [z for z in a.zones.split(",") if "=" in z]:
        rng, cr = z.split("="); x, y = map(float, rng.split("-")); zones.append((x, y, cr))
    freezes = []
    for z in [z for z in a.freeze.split(",") if "@" in z]:
        rng, at = z.split("@"); x, y = map(float, rng.split("-")); freezes.append((x, y, float(at)))
    def crop_for(t):
        for x, y, cr in zones:
            if x <= t < y: return cr
        return a.crop
    def src_at(dst):
        k = 0
        for i, s in enumerate(S):
            if dst >= s["dst"] - 1e-6: k = i
        return S[k]["a"] + (dst - S[k]["dst"])
    runs = []
    for n in range(0, round(END * F)):
        t = src_at(n / F)
        fz = next((f for f in freezes if f[0] <= t < f[1]), None)
        key = ("F", fz[2], crop_for(fz[2])) if fz else ("V", None, crop_for(t))
        if runs and runs[-1][0] == key and (key[0] == "F" or abs(t - (runs[-1][1] + runs[-1][2] / F)) < 0.02):
            runs[-1][2] += 1
        else:
            runs.append([key, t, 1])
    parts, labs = [], []
    post = lambda cr: (f",crop={cr}" if cr else "") + (f",scale={a.scale}:flags=lanczos" if a.scale else "")
    for i, (key, t, n) in enumerate(runs):
        if key[0] == "F":
            parts.append(f"[0:v]trim=start={key[1]:.3f}:duration=0.04,setpts=PTS-STARTPTS,fps={F}{post(key[2])},loop=loop={n}:size=1,trim=end_frame={n},setpts=N/{F}/TB[p{i}]")
        else:
            parts.append(f"[0:v]trim=start={t:.4f},setpts=PTS-STARTPTS,fps={F},trim=end_frame={n},setpts=N/{F}/TB{post(key[2])}[p{i}]")
        labs.append(f"[p{i}]")
    fc = ";".join(parts) + ";" + "".join(labs) + f"concat=n={len(labs)}:v=1:a=0,format=yuv420p[o]"
    subprocess.run([FFMPEG, "-v", "error", "-y", "-i", a.src, "-filter_complex", fc, "-map", "[o]", "-an", "-r", str(F), "-c:v", "libx264", "-crf", "14", "-preset", "medium", a.out + "_video.mp4"], check=True)
    print("wrote", a.out + "_video.mp4", f"({round(END*F)} frames)")
