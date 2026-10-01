# Playbook: long recording → shorts (podcast, webinar, interview, livestream)

Target: a 60-min source → 8–12 ranked clip candidates in ~10–15 min; each finished clip 30–40 s
(user preference) unless asked otherwise.

## Steps
1. **Ingest**: `yt-dlp -f "bv*[height<=1080]+ba/b" -o src.%(ext)s URL` (own/authorised content
   only). Conform: `ffmpeg -i src.mkv -vf fps=30 -c:v libx264 -crf 18 -g 15 -c:a aac -ar 48000 conf.mp4`.
2. **Transcribe**: `python $CS/scripts/transcribe.py conf.mp4 work/ --fix "link UTM=linkutm,GFO=GA4,Smith=Smit"`.
3. **Pack** for selection: `python $CS/scripts/pack_transcript.py work/words.json work/packed.txt`
   (sentences with timestamps and ‖pause markers — ~12 KB/hour, cheap to reason over).
4. **Pick clips** (you, the LLM) — strict JSON `[{start,end,title,hook_line,why,score}]`:
   - starts on a complete, standalone sentence; one idea; payoff inside; ≤30 s of setup
   - virality signals: a strong claim or contrarian take, a concrete story (client, numbers),
     a "how to" with a result, emotion/laughter, a vivid example ("Facebook vs facebook vs FB")
   - grade Hook / Flow / Value / Trend (OpusClip-style); dedupe >50% overlap
   - present a ranked table with timestamps + why → user picks (C1)
5. **Snap** boundaries in code: start = word start − 0.08 s; end = first pause ≥250 ms after the
   last word (never mid-word; extend to the sentence end). Then `autocut.py --from --to` to tighten
   pauses/fillers → `cut.py --voice --clean`.
6. **Layout** by source type:
   - **Side-by-side cams** → crop the speaker to 9:16 (`reframe.py`), or stack two cams.
   - **Screen share + small cam circles** → the shared screen is NOT legible at 9:16: rebuild the
     UI full-screen (see playbook-demo) and put the speaker's lip-synced cam in a big bottom
     panel (`cut.py --video --crop W:H:X:Y --scale 630:630`, `--zones/--freeze` when the cam moves).
   - Crop out platform name labels and the other person unless they're part of the moment.
7. **Hook**: if the clip doesn't open with a hook line, add one (speaker's ElevenLabs clone over a
   real listening shot of them), first frame shows the hook text.
8. **Captions**: speaker's words only (proofread names/brands), typewriter strip or brand style.
9. **Outro**: CTA in the speaker's voice on the brand page — or a genuine reaction from the same
   recording if the user prefers (say if it's moved from another minute).
10. **Batch**: same template for every clip; render silent → mix → export → qa.

## Gotchas
- Webinar cams move between layouts (screen share ↔ gallery ↔ picker). Scan positions at 0.5 s
  intervals around every segment boundary; freeze while sliding.
- Host misstatements (e.g. pricing tiers) — never include them in a clip.
- Credit the host/channel in captions when the clip comes from their stream.
