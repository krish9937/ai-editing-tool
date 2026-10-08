# Align an approved script (any language, e.g. Roman Hinglish) to a voiceover when whisper TRANSLATES instead of
# transcribing. Whisper (lang=en) gives reliable SENTENCE boundaries; inside each sentence the script words are placed
# along the voiced time (RMS) by syllable weight.
# usage: python align_script_to_audio.py <vo.wav (mono 16-bit)> <whisper_dir with words.json + transcript.txt> <sentences.txt> <out_words.ts>
#   sentences.txt: one line per whisper segment (merge/split lines until the counts match — the script asserts it).
# Afterwards pick timing anchors on UNIQUE words and print them — repeated words ("aur", "ek", "aaj") hijack anchors.
import json, re, sys, wave, struct, math

wav, txdir, sentf, out = sys.argv[1:5]
script = [l.strip() for l in open(sentf, encoding="utf-8") if l.strip()]
W = json.load(open(f"{txdir}/words.json")); W = W["words"] if isinstance(W, dict) else W
starts = []
for line in open(f"{txdir}/transcript.txt", encoding="utf-8"):
    m = re.match(r"\[(\d+):(\d+\.\d+)\]", line)
    if m: starts.append(int(m.group(1)) * 60 + float(m.group(2)))
sg = []
for k, s in enumerate(starts):
    nxt = starts[k + 1] if k + 1 < len(starts) else 1e9
    ws = [w for w in W if s - 0.01 <= w[0] < nxt - 0.01]
    sg.append((ws[0][0], ws[-1][1]))
assert len(script) == len(sg), f"{len(script)} script lines vs {len(sg)} whisper segments — edit sentences.txt"

f = wave.open(wav); sr = f.getframerate(); n = f.getnframes()
x = struct.unpack(f"<{n}h", f.readframes(n)); hop = sr // 100
rms = [math.sqrt(sum(v * v for v in x[i:i + hop]) / hop) for i in range(0, n - hop, hop)]  # 10 ms frames
thr = max(rms) * 0.04
syl = lambda w: max(1, len(re.findall(r"[aeiouy]+", w.lower())))

res = []
for text, (a, b) in zip(script, sg):
    words = text.split()
    fr = list(range(int(a * 100), min(len(rms), int(b * 100) + 1)))
    voiced = [i for i in fr if rms[i] > thr] or fr
    wts = [syl(re.sub(r"[^A-Za-z0-9]", "", w) or "a") for w in words]; tot = sum(wts); acc = 0
    for w, k in zip(words, wts):
        i0 = voiced[min(len(voiced) - 1, int(acc / tot * len(voiced)))]; acc += k
        i1 = voiced[min(len(voiced) - 1, max(0, int(acc / tot * len(voiced)) - 1))]
        res.append([round(i0 / 100, 2), round((i1 + 1) / 100, 2), w])
open(out, "w", encoding="utf-8").write("export const W: [number, number, string][] = " + json.dumps(res, ensure_ascii=False) + f";\nexport const END = {round(res[-1][1] + 0.3, 2)};\n")
print(out, len(res))
