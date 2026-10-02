# Playbook: launch / coming-soon / product teaser — for ANY business

Benchmark: linkutm mobile "Coming soon" v3 (2026) — the user's "best video by far". Built in Remotion
(`promo-video-studio/src/LinkutmMobileTeaserV3.tsx`, reusable parts in `LinkutmMobileTeaser.tsx`).
It went v1 "very lame" → v2 "crazy good" → v3 "best". The formula below is what made the difference.
Use it for apps and SaaS, and equally for a restaurant opening, a new product drop, a store launch,
an event, a property, a service, a course.

## 1. The formula (15–17 s, 9:16, music only)
| Beat | Time | Job | SaaS example | Other businesses |
|---|---|---|---|---|
| **Hook: hero object entrance** | 0–2 s | Frame 0 already shows the hero object + a hook line on a solid plate. It FALLS/SLAMS/SLIDES in and lands on the first bass hit (squash, shockwave ring, flash, impact SFX) | iPhone drops in with the app lit | Burger slams on the plate · sneaker box drops · keys land on a table · ticket stamps · product falls into frame |
| **Fast proof beats** | 2–8 s | 2–4 real features/moments, each ≈2 s, time-compressed ×1.5 | create link, list | menu items, product variants, rooms, line-up |
| **Hero moment (SLOW-MO)** | ~4–5 s | ONE thing pops OUT toward camera in slow motion | QR pops out of the phone | the dish rises out of the menu · product spins out of the box |
| **Abundance with variety** | 5–8 s | one becomes many: each option spawns a variant, then a scrolling wall of VARIED items | 14 QR styles wall | flavours, colourways, sizes, outfits, rooms, offers |
| **Depth / proof** | 8–12 s | the real "dashboard" equivalent, scrolled through, slowing on the most impressive element | analytics → donut | reviews wall, ratings, before/after, numbers sold, map of stores |
| **Built drop + outro** | 12–17 s | music gap → drop → one sentence of CONTEXT (what the business is) → lockup pinned at the bottom (+ badges/CTA) | "Create, tag and track every campaign link." + app card + store badges | "Wood-fired pizza, made in 90 seconds." + logo card + "Opening 12 Oct · Baner, Pune" / "Pre-order now" / Swiggy·Zomato badges |

## 2. Rules (from the three rounds of feedback)
1. **First 2 s decide everything** (SKILL §0a): moving hero + readable hook at frame 0. No calm openers.
2. **Bright colour-flip world**: background flips on bar lines, palette taken from the brand's own colours. Avoid black.
3. **Bassy music with a drop**: generate (ElevenLabs Music, `force_instrumental`), fit BPM/phase, cut on beats; if no drop, build one (lowpass the bar before, 0.24 s silence, full on the reveal).
4. **Fast everywhere, slow only on the hero moment and the reveal.**
5. **Never repeat a screen/shot; never leave a blank frame** — keep the last scene alive through the music gap.
6. **Abundance needs variety** (shape, colour, style, layout); only some items get text labels.
7. **Real stuff, rebuilt exactly**: real UI from source/screenshots, real menu, real product photos. Illustrative numbers are OK but say so to the user.
8. **Outro = context + lockup**: one sentence on what the business is, then name/logo + "Coming soon"/date/CTA at the bottom, inside the safe zone (y ≤ 1500 of 1920), plus store/delivery badges if relevant.
9. **Headlines**: 2–4 words per beat, fast word stagger, plate behind text over busy art; the reel still makes sense with sound off.
10. Do NOT promise features that don't exist (e.g. we showed no push notification because the app had none).

## 3. Intake for this playbook (ask in one round, then the theme gate)
- Business + what's launching + date or "coming soon" + where (store, app stores, city, website).
- The HERO OBJECT (what drops in) and the ONE hero moment (what pops out in slow-mo).
- 3–4 proof beats; the "abundance" item; the "depth/proof" screen.
- Brand colours/logo/fonts; real photos/screens available?
- Outro sentence options (offer 3) + CTA/badges.
- Music vibe (bass house default, phonk/trap or hard drop as alternatives), length (15 s default).

## 4. Build notes
- Remotion comp authored 1080×1920, rendered ×4/3 = 1440×2560, 30 fps. HyperFrames works the same way.
- Device: iPhone body (titanium edge, Dynamic Island, iOS status bar) at 1.5× a 393-pt screen. For physical
  products use real cut-out photos (PNG with alpha) as the hero object, or the user's own studio shots.
- QR/variant system: one SVG path per module style (fast), finder styles, gradients, centre icons, card layouts.
- Audio: music bed + impact SFX on the landing + pops on spawns (ElevenLabs sound-generation); loudnorm −14 LUFS.
- QA: `scripts/qa.py` (frame count, LUFS, first second) + stills at every beat before the full render.

## 5. Post copy for a launch teaser (LinkedIn / X / Instagram)
- LinkedIn: founder voice, hook line about the pain → "so we're bringing X to Y" → 3–4 emoji bullets of real
  features → who it's for (a concrete moment) → "coming soon" + early-access comment CTA; link in FIRST comment; 3–5 hashtags.
- X: one ≤280-char post (hook + what + "Coming soon 👀"), optional 2-tweet thread with features + CTA.
- Instagram: 3 short lines (one per feature) + "Comment WORD for early access" + 5 hashtags max; give cover text + alt text.
- Only promise a comment-keyword CTA if someone (or ManyChat) will actually reply. Add the launch month if known.
- Example: `Desktop/linkutm-mobile-COMING-SOON-CAPTIONS.md` (2026).
