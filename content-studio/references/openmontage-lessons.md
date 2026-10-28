# OpenMontage lessons (studied 2026-10-28)

Source: **OpenMontage, AGPLv3, github.com/calesthio/OpenMontage**. Studied from a local copy, which was deleted
after this distillation to save space. Re-download from GitHub if a specific skill file is needed again.
Everything below is rewritten in our own words. We copy ideas and numbers, not code or text.
Because the project is AGPLv3, don't vendor its code into our repos. Re-implement anything we want.

---

## 1. What OpenMontage is

- An agent-driven video production system. Markdown "director skills" tell an LLM how to run 12 pipelines: explainer, screen-demo, clip-factory, documentary-montage, cinematic, talking-head, podcast-repurpose, avatar, localization and others.
- Every pipeline runs the same stages: research → proposal → script → scene_plan → assets → edit → compose → publish. Each stage ends in a JSON artifact, a self-review and a human approval gate.
- It renders through Remotion, HyperFrames or FFmpeg, and has 100+ tool wrappers (TTS, image/video generation, stock search, CLIP retrieval, scene detect, reframing).
- The craft knowledge is in `skills/creative/*`, `skills/meta/*` and `skills/pipelines/*`. The tools are in `tools/`.

---

## 2. Overlap table: where we already agree

| OpenMontage does | Our equivalent |
|---|---|
| HyperFrames is the default for kinetic type, promos, launches and website-to-video. Remotion is kept for karaoke captions and avatars | Same split. HyperFrames by default, Remotion only when needed because of the licence |
| "Atelier" mode for hero work: hand-author every piece, never reuse creative components, run a "could this be any other product's video?" distinctness review | "Fresh, modern edits every reel", "no AI-look renders", a new caption style for every video |
| Taste profile: a design read, an anti-pattern list, banned generic purple gradients | Prompt Motion brief skeleton plus our ban list (glows, particles, shake, purple blobs) |
| A signature device that is scarce and appears in only 1–2 beats | Prompt Motion "hero element that morphs" |
| Contact sheet before render (`hyperframes snapshot --at`, one still per scene) and an assets gate before any draft render | 6–10 key stills before a full render |
| `lint` → `validate` (WCAG contrast) → render → probe → sample frames → transcribe the render | lint/check, decode-verify frames, peak/LUFS check |
| `hyperframes beats` to land scenes on real drops | BPM/energy measurement, drop spliced onto the turning point |
| Sidechain ducking, −14 LUFS, true peak −1 dBTP | mix.py with sidechain at −14 LUFS |
| Whisper word timestamps drive captions | faster-whisper medium.en word timestamps |
| Voice direction: a performance plan, a pause policy and a sample gate before batch | Gemini Leda AUDIO PROFILE / SCENE / DIRECTOR'S NOTES, whole script in one request |
| "Brand/product videos must inspect the real product surface" | Capture the real site and rebuild real components |
| Never AI-generate exact text (CTA, names, numbers). Render it natively | Real UI forms, verified claims, example data labelled |
| Every claim traceable to research. No invented stats | Verify every claim, real cited cases |
| Hook in frame 1: no logo, no "hey guys", voice starts at once | "Hooks: spoken + catchy in the first second", no outro cards |
| Wide/close/re-establish zoom logic for screen demos | Crane transitions, iPhone frames, real UI |
| Decision Communication Contract: announce provider/model, ask before major swaps | "Ask theme first; act like a pro editor", consult before generating |
| Pixabay/Pexels stock with provenance | Pixabay API (photos/videos). Pexels not set up yet |

---

## 3. New techniques worth adopting

### 3a. Story and script

1. **Word budget is law.** Target narration at **85–90 % of video length**. Use 2.0–2.5 words/s for calm or documentary delivery and 2.5–3.0 words/s for energetic delivery. As a check: 15 s ≈ 35–40 words, 30 s ≈ 70–80, 60 s ≈ 125–150. If you are 20 %+ over, cut. Don't speed the voice up.
2. **Per-scene word budgets.** Allocate words in proportion to scene length (5 s ≈ 10–12 words). Leave **0.5–1 s of silence at major scene changes** so the visual can land.
3. **"But / therefore", never "and then"** between beats (the South Park rule). Every section should either complicate the last one or follow from it.
4. **Misconception first.** Open with what the viewer thinks is true, then overturn it. Derek Muller's research found higher learning gains than presenting correct facts straight. This fits our "dark problem world → bright fix world" arc.
5. **Hook archetypes** to pick from on purpose: contrarian, outcome ("by the end you'll…"), mystery ("In 1987…"), stakes ("this one mistake costs…"), result-first.
6. **Describe the visual cause, not the emotion (anti-subjective rule).** Never write "epic reveal" or "moody" in a beat sheet. Write the pixels instead: "wide pull-back, product silhouetted, music drops out at 0:12 for 1.5 s". Their finding is that mood adjectives route to a different visual every time. Ban the word "cinematic" in briefs and name the actual choices.
7. **Name subject transitions** in the beat sheet: *revealing*, *disappearing*, *switching*, *complex-alternating*. Add one line saying how it happens (cut, pan, reveal-by-light). This makes our crane and morph handoffs explicit at script time.
8. **Camera intent line per beat.** One concrete line ("medium shot of phone, slow push-in, deep focus") and no adjectives.
9. **Mayer's principles:** at most one new concept per 30–45 s; a verbal signpost every 30–45 s in longer pieces; narration and visual **simultaneous**, because learning drops about 30 % when they are offset by seconds; cut "seductive details", which cost 20–30 % recall; **spoken words + picture beat written words + picture** (keep on-screen text to labels and numbers).
10. **Deliberate silence of 1–3 s after the key insight.** In cinematic pieces, drop the music for 3–5 s at the reveal. Use one held silence per piece, and use it hard.
11. **Short-form structure templates.** These are useful as starting grids:
    - 15 s: hook 0–1 → context 1–3 → content 3–12 → payoff/CTA 12–15
    - 30 s: hook 0–1 → problem 1–5 → solution 5–22 (a visual change every 2–3 s) → result 22–28 → CTA 28–30
    - 60 s: result-first 0–2 → "X in N steps" 2–8 → 3–5 steps of ~8 s → before/after 45–55 → CTA plus a **loop back to the opening frame** 55–60
12. **Standalone test for any clip.** Reject clips with unresolved pronouns, references to earlier context, long lead-ins, or endings that stop before the payoff.
13. **Screen-demo narration** describes intent and effect, never cursor motion ("now we paste the token so the API trusts us", not "I click here"). Each section is one real user step.
14. **Pronunciation map** for brand terms and acronyms ("UTM" → "you-tee-em", "linkutm"). Put it in the TTS prompt.

### 3b. Visuals and composition

1. **Three taste dials (1–10)** decided before concepts: `visual_variance`, `motion_intensity`, `information_density`. Write them into every plan. High motion with low information means short kinetic beats. Low motion with high information means stable frames and long readable holds. High variance needs stronger anchors such as recurring type, palette or a sound motif.
2. **No hero-component spine.** Each scene needs a *different primary visual subject* from the one before it. If the same phone frame or the same card sits under every beat with only the text changing, it is "branded slides, not a film". Test: remove the signature device from a scene. If the scene still works, the device didn't belong there.
3. **Per-scene inventory before building:** primary subject · why this beat exists · how it differs from its neighbours (composition, scale, motion register, palette emphasis, type treatment).
4. **Slideshow-risk score (0–5 each, average ≥ 3 = revise, ≥ 4 = fail).** Dimensions: repetition (>70 % same scene type or >60 % same shot size), decorative visuals (no stated purpose), unjustified motion, missing shot intent, typography over-reliance (>40 % text cards = warning, >60 % = fail), and "cinematic" claims without hero moments. Run it on our storyboard.
5. **Variety rules:** no more than 3 consecutive scenes of the same type; at least 3 scene types per video; alternate high-information beats with breathing beats.
6. **List overlays separately.** In shot specs, list titles, captions, HUDs and chips on their own layer. Never describe them as "foreground", because depth is for the scene itself.
7. **Data viz in video:** 3–9 points per chart (bars 5–7, pie 3–5 slices, KPI grid 3–6). Under 3 points, use a single stat moment instead. Build 2–4 s, then **hold 3–5 s fully built** before cutting. Stagger bars by 0.1 s, left to right. Narrative highlight: everything at 30 % opacity and the narrated item at full colour plus a 1.05× scale. Bar y-axis always starts at 0. No 3D charts. Round aggressively ($1,234,567 → $1.2M). Show a source line. Minimum sizes at 1080p: title 32 px, axis/value labels 24 px, annotations 20 px, source 16 px. **Double these at 4K.**
8. **Screen-demo zoom levels:** code/terminal 1.5–2.2×, small button 2.0–3.0× (keep padding so the viewer knows where it lives), modal 1.4–2.0× (whole modal), full page 1.0–1.3×. Zoom transition 0.6–0.8 s ease-in-out. **Hold at least 3 s before the next pan.** Re-establish wide between major steps. **At most 2 attention cues at once**. Show a cue just before the action and remove it right after. Use highlight *or* zoom, rarely both.
9. **Cursor craft (for our filmed-UI pieces):** a 1.5–2× cursor, a click ripple, a 0.5 s pause on the target before the click, no circling.
10. **Footage under text:** use `brightness(0.55) saturate(0.85)` on the video, a local scrim sized to the text block (`rgba(7,7,12,0.5)` gradient), and a soft text halo shadow. Don't lower video opacity, because it muddies both layers.
11. **Grading recipes (FFmpeg)**, in chain order: normalize → colortemperature → colorbalance → curves → eq → LUT last. LUT at **0.6–0.85 strength** through a split/blend. Move a parameter by at most ±0.05 at a time. Keep saturation ≤ 1.2 when there are people. Check skin on one frame before the full grade, and use one profile for the whole video. Cool/technical recipe (fits our no-warm rule): `colorbalance=rs=-0.03:gs=-0.01:bs=0.06:rh=-0.02:gh=0.01:bh=0.04,eq=contrast=1.06:saturation=0.95`. High energy: `curves=all='0/0 0.15/0.08 0.5/0.52 0.85/0.92 1/1',eq=contrast=1.15:saturation=1.2`. Generated or animated plates get a lighter grade (0.5–0.6). **Skip their "cinematic_warm" and teal-orange defaults (our no-yellow-tint rule).**
12. **Colour-blind-safe accent set (Wong palette)** for charts and diagrams when the brand palette lacks contrast: #E69F00, #56B4E9, #009E73, #F0E442, #0072B2, #D55E00, #CC79A7. Never use red/green as the only signal. Add labels or patterns as well.
13. **Colour count discipline** (from their playbooks): at most 3–4 colours on screen including the background; premium minimal at most 2 accents; one focal claim per frame.

### 3c. Motion and editing

1. **Easing table** (text entrances default to easeOutCubic `(0.33,1,0.68,1)`): kinetic type easeOutQuart `(0.25,1,0.5,1)`, position moves easeInOutQuad, scale/opacity easeInOutCubic, exits easeInCubic `(0.32,0,0.67,0)`. Never linear on text. Use **at least 3 different easings across a piece**, and compose 2–4 atomic motion rules per beat.
2. **Animation durations:** opacity 0.3–0.5 s; slide/scale entrance 0.5–1.0 s; kinetic entrance 1.0–2.0 s; exits faster than entrances.
3. **Hold-time maths:** after a text animation completes, hold **1 s per 13 characters** (30 chars ≈ 2.3 s). Title cards hold 3–6 s. Short-form text blocks 2–4 s. No static frame over 3 s in short-form.
4. **Pacing numbers:** short-form gets a visual change every 1–3 s (20–40 cuts/min). Pattern interrupts every 2–4 s gave 58 % average retention versus 41 % for a static talking head. Explainers get a new visual element every 3–5 s and an enhancement cue at least every 8–10 s.
5. **Breathing rhythm:** never use the same shot length 3 times in a row. Vary long → medium → short → short → LONG.
6. **Hold tables by tone** (montage and b-roll stretches): elegiac 4.0 s (2.5–7), reverent 3.5 s, dreamlike 3.0 s, wry 2.0 s (1–4), urgent 1.2 s (0.5–2.5). Hero shots get the max hold. Compress cutaways first and never cut heroes short to fit duration.
7. **Trim real clips to their best sub-window.** A 12 s stock clip usually holds one 3 s moment. **Cut before the action ends** (end on a look, not a move-off). Leave 4–6 frames of handle. **Never freeze the last frame.** It reads as a technical error.
8. **Adjacent-pair check:** same subject at the same scale → swap one for a different scale. Same palette → break the run at least every 4 cuts. Same motion direction twice → flip or reorder.
9. **Make the last image a strong one.** The final 5–10 s is remembered disproportionately, so move your strongest shot there if needed.
10. **L-cuts weld shots together.** Carry the outgoing ambience or audio 0.5–1.5 s under the incoming shot on the 3–4 hardest transitions. A J-cut leads with the next shot's audio by 0.3–0.5 s.
11. **Jump-cut mask:** a 1.0 → 1.02× micro zoom shift at each cut in screen or talking footage.
12. **Speed plan for screen/UI footage:** key click or result 0.75–1.0×; routine typing or navigation 1.5–2×; installs/builds 3–6× or cut. Never put a proof moment inside a sped-up stretch. Mute or duck the noise in sped-up sections.
13. **Restraint in transitions:** fewer than 4 transition types per piece, and not 3 different ones in the first 15 s. If it's boring, fix the shots or the pacing instead of adding flash.
14. **Ken-Burns check for references:** their analyzer uses optical-flow variance to classify each scene as `static_image`, `animated_still` (uniform pan/zoom on a still) or `motion_clip`. Never guess whether a reference is real motion or a moving still.

### 3d. Typography and captions

1. **Vertical caption cues: 3–4 words max, ~20 characters per line**, and 2 lines max. Five or more words make blocks that cover the face. Horizontal: 6–8 words, 42 characters.
2. **Cue timing:** start on the word onset (never before), end about 200 ms after the last word, min 0.5–1 s, max 5–7 s, a 2-frame gap between cues, sync tolerance ±3 frames.
3. **Caption vs on-screen text is a once-per-piece decision.** If a headline already shows the line the voice is saying, don't caption the same words. Decide whether captions carry *added meaning* (numbers, names) or are accessibility subtitles, and don't do both for the same line. (They treat this as CRITICAL.)
4. **Sizes at 1080p:** titles 60–90 px, body 40–60 px, captions 42 px or more, lower-third name 48–60 / role 36–44, nothing below 40 px. **At our 4K, double everything** (titles 120–180, body 80–120, captions 84+). Title must be at least 50 % larger than body. Use 1–2 font families, line height 1.3×, contrast ≥ 4.5:1 (aim for 7:1).
5. **9:16 safe zones (1080×1920):** TikTok top 108 / bottom 320 / right 120; IG Reels top 210 / bottom 310 / right 84; Shorts top 120 / bottom 300 / right 96. **Universal safe box is 900×1400 centred.** Put non-caption hook text in the **top 40 %** of the safe box, 3–5 words per block, with a 0.2–0.3 s entrance.
6. **Reading speed:** 13–21 characters/s depending on source. Use 15 characters/s as the comfortable vertical default.
7. **HyperFrames font gotcha:** the deterministic-font compiler only inlines mapped fonts. Space Grotesk silently falls back to Arial. Safe choices: Outfit, Inter, Montserrat, Poppins, Playfair Display, JetBrains Mono. Check the compiler warning on every new font.
8. **ASS burn-in gotchas** (when we burn with FFmpeg): colours are `&HAABBGGRR` (8 characters, e.g. `&H00FFFFFF`); keep MarginV under ~100 px; a 3 px outline plus 2 px shadow for vertical.

### 3e. Audio: voice, music and SFX

1. **Voice performance contract.** Every script gets a top-level plan (performance intent, pacing profile, energy curve, pause policy) and, per section, **at least two concrete cues** from pace, energy, emphasis words, pause before/after (in seconds), a delivery note, or provider text with punctuation/breaks. "Read naturally" or "expressive" alone counts as a failure. **One delivery idea per section.** If a section needs three emotional turns, split it. Feed this straight into Leda's DIRECTOR'S NOTES.
2. **Sample from the hardest section, not the first.** Approve voice, pace, pauses and emphasis on the most performance-sensitive line before the full take. Changing the voice or model after approval means a new sample.
3. **Pause grammar:** a short pause after setup lines, a longer pause before reversals or big claims, and silence before the final takeaway. Too many breaks sounds theatrical.
4. **AI-TTS cleanup chain** (good for Leda before mix.py): HPF 80–100 Hz → cut ~500 Hz (mud) → +2–3 dB at 2–5 kHz (presence) → gentle cut at 6–8 kHz (sibilance) → compressor 3:1, attack 1–5 ms, release 10–20 ms (30 ms if it pumps), threshold about −26 dB for 4–6 dB of gain reduction → de-esser at 6–8 kHz → limiter at −1.5 dBTP. For a thin AI voice, optionally boost 120–250 Hz. Watch for a 4–6 kHz artifact and use a narrow notch if it's there.
5. **Carve the music bed:** **cut 2–4 kHz on the music** to clear the speech-intelligibility band. Avoid tracks with bright hi-hats or vocals under VO. Instrumental only under narration.
6. **Ducking numbers:** music 18–20 dB below dialogue (the W3C accessibility guideline asks for 20 dB). Duck 6–12 dB while VO is active, up to 22 dB for dense educational passages. BBC tip: take the music a further 4 dB below where it sounds right. Tune in 1 dB steps. Their envelope: threshold −3/−4 dB, reduction −8 dB, **attack 200 ms, release 500 ms**. Music fade-in 1–2 s, fade-out 3–5 s.
7. **Stem levels to aim for:** VO −16 LUFS, music under VO −28 to −24 LUFS, SFX about −20 LUFS, music-only −14. (Our louder music-only master at −10 stays, because it's user-approved.) Short-form music −22 to −26 dB under VO.
8. **SFX timing:** start a whoosh **10–20 ms before** the visual change, so the whoosh's energy peak hits the moment of greatest visual change. Whoosh 400–500 ms; click/tap < 100 ms at −20 to −15 dB; impact < 300 ms at −12 to −6 dB; riser 1–3 s into a reveal. Nudge in 1-frame steps. Stack whooshes in different frequency bands. (Our peak-alignment method already does this. Add the 10–20 ms lead.) Their "pop/pluck" for text conflicts with our no-ping rule, so keep our real clicks.
9. **Four-layer cinematic audio:** VO (−12 dB peak), music (−24 to −18), **ambience/room tone (−30 to −24, e.g. −35 hum)**, foley/SFX (−18 to −12). An ambient bed gives "presence" in VO pauses. We don't use one yet. Try it in the dark "problem world" scenes.
10. **Music picking:** BPM by type: explainer 90–110, upbeat promo 110–130, high-energy demo 120–140, calm 60–80. Prefer dynamically even beds under VO, and save drops for music-led pieces. Use one track per video unless the story turns.
11. **Best-window music offset:** measure momentary loudness every 100 ms (`ebur128`) and skip the quiet intro by starting where loudness first crosses about −40 LUFS. For a 30 s piece from a 3-minute track, pick the peak-energy window. This complements our drop splice.
12. **Splice and stitch hygiene:** 5 ms micro-fades or zero-crossing cuts at every audio edit; when one track ends and another starts, crossfade music 1–2 s centred on the cut; normalise clips before concatenation.
13. **Test on phone speakers.** If the VO disappears, push 2–4 kHz on the voice and duck harder.

### 3f. Reference-video analysis (when the user sends "make it like this")

1. **Tooling (all free/local):** yt-dlp download → YouTube captions or faster-whisper → PySceneDetect cuts → about 20 keyframes → optical-flow motion class per scene → *we look at the keyframes ourselves*.
2. **Report with the 5-aspect breakdown per shot**, keeping the labels:
   - **Subject**: type, count, attributes, transitions (revealing/disappearing/switching).
   - **Subject motion**: actions in order.
   - **Scene**: overlays listed *separately* · POV (drone, OTS, macro, top-down, handheld, locked-off) · setting · time of day.
   - **Spatial framing**: shot size, position, depth layers and how they change.
   - **Camera**: speed (real/slow-mo/timelapse) → lens → height → angle → focus/DoF → steadiness → movement.
   - Mark anything that doesn't apply as **N/A explicitly**, because silent omission is the most common failure.
3. Add: **what makes it work** (2–3 specifics: hook technique, pacing, transitions, narration style), dominant palette, type style, transition patterns and the motion class mix.
4. **Never carbon-copy.** Each concept must change at least one axis: same structure with a different subject, same subject from a new angle, same tone with a new visual treatment, a platform re-cut, or a counter-take. Present 2–3 variants and recommend one.
5. **Promise preservation:** write down what the user says they love (pacing, hook style) and check it survives every later stage.
6. **Lightweight research pass (2–3 min):** look at 3–5 similar videos for what's overdone, then gather 3–5 hard facts.
7. **Sample first:** a 10–15 s sample (hook plus one middle scene, real voice, real visuals, music snippet and caption style) before the full build. This is our draft-with-audio check, made standard.

### 3g. QA and review gates

1. **Critique rules (from the CHAI study they cite).** Each finding is *accurate* (points to a timestamp, frame or file), *complete* (after finding one issue, scan for others of the same class) and *constructive* (a critical finding must carry a concrete fix, or it gets downgraded to "investigation").
2. **Severity ladder:** critical / suggestion / nitpick / investigation. **At most 2 revise rounds**, then ship with warnings noted. Allow at most 1 send-back per stage pair and 3 in total.
3. **Post-render checklist (all steps, no skipping):**
   - (a) Probe: the video *and* audio streams exist, duration is within ±5 %, file size is sane.
   - (b) Frames at every scene midpoint.
   - (c) **Transcribe the rendered file.** 0 words means the audio is missing. Under 80 % of the script means it's cut off. Compare the last word spoken with the last scripted word.
   - (d) Visual pass: background correct, nothing stretched, captions placed, CTA text exact, first frame strong (it's the thumbnail).
   - (e) Present a short review: file / audio / visuals / captions / issues.
4. **Pre-render validator:** VO longer than the video, music shorter than the video, missing files, overlapping or out-of-order cuts, gaps over 1 s (which show as black frames).
5. **Numeric frame gate (free):** Laplacian blur variance < 100 = blurry and > 500 = sharp; mean brightness 50–200; pixel std-dev contrast > 30. Sample first, middle and last frames at minimum. Handy for our "sharper quality" lesson.
6. **Caption occlusion check:** compare the face zone against the caption zone in sampled frames.
7. **Distinctness questions** recorded at final review: "Could this be any other product's video?" and "Does it reuse a look I've already made?" A yes to either means the art direction failed.
8. **Decision log as an append-only trail:** when a choice changes (voice, track, style), add a new entry with the same subject instead of editing silently. List ≥ 2 options considered for each decision and avoid 100 % confidence on everything. Useful for our project memory notes.
9. **Escalation format when blocked:** what was attempted → what failed → the cause class (auth / provider / tool bug / design quality) → options → recommendation. No unilateral substitution, such as a still-image animatic in place of motion.

### 3h. Stock and real-footage workflow

1. **Stock vs made:** if the shot must look *real* (people, places, equipment, establishing shots), use stock. If it must look *specific to the concept* (brand UI, metaphor), build it. Generated humans look uncanny.
2. **Query craft:** 2–4 keywords, subject first, no filler. **Add a POV keyword**: drone, aerial, OTS, macro, top-down, timelapse, slow motion, handheld, locked-off. POV often unlocks better matches than refining the subject. Templates: `[place] [time] [POV]`, `[person] [action] [POV]`, `[object] [style] [POV]`. Stock search is deterministic, so change the words rather than retrying. Try synonyms ("developer laptop" instead of "programmer coding").
3. **Per slot write 2–3 queries:** a *literal* query (what a user would type), a *lateral* query (same idea at a different angle or scale) and, for hero slots, an *association* query (an adjacent concept that brings up texture).
4. **Slot description template** (for ranking or judging, separate from the queries): `<subject>, <action/pose>, <environment>, <lighting>, <era/texture>`. Use nouns and adjectives with no emotion words. If you can't picture one specific photo from it, it's too vague.
5. **Decompose themes into textures.** "What does rain show about a city?" becomes ten concrete, searchable shots (a raindrop on asphalt in slow motion, neon in a puddle, a taxi light through rain on a long lens…), each a different angle on one idea.
6. **Score candidates 1–5 and use only 3+.** Check resolution, real relevance, style fit, no watermark, composition and **POV match**. A wrong POV costs more than a wrong grade, so re-query instead of cropping. Pick on judgement, not score: era, emotional register and fit with the neighbouring shots.
7. **Candidate pool of 8–12× the slot count**, 3 downloaded per query. Two growth passes per weak slot at most, then change the slot. Never let one clip win two slots.
8. **Source probe trap:** free stock often arrives at 640×360 or 960×540 even on "large". Probe width and height *before* staging. Scale to **cover and crop** (`scale=W:H:force_original_aspect_ratio=increase,crop=W:H,unsharp=3:3:0.6`), never fit-and-pad. This ties to our "plates ≥ output res" rule: reject anything under output resolution for hero plates.
9. **Re-encode stock before HyperFrames:** `-c:v libx264 -r 30 -g 30 -keyint_min 30 -sc_threshold 0 -movflags +faststart`. Sparse keyframes (> 5 s apart) cause frame freezes or render timeouts. For more than 5 background videos, render with `--workers 1`. Convert VFR phone or screen footage to CFR (`-vsync cfr -r 30`) before any stitch.
10. **More free sources than we use:** Coverr (no key, 50 req/h), Mixkit video (no key; we only use Mixkit music), Videvo, Dareful (4K nature), NASA/ESA/NOAA (space and ocean, public domain), Archive.org Prelinger, NARA and Library of Congress (vintage), Wikimedia. Pixabay video also has a deep library of AI fantasy animations, which suits only kids' or fairy-tale briefs.
11. **Track provenance** per clip (provider, original URL, licence) in the project notes.
12. **Talking-footage cleanup** (user reels): trim dead air over 1.5 s to about 0.5 s; keep 0.3–0.8 s breath pauses; cut at word boundaries; keep the final take of false starts. **Respect our Hindi rule: never trim Hindi lines.**

---

## 4. Free-only tool ideas to rebuild ourselves (no OpenMontage install)

| OpenMontage tool | What it does | What we'd need |
|---|---|---|
| `audio_energy` | `ebur128` momentary loudness every 100 ms; first point above about −40 LUFS = intro skip; highest-energy window for an N-second cut; tells you whether looping is needed | ffmpeg only. About 60 lines of Python feeding our drop-splice script |
| `silence_cutter` | `silencedetect` (default −35 dB, min 0.5 s, 0.08 s padding). Modes: remove (jump cut), speed-up silences (default 6×), or just mark | ffmpeg only. Use the *mark* mode for Hinglish footage and review by hand |
| `face_tracker` + `auto_reframe` | MediaPipe face boxes → smoothed trajectory (window 15) → 16:9→9:16 crop with 40 % face padding, CRF 18; Haar fallback | `pip install mediapipe opencv-python`, CPU only. Must obey our gym framing rule (never crop the face, top-anchored) |
| `scene_detect` | PySceneDetect content (27) / adaptive (3.0) / threshold (12, fades). Presets: talking head 22 + 3 s min, screen 30 + 2 s, montage 40 + 0.5 s. Always write the stats CSV first and set the threshold just under the smallest real peak | `pip install scenedetect[opencv]` |
| `video_analyzer` | yt-dlp + captions + scene detect + keyframes + optical-flow variance → static / animated-still / motion classification → reference brief | yt-dlp, youtube-transcript-api, faster-whisper (have it), OpenCV Farneback flow |
| `corpus_builder` + `clip_search` | Fan out stock queries → download → thumbnails → CLIP ViT-B/32 embeddings; rank by slot description (70 % visual / 30 % tag text); `diversify` (MMR, 0.5) to drop near-duplicate neighbours; `find_similar_set` from a seed clip. Score bands: ≥ 0.30 strong, 0.22–0.30 judge, < 0.22 don't force it | `transformers torch` (CUDA on the 3060), numpy, Pixabay key; Coverr/Mixkit scrapers |
| `direct_clip_search` | The light version: 3 clips per query across sources, thumbnails for eyeballing, no embeddings | requests, plus a contact-sheet script we already have |
| `visual_qa` / `video_understand quality` | Frames at timestamps + blur/brightness/contrast numbers + face-vs-caption occlusion + similarity at transitions | ffmpeg + OpenCV. Add to our decode-verify gate |
| `composition_validator` | Pre-render check: VO vs video length, music shorter than video, missing files, cut overlaps or gaps | ffprobe. Port as a HyperFrames pre-render check script |
| `slideshow_risk` / `variation_checker` | Scores a storyboard on 6 sameness dimensions (thresholds in 3b.4) | Pure Python over our storyboard JSON |
| `audio_enhance` | FFmpeg denoise/EQ/compress presets to −16 LUFS (`clean_speech`, `voice_clarity` +3/5 kHz) | ffmpeg (optionally pedalboard). Overlaps our gate+comp+loudnorm, so steal the EQ points |
| `frame_sampler` | Frames at scene midpoints for review | ffmpeg, already basically ours |
| `pixabay_music` / `freesound_music` | Music search; Pixabay scraped with no key, Freesound with a free key | Pixabay scraping is blocked for us. **Freesound free API key** is worth getting for SFX/music |
| `showcase_card` | 9:16 card: letterboxed 16:9 clip + bold title on top + caption below on dark | ffmpeg. Useful for quick vertical cut-downs of 16:9 films |

---

## 5. Skip list

- Paid video generation (Seedance, Veo, Sora, Kling, Runway, Higgsfield, MiniMax, LTX API, Wan) and their prompting guides: paid, and the "AI look" is banned for us.
- Paid image generation (FLUX/BFL, Ideogram, Recraft, GPT Image, Imagen, Grok): paid, and it also breaks our original-UI rule.
- HeyGen/Kling avatars, SadTalker/MuseTalk, Wav2Lip lip-sync: fake presenters; we use real faces.
- ElevenLabs music generation and Suno: paid. We use Mixkit/licensed tracks.
- OpenAI/Azure/Cartesia/Fish and the other paid TTS routes: Gemini Leda is our default.
- The Backlot board and the checkpoint JSON/schema machinery: heavy process for a one-person studio; our contact sheet plus approval covers it.
- The "present both runtimes every time" hard rule: we already decided HyperFrames by default.
- Remotion stock `cut.type` scenes (stat_card, kpi_grid…): templated sameness, which their own atelier doctrine rejects.
- The `flat-motion-graphics` playbook (purple/indigo, neon glow, bouncy springs, glitch SFX, Space Grotesk): every item is on our ban list.
- Their `cinematic_warm` / teal-orange grade defaults: conflict with our no-yellow-tint rule.
- 2.39:1 letterbox and 24 fps "cinematic" defaults: wrong for 9:16 social. Only consider them for a 16:9 brand film.
- Manim, 3D-world/Three.js terrain, Blender world generation: off-brief, and procedural 3D was judged "very bad".
- Face restore, upscaling and face-enhance skin smoothing: our sharp-quality rule says no upscaling. Use real resolution.
- Localization-dub and podcast-repurpose pipelines: no current need; revisit if a Hindi/English dub is requested.
- Pixabay "AI fantasy" kids' footage strategy: off-brand for B2B/linkutm.
