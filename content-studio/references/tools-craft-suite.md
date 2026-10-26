# ArtCraft "Craft" suite — open-source creative apps an agent can drive (studied 2026-10-09)

Source: user shared repos in `Desktop\tools` (artcraft, artcraftx, filmcraft, lightcraft, photocraft). All by the ArtCraft
team (storytold on GitHub). Pure Rust, wgpu (DX12 on Windows). FilmCraft / LightCraft / PhotoCraft = MIT OR Apache-2.0
(commercial output OK; ArtCraft name/logos are trademarks). ArtCraft itself = "fair source" (free to use, outputs yours,
don't resell the software). **Status: young (v0.4–0.5), Windows runtime barely exercised — pilot before relying on them.**
This PC: no Rust toolchain, no NVIDIA GPU, and Windows App Control already blocks some native binaries → prefer the
code-signed prebuilt release zips (portable) over building; if building: Rust (MSVC) ≥ 1.95 + VS C++ Build Tools.

## On a GPU machine (see SKILL.md §3a GPU gate)
Install the signed portable builds (GitHub releases storytold/filmcraft, /lightcraft, /photocraft → `*-windows-x64-portable.zip`)
or build: `rustup` (MSVC, ≥1.95) + VS C++ Build Tools, then `cargo build --release -p filmcraft-cli` (likewise lightcraft-cli,
photocraft-cli). Register MCP: `claude mcp add filmcraft-headless -- <abs>/filmcraft-cli.exe mcp --project <abs>/p.fcproj`,
`claude mcp add lightcraft -- <abs>/lightcraft-cli.exe mcp <folder>`, `claude mcp add photocraft -- <abs>/photocraft-cli.exe mcp`.
Pilot each on one real asset and compare against the ffmpeg path (loudness, colour, sharpness at 100 %) before trusting it.
No GPU → ask the user before using these (they fall back to CPU and are slow).

### Installed + used in production (2026-10-23, RTX 3060 laptop)
Portable builds in `E:\video studio and claude work\tools\craft\{filmcraft 0.12.0, lightcraft 0.13.0, photocraft 0.14.0}` — SHA256
checked against each release's SHA256SUMS.txt. First real job: linkutm keynote promo (HyperFrames render → FilmCraft finish → LightCraft
+ PhotoCraft cover). Working recipes:
- **FilmCraft**: `--project` needs an EXISTING file — create with `filmcraft-cli --save-as p.fcproj import clip.mov`. Drive everything else
  with `run steps.jsonl` (one `{"id","params"}` per line) — PowerShell 5 strips quotes from inline JSON, and PS `Set-Content -Encoding utf8`
  writes a BOM that breaks the parser (write with `[IO.File]::WriteAllText` or Python). Steps: `file.newSequenceFromClip {"items":[1]}` →
  `sequence.settings {"width":1080,"height":1920,"fps":30}` → `effects.apply {"clips":[<video clip>],"effect":"Lumetri Color"}` →
  `effects.setParam {"clip":c,"effect":0,"param":"contrast","value":8}` (params: contrast, vibrance, temperature, whites, sharpen, exposure,
  saturation, vignette_amount, …; `inspect sequence` lists them) → `file.exportMedia {"path","format":"h264","bitrateMode":"crf","crf":14,
  "hardwareEncoding":"auto","wait":true}` (40 s 1080×1920 in ~100 s). `render --seconds S --out f.png` = quick graded-frame check.
  Its AAC pushed true peak from −1.3 to −0.8 dBTP → replace the audio with your own limited master (`-c:v copy`).
- **LightCraft**: `lightcraft-cli render in.png -o out.png --set light.contrast=10 --set color.vibrance=12 --set light.whites=6` (control ids:
  `controls --json`: wb.temp, light.exposure/contrast/highlights/shadows/whites/blacks, color.vibrance/saturation, mixer.*).
- **PhotoCraft**: call from Python (subprocess list args) so JSON params survive: `photocraft-cli run base.png --cmd type.create --params
  '{"x":540,"y":340,"text":"…","align":"center","font":"Inter","weight":900,"size":<pt>,"color":"#0d0d0d","tracking":-40}' --cmd type.setStyle
  --params '{"range":[5,13],"color":"#ee560c"}' --out cover.png`. Opened PNGs are 300 dpi → size in pt = px × 72 / 300 (124 pt came out 4× too big).
  `type.fonts` lists available families (Inter is bundled).

## FilmCraft (Premiere-style editor) — headless finishing stage
- `filmcraft-cli` (JSON out, exit 0/1/2), 650+ commands: `commands`, `describe <id>`, `--project p.fcproj --save import …`,
  `exec <cmd> k=v`, `run script.jsonl` (one `{"id","params"}` per line, `--keep-going`), `export out.mp4 --preset "YouTube 1080p Full HD"`.
- MCP: `filmcraft-cli mcp --project p.fcproj` (headless) or `--bridge 127.0.0.1:9876` to a GUI started with `filmcraft --control 9876`.
  Tools: command_list/run/batch, doc/project/sequence_inspect, media_import, render_frame (PNG for agent QA).
- Import EDL / FCP7 XML / FCPXML / **OTIO** / AAF → write OTIO from Python instead of hand-making `.fcproj` (JSON, schema 12).
- Wins over ffmpeg: Lumetri grade (wheels, curves, HSL secondary) in 32-bit linear + `.cube` LUTs + scopes (`scopes.read`);
  `essentialSound.generateDucking` (editable keyframes), `essentialSound.autoMatch {target}` + export `loudnessLufs`;
  captions SRT/VTT/SCC import/export + `burnCaptions`; Bezier keyframes, 93 effects, ~30 transitions; XML/AAF hand-off to Premiere/Resolve.
- Limits: H.264 only delivery (HEVC needs NVENC), CPU export, VFR phone footage lightly tested → keep ffmpeg for final delivery.

## LightCraft (Lightroom-style) — grade stills/frames, covers
- `lightcraft-cli render in.jpg -o out.jpg --set light.exposure=0.5 --preset lc.<name> --opt width=1280 --opt sharpen=screen`;
  `run --import <dir> develop.set … app.export dir=<out>`; `controls --json`, `commands --json`.
- MCP: `lightcraft-cli mcp [--library DIR] [FILES…]` — set_develop, apply_preset {ids}, crop (16:9/9:16/1:1/4:5), render_photo
  (agent sees result), export, `develop.sync` / `develop.matchExposure`, masks (subject/sky = heuristic, not AI).
- Stills only (video 0%); `.cube` IMPORT only, no LUT export → workaround: render ffmpeg `haldclutsrc=8` through a global-only
  grade, apply with ffmpeg `haldclut` (untested). Frame-sequence grading works but is slow; don't use per-frame auto (flicker).

## PhotoCraft (Photoshop-style, early alpha) — programmatic covers / text treatments
- `photocraft-cli convert in.psd out.png`, `info file.psd` (layer tree JSON), `run tpl.psd --cmd type.edit --params '{…}' --cmd … --out x.png`,
  `batch --actions a.json --in dir --out dir`, `serve` (JSON-lines session), `mcp` (doc_open/new/inspect/render_preview, command_run/batch).
- Layer styles (stroke, drop shadow, glows, bevel, gradient overlay…), type layers, smart-object replace, Variables/Data Sets →
  thumbnail templates. PSD read/write (render match vs Photoshop ~68%). `select.subject`/`removeBackground` = classical
  GrabCut, NOT AI → keep RVM/rembg/BiRefNet for real cut-outs.

## ArtCraft / ArtCraft-X (AI image/video "IDE") — ideas, not automation
- Desktop (Tauri) app: 3D blocking (mannequin posing, camera, kitbash, splat worlds) → snapshot/recorded camera move becomes
  the start frame / reference video for Seedance, Kling, Veo, Sora, Nano Banana, GPT Image… via ArtCraft credits or YOUR fal /
  Replicate key. No CLI/MCP; cloud "Omni API" (api.storyteller.ai, staff-enabled keys) is just a model aggregator.
- Borrow the techniques headlessly: render a three.js/Remotion proxy-geometry blockout + camera move → PNG/MP4 → image-to-video
  start frame / reference video; "image to location" (one environment reused across shots); grey-mannequin pose → character via
  Nano Banana / GPT Image edit with a character reference. ArtCraft-X = minimal generation app, no builds yet (mac/linux dev only).

## Where each fits in our pipeline
| Need | Use |
|---|---|
| Final assembly, delivery, loudness | ffmpeg (unchanged) |
| Pro colour grade / LUT / ducking on a cut | FilmCraft CLI/MCP (pilot) |
| Grade client photos, covers, thumbnails | LightCraft CLI (`render`, presets, crop) |
| Templated thumbnails / PSD plates / styled text PNGs | PhotoCraft CLI (`run`, `type.edit`, layer styles) |
| AI shots with controlled composition | three.js blockout → image-to-video API (ArtCraft technique) |
