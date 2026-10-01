# AI Editing Tool

Agent skills (`SKILL.md` format) for making videos with AI coding agents such as Claude Code, Codex, Cursor and GitHub Copilot.

| Folder | What it is | Engine | Author / License |
|---|---|---|---|
| [`content-studio/`](content-studio/) | **Start here.** The umbrella skill for any video/reel/short/clip: one-round intake, routing by format, open-source-first tool choice (HyperFrames, Remotion, ffmpeg, faster-whisper; paid AI only when available), fast preview ladder, and tested Python scripts (transcribe, autocut, edit-list cut with lip-synced face tracks, reframe 9:16, ASS captions, ducked/normalized mix, platform export, QA with safe-zone overlay). References: short-form craft, 19 editing types, open-source tools, AI APIs, platform specs, speed pipelines, production lessons. | ffmpeg + Python + HyperFrames/Remotion | Original work |
| [`reel-maker/`](reel-maker/) | Focused entry for a single vertical reel/short (founder, demo, value tip, promo). Uses content-studio. | — | Original work |
| [`shorts-from-long/`](shorts-from-long/) | Focused entry for clipping long recordings (podcasts, webinars) into captioned shorts. Uses content-studio. | — | Original work |
| [`video-studio/`](video-studio/) | One skill for any video: promo, demo, explainer, tutorial, social Short, ad. Intake → original illustrated design system → beat-locked music → key-still checks → 4K render → ElevenLabs voiceover + karaoke captions → verified delivery. | [Remotion](https://www.remotion.dev/) (React) | Original work |
| [`motion-broll/`](motion-broll/) | Motion-graphic B-roll for talking-head videos, timed to the speaker's words: one shape that morphs and never cuts, driven by a cursor, spring motion, real motion blur. Outputs cutaway MP4s / transparent ProRes panels + a preview and before/after page. See `motion-broll/WINDOWS.md` for Windows notes. | HTML + Playwright/Chromium + ffmpeg | © Bart, [MIT](motion-broll/LICENSE), see [ATTRIBUTION](motion-broll/ATTRIBUTION.md) |
| [`hyperframes/`](hyperframes/) | 28 HyperFrames skills: entry router, core/CLI/animation/audio/keyframes, workflows (product launch, faceless explainer, talking-head recut, embedded captions, music-to-video, slideshow, PR-to-video, Figma import) and ready-made effect blocks. | [HyperFrames](https://github.com/heygen-com/hyperframes) (HTML + GSAP) | © HeyGen, [Apache-2.0](hyperframes/LICENSE), see [ATTRIBUTION](hyperframes/ATTRIBUTION.md) |

## Install

**With the `skills` CLI** (installs into every supported agent):

```bash
# everything in this repo
npx skills add krish9937/ai-editing-tool --full-depth

# HyperFrames only, from the original source (recommended for updates)
npx skills add heygen-com/hyperframes --full-depth
```

**Manually for Claude Code:** copy the skill folders into `~/.claude/skills/`:

```bash
cp -r content-studio reel-maker shorts-from-long video-studio ~/.claude/skills/
cp -r hyperframes/*/ ~/.claude/skills/
cp -r motion-broll ~/.claude/skills/
```

## video-studio: learnings log

`video-studio/LEARNINGS.md` is an append-only log of lessons from reference reels and feedback rounds. The skill reads it before every new video.

## video-studio: first run

```bash
bash ~/.claude/skills/video-studio/scripts/setup.sh
```

Installs ffmpeg + Node 18+ if missing, scaffolds the Remotion studio at `~/promo-video-studio`, copies the helper scripts, and creates a gitignored `.env`.

Optional voiceover: put `ELEVENLABS_API_KEY=...` in the studio's `.env`. Never commit it.

**Scripts** (`video-studio/scripts/`):

| File | Purpose |
|---|---|
| `Harness.tsx` | Remotion scaffold: 30→60fps + 1080p→4K scale harness, scene wrapper, text primitives, karaoke captions |
| `beatmap.mjs` | Detects music onsets and locks a scene grid to the track's biggest hit |
| `eleven-vo.mjs` / `eleven-vo-ts.mjs` | ElevenLabs voiceover per line (the `-ts` version also writes word timestamps) |
| `build-captions.mjs` | Turns word timestamps into karaoke caption chunks |
| `frames.sh` | Extracts exact frames from a render for checking |
| `setup.sh` | One-time machine setup |

## Which one to use

- **content-studio** (with reel-maker / shorts-from-long): the default for anything — it routes to the others.
- Requirements for its scripts: Python 3, ffmpeg (any of: PATH, `npm i ffmpeg-static`, `pip install imageio-ffmpeg`), `pip install faster-whisper "opencv-python-headless<5"`.

- **video-studio**: fully custom, illustrated brand videos in React/Remotion, with a strict quality and verification pipeline.
- **motion-broll**: talking-head footage that needs calm, cursor-driven cutaways on key words.
- **HyperFrames**: HTML/GSAP compositions, a large registry of ready-made blocks, and specialised workflows (captioning your own talking-head footage, music videos, slide decks).

Both can live side by side. They use different folder names, so neither overwrites the other.

## License

- `video-studio/`: see the repository license chosen by the owner.
- `motion-broll/`: MIT, © Bart. See [`motion-broll/LICENSE`](motion-broll/LICENSE) and [`motion-broll/ATTRIBUTION.md`](motion-broll/ATTRIBUTION.md).
- `hyperframes/`: Apache License 2.0, © HeyGen. Redistributed unmodified; see [`hyperframes/LICENSE`](hyperframes/LICENSE) and [`hyperframes/ATTRIBUTION.md`](hyperframes/ATTRIBUTION.md).

## research/

The six raw research reports the skills were built from (short-form craft, editing types, open-source tools, AI tool APIs, platform specs, speed pipelines). The same content is inside `content-studio/references/`.
