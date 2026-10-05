# Playbook: talking-head / founder reel (own recording)

## Capture advice to give the user (if they will record)
Vertical, eye level, window light in front, quiet room, start speaking immediately, 3–4 takes,
raise energy, one clap for sync. Phone HDR (HLG) is fine — convert with a plain scale + light eq.

## Edit
1. `transcribe.py` → read `transcript.txt`; mark the hook, the core value, the payoff, the CTA.
2. `autocut.py` (pauses >0.35 s → 0.18 s, fillers out) — keep one deliberate pause before the
   punchline. Cut the first draft by ~30%.
3. Hide jump cuts with alternating punch-ins 110–120% (130–150% on emphasis words); cut on action.
4. Visual change every 2–5 s: B-roll / screen inserts / motion-graphic cutaways on the exact
   words they illustrate (1.5–4 s each, every 4–8 s). Use `motion-broll` (one morphing shape,
   cursor-driven) or HyperFrames blocks; keep the face as the anchor.
5. Layout options (ask): face full-frame with cutaways · face only for the hook then voice over
   visuals · product on top + big face panel at the bottom · corner bubble (least favoured).
6. Captions: speaker's words, 2–5 per chunk, inside the safe box, bold, no karaoke template.
7. Sound: voice cleaned (highpass, denoise, speechnorm), quiet bed 18–25 dB under, sparse SFX,
   −14 LUFS. Spoken CTA last 2–4 s.

## Common failures
Face too small in a wide shot (crop in, 1.5–2× is fine from 4K) · eye-line off · captions over
the mouth · dead air at the start · ending on "so yeah…" instead of the payoff.

## Founder interview / Q&A shoot (added 2026)
One shoot → one long video + one reel per question. Prep a script file with ~10 questions and a
spoken-style sample answer each, written from the founder's OWN past words (mine webinar/podcast
transcripts for their phrasing and stories). Shoot rules to give the user:
- 4K 16:9, founder centred (so a 9:16 crop works), eye level, window light, lav mic on the founder.
- Interviewer beside the camera; founder looks at the interviewer.
- **Founder repeats the question in the answer** ("What makes X different is…") → every answer stands alone as a reel.
- 2 s pause after each question/answer; 20–40 s answers; restart stumbled sentences.
- Competitor questions: answer with what the product does, no attacks; only verifiable claims.
- Add a rapid-fire round (1–3 word answers) — easy fast reel.
Edit: each reel opens on the punchiest line of the answer (hook in the first 2 s), question as on-screen text,
motion cutaways on feature words, CTA at the end. Example: `Desktop/linkutm-founder-interview-SCRIPT.md`.
- **User preference (2026):** default to ONE bigger open question (e.g. "Why did you build X and what makes it
  different?") answered in 60–90 s, with a 5-step answer flow for the founder: punch line first (hook) →
  problem story → 2–3 differences → who it's for → CTA. Multi-question lists felt like too much; offer them only if asked.
- **Fact-check founder answers against the live website** (home, features, pricing, compare) and ship a fact sheet
  with the script: claim → source page, plus a "don't say" list (competitor prices/limits, retired offers,
  "coming soon" features, plan-gated features said as free). Flag inconsistencies found on the site.

## Educational "glossary" reel from a selfie recording (added 2026)
- Brief: value only, no product/selling; keep the speaker's VOICE + ~2 s of face (the hook line), rest = visuals.
- Fact-check the script against the source page (glossary/term) before building; fix ASR quirks in captions
  ("unknown wizards" → visitors) and light grammar, but never change meaning. Re-run ASR with medium.en for doubtful words.
- Front-camera footage is mirrored → `hflip` it (shirt text reads correctly). iPhone HLG → plain scale + eq for SDR.
- Face exit: the face shrinks into a rounded card and flies off while the first explainer screen rises (no hard cut).
- "Detective" visual grammar: rebuild the real tool screen (GA4 report) → literal metaphor object (bucket of unknown
  sessions) → sources fire clicks into it on their spoken words → consequence card (worked, 0 credit) → fix typed
  live → SAME report with the after-numbers (before/after payoff is allowed to reuse the screen).
- Scale check: first pass looked small/empty — every scene card ≥ 900 px wide, fonts ≥ 30 px, fill y 300–1260 above the caption strip.
- Series chrome: tiny mono label "GLOSSARY · TERM" + small handle; no CTA. Template: `promo-video-studio/src/GlossaryDirectTraffic.tsx`.

## Hook: speaker cut out with visuals BEHIND the head (user-approved 2026)
- **Keep the ORIGINAL filmed background** (user rejected a flat orange replacement): depth sandwich =
  layer 1 the real footage, layer 2 the animations, layer 3 the matted speaker (same frames, same transform as
  layer 1 so they stay aligned). Key word in brand colour + white stroke + shadow so it reads on a real wall;
  keep pills/cards in the corners so the head doesn't hide them.
- First 2–3 s = the speaker saying the hook/problem line; the key
  word set huge BEHIND the head (text-behind-subject), animated on the spoken words (slam, strike-through on "not"),
  data pill + chips + icons orbiting behind; slight push-in. Then a whip-up + white flash into full-screen visuals
  exactly on the music drop.
- Matting: `npx hyperframes remove-background in.mp4 -o out.webm --quality best` (u2net_human_seg, CPU, ~3 s/frame).
  Needs ffmpeg AND ffprobe on PATH; Remotion's bundled ffmpeg lacks the rawvideo demuxer → use a folder with the
  full ffmpeg-static ffmpeg.exe + Remotion's ffprobe.exe (D:\codes\work\bin). Use `<OffthreadVideo transparent>`.
- Music: pick a generated track with a built-in stop/drop, measure it (RMS at 50 ms), and delay it so the drop
  lands on the hook→visuals cut. Mix music OUTSIDE the render with sidechaincompress keyed by the voice; target
  music ≈ 12 dB under the voice (e.g. −27 vs −14.5 LUFS), master −13 LUFS / −1.2 dBTP.
- If the user re-records/re-exports, align new words to old by index (difflib) and remap time instead of re-animating.
- Better source audio → keep processing LIGHT (highpass + gentle compression + loudnorm); heavy denoise/EQ made take 1 worse.

## Body layout: never leave the bottom third empty (user feedback 2026: "lot of blank space at the bottom")
- If the brief is "face only in the hook", DON'T add a face card later (user rejected it: "dont show my face
  after the hook"). Instead grow the visuals: scale the scene layer ~1.04 + shift it down (~90 px) so the
  content spans y≈240–1360, centre short scenes (single cards) lower, and put the caption strip at y≈1410,
  50 px. Below ~1650 is Instagram's caption/UI overlay — fine to leave as background.
- If a face card IS wanted: caption box left (x 40–585) + lip-synced speaker card right (430×590); cut it with
  `cut.py --video` from the same segs, crop around the face, re-encode small with `-g 15` (a 1440×2560
  long-GOP file made OffthreadVideo time out on seeks and slowed the render a lot).
- Render speed: drop heavy video layers you don't need, use `--concurrency` ≈ cores/2 (12 on a 20-core box);
  45 s at 1440×2560 ≈ 5 min.
