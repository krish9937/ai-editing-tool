
# Production lessons (consolidated, current rules)

Distilled from ~13 rounds of real client feedback on founder reels/webinar clips. These are the
CURRENT rules; where earlier rounds disagreed, the later decision wins. Read before any build.

## What makes it feel "AI-ish" (avoid by default)
- Slogan headlines written by the model ("Which link actually worked?", "No need to open GA4.").
  → On-screen words = the speaker's own words + real UI labels. Nothing else unless asked.
- The "clean sans + one orange italic-serif accent word" type combo; per-character rolls;
  selection-highlight sweeps; karaoke pills; bouncy pops; particle/shockwave payoffs; dot-grid or
  blob backgrounds; logo stings with music only.
- Small floating cards on an empty stage. Generic illustrated worlds.
- Literal copies of a reference reel's elements (mascots, UI, caption placement).

## What reads as crafted / human
- Real people on screen (the speaker's actual face, lip-synced), real moments, real voice.
- Product screens FULL-SCREEN and legible on a phone (the frame *is* the app), navigating like a
  real user: tab switch → click → date picker → load → scroll. Cursor clicks land on spoken words.
- A light "filmed" layer: slow camera push/drift, warm tint, fine grain, soft vignette.
- Captions as a **typewriter in a dark monospace strip**, typed as words are spoken, no accents.
- No dead space in 9:16: fill the bottom with the founder (big lip-synced face ~40% width +
  captions beside it), product above. Re-confirmed 2026 (glossary reel): even when the brief says "face only
  in the hook", an empty bottom third gets called out. Fill it with BIGGER visuals + lower captions, NOT a face card (user rejected the face after the hook).
- Cut-out hooks keep the speaker's REAL background; animations go between the footage and the matted speaker.

## Hook (first 1–3 s)
- Voice at frame 0 (≤0.1 s silence). Never a logo/music/text-only opening.
- Pattern-interrupt line that promises a payoff: "WAIT! Let me save thirty minutes of your day!"
  A screamed/high "WAIT!" was explicitly requested (ElevenLabs v3 `[shouting] WAIT!!!`, +6–8 dB so
  it's the loudest moment), then the rest in a normal take.
- **Frame 0 is the feed preview/cover**: the hook TEXT must already be fully written on screen.
  Animate captions only after the hook.
- No recording of the speaker saying the hook? Use a real moment of them LISTENING (mouth closed)
  full-frame with the cloned-voice hook as voiceover — no lip-sync mismatch.

## Outro
- A proper CTA in the speaker's (cloned) voice on the brand page: logo draws in, the line typed as
  spoken ("Track every campaign link in one place. Try linkutm free, at linkutm.com."), URL + the
  site's real button label ("Start for free"). Short hold, music fades. (A host compliment as the
  outro was liked once, then replaced by the CTA.)

## Voice (ElevenLabs)
- Use the user's OWN clone by name ("Smit voice"), never a similarly-named clone; list voices via
  GET /v1/voices when unsure. Keys must start with `sk_` (key IDs are rejected).
- Spell acronyms/brands as letters in TTS text ("G A 4", "link U T M"). Use `speed` 1.05–1.2;
  low stability + high style = slow and drawn out. Trim leading silence. Offer 2–3 takes as
  previews that continue into the real footage so the user hears the blend.
- Blend a clone into webinar/phone audio: highpass 110, lowpass 8.5k, −2 dB @3 kHz, tiny room
  (aecho 18 ms 0.06), speechnorm, then match loudness (≈ the footage's −15 dB mean).

## Editing real recordings (webinars, podcasts, calls)
- Work from word timestamps. Build an EDIT LIST (keep segments + output positions). Cut voice,
  face track and screen track from the SAME list so lip-sync and clicks stay exact.
- Never clip the last word: whisper word ends run early — extend to the natural sentence end.
- A webinar cam bubble moves (screen share ↔ cams): crop zones per source time + freeze frames
  while it slides.
- Real 1080p screen shares are NOT readable in a vertical reel, even punched in → rebuild the UI
  full-screen (illustrative numbers only with explicit approval, labelled as examples).
- Read real numbers at the exact moment they're spoken (later frames may be another workspace).

## Music & mix
- Licensed/user-generated beds only. Bar-align cuts; land the drop on the visual payoff.
- Quiet bed (≈0.16 linear) + light sidechain under voice; fades at both ends.
- Every ffmpeg graph length-bounded (`-t`), `apad` branches bounded; `sidechaincompress` ends with
  its shortest input — pad the voice bus. Deliver at ≈ −14 LUFS, true peak ≤ −1 dBTP.

## Process that saves time
- Ask everything up front in ONE round (format, length, face, voice, captions, music, CTA, what not
  to do), then build. Show 5–8 stills before any full render. Re-render only what changed.
- Keep old versions; name outputs `-vN`. Verify decode frame count + loudness + safe zones on every
  delivery (scripts/qa.py).
- When feedback is vague ("not good"), ask WHAT is bad (opening / middle / text / audio) before
  rebuilding — one round of questions beats three wrong renders.

## Environment / pipeline gotchas (reel-01, 2026-10-05)
- iPhone HLG footage: clips cut from it KEEP the arib-std-b67/bt2020 tags even after a plain-scale "SDR" grade.
  HyperFrames then takes its HDR path (stalled at 1 frame in 15 min). Retag before compositing
  (`-c copy -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1`) and render with `--sdr`.
  A 59 s 1080×1920 render then takes ~4.5 min on the laptop.
- Hinglish speech: whisper `language="hi"` (small/medium) produces garbage; `language="en"` gives a usable near-verbatim
  transcript (Hindi lines come out translated). Take exact Hinglish caption wording from the user's own earlier captions when available.
- If Windows Application Control blocks PyAV, decode with ffmpeg to raw 16 kHz PCM and import faster-whisper with a stub `av` module.
- Can't hear the audio? Verify each cut end by transcribing just [end−2 s, end] and checking the last word.
- (reel-01 v1→v2 feedback) Founder wanted: **4K output** (render `--resolution=portrait-4k`, face track at native 2160 width),
  **real-world visuals researched on the web** (real F1 circuit geometry from bacinger/f1-circuits GeoJSON, CC-licensed
  Commons photos/satellite with credits), the **named thing shown when spoken** ("F1" slam on "in F1"), **face NOT over-cropped**
  (no punch-in on a split screen), and **continuous camera motion** — flat illustrated cards cut one after another read as "a slideshow".
  Research the real story first (here: McDonald's "The Golden Zone", TBWA Colombia, Interlagos 2026) before designing.

## Promo v1 → v2 (linkutm "Radar"-style promo, 2026-10-06)
- "Text too AI-ish" = model-written slogans as VO + big sentence headlines ("Your campaign worked.", "So we fixed it.",
  "Your data wasn't wrong…"). Fix that worked: a PLAIN-TALK script (how a marketer would explain it to a friend:
  "Okay, quick one. You run an ad on Facebook…"), and on screen ONLY the spoken words in the typewriter strip +
  real UI labels (field names, buttons, report titles, toasts). No invented captions like "1 campaign · 3 sources".
- "Lots of empty space below": every scene must fill y≈210–1360 with the caption strip directly under it
  (top ≈1390). Use stacked full-width cards, a second card below the hero (e.g. report + spreadsheet, QR + edit form,
  map + 3 stat cards, short link + share rows).
- "Expressions" = emotion in the VOICE (asked; user picked this over faces/emoji). ElevenLabs `eleven_v3` with audio
  tags ([casual], [amused], [laughs softly], [frustrated], [sighs], [warmly], [confident], [excited], [cheerful]),
  stability 0.5 (0.0 misread "built" as "build"). v3 with-timestamps alignment is loose (±0.5 s) → re-time words
  with faster-whisper by difflib-matching and verify on the RMS curve.

## Mixed-language footage (Hindi/English, 2026-10-06 Heinz reel)
- ALWAYS detect language before cutting: run multilingual faster-whisper (`medium`, language=None) — `medium.en`
  silently turns Hindi into fake English ("I don't know how to say that…") and I cut real words from the hook.
- User rule: lines spoken in Hindi get NO subtitles (here: the hook); subtitles start after it.
- Whiteboard/handwriting in the footage: "pop" it — clip a copy of the real footage around the writing, scale it
  up with a shadow as the words are spoken, and draw a marker ring around it (static camera → fixed regions).
- Tape/stamp effects: unroll (scaleX from one edge) instead of flying in from off-panel; avoid back-easing overshoot.
- Whiteboard: user prefers a simple highlighter sweep on the real handwriting, REMOVED when that point is done (not lifted/scaled copies or persistent rings). Bottle label: one word only, fully hidden by the tape.
- Expressive ElevenLabs voice (user: "Emma lacked expression — make it like Jessica"): eleven_v3, stability 0.0
  (Creative) + strong tags ([tired] [sighs] [exasperated] [worried] [frustrated] [annoyed] [warmly] [excited]
  [delighted] [proud]), CAPS for one stressed word, "..." for pauses. Creative mode mispronounces sometimes
  (e.g. "builds") → make 2–3 takes, verify with medium.en, splice the bad line from another take at a silence.
- Client brand promo (2026-10-06): pull the exact brand from the site (CSS hex counts, @font-face
  families, /logo.svg, og:image + product images) and rebuild their UI in their tokens; dark brand photo for the
  problem act → their light UI world after the drop.
- "Visuals very bad" on a flat-UI promo (client v1) → what fixed it: (1) understand the product first (read every
  product page; show its REAL features/labels/figures), (2) a real-time 3D hero object (three.js via @remotion/three:
  procedural ring + RoomEnvironment reflections, render with --gl=angle; one WebGL canvas at a time; dpr 1.5),
  (3) dark cinematic stage + glass panels in CSS 3D perspective with slow camera moves, (4) light sweeps, sparkles,
  gold dust, kinetic word hits on spoken numbers. Flat cards on a pastel background read as "bad".
- "No excitement" → eleven_v3 stability 0.0 with [excited]/[dramatic]/[thrilled] tags + exclamation marks + CAPS on
  the hit words; faster read (47.9 s vs 50.5 s).
- "Visuals bland → use fluid animations" (2026-10-06): one liquid thread that morphs between scenes
  beats separate card scenes. Recipe: SVG goo filter (feGaussianBlur σ16–28 + feColorMatrix alpha 34 −14) on circles
  with a gold radial gradient + drop-shadow glow; liquid flood = ring of growing metaballs (recede FULLY to r=0 or a
  leftover sphere sits behind the next scene); cards grow from a droplet (size/radius/position lerp, content fades in
  at k>0.55) and melt back; orbit droplets merge into a ring of beads → swap to the 3D ring. Living gradient bg (2–3
  slowly drifting radial gradients), vignette, grain; kinetic words land with scaleY 0.6→1 + blur.
  Don't leave tiny floating "thread" blobs on top of text — they read as random peanuts.
- Gemini TTS (user's Google AI Studio key; models gemini-3.8-flash-tts / 2.5-*-preview-tts via generativelanguage
  v1beta generateContent, responseModalities AUDIO, prebuiltVoiceConfig voiceName): sounds far less "AI" than the
  ElevenLabs ads voices for this user. Use the structured prompt — "# AUDIO PROFILE … ## THE SCENE … ### DIRECTOR'S
  NOTES (per-line emotions) … #### TRANSCRIPT" — only the transcript is spoken. Plain instructions or [bracket] cues in
  the text get READ ALOUD. Output = base64 PCM s16le 24 kHz mono. Female voices tried: Sulafat (warm), Despina (smooth),
  Kore (firm/confident, user's pick). Free tier rate-limits pro-tts (429).
- Anchor every animation to words by TEXT (find "website", "builder", "today"…) not by index, so swapping the VO
  (new voice / edited script) re-times the whole film automatically.

## 2026-10-07 — client gives website source
- **Client gives website source → use THEIR elements, not approximations.** Copy `public/` assets (logo svg, product renders,
  icon sets) into `public/<brand>/site/` and rebuild their UI components 1:1 in Remotion (same tokens, copy, formulas —
  e.g. their own pricing formula). Keep the rebuilt cards in one shared module per client (in the project, never in the skill). Brand accent = their headline trick
  (e.g. their serif-italic accent word) applied to kinetic subtitles.
- **Feature honesty:** check the site copy before naming a feature. if a feature is custom-scoped work, word it that way (e.g. "your billing counter, connected") and show the flow, not a product claim.
- **Show the real website:** `scripts/site_scroll_capture.mjs` (raw CDP, no puppeteer) scrolls the live site in 600px
  steps; stitch shot0 + rows 300–900 of each next shot into one long image → scroll it inside a browser frame at the CTA.
  Tall-window `--screenshot` does NOT work (scroll-reveal/sticky sections stay blank).
- **Windows App Control started blocking `remotion.exe` (compositor) → "spawn UNKNOWN".** Don't touch security settings;
  local patch in `node_modules/@remotion/renderer/dist/offthread-video-server.js` wraps startCompositor in try/catch with a
  stub (backup `.orig`). Works for comps without <OffthreadVideo>. Re-apply after `npm install`. Never run two renders at
  once (browser connect timeout).
- **Changing one line of an ElevenLabs take cheaply:** generate only the changed lines (v3), trim silence, loudnorm to
  the take, splice at word boundaries from the whisper words → re-transcribe → word file → comps re-time themselves.
- **Hinglish VO supplied by the user (Gemini):** whisper `--lang en` TRANSLATES Hinglish → use it only for sentence
  boundaries; place the approved Roman-Hinglish script words along voiced RMS time by syllable weight
  (`scripts/align_script_to_audio.py`). Re-pick anchors on unique words — "aur"/"ek"/"aaj" repeat
  (bug: `F("aur")` hit "store aur appointment" and skipped a whole scene). Print the anchor list and sanity-check it.
- **Client widget → video:** copy their real stylesheet (`:host`→`.vai-host`), render the same class markup with fake
  data, and pin CSS keyframes to the frame: `el.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=frame/fps*1000})`.
- **Device-frame outro (MacBook → iPhone → iPad → line-up):** `templates/Devices.tsx` (CSS space-grey frames +
  `Crop` helper that re-flows real crops of a desktop full-page capture into phone/tablet layouts) and
  a per-project showcase comp (spring "track" of [time, {x,y,scale,rotY}] states per device, VO-anchored).
  Full-page captures repeat fixed widgets (chat bubble) once per viewport — don't inpaint over content
  (smears); keep them or ask for a capture with the widget closed. Measure crops on a gridded copy and
  double-check the grid's y labels (I mis-read one section by 100 px).
- User asked about render time: offer a 0.5-scale preview first, and final encode with preset medium (not slow).
- **Arabic subtitles (RTL) over an English VO:** one Arabic line per spoken English sentence (`[firstWord, lastWord, text]`),
  revealed word-by-word across the sentence, `dir="rtl"`, Almarai 800 + Amiri gold for *accent* groups. Keep the
  conjunction و attached to its word (never "و *word*"), and glue punctuation tokens onto the previous word.
- **Gemini TTS:** never quote transcript phrases inside DIRECTOR'S NOTES — it reads them aloud. Describe style generally,
  then check every take with whisper for extra lines before using it.
- (reel-02) HyperFrames/GSAP gotchas: tweening x/y/rotation on an SVG <g> that has a `transform="translate()"` attribute
  REPLACES it — wrap: outer <g transform> + inner animated <g>. For procedural drawing (waves) redraw in the timeline's
  `onUpdate` (runs after all child tweens), not in a clock tween, or seeks render stale state.
  Word-pop captions: auto-fit font-size to the frame width after setting text.
  Never wait on "no chrome.exe" — the user's own browser keeps running; wait on the output file / the render log line instead.
- (reel-02 v3) User asked for: brand colours (Škoda emerald #0E3A2F + electric #78FAAE), REAL symbols (Fluent Emoji 3D, MIT, +
  real logos from Commons) not drawn figures, face NOT zoomed → cut the speaker out (`hyperframes remove-background`) and place
  them ~70% size, low, with visuals behind; "crazy" motion = shakes, punch-ins, shockwave rings, shatter, icon rain, confetti.
  Perf: remove-background uses ~6% CPU single process (~2 s/frame @1080p) → split into 5 chunks and run in parallel (~2× faster,
  watch RAM), concat VP9-alpha webms with `-c copy` (alpha survives). 4K render with a transparent webm hit Node heap OOM →
  `NODE_OPTIONS=--max-old-space-size=7168` + `--low-memory-mode --workers=3`.
- **Long-form tutorial (20+ chapters, ~25 min, 16:9):** one Remotion comp PER CHAPTER from a shared engine
  (`ChapterDef` = card → "Before you start" → body → recap that bridges to the next chapter; VO-word-anchored with
  `makeAt(W)(phrase, after)`), render + encode each chapter separately (cache the mp4s), concat with `-c copy`, then
  ONE continuous audio track (VO at chapter offsets, looped ducked music, sfx) → loudnorm. Chapter offsets must come
  from exact frame counts (decode `-f null` and read `frame=`); `time=` from a `-c copy` pass under-reports ~0.1 s/chapter.
  YouTube timestamps = cumulative offsets (first must be 0:00).
- **Anchor misses are silent** → make `makeAt` `console.warn("MISS " + phrase)` once, and render one still per comp
  with the Node API (`bundle` once, `renderStill` many, `onBrowserLog`) to list every miss. Whisper splits spoken
  domains/slugs ("bit .ly", "mix -up", "Q2ACME") — anchor on the first token and merge pairs in the caption builder.
  The same trick logs scene starts + cursor-click times per comp → place whoosh/click sfx automatically.
- **Before rendering long pieces, write chapters against ESTIMATED word timings** (syllable-based from the script)
  so layout can be checked with still contact sheets while the VO is still being generated.
- **Gemini TTS free tier = 10 requests/day per model** (429 `GenerateRequestsPerDayPerProjectPerModel-FreeTier`).
  For many chapters, send 2–3 chapters per request ("leave a two-second pause between chapters"), then split the
  batch at each chapter's first words from the whisper transcript. Ask the user: enable billing, wait for the reset,
  or switch model (a different model sounds different → re-record everything for consistency).
- Windows Chrome has no flag emoji (renders as letters "US") — use letter badges deliberately or SVG flags.
- (reel-04, user: "very bad", wants SHARPER) Never upscale the speaker: render at native source res (1440x2560 source → 1440x2560 out, not 4K)
  or ask for 4K capture. Matte at ≥1080p (RVM downsample 0.25 is fast enough single-process). Only use plates/backgrounds ≥ output res.
  Final: unsharp 5:5:0.6, crf ≤14. QA with 100% face/edge crops, not just contact sheets.
- (long-form tutorial, delivered) Batch-TTS splitting: scripts say "Chapter seven", whisper writes "Chapter 7" → map number
  words → digits before matching chapter starts (silent split failure otherwise; flush every print). Check each take for the
  BRAND NAME: count its occurrences in script vs transcript — Gemini once said "Linkoo" for "linkutm" (confirmed by a second
  model) → re-record that chapter alone. Anchor matching must be space-insensitive ("time zone"/"timezone",
  "geo targeting"/"geotargeting") and spelling-insensitive (organise/organize). Remotion names frames with as many digits as
  needed (a <1000-frame comp → element-000.jpeg) → detect the digit count before ffmpeg `%0Nd`.
  Render-as-voice-lands loop (render each chapter once its VO + anchors pass, else mark blocked) overlapped ~25 min of
  render with the TTS step; total 25 min video ≈ 2.7 min render per video minute on this laptop.
- (reel-04 "Claude Worlds", user's own footage, HyperFrames) Head-tracked wearables per world: compute a per-frame head track
  `[x, top, width]` from the RVM matte (top-most opaque row + its width), draw props as own SVG at unit size (w=100) and
  place them with `translate(x, top + w*k) scale(w/100)` — helmet (glass bubble + collar) in space, bush hat in jungle,
  top hat in the graveyard; the mascot sits on the highest prop (seat = top − w*k per prop) and bobs. Keep explosions
  (flash + shake + shockwave), no colour grade, music bed ≈ −24 dB under the voice. Example:
  `templates/examples/head-props-worlds-reel.html`.
- Replacing one chapter's VO with a single Gemini take (instead of a batch split) can push the final mix to +3.8 dBTP:
  single takes peak at 0 dBFS. Always end the master chain with a true-peak limiter after loudnorm
  (`aresample=192000,alimiter=limit=0.78:level=false,aresample=48000`) — re-QA after every partial re-render.
- (Bio Pages launch promo, 9:16 music-only, 2026-10-09) User verdict on v1 "animations are really lame, song not good" →
  v2 = bass-house track + EXPLOSIONS on every hit (flash, double shockwave, motion-blurred debris in brand colours, sparks,
  warm glow puffs — NOT grey smoke — camera shake, RGB split for 0.12 s) + real product UI (editor dialogs driving the live
  phone preview) + Cevox-style Three.js set pieces (ring tunnel into the drop, glossy displaced-icosphere blob with
  RoomEnvironment reflections, cube "data city" rising in waves). Default to this energy for launch reels.
- Rebuilding a Next.js/Tailwind client's CSS in Remotion: the @tailwindcss/webpack loader drops imported plain CSS →
  inject it as a <style>{CSS_STRING}</style>. Extract the client's scoped section with a brace-aware parser (keep only
  complete top-level blocks), never by line numbers. Copy their theme engine (themes.ts → themeToCssVars) verbatim and
  render real themes; replace wall-clock CSS animations with frame-driven transforms.
- Three.js product hook (drawer → phone): RoundedBoxGeometry radius must be ≤ depth/2 or the body bulges over the screen →
  build phones as ExtrudeGeometry of a rounded-rect Shape with a small bevel; render screens as PNG textures made by a
  helper comp (remotion still), preload them with delayRender BEFORE mounting <ThreeCanvas> (otherwise black screens);
  camera near ≥ 4 (z-fighting stripes with near 0.1); NoToneMapping + stronger key light to keep whites white; shadows
  "variance"; in 9:16 the horizontal FOV is tiny — size objects so they fit the width or the shot reads as a flat wall.
- ElevenLabs Music API: composition_plan is rejected for music_v2_5 and force_instrumental only works with `prompt`;
  sections ≥ 3000 ms; max 2 concurrent requests; music_length_ms is often ignored (28–51 s back) and the main drop
  tends to land ~16 s → analyse onsets/sub-bass share per second and EDIT on bar lines (cut each segment to its own wav,
  concat) so the drop hits the planned cut; add an aecho tail if the ending is cut short.
- (Bio Pages promo v3) User: "slow down when text / feature explanation comes, I can't read it — keep other animations as is."
  Fix without touching scene code: a scene-time → output-time map (`SLOW = [[from, to, extraSec], …]`, binary-search
  inverse) that stretches ONLY reading windows; explosions/shake/HUD run on output time (boom times mapped), SFX times
  mapped by the same table, and the music extended by whole bars (duplicate a drop bar per ~2 s of added time) so every
  hit still lands. Inserted beats = zero-width windows `[t, t, len]` rendered by output time. Give each text card ≥ 2.5 s.
- (Bio Pages DESKTOP film, 16:9, 2026-10-10) User: "confetti used a lot — use other effects, multiple effects and motions;
  intro must change; background is lame/plain; open a laptop". Rules: ONE debris explosion per film (the drop); every other
  section change gets its own transition — lens-flare light sweep, RGB glitch slices, colour-bar wipe, shockwave rings + flash
  (no debris), whip pan with motion blur, halftone dot-grid wipe, star sparkles, speed lines + zoom punch, particles converging
  into the logo. Background = living dark studio: drifting colour blobs whose hue follows the section, volumetric light beams,
  bokeh with depth blur, faint perspective grid, film grain, vignette — never a flat dark gradient.
- "Exploded command center" technique: rebuild the real desktop UI as 4–5 CSS-3D layers (plate, sidebar, header, main, live
  preview) with named poses (flat/assembled/exploded/focus-per-feature) interpolated by a key list; give layers +2…+8 px z
  offsets when assembled (avoid z-fighting); keep focused layers ≤ 0.85 scale and put one-line section titles in a top band.
- Three.js laptop intro: lid = ExtrudeGeometry slab hinged at the base's back edge (rotation.x from π/2 → −0.26);
  the screen planes must sit IN FRONT of the lid's bevelled face (depth/2 + bevel + ε) or you see grey aluminium; the
  RoomEnvironment reflection turns a dark floor grey → floor with envMapIntensity≈0, roughness 0.8 + scene fog to melt the
  horizon; end the camera perpendicular to the screen at d = screenW / (2·tan(hfov/2)) so it matches a full-width CSS
  dashboard (scale = 1920/1440) for a seamless cross-fade into the 3D layers.
- Need a real 3D product model (laptop, phone…) without a Sketchfab login? Use **Objaverse** (allenai/objaverse on Hugging
  Face, ~800k Sketchfab models with their licences): download `object-paths.json.gz`, look up the Sketchfab UID
  (last part of the model URL) → `glbs/<group>/<uid>.glb`, and check `metadata/<group>.json.gz` → `license` ("by" = CC BY 4.0,
  commercial OK with credit; avoid "by-nc"). Keep a CREDITS.txt and put the credit line in the post description.
  Inspect nodes/meshes (GLB JSON chunk), tint meshes to identify parts, re-parent lid meshes under a pivot at the hinge;
  split mixed meshes by each triangle's MAX height (min-height mis-sorts long hinge triangles); find the closing direction
  with a side-view angle test before animating. Hide an imperfect 3D→CSS hand-off behind a 0.26 s warm light flash.
- User verdict on a hand-modelled MacBook: "laptop frame is not good" → for hero devices prefer a real licensed model.
- DISK HYGIENE (2026-10-10: C: had 75 GB in %LOCALAPPDATA%\Temp): every `remotion render/still` and every Node-API
  `bundle()` call leaves a `remotion-webpack-bundle-*` copy of the project (≈1 GB with a big public/ folder) plus headless
  `puppeteer*`/chrome profiles in Temp, never deleted. After each delivery (and when stills scripts loop) remove them:
  PowerShell `Get-ChildItem $env:LOCALAPPDATA\Temp -Directory | ? { $_.Name -like 'remotion-webpack-bundle-*' -or $_.Name -like 'puppeteer*' } | Remove-Item -Recurse -Force`
  (only when no render is running). Bundle once per stills batch, keep public/ lean, and put render frames on D:.
- (reel-05 Spotify) Finger FX: MediaPipe HandLandmarker per frame (`scripts/hand_track.py`), pointing = index extended and middle/ring curled for ≥6 frames;
  launch rings/confetti at the tip and draw a glowing curve from the live fingertip to a context card. Mixed-language talk: detect language per 2.5 s window
  (faster-whisper detect_language) and suppress captions in Hindi windows. Render stability on a 16 GB laptop: 4K + 5 workers ran out of virtual memory;
  set FFMPEG_PROCESS_TIMEOUT_MS for long sources, HF_SEGMENTED_CAPTURE=true + --resume, and deliver 1080x1920 downscaled from 4K (sharp, about 3× faster).
  Count-ups: finish them ≥0.5 s before the slide ends so the final number holds on screen.
- (Spotify reel — TRASHED by the user, 2026-10-13) Captions didn't match the audio: whisper forced to language="en" on Hinglish TRANSLATES instead of
  transcribing. Rule: transcribe in the spoken language (hi) and transliterate, verify each caption chunk against a re-transcription of its own audio slice,
  and show a 10 s draft WITH AUDIO before any full render. Generic card/list panels and Wrapped-lookalike slides read as "not good visuals" — every beat
  needs a crafted, specific moment. Auto finger-tracking FX with no purpose = "glitches".
- "Use the avatar from the website" (no image-gen available): rebuild the brand's illustrated character as a posable SVG puppet — smooth limbs as one rounded stroke path (outline pass + fill pass, quadratic bend at elbow/knee) instead of rigid segments, hands ~1.4× scale, blink + breathe, named poses; show a pose sheet next to the original art for approval before animating. Template: templates/examples/vector-puppet-avatar.tsx.
- Non-technical feature explainers: let the PRODUCT OBJECT narrate ("I'm a link…") through one day; map each feature to a physical place in a tiny world (label shop = tracking tags, road junction with signposts = device routing, border/map = geo, shop-window clock/calendar = scheduling, night control room = dashboard) and let time of day advance with the story (dawn → night) as a free progress cue. Hanging tags: vary string length so labels never overlap.
- ElevenLabs "cosy/whimsical" beds come out ~6 dB quieter than bass tracks — check music-only gaps vs voice (aim ≈ −6 dB) instead of reusing a fixed bed gain.
- linkutm device targeting = ANY link per device (iOS field / Android field), not app stores only — never script it as App Store/Google Play. Fixing one VO line without moving the edit: re-record just that sentence, splice into the same slot (keep original words that still fit), atempo ≤ ~4% to match the slot length, re-render only that scene's frame range.
- Detect new product features: diff the docs index (Mintlify sites expose /llms.txt and /sitemap.xml) against what previous videos covered; report new pages + what's not stated (plans/limits) before pitching a video.
- Word-pop subs: the pop-in scale must be centred (transformOrigin 50%) and the word gap ≥ 30 px at 78 px type, or the growing word swallows the space ("COULDMAKE").
- Third-party AI apps in an integration ad: name them as text, build a generic chat window — don't copy their UI or logos.
- Topic-themed captions: let the subtitle style act out the topic (Link Rot → decay words turn red, then letters crack and fall). Per-letter spans with seeded random drift/rotation after the word's end time; keep the rest of the line static so it stays readable.
- Voice-only founder recordings: offer an avatar narrator — a flat cartoon of the founder on the vector-puppet rig, lip-synced from a per-frame RMS envelope of the cleaned VO ((dB+50)/28 clamped, 3-tap smooth → mouth ellipse height). Show 2 options (founder cartoon vs topic mascot) with a 3 s talking test before building.
- Phone voice memos often arrive at −35…−40 LUFS: run cut.py --clean (FFT denoise + speechnorm) before boosting, check noise floor vs speech (aim ≥ 30 dB gap).
- User-recorded voice (phone memo) ≠ TTS level: pre-level to −16 LUFS (highpass → agate → acompressor thr −34/4:1 + makeup → loudnorm I=−16 LRA 6) BEFORE the shared mix; drop the bed to ≈ −19 dB with sidechain thr 0.02/ratio 8 and halve sfx. Check music-only gaps sit ≥ 10 dB under the voice. (QR reel: user heard voice too low, music/sfx too loud.)
- Remotion --sequence pads frame names to the digit count of the LAST frame (960 frames → element-000.jpeg): detect the width (len of the first name's digits) before ffmpeg -i element-%0Nd.jpeg instead of assuming %04d.
- App launch reels for keyboard-driven apps: make the shortcut the hero — 3D glossy keycaps (top face gradient + darker side for depth, press = squash the side) slamming on the bass drops, each press firing the product's core action (ring blooms, file morphs). Beat-lock all cuts to the track's BPM grid (bt(n) = n × 60/BPM).
- "Lame" launch reel fix (Tapformat v1→v2): flat CSS cards read as cheap. Use ONE continuous Three.js scene with real materials (chrome metalness 1 / roughness 0.06, transmission glass, clearcoat colour), RoomEnvironment PMREM + ACES tone mapping, shadows, and a mid-grey floor + fog so chrome has something to reflect (an all-white studio makes chrome invisible). Camera must be close (objects fill ~40–60% of frame) and look DOWN at keycaps so glyphs read. Extruded slab labels must sit in front of the bevel (z ≥ depth/2 + bevel). Template: templates/examples/liquid-chrome-3d-launch.tsx.
- Mac/desktop app launch (Tapformat v1 flat → "lame", v2 chrome 3D → "very bad", v3 approved direction): show a REAL-looking macOS desktop (menu bar, wallpaper, Dock, Finder list), big cursor on eased paths, Screen-Studio auto-zoom camera (translate/scale around the cursor, ≤1.5 px velocity blur), keystroke HUD in a free corner, native-style ring/context menu/toasts, short Geist/Instrument-Serif type cards on the music's section changes. Offer 3 song auditions (different genres) before building. Template: templates/examples/real-mac-app-launch.tsx.
- UI SFX: generate with ElevenLabs /v1/sound-generation ("close-mic MacBook trackpad click", "shift+command key press", "airy whoosh", "soft low thump"); normalise each to −1 dBFS peak — raw outputs vary from −19 dB to near-silent; re-generate silent ones. No synth pings.
- Product-real launch films still need motion graphics (Tapformat v3 'why are there no animations'): camera moves alone read as static. Always layer beat-synced frame punches, transition wipes, kinetic word/letter reveals, action bursts (rings+particles), flying UI elements, animated labels/arrows/checks, and background floaters — plus a punchier mix (low-end EQ + compression, downbeat impacts, riser into the drop).
- "No life / make it crazy but smooth" (Tapformat v4→v5): build ONE never-cut camera in CSS 3D (perspective + preserve-3d) where every scene enters by flying through the previous one (dive/drop/spin), render at 60 fps, and give EVERY beat a hit (frame pulse, shake, edge colour glow, morph). Signature tricks: extruded keycaps from ~16 stacked translateZ layers; SVG goo filter (blur 14–22 + alpha matrix 36/−14) for liquid orbs that merge/split; per-letter 3D fly-ins (translateZ + rotateX/Y springs); speed streaks + colour flashes at cuts. Always send an 8 s motion test first. Templates: templates/examples/crazy-motion-kit.tsx + crazy-motion-launch.tsx.
- Music-only promos: master ≈ −10 LUFS with the music bus EQ'd + compressed and in front (−14 felt "very low").
- "More bassy + good renders" (Tapformat v5→v6): audition 3 ElevenLabs bass songs ON a 7 s render test (same picture, each song) so the user picks sound+look together. Real renders without a GPU: @remotion/three with clearcoat MeshPhysicalMaterial, transmission glass, RoundedBoxGeometry, canvas-texture labels, RoomEnvironment PMREM + coloured point rims + mirror floor with fog — 420 frames in ~47 s on Iris Xe (--gl=angle). Mix approach: one transparent ThreeCanvas per scene UNDER the CSS kinetic layer. Transmission glass over a transparent canvas renders as a flat white donut — only use it over an opaque floor. Song with no drop? Manufacture one: lowpass sweep 300 Hz→20 kHz via asendcmd + rising volume, full band at the drop. Retime an existing film to a new song by warping time (T = PH0 + (t − PHnew)·BEAT0/BEATnew) instead of re-timing every key.
- "Renders very AI like" (Tapformat v6→v7): drop abstract glossy primitives. Keynote look = real device model on a studio floor whose colour = fog = background, soft shadows, film grain, Apple type (fade-up + blur-clear on beats). Put LIVE DOM UI on a 3D screen: project the display's 4 corners with the camera each frame and apply a CSS matrix3d homography to a W×H div (solve the 8×8 system) — no texture baking, any React UI animates on the device. Frame shots in screen-widths along the display's normal/right/up; never translate the ThreeCanvas to reframe (exposes the floor edge) — offset the camera look instead. Template: templates/examples/keynote-laptop-live-ui.tsx.
- Real-app UI in 16:9 (Team Workspaces): a 1920-px virtual app viewport inside a browser window is UNREADABLE at 1080p — render the app at a 1280×720 virtual viewport scaled ×1.25, then zoom the camera per scene and set the zoom ORIGIN low when the payoff sits near the bottom so it clears the caption zone. Founder read-throughs: transcribe with small.en, then confirm doubtful words (hook, brand, "tool"/"to") with medium.en before captioning; offer "cut around misreads" vs "re-record those lines" when a slip changes the meaning.
- Real-case explainers (ACoS/Pets.com): the user wants the company HYPED first (viewers don't know old brands), then the twist, then the lesson; plug the product where the lesson genuinely needs it (e.g. "you can't know ACoS per ad without knowing which ad made the sale" → link tracking). Verify numbers against primary filings — popular figures (Pets.com "$11.8M ads") often differ from the S-1 ($7.6M). Draw generic stand-ins for famous mascots. Gemini TTS sometimes INSERTS a sentence: always diff the transcript vs the script and regenerate. Template: templates/examples/rise-and-fall-chart-explainer.tsx.
- Read references/prompt-motion-lessons.md before planning any motion video (default ban list, hero-element morphs, launch/explainer checklists).
- Before planning any video, read references/prompt-motion-playbook.md (brief skeleton: inputs → direction+ban list → beat structure → voice → sound → build → gotchas → approval gates; recipes per video type).
- Motion blur in Remotion without a plugin (The Link): add a second composition at 240 fps (same component, fps prop), render, then ffmpeg `tmix=frames=2,framestep=4` → 60 fps (≈180° shutter). Blending all 4 sub-frames (360°) smeared UI text during fast camera zooms. Always show the user 4 key stills (labelled) as an approval gate before the full render — they can't see images I read, so save the contact sheet to a path and give it.
- User-generated music: measure BPM/phase first; if it matches the film grid just trim the head to align the phase; if the track has no real drop, manufacture one with a lowpass sweep into the hero moment; end the film with the music rather than leaving silent tail.
- "The video is too small" (The Link v1): elements filling ~half the frame read as small even at 1080p. Lay out each scene to fill ~80 % at zoom 1 (bigger components, 30–40 px UI text minimum) instead of relying on camera zoom; give each feature ≥ 3–4 s. Manufactured drops: put the intro volume dip AFTER the bus compressor (otherwise makeup gain cancels it); intro ≈ 6 dB under the drop + lowpass + a 0.1–0.15 s near-silent breath + a sub hit = a drop that actually lands. ElevenLabs Music generations come out at the requested BPM reliably; generate 2–3 and pick by measured sub-share and energy curve.
- NEVER modify a brand logo (The Link was scrapped: an added orange 'full stop' dot overlapped the wordmark). Show the real logo file untouched with clear space; animate it only as a whole.
- Seasonal/brand-voice reels (Halloween "Undead Links"): tie the scare to a real feature (dead printed QR → dynamic QR). Keep the brand name lowercase even in all-caps caption styles — display fonts like Cinzel have NO lowercase, so render the brand word in the brand's own font. Logos on dark scenes go on a light plate (never recolour the logo). ElevenLabs music often places requested section changes a few seconds late: measure, then re-edit on the track's own beats (trim head, repeat a bar, keep the real ending) so the switch and final hit land on the right VO words.
- "Good but very lame" (Halloween v1 → v2): motion density matters as much as story. Checklist per scene: camera move or parallax (sky/hills/fog at different factors), a physics entrance (spring/squash-stretch/damped swing), secondary motion (flutter, wobble, drift), and an object-driven transition (flood from an object that contracts into the next scene's element; shared-element flight). Clip characters at the ground line while they rise. Re-measure VO word times before hard-coding beats ("cure" was 1 s later than assumed).
- Re-voicing a finished film (ACoS v3): don't re-key every scene — align old and new VO words with difflib, build a monotonic (new→old) time warp, and render the old visuals through it; captions use the new words directly; SFX times map through the inverse warp. Re-edit generated music on its own sections (trim head, cut part of a long silence, repeat a groove block) so its crash/return/ending land on story beats.
- ElevenLabs eleven_v3 narration: generate the WHOLE script in one request. Per-paragraph takes at stability 0.0 drift in pitch/timbre, and viewers hear "the voice changed mid-section". Use stability 0.5 for long reads (0.0 swung 173–225 Hz inside one take); verify with median F0 per 15 s window; fix pacing by splicing pauses (cap ~0.6 s, keep dramatic beats ~1 s) + atempo ≤1.05, then re-transcribe to catch clipped words.
- Cartoon "Pixar toy" characters without a GPU: SVG with radial-gradient plastic shading (light top-left → base → dark rim), glossy eyes (iris gradient + 2 highlights + lid for blinks), contact-shadow blur, squash/stretch + breathing, per-frame mouth openness from the speaker's audio RMS (speaker map from word timings). See templates/examples/toy-cartoon-cast-svg.tsx. Render a cast lineup still before building scenes.
- Multi-voice dialogue: one ElevenLabs take per character (all their lines), lines placed WHOLE with energy-detected edges (150 ms quiet) — never compress pauses inside a line (audible cuts, user complaint). Comedy narrator = happy/emotional tags, not deadpan. Word lookup helpers must match whole words ("so" ≠ "south") or scenes trigger early.
- Remotion + Google Fonts can fail mid-render on a network timeout → pass --timeout=120000 and re-run.
- Briefs from files: verify every product claim on the live pricing/feature page before scripting (three-sources brief implied naming rules on the Free plan; they're Personal+). Phrase CTA so it doesn't promise gated features.
- 9:16 UI reels: first pass was too small. Keep UI text ≥34 px at 1080 wide, fill the 450–1300 px band, and zoom a camera into real-app dialogs (focus point → screen centre) instead of showing the whole dialog. Script length: Lily v3 reads ~2.2 words/s with tags — a "20 s" script needs ≤45 words.
- (linkutm keynote-iPhone promo, 2026-10-23, HyperFrames + Craft suite, 9:16 40 s music-only) Keynote iPhone in HyperFrames: procedural Three.js phone (ExtrudeGeometry rounded slab, titanium MeshPhysical metalness 1 / rough 0.26, black glass plane at front+0.0015 with polygonOffset, capsule side buttons, camera plateau + lenses on the back so whip-spins look real), transparent canvas over a CSS warm-studio backdrop, radial canvas-texture contact shadow, RoomEnvironment PMREM + ACES. Live DOM app (390×844 virtual iPhone viewport) mapped onto the projected screen corners with a matrix3d homography every frame; hide it when the screen normal faces away. Camera/phone shots as a keyframe list evaluated in `renderAt(t)` (called from the GSAP timeline's onUpdate AND hf-seek) — deterministic. Typing/counters computed from t in renderAt, not GSAP onUpdate tweens. Example: templates/examples/keynote-iphone-live-ui-hyperframes.html.
- HyperFrames gotchas from that build: (1) inside the matrix3d-mapped screen, content revealed by tweening a container's HEIGHT from 0 rendered blank in captures (text never painted) — reveal with opacity on a fixed layout instead; (2) staggered `fromTo(..., {immediateRender:false})` leaves NOT-yet-started stagger children at their CSS value (bars showed full height mid-build) — `tl.set(targets, {scaleY:0}, sceneStart)` first; (3) pulses moved with left/top fail lint (`gsap_non_transform_motion`) — tween x/y deltas; (4) CSS `transform: translateX(-50%)` + GSAP y on the same node conflicts — centre with left:0;right:0;margin:auto;width:max-content; (5) flyer/overlay exit tweens that start before their entry tweens END lose (entry wins) — compute exit = max(next scene, entry end + hold); (6) `snapshot` stills can differ from the real render for freshly revealed DOM — confirm suspicious frames from the rendered MP4. Render speed on RTX 3060: 40 s 1080×1920 in ~65 s with `--gpu --browser-gpu --workers auto` (hardware ANGLE capture + NVENC).
- Fill shots of a phone in 9:16 cover the top caption band: in music-only/no-subtitle cuts put the script lines in a dark rounded caption PILL (white Inter 800 54 px, orange key words) at y ≥ 250 so it reads over the UI and clears the Reels header; big kinetic single words only in WIDE shots. Keep the top text block inside y 250–1500 (first pass sat at y 150 → under the IG header).
- Music-only fallback when the VO is blocked: beat-grid the bed first (this Mixkit track = exactly 120 BPM, drop at 3.0 s, energy lift at 19 s) and put every section change on a bar line, the hook text over the pre-drop, the brand reveal + one debris explosion on the drop, the second big hit (lock slam + shake + flash) on the energy lift. Mixkit "Stock Music Free License": free for commercial social video/ads, no attribution; not for TV/radio broadcast. Mixkit SFX URLs: assets.mixkit.co/active_storage/sfx/<id>/<id>-preview.mp3 (1117 classic click, 2531 typing, 1490 fast whoosh, 1143 deep impact). Align whoosh/impact PEAKS (not file starts) to the event.
- Gemini "AQ." API keys (new AI Studio format) returned 401 ACCESS_TOKEN_TYPE_UNSUPPORTED on every endpoint, header/query/SDK (widely reported on Google's forum, Oct 2026). Don't call it a sign-in token — it is a key Google rejects. Fix to offer: create an `AIza…` key in Cloud Console → APIs & Services → Credentials (same project), restrict to Generative Language API.
- (linkutm Santa remake, 2026-10-24 — Blender toy diorama, 4-voice ElevenLabs, HyperFrames overlays; project + template deleted by the client after the 'very bad' verdict) User asked to "recreate with better render and visuals, same script, expressive voices, GPU, Blender if it helps". What worked: characters as vinyl toys built from primitives + voxel-remeshed blobs with ONE rig contract (root/body/head pivot, lid pivots, brow empties, scalable mouth, shoulder pivots) so every shot drives any character; Rhubarb (with the dialog text) -> mouth open/wide keys; reach() aims arms at world points (phone-to-ear etc.); per-shot functions keyed to the VO timeline + word timestamps; shots export track.json (world_to_camera_view of heads / chimney tops / screen-corner empties) so HyperFrames bubbles + UI follow the 3D camera exactly. Gates that saved rounds: line-up still -> 3 s talking test with real audio -> one-still-per-shot contact sheet -> approval -> full render.
- Blender scripting traps: matrix_world is stale right after setting scale/rotation — call view_layer.update() before copying it (parent_keep), or scaled parts snap back to 1 m; children of a SCALED parent inherit the scale (clipboard text squashed to nothing) — parent props to an unscaled empty; cylinder+bevel "capsules" get flat ends — build capsules from a UV sphere split at the equator (bmesh); keyframing scale=(1,1,1) on a scaled cube makes it 1 m — keep the original scale; modifier.move() index is 0-based among existing modifiers; in 9:16 the camera's horizontal FOV is tiny (sensor fits the height): keep props within ±dist*10/lens metres of the view axis; Fredoka has no ♪/♥ glyphs (tofu boxes) — model them; Google Fonts TTF download: an IE6 user-agent returns EOT, an old-Safari UA returns real TTF (magic 00010000); EEVEE 64 samples 1080x1920 ≈ 2.2 s/frame on an RTX 3060 laptop.
- ElevenLabs casting without spending characters: search /v1/shared-voices (santa, grandma, elf…), download each voice's preview_url for the client to pick, then add only the winners with POST /v1/voices/add/{public_owner_id}/{voice_id}. A 64-hex value is a key ID ("api_key_id_used_as_api_key") — the real key starts sk_. eleven_v3 stability: 0.5 for narration/brand lines, 0.0 for comic characters; 2 takes per line, pick by pitch range (semitones p90-p10) + dynamics, override where whisper only penalised a laugh. Trim each line 0.2 s after its last whisper word (breathy whispered tails read as dead air); whisper hallucinates "Thanks for watching!" on trailing silence — verify brand lines with medium.en + VAD. faster-whisper CUDA "cublas64_12.dll not found" -> os.add_dll_directory(<venv>/Lib/site-packages/torch/lib).
- Overlay readability: narrator captions as one phrase at a time (≤7 words, break on punctuation) — full sentences ran to 3 rows over the scene; hide the narrator line when the end card appears; SVG speech-bubble tails need an explicit full-frame svg size (0x0 svg = invisible tail); bubble above the head (head_y − 400 − h) so it never covers the eyes.
- CLIENT VERDICT (Santa remake, 2026-10-24): the procedural Blender toy renders (primitive/remeshed characters, flat procedural materials, simple EEVEE light) were judged "very bad" — worse than the original 2.5D video. Do NOT pitch code-built 3D characters/sets as the hero look again. Prefer real footage, real product UI motion, polished 2.5D/vector illustration, vetted licensed 3D assets, or AI generation when available. If 3D is requested: render ONE finished hero frame and get approval against the reference before building any pipeline. The project and its template were deleted; the reusable ideas (ElevenLabs shared-voice casting, take checking/picking, Rhubarb lip-sync, track.json-driven overlays, ducked mix) are described in the lessons above. Blender 5.2 + Rhubarb stay installed in tools\ for future projects.

## 2026-10-25 — music-synced gym progression edit (user's own clips, user adds the song)
- User said "no sound effects, I'll add the song" → deliver a SILENT master cut to a beat grid; never add SFX/music. Ask for the exact audio file to lock sync (TikTok remixes like the "Cool for the Summer" hoodtrap have no published BPM).
- Build the cut list in BEATS (build.py `--bpm`), not seconds, so a new tempo = one re-run (~75 s for 30 cuts on the RTX 3060 laptop).
- iPhone .MOV with `display_matrix rotation=-90` = PORTRAIT (ffmpeg auto-rotates) — check before planning a 16:9→9:16 crop.
- Low floor-angle lift footage: heads sit at the very top → zoom anchor at the top (zoompan y factor 0–0.15), never centre; centre zoom cut the head off on frame 0 in v1.
- Text on such footage goes on the empty floor band (y≈1300–1450), not the top (faces live there).
- Progression structure that worked: frame 0 = final PR lockout + weight → fast reverse "rewind" → chronological pulls, each lockout on a downbeat (punch-in + white flash) with date stamp → accelerating 1-beat/½-beat setup cuts → slow-mo pull + lockout with the weight slam.
- v1–v3 (plain beat cuts + punch-ins, dates, freeze-outline, text-behind) were judged "very lame" on EVERY axis (pace, effects, story, type). What landed instead: a strobe-trail (multi-exposure) concept — mono ghosts of the lifter+bar+plates fired on each beat, live lifter + coloured plates on top — plus the user's reference-reel effects (cyan x-ray negative of the subject on frame 0, orange full-frame negative flash on section hits, 2x grip close-ups cut from 4K, thin red Didone serif title).
- Song lyrics: never type them on screen yourself; offer story words / user-supplied words / effects-only (user chose effects-only).
- 6 GB RTX 3060 laptop: rembg BiRefNet ONNX overflows VRAM (~15 s/frame on GPU AND CPU); two parallel workers ran 16 GB RAM out and the job was reaped. Use BiRefNet only on a few keyframes (strobe exposures, cached), RVM resnet50 for every live frame, and a saturation mask to keep coloured bumper plates in front (RVM is person-only). HF trust_remote_code downloads are blocked by the user's permission rules.
- Reference reels on Instagram: WebFetch returns nothing; ask the user to export the file (they used an "igexport" mp4).
- (Personal-brand Spotify reel, 2026-10-26, "ceiling canvas" depth sandwich) Low-angle desk shots leave a big empty ceiling above the head: use it as the canvas (one paper "hero card" that morphs state per beat, VIP pass dropping from the ceiling on a cord, a wall of story phones, editorial serif type behind the head for the payoff/moral). Hook text handwritten (Permanent Marker) ON the ceiling, fully written at frame 0. Subtitle styles mixed by role (marker hook / minimal lower line / notebook highlighter for the psychology beat / editorial behind head for payoff), verbatim Hinglish in Roman script.
- iPhone HLG retag: the h264_metadata bsf alone leaves the MP4 `colr` atom as arib-std-b67/bt2020 → also pass `-color_primaries bt709 -color_trc bt709 -colorspace bt709` on the remux, and verify with ffprobe.
- faster-whisper CUDA on this machine: `import torch` BEFORE `from faster_whisper import WhisperModel` (loads cublas; add_dll_directory alone was not enough). Whole-clip `language=None` on Hinglish can come back TRANSLATED on a re-run of the cut — take Hindi caption text from the first-pass Devanagari words and transliterate.
- Short words ("No discount. No gift.") get mis-timed by whisper, so pause-tightening can clip them: check the RMS envelope (50 ms windows) and keep such beats whole (no inner tightening).
- HyperFrames: measure inline spans with offsetLeft/offsetTop relative to the nearest positioned ancestor (don't add the parent block's offset); anything a later tween fades in (`fromTo opacity 0→1, immediateRender:false`) is VISIBLE before that tween → `gsap.set(..., {opacity:0})` up front. 65 s 1080×1920 with a VP9-alpha cut-out + bg video renders in ~5 min on the RTX 3060 (`--gpu --quality delivery --sdr`).
- Real stats for Spotify Wrapped (verified 2026-10-26, TechCrunch / Music Week quoting Spotify, Dec 2025): 200M+ engaged users in the first 24 h (2024 took 62 h); 500M+ shares on day one (+41%; includes in-app shares, screenshots, downloads); India among the key growth markets.
- USER RULE (2026-10-26): KEEP the speaker's Hindi lines in Hinglish reels. Never trim Hindi restatements as "repeats" when tightening; cut only English filler, and caption Hindi in Roman script.
- Re-cuts without rework: matte the WHOLE conformed source once (conform_alpha.mp4) and cut the alpha with the same edit list as the picture (`cut.py alpha.mp4 segs.json --video`). Author graphics against the edit, then wrap the timeline (`tl.to/fromTo/set → TL.*(…, M(t))`) where M maps old output time → source time → new output time, so every beat stays on its word after a re-edit. ElevenLabs Music 429 → extend the existing bed by whole bars (estimate BPM by onset autocorrelation; splice T with a copy from T−4 bars, 30 ms crossfade).
- (Spotify reel v3, user feedback) The user moved the hook to the speaker's ORIGINAL opening line ("a company is giving data back to its users… and they advertise it for free"), the idea itself, not the most quotable detail. Ask "which line is the hook?" with 2 options from the transcript instead of assuming the punchiest stat-line. Brand-case reels: theme the SUBTITLES after the brand. Spotify → a lyrics card (coloured card per section, sung line white, past line faded, next line dark, Figtree 800, small "Lyrics" header) plus a now-playing "On Repeat" card and Spotify-style bold sans for the type behind the head.
- Phone-front-camera takes often open with 0.3 s of shake/blur while the phone settles: `cut.py --freeze "a-b@sharp_t"` holds a sharp frame (apply the same freeze to the alpha cut).
- Editorial paper style built (template editorial-paper-reel-headline-captions.tsx): paper + feTurbulence grain, halftone dot shadows via CSS radial-gradient, SVG halftone wipe (dot radius from distance to centre), rubber stamps with paper scraps + global shake, headline captions word-by-word with marks (serif / underline / circle / strike drawn by strokeDashoffset) and live counters for numbers, mono HUD label + per-beat counter. Per-scene stage scale needs a clip check — left/right-placed props overflow when scaled around centre.
- User's own recording: trim leading silence so the hook lands < 0.3 s; captions must follow the actual words (slips included).
- Plan before questions: present a scene-by-scene plan in chat first; ask open choices at its end, not via a popup.
- One-camera "world" reels (template one-camera-feed-world-story-sticker-captions.tsx): lay every beat out as a region of one big canvas, drive a single camera (x, y, zoom keyframes on word times) with motion blur from per-frame camera speed; no cuts/crossfades. Check stills for regions bleeding into neighbouring framings (space regions ≥ 1 view-height apart) and push zoom until UI text ≥ ~30 px on screen.
- Story-sticker captions: inline span with white background + `box-decoration-break: clone` gives the IG per-line sticker look; first chunk must be visible on frame 0.
- Lily (ElevenLabs v3) reads ~1.9 words/s with tags: a 50 s reel needs ≤ ~100 words; check credits before multi-take runs.
- (Eight Creators v2) "Voice not expressive": direct EVERY beat in the Gemini profile (gossip, mocking brag, gasp, whisper, laugh on the comic pause, CAPS for emphasis — template gemini-expressive-profile.txt), audition 3 voices, pick by measured pitch range (Laomedeia 15.8 st > Leda 12.4 > Zephyr 10.6; flat Lily take 12.5). Gemini free tier: 3.8-flash-tts = 10 requests/day; 2.5-flash-preview-tts still works as fallback.
- "Subtitles blocking the visuals": frame every scene in the top ~3/4 (stage centre y≈700) and give captions their own band (y≈1450–1650) with a paper fade behind — check stills for caption/content overlap before the full render.

## 2026-10-07 — JewelleryOS v4: client's website source + POS
- **Client gives website source → use THEIR elements, not approximations.** Copy `public/` assets (logo svg, product renders,
  icon sets) into `public/<brand>/site/` and rebuild their UI components 1:1 in Remotion (same tokens, copy, formulas —
  e.g. their PricingConfigurator maths). Shared cards live in `src/jos/SiteCards.tsx`. Brand accent = their headline trick
  (Instrument Serif italic accent word) applied to kinetic subtitles.
- **Feature honesty:** check the site copy before naming a feature. JOS "POS" is custom-scoped work → said as
  "Her billing counter, connected to all of it" + scan → weigh → GST invoice → ripple (stock, CRM, website, report).
- **Show the real website:** `scripts/site_scroll_capture.mjs` (raw CDP, no puppeteer) scrolls the live site in 600px
  steps; stitch shot0 + rows 300–900 of each next shot into one long image → scroll it inside a browser frame at the CTA.
  Tall-window `--screenshot` does NOT work (scroll-reveal/sticky sections stay blank).
- **Windows App Control started blocking `remotion.exe` (compositor) → "spawn UNKNOWN".** Don't touch security settings;
  local patch in `node_modules/@remotion/renderer/dist/offthread-video-server.js` wraps startCompositor in try/catch with a
  stub (backup `.orig`). Works for comps without <OffthreadVideo>. Re-apply after `npm install`. Never run two renders at
  once (browser connect timeout).
- **Changing one line of an ElevenLabs take cheaply:** generate only the changed lines (v3), trim silence, loudnorm to
  the take, splice at word boundaries from the whisper words → re-transcribe → word file → comps re-time themselves.
- **Hinglish VO supplied by the user (Gemini):** whisper `--lang en` TRANSLATES Hinglish → use it only for sentence
  boundaries; place the approved Roman-Hinglish script words along voiced RMS time by syllable weight
  (`D:\codes\work\jewelleryos\hinglish\align.py`). Re-pick anchors on unique words — "aur"/"ek"/"aaj" repeat
  (bug: `F("aur")` hit "store aur appointment" and skipped a whole scene). Print the anchor list and sanity-check it.
- **Client widget → video:** copy their real stylesheet (`:host`→`.vai-host`), render the same class markup with fake
  data, and pin CSS keyframes to the frame: `el.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=frame/fps*1000})`.
- **Device-frame outro (MacBook → iPhone → iPad → line-up):** `src/jos/Devices.tsx` (CSS space-grey frames +
  `Crop` helper that re-flows real crops of a desktop full-page capture into phone/tablet layouts) and
  `src/jos/DeviceShowcase.tsx` (spring "track" of [time, {x,y,scale,rotY}] states per device, VO-anchored).
  Full-page captures repeat fixed widgets (chat bubble) once per viewport — don't inpaint over content
  (smears); keep them or ask for a capture with the widget closed. Measure crops on a gridded copy and
  double-check the grid's y labels (I mis-read one section by 100 px).
- User asked about render time: offer a 0.5-scale preview first, and final encode with preset medium (not slow).
- **Arabic subtitles (RTL) over an English VO:** one Arabic line per spoken English sentence (`[firstWord, lastWord, text]`),
  revealed word-by-word across the sentence, `dir="rtl"`, Almarai 800 + Amiri gold for *accent* groups. Keep the
  conjunction و attached to its word (never "و *word*"), and glue punctuation tokens onto the previous word.
- **Gemini TTS:** never quote transcript phrases inside DIRECTOR'S NOTES — it reads them aloud. Describe style generally,
  then check every take with whisper for extra lines before using it.
- (reel-02) HyperFrames/GSAP gotchas: tweening x/y/rotation on an SVG <g> that has a `transform="translate()"` attribute
  REPLACES it — wrap: outer <g transform> + inner animated <g>. For procedural drawing (waves) redraw in the timeline's
  `onUpdate` (runs after all child tweens), not in a clock tween, or seeks render stale state.
  Word-pop captions: auto-fit font-size to the frame width after setting text.
  Never wait on "no chrome.exe" — the user's own browser keeps running; wait on the output file / the render log line instead.
- (reel-02 v3) User asked for: brand colours (Škoda emerald #0E3A2F + electric #78FAAE), REAL symbols (Fluent Emoji 3D, MIT, +
  real logos from Commons) not drawn figures, face NOT zoomed → cut the speaker out (`hyperframes remove-background`) and place
  them ~70% size, low, with visuals behind; "crazy" motion = shakes, punch-ins, shockwave rings, shatter, icon rain, confetti.
  Perf: remove-background uses ~6% CPU single process (~2 s/frame @1080p) → split into 5 chunks and run in parallel (~2× faster,
  watch RAM), concat VP9-alpha webms with `-c copy` (alpha survives). 4K render with a transparent webm hit Node heap OOM →
  `NODE_OPTIONS=--max-old-space-size=7168` + `--low-memory-mode --workers=3`.
(Recovered 2026-10-28 from branch skills-update-2026-10-08.)
- (Duolingo reel, 2026-10-27) COLOUR: iPhone HLG footage → use libplacebo (`ffmpeg -init_hw_device vulkan … -vf libplacebo=…:colorspace=bt709:color_primaries=bt709:color_trc=bt709:range=tv:tonemapping=bt.2390`). The user called plain-scale/zscale conversions "too yellow"; libplacebo gave natural skin and white walls. Show a 4-way A/B still (plain / mobius / zscale / libplacebo) when unsure.
- REAL POSTS WITHOUT A BROWSER: public X posts → `https://cdn.syndication.twimg.com/tweet-result?id=<id>&token=4` returns exact text, created_at, like count, avatar and media (photo URLs + `video_info.variants` mp4s). Find post IDs by scraping news articles that embed them (regex `(twitter|x)\.com/(\w+)/status/(\d+)`). Rebuild each post as a card with verbatim text, real image/video and real counts (label "Real post"); never alter wording. Headless Chrome screenshots of the X embed render blank. Some accounts (e.g. Dua Lipa) return nothing.
- Brand case-study reel as the brand's own UI (Duolingo = lesson page: progress bar, hearts, word-bank tiles for subtitles, green "Nicely done!" sheet, CONTINUE button for the moral). Card mode = white lesson page on top + footage shifted down 660 px (face in the lower half); full mode for reactions. Time real clips so the key action lands on the spoken word (hold a still from the same clip until then).
- Whisper on heavy Hinglish: VAD dropped 30 s and medium/turbo `hi` garbled the English → run turbo `en` on English-heavy slices + turbo `hi` for Hindi lines, and build pauses from an RMS envelope instead of word times.
- CLIENT VERDICT (Duolingo reel v1, 2026-10-27): 'very good… the content you created using the real statistics'. This is now the benchmark for personal-brand case-study reels; follow references/playbook-brand-case-study.md.
- (Nike reel v1→v2, 2026-10-28) The user said the skin looked "very pale and dull" after the neutral libplacebo conversion, and wanted a slight glow with NO yellow. Approved recipe for face shots: `eq=gamma=1.07:contrast=1.05:saturation=1.1,colorbalance=rm=0.03:gm=-0.025:bm=0.01` + soft glow (`split; gblur sigma 20; blend screen 0.07`). Minus green = no yellow; plus red = healthy warmth. Always show a 3–4 way A/B still first; a magenta-heavy blend looked pink.
- "Nike logo very lame": never hand-draw a brand mark. Use the real logo file (Commons `File:Logo NIKE.svg` is public domain) and reveal it with a clip-path wipe plus a scale/rotation settle. Low-res newspaper scans read as "not good". Prefer sharp colour photos: Steve Lipofsky's Jordan (CC BY-SA 3.0), Paul Sakuma 1987 (PD), and the UPI 1984 portrait "(bigger crop)" version.

## 2026-10-26 → 28 — linkutm reels (expiry, branded domain, budget split, glossary #8) + Leda
- **APPROVED linkutm look (expiry-link v2, branded-domain, budget-split):** capture the live site first (`npx hyperframes capture https://linkutm.com`), take the real logo SVG and the real latin font subsets (Onest / Inter / Open Sans italic accent / JetBrains Mono — the `.p.` woff2 files from `/_next/static/media/`), and rebuild the site's own components (badge pills, dark-brown "Start for free ↗" pill, link rows, the real Create-link dialog, the real free UTM Builder form) plus real objects (iPhone, split-flap clock). Flat UI on a blank canvas = "lame"; invented CSS-illustrated worlds (desk at night) = "very AI-ish… boring" (trashed).
- **Vary the set every video:** three reels on the same peach gradient → "the background looks the same". Design a story-driven set per video (e.g. dark espresso "problem" world with drifting grid → bright studio-paper dot-grid "fix" world flipped on the music drop), giant outlined background word per scene drifting behind the cards, cards craning in with a perspective tilt (rotationX 16 → 0), text colours switching with the world.
- **Glossary reels = the glossary page theme ONLY.** A/B v1 in an invented "2008 internet" world was "very bad… look at the glossary page, there will be a theme". Always open linkutm.com/glossary/<slug>, download `blog.linkutm.com/wp-content/uploads/<yyyy>/<mm>/glossary-<slug>-featured.png`, rebuild THAT character as an SVG puppet (joints with svgOrigin; poses rest/pointUp/present/think/shock/cheer/shrug; blink, breathe, hop, walk-in) and draw every story prop in the same flat pastel line-art (peach→lavender gradient, maroon outlines, Patrick Hand, rings/swirls/leaf doodles). Don't apply the website-component / OpenMontage style to glossary reels.
- **Voice = Gemini Leda by default** ("the voice has to go" for ElevenLabs Alice; user picked Leda from Gemini auditions). Record the whole script in one request; director's notes per paragraph with ≥ 2 concrete cues; Leda runs long (74.7 s raw for ~205–230 words) → cut pauses > 0.42 s to 0.30 s + atempo 1.05, or trim words (2.0–2.5 w/s budget); faster-whisper word times, map caption spelling per phrase.
- **Word anchors must be unique:** prefix matching hit "six"→"sixty", "ab"→"about", "test"→"tested/testing", "button"→"buttons" and fired scenes early. Print every anchor with its n-th index and check it against the transcript (same lesson as JOS "aur").
- **QA additions:** transcribe the RENDERED file (≥ 95 % of script words, last words correct); hide captions where on-screen counters / big type already say the same words; first caption visible on frame 0; SFX placed by the file's measured peak and ~15 ms before the visual; music spliced so a real drop/kick lands on the story's turn (measure onsets near the splice).
- **Free music source notes:** Mixkit tracks via `assets.mixkit.co/music/<id>/<id>.mp3` and SFX via `assets.mixkit.co/active_storage/sfx/<id>/<id>-preview.mp3` (tag pages list ids). Pixabay site blocks scraping; its API covers photos/videos only.
- **Deleting on request:** after "final", copy to Desktop and delete unused auditions, music candidates, captures and stills; keep the project, VO take, SFX, music cut and final render.
- (Bio Pages v4, 2026-11-17, "recreate with different animations") One-hero morph reel: a single brand object (the orange link pill) stays on screen and morphs into every beat (handle → phone screen → theme wipes → blocks → QR → chart bars → CTA) — continuity replaces cuts; letter-by-letter headline rewrites per section; act change on the music's energy lift (grey studio → warm). Template one-hero-morph-reel-text-rewrite.tsx. First stills were too small again — size the hero for the phone screen (pill ≥ 760 px wide, phone ≥ 590 px) before rendering. Music-only master: limit 0.8 to keep the sample peak ≤ −1.5 dB.

## 2026-11-17 — Thig "Meet your AI team" (16:9, Higgsfield, 100-credit cap) — spent 89.98
- Higgsfield cost ladder (5 s, 720p): kling3_0_turbo 7.5 (1080p 10) · grok_video_v15 22.5 · seedance_2_5 35 (1080p 80). gpt_image_2_6 keyframes: low 1k 0.25 · medium 1k 0.5 · high 1k 1.5 · high 2k 2.75. text2speech_v2 (elevenlabs) ~0.9 per 20 s script; elevenlabs_music_v2_5 3.78 for "26 s" (returned 40 s — length ignored, trim it). Always `generate cost` first; it validates params for free.
- Budget recipe that worked: 16:9 keyframe per shot from the brand mascot (gpt_image_2_6 medium 1k, mascot PNG + agent card as --image refs, "no readable text") → hero on Seedance 2.5, supporting shots on Kling Turbo → only ~1.3–2.8 s of each 5 s clip used. Upscale 720p→1080p with lanczos + light unsharp.
- Kling Turbo clips often break at ~2.5–3 s (sudden re-framing/jump, prop morph); Seedance re-composed the keyframe (centred, eyes closed at frame 0). Build a 4 fps timestamped strip per clip and pick clean windows before editing.
- Higgsfield preset TTS was used only because no Gemini/ElevenLabs key was available — the user prefers their own Gemini/ElevenLabs voice: ask for the key at intake.
- Windows tooling: faster-whisper + new PyAV breaks (`metadata_errors` TypeError) → decode with ffmpeg to f32le and pass the numpy array. ffmpeg overlays: `-loop 1 -t` + setpts offset + alpha fade STALLED (0-byte output, 10+ min); single-frame PNG inputs vanish after ~2 s; working pattern = `-loop 1 -framerate FPS -t TOTAL -i png` + `overlay=enable='between(t,a,b)'`.
- USER VERDICT on the Thig video: "very bad script and also very bad hook" (no remake requested). Causes: I skipped §0a-bis (never asked the script angle, never ran value-scripting.md) and wrote a feature list ("I research / write / publish / help you grow") instead of founder outcomes (time saved, customers, growth); the hook "Hi, I'm Thig, your AI marketing team" is a self-introduction with no curiosity, pain or stakes. Rules: never open on "Hi, I'm <brand>"; open on the viewer's pain or a surprising claim; mascot reels still need a value-first story; show the script + 2-3 hook options as their OWN approval step before spending any credits.

## 2026-10-28 — THIG promo v1 (16:9 4K60, music-only, OpenMontage stages + HyperFrames/Three.js)
- **HyperFrames 0.8.212 retired `general-video`**; its knowledge now lives in `/hyperframes` references (story, spec, film, motion, types/launch, types/3d). `npx hyperframes skills update <x>` writes into ~/.claude/skills — copy the refreshed folders back into the repo (`robocopy <installed> <repo>\hyperframes\<name> /MIR`) BEFORE running sync-skills.ps1, or the sync reverts them.
- **OpenMontage as the stage spine** (research → proposal → script → scene plan → assets → edit → compose → review → publish) works well layered over our rules; the useful bits were taste dials, slideshow-risk / "different primary subject per scene", and SPEC.md with every adjective as a number. Unzipped copy: tools\openmontage (AGPL — run as a tool, never vendor its code).
- **4K from a 1080p composition:** author 1920×1080, render `--resolution landscape-4k --fps 60 --quality delivery --gpu --browser-gpu --workers 3` (RTX 3060: 2531 frames in 4 m 43 s). WebGL must use `renderer.setPixelRatio(devicePixelRatio)` or the 3D stays 1080p while DOM goes 4K.
- **3D devices + live DOM UI (approved engine):** Three.js MacBook/iPhone bodies, the real site UI as a DOM div mapped onto the projected screen corners with a homography (matrix3d) every frame — UI stays razor-sharp at 4K (100 % crop checked). Anchor the laptop camera to the REST pose of the screen, then move the body (`my`), otherwise a "rise into frame" is invisible because the camera follows the screen.
- **Cursor / thumb on a 3D screen:** project virtual UI coords through the same homography (`pt(x,y)`) so the pointer lands exactly on the button at any camera angle. Remember page offsets (nav height) in the virtual coords.
- **PowerShell 5.1 mojibake trap:** `Get-Content -Raw` + `[IO.File]::WriteAllText` on a UTF-8 file double-encodes →, ·, ✓, “ ” (they turned into ÃƒÆ'… and made buttons huge). Edit composition sources only via Python (utf-8) or the Edit tool; `src\fix_mojibake.py` repairs repeated rounds.
- **Template outside the project:** keep `index.src.html` + build.py (inlines icons/mascot SVG with id prefixes) in a sibling `src\` folder — a second root HTML with `data-composition-id` in the project fails lint ("Multiple root-level HTML files").
- **Pre-tween flashes:** with `immediateRender:false`, elements in a later scene sit at their CSS default until their tween starts — give every later element a CSS start state (opacity 0 / clip-path inset) and keep frame-0 tweens immediate so the hook frame is complete.
- **Debugging a frozen composition:** if every snapshot shows frame 0, the module threw — load the page with puppeteer-core from the npx cache + hyperframes' chrome-headless-shell and print `pageerror` (`src\console.mjs`). Here: a duplicate `const MD`.
- **Music for music-only promos:** rank Mixkit candidates by sub-bass share + 1 s energy curve; fit the beat grid by kick-onset peak picking + linear fit (autocorrelation gave 127 vs 138 BPM on one track). A breakdown with a 1.5 s silence before the drop = perfect slow-mo "hold before the payoff"; cut whole bars out of the breakdown so the drop lands on the story's tap.
- **Loudness after AAC:** a −1.0 dBTP WAV master came out at −0.3 dBFS after AAC 320k. Master to TP −1.8 / limiter 0.8 → −1.7 dBFS after encode, −11.8 LUFS.
## 2026-10-29 — THIG promo v2 + mascot gesture attempts
- **THIG has NO mobile app:** v1's iPhone approval feed was rejected — show the product as a desktop web app (browser on a 3D MacBook). Check what platforms a product really ships before choosing a device.
- **Mascot gestures must come from the brand's own art.** Rejected in order: v1 SVG blob hands ("very bad"), code-redrawn vector arms ("very 3rd class", "very very very off" next to the official 3D render), a Blender metaball model matched to the official render (6 rounds, deleted on sight). Only acceptable: official renders, or poses generated FROM the official art (Gemini Nano Banana needs billing — free tier image quota is 0; or HeyGen). Without them, use the single official pose with a hop/sway/squash rig.
- **Mascot rig in HyperFrames:** one DOM layer, pose images bottom-anchored, squash on pose change, beat hop, sway; anchor to a projected 3D point (e.g. the laptop palm rest) so it stands on the device; aim the camera lower so it isn't cropped.
- **SVG gotcha:** `<g>` is not allowed inside `<clipPath>` — put transforms on each shape.
## 2026-10-29 — Screen-Studio-style site walkthrough recorded by me (THIG, Okara reference)
- **Deterministic browser recording at 60 fps, 2x DPR:** chrome-headless-shell with `--enable-begin-frame-control --run-all-compositor-stages-before-draw --disable-threaded-animation --disable-threaded-scrolling --disable-smooth-scrolling --force-device-scale-factor=2`, a target created with `enableBeginFrameControl: true`, and one `HeadlessExperimental.beginFrame({screenshot})` per frame (pump frames while the page loads). 2172 frames of 2880x1800 in ~4 min. Script: work\thig-walkthrough\src\record.mjs.
- Page.startScreencast silently drops to ~4 fps at full res; virtual-time + page.screenshot deadlocks — use BeginFrame.
- Inside the BeginFrame loop, puppeteer `page.evaluate`/`mouse.wheel` can deadlock; drive page state with raw `cdp.send("Runtime.evaluate")` (fire before the frame, await after). Mouse moves are fine for :hover. Hover menus: park the real pointer on the trigger while the DRAWN cursor glides over the items.
- Edit: video in a floating rounded window on an off-white radial bg, camera keyframes [t, scale, focus x/y or follow-cursor range] eased 0.7 s and clamped so the window always covers/fits the frame, drawn big cursor + press scale + ripple from the logged path, speed-based blur. Frame each zoom on the section HEADING + its UI, end on a zoom-out.
- (DSC reel v1→v2, 2026-10-30) The user said "subtitles are blocking the visuals, the visuals are very generic, add real photos". Fix that worked: a THOUGHT-PROJECTION redo. The speaker is cut out (full RVM matte) with a white outline (4 CSS drop-shadows), scaled 0.78 and pushed down 250 px, with a bust fade (mask: bottom 70→84 %, sides 4→12 % / 88→96 %) so frame edges, bean bag and knees melt into a story set (a bathroom subway-tile wall as an SVG pattern). Real photos and headlines are taped above the head (y 250–950). Captions sit in a chest band (y≈1505) and never cover visuals. Real photos without a browser: the news article's og:image (Fortune's still of Dubin in the ad, credited "image via Fortune") plus Commons CC photos (Federer, Unilever House).
- SHAVING FOAM ON THE SPEAKER'S FACE: MediaPipe FaceLandmarker (tasks API, `face_landmarker.task` in tools\models\mediapipe; `uv pip install mediapipe`) → per-frame beard polygon = jaw [234…152…454] + lower-cheek line [447,345,352,411,425,266,329,2,100,36,205,187,123,116,227], with an outer-lip hole (evenodd). 3-frame smoothing, written to assets/face.js. In the composition the foam is a clipPath of that polygon over the SVG foam filter + a blurred fluffy edge + a soft drop shadow, inside the same scaled container as the cut-out so it stays aligned. Razor strokes are a mask line from the cheek (411/187) to the jaw (397/172), round caps, with a cut-out razor photo riding the stroke head. Limit strokes to their own window, or the cuts carry into a later foam window.
- (DSC reel v2→v3, 2026-10-30) The user said "don't do the background thing", so they don't want their room replaced by a designed set. Keep the REAL room full-frame and put visuals behind the cut-out (depth sandwich). Keep text cards in the band above the head (y≈250–470) and photos at the sides, because the head rises when the speaker leans and hides text behind it. "Razor should remove the foam in one go": ONE sweep, a black mask rect growing across the beard bounding box (eased) with the razor riding its edge, razor head ≈ half the face height. Two cheek strokes read as fiddly.
- (DSC reel v3→v4, 2026-10-30) "Visuals are being blocked by my head, so split-screen it." When the speaker's head sits high in frame (low-angle phone shots), visuals behind or above the head get hidden. Default for these takes: a SPLIT layout. A top panel (0–980, paper texture, dark divider) holds the real photos and cards at full size. The real footage (and the cut-out + face-foam container) shifts down ~560 px, so the face sits in the bottom half. Captions go just under the divider (y≈1000), above the head. Keep the hook and the final line full-frame; slide the panel in and out with a 0.3 s ease. Size cards to the panel, counting padding: left + width + 2×padding ≤ 1050.
## 2026-11-04 — linkutm Bio Pages promo (9:16 4K60, music only)
- **"Use real themes from the app."** When a product has a theme or design system in its frontend repo (e.g. linkutm `src/lib/bio/themes.ts`), port the preset table and its CSS-variable serialiser 1:1 into a `themes.js` for the composition. Don't invent lookalike palettes. Download every Google font the presets use as local woff2 (css2 API with a Chrome UA; keep only the `/* latin */` block) and inline the @font-face rules. Scale radii, borders and shadows to the page size in the film.
- **Inline-style gotcha:** font stacks like `"Sora", sans-serif` inside `style="..."` close the attribute early, so every property after them is lost (theme names turned invisible). Swap `"` for `'` before interpolating.
- **"Carousel effect for showing multiple themes."**
  - Full-page ring: `#ring` with `z:-R` + `rotationY`, children `rotateY(i*360/N) translateZ(R)`; front page sits at z=0, so it matches the live page pixel-for-pixel for a hard swap in and out. Turn one step per beat with `back.inOut(1.3)` + x motion blur, and scale the ring to 0.7 so the neighbours show.
  - Tile wall: two stacked 13-tile rings spinning in opposite directions from ±540°, decelerating with `power3.out`. Push the ring forward (container z = −R + 900) so the front tiles read big.
- **3D gotcha:** `backface-visibility` doesn't hide a preserve-3d element whose children have their own Z, so mirrored back pages bleed through. Toggle opacity per beat so only the front page and its two neighbours are drawn.
- Cloning DOM for a carousel: rename every id (`x_i`) or GSAP selectors hit all copies. Rewrite the page-scoped CSS to `:is(#x,[id^="x_"])`, strip inline styles GSAP already wrote (immediateRender fromTo), and never use template literals inside querySelector (the HyperFrames lint rejects them).
- Music-only master: loudnorm I=−10 TP=−2, then `alimiter=limit=0.79`. Plain loudnorm TP=−1 still hit 0.0 dBFS after AAC. Result: −11.2 LUFS / −1.3 dBTP.
## 2026-11-04 — linkutm Bio Pages v2: real app filmed from the frontend code (v1 trashed as "very generic")
- **"Show the real application from the code."** A run-locally recipe that works without touching the app code:
  - Unzip the frontend and run `next dev` unmodified, with `NEXT_PUBLIC_API_URL` pointed at a plain Node mock API.
  - Shape every response from `src/lib/**/types.ts` and `api.ts`, and log unknown routes to a file until it stays empty.
  - Get past `proxy.ts` with a fake auth cookie, an onboarding-done cookie and localStorage tokens.
  - Unlock every plan or feature flag, and point the public host at the real short domain (lnkutm.me).
  - Hide dev overlays (the Next "N" badge, React Query devtools) with injected CSS.
  - Fixtures use a fictional creator with no third-party embeds (no YouTube video).
  - Scripts live in `work\linkutm-bio-v2\capture` (start.ps1, mock-api.js, recorder.js).
- **Deterministic 60 fps UI recording:**
  - chrome-headless-shell with BeginFrame control, one screenshot per frame.
  - Drive the page over raw CDP and log the cursor per frame to JSON.
  - Pin the page timers to the frame clock, or charts stay blank.
  - **Pass `--force-device-scale-factor=<dpr>` at launch.** `Emulation.setDeviceMetricsOverride` DPR is ignored by BeginFrame screenshots, which came out 1600x1000 instead of 3200x2000 (soft at 4K). Always ffprobe the clip size.
- **Filmed-UI layout for 9:16 from a 16:10 recording:**
  - Show the same clip twice: an editor panel whose camera follows the smoothed cursor (EMA per frame, clamped to the frame), plus a fixed crop of the app's own live preview phone floating on top. The viewer sees each action AND its result.
  - Hand off between scenes by morphing that preview crop into the next scene's hero phone.
  - Speed clips with ffmpeg (`setpts=PTS/rate`), and pick the rate so repeated clicks land on beats (themes: 1.25 s apart at 2.5625x = 1 beat at 123 BPM).
- **HyperFrames gotchas:**
  - A `<video>` with data-start must not sit inside an element that also has data-start (lint `video_nested_in_timed_element`). Keep scene wrappers untimed and toggle their opacity on the timeline.
  - Every video needs an id, or it renders frozen.
  - A clip that ends before a handoff finishes shows a blank card: give clips a lead-in.
  - Registry component camera-scan-gate paints a dark stage over its target. Set `--bg/--surface/--border: transparent` on the host and hide `.csg-grid/.csg-target/.csg-ambient` so the real QR shows through.
  - The background render was reaped for low memory while the session was idle. Stop the dev and mock servers and render in the foreground with `--workers 3`.
- Story that replaced a "generic" feature reel: problem in the user's world (a DM flood of "link??") → the real product solving it, step by step → the real-world share moment (café flyer QR) → proof (Insights) → the same DM thread, now answered.
## 2026-11-05: linkutm Bio Pages, all 3 versions rejected and deleted
- The user rejected all three cuts, the last as "the worst video":
  - v1: HyperFrames motion graphics + theme carousels
  - v2: real-app recordings as flat panels on paper + CSS phones + headlines
  - v3: Kling/Veo golden-hour AI plates with the real UI tracked onto green-screen phones
- The technical recipes above still work (mock-API app capture, BeginFrame DPR flag, two-pass screen tracking with edge-line corners + notch-aware fitting + feature-homography under thumb occlusion). They are NOT an approved style.
- Lesson: after two misses on one video, stop proposing new directions. Ask what exactly looked bad, get a reference the user wants matched closely, and gate on a 5-second test before any full build.
- 720p AI plates (Kling free / Veo in the Gemini app) upscaled into a 4K frame read soft next to sharp UI. Don't promise a "better render" from free AI video tiers.
## 2026-11-05: linkutm Bio Pages v4 "One link." (APPROVED as final after 3 trashed versions)
- Process that won:
  1. The user asks for a script + skills + libraries.
  2. Propose them, take the redlines (no voice, no captions).
  3. Build ONLY a 6 s hook test at final quality.
  4. Approval, then the full build.
- Look: a white Apple studio with a real GLTF iPhone in Three.js inside HyperFrames.
  - Registry `vfx-iphone-device` ships models/iphone.glb; its mesh `front-glass` is the screen. Apply planar UVs, then a MeshBasicMaterial with a CanvasTexture, toneMapped false.
  - Repaint the materials: anodised aluminium → titanium 0x7d7a74, metal 1 / rough 0.24. Hide the `apple-logo*` meshes. Make lens bezels/barrels/plateau titanium (the stock model is orange).
  - Studio env = a gradient equirect with white softboxes AND dark flags, or the metal reads flat white.
  - Shadows: PCFSoft, a ShadowMaterial floor just under the phone, key light near-vertical.
- Screen = a 2D canvas you paint every frame (real screenshots via drawImage, a zip-open by drawing the two halves offset). Draw the black bezel + Dynamic Island yourself, and offset the page under the island.
- Render order bug: render from `tl.eventCallback("onUpdate", render)`, NOT from the first tween's onUpdate, or every frame draws the previous frame's state. Also register `window.__timelines` only after the GLTF and images load.
- Cards in front of the phone: MeshBasicMaterial with depthTest false and renderOrder 20, or they slice through the phone body. Use toneMapped false for true brand colours.
- Hook rule reconfirmed: the product must be on screen on frame 1, so start the drop already in frame. A lone shadow on the floor for 0.4 s was called a visual bug.

## 2026-11-18: linkutm glossary #9 CTR (final): cut the page's character out of the real art
- Glossary page = the world. The character was cut from the featured PNG, not redrawn:
  - alpha = clip((|pixel − medianBlur(41)+gauss bg| − 10)/38)
  - un-premultiply against the background to recover the true line colour
  - colour masks separate the cursor (light-blue hue 90–115) from his coral fingers and drop the title tail
  - export at 2x for 4K
- Glossary slugs don't always match the term (CTR = /glossary/ctr). Read the exact featured-image URL from the page.
- Verify the user's script against the primary source: Bowman 2009 says ONE team between two blues, not two teams.
- faster-whisper here: set CUDA_VISIBLE_DEVICES=-1 (cublas64_12.dll missing) or transcription crashes.
- GSAP: a later caption entrance (fromTo y) resets a y-slide on the same element. Schedule the slide after the entrance, and use a transform (y), never `top` (lint gsap_non_transform_motion).
- Captions in the top band (y≈170) after the hook keep the stage clear for props and the character bottom-right.

## 2026-11-18: linkutm "The crew that took all the credit" (GTA 6 moment, final): cinematic AI plates on a credit budget
- Approved, and the user praised the credit optimisation: 92.5 Higgsfield credits for a 40 s 4K60 reel.
- Plan first, then a ~10-credit hook test, then the full build. The user said "don't use this many credit" to the first plan (~965).
- Credit saving:
  - Seedream 5.0 Pro stills cost 2.5 each; Kling 3.0 Turbo 1080p 5 s clips cost 10. Seedance 2.5 (80 per clip) is only for when the user asks.
  - One take per shot.
  - Half the beats are stills with HUD motion (freeze-frames, "THAT WAS ME" bubbles, phones, results screen), not clips.
  - A shot with text on screens (burner phones) stays a still, so link labels sit exactly on the screens.
- Consistent cast: one 4-person line-up still is the character reference (`--image`) for every solo crew still and for the freeze-frame crops.
- Check every generated still for brand marks: a can read as Red Bull. Fix it with a Seedream edit ("change only the can…", 2.5 credits) before animating.
- Kling Turbo clips morph faces after ~3.4 s, so use only the clean section. Stretch it to length with RIFE slow-mo (rife-v4.6, `-n` target frames).
- Higgsfield CLI:
  - A PNG start image gave HTTP 520 on upload; JPG works.
  - Run batches with Start-Job and Wait-Job in the SAME call. A job started without waiting dies when the shell exits, and nothing is submitted.
- ElevenLabs:
  - `eleven_v3` + inline audio tags ([low, confident], [smirking], [slow, deadpan], [chuckles]) = the realistic expressive narrator the user asked for. Shared-library voice IDs work directly. "Obsidian" = acrqYoDVmcpJemOxjC39.
  - v3 reads slowly: tighten with silenceremove (stop_duration 0.35, keep 0.22) + atempo 1.1, then re-insert a dramatic pause at the punchline by splicing silence.
  - ElevenLabs Music can go silent before the requested length. Check the envelope, and ask for "no breakdowns, no silence".
  - /v1/sound-generation is good for custom SFX (record scratch, stamp, phone buzz, counter ticks).
- GSAP bug that cost three re-renders: `fromTo` with immediateRender (the default) applies its FROM at build time. A white #flash fromTo {opacity:0.35} placed at 5.9 s washed out every earlier frame. Later-positioned fromTo calls need `immediateRender: false`. If a plate looks milky, suspect an overlay before colour tags.
- Game-HUD look without IP: Bahnschrift (Windows system font, condensed via font-stretch), a HEAT meter not wanted stars, "JOB COMPLETE · CREW +1" not "mission passed", no game logo or font; "GTA 6" goes only in the post caption.
- Wait loops: `-notmatch "error"` matches "0 error(s)" and exits instantly. Use `-cnotmatch` on a unique success string.
- SPEED (the user asked why it took so long):
  - PyTorch Real-ESRGAN x4 to 8K and back took ~1 h (8–10 s/frame).
  - Next time: realesrgan-ncnn-vulkan or 2x, upscale each clip as it lands, submit every still and clip in one batch, check with `hyperframes snapshot --at …` before one 4K render.
  - Use the snapshot command: it caught overlay placement and the end-card vignette without a full render.
- End card: fade #vig and #grain out when the white CTA card comes in, or its edges go grey.

## 2026-11-19 — USER RULE: Higgsfield opt-in + credit usage in every plan
- Always ASK whether to use Higgsfield for the video (yes/no, per video). Default to Higgsfield-free options in the plan
  until the user says yes.
- Every plan includes a credits/cost block: tool → use → number of jobs (incl. retakes) → model → estimated credits
  (Higgsfield via `higgsfield generate cost …` on one representative job × count), plus ElevenLabs / Gemini usage, and a total.
  Say "estimate". Tools not used = 0 credits.


## 2026-11-25 — "looks like a PPT": every plan/prompt needs a NAMED motion spec
- Bio Pages promo v1 (built on the GPU machine from my plan) was judged "looks like a ppt" and the user asked why I wasn't
  using the motion we've learned. Cause: my plan described WHAT is on screen, not HOW it moves → default slide-in/hold/slide-out.
- Rule: every video plan and every build prompt includes (1) the motion references to read (snapcn-lessons §1/§6,
  prompt-motion-playbook, openmontage §3c) and the template files to reuse (one-hero-morph, one-camera-feed-world,
  crazy-motion-kit, keynote-iphone…), (2) a BEAT-BY-BEAT motion spec with named recipes (camera-as-world crane/whip +
  directional blur, screen-becomes-world, text-rewrite, physical entrances, object-driven transitions, speed ramp only on
  the drop, secondary motion on every hold), (3) hard rules: one continuous camera, nothing static > 1.2 s, no fades/slides/
  crossfades, (4) motion QA: animation-map dead zones + slideshow-risk < 2.5, and a short motion test before the full render.

## 2026-11-25 — AUDIT: why motion graphics "died" (shopfront 4K + Bio Pages 16:9 v1), and the fix
User: "motion graphics has completely become dead for the past few videos — check why." Root causes found:
1. **The skill told the builder to hold back.** SKILL §0 #3 (from the 2026-09 "less AI-ish" round) said: hard cuts by default,
   stylised transitions ≤1 in 5, no bouncy pops, no particle bursts. prompt-motion-lessons' ban list (camera shake, RGB split,
   shockwaves), craft-shortform ("hard cuts default"), openmontage (< 4 transition types), the launch-film brief and video-studio
   ("no shockwaves… soft fades") said the same. Later feedback said the opposite ("animate everything", "I want explosions",
   "looks like a PPT"), but that lived in the laptop's Claude memory, which the GPU machine never sees.
   → §0 #3 now bans the AI LOOK only; new **§0m Motion law** overrides every calmer line; the conflicting lines are marked SUPERSEDED.
2. **An unpushed lesson + a diverged repo.** The named-motion-spec lesson was committed on the laptop but never pushed; the copies were
   ahead 1 / behind 1. → §0 #1: pull + `git status -sb` before every job, push after every lesson.
3. **The motion kit was Remotion-only.** 18 `.tsx` examples vs 3 HyperFrames `.html`; the default engine is HyperFrames, so every build
   "ported loosely" and lost the moves. Even the detailed 10:14 motion-first prompt came back as the shopfront.
   → `templates/motion-kit/` (motion-kit.js + demo + spec example): zoomThrough (screen-becomes-world), whip/crane, cardFlip,
   foldInto, shatter, flyIntoLens, matchCut, drop, springIn, flipIn, stickers, dealCards, crunch, rewrite, typeOn, count, idle,
   push, parallax, glare, impact, shake. Rendered + verified on 2026-11-25.
4. **No blocking motion check.** qa.py only checked decode/loudness/safe zones; animation-map/slideshow-risk were prose.
   → `scripts/motion_qa.py` (frozen stretches, animation-map dead zones, spec design checks) runs from qa.py on every export.
5. **Pixel metrics can't judge motion design:** the "dead" shopfront moved MORE per frame than the approved GTA reel. The failure
   was design: kinetic text over static phones, slide/hold/slide, no story-specific set pieces. That's why the spec check (≥ 2 set
   pieces, ≥ 4 transition designs) and the motion test before the full render are mandatory.
HyperFrames gotchas hit while building the kit: never gate the build on requestAnimationFrame (capture never fires it → timeline
never registers → blank render); write `window.__timelines["main"] = tl` literally (static contract grep); a leading HTML comment
before `<!doctype>` fails the contract check; cloned DOM for shatter must keep ids or id-based CSS vanishes; render needs
ffprobe on PATH; animation-map needs HYPERFRAMES_SKILL_PKG_VERSION + HYPERFRAMES_SKILL_BOOTSTRAP_DEPS=1 (motion_qa sets them).

## 2026-11-23 — Thig reel 01 "Google thinks The Whole Truth is an online store" (brief → 16:9, krish clone)
- Brief facts drift: re-check every quoted meta tag live (urllib + a browser UA). Yoga Bar's title had gained " – Yoga Bars" → stop and ask; the user chose the LIVE text, so show the full live description too.
- krish clone on eleven_v3 reads ~2.1 w/s (60–66 s for a 125-word script). v3 ignores voice_settings.speed. What reached the 48 s cap without cutting words: energy-based pause tightening (breaths > 0.26 s → 0.20 s) that PROTECTS the script's "..." beats (find the word pairs in the whisper words, keep 0.48 s) + atempo 1.1. v3 beat v2 on pitch range (13–20 st vs 9 st).
- Captions from the SCRIPT, not whisper: char-level difflib alignment of script letters to whisper letters gives per-word times with script spelling ("Yoga Bar's", "homepage", "clean-label"). Chunk phrases at sentence punctuation / quote edges into balanced ≤5-word pieces (6 → 3+3) — no one-word orphans.
- Pen marks on text (circle, strike-throughs, highlighter) must be measured AFTER fonts load and with EVERY ancestor and card transform cleared (stage, camera, the card's own slide/rotate); a block element returns ONE rect — wrap multi-line text in an inline span to get one strike per line. Hide pen paths until they start (round caps leave a dot at dashoffset 100).
- USER VERDICTS: v1 code-built paper-desk 9:16 reel = "no good"; v2 with thig clips cropped to 9:16 = "still no good" (b: thig clips framing/timing, c: motion/pacing). What they asked for instead: landscape + "match the thig explainer v2 style". So for thig: 16:9 native thig clips full-frame (never crop thig to 9:16), scenes grow out of the prop thig dives through (stage scale 0.5→1 from the prop point + blur), per-scene camera tracks that glide to what is being spoken about, explainer light-up captions, 60 fps. Gate: 7 s opening test at final quality → "go" → full build.
- Thig clips in 9:16: a 1215-wide centre crop of a 16:9 clip cuts thig; even a 1360-tall window with feathered edges felt off. Ask about orientation before building a thig piece.

## 2026-11-24 — linkutm Link in Bio "Your page, alive." (9:16 4K60, music only) — hook test
- **Real-ESRGAN x4plus smooths away real texture** (satin weave turned painterly on a 100 % crop). For real footage/wallpapers that only need 1080→4K, use RIFE on the GPU for 24→60 fps and a Lanczos 2x + light unsharp. Keep ESRGAN for soft AI plates only, and always A/B a 100 % crop first.
- **ffmpeg `alimiter` auto-levels to 0 dBFS by default (`level=1`)**, so a "limit=0.68" master still peaked at +0.2 dBFS. Use `aresample=48000,alimiter=limit=0.84:level=0` after `loudnorm=I=-8:TP=-1` → −11.7 LUFS / −1.1 dBTP for a music-only reel.
- "Wallpaper worlds" engine: full-frame world <video> layers in an oversized wrapper OUTSIDE the shaken stage (shake on the world showed an 18 px edge), Three.js phone on an alpha canvas, the screen as a DOM layer homography-mapped (matrix3d) to the projected glass corners, and transitions as CSS clip-path polygons that start at the projected screen quad and grow past the frame (jagged = rip, sine edge = flood). Seek-safe: everything computed from tl.time() in one onUpdate render.
- Writing HTML through PowerShell Get-Content/Set-Content without -Encoding utf8 mangled "…" into "â€¦" — use [IO.File]::ReadAllText/WriteAllText with UTF8 or HTML entities.
- (same reel) "Make the iPhone more like iPhone": the registry vfx-iphone-device GLB is an iPhone 17 Pro-style aluminium unibody. Dress it as a REAL finish (Silver: alu 0xd4d5d6 metal 1 rough 0.3; frosted rear glass cutout 0xe9e9e6 rough 0.42 + clearcoat; lens glass 0x010204 envMapIntensity ~0.55 with light iridescence — brighter lenses read grey/fake; polished rings; antenna bands non-metal), use a studio env with bright softboxes AND dark flags, keep the true thin bezel (~20/1179 px) and island (372x108 at top 34), add a moving glass glare on the screen and a ShadowMaterial floor contact shadow. No shadow = "pasted on". Feather the page screenshot's top edge to kill the status-bar seam.
- User rule (Bio promo): NO moving backgrounds — plain light studio, still theme wallpapers; motion comes from the phone + FX.
- (Link in Bio promo v2, self-review fixes the user approved) Desktop UI panels shrunk into 9:16 are unreadable — crop each card to the ONE element that tells the story (countdown digits, start/end dates, the QR, one KPI tile with a live count-up, email rows dropping in) and show it ≥1.5x. Vary framing per section (macro close-up, low side angle, top-down, phone pushed off-frame) instead of "title + centred phone" every time. Replace confetti-triangle debris with glass shards on the drops only + light bloom/rings on small hits. Glow outlines locked to real UI must be measured per theme (text scale changes block positions). Real Hero/Banner header layouts can be captured via a mock-API header param for layout variety in theme swaps.
- (2026-11-24, user: "why is this taking so much time?") Python/OpenCV 4K compositing: NEVER GaussianBlur full-res 4K layers per frame (shadows/focus masks) — do soft shadows at 1/4 res and upscale (5x faster, same look); cache per-shot masks; time 5 stills before launching a full render; prefer torch-on-GPU warps for 4K60 camera layers; split into parallel segments.
- (2026-11-24) After 3 rejected new styles for the same product, the user picked 'like the approved v4'. Rule: when a product already has an APPROVED promo, the default for a refresh is the approved film's exact structure + audio with updated real assets — offer that FIRST before inventing a new style.
- (2026-11-25, linkutm Bio Pages 16:9) The user's own polish notes: triptychs of the same image read as a cheap tiled repeat, so use a full-bleed pre-blurred world (DOF) behind a sharp phone. Whips must carry BOTH worlds on one move (never a blurred phone on white). Never crop the device (80 px margin). End cards must stay alive (drifting content behind a frosted plate), 2.5 s max. QA: no frame over 40 % plain white outside the end card.
- (2026-11-25) 'More animation + better text + velocity effects' = a per-letter kinetic type engine (mask-rise, skewY, blur-in, 2 outline echo clones lagging 70/140 ms, directional velocity exits), mixed transition types with expo slow-FAST-slow ramps + blur + RGB split scaled by sin(pi*u) velocity, kick-decay pulses on bg/phone/type, light sweeps. A zoom-through must punch IN (next world 1.35 to 1 under the outgoing world blowing past), never scale the next world up from small (reads as picture-in-picture). Keep the type layer above end-card layers.

## 2026-11-25: one-shot launch reel from a written brief (9:16 4K60, story + real UI + AI plates)
- **Real product UI without screenshots:** run the app's own renderer locally against a mock API, then serialize the live DOM into the film (shadow roots per page). Grab the ORIGINAL CSS source (style tags + same-origin sheets), never CSSOM `cssText`: Chrome drops `background: var(--x)` shorthands to empty longhands, so theme backgrounds vanish. Hoist @font-face to the document; fetch cross-origin Google Fonts CSS separately; fix relative font URLs when the CSS lives in a subfolder.
- **Re-target responsive CSS to the phone, not the 1080/2160 film document:** evaluate width media queries against 430x932 (unwrap true, drop false), convert vh/vw to px, swap `html/body/:root` selectors for wrapper classes, make wrapper backgrounds transparent (negative z-index wallpapers sit behind them otherwise). Use constructable stylesheets so a dozen mounts share one parsed sheet.
- **Scroll a mounted page without moving its fixed wallpaper:** transform an OUTER wrapper, scroll the inner host (scrollTop); fixed layers then stay put like a real phone.
- **Video/map embeds in captured pages = third-party branding.** Replace iframes with placeholders at capture and fill them with an original thumbnail / drawn map.
- **App micro-animations are seek-safe via CSS:** keep the app's own keyframes, set `animation-play-state: paused` and drive `animation-delay: -(t mod dur)` from the timeline. Phase-align each loop so its active window lands when the camera arrives.
- **Measure hidden elements only while displayed:** rects of `display:none` subtrees are 0 (broke list scrolling and row highlights). Toggle display during build, measure, hide.
- **Plates vs layered backgrounds:** a full-frame studio/cream layer above the plates hides a plate that is "sliding in" — end the studio range at the exact handoff frame, and overlap exit/entry moves so no frame is empty.
- **ESRGAN general-x4v3 still waxes skin at 100%:** a 40/60 blend with Lanczos + light unsharp kept real texture and 4K edges.
- **Kling/AI clips are short:** plan each plate's duration against the VO beat it covers (re-render parallax plates longer instead of freezing).
- **Music edit to land a drop on a word:** fit the grid from motif matches across 32 beats (median kick intervals drifted 60 ms over 8 bars); cut on bars, loop 8 post-drop bars to extend, align the drop transient to the VO onset in ms. Whisper merges spoken numbers ("a hundred and eighty" -> "180"): find word onsets from the waveform.
- **QA loop that caught every glitch:** snapshot sets at transitions + a 1080p/30 draft sampled at 2 fps into contact sheets before the one 4K render.

## 2026-11-26: linkutm Bio Pages 16:9 promo v2 (4K60, music only, user's GPU prompt, motion-kit + Three.js render engine)
- **Never `tl.seek()` forward and back AFTER motion-kit `fromTo` tweens exist.** A build-time measuring seek (to read a span's position at t=13 s) left the hook's two `MK.crunch` words invisible in the REAL render, while `hyperframes snapshot` looked fine. Do every measuring seek before the first MK tween is created, or measure from layout offsets (`offsetLeft/Top`) instead. Lesson for QA: verify on frames pulled from the rendered MP4, not only snapshots.
- **HyperFrames forces `visibility: visible` on active `.clip` videos**, so a world/phone-screen video showed through a hidden parent (orange rectangle behind later scenes). Toggle `display` on clip videos and on any container that holds them; and make a `vis()` helper set `visibility: inherit` (never `visible`) so a hidden parent group always wins.
- **motion_qa's MK.finish check greps index.html only**: when the build lives in film.js, call `MK.finish(tl)` from an inline registration hook in index.html (then confirm `hyperframes validate` shows 0 errors, since MK.finish reports problems with console.error).
- **Truth check before writing a feature beat:** a component that exists in the repo is not a shipped feature. The Bio import dialog was defined but mounted nowhere, so "Moving from Linktree? One click." was swapped for the real per-block Redirect countdown (block card, cursor press, banner, live seconds ticking). Grep for the component's mount site, and read the product label from the app's nav ("Bio Pages") before naming the product.
- **Editor dialogs serialized with `max-height:none` lose their own scroll container**; pan the dialog content inside the clipped card (translateY on the shadow root's first child) to bring each target row into view, and launch the flying card from the row's panned position.
- **Landscape worlds from portrait wallpapers:** crop a 1080x608 band around the subject, Real-ESRGAN realesr-general-x4v3 (about 1 s/frame on the 3060, so video wallpapers go frame by frame), then Depth-Anything-V2 parallax at 3840x2160/60 for photos (base overscan 1.03, <= 2.5 % travel). 100 % crops stayed clean on photographic wallpapers.
- **Drop on the reveal without new music:** cut exactly one bar (4 kicks) before the riser. The kick grid stays uniform, so every anchor in the film keeps K(n).
- **A 1080p60 GPU draft of a Three.js + DOM film rendered in about 2 min (3 workers, hardware WebGL)**, so a full draft is cheaper than a range-limited motion test; cut the 0-15 s test from it.

## 2026-11-26: REVIEW of Bio Pages 16:9 v2 (laptop side, frame by frame + motion gate). Verdict 8/10, up from 6/10
What made the jump (keep doing this for every SaaS feature promo; this film is now the benchmark):
- The brief → Motion law → motion kit → gate chain works. v1 (frozen first 1.5 s, the same phone-left/triptych-right layout 6×,
  blur dissolves, product never named, 5.5 s static end card) became: frame 0 moving, shatter from the hook, 5 creator worlds
  with 5 DIFFERENT transitions (whip, dive through the phone's buttons, blurred crane, phone-as-card turn, dot into the lens),
  the product named on the music drop, 4 real features on razor-sharp real UI (41-looks wall, block picker, Redirect countdown,
  Insights map), page → QR fold → café card → story sticker, CTA pressed on a landed phone, no end card. 4K60, −9.1 LUFS, TP −1.3.
- Structure that sold it: Hook → Problem → REVEAL on the drop → 4 concrete features → payoff → CTA (snapcn anatomy).
What still cost 2 points (now rules in SKILL §0m.10; the first three are motion_qa warnings):
1. The hook second was the calmest second of the film (activity 0.0016) → motion_qa warns "second 0 nearly still".
2. Insights went still for ~2 s after the counters finished (23–25 s) → motion_qa warns on near-still runs ≥ 2 s.
3. A white flash/void frame at the reveal → motion_qa warns on frames > 40 % plain white (outside the last 2.5 s).
4. Headline type touched the phone ("Redirect.") and ran under the QR card ("you.") → keep ≥ 60 px clearance from the
   product layer; check bbox overlap per beat in snapshots.
5. A strip of the previous page showed down the phone's left edge during an in-screen page swap → clip swaps to the screen mask.
6. "Music. Video. Shop." while the EMAIL icon flew in → drive each word and its item from the same anchor.
7. The block toolbar showed the Geo icon (not on any plan) → mask/crop controls that aren't shipped.
8. 333 MB at 90 Mbps for 30 s → qa.py now warns > 60 Mbps; always add a posting copy.
Brief-writing lesson (mine): the laptop's frontend copy was outdated, and I listed "Import from Linktree" from the brand file. The
GPU session found the dialog isn't mounted anywhere and swapped in Redirect. Briefs written away from the latest repo must
mark every feature "verify it's mounted" and say which real feature to fall back to.
Kit/QA fixes made from the GPU machine's v2 lessons: zoomThrough no longer seeks the timeline (pass o.rect instead);
README warns about tl.seek and .clip video visibility; motion_qa scans every .html/.js for MK.finish and warns on build-time tl.seek.

## 2026-11-26: linkutm Bio Pages product tour from the founder's own screen recording (16:9, 58 s, bold captions)
Input: a 2:31 Screen-Studio-style export (2592×1532, 60 fps, face-cam bubble burned in, browser bar visible), the founder
ad-libbing from my script. Delivered as a 58 s cut built only from his lines.
- **Cutting a founder's ad-lib:** take word timings (faster-whisper small, word_timestamps), choose each kept line by
  its FIRST word and the NEXT word after it: start = first.s − 0.06, end = next.s − 0.03. **Don't snap cuts to energy
  minima**: ±0.12 s snapping clipped word edges ("tap", "pages", "interesting", "designs", "Claim"). Then re-transcribe
  the cut track and diff it against the intended lines before building anything.
- faster-whisper + av ≥ 16 → `open() got an unexpected keyword argument 'metadata_errors'`: decode the wav yourself and
  pass the numpy array to `model.transcribe()`.
- **Blurry face-cam:** the user asked for graphics instead of his face on the hook. Hook/problem/reveal/CTA = HyperFrames
  graphics (profile phone → fold → "Looks like you." page → card-flip to a grey "Boring lists." phone → shatter →
  Bio Pages reveal); the recording grows out of the phone screen (clip-path inset from the screen rect to full) and
  shrinks back into the CTA phone at the end.
- **J-cuts with a burned-in face bubble:** when a line's audio comes from a different moment than the screen shown, frame
  the camera window to EXCLUDE the bubble, or the lips visibly don't match.
- **Scan the recording for personal/system UI:** a Chrome right-click menu flashed for 0.6 s mid-tour. Step through the
  kept video ranges at 4 fps and re-cut around it. Crop the browser bar (URL, bookmarks, extensions) always.
- Camera = per-clip `transform` on a 2592-wide `<video class="clip">` from window A→B (sine.inOut) = continuous secondary
  motion; keep window widths ≥ 1400 source px so 1080p output never upscales UI text. Chips (handle, block count,
  theme count, domain) explain while the camera moves; numbers verified in the app (the theme filter shows "All 41").
- motion-kit bug found and fixed: `MK.rewrite` forced `position:relative` on absolutely positioned headlines.
- Laptop render: auto workers got the job killed for low memory (18 large clips at 60 fps). `-w 2` finished in ~6 min.
- Mix: voice chain + music bed −19 dB with sidechain duck + synthesized whooshes (filtered pink noise) on transitions + a
  low thump on the shatter → −13.0 LUFS / −1.1 dBTP. qa.py + motion_qa PASS (0 frozen, 0 dead zones, 9 transition designs).
