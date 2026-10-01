# Playbook: generated content (explainer, value reel, promo, ad, faceless)

## Order of work (VO drives timing)
1. Research the brand/topic (site, docs, real facts). Value reels teach ONE standalone thing.
2. `script.json` (see `templates/script.example.json`): scenes with spoken line, on-screen text
   (rare, real words), component, props, anchors to words. Hook = spoken + visual + 3–7 words.
3. **Voice first**: ElevenLabs (with-timestamps) or the user's recording → word timings → scene
   durations computed from the voice, never guessed.
4. Music: user's track or ElevenLabs Music at exact length; detect beats; snap cuts ±4 frames;
   drop on the payoff.
5. Compose with existing components / HyperFrames registry blocks; brand tokens from `brand.json`.
6. Stills per scene → contact sheet with safe overlay → user (C2) → fix → final silent render →
   `mix.py` → `export.py`.

## Formats that work
- **Value reel**: problem in the viewer's words → insight → concrete example with real
  numbers/UI → one-line takeaway; product only as the tool in the example. Chaptered variant:
  mono chapter labels + a live counter; hook promises a payoff at the end + comment-keyword CTA.
- **Listicle**: number in the hook, one item per 5–7 s, best item last-but-one, recap at the end.
- **Promo/launch**: hook → problem → product as mechanism → proof → CTA; real UI, real claims.
- **UGC ad**: negative hook → problem → product as mechanism with one result → one CTA; vary the
  whole ad (hook, visual, copy, creator, format) between variants, not just the first line.
- **Faceless**: VO + literal B-roll every 4–8 s (stock with licences, or generated only on access),
  captions, music bed.

## Avoid
Model-written slogans on screen, generic illustrated worlds, small cards on empty stages, logo
openings, fake testimonials/numbers.
