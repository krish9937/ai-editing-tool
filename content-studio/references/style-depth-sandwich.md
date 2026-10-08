# Style: "Depth sandwich" — graphics BEHIND the speaker (learned 2026-10-08 from a reference reel the user sent)
Reference: IG reel DeAH3yjJN25 (a HyperFrames demo: stop-motion, carousel and finger-trace effects; text behind the head; UI behind the shoulders; "Comment X" CTA behind the head).

## The technique
Layers, bottom to top: **original footage (real room stays)** → **graphics** → **speaker cut-out (matte)** → captions.
Because the real footage stays underneath, matte errors are invisible except where a graphic is behind them, so put
graphics around the head and shoulders, where the matte is cleanest. No outline is needed: occlusion IS the effect.
## Moves to borrow
- Big bold text behind the head (hair/head occludes letters): the hook word, "Every single one", and the CTA "Comment X".
- 3D carousel of cards orbiting the body: back cards pass behind the speaker, front cards in front (split the carousel into
  two layers: z<0 under the cut-out, z>0 over it). Registry: carousel-circle/orbit/path/vision-*.
- Finger trace: a stack of icons follows a fingertip (track the fingertip with hand landmarks or hand-keyframe a path).
- Stop-motion: icons pop in steps at ~12 fps (choppy on purpose) around the speaker.
- App/UI windows rise behind the shoulders; a full-screen cutaway only for a big "volume" shot (e.g. a folder grid).
- Captions: ONE small word at a time, white, centre-chest (clean, modern).
- Single accent colour (purple in the reference). Modern registry blocks (code-snippet terminals, cosmic-orb, gallery-tunnel)
  instead of hand-drawn doodles; the user said the doodle look feels dated.
## Matting (fixes the seatbelt flicker)
Use Robust Video Matting (RVM, recurrent, temporally stable) via ONNX on the CPU: `D:/codes/work/_library/matting/rvm_matte.py`
(0.09 s/frame for the model; the outline and VP9 encode dominate, so make outlines optional/lighter). The old remove-background
is per-frame, flickers on thin objects (seatbelts), and is about 20× slower.
## Outline (if wanted)
Dilate the stable alpha 8–12 px, keep only the largest component, and fade the stroke out below the waist / near furniture.
Render a separate outline layer under the cut-out.
## Rule from the user
Always CHANGE the editing style between reels and fine-tune every render. Never reuse last reel's look by default.
