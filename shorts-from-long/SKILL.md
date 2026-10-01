---
name: shorts-from-long
description: Turn a long video (podcast, webinar, interview, livestream, YouTube video, Zoom call) into ranked, captioned vertical shorts/reels/TikToks fast — transcribe, pack transcript, pick self-contained clips with hooks, snap to words, tighten pauses/fillers, reframe to 9:16 around the speaker (or rebuild screen-share UI legibly), captions, CTA, platform export + QA. Use when the user gives a long recording or URL and wants clips, highlights, shorts or reels from it.
---

# shorts-from-long

**Before anything is generated:** behave like a professional editor (content-studio §0b) and get the client's
explicit approval of the brief AND the theme/look (2–3 concrete directions + your recommendation, §0c).
Only transcribing, planning and contact sheets of their own footage are allowed before that.

This is a focused entry into the **content-studio** skill. Load and follow:
1. `~/.claude/skills/content-studio/SKILL.md` (non-negotiables, intake, pipeline, QA)
2. `~/.claude/skills/content-studio/references/playbook-clipping.md` (the step-by-step for this job)
3. `~/.claude/skills/content-studio/references/production-lessons.md`

Fast path (scripts in `~/.claude/skills/content-studio/scripts/`):
```
python transcribe.py src.mp4 work --fix "wrong=right,..."      # words.json, transcript.txt, captions.srt
python pack_transcript.py work/words.json work/packed.txt       # read this, pick clips (ranked JSON)
python autocut.py work/words.json work/clip1.json --from S --to E
python cut.py src.mp4 work/clip1.json work/clip1 --voice --clean [--video --crop W:H:X:Y --scale 630:630]
python reframe.py src.mp4 work/clip1_9x16.mp4 --start S --dur D [--region x0,x1]   # cam/talking-head sources
python captions_ass.py words_clip1.json work/c1.ass --style typewriter --first-frame-text "HOOK" --burn in.mp4 out.mp4
python mix.py work/clip1.m4a --dur D --voice work/clip1_voice.wav@0 [--music bed.mp3]
python export.py silent.mp4 work/clip1.m4a out/clip1 --platforms reels,shorts,linkedin   # runs qa.py
```
Show the user the ranked clip list (C1) and a contact sheet (C2) before final renders.
