# 03 — Open-Source / Free Tools for Agent-Driven Programmatic Video

Research date: 2026-10-01. Audience: an AI coding agent (Claude Code / Codex) that must build, render, edit and deliver videos itself, on Windows first. Facts marked (verify) were not re-confirmed against a primary source during this pass.

---

## 0. TL;DR decision table

| Need | Default pick | Fallback |
|---|---|---|
| Motion graphics / explainer / promo authored as code | **HyperFrames** (HTML+GSAP, Apache-2.0, agent-native CLI) | **Remotion** (React; check company license) |
| React team, data-driven templates, captions, Player embed | **Remotion** | Revideo (MIT) |
| Math / diagram / equation explainers | **Manim Community** | Motion Canvas |
| Cut/trim/concat/loudness/reframe/encode | **ffmpeg** (direct CLI, scripted) | MoviePy 2.x for Python glue |
| Transcription + word timestamps | **faster-whisper** (large-v3-turbo) | whisper.cpp (no Python, Vulkan/CPU), whisperX (forced alignment) |
| Silence/jump cuts | **auto-editor** binary | ffmpeg silencedetect + script |
| Scene cuts | **PySceneDetect** | ffmpeg `select='gt(scene,0.3)'` |
| 9:16 auto-reframe | MediaPipe / YOLO face track + smoothed crop | static center crop |
| Bg removal | rembg (BiRefNet) for stills, RobustVideoMatting for video | — |
| Local TTS | **Kokoro-82M** (Apache-2.0) | Piper (GPL engine), Chatterbox (MIT, cloning, GPU) |
| Music | **Licensed libraries** (YouTube Audio Library / Pixabay / Mixkit) | MusicGen / Stable Audio Open (licenses restrictive) |
| Gen video (GPU only) | Wan 2.2 TI2V-5B (Apache-2.0) | LTX-2.x, HunyuanVideo 1.5 |

Rule for the agent: **render silent visuals deterministically, then mux audio with ffmpeg**; verify every output with `ffprobe` + a decode pass (`ffmpeg -v error -i out.mp4 -f null -`) before claiming done.

---

## 1. Composition engines

### 1.1 Remotion (React → MP4)
- **Best at**: React component-based video, data-driven templates, captions, embedding a live preview (`@remotion/player`), serverless batch rendering (Lambda / Cloud Run). Huge ecosystem and docs. Version 4.x line (v4.0.49x as of late 2026).
- **License (important)**: Source-available, *not* OSI open source. Free for individuals and **companies of up to 3 people** (commercial use OK). Teams of 4+ need a **Company License**: "Creators" $25/seat/month, or "Automators" $0.01/render with $100/month minimum; Enterprise from $500/month. A linkutm-sized founder team is likely inside the free tier — re-check headcount before relying on it.
- **Install**: `npx create-video@latest` (pick template) → `npm run dev` (Studio) → `npx remotion render <CompId> out/video.mp4`. Requires Node 18+; Remotion downloads its own Chrome Headless Shell and ships its own ffmpeg binary (no system ffmpeg needed since v4).
- **Key APIs**: `useCurrentFrame()`, `useVideoConfig()`, `interpolate(frame,[0,30],[0,1],{extrapolateRight:'clamp'})`, `spring({frame,fps,config:{damping:200}})`, `<Sequence from durationInFrames>`, `<Series>`, `<AbsoluteFill>`, `<OffthreadVideo>` (frame-exact, preferred over `<Video>` for rendering), `<Audio>`, `<Img>`, `staticFile()`, `delayRender()/continueRender()` for async loading, `calculateMetadata` for dynamic duration.
- **@remotion/transitions**: `<TransitionSeries>` with `<TransitionSeries.Transition presentation={fade()|slide()|wipe()|flip()|clockWipe()} timing={springTiming()|linearTiming({durationInFrames:15})}/>`. Transitions overlap scenes, so total duration shrinks by transition length.
- **@remotion/captions**: `parseSrt()`, `serializeSrt()`, `createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds})` → pages of word tokens for karaoke highlighting. Pair with `@remotion/install-whisper-cpp` (`installWhisperCpp`, `downloadWhisperModel`, `transcribe({tokenLevelTimestamps:true})`, `toCaptions()`) or `@remotion/openai-whisper`.
- **@remotion/media-utils**: `getAudioDurationInSeconds`, `getVideoMetadata`, `useAudioData(src)` + `visualizeAudio({fps,frame,audioData,numberOfSamples})` for audio-reactive bars; `getWaveformPortion`. (Newer `@remotion/media-parser`/Mediabunny cover metadata too.)
- **@remotion/motion-blur**: `<Trail layers={50} lagInFrames={0.1}>` or `<CameraMotionBlur shutterAngle={180} samples={10}>` — samples multiply render time ~linearly; use only on hero moves.
- **Player**: `@remotion/player` `<Player component durationInFrames fps compositionWidth compositionHeight controls/>` for in-app previews.
- **Local vs Lambda**: Local uses all cores (`--concurrency`); Lambda splits into chunks across functions (fast, pays AWS + still subject to license). For an agent on a laptop, local is fine. New `@remotion/web-renderer` (`renderMediaOnWeb`) renders in-browser via WebCodecs/Mediabunny — experimental alpha, subset of elements.
- **Speed tips**: `--concurrency=<cores>` (benchmark with `npx remotion benchmark`); `--jpeg-quality` / image format `jpeg` unless transparency; render previews at `--scale=0.5`; `--frames=0-90` for spot checks; `npx remotion still` for single-frame QA; avoid heavy CSS `filter: blur()` and big box-shadows (slow in Chromium software GL); `--gl=angle` on Windows for WebGL/three.js; `--hardware-acceleration if-possible` for encoding (macOS/limited).
- **Gotchas**: Anything non-deterministic (Math.random, Date, CSS animations, setTimeout) breaks frame-seeking — use `random(seed)` and frame-driven values only. Fonts must be loaded with `@remotion/google-fonts` or `delayRender`. `<Video>` may drift; use `<OffthreadVideo>`. 4K renders need memory (`--concurrency` lower). Windows: works natively; long paths and OneDrive-synced folders cause EPERM — keep projects in e.g. `D:\codes`.

### 1.2 HyperFrames (heygen-com/hyperframes)
- **Best at**: agent-authored video. Compositions are plain **HTML/CSS + a single paused GSAP timeline** (also Lottie, Three.js, Anime.js, WAAPI, CSS keyframes adapters); deterministic frame seeking in headless Chrome, FFmpeg encode. Ships agent skills, a registry of ~400 blocks/components, captions, TTS, transcription, background removal and lint/check tooling.
- **License**: **Apache-2.0** — free commercial use, no per-render fee. This is the main reason to prefer it over Remotion for company use.
- **Requirements**: Node.js 22+, FFmpeg on PATH, Chrome via Puppeteer (bundled).
- **Install / commands**: `npx skills add heygen-com/hyperframes` (installs agent skills), `npx hyperframes init my-video`, `npx hyperframes preview` (live reload), `npx hyperframes check` (lint/validate; `lint`/`validate` are aliases), `npx hyperframes render` (MP4), plus `add`/`catalog` for registry blocks, `snapshot`, `transcribe`, `tts`, `remove-background`, `doctor`, and cloud/Lambda/Cloud Run render targets.
- **Composition contract**: timing via `data-start`, `data-duration`, `data-track`; elements with `class="clip"`; media playback owned by the framework; timeline must be paused and seek-safe (no wall-clock animation).
- **Gotchas**: same determinism rules as Remotion; run `check` before every render; snapshot key frames for QA before a full render. Windows: Node/Chrome/FFmpeg all work natively; Git LFS (`winget install GitHub.GitLFS`) needed for some registry assets.
- **This environment already has HyperFrames skills installed** (`hyperframes`, `hyperframes-cli`, `hyperframes-core`, `media-use`, etc.) — route through them.

### 1.3 Motion Canvas
- **Best at**: TypeScript generator-based animations (`yield* rect().position.x(300, 1)`), excellent for code-walkthrough and diagram animation with an interactive editor and audio-synced timeline. MIT. `npm init @motion-canvas@latest`. Rendering is via the editor UI (image sequence or ffmpeg plugin `@motion-canvas/ffmpeg`), so it's **less headless-friendly** for agents. Release cadence slowed after v3.17 (2024) (verify current status). Prefer Revideo if you need headless render.

### 1.4 Revideo
- Motion Canvas fork turned library: headless `renderVideo({projectFile, settings})`, render API server, templates, audio support. **MIT**. `npm init @revideo@latest`. Repo moved to `midrender/revideo`; active but smaller community (~4k stars). Good when you want Motion Canvas syntax + programmatic batch rendering without Remotion licensing.

### 1.5 Editly
- Declarative JSON5 → video (Node, uses ffmpeg + headless gl/fabric canvas). Good for quick slideshow/clip montages with built-in transitions (gl-transitions), titles, audio ducking. `npm i -g editly`; `editly spec.json5 --out out.mp4 --fast`. MIT. Gotchas: native deps (`gl`, `canvas`) are painful on Windows (need build tools / prebuilt binaries); development pace is slow (verify). Use WSL if it fails.

### 1.6 MoviePy 2.x (Python)
- Python glue for compositing, text, simple effects; wraps ffmpeg (imageio-ffmpeg). MIT. `pip install moviepy` (2.1/2.2 current).
- **v2 breaking API** (v1 code from tutorials will fail): `from moviepy import VideoFileClip, TextClip, CompositeVideoClip, concatenate_videoclips, vfx, afx` (no more `moviepy.editor`). Methods renamed: `subclip`→`subclipped`, `set_duration`→`with_duration`, `set_position`→`with_position`, `set_start`→`with_start`, `volumex`→`with_volume_scaled`, `resize`→`resized`, `crop`→`cropped`; effects are classes: `clip.with_effects([vfx.FadeIn(0.5), vfx.Resize(0.5)])`. `TextClip(font="path/to/font.ttf", text="Hi", font_size=80, color="white")` — font is a file path, ImageMagick no longer needed (Pillow).
- Gotchas: slow (Python per-frame numpy); fine for <5 min edits, not for 4K long renders. Close clips (`clip.close()`) on Windows to release file handles. Write with `write_videofile("o.mp4", codec="libx264", audio_codec="aac", threads=8, preset="medium", ffmpeg_params=["-crf","18","-pix_fmt","yuv420p"])`.

### 1.7 Manim (Community Edition)
- Best for math/diagram/graph explainers (3Blue1Brown style). MIT. `pip install manim` (needs ffmpeg is bundled via PyAV now; LaTeX only for `MathTex` → install MiKTeX on Windows). Render: `manim -pqh scene.py MyScene` (`-ql` preview 480p15, `-qh` 1080p60, `-qk` 4K; `--format=mov -t` transparent). Gotchas: LaTeX install is the #1 Windows pain; `Text()` uses Pango and system fonts; cache in `media/`. Also `manim-voiceover` plugin syncs animation to TTS/recorded narration with bookmarks.

### 1.8 Lottie / dotLottie
- Vector animations (After Effects → Bodymovin, or LottieFiles). Use inside Remotion (`@remotion/lottie`, `<Lottie animationData>`) or HyperFrames (Lottie adapter) so playback is frame-seeked. dotLottie (`.lottie`, zipped, supports theming/state machines) via `@lottiefiles/dotlottie-web`. Free LottieFiles assets have the Lottie Simple License (free commercial use, verify per asset). Gotcha: expressions and some AE effects don't render; always seek by frame (`goToAndStop(frame, true)`), never autoplay.

### 1.9 GSAP in headless Chrome + Puppeteer/Playwright frame capture (DIY)
- GSAP is now **100% free including all plugins** (SplitText, MorphSVG, DrawSVG...) since Webflow's 2025 acquisition — standard "no-charge" license; not OSI but free for commercial use.
- DIY pattern if not using a framework: build a page with `gsap.timeline({paused:true})`, expose `window.seek = t => tl.seek(t)`, then loop frames:
```js
// node capture.mjs  (npm i puppeteer)
import puppeteer from 'puppeteer'; import {spawn} from 'child_process';
const fps=30, dur=10, W=1920, H=1080;
const b=await puppeteer.launch({headless:'new', args:['--disable-gpu-vsync','--force-device-scale-factor=1']});
const p=await b.newPage(); await p.setViewport({width:W,height:H});
await p.goto('file:///D:/codes/anim/index.html'); await p.evaluate(()=>document.fonts.ready);
const ff=spawn('ffmpeg',['-y','-f','image2pipe','-framerate',`${fps}`,'-c:v','png','-i','-','-c:v','libx264','-crf','18','-pix_fmt','yuv420p','out.mp4']);
for(let i=0;i<fps*dur;i++){ await p.evaluate(t=>window.seek(t), i/fps);
  ff.stdin.write(await p.screenshot({type:'png', omitBackground:false})); }
ff.stdin.end(); await b.close();
```
- Faster: `HeadlessExperimental.beginFrame` (Linux only), JPEG screenshots, or CDP `Page.startScreencast` (NOT frame-exact — avoid for final). Real-time screen recording of the page (Playwright `recordVideo`) is variable-fps/low quality — use only for drafts. Frameworks (HyperFrames/Remotion) already solve parallelism, fonts, and media sync — prefer them.

### 1.10 Shotstack (not OSS) and others
- **Shotstack**: hosted JSON-timeline rendering API (paid; free sandbox with watermark). Useful when no local compute; not open source. Similar: Creatomate, JSON2Video, Plainly.
- **Vidstack** is a *player* library, not a renderer. For "edit timeline in browser" UIs: Remotion Editor Starter (paid), `@designcombo/react-video-editor`, OpenCut (open-source CapCut-like editor, MIT, verify).
- **Diffusion Studio Core / Mediabunny**: browser WebCodecs encoding/compositing libraries (MPL/MIT) — useful for client-side export.

---

## 2. ffmpeg mastery (the agent's scalpel)

Install on Windows: `winget install Gyan.FFmpeg` (full build with libass, libfreetype, NVENC/QSV/AMF, libvmaf, rubberband, zimg) or `choco install ffmpeg-full`. Check: `ffmpeg -hide_banner -encoders | findstr nvenc`.

### 2.1 Probe & verify
```bash
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate,pix_fmt,sample_rate,channels -of json in.mp4
ffmpeg -v error -i out.mp4 -f null -          # decode-verify; any output = problem
ffmpeg -i out.mp4 -af ebur128=peak=true -f null - 2>&1 | tail -n 12   # loudness report
```

### 2.2 Silence detection / removal
```bash
# detect (parse silence_start / silence_end from stderr)
ffmpeg -i in.wav -af silencedetect=noise=-35dB:d=0.4 -f null - 2>&1 | grep silence_
# strip leading/trailing silence from a VO file (audio only)
ffmpeg -i vo.wav -af "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.1,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.1,areverse" vo_trim.wav
# remove all internal pauses > 0.5s from audio (keeps 0.15s)
ffmpeg -i vo.wav -af "silenceremove=stop_periods=-1:stop_duration=0.5:stop_threshold=-40dB:stop_silence=0.15" vo_tight.wav
```
`silenceremove` only works on audio — for video jump-cuts, compute keep-segments from `silencedetect` and cut both streams.

### 2.3 Jump-cut automation (video)
Option A — auto-editor (simplest, see §3.2). Option B — build a `select`/`aselect` expression from keep-ranges:
```bash
ffmpeg -i in.mp4 -vf "select='between(t,0,4.2)+between(t,5.1,9.8)',setpts=N/FRAME_RATE/TB" \
  -af "aselect='between(t,0,4.2)+between(t,5.1,9.8)',asetpts=N/SR/TB" -c:v libx264 -crf 18 -c:a aac cut.mp4
```
For many segments, write the expression to a file and use `-filter_complex_script` (Windows command-line length limit ~32k chars). Add 2–4 frame audio fades at each cut (`afade`) or a 10 ms crossfade to avoid clicks.

### 2.4 Loudness: two-pass loudnorm to −14 LUFS (YouTube/Spotify-style social)
```bash
# pass 1: measure
ffmpeg -i mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | tail -n 12
# pass 2: apply measured values (linear=true keeps dynamics if possible)
ffmpeg -i mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=-19.8:measured_TP=-3.1:measured_LRA=6.2:measured_thresh=-30.1:offset=0.4:linear=true:print_format=summary -ar 48000 mix_norm.wav
```
Gotcha: loudnorm upsamples to 192 kHz internally — always set `-ar 48000`. Targets: YouTube/IG/TikTok −14 LUFS, TP −1 to −1.5 dBTP; podcasts −16; broadcast −23 (EBU R128).

### 2.5 Sidechain ducking (music under VO)
```bash
ffmpeg -i vo.wav -i music.mp3 -filter_complex \
 "[1:a]volume=0.5[m];[0:a]asplit=2[vo][sc];[m][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400:makeup=1[duck];[vo][duck]amix=inputs=2:duration=first:normalize=0[out]" \
 -map "[out]" -ar 48000 mixed.wav
```
`amix` normalizes (lowers) inputs by default — always `normalize=0` (ffmpeg ≥5) and control levels yourself. For precise, designed ducks, prefer volume automation from VO word timestamps: `volume='if(between(t,2,8),0.25,1)':eval=frame`.

### 2.6 Concat: demuxer vs filter
- **Demuxer** (no re-encode, instant) — only if all clips share codec, resolution, fps, timebase, pix_fmt, audio layout:
```bash
# list.txt:  file 'a.mp4'\nfile 'b.mp4'
ffmpeg -f concat -safe 0 -i list.txt -c copy out.mp4
```
- **Filter** (re-encode, mixed sources):
```bash
ffmpeg -i a.mp4 -i b.mp4 -filter_complex "[0:v]scale=1920:1080,setsar=1,fps=30[v0];[1:v]scale=1920:1080,setsar=1,fps=30[v1];[v0][0:a][v1][1:a]concat=n=2:v=1:a=1[v][a]" -map "[v]" -map "[a]" -c:v libx264 -crf 18 -c:a aac out.mp4
```
Gotcha: a clip without audio breaks concat — add silence (`-f lavfi -i anullsrc=r=48000:cl=stereo` + `-shortest`). On Windows, paths in list.txt need forward slashes or escaped backslashes and `-safe 0`.

### 2.7 xfade transitions
```bash
# A is 5s long; 0.5s crossfade starting at 4.5s
ffmpeg -i a.mp4 -i b.mp4 -filter_complex \
 "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=4.5,format=yuv420p[v];[0:a][1:a]acrossfade=d=0.5[a]" -map "[v]" -map "[a]" out.mp4
```
Transitions: fade, fadeblack, wipeleft, slideleft, smoothleft, circleopen, radial, dissolve, pixelize, zoomin, hblur, squeezeh... Inputs must match size/fps/pix_fmt/timebase (`settb=AVTB,fps=30` first). For chains, offset_n = sum(durations) − n×transition.

### 2.8 Punch-in / zoompan / Ken Burns
```bash
# smooth 1.0→1.15 punch-in over 2s on video (scale+crop, smoother than zoompan for video)
ffmpeg -i in.mp4 -vf "scale=w='iw*(1+0.15*min(t/2,1))':h=-2:eval=frame,crop=1920:1080" -c:a copy punch.mp4
# hard punch-in (jump-cut style) between 3s and 6s
ffmpeg -i in.mp4 -vf "crop=w='if(between(t,3,6),iw/1.2,iw)':h='if(between(t,3,6),ih/1.2,ih)',scale=1920:1080" out.mp4
# Ken Burns on a still (upscale first to avoid jitter)
ffmpeg -loop 1 -i photo.jpg -vf "scale=8000:-1,zoompan=z='min(zoom+0.0008,1.2)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1920x1080:fps=30" -t 5 -pix_fmt yuv420p kb.mp4
```
zoompan jitters due to integer rounding — upscale 4× first, or do zooms in Remotion/HyperFrames instead.

### 2.9 9:16 reframe
```bash
# center crop 16:9 → 9:16 1080x1920
ffmpeg -i in.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920:flags=lanczos,setsar=1" -c:a copy vertical.mp4
# blurred-background fit (no crop)
ffmpeg -i in.mp4 -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:5[bg];[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2" -c:a copy fit.mp4
# dynamic crop from tracked face x (sendcmd file or per-segment x)
ffmpeg -i in.mp4 -vf "crop=608:1080:x='clip(FACE_X-304,0,iw-608)':y=0,scale=1080:1920" out.mp4
```

### 2.10 Text and subtitles burn-in
```bash
# ASS (best: styles, karaoke \k tags, positioning). Windows path escaping inside filters:
ffmpeg -i in.mp4 -vf "subtitles='C\:/work/caps.ass':fontsdir='C\:/work/fonts'" -c:a copy out.mp4
# SRT with style override
ffmpeg -i in.mp4 -vf "subtitles=caps.srt:force_style='FontName=Inter,FontSize=18,Bold=1,Outline=3,Alignment=2,MarginV=120'" out.mp4
# drawtext (use fontfile, escape colons)
ffmpeg -i in.mp4 -vf "drawtext=fontfile='C\:/Windows/Fonts/arialbd.ttf':text='UTM 101':fontsize=96:fontcolor=white:borderw=6:x=(w-tw)/2:y=h*0.15:enable='between(t,0,2)'" out.mp4
```
Windows quirk: inside filter args the drive colon must be escaped `C\:` and the whole path single-quoted; easiest is to `cd` into the folder and use relative names. For crafted animated captions, render them in Remotion/HyperFrames instead of ASS.

### 2.11 Encoding presets for social
```bash
# master / upload (x264 software, highest quality per bit)
ffmpeg -i in.mov -c:v libx264 -preset slow -crf 18 -profile:v high -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k -ar 48000 out.mp4
# 4K HEVC master
ffmpeg -i in.mov -c:v libx265 -preset medium -crf 20 -tag:v hvc1 -pix_fmt yuv420p10le -c:a aac -b:a 256k out_4k.mp4
# NVIDIA (NVENC)
ffmpeg -hwaccel cuda -i in.mp4 -c:v h264_nvenc -preset p7 -tune hq -rc vbr -cq 19 -b:v 0 -pix_fmt yuv420p -c:a copy out.mp4
# Intel iGPU (QSV) — typical Zenbook
ffmpeg -i in.mp4 -c:v h264_qsv -preset slow -global_quality 20 -look_ahead 1 -c:a copy out.mp4
# AMD (AMF)
ffmpeg -i in.mp4 -c:v h264_amf -quality quality -rc cqp -qp_i 18 -qp_p 20 -c:a copy out.mp4
```
Platform notes: Reels/TikTok/Shorts 1080×1920, 30 or 60 fps, H.264 high, yuv420p, AAC 48k; YouTube accepts anything — upload high bitrate (CRF 16–18) or 4K to get VP9/AV1 treatment. Always `-movflags +faststart` and `-pix_fmt yuv420p` (10-bit/4:4:4 won't play in many players). Hardware encoders are 5–20× faster but ~20–30% less efficient at equal size — fine for drafts and high-bitrate masters. Use `-g 2*fps` for scrubbable previews.

### 2.12 Seeking pitfalls
- `-ss` **before** `-i` = fast input seek; with re-encode it's frame-accurate (modern ffmpeg). With `-c copy` it snaps to the previous keyframe → frozen/black start. For exact cuts, re-encode or cut on keyframes.
- `-ss` after `-i` = decode-and-discard (slow but exact).
- `-t` = duration, `-to` = end time; when `-ss` is before `-i`, `-to` is relative to the seek point (timestamps reset) unless `-copyts`.
- VFR phone footage: normalize first (`-vf fps=30` or `-fps_mode cfr`) before editing or audio drifts.
- iPhone HDR/HLG (BT.2020) looks washed out when naively converted — tonemap: `zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable,zscale=t=bt709:m=bt709:r=tv,format=yuv420p`.

### 2.13 Windows quirks
- Use Git Bash or PowerShell carefully: in PowerShell, quote filter graphs with single quotes and escape `$`; `%` in `cmd` batch files must be `%%` (e.g. `frame_%%04d.png`).
- Command-line length limit → use `-filter_complex_script file.txt` (ffmpeg 7: `-/filter_complex file.txt`).
- Fonts: `C:/Windows/Fonts/...`; fontconfig in Windows builds may be slow first run.
- Antivirus/OneDrive can lock files mid-write; render to a non-synced folder.
- NUL sink: `-f null NUL` in cmd, `-f null -` works everywhere.

---

## 3. AI open-source helpers

### 3.1 Transcription / word timestamps
- **faster-whisper** (MIT, CTranslate2): `pip install faster-whisper`. Up to ~4× faster than openai-whisper, int8 on CPU.
```python
from faster_whisper import WhisperModel
m = WhisperModel("large-v3-turbo", device="cpu", compute_type="int8")   # GPU: device="cuda", compute_type="float16"
segs, info = m.transcribe("vo.wav", word_timestamps=True, vad_filter=True, language="en")
words = [(w.word, w.start, w.end) for s in segs for w in s.words]
```
large-v3-turbo has 4 decoder layers (vs 32) — near large-v3 accuracy much faster; on GPU int8 it transcribed 13 min in ~20 s using ~1.5 GB VRAM. On CPU expect roughly 0.3–1× realtime for turbo; use `small.en`/`distil-large-v3` for speed. GPU needs cuBLAS + cuDNN 9 for CUDA 12 (`pip install nvidia-cublas-cu12 nvidia-cudnn-cu12`).
- **whisperX** (BSD): faster-whisper + wav2vec2 **forced alignment** for tighter word timings + pyannote diarization (needs HF token). `pip install whisperx`; `whisperx vo.wav --model large-v3-turbo --compute_type int8 --align_model WAV2VEC2_ASR_LARGE_LV60K_960H --output_format json`. Best for karaoke captions where ±20 ms matters.
- **whisper.cpp** (MIT): C/C++, no Python; Windows binaries with CPU/Vulkan/CUDA; `whisper-cli -m ggml-large-v3-turbo.bin -f vo.wav -ojf -ml 1` (`-ojf` full JSON with token timestamps, `-ml 1` one word per segment). Input must be 16 kHz mono WAV: `ffmpeg -i in.mp4 -ar 16000 -ac 1 -c:a pcm_s16le vo16.wav`. Remotion's `@remotion/install-whisper-cpp` wraps it.
- **Known-script alignment**: if you have the exact script (TTS VO), align instead of transcribe — whisperX align, `aeneas`, or Montreal Forced Aligner — and correct ASR spelling (brand names like "linkutm") by mapping to script tokens.

### 3.2 auto-editor (silence / motion cutting)
- Now written in **Nim**; **no longer published on pip** — download the binary from GitHub Releases, rename to `auto-editor.exe`. (Old pip versions still exist but are stale.)
```bash
auto-editor in.mp4 --edit audio:-30dB --margin 0.12s,0.2sec -o cut.mp4
auto-editor in.mp4 --edit audio:threshold=0.04,stream=all --export premiere   # or resolve, final-cut-pro, shotcut → XML for human finishing
auto-editor in.mp4 --edit motion:threshold=0.02
auto-editor in.mp4 --edit audio:-30dB --silent-speed 4 --video-speed 1     # speed up silence instead of cutting
```
Tip: run first with `--export json`/`--stats` (verify flags in `--help` per version) to inspect cuts before rendering; margins 0.1–0.25 s feel natural, smaller feels "YouTuber jumpy".

### 3.3 PySceneDetect
`pip install scenedetect[opencv]`; `scenedetect -i in.mp4 detect-adaptive list-scenes split-video` (ContentDetector `detect-content -t 27` for hard cuts, `detect-threshold` for fades). Python: `from scenedetect import detect, AdaptiveDetector; scenes = detect('in.mp4', AdaptiveDetector())`. BSD-3. Use for b-roll selection, beat-matching stock footage, and finding thumbnails.

### 3.4 Face detection / auto-reframe
- **MediaPipe** (Apache-2.0) Face Detector / Pose — fast on CPU, `pip install mediapipe`; new Tasks API (`mediapipe.tasks.python.vision.FaceDetector`). Python 3.9–3.12 wheels (check for newest Python).
- **OpenCV** YuNet (`cv2.FaceDetectorYN`) — tiny, CPU-fast, no extra deps.
- **YOLO** (Ultralytics, **AGPL-3.0** — commercial closed use needs a license) for person/object tracking: `yolo track model=yolo11n.pt source=in.mp4`.
- **insightface** — strong detection/recognition; code MIT but pretrained models are **non-commercial research only**.
- Reframe algorithm: detect face center per frame (or every 3rd frame), reject outliers, smooth with an EMA or Savitzky–Golay / one-euro filter, add dead-zone so the crop only moves when the face leaves the central 20%, clamp to frame, then crop via per-segment ffmpeg crops or by rendering in Remotion with an interpolated `translateX`. Hard-switch (cut) between speakers rather than panning. Reference implementations: Google AutoFlip (MediaPipe, archived), `ffmpeg` + `sendcmd`.

### 3.5 Background removal / matting
- **rembg** (MIT) — `pip install "rembg[cpu]"` (or `[gpu]`); `rembg i -m birefnet-general in.png out.png`; models u2net, isnet-general-use, birefnet-general/-portrait, sam. Good for stills/product shots.
- **BiRefNet** (MIT) — SOTA dichotomous segmentation, heavy; use via rembg or HF `ZhengPeng7/BiRefNet`.
- **RobustVideoMatting** (GPL-3.0) — temporally stable human matting for video, real-time on GPU, OK on CPU at 512p: `python inference.py --variant mobilenetv3 --checkpoint rvm_mobilenetv3.pth --input-source in.mp4 --output-type video --output-composition alpha.mp4 --output-alpha pha.mp4`. Newer alternatives: MatAnyone (video matting, non-commercial S-Lab license — verify), SAM 2 (Apache-2.0) for promptable object masks.
- Output transparent video: ProRes 4444 (`-c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le`) or VP9 WebM (`-c:v libvpx-vp9 -pix_fmt yuva420p`) — H.264 has no alpha.

### 3.6 Upscaling & interpolation
- **Real-ESRGAN** (BSD-3): portable `realesrgan-ncnn-vulkan.exe -i frames -o up -n realesrgan-x4plus` (Vulkan → runs on Intel/AMD iGPU too). For video: extract frames, upscale, re-encode with original audio. `realesr-animevideov3` for animation. Slow on iGPU (~1–3 fps at 1080p→4K).
- **RIFE** (MIT): `rife-ncnn-vulkan.exe -i frames -o out -m rife-v4.6` (or Practical-RIFE / Flowframes GUI). Use for slow-mo or 30→60 fps; artifacts on text/UI — don't interpolate screen recordings. ffmpeg-only fallback: `minterpolate=fps=60:mi_mode=mci` (slow, artifacty).

### 3.7 Audio denoise / enhance
- **ffmpeg arnndn** (RNNoise): `ffmpeg -i in.wav -af "highpass=f=80,arnndn=m=cb.rnnn,afftdn=nf=-25" out.wav` (models from `GregorR/rnnoise-models`; `cb.rnnn` general). Also `afftdn` alone for hiss, `deesser`, `acompressor`, `alimiter`.
- **DeepFilterNet** (MIT/Apache): `pip install deepfilternet`; `deepFilter in.wav -o outdir` — much better than RNNoise on speech, CPU real-time. Good default for founder voice recordings. Resemble Enhance (MIT) for restoration (GPU).
- Voice chain suggestion: highpass 80 Hz → DeepFilterNet → light compression (`acompressor=threshold=-18dB:ratio=3:attack=5:release=100`) → loudnorm.

### 3.8 Voice (local TTS)
| Model | License | Notes |
|---|---|---|
| **Kokoro-82M** | Apache-2.0 | 82M params, 54 voices / 8 langs (EN, JA, ZH, FR, IT, PT, ES, HI), CPU-fast, ONNX build (`kokoro-onnx`). `pip install kokoro soundfile`; `KPipeline(lang_code='a')(text, voice='af_heart')`. No cloning. Best free default. |
| **Piper** | Engine now GPL-3.0 (`OHF-Voice/piper1-gpl`, `pip install piper-tts`); old MIT repo archived Oct 2025 | Very fast CPU, robotic-ish; per-voice licenses vary (check MODEL_CARD). |
| **Chatterbox / Chatterbox Turbo** (Resemble) | MIT | Zero-shot cloning from ~10 s, emotion control, watermarking (Perth); GPU recommended. Best permissive cloning option. |
| **F5-TTS** | Code MIT, weights **CC-BY-NC-4.0** | Great cloning, non-commercial weights. |
| **Coqui XTTS-v2** | **CPML (non-commercial)**; Coqui company closed | Cloning, 17 langs; avoid for commercial. Community fork `idiap/coqui-ai-TTS` maintains the code. |
| Others to evaluate | — | Orpheus, Dia, Sesame CSM, IndexTTS2, Higgs Audio, VibeVoice — check each license. |
For the user's projects, memory says **ElevenLabs (Smit voice) is the chosen VO** — use local TTS only for scratch/temp VO and timing drafts.

### 3.9 Music generation
- **MusicGen / AudioCraft** (Meta): code MIT, **weights CC-BY-NC-4.0** → not for commercial videos. `pip install audiocraft`; GPU ~16 GB for medium.
- **Stable Audio Open 1.0**: Stability AI Community License — free under $1M annual revenue, 47 s max, good for SFX/loops more than songs. (verify current terms)
- **ACE-Step** (Apache-2.0, verify), **YuE** (Apache-2.0) — full-song open models, GPU-heavy.
- Practical rule: use licensed library music (§4) for finals; generated music is for drafts or where license verified. Beat-sync: `librosa.beat.beat_track` or `aubio` to get beat times, then cut on beats.

### 3.10 Image / video generation (open models)
| Model | License | Hardware (approx.) |
|---|---|---|
| SDXL / SD 3.5 | CreativeML OpenRAIL++ / Stability Community (<$1M rev) | 8–12 GB VRAM |
| FLUX.1 [schnell] | Apache-2.0 | 12 GB+ (fp8/GGUF ~8 GB) |
| FLUX.1 [dev] / Kontext [dev] | FLUX non-commercial (outputs usable commercially per license; verify) | 12–24 GB |
| Qwen-Image | Apache-2.0 | 20+ GB (quantized ~12 GB); excellent text rendering |
| **Wan 2.2 TI2V-5B** | Apache-2.0 | ~11 GB fp16 (8 GB w/ offload/quant); 720p24 5 s clip ≈ 9 min on RTX 4090 |
| Wan 2.2 A14B (T2V/I2V MoE) | Apache-2.0 | 24 GB+ with offload; 80 GB ideal |
| **LTX-2 / 2.3** (Lightricks, Jan/Mar 2026) | LTX model license — free under $10M revenue | 22B DiT w/ synced audio; full 80 GB, distilled FP8 ~32 GB; older LTX-Video 2B/13B runs on 8–16 GB and is very fast |
| HunyuanVideo 1.5 (Nov 2025, 8.3B) | Tencent community license (region restrictions — verify) | ~14 GB min (offload), 480/720p + SR to 1080p |
| CogVideoX-5B | CogVideoX license (commercial registration) | ~12 GB w/ offload, 720×480, aging |
Run them via **ComfyUI** (portable Windows build, NVIDIA) or diffusers. No-GPU laptops: don't — use hosted APIs (fal/Replicate) or skip gen-video entirely; it's also the fastest way to make a video look "AI-ish", which the user explicitly doesn't want. Use gen models for textures, backgrounds, or b-roll inserts at most.

---

## 4. Free asset sources (license cheat-sheet)

| Source | What | License essentials |
|---|---|---|
| **Pexels** (API: `https://api.pexels.com/videos/search?query=…`, header `Authorization: <key>`) | Photos/videos | Free commercial, no attribution required; can't sell unaltered copies or imply endorsement by people/brands shown. API: 200 req/hr, 20k/month default; must show "Photos provided by Pexels" link in apps. |
| **Pixabay** (API: `https://pixabay.com/api/videos/?key=KEY&q=…`) | Photos, videos, music, SFX | Pixabay Content License: free commercial, no attribution; no standalone redistribution; API requires caching results 24h and no hotlinking (download files). Music: Content ID claims possible on some tracks — keep the license certificate. |
| **Mixkit** (Envato) | Videos, music, SFX, templates | Mixkit License free commercial, no attribution; music under "Mixkit Stock Music Free License" — fine for social/YouTube; not for standalone music use. |
| **YouTube Audio Library** | Music + SFX | Free for use in YouTube videos; some tracks require attribution (shown in library). Using outside YouTube: tracks are generally usable elsewhere but terms are YouTube-centric (verify). |
| **Freesound** (API v2) | SFX | Per-sound CC0 / CC-BY / CC-BY-NC — filter `license:"Creative Commons 0"`; credit CC-BY; avoid NC for commercial. |
| **Uppbeat / Free Music Archive / Incompetech** | Music | Free tiers with attribution (Incompetech CC-BY 4.0). |
| **Google Fonts** | Fonts | OFL / Apache — free commercial, embed in video OK. Self-host via `@fontsource/<font>` or `@remotion/google-fonts`. |
| **Lucide** (ISC), **Iconify** (aggregator — check each set: Material Symbols Apache-2.0, Tabler MIT, Phosphor MIT, Simple Icons CC0 but brand logos are trademarks), **Heroicons** (MIT) | Icons | Use `https://api.iconify.design/{prefix}/{name}.svg` to fetch SVGs on demand. |
| **LottieFiles** free | Animations | Lottie Simple License (free commercial), verify per asset. |
| **unDraw / Storyset / Open Peeps** | Illustrations | unDraw free commercial no attribution; Storyset needs attribution on free plan. |
| **Coverr, Videvo (mixed), Mazwai** | Stock video | Check per-clip; Videvo mixes free/premium/attribution. |
Agent rule: log every asset (URL, author, license, date) in an `assets/LICENSES.md`/ledger in the project; download files locally (never hotlink in renders).

---

## 5. Recommended default stacks

### 5.1 Windows laptop, no discrete GPU (e.g. Zenbook, Intel Iris Xe / Arc iGPU)
- **Runtime**: Node 22 LTS, Python 3.11/3.12 (via `uv`), `winget install Gyan.FFmpeg`, Git for Windows (bash), Git LFS.
- **Compose**: HyperFrames (default, Apache-2.0) or Remotion (if ≤3-person team or licensed). Preview at half scale; final 1080p renders at `--concurrency` ≈ physical cores; 4K is feasible but slow (budget minutes per 10 s) — do it once at the end.
- **Encode**: libx264 `-preset slow -crf 18` for finals; `h264_qsv`/`hevc_qsv` for drafts (Intel iGPU).
- **Transcribe**: faster-whisper `large-v3-turbo` int8 CPU (or `distil-large-v3`/`small.en` for speed); whisper.cpp with Vulkan can use the iGPU.
- **Cut/clean**: auto-editor binary; DeepFilterNet; ffmpeg loudnorm 2-pass.
- **Reframe**: MediaPipe / OpenCV YuNet (CPU realtime-ish).
- **Matting**: rembg (stills); RVM mobilenetv3 at reduced res for short clips only.
- **Upscale/interp**: Real-ESRGAN/RIFE ncnn-vulkan only for short shots.
- **Voice**: ElevenLabs for final (user preference); Kokoro for scratch.
- **Gen-video/image/music**: none locally; use licensed stock + illustrated motion graphics.

### 5.2 Windows with NVIDIA GPU (≥12 GB VRAM; 24 GB ideal)
- Everything above, plus: NVENC (`h264_nvenc -preset p7 -cq 19`, `hevc_nvenc`, `av1_nvenc` on RTX 40+) for fast high-bitrate masters; `-hwaccel cuda` decode.
- faster-whisper / whisperX on CUDA float16 (minutes of audio in seconds) with forced alignment for karaoke captions.
- RobustVideoMatting / SAM 2 for real-time matting; Real-ESRGAN / RIFE at usable speeds.
- Chatterbox (MIT) for local voice cloning drafts.
- ComfyUI portable: FLUX.1 schnell / Qwen-Image for stills; Wan 2.2 TI2V-5B (Apache-2.0) or LTX-Video distilled for short b-roll; HunyuanVideo 1.5 for higher quality if 16–24 GB.
- Remotion/HyperFrames: `--gl=angle` (or `egl`/`vulkan` where supported) so WebGL/Three.js scenes use the GPU.

### 5.3 Agent workflow skeleton
1. Intake → script → storyboard (beats + timings).
2. VO first (ElevenLabs/Kokoro) → transcribe with word timestamps → beat sheet.
3. Build composition (HyperFrames/Remotion), drive all timing from the timestamp JSON; render key stills for QA (`snapshot` / `remotion still`).
4. Render silent video (PNG/JPEG frames, CRF 16–18).
5. Mix audio in ffmpeg: VO (denoised) + music (ducked) + SFX → loudnorm −14 LUFS / −1.5 dBTP.
6. Mux: `ffmpeg -i video.mp4 -i mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart final.mp4`.
7. Verify: ffprobe specs, decode pass, loudness check, spot-check frames (`ffmpeg -ss 12 -i final.mp4 -frames:v 1 check.png`), contact sheet (`ffmpeg -i final.mp4 -vf "fps=1/5,scale=320:-1,tile=6x4" sheet.png`).
8. Deliver with a license ledger for all assets.

---

## Sources
- Remotion license/pricing: https://www.remotion.pro/license ; https://www.remotion.dev/docs/license
- Remotion client-side rendering: https://www.remotion.dev/docs/client-side-rendering ; https://www.remotion.dev/docs/web-renderer/
- Remotion docs (transitions, captions, media-utils, motion-blur, player): https://www.remotion.dev/docs/transitions ; https://www.remotion.dev/docs/captions/api ; https://www.remotion.dev/docs/media-utils ; https://www.remotion.dev/docs/motion-blur ; https://www.remotion.dev/docs/player
- Remotion release v4.0.491: https://newreleases.io/project/github/remotion-dev/remotion/release/v4.0.491
- HyperFrames: https://github.com/heygen-com/hyperframes
- Revideo: https://github.com/redotvideo/revideo (→ midrender/revideo) ; https://docs.re.video/
- Comparison: https://www.pkgpulse.com/guides/remotion-vs-motion-canvas-vs-revideo-programmatic-video-2026
- Motion Canvas: https://motioncanvas.io/blog/version-3.3.0
- MoviePy: https://github.com/Zulko/moviepy ; https://pypi.org/project/moviepy
- Manim: https://docs.manim.community/
- Editly: https://github.com/mifi/editly
- GSAP free license: https://gsap.com/licensing/
- FFmpeg filters docs: https://ffmpeg.org/ffmpeg-filters.html (silencedetect, silenceremove, loudnorm, sidechaincompress, xfade, zoompan, subtitles, drawtext) ; https://trac.ffmpeg.org/wiki/Concatenate ; https://trac.ffmpeg.org/wiki/Seeking ; https://trac.ffmpeg.org/wiki/Encode/H.264 ; https://docs.nvidia.com/video-technologies/video-codec-sdk/ffmpeg-with-nvidia-gpu/
- auto-editor: https://github.com/wyattblue/auto-editor ; https://auto-editor.com/installing
- faster-whisper / turbo: https://github.com/SYSTRAN/faster-whisper ; https://dev.classmethod.jp/articles/openai-whisper-large-v3-turbo-faster-whisper/ ; https://aivideosensei.com/guides/run-whisper-locally-guide
- whisperX: https://github.com/m-bain/whisperX ; whisper.cpp: https://github.com/ggml-org/whisper.cpp
- PySceneDetect: https://www.scenedetect.com/
- MediaPipe: https://ai.google.dev/edge/mediapipe ; Ultralytics license: https://www.ultralytics.com/license
- rembg: https://github.com/danielgatis/rembg ; BiRefNet: https://github.com/ZhengPeng7/BiRefNet ; RVM: https://github.com/PeterL1n/RobustVideoMatting
- Real-ESRGAN: https://github.com/xinntao/Real-ESRGAN ; RIFE ncnn: https://github.com/nihui/rife-ncnn-vulkan
- DeepFilterNet: https://github.com/Rikorose/DeepFilterNet ; RNNoise models: https://github.com/GregorR/rnnoise-models
- Kokoro: https://huggingface.co/hexgrad/Kokoro-82M ; https://www.promptlayer.com/models/kokoro-82m
- Piper: https://github.com/OHF-Voice/piper1-gpl ; https://www.promptquorum.com/power-local-llm/piper-tts-review
- F5-TTS license: https://soniqo.audio/guides/f5-tts ; Chatterbox: https://resemble.ai/chatterbox ; Coqui fork: https://github.com/idiap/coqui-ai-TTS
- AudioCraft/MusicGen: https://github.com/facebookresearch/audiocraft ; Stable Audio Open: https://huggingface.co/stabilityai/stable-audio-open-1.0
- Wan 2.2 VRAM: https://evezone.evetech.co.za/daily-drop/wan-2-2-hits-local-rigs-720p-video-on-24gb-of-vram ; https://www.spheron.network/tools/gpu-recommender/Wan-AI/Wan2.2-TI2V-5B-Diffusers/ ; https://github.com/Wan-Video/Wan2.2
- LTX-2: https://magichour.ai/blog/ltx-2-3-vs-wan-2-2 ; https://invideo.io/blog/ltx-ai-video-generator/ ; https://ltx.io/blog/open-source-video-generation-models-guide
- HunyuanVideo 1.5: https://huggingface.co/tencent/HunyuanVideo-1.5 ; https://docs.comfy.org/tutorials/video/hunyuan/hunyuan-video-1-5.md ; https://canirun.ai/model/hunyuan-video-1.5/
- Pexels API/license: https://www.pexels.com/api/documentation/ ; https://www.pexels.com/license/
- Pixabay API/license: https://pixabay.com/api/docs/ ; https://pixabay.com/service/license-summary/
- Mixkit license: https://mixkit.co/license/ ; Freesound API: https://freesound.org/docs/api/ ; YouTube Audio Library: https://support.google.com/youtube/answer/3376882
- Google Fonts FAQ: https://developers.google.com/fonts/faq ; Lucide: https://lucide.dev/license ; Iconify API: https://iconify.design/docs/api/
