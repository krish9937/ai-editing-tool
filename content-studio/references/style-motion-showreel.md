# Style: "Motion showreel / capability hype" (music-only, beat-cut kinetic montage)

Studied 2026 from a viral reel (@grafigator, ~8.5k likes, caption "Claude Opus 5.5 just cooked motion
designers"): a 15 s, 16:9, 60 fps showreel built entirely in code, no voice, every cut on the music.
Same trend as the "Claude Cooked" promo (see `style-filmed-screen-promo.md`): **"AI made this"
meta-content earns reach + comments**. Learn the grammar; never rebuild the reference's look 1:1.

## 1. Structure (15 s, ~25 cuts)
| Time | Act | What happens |
|---|---|---|
| 0–2.0 | **Boot / system intro** | Dot in a thin circle pulses → **text decode/scramble** ("CLA1SZ" → "CLAUDE") over a ruler/tick bar that fills into a solid orange **progress bar** |
| 2.0–3.0 | **Countdown + word-per-beat** | Full-bleed colour flash with a serif "2", then ONE WORD PER BEAT: "I / MAKE / THINGS / MOVE." — background colour flips every word (black → cream → lime → orange) |
| 3–5.3 | **Kinetic letters** | "MOVE." letters bounce/rotate in individually, settle; serif-italic sub-line "with intent." |
| 5.3–8 | **Pattern system** | A **halftone dot grid** masked to a circle expands to full-frame, then morphs shape every beat (circles → squares → diamonds → rotated pills → wave), colours from the 4-colour palette; serif "Form." dropped on top |
| 8–9.8 | **Particles** | Point-cloud sphere (purple glow) breathes, scatters, swirls into a ribbon, then **re-forms as the word "CLAUDE"** (particle text) |
| 9.8–10.8 | **3D / depth** | Glossy iridescent **metaballs** (spheres that merge into blobs) orbit IN FRONT of huge "DEPTH" text, motion-blurred whip exit |
| 10.8–12 | **UI system** | Cream canvas; cards assemble: a "+0% → +248%" count-up with a line chart, an orange "Motion system" card with a **toggle that flips**, a ring gauge 6% → 99%, a bar chart, a violet "Keyframes are a language." card with a **keyframe timeline** of diamonds; a cursor clicks through |
| 12–13 | **Rapid fire** (cuts every ~0.13 s) | "RHYTHM" on rotating stripes, concentric lime rings, "ALIVE" with an underline, letters of "CLAUDE" **falling with physics** |
| 13–15 | **End title** | "CLAUDE" letters drop/tilt into place on black with light-streak sweeps; mono "MOTION DESIGNER", serif "Showreel 2026"; collapse to a single line → out |

Persistent **HUD / viewfinder overlay** the whole time: corner brackets, top-left "CLAUDE / MOTION REEL
2026", top-right running **timecode** (TC 00:00:07:12), bottom section label ("02 / KINETIC TYPE"),
bottom-right "1920 × 1080 | 60 FPS". It makes the montage feel like a real studio reel and ties wildly
different scenes together.

## 2. Names of the techniques
| Name | Build (Remotion / HyperFrames) |
|---|---|
| **Text scramble / decode effect** | Each char cycles random glyphs until its lock time; mono font |
| **Loader / progress-bar intro** (boot sequence) | Tick ruler (SVG lines) → fill bar with ease-out |
| **Word-per-beat / one-word cuts** (aka "kinetic type supercut") | Cut list from beat times; each word full-frame, bg colour flips |
| **Colour-flip cuts / flash frames** | 1–3 frame full-colour frames between scenes |
| **Per-letter kinetic type** (stagger, overshoot, rotation) | Split letters, spring per letter with stagger 2–3 frames |
| **Halftone / dot-grid pattern morph** | Grid of SVG/canvas shapes; per-cell shape/rotation/scale driven by t + distance from centre (wave) |
| **Mask reveal** (circle iris) | `clip-path: circle(r)` animated |
| **Particle system → particle text** | Canvas/WebGL points; target positions sampled from text rendered to an offscreen canvas; lerp from sphere → noise → text |
| **Metaballs / liquid chrome blobs** | WebGL (@remotion/three or a HyperFrames shader): SDF smooth-union spheres + iridescent fresnel material |
| **Whip pan / motion-blur transition** | Fast translateX + directional blur (sub-frame samples) |
| **UI dashboard assembly** (data-viz motion) | Cards spring in, count-ups, ring gauge (stroke-dashoffset), toggle, bar chart, cursor clicks |
| **Keyframe-timeline graphic** | Diamonds on lanes + moving playhead (meta: "keyframes are a language") |
| **Op-art stripes / concentric rings** | Repeating-linear/radial gradients rotated/scaled each frame |
| **Physics letter drop** | Per-letter gravity + bounce + rotation (simple integrator or spring) |
| **Light streaks / lens sweeps** | Thin blurred gradient lines crossing the title, additive blend |
| **HUD / viewfinder overlay** (timecode, corner brackets, section labels) | Static SVG frame + live timecode from the frame number |

## 3. Rules for this style
1. **Music first, cut list from the beat grid.** Detect beats (or generate music with a known BPM) and
   put every cut, flip and letter landing on a beat/sub-beat. Pace accelerates toward the end
   (0.5 s → 0.13 s cuts) then releases on the end title.
2. **Strict palette of 4 + neutrals** (here: black, cream, orange-red, lime, violet). Every scene reuses
   it — that is what makes 10 different techniques read as ONE reel.
3. **Type system of 3:** ultra-heavy grotesk for slam words, italic serif for one soft word per act
   ("with intent.", "Form."), mono for HUD/labels. Nothing else.
4. **One idea per act, one word per act** (MOVE / Form / CLAUDE / DEPTH / RHYTHM / ALIVE). Words name
   the technique being shown — the reel is self-describing.
5. **HUD overlay = continuity glue** (timecode, section number, resolution). Keep it tiny, ≤ 30 % opacity.
6. **Show range:** 2D type → pattern → particles → 3D → UI → physics. Each act ≤ 2.5 s.
7. **End on the name**, not a CTA card; collapse to a line / black for a loop-able ending.
8. **Brand caution:** this is the bold-kinetic look the user has called AI-ish for *founder/value* reels.
   Use it for **launch hype, capability showcases, brand sizzle, "AI made this" meta posts** — and ask
   (theme gate) before using it elsewhere. 9:16 version: stack HUD top/bottom inside the safe box,
   type ≤ 80 % width.

## 4. Feasibility with our stack
All 2D acts (decode, word cuts, letters, dot grids, rings, UI cards, physics drop, HUD, streaks):
Remotion/HyperFrames + CSS/SVG/canvas — straightforward. Particles → text: canvas 2D is enough
(2–5k points). Metaballs/chrome: needs WebGL (`@remotion/three` + a shader material, or a HyperFrames
GLSL shader) — the one heavier piece; a 2D fallback is SVG goo-filter blobs with gradient fills.
Render at 60 fps only if the platform keeps it (IG/YT do); otherwise 30.
