# Style: "Depth sandwich" — graphics BEHIND the speaker (learned 2026-10-08 from a reference reel the user sent)
Reference: IG reel DeAH3yjJN25 (a HyperFrames demo: stop-motion, carousel and finger-trace effects; text behind the head; UI behind the shoulders; "Comment X" CTA behind the head).

## The technique
Layers, bottom to top: **original footage (real room stays)** → **graphics** → **speaker cut-out (matte)** → captions.
Because the real footage stays underneath, matte errors are invisible except where a graphic is behind them, so put
graphics around the head and shoulders, where the matte is cleanest. No outline is needed: occlusion IS the effect.
## Moves to borrow
- Big bold text behind the head (hair/head occludes letters): the hook word, "Every single one", and the CTA "Comment X".
- 3D carousel of cards orbiting the body: back cards pass behind the speaker, front cards in front (split the carousel into
  two layers: z<0 under the cut-out, z>0 over it). Registry: carousel-circle/orbit/path/vision-*.
- Finger trace: a stack of icons follows a fingertip (track the fingertip with hand landmarks or hand-keyframe a path).
- Stop-motion: icons pop in steps at ~12 fps (choppy on purpose) around the speaker.
- App/UI windows rise behind the shoulders; a full-screen cutaway only for a big "volume" shot (e.g. a folder grid).
- Captions: ONE small word at a time, white, centre-chest (clean, modern).
- Single accent colour (purple in the reference). Modern registry blocks (code-snippet terminals, cosmic-orb, gallery-tunnel)
  instead of hand-drawn doodles; the user said the doodle look feels dated.
## Matting (fixes the seatbelt flicker)
Use Robust Video Matting (RVM, recurrent, temporally stable) via ONNX on the CPU: `D:/codes/work/_library/matting/rvm_matte.py`
(0.09 s/frame for the model; the outline and VP9 encode dominate, so make outlines optional/lighter). The old remove-background
is per-frame, flickers on thin objects (seatbelts), and is about 20× slower.
## Outline (if wanted)
Dilate the stable alpha 8–12 px, keep only the largest component, and fade the stroke out below the waist / near furniture.
Render a separate outline layer under the cut-out.
## Rule from the user
Always CHANGE the editing style between reels and fine-tune every render. Never reuse last reel's look by default.

## Second reference (YouTube GUUPEwH7XE8, Olufemii, "Text Behind Person"), studied 2026-10-08
- **Extended display text behind the head:** ultra-wide heavy caps ("FRAME BY FRAME", "WORKFLOW", "CONTENT"), white with a
  red offset/extrude shadow, flicker-on or slam; the head/mic occlude the middle letters. One word per beat, centred on the head.
- **Laser beams behind the subject:** red lines crossing behind the head on emphasis words (cheap, very punchy).
- **Line-art behind the subject:** white wings and a halo (or any icon) appear behind the speaker on a joke, with a white-flash world swap.
- **Silhouette wipe:** the speaker turns into a flat solid-colour silhouette (from the matte) as a transition into the next beat.
- **Printed-photo stop-motion:** the frame looks printed on paper and is moved by hands (tactile break; fake it with a paper
  texture + a stop-motion jitter on a still of the speaker).
- Captions: tiny all-caps at the bottom, one keyword coloured (green/yellow); warm grade + vignette; comparison cards (#1 #2 #3 with a blurred ???).
- Sandwich order: footage → text/graphic → matte copy of the speaker. Matte sources: rough mask, rotoscope, AI removal (use RVM).

## Matting performance (learned 2026-10-08, reel-03)
- RVM ONNX: leave onnxruntime threads at the DEFAULT (forcing intra_op threads to 20 was 14× slower on this laptop).
- The full-res refiner is the cost: run RVM at 720x1280 (downsample 0.4) and upscale the alpha (`scripts/rvm_fast.py`), about 0.3 s/f.
- Run ONE process (each ORT session already uses all cores); 3 parallel processes oversubscribe and crawl.
- Don't run whisper at the same time as matting. Write the alpha as grey H.264, then alphamerge + VP9 in parallel chunks.

## Reel-03 build notes (2026-10-08): worlds + depth graphics, as it was built
- Photoreal plates: Figma `generate_image` (gpt-image-2.5) at 1152x2048 → 864x1536 output; soft upscale reads as natural depth of field
  behind the speaker. Props (e.g. a rocket) on a chroma-green background, keyed with alpha = 1 − (g − max(r,b)) and despill g ≤ max(r,b).
- When the speaker sits on furniture the matte can't separate (beanbag), use a bust framing in the replaced worlds: CSS mask
  `linear-gradient(#000 61%, transparent 71%)` on the speaker plus a world-coloured fog at the bottom (a prop like the rocket can cover the fade line).
- Big behind-the-head words: auto-fit to 1010 px width; centre them ~40 px above the head centre so the head occludes them.
- RENDER SPEED: every <video> is frame-extracted for its whole data-duration. Trim short-use clips with data-start/data-duration/
  data-media-start (room plate, silhouette copy) → the 4K render went from 0.25 to 1.6 fps.

## Reel-03 v2 (2026-10-08): what fixed "the visuals look like stickers"
- Static AI plates + slow zoom read as cheap stickers. Use MOVING backgrounds: real public-domain footage (NASA images-api:
  launch slow-mo sped up, Orion animation, ISS Earth) cropped to 9:16 and/or own renders (Three.js 3D props with PBR + RoomEnvironment,
  procedural layered vector worlds with parallax, designed UI panels) — never a flat still.
- Own 3D prop the speaker sits on (Three.js rocket): ACES tone mapping + exposure ~1.5, white clearcoat body, brand stripe, additive
  shader flame + glow sprite, deterministic smoke; render from `hf-seek` time; put the canvas ABOVE any bottom fog.
- Head-anchored character (mascot sits on the head): track head-top per frame from the alpha matte (narrow column over the torso
  centre, ignore hands), smooth 9 frames, put the element INSIDE the speaker container so scale/shake follow.
- Animated stickers: Noto Animated Emoji Lottie (CC BY 4.0, fonts.gstatic.com/s/e/notoemoji/latest/<cp>/lottie.json) + die-cut white
  keyline (4 stacked drop-shadows) + two-layer shadow; pop 0→1.18→0.94→1 (.12/.10/.12s), 12 fps "boil" jitter while idle.
- Music: Mixkit (free licence) — pick by measured sub-bass energy (lowpass 90 Hz volumedetect); add own 808s (tanh sine glide) on
  every scene change; sidechain-duck under the voice. Voice: arnndn (sh.rnnn) + EQ/de-ess/comp chain when DeepFilterNet/ElevenLabs unavailable.
- User rules: start the reel the way it was recorded unless told otherwise; combine ALL skills; ask before switching asset strategy.
