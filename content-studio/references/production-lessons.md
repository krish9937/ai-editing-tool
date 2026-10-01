# Production lessons (consolidated, current rules)

Distilled from ~13 rounds of real client feedback on founder reels/webinar clips. These are the
CURRENT rules; where earlier rounds disagreed, the later decision wins. Read before any build.

## What makes it feel "AI-ish" (avoid by default)
- Slogan headlines written by the model ("Which link actually worked?", "No need to open GA4.").
  → On-screen words = the speaker's own words + real UI labels. Nothing else unless asked.
- The "clean sans + one orange italic-serif accent word" type combo; per-character rolls;
  selection-highlight sweeps; karaoke pills; bouncy pops; particle/shockwave payoffs; dot-grid or
  blob backgrounds; logo stings with music only.
- Small floating cards on an empty stage. Generic illustrated worlds.
- Literal copies of a reference reel's elements (mascots, UI, caption placement).

## What reads as crafted / human
- Real people on screen (the speaker's actual face, lip-synced), real moments, real voice.
- Product screens FULL-SCREEN and legible on a phone (the frame *is* the app), navigating like a
  real user: tab switch → click → date picker → load → scroll. Cursor clicks land on spoken words.
- A light "filmed" layer: slow camera push/drift, warm tint, fine grain, soft vignette.
- Captions as a **typewriter in a dark monospace strip**, typed as words are spoken, no accents.
- No dead space in 9:16: fill the bottom with the founder (big lip-synced face ~40% width +
  captions beside it), product above.

## Hook (first 1–3 s)
- Voice at frame 0 (≤0.1 s silence). Never a logo/music/text-only opening.
- Pattern-interrupt line that promises a payoff: "WAIT! Let me save thirty minutes of your day!"
  A screamed/high "WAIT!" was explicitly requested (ElevenLabs v3 `[shouting] WAIT!!!`, +6–8 dB so
  it's the loudest moment), then the rest in a normal take.
- **Frame 0 is the feed preview/cover**: the hook TEXT must already be fully written on screen.
  Animate captions only after the hook.
- No recording of the speaker saying the hook? Use a real moment of them LISTENING (mouth closed)
  full-frame with the cloned-voice hook as voiceover — no lip-sync mismatch.

## Outro
- A proper CTA in the speaker's (cloned) voice on the brand page: logo draws in, the line typed as
  spoken ("Track every campaign link in one place. Try linkutm free, at linkutm.com."), URL + the
  site's real button label ("Start for free"). Short hold, music fades. (A host compliment as the
  outro was liked once, then replaced by the CTA.)

## Voice (ElevenLabs)
- Use the user's OWN clone by name ("Smit voice"), never a similarly-named clone; list voices via
  GET /v1/voices when unsure. Keys must start with `sk_` (key IDs are rejected).
- Spell acronyms/brands as letters in TTS text ("G A 4", "link U T M"). Use `speed` 1.05–1.2;
  low stability + high style = slow and drawn out. Trim leading silence. Offer 2–3 takes as
  previews that continue into the real footage so the user hears the blend.
- Blend a clone into webinar/phone audio: highpass 110, lowpass 8.5k, −2 dB @3 kHz, tiny room
  (aecho 18 ms 0.06), speechnorm, then match loudness (≈ the footage's −15 dB mean).

## Editing real recordings (webinars, podcasts, calls)
- Work from word timestamps. Build an EDIT LIST (keep segments + output positions). Cut voice,
  face track and screen track from the SAME list so lip-sync and clicks stay exact.
- Never clip the last word: whisper word ends run early — extend to the natural sentence end.
- A webinar cam bubble moves (screen share ↔ cams): crop zones per source time + freeze frames
  while it slides.
- Real 1080p screen shares are NOT readable in a vertical reel, even punched in → rebuild the UI
  full-screen (illustrative numbers only with explicit approval, labelled as examples).
- Read real numbers at the exact moment they're spoken (later frames may be another workspace).

## Music & mix
- Licensed/user-generated beds only. Bar-align cuts; land the drop on the visual payoff.
- Quiet bed (≈0.16 linear) + light sidechain under voice; fades at both ends.
- Every ffmpeg graph length-bounded (`-t`), `apad` branches bounded; `sidechaincompress` ends with
  its shortest input — pad the voice bus. Deliver at ≈ −14 LUFS, true peak ≤ −1 dBTP.

## Process that saves time
- Ask everything up front in ONE round (format, length, face, voice, captions, music, CTA, what not
  to do), then build. Show 5–8 stills before any full render. Re-render only what changed.
- Keep old versions; name outputs `-vN`. Verify decode frame count + loudness + safe zones on every
  delivery (scripts/qa.py).
- When feedback is vague ("not good"), ask WHAT is bad (opening / middle / text / audio) before
  rebuilding — one round of questions beats three wrong renders.
