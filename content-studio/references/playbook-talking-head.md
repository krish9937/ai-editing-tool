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
