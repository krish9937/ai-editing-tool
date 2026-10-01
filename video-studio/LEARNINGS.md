# video-studio: learnings log

Append-only. Newest at the top. Each entry: date · source · lesson · how to apply.
Read this before designing any new video.

> These are PRINCIPLES distilled from references, not elements to copy. Stay open to
> any source; never rebuild one brand's look. (User direction, 2026.)

---

## First frame + outro rules (2026)
- **No dead space at the bottom of a 9:16 frame**: the user wanted the empty bottom filled with the
  founder — a panel with a BIG lip-synced face (≈40% width) and captions beside it, product screens above.
- **Frame 0 is the reel's preview/cover in the feed**: it must already show the hook TEXT fully
  written (not an empty caption strip waiting to type). Animate captions only after that.
- **Outro = a proper CTA**, in the speaker's (cloned) voice, on the brand page: logo draws in, the CTA line
  typed as spoken ("Track every campaign link in one place. Try linkutm free, at linkutm.com."), then the
  URL + a real CTA button label from the site ("Start for free"). A host compliment as the outro was
  replaced by this.
- ffmpeg: `sidechaincompress` ends with its shortest input — `apad` the voice bus (bounded by `-t`) so
  the music fade-out isn't cut off at the end.

## Feedback: what finally landed for webinar clips (2026)
- FINAL: real footage for the PEOPLE (speaker listening full-frame as the hook opener, lip-synced
  cam in the corner, the real host reaction as outro) + FULL-SCREEN REBUILT UI for the screens.
  The real 1080p screen share, even with punch-ins, was "not visible" on a phone.

## Feedback: rebuilt UI + logo pages read "AI-ish and generic" (2026)
- For clips from a real recording, the most human result was to edit the REAL footage: a screen track
  cut to the voice edit list (so clicks land on words), shown in a panel with eased punch-ins aimed at
  the exact element being talked about (keep webinar cam circles out of frame), the speaker's real
  lip-synced cam below, and real numbers. No redrawn screens, no made-up data, no logo slide.
- No opener recording? Use a real moment of the speaker LISTENING (mouth closed) full-frame with the
  cloned-voice hook as a voiceover — no lip-sync mismatch.

## Hook shape the user approved (2026)
- FINAL: the brand LOGO PAGE (fast logo anim) with the spoken hook + topic line playing over it from frame 0,
  each line typed under the logo as spoken; then slide into the content. (A filter-pile macro + payoff
  flash-forward version was rejected as "very bad".)
- Earlier variant: 0–2.5s spoken pattern-interrupt ("Wait... let me save thirty minutes of your day!") over the PROBLEM
  visual; then ≤3s: one line saying what the reel is ("Here's how to see GA4 data for any single link.")
  over a flash-forward of the PAYOFF; then the content. Problem → promise → story.
- ElevenLabs tips: spell acronyms as letters in the TTS text ("G A 4"); low stability/high style made
  delivery slow and drawn out (7s) — use `speed` 1.08–1.2 for punch; trim leading silence so the voice
  starts at ~0.05s; let the user pick between 2–3 takes via previews followed by the real footage.

## Outro the user liked: a real reaction, not a card (2026)
- End a webinar/podcast clip on a GENUINE moment from the same recording, e.g. the host reacting
  ("Awesome… your dashboard is also very cool looking, right?" / "Yeah"), shown as a call view of
  both lip-synced cams with the active speaker ringed. Human social proof instead of logo/URL/CTA.
  Say so if the moment is moved from a different minute.

## Tool added: motion-broll (MIT, by Bart) — 2026
Installed at `~/.claude/skills/motion-broll` (Windows notes in its WINDOWS.md). Principles worth reusing
even inside Remotion: ONE shape that morphs between states and never cuts; a cursor drives every change
(real clicks/drags) and each change lands on a spoken word; springs with at most a tiny overshoot,
leading/trailing edges on different springs; camera zooms so each state fills the frame; real motion
blur (4 sub-frames / 180° shutter); banned: bouncy easing, particles, glows, UI-chrome gradients,
template looks. Best fit: talking-head clips (cutaways on key words, then back to the face).

## Feedback round: GA4 webinar clip v1 → v2 (2026)
- **"Sans + orange italic-serif accent words" read as AI-ish** (it's become a template look). Also
  slogan headlines ("Which link actually worked?", "No need to open GA4.") read as AI-written.
  → v2: NO slogans; the only words on screen are real UI labels + the speaker's own words.
- **Captions the user liked: a typewriter in a dark monospace strip**, typed as the words are spoken,
  block cursor, no colour/italic accents.
- **Data must use the WHOLE screen**: small floating panels/cards on a stage looked weak. Make the
  frame itself the app (full-bleed screens that navigate: tab switch → click → date picker → load
  → scroll). Illustrative "modest" made-up numbers were fine once the user approved them.
- **Presenter cam in a corner the whole time he speaks** (lip-synced track built from the webinar
  cam, following its on-screen position; freeze frames only while the cam slides).
- **Never let the first second be empty** — open on real footage (e.g. the actual webinar cams) the
  instant the video starts. **Never clip the last word**: whisper word ends run early; extend the final
  segment to the natural sentence end ("…as well.") and listen to the tail.
- ~~Brand intro (logo + topic slide)~~ **REVERSED next day:** no logo intros or outro cards on reels.
  Open with a SPOKEN catchy hook at frame 0 (cloned voice if needed); viewers scroll in ~1s.
- **ffmpeg hang guard:** put `-t <DUR>` on every mux/mix output; an `apad` branch inside a complex
  graph can still hang the job even with atrim, and it silently blocks every chained step after it.
- Keep the filmed feel on a full-screen UI with a light camera drift/push + warm tint + grain + vignette.

## Build: webinar clip → crafted Short, "desk at night" (2026)
- Recut a webinar segment by an edit list of word-timed segments (0.1–0.45s gaps) → a tight 34s
  voice track with no audible jumps; captions remapped from the same word timings.
- Face only where it carries meaning (the problem + the payoff), lip-synced from the original cam.
- Mix real footage (wide, graded, drifting) with crisp rebuilt close-ups that use the EXACT numbers
  on screen at that line. Honest + legible.
- Warm dark stage + grain makes white app screens read like lit monitors (filmed feel).
- Align the music's natural drop to the visual payoff (focus pull), and let the track's own
  breakdown fall on the end card, for a quiet ending with no cut.

## Reference study: chaptered value reel with an avatar presenter (studied 2026)
Source: a 52s founder "value" reel (AI UGC workflow + comment-keyword CTA).

- **Numbered chapters** (`// 01 — hook`, `// 02 — the old way` …) as mono labels top-left, plus a
  **live counter top-right** that tells the argument in numbers (USERS 0 → VIDEOS 40/40 → SPENT $10,000
  → FLOPS 39/40 → HITS 1/40 → LAWSUITS 0 → COMMENTS 2,677). → Structure you can see; great for value reels.
- **The headline IS the caption**: top-left grotesk, built word-by-word as spoken (upcoming word faint grey),
  **key words in an italic serif in the accent colour**. Replaces separate captions entirely.
- **Hook promises a payoff at the end** ("one prompt I'll give you at the end") + **comment-keyword CTA**
  ("Comment KEY and I'll DM you the setup") → retention, comments, DMs.
- **Avatar presenter** (a cartoon of the founder, halftone cut-out, bottom-right) that acts on the beats
  (points, waves, sweats, covers its mouth, raises one finger), with glitch/ghost pose changes. Human
  presence for founders who don't want to show their face.
- **A colour world per chapter** (paper + red for money, black terminal + lime for code, white + pink
  glow for the warning, dark glitch for the offer). The world change is the transition.
- **One concrete prop per beat, centred**: receipt, search bar, tile grid that fills, time-lapse clock,
  real-looking terminal commands, crossed-out fake review, comments sheet filling with the keyword.
- **Honesty beat** ("one rule so you don't get sued") earns trust in a value reel.

## Reference study: calm "assistant" reels (studied 2026)
Source: two reels from an AI-desktop-assistant brand (a 36s cinemascope "I have a dream" story
and a 34s 9:16 "apply for your visa" demo, ~13k likes).

- **Backdrop = one real, beautiful, continuous shot** (dusk city timelapse, a desk at night).
  The product UI floats in that world, small. → Reads as "this lives on your screen", not "an ad".
- **The screen is filmed, not captured**: warm grade, grain, vignette, drift, macro crops.
  → The single biggest anti-AI signal. Apply it even to our own screen recordings (grade + crop + drift).
- **POV hands** (keyboard shortcut press, trackpad) bookend the screen. Human presence without a face.
- **Conversation as the interface**: speech bubbles stacking as lines are spoken, a voice pill that
  changes state (speaking → listening), a notch "Listening" pill.
- **A task/agent card** with a live status line ("Connecting agent and tools…") + Stop/Open,
  and a proposal card with Yes / No / Adjust. → Shows the product *working*, not *listed*.
- **Failure → success on the same object** (red "File exceeds the 2 MB limit" → green
  "Document accepted"). → Tension and payoff without any effect.
- **Captions**: white bold humanist sans, soft shadow, no box, 2–3 words, mid-frame;
  hesitations ("Umm") kept.
- **Rhythm**: a cut every 2–3s, motivated by action; the only big move is a rack focus from UI
  to the real laptop.
- **Ending**: black → white mark → URL → "try it for free".
- **Escalation close**: three rapid asks ("I want to run ads / I have an idea / I have a dream")
  state the brand promise without saying it.

## Feedback: "good, but too AI-ish" (2026)
Previous videos in this pipeline (illustrated stages, per-char roll headlines, selection-sweep
titles, karaoke pill captions, dot-grid/blob backgrounds, shockwave payoffs) were called good
but "too AI-ish". → Use the Craft bar in SKILL.md; ask everything before building; balance
product reels with **value reels** (standalone educational tips).
