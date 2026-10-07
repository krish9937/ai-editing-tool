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
- Client brand promo (JewelleryOS, 2026-10-06): pull the exact brand from the site (CSS hex counts, @font-face
  families, /logo.svg, og:image + product images) and rebuild their UI in their tokens; dark brand photo for the
  problem act → their light UI world after the drop.
- "Visuals very bad" on a flat-UI promo (JewelleryOS v1) → what fixed it: (1) understand the product first (read every
  product page; show its REAL features/labels/figures), (2) a real-time 3D hero object (three.js via @remotion/three:
  procedural ring + RoomEnvironment reflections, render with --gl=angle; one WebGL canvas at a time; dpr 1.5),
  (3) dark cinematic stage + glass panels in CSS 3D perspective with slow camera moves, (4) light sweeps, sparkles,
  gold dust, kinetic word hits on spoken numbers. Flat cards on a pastel background read as "bad".
- "No excitement" → eleven_v3 stability 0.0 with [excited]/[dramatic]/[thrilled] tags + exclamation marks + CAPS on
  the hit words; faster read (47.9 s vs 50.5 s).
- "Visuals bland → use fluid animations" (JewelleryOS, 2026-10-06): one liquid thread that morphs between scenes
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
