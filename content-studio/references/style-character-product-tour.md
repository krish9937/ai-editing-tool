# Style: character-led product tour (studied 2026-10-29 from "tour-1080" — Verifox "The whole tour")

3:57, 1920x1080 60 fps, ~31 hard scene changes, narrated comedy. Reference file: Downloads\tour-1080.h264.mp4 (98 % decodable).
Frames + transcript: work\ref-tour\ (sheet_1-4.png, motion_*.png, t75\transcript.txt).

## Structure
1. **Cold open = the problem as a physical metaphor (0–30 s).** A pigeon mail carrier ("Gary") delivers 10,000 emails;
   fake addresses are painted doors on a brick wall → he slams into the wall = a bounce. Counter sticker "BOUNCES: 3 → 47",
   toast "Your sender reputation has left the chat." Ends dizzy: "I can taste colors."
2. **Title card** on a sunburst: "VERIFOX — THE WHOLE TOUR · or, why is this pigeon in a wall" + pigeon cutout.
3. **Host intro on a stage** (spotlight, curtains): mascot Fox "inventor of email verification and emergency contact to a pigeon".
4. **Page-by-page tour of the REAL app** (dashboard → verify one → result modal → bulk CSV → results → agent/chat →
   Fox Guard → API keys → MCP → billing), each beat with a joke and a callback to Gary.
5. **Recap in the world** (mailboxes labelled ONE EMAIL ✓ / WHOLE LIST ✓ / FORMS ✓ / CODE ✓), logo disintegrates into
   pixels and reforms → **CTA** "verifox.ai · 1,000 FREE CREDITS →" clicked by the branded cursor, then post-credit gags.

## Visual techniques
- **Two worlds:** (a) illustrated 3D-clay characters in painted storybook sets (warm golden light, brick lanes, post office,
  stage, neon club door, TV colour bars); (b) the real product UI on a warm cream ground.
- **Characters** are consistent AI-generated renders animated as short image-to-video clips (wiggling legs in a wall, dizzy
  stars, waving), plus the same characters as **cutout stickers** that slide/pop over the UI (pigeon pointing at a button,
  fox peeking from the corner, a sandwich "Head of Sales").
- **UI treatment:** real screens, slow push-ins, depth-of-field blur on everything except the active element, modals
  scale in from small, a **big branded cursor with a name tag ("Fox", "Gary")**, click ripples, typing in fields.
- **Annotation layer:** red hand-drawn marker circles/underlines, sticker labels (VALID / RISKY / INVALID / UNKNOWN chips,
  "≈2 SECONDS", "9 CHECKS", "1 MINUTE"), comic speech bubbles ("YEP!", "HEAD OF SALES!"), lower-third term defs
  ("CATCH-ALL — a server that says yes to everything", "MCP — lets AI apps like Claude or Cursor use Verifox").
- **Meme inserts:** "One eternity later…" sunburst card, "PLEASE STAND BY" colour bars, galaxy-brain two-row meme,
  "Credits that expire at midnight / PANIK", old-pigeon-with-beard waiting gag, fake-mustache "BOT" detective.
- **Terminal cards** (curl, `claude mcp add …`, JSON) as dark rounded panels over blurred UI.
- **Transitions:** hard cuts on jokes, blur-through into UI, whip/smear, pixel disintegration on the logo.

## Audio
- Two character voices: narrator Fox (dry, deadpan) + Gary the pigeon (silly), fast comic timing, callbacks.
- Music bed + cartoon SFX (crashes, boings, dings) under VO; mean ≈ −17.6 dB.

## What we can / can't reproduce
- **Can (HyperFrames, free):** the whole UI tour layer — captured/rebuilt real UI, push-ins, DOF blur, scaled modals,
  named branded cursor, typing, red marker circles, sticker chips, speech bubbles, lower-thirds, meme cards, terminal
  cards, sunburst titles, colour-bars, pixel-disintegration logo, beat-timed cuts; multi-voice VO script (Gemini TTS).
- **Needs generation access:** the illustrated 3D-clay characters/sets and their animated clips (image model + image-to-video:
  Gemini Nano Banana/Veo with billing, Kling, Runway, HeyGen…). Do NOT substitute code/Blender-built characters
  (rejected 3x, see production-lessons 2026-10-29). Without access: use the brand's own mascot art as cutout stickers only.
