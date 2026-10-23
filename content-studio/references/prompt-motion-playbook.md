# Prompt Motion playbook — distilled from all 229 prompts + 5 skills on prompt-motion.com (studied 2026-10-23)

Written in our own words. The prompts belong to their creators — open the linked originals for exact wording.
Companion file: `prompt-motion-lessons.md` (ban list + blog findings).

## 0. What the gallery actually contains
- ~115 of 229 entries are the same 26-word "make a 15-second showreel… go all out" prompt (or a light variant). Short prompts
  ⇒ Claude invents everything ⇒ generic, inconsistent results. Not a model to copy.
- ~20 long, production-grade prompts (400–2,100 words) are the gold. They all share ONE skeleton (§1).
- Strong short prompts work only when they hand over a STRUCTURE: a process start→finish (cocktail recipe, empty glass →
  full), a self-referential device (recursion explained in a different style per level), or a story arc.

## 1. The brief skeleton (use for EVERY video we make; fill it in the plan the user approves)
1. **INPUTS** — list exactly what to collect from the user, each with a sensible DEFAULT if they skip it:
   product name + one-line promise · 3–5 real UI moments in order · logo/mark · ONE accent colour (hex) · fonts ·
   real photos/footage they own · music with a clear drop (licence OK) + its BPM/drop time · closing line/URL.
2. **DIRECTION** — the look in one paragraph: canvas colour, ink colour, one accent, one UI font (+ one display font max),
   light/dark, the reference feeling ("Apple keynote", "Dribbble UI motion", "editorial", "Stripe-restraint").
   One line on camera language. One line on the hero element that recurs.
   **Banned:** 5–9 items, each paired with what to do instead, ending with "anything that looks like a template".
3. **STRUCTURE** — on the music grid: BPM, number of bars/beats, and per-beat (or per-bar) what happens.
   "Something happens on every beat." Scenes listed in order with timings; the drop lands on the key moment.
   For voice films: scenes timed to the VO lines; music drop on the strongest line.
4. **SCRIPT / VOICE** (if VO) — line template adapted to the product; emotion tags sparingly; generate several takes,
   splice the best line; shorten long pauses; level phrases; word timings from Whisper per segment.
5. **SOUND** — one real SFX per on-screen event, placed by its measured PEAK (not file start); quiet under music;
   music ducked under voice; master −14 LUFS (music-only promos louder per our own rule), TP −1.
6. **BUILD** — renderer + method stated up front; every frame a pure function of time; deterministic (no random,
   no timers, no CSS transitions); springs as closed-form step responses (a value with several targets = sum of one
   spring per change); one camera transform over one world, zoom interpolated in log space; motion blur from
   sub-frames.
7. **GOTCHAS** — known traps for that build (see §5).
8. **START / GATES** — ask for inputs → show the beat map / storyboard → show 4–8 key stills → only then full render →
   contact sheet + frame-pop scan before delivery.

## 2. Recipes by video type (pattern summaries + where to look)

### A. Product launch film (10–23 s, music-led)
- One continuous take: every scene is BUILT FROM the previous one (button grows into page, colour floods from an object
  then contracts into the next, text rises from a mask line, a pill becomes the next UI). No fades/blur-ins/hard cuts
  except deliberate ones on the drop.
- A real cursor drives every change (clicks, drags, long-press); Screen-Studio zooms so each moment fills the frame;
  the cursor scales with the camera.
- Floods must overscale past the farthest corner and take ~0.3–0.35 s, or they read as a flash.
- Shared-element handoffs: the flood carries a copy of the words; the button carries its label into the page.
- Ending: the hero element returns → wordmark; last frame = first frame when it should loop.
- Look at: Photo print app film (twoclipping-221cab), Food craving launch film (ultimaxbt-2ddf1e),
  UGC ad generator promo (twoclipping-6dd14e), Frame by Frame launch (notdwd-7de38a / notdwd-c2037d),
  Ora 2 launch film (rossaxbt-3085b7, voice-led), Spotify product film (brainextends-e19ac3, timeline-style brief).

### B. UI morph loop (8–15 s, social/Dribbble)
- ONE shape never cuts: button → loader → check → island → player → slider → toggle → tabs → chart → ⌘K → toast → button.
  Size, radius, colour morph; content swaps with a short blur; leading/trailing edges on different springs so they stretch.
- Direct manipulation: while dragged, the value follows the cursor; on release it springs back from where it was.
- Look at: Shape morphing through UI states (twoclipping-5cba86), White ball UI loop (rossaxbt-94583b),
  Orange dot motion system (ultimaxbt-bbebf5).

### C. Premium brand/product showreel for a real app (15 s, restraint)
- Inspect the real product/design tokens FIRST; never invent screens, features or metrics; synthetic demo values only.
- One shot = one idea; ~4 visual ideas total; product UI is the hero; tiny copy (≤ 4 words per line).
- Emotional arc instead of a feature list (e.g. CHAOS → CONTROL → CLARITY → BRAND); first 1.5 s already premium;
  first product moment by ~2 s; no slow logo intro.
- Object-driven transitions ("of course the next scene came from that"): chart line → document edge, number → invoice
  amount, card edge → next surface. Bad: crossfade, random wipe, spin, glitch, whip every 2 s, generic slide-left.
- Motion with weight: cubic-bezier(0.16,1,0.3,1)-class curves, overshoot < 2 %, staggered arrivals, shared velocity
  between scenes; camera like a macro product shoot.
- Self-review gate: render ~10 stills at fixed timestamps, ask "template? too much? legible? connected? premium?",
  fix, then inspect decoded frames from the final MP4. "3 extraordinary moments > 10 mediocre ones."
- Look at: Taxtello bookkeeping film (daniel-haida-8691d4) — the best written creative brief in the gallery.

### D. Landing-page / website fly-over (14–15 s)
- Capture the real page (headless browser, full height, lazy content loaded), cut liftable pieces (cards, phone,
  chips, testimonial) as transparent layers with saved positions; page as a textured plane on a bright studio floor.
- One camera driven by ONE SPEED CURVE (never position keys every half second): ease in → cruise → ease out → rise
  overhead → dive into the hero → title card. Per-pixel depth of field; lifted pieces stand up toward the lens and cast
  soft shadows.
- Look at: Landing page 3D scroll (twoclipping-d89be5); Prompt Motion site promo (antonio-kodheli-490109) for a
  gallery/world-camera variant.

### E. Explainer (30–60 s)
- Show a PROCESS start → finish (recipe, pipeline, "how it works in 3 steps"), not a topic.
- 5-scene business explainer pattern: problem → what we do → how it works in 3 steps → one proof point → name.
- Name the audience ("someone with zero background"); research first, never invent numbers.
- Narrated variants used TTS; whiteboard / hand-drawn / Manim styles for technical or maths topics.
- Look at: Negroni (ror-fly-9950f1), Business explainer (alex-prompter-1ea044), Recursion in genres (emollick-8661a8),
  Paper-style product explainer (ik-builds-b8bdcf: no invented %, no animator jargon on screen, a new idea every 1.5–2 s).

### F. Kinetic type / spoken word (15–20 s)
- Words get ROLES built from the actual letterforms (a word becomes a beam, a support, an opening); the last line stands
  on what earlier words built. Cue sheet follows phrasing, not a dance beat; allow ≥ 400 ms of true stillness once.
- Glyph paths for structural words; keep the spoken phrase readable before it becomes architecture; transitions between
  unrelated words by occlusion or matched edges, never arbitrary path interpolation.
- Look at: Speech built as architecture (gdgtify-287ddf). Orange-dot film for letter-level "Reduce Motion → Motion".

### G. Real-product showreel from a codebase/portfolio (Remotion)
- Read landing page + codebase for the real story, copy, colours, fonts, logo (trace to SVG); 4–5 scenes, one short title
  each; one soft SFX per element that appears and silence otherwise; check frames and fix overlaps before showing.
- Look at: SaaS launch video (aschapmann-131210), Developer portfolio showreel (wani-shola-16ca7a),
  Sahi trading terminal (dale-vaz-cc612a: dot → windows → zoom out to a point in space → zoom into mobile).

## 3. Motion & craft rules that recur across the best prompts
- Hero element that recurs and morphs (dot, ball, pill, shape) — connects every scene.
- Motion always attached to something on screen; never teleport (show the path of every handoff).
- Springs: tiny overshoot max; overshoot only on things that LAND; no bouncy/elastic UI.
- Outgoing and incoming text on separate timings (no overlapping letters); text in a morphing container gets its own mask.
- Velocity-matched cuts (cinetic): accelerate out, cut on the fastest frame, next shot enters moving the same way;
  text must be slow enough to read when it needs reading.
- Camera: one move per scene, never zoom in-then-out back to back, never reverse direction mid-move; if the next scene
  starts, start from the zoom where the last one ended (no snap back to 1.0).
- Nothing pops in instantly (a 0.05 s fade reads as a pop; ≥ 0.3 s eased); no holds > 1 s unless deliberate.
- One accent colour used consistently; warm off-white or near-black canvas; one UI font (Geist/Inter) + one display font.
- No full stops in on-screen copy (optional style rule used by several); no corner frame/label clutter.
- Liquid glass done properly = a blurred clone of what's behind + edge refraction band + rim + sheen + lift shadow
  (backdrop-filter shortcuts misbehave); glass vanishes on pure white → add a soft aura/wash behind it.

## 4. Sound & music recipe
- Analyse the song (beat grid, energy per bar, the drop) and calibrate to real kick hits; start on a downbeat; every cut on
  a downbeat, every UI hit on a beat; the drop lands on the reveal/zoom.
- SFX: real downloaded files (Mixkit etc.), one per event, aligned by measured peak, trimmed around the peak, kept under
  the music. Fill breaks with reversed whooshes into hits.
- Voice: 3-band sidechain ducking (lows most, mids least); keep the voice ~9 dB over music in 300 Hz–4 kHz.
- Licences: only music/SFX cleared for commercial use; never pull copyrighted tracks.

## 5. Build & QA gotchas worth remembering
- Never `will-change` on anything the camera scales (blurry text); never opacity/filter on a preserve-3d element (fade a
  wrapper instead); set z-index on every layer under a flood.
- Footage in browser renders: re-encode all-intra and await 'seeked' per frame (or JPEG sequences).
- Measure text after fonts load; long names must re-fit the lockup.
- Loops: first frame === last frame incl. cursor position/velocity.
- QA: one still per beat before the full render → contact sheet → scan frame-differences for single-frame pops (3× the
  neighbours) → check fast moves frame by frame → a fresh "critic" pass on the render → verify decoded MP4 frames,
  duration, frame spacing. 4 motion-blur sub-frames ghost on fast moves → use 8 or slow the move.

## 6. The 5 skills (all MIT; Remotion itself needs a company licence above small-team size)
- **product-film** (github.com/Rieranthony/product-film-skill): discovery of design tokens → interview → BRAND.md + beat
  sheet → 3 style frames → beat-cut music → Remotion build → stills/contact sheet/draft → 240 fps blurred master + loops.
- **cinetic** (github.com/Leonxlnx/cinetic): agent "directs" a short film in gated steps (idea → brand → timeline → build →
  sound → render → review → deliver), beat grid in timeline.ts, velocity-matched cuts, lint for banned styles,
  pixel forensics + audio-sync audit. Remotion or HyperFrames.
- **taste-skill** (github.com/Leonxlnx/taste-skill): web/app design taste — picks 1 of 20 art directions, real CC imagery,
  browser checks at 3 widths, self-review rounds. Useful for UI we rebuild inside videos.
- **session-story** (HyperFrames community skills) and **generative-film-skill** (buildfast-skills): narrative/AI-session
  story films.
- Install only with the user's OK (downloads code): `npx skills add Leonxlnx/cinetic`, etc.

## 7. How we apply this (default workflow from now on)
Every video plan shown to the user includes: inputs (with defaults) · direction + ban list · beat/scene structure ·
sound plan · build method · QA gates (beat map → key stills → render → contact sheet). Keep our existing rules on top
(orientation + subtitle style question, value-first script, real product only, linkutm = clicks not sales, etc.).
