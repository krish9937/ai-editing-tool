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

## Variant: "framed narrated product promo" (IG DeHOxk6Omwi, 2026 — spec D:\codes\video-ideas\ig6\VISUAL-SPEC.md)
- 16:9 motion piece inside a 9:16 black frame, static top "formula" header (tool icons + = 🔥) and a static
  comment-keyword line under the panel. The panel is the only moving thing.
- Narrated story arc: relatable pain (someone else won) → why you missed it → "so we fixed it" → product name reveal →
  3–4 features each with ONE visual → proof numbers (rolling-digit counter on a line map, geo zoom) → reassurance line
  → CTA pill (waitlist / link in bio).
- Technique names: word-by-word kinetic type + blur-in (focus pull), zoom-through type, accent-word colour,
  underline draw-on, social-post / document UI cards, curved text on a planet-horizon arc, timeline-rail carousel,
  filter-state dimming, 3D card tilt, odometer/rolling digits, line-art map + geo zoom, gradient flood wipe, glowing CTA pill.
- For this user: frame-0 must already show a big hook word (the reference opens on a tiny "Someone" — weak); keep it
  bright; 16:9-in-9:16 wastes ~2/3 of the screen — prefer full 9:16 unless the "made with AI" framing is the point.
- BUILT 2026-10-06: `promo-video-studio/src/LinkutmPromoRadar.tsx` (linkutm promo in this style, full 9:16, 42 s, Emma VO).
  Reusable pieces: `Say` (word-synced blur-in kinetic line from TTS alignment), zoom-through + 3-strip word split,
  person cards that MATCH-CUT into report rows, built drop + orange circle-flood logo reveal, rule toggles,
  rail carousel + cursor pick + filter-dimming, long→short URL collapse with domain box, 3D-tilted printed QR +
  destination slot-swap, line-art world map (d3-geo → `world-map-data.ts`) + count-up + geo zoom + 3 stat cards,
  rows-merge payoff with the arithmetic shown, glowing shimmer CTA pill.
- TTS timing: ElevenLabs `/v1/text-to-speech/{id}/with-timestamps` gives character alignment → merge spelled
  tokens ("G A 4"→GA4, "link U T M"→linkutm) → word list drives every animation. No whisper needed.
- Music: generate, measure drop/bar grid, offset so the drop = product reveal word, duplicate a bar so the
  breakdown lands on the reassurance line, re-enter the groove on the final brand word (built drop: lowpass bar +
  0.2 s gap). Mix VO + SFX + music outside Remotion (sidechain), master −14 LUFS.
- Remotion on this machine sometimes fails with "spawn UNKNOWN" at the stitch step / ffprobe crash on audio:
  render `--sequence --image-format=jpeg` and encode with D:\codes\work\bin\ffmpeg; keep Audio out of the comp.
  Fix single moments by re-rendering `--frames=a-b` into the same sequence folder.
- Odometer digit columns with background-clip:text glitch in Chrome → plain tabular number with blurred low digits.

## Second reference (2026-10-09): Bauhaus-primary 3D showreel ("Motion Designing is cooked", 15 s, 16:9, 60 fps, 120 BPM)
Full notes: `D:\codes\work\ref-reels\DeF8z3XoLdh\VISUAL-NOTES.md`. Same genre, different grammar — new moves to add:
- **Numbered-chapter HUD** over a 15 s reel: `00 INTRO … 05 CHOREOGRAPHY` bottom-left, running timecode top-right,
  project label top-left, progress scrubber bottom-right; HUD colour flips per background, hidden on the final logo.
- **One background colour per section** from a 4-colour primary palette (red / electric blue / warm off-white / near-black
  + yellow accent); the other colours appear only as objects. Light grain + vignette on flat colour.
- **Travelling motif:** a red dot is the O in the title, the tunnel centre, the jelly blob, the swarm's hero sphere and the
  logo's full stop — one object carries continuity across every scene.
- **Shape match-cuts:** dolly INTO a shape (the O, a white disc) until its colour becomes the next background; hard section
  changes use 2-bar solid colour wipes (6–8 frames).
- **"Word does what it says"** at one word per beat: STRETCH (h-blur stretch), SPIN (rotational blur in drawn circles),
  BOUNCE (staggered drop + ghost trails onto a line), SNAP (snap-in + underline wipe), each with its own background.
- **Toy-like 3D**: ring tunnel fly-through, isometric cube grid growing in concentric height waves, glossy displaced-sphere
  jelly blob with orbiting beads, InstancedMesh primitive swarm (burst → ring → helix) around a hero sphere; DOF + motion blur.
- **Type wall:** rows of huge words scrolling in opposite directions, back rows tone-on-tone (same hue, darker).
- **Impact frame → logo:** radial speed lines + single dot, logo mask-rises, typewriter subline with underscore cursor.
- Edit grid: section = 1 bar (2 s); accelerate to 1 idea/beat in the climax, then a 3 s "breath" before the outro.
