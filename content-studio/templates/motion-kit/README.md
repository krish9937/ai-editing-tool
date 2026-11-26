# motion-kit: named motion recipes for HyperFrames

Built 2026-11-25 after the "motion graphics are dead" audit (see `../../references/production-lessons.md`).
**Use it for every HyperFrames video.** SKILL §0m (Motion law) requires a named recipe on every beat, and these are the names.

Files
- `motion-kit.js`: the recipes (GSAP 3, deterministic, seek-safe). Copy it next to your `index.html`.
- `motion-kit-demo.html`: every recipe on one 12 s 1080×1920 timeline. It's a **compressed** showcase: real videos hold text ≥ 2.5 s.
  Tested on 2026-11-25: `hyperframes check` passes, renders clean, `motion_qa.py` PASS (0 frozen, 0 dead zones, 104 tweens).
- `motion-spec.example.json`: the beat-by-beat motion spec format every plan must include; `scripts/motion_qa.py --spec` checks it.

## Recipes

| Kind | Call | What it looks like |
|---|---|---|
| transition | `MK.zoomThrough(tl, cam, screenEl, nextScene, t)` | **screen-becomes-world**: the camera dives into a phone screen, and the world it showed continues the move |
| transition | `MK.whip(tl, out, in, t, {dir})` / `MK.crane(...)` | one camera curve, both scenes on the same ease + directional motion blur |
| transition | `MK.cardFlip(tl, front, back, t)` | the card turns over and its back IS the next scene |
| transition | `MK.foldInto(tl, el, next, t)` | paper fold (3 strips), then `next` (e.g. a QR) flips out of the fold |
| transition | `MK.shatter(tl, el, t, {next})` | the element breaks into 3D tiles that explode toward the lens |
| transition | `MK.flyIntoLens(tl, obj, next, t, {out})` | an object rushes the camera and its body wipes to the next scene |
| transition | `MK.matchCut(tl, out, in, t)` | shapes line up; push-out 1→1.05 / land-in 0.95→1 on the same frame |
| entrance | `MK.drop(tl, el, t, {shadow})` | gravity fall + squash & stretch, contact shadow tightens on impact |
| entrance | `MK.springIn`, `MK.flipIn`, `MK.stickers`, `MK.dealCards` | spring with overshoot · 3D flip · sticker slaps + stack shake · cards dealt on arcs |
| text | `MK.crunch`, `MK.rewrite(old,new)`, `MK.typeOn`, `MK.count` | slam-in · letter-by-letter rewrite · typed pill · rolling counter with pop |
| secondary | `MK.idle(rig)`, `MK.push`, `MK.parallax`, `MK.glare` | float/tilt · slow push · depth layers · light sweep on glass |
| FX | `MK.impact(tl, t, {target, cam})`, `MK.shake` | flash + shockwave ring + RGB split + camera shake (launch hits) |

## Rules the kit enforces or assumes
- Build inside `MK.ready(() => {...})`. It waits on `document.fonts.ready` only. **Never wait on requestAnimationFrame**:
  HyperFrames capture virtualises time, so rAF never fires and the timeline never registers (blank render; hit on 2026-11-25).
- Call `MK.finish(tl)`, then also write `window.__timelines["main"] = tl;` literally (HyperFrames' static contract check greps for it).
  `MK.finish` checks the transition log (≥ 4 designs, none > 35 %, never twice in a row, ≥ 1 entrance, ≥ 1 secondary)
  and reports problems with `console.error`.
- **Never `tl.seek()` during the build once tweens exist.** A measuring seek made the hook words invisible in the REAL
  render of Bio Pages v2 while `hyperframes snapshot` looked fine. `zoomThrough` measures build-time layout; pass
  `{rect:{x,y,w,h}}` (cam coordinates) if the target has moved by then. Always verify on frames pulled from the MP4.
- HyperFrames forces `visibility:visible` on active `.clip` videos: hiding a parent with autoAlpha won't hide them.
  Toggle `display` on clip videos and their containers.
- Put secondary motion on a **rig wrapper**, not the element that has an entrance (they'd fight over transforms).
- Scenes = absolute full-frame layers; later in the DOM = on top. Hide later scenes at t=0 with `MK.hide`.
- `shatter`/`foldInto` clone the element's **build-time** DOM (ids kept so id-based CSS applies); text typed later won't be in the shards.
- Hand-built moves: log them with `MK.note("transition", "my-move", t)` so the variety check counts them.
- Every later-placed tween uses `immediateRender:false` (the GTA-reel bug); randomness is seeded (`MK.init({seed})`).

## Gate
`python scripts/motion_qa.py final.mp4 --comp <project> --spec motion-spec.json` (qa.py runs it automatically;
`qa.py --comp/--motion-spec` passes them through). FAIL = fix and re-render, never deliver.
