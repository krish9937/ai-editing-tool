# 06 — Speed + Quality Pipeline Design (Remotion / HyperFrames / ffmpeg / whisper)

Goal: an agent goes from a brief to a deliverable in minutes. To get there: ask few questions, start from templates, check stills before rendering video, run cheap automated gates, and re-render only what changed.

---

## 0. Core principles (TL;DR)

1. **Text first, pixels on demand.** The agent works from a packed transcript or script JSON, not from video frames. video-use (browser-use) puts a whole edit's context in about 12 KB of markdown and only renders "timeline_view" filmstrip+waveform PNGs at decision points. Dumping 30k frames would cost about 45M tokens.
2. **Data → template → render.** New videos come from a JSON script fed to existing scene components. A new video should not mean writing new React or HTML.
3. **Stills → contact sheet → draft render → final render.** Each stage costs about 10× the previous one. Don't advance to the next stage until the current one passes.
4. **Silent visual render, mux audio after.** Audio changes (VO, music, ducking) then only need a seconds-long ffmpeg mux, not a re-render.
5. **Normalize inputs once.** Conform all footage to CFR, a short GOP (or all-intra) and the target fps on ingest. This avoids slow, inaccurate seeks and A/V drift in every later render.
6. **Gate cheaply, automatically, before the human sees it.** Check decode, frame count, loudness, safe zones, OCR and caption sync. Then show the human a contact sheet plus a 720p draft.

---

## 1. Fastest reliable end-to-end pipelines

### (a) Long video → captioned shorts (Opus-Clip-style)

Reference implementations: `SamurAIGPT/AI-Youtube-Shorts-Generator` (yt-dlp + faster-whisper + LLM virality ranking + OpenCV face tracking with smoothing, auto-chunks >30 min with overlap, dedupes candidates that overlap >50%), OpenShorts, OpenClip, and `browser-use/video-use`. They all share the steps below.

```bash
# 1. Ingest (cached by ID)
yt-dlp -f "bv*[height<=1080]+ba/b" -o "src/%(id)s.%(ext)s" URL
# 2. Conform once: CFR 30, GOP 15 (fast seeks), AAC 48k
ffmpeg -i src/in.mkv -vf fps=30 -c:v libx264 -preset veryfast -crf 18 -g 15 -keyint_min 15 \
  -pix_fmt yuv420p -c:a aac -ar 48000 -b:a 192k src/conf.mp4
# 3. Audio for ASR (16 kHz mono is what Whisper wants)
ffmpeg -i src/conf.mp4 -vn -ac 1 -ar 16000 src/asr.wav
# 4. Word-level transcript (WhisperX = faster-whisper + wav2vec2 forced alignment, ~50-100 ms word accuracy)
whisperx src/asr.wav --model large-v3 --align_model WAV2VEC2_ASR_LARGE_LV60K_960H --output_format json
```

5. **Pack** the transcript into `[mm:ss.s] sentence` lines with pause markers (`‖0.8s`). Send that, not raw JSON, to the LLM. Ask for strict JSON: `[{start,end,hook_line,title,score,reason}]`. Specify 30–60 s, a self-contained arc, and a hook in the first sentence. Chunk at about 20 min with 1 min of overlap.
6. **Snap boundaries** in code, not with the LLM. Move the start to the nearest word start minus 0.08 s and the end to the nearest pause of 250 ms or more after the last word. Reject clips that start mid-sentence.
7. **Reframe to 9:16.**
   - Cheapest: a static center crop per clip at the speaker's median face x (MediaPipe/OpenCV face detection sampled at 2 fps), `crop=ih*9/16:ih:X:0,scale=1080:1920`.
   - Moving speakers: compute a smoothed x per frame (EMA or a one-euro filter) and drive Remotion/HyperFrames `transform`. Alternatively, use `sendcmd` with ffmpeg crop.
8. **Cut** with accurate re-encode (input `-ss` before `-i` is frame-accurate when re-encoding):
   `ffmpeg -ss 754.32 -i src/conf.mp4 -t 41.7 -vf "crop=...,scale=1080:1920" -c:v libx264 -preset veryfast -crf 18 -c:a aac clip03.mp4`
9. **Captions.** Pick one route:
   - **Fastest (no browser):** generate an `.ass` file with per-word karaoke/highlight tags and burn it with `-vf subtitles=clip03.ass`. This runs at ffmpeg speed, often >10× realtime.
   - **Designed:** Remotion `@remotion/captions` `createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: 800–1200})` returns pages and tokens (fromMs/toMs) for word highlighting. Alternatively, use the HyperFrames captions catalog or `embedded-captions`.
10. **Batch render.** Bundle once and loop `renderMedia()` per clip, or run `npx hyperframes render --batch rows.json --output "renders/{name}.mp4"`. Then apply two-pass loudnorm, run the gates, and make one contact sheet per clip.

Throughput target: a 60-min podcast yields 8–12 shorts in about 10–15 min wall time. Most of that is ASR plus caption rendering. LLM selection takes under 1 min.

### (b) Talking-head reel with b-roll / motion graphics

1. Conform footage (as above). VFR phone footage **must** be forced to CFR or captions and overlays will drift.
2. Get the transcript with word timestamps (WhisperX, or ElevenLabs Scribe as in video-use).
3. **Rough cut automatically.** Use `auto-editor in.mp4 --edit audio:threshold=0.04 --margin 0.2sec`, or `--edit "audio:-19dB"`. It can export an XML for human tweaking (`--export resolve|premiere|final-cut-pro`). Better: derive the EDL from the transcript (delete filler words and retakes) and add 30 ms audio fades at every cut to avoid pops (a video-use hard rule).
4. **Beat sheet.** The LLM maps transcript phrases to overlay "beats" (`{atWord, type: "stat"|"lowerThird"|"broll"|"kinetic", props}`). Choose types only from the existing component library.
5. **Composite in one render.** The cut talking head is the base layer (`<Video>` from `@remotion/media` or a HyperFrames `<video>` clip). Overlays are timed in frames computed from word `fromMs`. B-roll goes in as cutaways or PIP, and captions go on their own track.
6. Show stills at every beat in, plus a contact sheet. Then render a 720p draft (`--scale=0.667` or `--quality draft`) and the final, then mux the audio mix.

### (c) Fully generated promo / explainer

1. Intake (see §6), then write `script.json`: scenes with VO line, duration, component, props and brand reference.
2. **Generate VO first.** Get word timestamps from the TTS or by running WhisperX on the TTS output. Scene durations come from the VO, not from guesses. Use `calculateMetadata()` (Remotion) to set `durationInFrames` from the audio length.
3. Pick the music bed. Detect beats (`hyperframes beats`, or librosa `beat_track`) and snap scene cuts to the nearest beat within ±4 frames.
4. Fill the template from the JSON, then lint and check (`npx hyperframes lint && npx hyperframes check`, or `tsc --noEmit`).
5. Render one still per scene at its "hero" frame and build a contact sheet. **Show the user here.**
6. Fix the scenes that need it and re-render only those frames. Then draft (half-res), then the final silent render, then mux VO + ducked music + loudnorm, then the gates.

---

## 2. Render performance rules

### Remotion
| Lever | Rule |
|---|---|
| Concurrency | Run `npx remotion benchmark` once per machine and store the best value in config. If you skip the benchmark, start at about half the logical cores. Too high slows renders because the Chrome tabs thrash. `Config.setConcurrency()` docs suggest `os.cpus().length` as an upper bound. |
| Image format | `jpeg` (default) for anything opaque. `png` only when you need alpha, because it is noticeably slower. `--jpeg-quality=90` is visually lossless for the intermediate. |
| x264 preset | Valid values are `superfast` through `placebo` (default `medium`). Drafts: `--x264-preset=veryfast --crf=28`. Finals: `medium`/`slow`, `--crf=16–18` (H.264 default CRF is 18). |
| HW encode | `--hardware-acceleration=if-possible`: NVENC (H.264/H.265, driver ≥525) on Win/Linux, VideoToolbox on macOS. It is **incompatible with `--crf`**, so set `--video-bitrate` (e.g. 20M at 1080p, 60M at 4K). It is not available on Lambda/Cloud Run. It only speeds up the encode stage, not frame capture. |
| `--gl` | Default is fine without WebGL. For Three.js/WebGL on a desktop use `angle`. Use `angle-egl` on GPU cloud boxes and `swangle` on Lambda or without a GPU. `angle` leaks memory on long renders, so split them. |
| Video component | Use `<Video>` from `@remotion/media` (Mediabunny, frame-exact, canvas). Remotion's docs call `Html5Video`/`OffthreadVideo` "not optimized". `<Video>` falls back to OffthreadVideo for unsupported codecs, so pre-transcode to H.264 to avoid the fallback. |
| Media cache | Raise `--media-cache-size-in-bytes` / `--offthreadvideo-cache-size-in-bytes` for footage-heavy timelines. |
| Partial renders | `--frames=0-89` or `--frames=300-449` (inclusive). Re-render just the changed scene and concat it with ffmpeg (`-f concat -c copy`, which only works if the encode params are identical). |
| Resolution | `--scale=0.5` for drafts. Scale is applied at capture, so CSS vector content stays sharp at final scale. |
| Muted | `muted: true` for silent visual renders. Mux audio later. |
| Reuse | In Node, call `bundle()` once and reuse `serveUrl` and `selectComposition` across all renders and stills. Bundling is often the slowest step of a 5 s still. |
| Diagnose | `--log=verbose` prints the slowest frames. Fix those components. |

Lambda: lower `framesPerLambda` gives more parallelism but more overhead. Use `concurrencyPerLambda` for more tabs per function. More memory gives proportionally more CPU. `audioCodec: "mp3"` speeds up the combine stage. Use `speculateFunctionName()`.

### HyperFrames
- `npx hyperframes render --quality draft` for review, `standard` (default) for most deliverables, `high` for masters.
- `--fps 30` unless the destination needs 60. `--gpu` enables GPU encoding (not with HLS or forced keyframes). `--docker` gives pixel-identical renders across machines (pinned Chrome, fonts and FFmpeg).
- `--format webm --vp9-cpu-used 4..8` for faster overlays. VP9 is CPU-heavy, and higher values are faster.
- Batch: `--variables-file v.json` or `--batch rows.json --strict-variables --output "renders/{name}.mp4"`.
- Determinism (also required in Remotion): no `Date.now`, no `requestAnimationFrame` clocks, no unseeded `Math.random`, no mid-render fetches, and a fixed size, fps and duration. Breaking these causes flicker and frames that differ between renders.

### Expensive CSS / content: the per-frame cost multipliers
- `backdrop-filter`, `filter: blur()` and large `box-shadow` on many layers are paint/composite heavy, and on CPU-only machines (cloud, Lambda) they are the #1 slowdown. **Bake static blurs, glows, grain and textures into PNG/WebP** and animate only `transform`/`opacity`.
- Size images to their delivery size. Using a 3840×2160 JPEG in a 1080p frame wastes decode time.
- Avoid layout thrash in animation callbacks: don't read layout and then write styles in the same frame. Memoize expensive computations (`useMemo`) and preload or cache data outside the render.
- Many simultaneous `<Video>` layers multiply decode cost. Pre-composite b-roll stacks with ffmpeg where possible.
- WebGL scenes need `--gl=angle` locally. Otherwise they fall back to SwiftShader and run 5–20× slower.

### Resolution choices
- **Shorts/Reels/TikTok: 1080×1920 @30.** Platforms re-encode anyway, and 4K vertical roughly quadruples capture and encode time for no visible gain on a phone.
- **YouTube 16:9:** 1920×1080 is the default. Render 4K (3840×2160) only for final masters of graphic-heavy explainers, because YouTube gives 4K uploads a higher-bitrate codec. Do every review pass at 1080p or `--scale=0.5`.
- Author at one logical size and use `--scale` for drafts. Never author two layouts for two resolutions.

### Footage pre-transcoding (proxies / all-intra)
- Browser seeking in long-GOP or VFR footage is the hidden cost. Conform on ingest:
  - All-intra H.264 (fastest seek, bigger files): `-c:v libx264 -preset veryfast -crf 16 -g 1 -pix_fmt yuv420p`
  - Compromise: `-g 15 -keyint_min 15 -sc_threshold 0`
  - Editing proxy: DNxHR LB (`-c:v dnxhd -profile:v dnxhr_lb`, 960×540 for 9:16 previews) or ProRes Proxy (`-c:v prores_ks -profile:v 0`, slower to encode).
- Always `-vf fps=30` (CFR). Remotion's "slow method to extract frame" warning means broken timestamps. Fix with `npx remotion ffmpeg -i in.mp4 out.mp4`.
- Downscale 4K phone footage to 1080 wide once, unless you're punching in more than 1.5×.

---

## 3. Partial renders & preview strategy

**Ladder** (approximate cost for a 60 s 1080p piece on an 8-core laptop):
1. **Lint/typecheck:** about 2 s.
2. **Key stills.** One per scene at the hero frame, plus one at each transition midpoint. 10 stills take about 15 s if the bundle is reused.
   ```ts
   const serveUrl = await bundle({entryPoint: "src/index.ts"});          // once
   const comp = await selectComposition({serveUrl, id: "Main", inputProps});
   for (const f of keyFrames) await renderStill({composition: comp, serveUrl, frame: f,
       output: `review/f${f}.jpg`, imageFormat: "jpeg", jpegQuality: 85, inputProps, scale: 0.5});
   ```
   CLI: `npx remotion still Main review/f120.png --frame=120 --props=script.json --scale=0.5`. HyperFrames: `npx hyperframes snapshot`.
3. **Contact sheet** (one image the agent can view, and the user sees in one glance):
   `magick montage review/*.jpg -tile 5x -geometry +6+6 -label %f review/sheet.jpg`
   or from a draft video: `ffmpeg -i draft.mp4 -vf "fps=1/2,scale=270:-1,tile=6x5" -frames:v 1 sheet.jpg`.
   For footage: `select='gt(scene,0.35)',scale=320:-1,tile=5x4` gives one thumbnail per cut.
4. **Motion check of one scene:** `--frames=a-b --scale=0.5 --x264-preset=veryfast`, a few seconds.
5. **Full draft:** half scale, veryfast, muted, about 25% of final cost.
6. **Final:** only after the user approves the sheet or draft.

**Re-render only what changed.** Keep `scenes[i].fromFrame/toFrame` in the script. Map a changed prop to the affected scene range, render that range, and splice it with ffmpeg concat. This needs a closed GOP at the splice points, so use `-x264-params keyint=30` plus scene boundaries on keyframes, or simply re-encode at the splice step. HyperFrames scene sub-compositions can be rendered individually with `--composition`.

---

## 4. Reusable template architecture

```
video-kit/
  brands/<brand>/brand.json        # colors, fonts, logo paths, radii, motion tokens, voice id
  brands/<brand>/assets/           # logo.svg, wordmark.svg, fonts/*.woff2, textures (pre-baked blur/grain)
  components/
    scenes/   TitleCard, StatHit, UIDemo, Quote, ListReveal, LogoSting, CTA
    captions/ KaraokeWord, PageFade, Embedded (behind subject), LowerThird
    transitions/ Wipe, ZoomBlur(prebaked), MatchCut, Whip
    layout/   SafeZone (debug overlay), Frame9x16, Frame16x9
  templates/
    short-clip/   (9:16 captioned clip)   reel-th/ (talking head + beats)   promo/ (scene list)
  schemas/script.schema.json         # zod/JSON schema = the contract the LLM fills
  scripts/ ingest.sh  transcribe.py  pack_transcript.py  gates.sh  contact_sheet.sh  mux.sh
```

**brand.json** (single source of truth; inject as CSS variables / ThemeProvider):
```json
{"name":"linkutm","colors":{"bg":"#0B1020","fg":"#F5F7FF","accent":"#5B8CFF","accent2":"#22C55E","muted":"#8892B0"},
 "fonts":{"display":{"family":"Inter Display","file":"fonts/InterDisplay-Bold.woff2","weight":700},
          "body":{"family":"Inter","file":"fonts/Inter-Regular.woff2"}},
 "logo":{"mark":"assets/mark.svg","wordmark":"assets/wordmark.svg"},
 "motion":{"easeIn":"cubic-bezier(.2,.8,.2,1)","durFast":8,"durBase":14,"spring":{"damping":200}},
 "captions":{"style":"karaoke","font":"display","size":64,"highlight":"accent","maxWordsPerPage":4},
 "voice":{"provider":"elevenlabs","voiceId":"..."},"safeZone":{"9x16":{"top":220,"bottom":420,"left":60,"right":140}}}
```

**script.json** (what the LLM writes, validated by the schema before any render):
```json
{"brand":"linkutm","format":"9x16","fps":30,
 "audio":{"vo":"vo.mp3","music":"bed.mp3","duckDb":-14},
 "scenes":[
  {"id":"hook","component":"KineticTitle","from":"vo:0","props":{"text":"Your UTMs are lying to you"}},
  {"id":"stat","component":"StatHit","fromWord":"73%","props":{"value":73,"suffix":"%","label":"of links mis-tagged"}},
  {"id":"cta","component":"CTA","durationSec":2.5,"props":{"url":"linkutm.com"}}]}
```

Rules that make "new video = minutes":
- Components take **only props and brand tokens**, with no hard-coded colors or sizes. Each declares `minDuration` and a `heroFrame` (used for stills).
- Timing is **word-anchored** (`fromWord`, `vo:<sec>`), resolved to frames by one pure function, so a new VO take re-times everything automatically.
- Zod schema plus `calculateMetadata()` (Remotion), or `data-composition-variables` plus `--variables-file` (HyperFrames). Invalid scripts fail in milliseconds, not after a 5-minute render.
- Pre-register fonts with `@remotion/fonts`/`loadFont` or `@font-face` in local woff2 files, and wait for them before the first frame. No Google Fonts fetch mid-render.
- Before hand-building, check the registry or catalog: HyperFrames has about 400 blocks (`hyperframes add`), and there are Remotion templates (`npx create-video@latest --template ...`). digitalsamba's `claude-code-video-toolkit` is a worked example of this layout: `brands/` (brand.json + voice.json), `templates/`, `lib/` (components, transitions, ThemeProvider) and a per-project `project.json` tracking phases.
- This mirrors pro editors' MOGRT / Essential Graphics practice. Locked templates expose only text, color and logo fields, and project-template folders and presets are reused for every job. Brand consistency comes from constraints, not from discipline.

---

## 5. Cheap quality gates (run all, in about 10–30 s)

```bash
OUT=final.mp4; FPS=30; EXP_FRAMES=1800
# 1 Decode integrity: any error output = fail
ffmpeg -v error -i $OUT -f null - 2> decode.log; test ! -s decode.log
# 2 Frame count / duration / dims / fps
ffprobe -v error -count_frames -select_streams v:0 \
  -show_entries stream=nb_read_frames,width,height,r_frame_rate,pix_fmt -of json $OUT
#   assert nb_read_frames == EXP_FRAMES (±1), width/height == spec (catches the wrong-aspect disaster), yuv420p
# 3 Black / frozen frames / silence holes
ffmpeg -i $OUT -vf "blackdetect=d=0.3:pix_th=0.08,freezedetect=n=0.003:d=1.5" \
  -af "silencedetect=n=-45dB:d=1.2" -f null - 2>&1 | grep -E "black_start|freeze_start|silence_start"
# 4 Loudness: target -14 LUFS integrated, <= -1.0 dBTP for social/YouTube
ffmpeg -i $OUT -af ebur128=peak=true -f null - 2>&1 | tail -12
#    Fix with two-pass loudnorm: pass1 measure ->
ffmpeg -i mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null -
#    pass2 apply measured_I/TP/LRA/thresh + linear=true
# 5 A/V duration match: |video_dur - audio_dur| < 1 frame
ffprobe -v error -show_entries stream=codec_type,duration -of csv=p=0 $OUT
```

6. **Safe-zone check.** Render one still per scene with a `<SafeZone debug>` overlay toggled by prop, or compute bounding boxes in code. Text and logos must sit inside the safe area. 9:16 conservative zone at 1080×1920: top ≥220 px, bottom ≥420 px (Reels' UI grew in late 2025), right ≥140 px (action rail), sides ≥60 px. Captions belong roughly in the 1150–1450 px band, at about 60–75 px font size.
   Automatable version: run OCR (`tesseract still.png - --psm 11 tsv`) and assert every word box lies inside the zone rectangle.
7. **OCR / text correctness.** Run Tesseract on hero stills and diff against the `props.text` strings from script.json. This catches typos, clipped text, overflow and fonts that never loaded (when glyphs fall back, OCR confidence drops). Use the agent's own vision only on the contact sheet, not per frame.
8. **Caption sync.** Re-run faster-whisper (`word_timestamps=True`, small model) on the *final* audio. Align its words to the rendered caption tokens by text and assert median |Δstart| < 80 ms and max < 200 ms. A drift that grows over time means VFR or fps mismatch, so go back to conforming. A constant offset means a lead-in or padding error.
9. **Cut boundaries** (talking head). Take a 5-frame strip around each EDL cut (`select='between(n,a,b)',tile=5x1`) to check for jump flashes or half-words. This is video-use's self-eval loop, capped at 3 iterations.
10. **Visual regression.** When re-rendering after a fix, compare stills of untouched scenes against the previous ones (`hyperframes compare`, or `magick compare -metric SSIM`). This proves nothing else moved.

---

## 6. Agent workflow: ask once, draft early, re-render minimally

### Minimum up-front question set (one batch, defaults pre-filled)
1. **Type and goal.** Short clip, talking-head reel or promo/explainer, and the single action the viewer should take.
2. **Platform(s) → aspect, size and length.** e.g. Reels 1080×1920, ≤45 s. Fixing aspect up front kills the #1 re-render cause.
3. **Inputs.** Footage, script or VO, logo and brand (or a URL to scrape brand from), music preference, and whether captions are wanted.
4. **Voice.** Their own, cloned/TTS (voice id), or silent.
5. **Style reference.** One link or adjective set, plus any hard "don'ts" (e.g. no face on the cover, no outro card).
6. **Must-say facts.** Claims, numbers and the CTA text, word for word.
7. **Deadline and review appetite.** "Approve the storyboard sheet first?" defaults to yes for promos and no for batch clips.

Everything else (fonts, colors, transitions, pacing) comes from the brand kit or defaults and is *shown*, not asked.

### Checkpoints (show the user only these)
- **C1 Script/beat sheet** (text, cheapest to change). Promos: always. Clips: show the ranked clip list with titles and timestamps.
- **C2 Contact sheet of hero stills** with captions and the safe-zone overlay off. This is where about 80% of feedback lands.
- **C3 720p/half-scale draft with audio.** Approval here locks visuals.
- **C4 Final** plus the gate report (frames, LUFS, sync Δ, dims).

### Minimal re-render loop
- Classify each feedback item by blast radius:
  - **Audio-only** → remux (seconds).
  - **Text/prop in one scene** → re-render that frame range and splice.
  - **Brand token** → stills first, then full.
  - **Timing/VO** → re-resolve the word anchors, render stills at the changed boundaries, then full.
- Batch all feedback into one pass. Never render after every comment.
- Persist `project.json` / `project.md` (phase, approved checkpoints, scene hashes). On resume, the agent only re-renders scenes whose prop hash changed.

---

## 7. Common time sinks → fixes

| Time sink | Fix |
|---|---|
| Wrong aspect/length discovered at the end | Ask about platform first. Gate 2 asserts dims. Render the first still in target dims. |
| Full re-render for a typo or audio tweak | Silent render plus audio mux, frame-range re-render plus concat, and OCR-gate stills before rendering. |
| Slow, choppy footage seeks / drifting captions | Conform to CFR, short GOP or all-intra on ingest, and use `<Video>` from `@remotion/media`. |
| Rendering takes 10× longer on cloud/CPU | Bake blur, shadow and backdrop-filter. Use the right `--gl`. Benchmark concurrency. |
| Waiting on the user mid-pipeline | One intake batch with defaults. Async checkpoints, so the agent continues with audio prep and ASR while the user reviews C2. |
| LLM rewrites components each time | Only allow script.json changes. Components are a frozen library, so new looks become new components, added deliberately. |
| Font or asset popping, flaky frames | Use local woff2 and preload. No fetch during render. Make everything deterministic and seeded. |
| Re-transcribing the same source | Cache by file hash: transcript.json, packed.md, faces.json. |
| Agent "looks" at video frame by frame | Text-first. Contact sheets and `timeline_view` strips only at decision points. |
| Over-iterating quality on drafts | Drafts are always half-scale with `veryfast`. Finals use `medium`/`slow`, CRF 16–18 or NVENC at a fixed bitrate. |
| 4K for vertical shorts | 1080×1920 @30. Use 4K only for 16:9 masters after approval. |
| Loudness inconsistent across clips | Two-pass loudnorm at -14 LUFS / -1.5 dBTP in the mux script, always. |

---

## Sources
- Remotion performance: https://www.remotion.dev/docs/performance
- Remotion CLI render flags: https://www.remotion.dev/docs/cli/render
- Remotion hardware acceleration: https://www.remotion.dev/docs/hardware-acceleration
- Remotion `--gl` options: https://www.remotion.dev/docs/gl-options
- Remotion `<Video>` (@remotion/media): https://www.remotion.dev/docs/media/video
- Remotion slow frame extraction: https://www.remotion.dev/docs/slow-method-to-extract-frame
- Remotion Lambda speed: https://www.remotion.dev/docs/lambda/optimizing-speed
- Remotion renderMedia: https://www.remotion.dev/docs/renderer/render-media
- Remotion encoding guide: https://www.remotion.dev/docs/encoding
- Remotion config (x264 presets, concurrency): https://www.remotion.dev/docs/config
- Remotion parameterized rendering: https://www.remotion.dev/docs/parameterized-rendering
- Remotion createTikTokStyleCaptions: https://www.remotion.dev/docs/captions/create-tiktok-style-captions
- Remotion prompt-to-motion-graphics template / LLM generation: https://www.remotion.dev/docs/ai/ai-saas-template , https://www.remotion.dev/docs/ai/generate
- HyperFrames repo: https://github.com/heygen-com/hyperframes ; docs index https://hyperframes.heygen.com/llms.txt
- HyperFrames performance: https://hyperframes.heygen.com/guides/performance.md
- HyperFrames rendering: https://hyperframes.heygen.com/guides/rendering.md
- HyperFrames determinism: https://hyperframes.heygen.com/concepts/determinism.md
- HyperFrames variables/batch: https://hyperframes.heygen.com/concepts/variables.md
- auto-editor: https://github.com/WyattBlue/auto-editor
- AI YouTube Shorts Generator: https://github.com/Anil-matcha/AI-Youtube-Shorts-Generator
- video-use (browser-use): https://github.com/browser-use/video-use ; loudness targets https://instagit.com/browser-use/video-use/loudness-normalization-targets-video-use/
- claude-code-video-toolkit: https://github.com/digitalsamba/claude-code-video-toolkit
- WhisperX paper: https://arxiv.org/abs/2303.00747
- ffmpeg loudnorm guide: https://dev.to/javidjamae/ffmpeg-loudnorm-filter-ebu-r128-loudness-normalization-guide-15d4
- ffmpeg contact sheets: https://techearl.com/ffmpeg-contact-sheet-preview
- Intermediate codecs (DNxHR/ProRes): https://www.tal.org/tutorials/convert-consumer-video-formats-dnxhd-or-dnxhr , https://forum.shotcut.org/t/suggested-codecs-file-formats-for-editing-speed-reduced-lagging/11756
- Short-form safe zones: https://reap.video/blog/short-form-video-safe-zones , https://blitzcutai.com/blog/best-caption-size-instagram-reels-2026
- Presets/MOGRT practice: https://www.miracamp.com/learn/video-editing/presets
- n8n/JSON-to-video pipelines: https://json2video.com/video-automation/n8n/tutorials/social-media-reels , https://creatomate.com/blog/how-to-create-videos-from-json-using-n8n
