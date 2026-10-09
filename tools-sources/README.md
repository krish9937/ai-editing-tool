# Craft suite source zips (ArtCraft team, storytold on GitHub)

Copied from the user's `Desktop\tools` on 2026-10-09. What each is and how to use it: `../content-studio/references/tools-craft-suite.md`.

| Zip | App | Licence |
|---|---|---|
| filmcraft-main.zip  | FilmCraft — Premiere-style editor, `filmcraft-cli` + MCP | MIT OR Apache-2.0 |
| lightcraft-main.zip | LightCraft — Lightroom-style raw/photo developer, `lightcraft-cli` + MCP | MIT OR Apache-2.0 |
| photocraft-main.zip | PhotoCraft — Photoshop-style editor (alpha), `photocraft-cli` + MCP | MIT OR Apache-2.0 |
| artcraft-main.zip   | ArtCraft — AI image/video IDE (3D blocking), desktop only | fair source (WIP) |
| artcraftx-main.zip  | ArtCraft-X — minimal AI generation app, no builds yet | see its repo |

Use only on a machine with a GPU (content-studio SKILL.md §3a GPU gate). Prefer the signed portable release builds;
build from these sources only if needed: Rust (MSVC) ≥ 1.95 + VS C++ Build Tools, `cargo build --release -p <app>-cli`.
