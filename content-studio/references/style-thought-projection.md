# Style: "Visualized thought projection" / mind-map presentation (user-requested 2026-10-08)

**Look:** the real speaker, background removed, with a clean thick **white sticker outline** (8–14 px at 1080w,
optional coloured outer glow). Behind and around them, the background **bursts into life** with hand-drawn sketches,
math equations, arrows, charts and mind-map bubbles showing what they're saying at that moment, like their thoughts
projected into the room. The speaker stays on screen the whole time; visuals grow, connect and change around them.

**Build:**
1. Matting: `hyperframes remove-background` on a 1080x1920 full-frame cut. Split into ~5 chunks and run in parallel
   (single process uses ~6% CPU), then concat the VP9-alpha webms with `-c copy`.
2. Outline: dilate the alpha and fill white, either baked with ffmpeg (alphaextract → dilation x N → colour white → overlay under
   the cut-out) or in CSS on the transparent video (stacked `drop-shadow(±Npx 0 0 #fff)` / `drop-shadow(0 ±Npx 0 #fff)` plus one blur
   glow). Baked is safer for 4K render memory.
3. Thought layer (behind the speaker, around the head/shoulders): SVG line art drawn on with stroke-dash per word;
   equations typed in a handwriting font; mind-map nodes that branch from the head; mini charts that grow; arrows that
   connect ideas; doodle icons (sketch style, or Fluent 3D for a "real symbols" mix). Every element lands on its spoken word.
4. Background: chalkboard, notebook-grid paper, or the brand colour. Keep it bright unless the brand is dark (Škoda emerald worked).
5. Motion: continuous; each element draws on, grows, links, and is pushed aside by the next idea. Punch-ins and shockwaves only on
   key beats. Captions stay legible on top (stroke and shadow).
**Ask the user:** outline colour (white default), background type (chalk / paper / brand), doodle vs 3D-icon mix.
