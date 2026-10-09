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
