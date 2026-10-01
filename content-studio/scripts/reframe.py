"""Reframe landscape footage to 9:16 around the speaker's face.

python reframe.py <in> <out.mp4> [--start 12.0 --dur 30] [--mode static|track] [--size 1080x1920] [--region x0,x1]

static (default): one crop at the median face x (sampled at 2 fps) — cheapest, rock steady.
track: smoothed per-second crop path (EMA) rendered with ffmpeg sendcmd — for moving speakers.
--region limits face search to a horizontal band of the source (e.g. "960,1920" = right half,
useful for side-by-side webinar cams). Uses OpenCV's bundled Haar face detector (pip install "opencv-python-headless<5" — OpenCV 5 dropped CascadeClassifier;
opencv-python); falls back to a centre crop if OpenCV or a face is missing.
"""
import argparse, os, subprocess, sys, tempfile
sys.path.insert(0, os.path.dirname(__file__))
from cs_env import FFMPEG, probe

ap = argparse.ArgumentParser()
ap.add_argument("inp"); ap.add_argument("out")
ap.add_argument("--start", type=float, default=0.0); ap.add_argument("--dur", type=float, default=None)
ap.add_argument("--mode", default="static"); ap.add_argument("--size", default="1080x1920")
ap.add_argument("--region", default=None)
a = ap.parse_args()
info = probe(a.inp)
W = info.get("width") or info["streams"][0]["width"]; H = info.get("height") or info["streams"][0]["height"]
cw = int(H * 9 / 16) // 2 * 2
rx0, rx1 = (map(int, a.region.split(","))) if a.region else (0, W)
xs = []
try:
    import cv2
    det = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    cap = cv2.VideoCapture(a.inp)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    end = a.start + (a.dur or (info.get("duration") or 60))
    t = a.start
    while t < end:
        cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
        ok, fr = cap.read()
        if not ok: break
        g = cv2.cvtColor(fr[:, rx0:rx1], cv2.COLOR_BGR2GRAY)
        faces = det.detectMultiScale(g, 1.2, 5, minSize=(60, 60))
        if len(faces):
            x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
            xs.append((t, rx0 + x + w / 2))
        t += 0.5
except Exception as e:
    print("face detection unavailable:", e)
def clampx(cx): return int(min(max(cx - cw / 2, 0), W - cw)) // 2 * 2
ow, oh = a.size.split("x")
seek = ["-ss", str(a.start)] + (["-t", str(a.dur)] if a.dur else [])
if a.mode == "track" and len(xs) > 2:
    cmds, ema = [], xs[0][1]
    for t, cx in xs:
        ema = 0.8 * ema + 0.2 * cx
        cmds.append(f"{t - a.start:.2f} crop x {clampx(ema)};")
    f = os.path.join(tempfile.gettempdir(), "cs_reframe_cmds.txt"); open(f, "w").write("\n".join(cmds))
    vf = f"sendcmd=f='{f.replace(chr(92), '/').replace(':', chr(92) + ':')}',crop={cw}:{H}:{clampx(xs[0][1])}:0,scale={ow}:{oh}:flags=lanczos"
else:
    med = sorted(x for _, x in xs)[len(xs) // 2] if xs else (rx0 + rx1) / 2
    vf = f"crop={cw}:{H}:{clampx(med)}:0,scale={ow}:{oh}:flags=lanczos"
subprocess.run([FFMPEG, "-v", "error", "-y", *seek, "-i", a.inp, "-vf", vf, "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-c:a", "aac", "-b:a", "192k", a.out], check=True)
print("wrote", a.out, f"({len(xs)} face samples, mode={a.mode})")
