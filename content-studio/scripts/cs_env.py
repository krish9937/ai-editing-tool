"""content-studio: locate tools (ffmpeg, ffprobe, python whisper) on any OS.

Usage as a module:  from cs_env import FFMPEG, FFPROBE, run, probe
Usage as a script:  python cs_env.py   -> prints what was found and what is missing
"""
import json, os, shutil, subprocess, sys, glob
try:  # Windows consoles (cp1252) choke on non-ASCII prints
    sys.stdout.reconfigure(encoding="utf-8", errors="replace"); sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

def _find(name):
    env = os.environ.get(name.upper())
    if env and os.path.exists(env):
        return env
    p = shutil.which(name)
    if p:
        return p
    # npm ffmpeg-static / ffprobe-static anywhere under the user's home (common on Windows)
    home = os.path.expanduser("~")
    pats = [
        os.path.join(home, ".claude", "jobs", "*", "tmp", "node_modules", f"{name}-static", f"{name}*"),
        os.path.join(home, "node_modules", f"{name}-static", f"{name}*"),
        os.path.join(os.getcwd(), "node_modules", f"{name}-static", f"{name}*"),
        os.path.join(home, "AppData", "Roaming", "npm", "node_modules", f"{name}-static", f"{name}*"),
        "D:/codes/*/node_modules/" + f"{name}-static/{name}*",
    ]
    for pat in pats:
        for hit in glob.glob(pat):
            if os.path.isfile(hit) and os.path.basename(hit).split(".")[0] == name:
                return hit
    try:  # pip install imageio-ffmpeg
        if name == "ffmpeg":
            import imageio_ffmpeg
            return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        pass
    return None

FFMPEG = _find("ffmpeg")
FFPROBE = _find("ffprobe")

def run(args, check=True, capture=False):
    """Run a command list; returns CompletedProcess."""
    return subprocess.run(args, check=check, capture_output=capture, text=True)

def probe(path):
    """Duration / streams via ffprobe, or a parsed `ffmpeg -i` fallback."""
    if FFPROBE:
        out = run([FFPROBE, "-v", "error", "-print_format", "json", "-show_format", "-show_streams", path], capture=True).stdout
        return json.loads(out)
    r = subprocess.run([FFMPEG, "-hide_banner", "-i", path], capture_output=True, text=True)
    info = {"raw": r.stderr}
    import re
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", r.stderr)
    if m:
        info["duration"] = int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])
    m = re.search(r"Video: .*? (\d{2,5})x(\d{2,5})", r.stderr)
    if m:
        info["width"], info["height"] = int(m[1]), int(m[2])
    m = re.search(r"(\d+(?:\.\d+)?) fps", r.stderr)
    if m:
        info["fps"] = float(m[1])
    return info

def duration(path):
    p = probe(path)
    if "format" in p:
        return float(p["format"]["duration"])
    return p.get("duration")

if __name__ == "__main__":
    print("ffmpeg :", FFMPEG or "MISSING  (install: winget install Gyan.FFmpeg | brew install ffmpeg | npm i ffmpeg-static | pip install imageio-ffmpeg)")
    print("ffprobe:", FFPROBE or "missing (optional; ffmpeg -i parsing is used instead)")
    try:
        import faster_whisper  # noqa
        print("faster-whisper: ok")
    except Exception:
        print("faster-whisper: MISSING (pip install faster-whisper)  -> needed for transcribe.py")
    print("python :", sys.executable)
