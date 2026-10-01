"""Mix voice track(s) + optional music bed with ducking, export final audio at a
platform-friendly loudness. Every branch is length-bounded (-t) so it can't hang.

python mix.py out.m4a --dur 40.2 --voice voice.wav[@0.0] [--voice hook.wav@0.0 ...]
              [--music bed.mp3 --music-from 12.5 --music-vol 0.16 --fade-out 1.3] [--lufs -14]

--voice FILE@T   place a voice file starting at T seconds (repeatable)
--music          bed is trimmed from --music-from; ducked under the voice (sidechain),
                 faded out over the last --fade-out seconds
--lufs           final loudnorm target (two-pass); -14 suits IG/TikTok/YouTube
"""
import argparse, json, os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(__file__))
from cs_env import FFMPEG

ap = argparse.ArgumentParser()
ap.add_argument("out"); ap.add_argument("--dur", type=float, required=True)
ap.add_argument("--voice", action="append", default=[])
ap.add_argument("--music"); ap.add_argument("--music-from", type=float, default=0.0)
ap.add_argument("--music-vol", type=float, default=0.16); ap.add_argument("--fade-out", type=float, default=1.2)
ap.add_argument("--lufs", type=float, default=-14.0)
a = ap.parse_args()
inputs, parts, vl = [], [], []
for i, v in enumerate(a.voice):
    f, at = (v.rsplit("@", 1) + ["0"])[:2] if "@" in v else (v, "0")
    inputs += ["-i", f]; ms = int(float(at) * 1000)
    parts.append(f"[{i}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={ms}|{ms}[v{i}]"); vl.append(f"[v{i}]")
D = a.dur
parts.append("".join(vl) + f"amix=inputs={len(vl)}:normalize=0:duration=longest,apad=pad_dur={D},atrim=0:{D},asplit=2[vo][sc]")
if a.music:
    mi = len(a.voice); inputs += ["-ss", str(a.music_from), "-i", a.music]
    parts.append(f"[{mi}:a]aresample=48000,aformat=channel_layouts=stereo,apad=pad_dur={D},atrim=0:{D},volume={a.music_vol},afade=t=in:d=0.3,afade=t=out:st={max(0, D - a.fade_out)}:d={a.fade_out}[mus]")
    parts.append("[mus][sc]sidechaincompress=threshold=0.03:ratio=4:attack=15:release=400[duck];[duck][vo]amix=inputs=2:normalize=0:duration=longest[pre]")
else:
    parts.append("[sc]anullsink;[vo]anull[pre]")
fc = ";".join(parts)
tmp = a.out + ".pre.wav"
subprocess.run([FFMPEG, "-v", "error", "-y", *inputs, "-filter_complex", fc, "-map", "[pre]", "-t", str(D), tmp], check=True)
# two-pass loudnorm
m = subprocess.run([FFMPEG, "-hide_banner", "-i", tmp, "-af", f"loudnorm=I={a.lufs}:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
j = json.loads(m[m.rindex("{"):m.rindex("}") + 1])
ln = f"loudnorm=I={a.lufs}:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true"
subprocess.run([FFMPEG, "-v", "error", "-y", "-i", tmp, "-af", ln + ",aresample=48000", "-t", str(D), "-c:a", "aac", "-b:a", "256k", a.out], check=True)
os.remove(tmp)
print("wrote", a.out)
