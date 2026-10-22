# Windows + NVIDIA setup (tested 2026-10-22, RTX 3060 Laptop 6 GB, driver 617, no winget, no admin)

Everything portable under one root (`E:\video studio and claude work\tools\`); only Claude itself lives on C:.

| Folder | What | Source |
|---|---|---|
| `ffmpeg\` | ffmpeg/ffprobe 8.1 GPL (NVENC h264/hevc/av1, libass) | BtbN/FFmpeg-Builds `ffmpeg-n8.1-latest-win64-gpl-8.1.zip` (not "master", not "shared") |
| `node\` | Node 22 LTS portable | nodejs.org `latest-v22.x/node-v22.*-win-x64.zip` (check SHASUMS256) |
| `git\` | MinGit 64-bit | git-for-windows releases `MinGit-*-64-bit.zip` |
| `bin\` | `auto-editor.exe` | WyattBlue/auto-editor releases `auto-editor-windows-x86_64.exe` (no longer on pip) |
| `python\` + `python-env\` | Python 3.12 (uv) + venv | `uv python install 3.12` / `uv venv` (3.14 too new for the ML stack) |
| `rvm\` | RobustVideoMatting repo + `rvm_mobilenetv3.pth`, `rvm_resnet50.pth` | GitHub PeterL1n v1.0.0 |
| `models\` | HF (whisper large-v3-turbo, medium, Kokoro), rembg BiRefNet | downloaded on first use |
| `cache\` | uv/pip/npm/puppeteer/HyperFrames caches | env vars below |

## User env vars (set once; keep big caches off C:)
`UV_CACHE_DIR UV_PYTHON_INSTALL_DIR PIP_CACHE_DIR HF_HOME TORCH_HOME U2NET_HOME npm_config_cache PUPPETEER_CACHE_DIR
XDG_CACHE_HOME HYPERFRAMES_EXTRACT_CACHE_DIR HYPERFRAMES_FONT_CACHE_DIR VIDEO_TOOLS` (= tools root) — all under `tools\`.
User PATH gets `ffmpeg`, `node`, `git\cmd`, `bin`. Do NOT put `python-env\Scripts` on PATH (would shadow the system
python); call `%VIDEO_TOOLS%\python-env\Scripts\python.exe` explicitly. Note: rembg stores models at `U2NET_HOME\models\<name>\`.

## Python install (one command, then the fixes)
```
uv pip install --python <env>\Scripts\python.exe --extra-index-url https://download.pytorch.org/whl/cu128 \
  --index-strategy unsafe-best-match torch torchvision torchaudio faster-whisper whisperx "rembg[gpu]" \
  "opencv-python-headless<5" numpy soundfile kokoro "av<16" pims tqdm hf_xet
uv pip uninstall onnxruntime onnxruntime-gpu ; uv pip install "onnxruntime-gpu==1.22.0"
uv pip install "en_core_web_sm @ https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.8.0/en_core_web_sm-3.8.0-py3-none-any.whl"
uv cache clean      # frees ~9 GB of duplicate wheels
```
Gotchas hit (each one broke a test):
- **`av` ≥ 16 breaks faster-whisper** (`open() got an unexpected keyword argument 'metadata_errors'`) → pin `av<16`.
- **onnxruntime-gpu ≥ 1.2x is built for CUDA 13**; torch cu128 ships CUDA 12 DLLs → BiRefNet silently falls back to CPU
  (260 s vs 22 s). Pin `onnxruntime-gpu==1.22.0` and remove the plain CPU `onnxruntime` that whisperx pulls in (same
  module dir, they clobber each other). Verify `session.get_providers()[0] == 'CUDAExecutionProvider'`.
- **Kokoro (misaki) auto-installs spaCy `en_core_web_sm` with pip/uv at runtime and fails in a uv venv** → preinstall the wheel.
- **RVM `inference_utils.py` passes the frame rate as a string** → newer PyAV raises `'str' object has no attribute
  'numerator'`. Patched locally: `rate=fractions.Fraction(frame_rate).limit_denominator(1001)`.
- **6 GB VRAM**: never load whisper + BiRefNet + RVM in one process (OOM). Run matting as its own process. RVM
  mobilenetv3 at 1080×1920, downsample 0.25: 150 frames in ~10 s, 3 GB peak.

## Verified results
ffmpeg NVENC encode ✓ · whisper large-v3-turbo CUDA fp16 ✓ (word-perfect on a test line) · BiRefNet on CUDA ✓ ·
RVM CUDA ✓ · Kokoro CUDA ✓ · HyperFrames 0.8.185 `doctor` ✓ (Chrome = system; Docker not needed) · `cs_env.py` ✓.
Too heavy for 6 GB: Wan 2.2 (≥ 8–24 GB), ACE-Step/MusicGen-large → use ElevenLabs Music / cloud video.
