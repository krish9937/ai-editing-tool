# snapcn — what we took from it (studied 2026-10-26)

Source: `Downloads\snapcn-main` = github.com/snapcndev/snapcn (snapcn.dev, by Sri Nath, MIT). A shadcn-style
registry of **Remotion** components for product-demo videos (`npx shadcn add @snapcn/<name>` copies the source into
the project). 47 free items + 50 paid "Pro" (we don't pay — free tier only). Ships agent skills: `snapcn` + workflow
skills (launch-video, product-demo, motion-graphics, kinetic-typography, logo-animation, explainer-video) and a
`.claude/skills` set (motion-quality, apple-design, emil-design-eng, review-animations, improve-animations,
animation-vocabulary, ux-ui-maxpro). Canvas standard 1280×720@30. Remotion licence caveat still applies (company
licence above small teams) — our default renderer stays HyperFrames; port the IDEAS, or install components only for
Remotion builds.

## 1. Motion direction (MOTION.md) — port to HyperFrames
- **The camera is a layer.** One world, a virtual camera dollies/pans/cranes through it; outgoing + incoming ride
  ONE curve (no two independent fades).
- **Motion blur on fast camera moves**, sharpness = settled. Fast travel 8–14 f → hard ease-out brake 10–16 f →
  **text hold 30–45 f**. Stagger 3–6 f. Spring settle ≈ damping 18 / stiffness 140; card pop ≈ 12 / 180.
- Named moves: **camera-type-flythrough** (start inside one word at 6–10×, pan along the line, land at 1× — max one
  per scene), **card-extrude** (card grows out of its parent's edge + connector line), **wire-constellation** (icons
  cascade, bezier wires draw to a product card, data pulses along wires, no glow), **camera-crane-up/down**
  (synchronous vertical crane + shadow bloom on arrival), **kinetic-word-swap** (act change = background inversion
  synced with the word swap), **typewriter-pill** (URL/command typed in a pill, ~2 f/char).
- Progressive disclosure everywhere: typing, count-ups, cards filling line by line, then check marks. The cursor is
  an actor (bezier path, click, THEN the action starts).

## 2. Measured text-motion rules (motion-quality skill) — apply in every HTML render
- Scaling text: **pivot the scale on the baseline** (judder 0.284 px → 0.014 px) and set
  **`text-rendering: geometricPrecision`** (hinting "boil" 3.41 % → 0.22 %). Never animate font-size.
- `will-change: transform` only for live preview, never in the render (stale rasters shimmer on holds).
  translateZ(0)/backface-visibility tricks are cargo cult.
- **Expo/quint-out freeze on a frame clock** (5 of 14 frames moved < 0.5 px). Prefer a moderate decelerate
  `cubic-bezier(0.2, 0.6, 0.35, 1)`; check no animating frame moves < 0.5 px.
- Measure, don't eyeball: still frames byte-identical, monotone centroid under scale, no frozen frames. When the
  user says "not smooth", find the metric that reproduces what they see.
- Filling the frame from a logo: flood a hard-edged SHAPE from inside the mark, never an opacity ramp; gate the
  flood when the mark is taller than the frame, not past the diagonal (else it's a 1-frame cut).
- Images you size yourself: `max-width: none` (preflight collapses them to 0 px).

## 3. Quality bar (anatomy.md / anti-patterns.md)
- Product demo beats: **Hook → Positioning → Product reveal → Features (2–4 concrete moments) → Proof → CTA**,
  beats overlapping at the edges, ~18–45 s. One-line test: "X has problem Y; here's the product solving it, here's
  proof, here's how to get it" — never "here are my features".
- **One accent colour** (emphasised word, active number, CTA only). Sentence case. **No ALL-CAPS blocks, no
  decorative letter-spacing, no gradient text, no glow / big blur shadows, no full-frame saturated gradient wash,
  no radial halo behind headings.**
- Show the product BIG and legible; no browser/OS chrome (crop it; push a camera onto the focal point instead).
- **Never crossfade scene to scene** — both scenes stay legible through the overlap; move them apart (slide/crane,
  spring damping 200 so it doesn't overshoot).
- Stagger sibling entrances; budget each component its natural length; deterministic randomness only.

## 4. Component ideas worth rebuilding in HyperFrames
text-rewrite (the correction IS the beat), type-morph, text-swap, punch-lines (hard-cut manifesto cards),
count-grid (cards multiply + counter), **roster-grant** (cursor clicks CTA → team avatars switch on — fits team /
workspace stories), channel-thread (Slack-style chat filling in), cursor-track, screen-recording (crop + keyframed
camera push on a real capture), phone/laptop frames with zoom-to-screen, logo-assemble / wordmark-cut end cards,
answer-stream / agent-steps for AI features (e.g. linkutm MCP).

## 5. Self-check against our own work
The approved linkutm expiry reel (v2) still had two snapcn "slop" tells: ALL-CAPS tracked labels ("TIME LEFT ON THE
40% OFF LINK", "FLASH SALE · TONIGHT ONLY") and opacity fades between some scenes. Next time: sentence-case labels,
crane/slide scene changes on one camera curve, motion blur on fast moves, baseline-pivot + geometricPrecision on
scaled type.

## 6. HyperFrames recipes proven on the branded-domain reel (2026-10-27)
- **Directional motion blur in HTML:** inline `<svg><filter id="mby"><feGaussianBlur id="mbys" stdDeviation="0 0"/></filter></svg>`;
  during a move `tl.set(world,{filter:"url(#mby)"})`, tween `#mbys` `attr:{stdDeviation:"0 14"}` up and back to 0,
  then `filter:"none"` so holds stay pixel-sharp. Use "x 0" for horizontal pans.
- **Crane:** outgoing group `y:-2800` and incoming `fromTo y:1500→0` on the SAME `power3.inOut` + vertical blur.
  Move outgoing groups far enough (−1500 left tall cards peeking in at the top edge).
- **Text-rewrite:** create BOTH old and new letter spans up front (absolute, xPercent −50 on one anchor) — GSAP
  resolves selectors when the tween is created, so spans injected later by `tl.set(innerHTML)` never animate
  (shipped as an empty pill until the stills caught it). Old letters exit right→left, new type in at ~1 f/char.
- **Act change on the drop:** a cold grey backdrop layer under a warm brand layer whose opacity goes 0→1 in 0.45 s
  exactly when the hero morphs — the change of world IS the payoff.
- **Peak-aligned SFX:** place each file so its measured |max| sample (not its start) lands on the event
  (`sfx/build_sfx.py` pattern); feed the SFX bus to mix.py as a second `--voice` so the music ducks under it.
- **Per-segment caption mapping:** when TTS spelling differs from on-screen words ("C-NAME" vs "CNAME",
  "U-T-M source equals" vs `utm_source=`), pair (tts, caption) per phrase and spread caption words only inside
  that phrase's span — no drift across the line.
- Layout that depends on text width (camera pans along a URL): build those tweens inside
  `document.fonts.ready.then(...)` and register `window.__timelines` only after.
