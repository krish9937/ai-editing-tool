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
