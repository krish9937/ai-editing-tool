# Prompt Motion lessons (prompt-motion.com — gallery of ~230 Claude-made motion videos + their prompts; studied 2026-10-23)

## Default BAN LIST (pair each with a positive alternative; show it in the plan)
glows/neon · particle bursts & shockwave rings · RGB split · camera shake · lens flares · grid floors · flashing backgrounds ·
crossfades & random transitions · bouncy/cartoon springs · gradients & gratuitous 3D · stock UI kits/icons · text in frame corners ·
holds > 1 s / dead time · Math.random (non-deterministic) · "anything that looks like a template".
Positive alternatives: one HERO ELEMENT that recurs and MORPHS between scenes (transitions = the same element changing state);
motion always attached to an element already on screen; sharp controlled motion, tiny overshoot at most; letters animate individually
for text transforms, outgoing/incoming text on separate timings; shapes that fill the frame scale past all four corners.

## Launch videos (92 prompts)
1 product + one-line promise · 2 three-to-five UI moments IN ORDER · 3 look: hex colours, ONE font, light/dark, ONE accent ·
4 timing: 10–15 s (closer to 15), tempo, a change on EVERY beat (beat-matched cut = launch video vs feature slideshow) ·
5 ban list · 6 ending: logo / URL / one line. Research the brand site first; borrow a reference's TECHNIQUE (timing, shot length,
smoothness), never its design. State format + pixel size (most gallery launches are 16:9).

## Explainers (27 prompts)
Show a PROCESS start→finish, not a topic · write the scenes in order (~5 s per idea) · name the audience ("zero background") ·
"research first, never invent numbers" + verify · decide sound (VO/music/none; no VO = every idea must read on screen).

## Pipeline
Render one frame per beat to check pacing before the full export. Every frame a pure function of time. Name the renderer + build
method up front (HTML+Playwright 23 · Remotion 13 · HyperFrames 10 · three.js 5 of 56 stated). HyperFrames = Apache-2.0, agent-first;
Remotion = licence needed for some companies; three.js only for real 3D.

## Our history check
Tapformat v5/v6 ("very AI-like") used glows, shockwave rings, shake, grid floor, bouncy springs; v7 keynote (grounded device,
one accent, no FX) landed. Launch-reel energy: keep bass + beat cuts, get impact from morph/scale/hard cuts, not explosion particles,
unless the client explicitly asks for the explosive style.
