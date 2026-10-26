# Study: "editorial explainer" avatar reel (IG @adilet.fndr, reel De4byPBoLWT, studied 2026-10-26)
66 s, 9:16 720x1280, ElevenLabs-style VO, one continuous "page". Technique notes in our own words — do not copy the words/avatar.

## Look (design system)
- Paper: warm off-white (#EFECE8-ish) with fine noise/grain; ink black; ONE accent red (~#E1251B). No other colours except product UI.
- Typography: big sans headline top-left (Space Grotesk / Inter-style), words appear word-by-word, upcoming words light grey;
  the KEY word switches to red *italic serif* (Instrument Serif / Playfair). Tiny mono HUD line at top: "// 03 · early" left, a live
  counter right ("FOLLOWERS 39,524", "SEATS LEFT 8", "LOUDNESS -14 LUFS") that changes per beat.
- Halftone everywhere: dotted (halftone) drop shadows under cards, phones and the avatar; full-screen black halftone dot wipe as
  the section transition (dots grow → black → shrink into next scene). Remotion 4.0.469+: @remotion/effects halftone /
  halftoneLinearGradient (WebGL2), or a custom dot-grid div/canvas whose dot radius = f(distance to wipe front).
- Presenter: a stylised cartoon bust of the creator (beanie, glasses, beard) fixed bottom-centre the whole reel; swaps hand
  poses / expressions per beat (pointing, shrug, hands-on-face, OK), small "shock lines" doodles. Seller says: avatar from one
  photo, phoneme lip-sync, IK arms, 6 hand poses, moods. Practical route for us: generate a consistent pose sheet from a photo
  with an image model (Nano Banana / Gemini Flash Image: "same character, solid background, poses: point up, shrug, facepalm,
  OK, wave, thinking"), cut out (rembg), animate with springs + mouth swap; or build an SVG puppet (we have toy-cartoon-cast-svg).
- Centre stage = one "object" per beat drawn as clean product/paper props: dark IG profile UI with counters, phones, calendar
  flip, theatre seat map filling red, crowd of doodle heads with "1%", ticket "No. 2481", file cards exploding into a counter
  (221 files), spring/whip/zoom "tuning cards", caption-timeline UI, guitar-pedal audio chain (CUT SPEED LOUD PEAK),
  film strip with a score that goes 3.8 → 8.2 PASS, Claude Code/Cursor/Codex terminal, views chart 4.9M, envelopes $2,500+.
- Red rubber STAMPS slam on the payoff of almost every beat ("35 DAYS", "SEALED", "DECODED", "TUNED", "READY", "PASS",
  "AI SLOP", "BRAND DEALS") with a little shake + paper-scrap particles. Hand-drawn red circles/underlines annotate numbers.

## Motion
- Cut on every stressed word; ~1 new object/state every 0.5–1 s; nothing static > ~1.2 s.
- Spring overshoot entrances, whip pans with blur between cards, zoom kicks on numbers, impact shake on stamps, counters
  rolling, objects morph into the next beat's object (object-driven transitions), halftone wipe at 3–4 section breaks.
- Captions land slightly BEFORE the word is said (key word ~0.15 s early).

## Sound
- Voice upfront (−14 LUFS master), per-beat SFX (stamp thud, paper, whoosh, counter ticks), music very low.

## How we rebuild it (our stack)
Remotion comp 1080x1920: <Paper/> bg + grain, <Hud section counter/>, <Headline words keyword=serif-red/>, <Stage> per-beat prop
components with spring/whip/zoom helpers, <Stamp/>, <HalftoneShadow/> (CSS radial-gradient dot pattern masked to the object's
shape, offset 14 px), <HalftoneWipe/> (dot grid, radius from wipe front), presenter bust (pose images or SVG puppet, mouth from
VO RMS). Lily/ElevenLabs VO, words from whisper, mix chain as in production-lessons.
