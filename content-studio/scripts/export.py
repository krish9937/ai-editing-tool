"""Mux a silent render + audio into platform-ready files (H.264 High / AAC, faststart).

python export.py <silent_video> <audio> <out_basename> [--platforms reels,shorts,tiktok,linkedin,x,youtube]

Writes <out_basename>_<platform>.mp4. Video is stream-copied when it already meets the
platform spec (9:16 1080x1920 or larger, ≤60 fps, H.264); otherwise it is re-encoded with
the preset below. Then runs qa.py on each output.
"""
import argparse, os, subprocess, sys
sys.path.insert(0, os.path.dirname(__file__))
from cs_env import FFMPEG, probe, duration

PRESETS = {
    # w, h, max fps, video bitrate cap (only used when re-encoding)
    "reels":    (1080, 1920, 60, "12M"),
    "shorts":   (1080, 1920, 60, "15M"),
    "tiktok":   (1080, 1920, 60, "12M"),
    "linkedin": (1080, 1920, 30, "10M"),
    "x":        (1080, 1920, 60, "12M"),
    "youtube":  (3840, 2160, 60, "45M"),
}
ap = argparse.ArgumentParser()
ap.add_argument("video"); ap.add_argument("audio"); ap.add_argument("out")
ap.add_argument("--platforms", default="reels")
ap.add_argument("--reencode", action="store_true")
a = ap.parse_args()
info = probe(a.video)
for p in a.platforms.split(","):
    w, h, fps, br = PRESETS[p]
    out = f"{a.out}_{p}.mp4"
    vw, vh = info.get("width"), info.get("height")
    right_shape = bool(vw and vh) and (vw, vh) in [(w, h), (w * 4 // 3, h * 4 // 3), (w * 2, h * 2)]
    copy = not a.reencode and right_shape and (info.get("fps") or 30) <= fps
    vargs = ["-c:v", "copy"] if copy else ["-vf", f"scale={w}:{h}:force_original_aspect_ratio=decrease,pad={w}:{h}:(ow-iw)/2:(oh-ih)/2,fps={min(fps, int(info.get('fps') or 30))}",
                                          "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", "18", "-maxrate", br, "-bufsize", br, "-pix_fmt", "yuv420p"]
    subprocess.run([FFMPEG, "-v", "error", "-y", "-i", a.video, "-i", a.audio, "-map", "0:v:0", "-map", "1:a:0", *vargs,
                    "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-t", f"{min(duration(a.audio), duration(a.video)):.3f}", "-movflags", "+faststart", out], check=True)
    print("wrote", out)
    subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), "qa.py"), out])
