# 04 — AI Generation Tools & APIs for Autonomous Video Production (state as of Oct 2026)

Purpose: give a video-producing agent a reliable map of **which paid AI tools to call when the user has access, how to call them, what they cost, and what open-source fallback to use otherwise**. Prices move monthly; treat every number as "verify on the official pricing page before a large spend" and log the price you actually used. Figures marked (3p) came from third-party trackers rather than the vendor page.

---

## 0. Agent operating rules (read first)

1. **Detect access, never assume it.** Check env vars (`ELEVENLABS_API_KEY`, `OPENAI_API_KEY`, `HEYGEN_API_KEY`, `FAL_KEY`, `REPLICATE_API_TOKEN`, `RUNWAYML_API_SECRET`, `GEMINI_API_KEY`/`GOOGLE_API_KEY`, `BFL_API_KEY`, `LUMAAI_API_KEY`, `HIGGSFIELD_*`, etc.) and connected MCP servers (`mcp__elevenlabs__*`, `mcp__heygen__*`, Higgsfield, OpusClip, Descript). Ask the user once which subscriptions they hold; record in project state.
2. **Verify cheap before you spend.** Run one short/low-res test (5 s at 480–720p, one image at 1K, 1 sentence of TTS) and show it before batch generation. Video generation is the only line item that can silently cost tens of dollars.
3. **Every gen call is async.** Pattern for all video/avatar APIs: `POST` job → get `id` → poll status (or webhook) with backoff (5–15 s) → download output URL immediately (most URLs expire in 1–24 h) → save locally with a ledger entry (tool, model, params, seed, cost, prompt, license note).
4. **Prefer aggregators for breadth** (fal.ai, Replicate, Higgsfield API, Runway's model router) — one key, one billing balance, many models. Use first-party APIs when the user already pays for them, or for features aggregators lack (ElevenLabs voice clones, HeyGen personal avatars).
5. **Keep a fallback chain per capability** (Section 9). If a paid call fails (quota, 402, moderation), fall back rather than stall, and tell the user.
6. **Legal gate** before using any cloned voice, real-person likeness, or generated music in a commercial deliverable (Section 11).

---

## 1. Voice / TTS

### 1.1 ElevenLabs (default premium voice; user's preferred tool)
- **Best at:** most natural, emotive narration; voice cloning; audio tags; one vendor for TTS + STT + SFX + music + dubbing.
- **Auth:** header `xi-api-key: sk_...` (keys start `sk_`). Env var `ELEVENLABS_API_KEY`. Base `https://api.elevenlabs.io`. SDKs: `pip install elevenlabs`, `npm i @elevenlabs/elevenlabs-js`.
- **Current model IDs** (official models page):
  | model_id | Use | Char limit / latency |
  |---|---|---|
  | `eleven_v4` | newest, most emotive, multi-speaker; 90+ langs | 10,000 chars |
  | `eleven_v4_turbo` | real-time (~100 ms), audio tags | — |
  | `eleven_v3` | expressive, audio tags, multi-speaker dialogue; 70+ langs | 5,000 chars |
  | `eleven_v3_conversational` | real-time (~280 ms) | — |
  | `eleven_multilingual_v2` | **most stable on long-form** narration; 29 langs | 10,000 chars |
  | `eleven_flash_v2_5` / `eleven_flash_v2` | ~75 ms, half price | 40k / 30k chars |
  | `eleven_multilingual_sts_v2` | speech-to-speech (voice changer) | 10,000 |
  | `eleven_ttv_v3` | Voice Design (text → new voice) | — |
  | `scribe_v2` / `scribe_v2_realtime` | STT with word timestamps, diarization (32 spk) | batch / ~150 ms |
  | `music_v2_5`, `music_v2` | Eleven Music (`music_v1` deprecated) | — |
  | `eleven_text_to_sound_v2` | sound effects | — |
- **Key endpoints:**
  - `POST /v1/text-to-speech/{voice_id}` — body `{text, model_id, voice_settings:{stability, similarity_boost, style, use_speaker_boost, speed}, seed, previous_text, next_text}`; query `output_format=mp3_44100_128 | pcm_44100 | wav_...`.
  - `POST /v1/text-to-speech/{voice_id}/with-timestamps` — returns JSON `{audio_base64, alignment:{characters[], character_start_times_seconds[], character_end_times_seconds[]}, normalized_alignment}`. **Use this for karaoke captions and beat/cut timing** — no separate transcription pass needed. Streaming variant: `/stream/with-timestamps`. Text-to-Dialogue also has `convert-with-timestamps`.
  - `POST /v1/speech-to-speech/{voice_id}` — re-voice a performance (keep the user's timing/intonation, swap timbre).
  - `POST /v1/voices/add` (Instant Voice Clone, multipart files); Professional Voice Clone via dashboard with live verification.
  - `POST /v1/sound-generation` — `{text, duration_seconds (0.5–30), prompt_influence, loop}`.
  - `POST /v1/music` (SDK `music.compose(prompt, music_length_ms, model_id)`), also composition-plan / section-level editing in Music v2.
  - `POST /v1/dubbing`, `POST /v1/audio-isolation`, `POST /v1/speech-to-text`.
- **v3/v4 audio tags:** inline square-bracket directions: `[whispers] [laughs] [sighs] [exhales] [shouting] [excited] [sarcastically] [nervous] [curious] [slowly] [quickly] [softly] [chuckles] [gasps]`, plus SFX-like `[applause]`. Rules: 1–2 tags per spot; tags must fit the voice (a soft voice won't truly shout); **lower stability (0.3–0.5 "Creative") = tags obeyed more; 0.7+ "Robust" flattens them**. Punctuation, ellipses and CAPS also steer delivery. For long, stable VO prefer `eleven_multilingual_v2`; for hooks/character lines use v3/v4 with tags.
- **API pay-as-you-go pricing (official API pricing page, Oct 2026):** TTS per 1K chars: v4 $0.08 list (promo $0.022 until 12 Oct 2026), v4 Turbo $0.04, v3 $0.08, v2 Multilingual $0.08, Flash/Turbo $0.04. Music $0.15/min; SFX $0.12/min; Voice Changer $0.12/min; Voice Isolator $0.12/min; Dubbing v1 $0.33/min (watermarked) or $0.50; Dubbing v2 $2.20/min; Scribe v2 $0.22/hour. ~1,000 chars ≈ 1 min speech → **~$0.04–0.08 per narrated minute**. Subscriptions: Free 10k credits, Starter $5 (30k), Creator $22 (100k), Pro $99 (500k) (3p).
- **Licensing:** commercial use requires a paid plan (Starter+); free tier requires attribution and is non-commercial. Music: broad online/offline commercial use on self-serve plans; film/TV/large games need Enterprise; prompts may not name artists/songs or include copyrighted lyrics (Music Terms).
- **MCP:** official `elevenlabs/elevenlabs-mcp` — `uvx elevenlabs-mcp` with env `ELEVENLABS_API_KEY`; tools for TTS, STT, SFX, voice clone/design, voice listing, conversational agents. Writes files to a configurable output dir (`ELEVENLABS_MCP_BASE_PATH`).
- **Fallback:** Kokoro-82M (Apache-2.0, fast, no cloning) for neutral narration; Chatterbox (MIT, cloning + paralinguistics) when a cloned/expressive voice is needed; Higgs Audio v2 / VibeVoice for multi-speaker; OpenAI TTS as cheap paid fallback.

### 1.2 OpenAI TTS — `gpt-4o-mini-tts`
- **Best at:** cheap, *instructable* delivery ("speak like a calm late-night radio host"). No custom voice cloning; fixed preset voices (alloy, ash, ballad, coral, echo, fable, nova, onyx, sage, shimmer, verse, etc.).
- **Call:** `POST https://api.openai.com/v1/audio/speech` `{model:"gpt-4o-mini-tts", voice, input, instructions, response_format:"mp3|wav|opus|aac|flac|pcm", speed}`; `Authorization: Bearer $OPENAI_API_KEY`. Input ≤ ~2,000 tokens per call — chunk scripts.
- **Price:** $0.60/1M text input tokens + $12/1M audio output tokens ≈ **$0.015/min**. Legacy `tts-1`/`tts-1-hd` still per-character.
- **Licensing:** OpenAI usage policies require disclosing to listeners that the voice is AI-generated.
- **No timestamps** — run Whisper/WhisperX or ElevenLabs Scribe afterwards for captions.

### 1.3 Cartesia (Sonic 3.x)
- **Best at:** ultra-low-latency streaming (voice agents), good emotion control, instant cloning. Overkill for offline video but fine.
- **Call:** `POST https://api.cartesia.ai/tts/bytes` (or WebSocket), headers `X-API-Key`, `Cartesia-Version`. Env `CARTESIA_API_KEY`. Returns word timestamps on the WebSocket API.
- **Price:** 1 credit/char (~$49/1M chars normalized on Startup tier); Pro Voice Clone 1.5 credits/char; plans from $5/mo (instant clone) and $49/mo (pro clone) (3p).

### 1.4 PlayHT — **discontinued**
Acquired by Meta (July 2025); API offline, service terminated 31 Dec 2025, voice clones deleted. Remove from any routing table.

### 1.5 Google Cloud TTS / Azure Speech
- **Google:** Chirp 3 HD voices $30/1M chars; WaveNet/Neural2 cheaper; Gemini TTS models also available via Gemini API. Auth via service account / `GOOGLE_APPLICATION_CREDENTIALS`. SSML + timepoints (`<mark>`) give timestamps.
- **Azure:** Neural $16/1M chars, Neural HD $22/1M (cut from $30 in Mar 2026), 500K chars/mo free; SSML, viseme + word-boundary events (great for lip-sync data); Custom Neural Voice requires approval + talent consent statement. Env `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`.
- **When:** enterprise users already on GCP/Azure, many languages, need SSML precision or free tier.

---

## 2. Avatars & lip-sync

### 2.1 HeyGen
- **Best at:** turnkey talking-head avatars (stock or user "digital twin"), Avatar IV photo-to-video, translation/dubbing with lip-sync, Video Agent (prompt → finished video).
- **Auth:** header `X-Api-Key: <key>` (Settings → API). Env convention `HEYGEN_API_KEY`. Base `https://api.heygen.com`.
- **Endpoints:** `POST /v2/video/generate` — `video_inputs[]` per scene: `{character:{type:"avatar"|"talking_photo", avatar_id, avatar_style}, voice:{type:"text"|"audio", input_text, voice_id | audio_url}, background:{type:"color"|"image"|"video"}}`, `dimension:{width,height}`, `caption`. Poll `GET /v1/video_status.get?video_id=...`. List `GET /v2/avatars`, `GET /v2/voices`. Upload assets via `upload.heygen.com/v1/asset`. Also Avatar IV, Video Translate (`/v2/video_translate`), and Video Agent endpoints (v3 generation family). **Feed it ElevenLabs audio (`voice.type:"audio"`) for best voice quality.**
- **MCP / skills:** official HeyGen MCP server and "HeyGen Skills for Claude Code"; prefer MCP tools when present; use raw `/v2/video/generate` when you need exact script, per-scene avatars/backgrounds or precise timing.
- **Pricing:** API is billed from a USD wallet separate from Studio plans ($5 minimum top-up). Video Agent ≈ $0.033/s (~$2/min); Avatar IV variants $0.05–0.10/s (~$3–6/min) (3p, verify).
- **Latency:** ~1–3× real time for standard avatars; longer for Avatar IV.
- **Fallback:** Sync Labs / open-source lip-sync over user-recorded or stock footage; or no avatar (illustrated video).

### 2.2 Synthesia
- Corporate training avatars, 140+ languages, SOC2. API (`POST https://api.synthesia.io/v2/videos`, header `Authorization: <API_KEY>`) requires **Creator plan or higher** (~$89/mo or $59/mo annual); usage draws from plan credits. ~1–2 min render per output minute. Template-based (`/v2/videos/fromTemplate`) is ideal for agents.

### 2.3 D-ID
- Photo → talking head ("talks"), streaming agents. `POST https://api.d-id.com/talks` with `{source_url, script:{type:"text"|"audio", ...}}`, Basic auth with API key. API plans: Build $14.40/mo (~16 min), Launch $35/mo (~45 min), Scale $138.60/mo (~200 min) → ~$0.70–0.90/min. Quality now behind HeyGen/Hedra; use for cheap single-photo talkers.

### 2.4 Hedra (Character-3)
- Expressive image+audio → talking character (works for stylized/non-human faces). API at `api.hedra.com` (header `X-API-Key`), plans $15–75/mo; Character-3 = 6 credits/s. Also resells third-party models (Hailuo etc.).

### 2.5 Sync Labs (sync.so) — lip-sync on existing footage
- **Best at:** re-syncing mouths on *real* video to new audio (fix a line, dub, ElevenLabs re-voice). Models: `lipsync-2`, `lipsync-2-pro` (and newer).
- **Call:** `POST https://api.sync.so/v2/generate` `{model, input:[{type:"video",url},{type:"audio",url}], options:{sync_mode}}`, header `x-api-key`. SDK `syncsdk` (py/ts). Also on fal (`fal-ai/sync-lipsync/v2`).
- **Price:** lipsync-2-pro $0.00267–0.00333/frame ≈ **$0.067–0.083/s** at 25 fps (~$4–5/min).
- **Fallback:** LatentSync (ByteDance, Apache-2.0, sharp diffusion output), MuseTalk (Tencent, MIT, real-time-ish), Wav2Lip (research license — avoid commercially).

### 2.6 Captions.ai (Mirage API)
- API for auto-captions ($0.15/min of input, rounded up to minute), AI Creator / AI Ads generation with community avatars or the user's AI Twin (Mirage Video 1 $0.175/s, billed in 6-s increments), lip-sync dubbing in 30+ langs. Header `x-api-key`.

---

## 3. Video generation (text/image → video)

Common contract: prompt + optional start/end frame + optional reference images/video, duration (4–15 s typical), aspect (16:9/9:16/1:1), resolution; returns MP4 URL. Many 2026 models generate **native synced audio** (dialogue/SFX) — disable it when you'll add your own VO/music (it usually costs extra).

| Model / access | Strength | List price (per second of output) |
|---|---|---|
| **Google Veo 3.1** (Gemini API `veo-3.1-generate-preview` etc.; Vertex AI) | cinematic realism, native audio, reference images, first/last frame, extend | Standard $0.40/s (720p/1080p), $0.60 4K; Fast $0.10–0.12, 4K $0.30; Lite $0.05–0.08. No free tier. (3p) |
| **Gemini Omni Flash** (new 2026 omni model; also on Runway) | cheap 720p, 10 s clips, multimodal inputs | ≈ $0.10/s (token-billed, 5,792 tok/s) |
| **OpenAI Sora 2 / Sora 2 Pro** (`POST /v1/videos`, poll `GET /v1/videos/{id}`, download `/content`) | physics, cameo/likeness features, synced audio | sora-2 720p $0.10/s; sora-2-pro $0.30 (720p) / $0.50 (1024p) / $0.70 (1080p); Batch tier 50% off |
| **Runway** (`api.dev.runwayml.com`, header `Authorization: Bearer $RUNWAYML_API_SECRET` + `X-Runway-Version`; SDK `runwayml`) | Gen-4.5, Gen-4 Turbo, **Aleph** (video-to-video edit), **Act-Two** (performance capture onto character), plus routed third-party models (Seedance 2.5, Wan 3.0, Gemini Omni, Grok Imagine) | credits $0.01 each: gen4_turbo 5 cr/s ($0.05), gen4.5 12 ($0.12), gen4_aleph 15 ($0.15), act_two 5 ($0.05); Seedance 2.5 20 cr/s @480p |
| **Kling 3.0** (official API `api-singapore.klingai.com`, JWT from AccessKey/SecretKey; also fal/Higgsfield/Atlas) | motion quality, character consistency, lip-sync, native audio | 6 cr/s 720p silent → 12 cr/s 1080p with audio; prepaid resource packs from $9.8. Via aggregators ~$0.11–0.17/s |
| **Seedance 2.5** (ByteDance; BytePlus ModelArk internationally) | multi-shot narrative, prompt adherence, cheap | ~$0.10/s @480p, ~$0.23/s @720p on ModelArk; Higgsfield from $0.074/s |
| **MiniMax Hailuo 2.3 / H3** (`platform.minimax.io`, Bearer key) | dynamic human motion, cheap | Hailuo 2.3 Fast $0.19 (768p/6 s) – $0.33 (1080p/6 s); H3 ~$0.13/s via Higgsfield |
| **Luma Ray3 / Ray 3.14** (`api.lumalabs.ai/dream-machine/v1/generations`, Bearer `LUMAAI_API_KEY`, SDK `lumaai`) | HDR, keyframes, modify-video, good camera | Ray3.14 ~100 credits/5 s @720p SDR, 400 @1080p; Ray2 ≈ $0.60–1.05 per 5-s clip (3p). API billed separately from web plans |
| **Pika 2.x** (API only via fal) | Pikaframes keyframe interpolation, stylized effects | per fal listing |
| **Higgsfield** (see 3.1) | one key → 50+ models + own Soul/DoP | Kling 2.5 $0.042/s, Seedance 2.5 $0.074/s, Kling 3.0 $0.112/s, Wan 3.0 $0.20/s |

### 3.1 Higgsfield
- **Two products — don't confuse them:** (a) **Higgsfield web/app + Higgsfield MCP** (connects Claude to the user's existing Higgsfield account; spends *plan credits*), (b) **Higgsfield API** — separate developer product, prepaid USD balance, no subscription, public per-model price list.
- **Models routed:** Seedance (2.x/2.5), Kling (2.5/3.0), Wan (incl. 3.0), MiniMax (Hailuo/H3), LTX, PixVerse, Grok Imagine; images: Recraft, Ideogram, plus own **Soul 2** ($0.0032/img — photoreal fashion/UGC look), Soul Cinema, **DoP** (camera-move presets), Marketing Studio Image.
- **Call pattern:** Python/TypeScript SDK or REST; async submit → request ID → poll or webhook → download. API key shown once. Commercial use of API output allowed (ads, client work).
- **When:** user already has Higgsfield, or wants "viral camera move" presets and cheap multi-model access in one bill.

### 3.2 Aggregators: fal.ai and Replicate
- **fal.ai** — env `FAL_KEY`; `pip install fal-client` / `npm i @fal-ai/client`. `fal_client.subscribe("fal-ai/veo3.1", arguments={...}, with_logs=True, on_queue_update=...)` (blocks with auto-polling) or `fal.queue.submit/status/result/cancel`; REST at `https://queue.fal.run/{model_id}` with `Authorization: Key $FAL_KEY`. Upload local files with `fal_client.upload_file()`. 1,000+ models (Veo, Kling, Seedance, Wan, Pika, Hailuo, Sync lip-sync, ElevenLabs, Flux, Recraft, Ideogram, MMAudio). Prepaid credits; **only successful outputs billed**; pricing queryable via Platform API. Usually the fastest path to try any model.
- **Replicate** — env `REPLICATE_API_TOKEN`, `Authorization: Bearer`. Official models: `POST /v1/models/{owner}/{name}/predictions` (no version hash; always warm, stable schema, billed per output); community models billed per GPU-second (cold boots). Add header `Prefer: wait` for sync up to 60 s; else poll `GET /v1/predictions/{id}`. Python: `replicate.run("owner/model", input={...})`. Also hosts open-source fallbacks (Wan, LTX, Kokoro, MusicGen, LatentSync) — handy when the user has no GPU.
- **Runway model router** and **Higgsfield API** play the same role inside their ecosystems.

### 3.3 Open-source video fallbacks
- **Wan 2.2** (Alibaba, MoE 27B, **Apache-2.0**, no revenue/territory limits) — safest commercial local model; 720p, ~5 s. Note Wan 2.5–2.7 / 3.0 are API-only.
- **LTX-2 / 2.3** (Lightricks; up to 4K/50 fps with synced audio, ~20 s) — open weights free for commercial use **only for companies under $10M revenue**.
- **HunyuanVideo 1.5** — license **excludes EU, UK, South Korea** for model *and outputs*; avoid for global clients.
- Run via ComfyUI locally (12–24 GB+ VRAM) or on Replicate/fal. Honest note: for crafted brand videos, code-driven motion graphics (HyperFrames/Remotion) beat any generator; use gen-video for B-roll/atmosphere only.

---

## 4. Image generation

| Tool | Best for | API | Price |
|---|---|---|---|
| **OpenAI GPT Image 2** (`gpt-image-2`; `gpt-image-1.5` retires 1 Dec 2026; `gpt-image-1` legacy) | text rendering in images, edits with masks, instruction following, transparent PNG | `POST /v1/images/generations` and `/v1/images/edits` `{model, prompt, size, background:"transparent", n}`; returns base64 | $0.03 (1K) / $0.05 (2K) / $0.08 (4K) per image; gpt-image-1.5 $0.009–0.20 by quality/size |
| **FLUX.2** (Black Forest Labs) | photoreal, multi-reference consistency, fast/cheap variants | `POST https://api.bfl.ai/v1/flux-2-pro` (also `-max`, `-flex`, `-klein-4b/9b`), header `x-key: $BFL_API_KEY`; async → poll `polling_url` | klein from $0.014/img; pro from $0.03/MP; max from $0.07/img |
| **Ideogram 3.0** | typography/posters/logo-like text | `POST https://api.ideogram.ai/v1/ideogram-v3/generate`, header `Api-Key` | Flash/Turbo $0.03, Default $0.06, Quality $0.09; character-reference $0.10–0.20 |
| **Recraft V3 / V4** | **native SVG vectors**, icons, brand-style consistency (custom styles from brand images) | `https://external.api.recraft.ai/v1/images/generations` (OpenAI-compatible), Bearer token | V3 raster $0.04, **V3 vector $0.08**; $1 = 1,000 units |
| **Midjourney** | aesthetic look | **No official API** (as of Aug 2026); ToS forbids automated access — never automate it; ask the user to generate manually and drop files in | sub from $10/mo |
| **Higgsfield Soul 2** | cheap photoreal people/fashion | Higgsfield API | $0.0032/img |
| **Google Nano Banana / Imagen** (Gemini API) | fast edits, consistency | Gemini API `GEMINI_API_KEY` | per image |

- **Open-source fallback:** FLUX.1 [schnell] (Apache-2.0, commercial OK); FLUX.2 [klein] open weights (check license per size); FLUX.1 [dev] is **non-commercial** weights (outputs are allowed commercially per BFL license, but check); SDXL (OpenRAIL++). For icons/diagrams prefer code-drawn SVG over any generator.

---

## 5. Music

| Tool | API status | Commercial use | Notes |
|---|---|---|---|
| **ElevenLabs Music** (`music_v2_5`) | **Yes** — `POST /v1/music`, also composition plans + section editing; via MCP | Self-serve paid plans: broad online/offline commercial; film/TV/big games = Enterprise | $0.15/min API. Trained on licensed data. Can do instrumental-only, target length in ms. **Default choice for this user.** |
| **Stable Audio 2.5** (Stability AI) | Yes — `POST https://api.stability.ai/v2beta/audio/stable-audio-2/text-to-audio`, Bearer key | Licensed training (AudioSparx); commercial per Stability license tier (Community License free < $1M revenue) | ~$0.20/generation (20 credits); up to ~3 min; good for beds/loops, audio-to-audio |
| **Suno** | **No self-serve public API** (partner pilot only, Sept 2026). Third-party "Suno APIs" are unofficial scrapers — **do not use** (ToS + account-ban risk) | Paid Suno plans grant commercial rights for songs made while subscribed; WMG-licensed models rolling out | Ask user to export tracks manually if they want Suno |
| **Udio** | No API; post-UMG/WMG settlements it is transitioning to a licensed "walled garden"; downloads restricted | Not reliable for commercial delivery right now | Avoid |
| **Licensed libraries** (Artlist, Epidemic, Musicbed) | Some have APIs (Epidemic) | Clear licenses | Often better than gen-music for brand work |

- **Open-source fallback:** **ACE-Step 1.5** (MIT, Jan 2026, trained on licensed/royalty-free data, full songs in seconds on a 3090); MusicGen/AudioCraft (weights CC-BY-NC — **non-commercial**, avoid for clients); Stable Audio Open (small, Stability Community License).
- **SFX fallback:** ElevenLabs SFX ($0.12/min) → MMAudio / Stable Audio Open (local) → CC0 libraries (freesound CC0 filter, Sonniss GDC bundles).

---

## 6. Editing / repurposing SaaS — which have APIs

| Tool | API? | How | Use for agent |
|---|---|---|---|
| **OpusClip** | **Yes** (Pro beta, Max, Business) | REST `https://api.opus.pro` Bearer key; OpenAPI spec; **hosted MCP (26 tools)**, CLI, Agent Skill, Claude connector, HMAC webhooks | long video → ranked viral shorts with captions/reframe |
| **Vizard** | Yes | REST (docs.vizard.ai), submit project with `clipModel: clip_v1 | clip_v2` (v2 = 1.25× cost, fewer, better clips); webhooks; n8n integration | same as OpusClip, cheaper |
| **Descript** | **Yes — public API open beta (2026)**, MCP-capable | import media, create projects, run Underlord actions (Studio Sound, filler removal, captions, translation), export | audio cleanup + transcript-based editing of founder footage |
| **Submagic** | Yes (Business+API tier ~$69/mo) | `api.submagic.co` — subtitle generation (SRT/VTT/JSON, 100+ langs), burned-in styled captions (`overlay=true`), templates | trendy animated captions when user prefers their style |
| **Captions.ai** | Yes (Mirage API) | captions $0.15/min; AI Creator/Ads; dubbing | captions + avatar ads |
| **CapCut / VEED / Canva** | No general public generation API (Canva has Connect API/MCP for designs) | — | manual only |

- **Open-source fallback for repurposing:** WhisperX (word-level timestamps) + an LLM to pick highlights + FFmpeg cut/reframe (face tracking with MediaPipe/YOLO) + code-rendered captions (HyperFrames/Remotion). Background removal: RMBG/BiRefNet, rembg. Audio cleanup: DeepFilterNet, Demucs (stem separation), or ElevenLabs Voice Isolator.

---

## 7. MCP servers worth wiring

| MCP | Source | Spends |
|---|---|---|
| ElevenLabs | official `uvx elevenlabs-mcp`, env `ELEVENLABS_API_KEY` | API credits |
| HeyGen | official MCP + HeyGen Skills for Claude Code | API wallet / plan |
| Higgsfield | official MCP/plugin (account-linked) | **plan credits**, not API dollars |
| OpusClip | hosted MCP, 26 tools | plan |
| Descript | MCP via public API | plan |
| fal.ai | community + official MCP wrappers exposing any model | fal credits |
| Replicate | official MCP (`replicate-mcp`) | Replicate credits |
| Figma / Canva / Gamma | connectors (already in this environment) | — |
- MCP is convenient but opaque about cost — before bulk jobs, check pricing via REST or ask the user.

---

## 8. Latency rules of thumb
- TTS: 0.1–3 s per paragraph; with-timestamps the same. Music: 10–60 s per track. SFX: 2–10 s.
- Image: 3–30 s (GPT Image high/4K slowest; FLUX klein / Soul fastest).
- Video gen: 30 s–6 min per 5–10 s clip; queue spikes at peak hours (Veo/Sora/Kling). Budget 2–3 retries per usable shot ("hit rate" 30–60%).
- Avatars: HeyGen/Synthesia ~1–3 min per output minute; Sync lip-sync ~1–2× duration.

---

## 9. Decision matrix — "if user has X → use for Y, else fallback Z"

| Need | 1st choice (if access) | 2nd (paid, cheap/aggregated) | Open-source / free fallback |
|---|---|---|---|
| Narration VO (founder/brand voice) | ElevenLabs cloned voice (user's own verified PVC; e.g. "Smit") `eleven_multilingual_v2` long-form, v3/v4 for hooks | OpenAI gpt-4o-mini-tts with instructions; Azure Neural HD | Chatterbox (clone, MIT) → Kokoro (stock voice, Apache) |
| Word timings for captions | ElevenLabs `/with-timestamps` | ElevenLabs Scribe / OpenAI transcribe | WhisperX (local) |
| Re-voice user's own performance | ElevenLabs speech-to-speech | — | RVC/Seed-VC (only for user's own voice) |
| Talking-head avatar | HeyGen (user's twin, ElevenLabs audio in) | Synthesia / Hedra / D-ID / Captions AI Creator | **Prefer user-filmed footage**; else MuseTalk/LatentSync on a consented photo/video |
| Fix lips after re-voicing | Sync lipsync-2-pro | fal `sync-lipsync` | LatentSync / MuseTalk |
| Cinematic B-roll shot | Veo 3.1 (realism) / Kling 3.0 (motion) / Sora 2 Pro | Higgsfield API or fal (Seedance 2.5, Hailuo, Kling 2.5) | Wan 2.2 local or via Replicate |
| Stylized/edit existing clip | Runway Aleph | Luma modify-video | Wan 2.2 VACE / ComfyUI |
| Performance onto character | Runway Act-Two | Kling/Hedra | LivePortrait (check license) |
| Product/brand stills | GPT Image 2 (text), FLUX.2 pro (photo) | Ideogram (type), Higgsfield Soul 2 | FLUX.1 schnell |
| Icons/vector brand art | Recraft V3/V4 vector | — | code-drawn SVG (best anyway) |
| Background music | ElevenLabs Music (instrumental, exact length) | Stable Audio 2.5; licensed library | ACE-Step 1.5 (MIT) |
| SFX | ElevenLabs SFX | fal MMAudio | CC0 libraries, Stable Audio Open |
| Long → shorts repurposing | OpusClip API/MCP | Vizard API | WhisperX + LLM + FFmpeg |
| Captions styling | Code-rendered (HyperFrames/Remotion) — always available | Submagic / Captions API | — |
| Audio cleanup | ElevenLabs Voice Isolator / Descript Studio Sound | — | DeepFilterNet, Demucs |

Default for this user (from memory): ElevenLabs (Smit voice, not krish) + ElevenLabs Music; crafted/illustrated visuals over generated video; never Midjourney automation; no face on covers.

---

## 10. Cost-per-minute estimates (finished output, list prices, incl. typical retries)

| Component | Low | Typical | High |
|---|---|---|---|
| VO — ElevenLabs v2/v3 | $0.04 (Flash) | $0.08 | $0.10 |
| VO — OpenAI gpt-4o-mini-tts | $0.015 | $0.015 | $0.03 |
| VO — Google/Azure | $0.016 | $0.03 | $0.03 |
| Music — ElevenLabs | $0.15 | $0.15–0.45 (2–3 drafts) | $0.75 |
| SFX — 10 × 3 s cues | $0.06 | $0.10 | $0.20 |
| Avatar — HeyGen | ~$2 (Video Agent) | $3–4 | $6 (Avatar IV) |
| Avatar — D-ID / Hedra | $0.70 | $1–2 | $3 |
| Lip-sync — Sync pro | $4.00 | $4.80 | $5.00 |
| Gen video — budget (Hailuo Fast, Kling 2.5 via Higgsfield, Veo Lite) | $2.50 | $5 | $8 |
| Gen video — mid (Sora 2 720p, Veo Fast, Seedance 720p, Runway Gen-4.5) | $6 | $8–15 | $20 |
| Gen video — premium (Veo 3.1 std $24/min, Sora 2 Pro 1080p $42/min, ×2–3 retries) | $24 | $50–80 | $125+ |
| Images — 20 stills | $0.30 | $1 | $4 |
| Repurposing (OpusClip/Vizard) | plan-based, ~$0.10–0.30 per input minute | | |

Rule: **a 60-s video with full gen-video B-roll at premium tier costs $50–150 in generation alone; the same video with code-driven motion graphics + ElevenLabs VO + ElevenLabs Music costs under $1.** Always show the user an estimate before premium video gen.

---

## 11. Legal & platform notes

### 11.1 Voice cloning consent
- ElevenLabs: you must own or have explicit consent for any cloned voice. **Professional Voice Clone requires live verification by the voice owner and can only clone your own voice on your account**; third parties must create/verify on their own account and share privately. Celebrity/high-risk voices are blocked; impersonating political candidates/officials banned even with authorization. Instant clones cannot be shared in the Voice Library.
- Azure Custom Neural Voice: Microsoft approval + recorded talent consent statement.
- US: state right-of-publicity laws (e.g. Tennessee ELVIS Act covers voice), FTC impersonation rule; the federal NO FAKES Act has been proposed — treat unconsented voice/likeness replicas as unlawful. Agent rule: **only clone the user's own voice or a voice with written consent on file**; never clone public figures.
- OpenAI usage policy: disclose AI-generated voices to listeners.

### 11.2 Likeness / avatars
- HeyGen/Synthesia require on-camera consent video for custom avatars of real people. Sora cameo features are opt-in by the person. Never generate realistic depictions of real, identifiable people (customers, competitors, celebrities) without written release; brand logos of others = trademark risk.
- Model output rights: most vendors (OpenAI, Google, Runway, Higgsfield API, Kling paid, Luma paid) assign output rights to the user on paid tiers; free tiers often restrict commercial use or watermark (Luma free, Kling free, ElevenLabs free, D-ID trial, ElevenLabs Dubbing v1 cheap tier watermark). Veo/Sora/Gemini outputs carry **SynthID / C2PA** provenance; don't try to strip it.

### 11.3 Music licensing
- Use only generators with explicit commercial terms (ElevenLabs Music paid plans, Stable Audio paid/Community tier within revenue limits, ACE-Step MIT). Suno: rights only for songs made on a paid plan; no API. Udio: unreliable during licensing transition. MusicGen weights are non-commercial.
- Don't prompt with artist names/songs/lyrics (ElevenLabs Music Terms prohibit it; also infringement risk).
- Expect occasional Content ID false-positives on YouTube with AI music; keep generation receipts (prompt, date, plan) in the ledger to dispute.

### 11.4 Platform AI-content labelling
- **YouTube:** creators must tick "Altered or synthetic content" in Studio (upload → Details) when realistic content could be mistaken for real: a real person saying/doing things they didn't, altered real events/places, realistic synthetic scenes. Not required for clearly unrealistic/animated content, color/beauty filters, captions, or AI-assisted scripts/ideation. Label shows in description; on the player for sensitive topics. YouTube can auto-apply via C2PA or detection; repeated non-disclosure → penalties/YPP removal. Synthetic voice clones of the creator themselves narrating = generally disclose if it realistically presents them saying it.
- **TikTok:** must turn on "AI-generated content" label for realistic AI images/video/audio; auto-labels via C2PA Content Credentials; unlabeled realistic AIGC can be removed; no AIGC of private people/minors or fake endorsements.
- **Meta (FB/IG/Threads):** "AI info" label auto-applied from C2PA/IPTC metadata or self-disclosed; must disclose photorealistic video / realistic audio made with AI; high-risk deceptive content gets a more prominent label. Ads: political/social-issue ads must disclose digital alteration.
- **EU AI Act Art. 50 (in force 2 Aug 2026):** deployers must label deepfakes (AI-generated/manipulated image, audio, video resembling real people/places/events) — artistic/satirical works get a lighter "appropriate disclosure" duty; Commission Code of Practice (10 Jun 2026) supplies official EU labelling icons and machine-readable marking guidance; legacy generators have until 2 Dec 2026 for machine-readable marking. Applies to EU-audience ads.
- **Agent rule:** keep C2PA/SynthID metadata intact; for any realistic AI person/voice/scene, remind the user to toggle the platform AI label; illustrated/motion-graphics content generally needs no label.

---

## 12. Minimal call snippets (Python)

```python
# ElevenLabs TTS with timestamps
import os, requests, base64
r = requests.post(f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/with-timestamps",
    headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"]},
    params={"output_format": "mp3_44100_128"},
    json={"text": script, "model_id": "eleven_multilingual_v2",
          "voice_settings": {"stability": 0.5, "similarity_boost": 0.8, "style": 0.2}})
j = r.json(); open("vo.mp3","wb").write(base64.b64decode(j["audio_base64"]))
align = j["alignment"]  # characters / *_start_times_seconds / *_end_times_seconds

# ElevenLabs music (instrumental bed, exact length)
m = requests.post("https://api.elevenlabs.io/v1/music",
    headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"]},
    json={"prompt": "warm minimal electronic, 96 bpm, no vocals", "music_length_ms": 62000})
open("bed.mp3","wb").write(m.content)

# fal.ai — any model, auto-polling
import fal_client
res = fal_client.subscribe("fal-ai/kling-video/v2.5-turbo/pro/text-to-video",
    arguments={"prompt": p, "duration": "5", "aspect_ratio": "9:16"}, with_logs=True)
url = res["video"]["url"]

# Replicate — official model
import replicate
out = replicate.run("black-forest-labs/flux-1.1-pro", input={"prompt": p, "aspect_ratio": "16:9"})

# HeyGen — avatar with external ElevenLabs audio
requests.post("https://api.heygen.com/v2/video/generate",
    headers={"X-Api-Key": os.environ["HEYGEN_API_KEY"]},
    json={"video_inputs": [{"character": {"type": "avatar", "avatar_id": AV, "avatar_style": "normal"},
                            "voice": {"type": "audio", "audio_url": VO_URL}}],
          "dimension": {"width": 1080, "height": 1920}})
# poll GET https://api.heygen.com/v1/video_status.get?video_id=...
```
(Model slugs on fal/Replicate change often — list them via the platform's model search before calling.)

---

## Sources
- ElevenLabs models: https://elevenlabs.io/docs/overview/models
- ElevenLabs API pricing: https://elevenlabs.io/pricing/api
- ElevenLabs v3 prompting/audio tags: https://elevenlabs.io/docs/best-practices/prompting ; https://runware.ai/docs/models/elevenlabs-v3/guides/directing-with-audio-tags
- ElevenLabs timestamps: https://elevenlabs.io/docs/api-reference/streaming-with-timestamps ; https://elevenlabs.io/docs/api-reference/text-to-dialogue/convert-with-timestamps.md
- ElevenLabs Music API: https://elevenlabs.io/music-api ; https://elevenlabs.io/docs/api-reference/music/compose ; https://elevenlabs.io/music-terms
- ElevenLabs MCP: https://github.com/elevenlabs/elevenlabs-mcp ; https://mcpservers.org/servers/elevenlabs/elevenlabs-mcp
- ElevenLabs plans (3p): https://bigvu.tv/blog/elevenlabs-pricing-2026-plans-credits-commercial-rights-api-costs/
- ElevenLabs voice consent: https://terms.law/ai-output-rights/elevenlabs/ ; https://elevenlabs.io/docs/help-center/product/voices/voice-library/can-i-share-an-ai-generated-voice-in-the-voice-library
- OpenAI gpt-4o-mini-tts pricing: https://www.llmreference.com/model/gpt-4o-mini-tts/openai-api ; https://techsy.io/en/blog/best-tts-apis-developers
- Cartesia: https://www.eesel.ai/blog/cartesia-sonic-3-pricing ; https://www.layer3labs.io/guides/sonic-3-5-pricing
- PlayHT shutdown: https://anyspeech.io/playht-alternatives ; https://www.aiwiki.ai/wiki/playht
- Google TTS pricing: https://cloud.google.com/text-to-speech/pricing ; Azure: https://texttolab.com/blog/azure-text-to-speech-pricing
- HeyGen: https://docs.heygen.com/docs/quick-start ; https://docs.heygen.com/docs/heygen-skills-for-claude-code ; pricing (3p) https://diyai.io/ai-tools/video-generation/heygen-pricing/
- Synthesia (3p): https://creatify.ai/blog/synthesia-pricing-(2026)-plans-credits-and-what-you-ll-actually-pay
- D-ID (3p): https://creatify.ai/blog/d-id-pricing-(2026)-plans-credits-and-what-you-ll-actually-pay
- Hedra: https://www.hedra.com/pricing ; https://usagepricing.com/blueprint/hedra
- Sync: https://sync.so/docs/product/billing ; https://sync.so/pricing
- Captions/Mirage API: https://captions.ai/help/docs/api/pricing
- Higgsfield API: https://higgsfield.ai/blog/higgsfield-api
- Sora 2 pricing: https://benchlm.ai/md/media-pricing/sora.md
- Veo 3.1 pricing: https://benchlm.ai/md/media-pricing/veo.md
- Gemini Omni: https://www.eesel.ai/blog/gemini-omni-flash-pricing ; https://techsy.io/en/blog/gemini-omni-api-pricing
- Runway API pricing: https://docs.dev.runwayml.com/guides/pricing
- Luma API (3p): https://www.costbench.com/software/ai-media-apis/luma-dream-machine-api/
- Kling API: https://www.atlascloud.ai/blog/tips/kling-ai-api-pricing ; https://evolink.ai/blog/kling-3-o3-api-official-discount-pricing-developers
- Seedance/BytePlus: https://www.atlascloud.ai/blog/guides/best-seedance-2-5-api-providers-compared
- MiniMax Hailuo: https://unifically.com/es/blogs/minimax
- fal.ai: https://docs.fal.ai/documentation/model-apis/pricing ; https://fal.ai/docs/api-reference ; Pika on fal: https://blog.fal.ai/pika-api-is-now-powered-by-fal/
- Replicate: https://replicate.com/docs/topics/models/official-models.md
- GPT Image: https://unifically.com/de/blogs/gpt-image-2 ; https://aireiter.com/blog/gpt-image-1-5-api-pricing
- FLUX.2 / BFL: https://help.bfl.ai/articles/8446125349-quickstart-guide ; https://developer.puter.com/tutorials/flux-api-pricing/
- Ideogram: https://ideogram.ai/features/api-pricing ; Recraft: https://www.recraft.ai/docs/api-reference/pricing
- Midjourney API status: https://www.cometapi.com/does-midjourney-provide-an-api/ ; https://unifically.com/blogs/midjourney-api
- Suno API status: https://sonilo.com/blog/guides/official-suno-api-saas-builders-2026 ; https://aireiter.com/blog/does-suno-have-an-api
- Udio/UMG: https://hollywoodreporter.com/music/music-industry-news/universal-music-group-announces-settlement-with-udio-1236414023 ; https://www.digitalmusicnews.com/2025/10/29/umg-udio-deal-everything-we-know/
- Stable Audio: https://www.fast.io/resources/stability-ai-review-2026.md
- ACE-Step 1.5: https://arxiv.org/html/2602.00744v1
- Open-source video: https://magichour.ai/blog/ltx-2-3-vs-wan-2-2 ; https://www.thundercompute.com/blog/best-open-source-ai-video-generation-models
- Open-source TTS: https://tts.ai/blog/open-source-text-to-speech-guide-2026/ ; https://origin.bentoml.com/blog/exploring-the-world-of-open-source-text-to-speech-models
- Open-source lip-sync: https://sync.so/blog/what-is-latentsync ; https://sync.so/blog/what-is-musetalk
- OpusClip API: https://help.opus.pro/api-reference/overview.md ; https://help.opus.pro/api-reference/agent-setup
- Vizard API: https://vizard.ai/blog/api-update-vizard-now-supports-the-v2-ai-clipping-model ; https://docs.vizard.ai/docs/quickstart
- Descript API: https://kompozy.io/news/descript-2026-api-mcp-ai-editing-updates
- Submagic API: https://www.submagic.co/blog/api-subtitles ; https://fluxnote.io/guides/submagic-pricing-2026
- YouTube disclosure: https://minimatters.com/youtube-altered-or-synthetic-content-disclosure/ ; https://minimatters.com/youtube-ai-content-labeling-update-in-may-2026/
- TikTok C2PA labels: https://www.nbcnews.com/tech/tech-news/tiktok-will-automatically-label-ai-generated-content-rcna151446
- Meta AI info: https://www.fonearena.com/blog/427659/meta-ai-labeling-ai-info-enhanced-transparency.html/amp ; https://conductatlas.com/platform/meta/meta-ai-labeling-policy/history/
- EU AI Act Art. 50: https://connectontech.bakermckenzie.com/new-eu-guidance-on-ai-transparency-what-should-companies-be-doing-from-2-august-2026 ; https://www.heuking.de/en/news-events/newsletter-articles/detail/the-european-commission-specifies-labelling-requirements-for-ai-generated-content-and-deepfakes.html
