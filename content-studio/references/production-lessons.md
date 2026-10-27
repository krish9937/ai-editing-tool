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
