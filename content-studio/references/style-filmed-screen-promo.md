# Style: "Filmed-screen promo" (screen-in-camera + illustrated motion story)

Studied 2026 from a viral SaaS reel (53 s, ~5k likes, ~2.6k comments): a phone films a laptop in a
dark room while the laptop plays an AI-made motion-graphics ad; ends with "this whole video was made
with AI — comment KEYWORD". Learn the grammar below; never rebuild the reference's look 1:1 (own
colours, own characters, own story). Capability VERIFIED: test comp
`promo-video-studio/src/StyleTestFilmedScreen.tsx` reproduces every technique below in Remotion
(port to HyperFrames the same way — it is all CSS/SVG + time functions).

## 1. Names of the editing techniques (use these words with the user)

| Name | What it is | How we build it |
|---|---|---|
| **Screen-in-camera / screen-in-scene** (a.k.a. "filmed screen", "monitor shot") | The video plays on a real device that is filmed, so viewers see the room, the bezel, reflections | Best: play the render full-screen on a laptop and film it with a phone. Fallback: CSS-3D laptop (`perspective` + `rotateX`) in a lit room plate |
| **Screen replacement / screen insert** | Replacing a filmed device's screen with your render (corner-pin / 4-point track) | ffmpeg `perspective` filter or Remotion `matrix3d` on a filmed plate with a green/blank screen; track corners if handheld |
| **Handheld camera simulation** ("camera shake", "phone-cam look") | Small irregular drift, roll and slow push | Sum of 2–3 slow sines on x/y/rotation (≤6 px, ≤0.5°) + 0.5%/s zoom. Never random per-frame jitter |
| **Hero object / object-led storytelling** | One object carries the whole story and changes state with each beat | A single glossy coin/blob/card whose SIZE + NUMBER change; never cut away from it |
| **Count-up / count-down ticker** ("rolling number", "odometer") | Numbers animate to their value | `Math.round(interpolate(t, …, easeOut))` with `toLocaleString` |
| **Number-subtraction story** ("arithmetic narrative") | Big number → each cost removes a slice → the true number; the math must add up | Script first, verify the sum, one beat per subtraction |
| **Mascot / character animation** (cute icons, "Pixar-ish") | Each cost/problem is a little character with eyes | SVG shapes + two eye circles; pop in with a spring, lunge at the hero object |
| **Bite / squash-and-stretch / impact** | The character hits the object; it squashes and shrinks | Character translateX in-out on a cubic, object scale spring down |
| **Liquid melt / drip effect** | Drops fall off the object as it loses value | Small rounded divs with gravity `y = t²·k`, fading; or SVG goo filter |
| **Kinetic typography — word slam / impact text** | One huge word punches in (scale 2.2 → 1), screen shakes | Spring with low damping + 0.4 s decaying sine shake on the previous layer |
| **Mixed-type pairing** (bold grotesk + italic serif) | "LYING." in heavy sans + "to you." in italic serif | Use sparingly — the user has called serif-italic accents AI-ish on other videos; ask first |
| **Hand-drawn annotation / circle draw-on** | A marker circle draws around the final number | SVG path with `pathLength=100` + `strokeDashoffset` |
| **Colour-act structure** | Problem on hot colour (orange/dark), solution on clean white | Background per act; the switch IS the transition |
| **Match-cut / morph transition** | The object in one scene becomes the next scene's element | Keep position/size continuous across the act change |
| **Chaos pile** | "14 tabs open" — many UI tabs tumbling in 3D | 10–20 small cards with random rotation, staggered springs |
| **Meta reveal ("made with AI")** | Final beat breaks the 4th wall: the terminal/editor that built it | Real screen recording of the build (Claude Code, HyperFrames studio), sped up |
| **Comment-keyword CTA** ("comment PROMPTS") | Lead magnet → comments → DMs | Pill on screen + spoken; pair with ManyChat or manual replies |
| **Static creator caption** | One top caption the whole reel ("Claude Cooked 😮‍💨") | Separate from the VO captions; acts like a title |

## 2. Rules for this style

1. **Story = numbers that add up.** Write the subtraction first; check the arithmetic; show each
   number on its spoken word (± 2 frames). Mark illustrative numbers as an example, never as customer data.
2. **One hero object per act.** It never leaves the frame in its act; it changes size/number/state.
3. **≤ 3 words of kinetic text at a time**, and only on the beat word ("LYING.", "Paused.", "Fewer tabs.").
4. **Characters = the problems, the product = the calm.** Problems are cute and chaotic; the solution
   is clean white UI, slow, aligned.
5. **Every visual change lands on a VO word**; VO first (ElevenLabs / user's voice), then animate.
6. **The filmed layer must be real-looking:** room light spill on the keyboard, screen glow, vignette,
   grain, handheld drift. Prefer REAL filming of the laptop (phone, 4K, lock exposure, dim room, screen
   brightness ~70%, film the full playback once, slight hand movement, no moiré: shoot a bit off-axis).
7. **Laptop screen must stay readable on a phone:** the screen fills ≥ 90% of frame width; text on the
   promo ≥ 48 px at 1600 px wide; no tiny UI copy carries meaning.
8. **Hook in the first 2 s:** provocative claim + a concrete number, spoken at frame 0.
9. **Meta reveal is optional** — only if the account talks to creators/marketers; otherwise end on the
   product + a spoken CTA.
10. **Ask first:** story, palette (don't reuse the reference's orange/purple by default), characters,
    caption line, CTA keyword, real filming vs simulated. Theme gate (SKILL §0c) still applies.

## 3. Build recipe

1. Script with timings → TTS/VO → word timestamps (`scripts/transcribe.py`).
2. Build the promo at 1600×1000 (16:10 laptop) as its own composition; acts as functions of `t`.
3. Render the promo 16:10 → play on the laptop and film (preferred) **or** wrap in the simulated
   laptop room (9:16), as in `StyleTestFilmedScreen.tsx`.
4. Add the static top caption, mix VO + music (−14 LUFS), QA the frame-0 text and the safe box.

## App launch teaser variant ("coming soon", phone) — 2026
- Rebuild screens from the app's SOURCE (theme tokens, verbatim labels, real widget/splash) — a sub-agent
  extracting a spec from the repo is fast and makes the UI exact. Never show a feature the code doesn't
  have (e.g. push notifications that aren't wired).
- Generate the music FIRST (ElevenLabs Music `force_instrumental`; check the take's RMS curve — one take
  came back near-silent), then map beats: hits → hard cuts + camera kick + flash; riser → accelerating
  montage of earlier screens; 0.2 s black on the stop; impact → the app's real splash + "Coming soon."
- Phone at ~1.8× a 390-pt screen in a 1080 frame; camera focus-zooms (1.12–1.2) on the active area so
  UI text stays readable; "show taps" circles sell the interaction; static top caption from frame 0.

### v1 → v2 lesson (user called v1 "very lame") — 2026
- v1 failed on retention: calm home-screen opener, dark room, soft cinematic music, Android, a riser montage
  that REPEATED screens. v2 fixes that the user accepted as the direction:
  - **Hook = object entrance on the first bass hit**: the iPhone falls in already lit (frame 0 shows phone + hook
    text on a solid plate so it reads over anything), lands on the beat with squash, shockwave ring, white flash, impact SFX.
  - **Colour-flip world**: background flips on bar lines using the app's own swatches (no black).
  - **Speed map**: everything fast (screens time-compressed ×1.5–1.6) except the ONE hero moment
    (the QR pops OUT of the phone toward camera in slow-mo) and the final reveal.
  - **Abundance beat**: each design option fires a banner out of the phone on half-beats, then a rotated
    multi-column wall of banners scrolls in opposite directions behind a smaller phone.
  - **Built drop**: if generated music has no drop, make one in the edit: lowpass the bar before (450 Hz),
    0.24 s silence, full track back on the reveal beat. Fit BPM/phase by autocorrelation of the onset envelope.
  - Headline per section (2–4 words) with fast word stagger; plate behind text when it sits over busy art.
- v3 notes (user loved v2, asked for): the OUTRO needs CONTEXT — one sentence on what the product is, then the
  launch lockup pinned at the bottom (white card: app icon + product name + "Coming soon"). Show the real
  dashboard in depth (scroll to the donut/charts) rather than one card. "Abundance" needs VARIETY: vary module
  shape, corner style, gradient, centre icon and card layout; only some items get a text label. Never leave a
  blank/black screen between beats — keep the last screen alive through the music gap.
