"""Transcribe a video/audio file with WORD timestamps (faster-whisper, CPU-friendly).

python transcribe.py <media> <out_dir> [--model small.en] [--lang en] [--fix "link UTM=linkutm,GFO=GA4"]

Writes:
  words.json     [[start, end, word], ...]   (global seconds, after --fix replacements)
  segments.json  [{start,end,text}]
  transcript.txt "[mm:ss.xx] text" per segment (for reading/picking clips)
  captions.srt   sentence-level SRT (<= 6s / <= 90 chars) for YouTube etc.
"""
import argparse, json, os, re, subprocess, sys, tempfile
sys.path.insert(0, os.path.dirname(__file__))
from cs_env import FFMPEG

ap = argparse.ArgumentParser()
ap.add_argument("media"); ap.add_argument("out")
ap.add_argument("--model", default="small.en")
ap.add_argument("--lang", default=None)
ap.add_argument("--fix", default="", help='comma list "wrong=right" applied to words (multi-word ok)')
a = ap.parse_args()
os.makedirs(a.out, exist_ok=True)

wav = os.path.join(tempfile.gettempdir(), "cs_tx_16k.wav")
subprocess.run([FFMPEG, "-v", "error", "-y", "-i", a.media, "-vn", "-ac", "1", "-ar", "16000", wav], check=True)

from faster_whisper import WhisperModel
model = WhisperModel(a.model, compute_type="int8")
segs, _ = model.transcribe(wav, word_timestamps=True, vad_filter=True, language=a.lang)
S, W = [], []
for s in segs:
    S.append({"start": round(s.start, 2), "end": round(s.end, 2), "text": s.text.strip()})
    for w in s.words:
        W.append([round(w.start, 3), round(w.end, 3), w.word.strip()])

# fixes: "link UTM=linkutm" merges consecutive words too
for pair in [p for p in a.fix.split(",") if "=" in p]:
    wrong, right = [x.strip() for x in pair.split("=", 1)]
    parts = wrong.split()
    i = 0
    out = []
    while i < len(W):
        win = [re.sub(r"[^\w]", "", w[2]).lower() for w in W[i:i + len(parts)]]
        if len(win) == len(parts) and win == [re.sub(r"[^\w]", "", p).lower() for p in parts]:
            tail = re.sub(r"^[\w']+", "", W[i + len(parts) - 1][2])  # keep trailing punctuation
            out.append([W[i][0], W[i + len(parts) - 1][1], right + tail]); i += len(parts)
        else:
            out.append(W[i]); i += 1
    W = out

json.dump(W, open(os.path.join(a.out, "words.json"), "w"), ensure_ascii=False)
json.dump(S, open(os.path.join(a.out, "segments.json"), "w"), ensure_ascii=False, indent=1)
with open(os.path.join(a.out, "transcript.txt"), "w", encoding="utf-8") as f:
    for s in S:
        f.write(f"[{int(s['start']//60):02}:{s['start']%60:05.2f}] {s['text']}\n")

def ts(t):
    ms = int(round(t * 1000)); return f"{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}"
cues, cur = [], []
for w in W:
    cur.append(w)
    txt = " ".join(x[2] for x in cur)
    if w[2][-1:] in ".?!" or len(txt) > 80 or (cur[-1][1] - cur[0][0]) > 5.5:
        cues.append(cur); cur = []
if cur: cues.append(cur)
with open(os.path.join(a.out, "captions.srt"), "w", encoding="utf-8") as f:
    for i, c in enumerate(cues, 1):
        f.write(f"{i}\n{ts(c[0][0])} --> {ts(c[-1][1])}\n{' '.join(x[2] for x in c)}\n\n")
print(f"words={len(W)} segments={len(S)} -> {a.out}")
