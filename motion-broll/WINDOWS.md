# Running motion-broll on this Windows machine

The upstream skill assumes macOS (`python3`, `ffmpeg` on PATH). Here:

- **Python:** use `python` (or the faster-whisper venv `C:\Users\Zenbook\.claude\jobs\2b9b18c4\tmp\wv\Scripts\python.exe`, which also has numpy). Where SKILL.md says `python3`, run `python`.
- **ffmpeg:** not on PATH. Prepend the ffmpeg-static folder before running `render.js` / `composite.py` / `make_pages.py`:
  `export PATH="/c/Users/Zenbook/.claude/jobs/2b9b18c4/tmp/node_modules/ffmpeg-static:$PATH"`
  (it includes `prores_ks`, so transparent .mov panels work). `ffprobe` is NOT in that folder: `inspect_video.py` needs one (npm `ffprobe-static`) or read resolution/fps with `ffmpeg -i` instead.
- **Setup:** `setup.sh` checks `python3` / `ffmpeg` with `command -v`; with PATH set as above, run its npm steps manually if the check fails:
  `cd motion && echo {"private":true} > package.json && npm i playwright && npx playwright install chromium`
- `render.js` uses `file://` + `path.resolve` (fine on Windows) and spawns `ffmpeg` from PATH.
- Made-up numbers: the skill refuses them by default; this user has approved modest illustrative numbers for some clips. Label them as illustrative in TIMING.md.
