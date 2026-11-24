# linkutm Link in Bio (Bio Pages): product facts for videos

Source of truth: the frontend repo the user supplied on 2026-11-24 (`linkutm-frontend-staging.zip`,
extracted to `E:\video studio and claude work\work\linkutm-frontend-staging\`). Re-check the code before
quoting a number. Anything about **prices** comes from the backend catalogue and is NOT in the
frontend, so ask the user or check the live pricing page.

## What changed since the v4 "One link." reel (2026-11-05)
- **Themes rebuilt.** The old set (Dune, Clean Light, Aurora, Neon Noir, Boardroom, Lagoon, Midnight…)
  is gone. Do NOT show Dune cards or say "26 themes". There are now **41 presets**:
  - 4 free: Slate (default for every new page), Paper, Sunset, Blueprint (`blueprint-grid`).
  - 9 **video wallpapers**: MIRA, Golden Hour, Deep Blue, VELVET, Spritz, After Hours, STILL, Satin,
    Ember Smoke.
  - 22 **photo wallpapers**: Fern & Co., Sunny Side, Baseline, Posy, Indigo, Verde, Amethyst,
    Clay & Co, Roast House, Trailhead, Wax & Wane, Kiln, Nagare, Papercut, Dusk Sky, Abyss, Citrus,
    Fizz, Blue Ridge, Atelier, Espresso, Candlelit.
  - 6 premium flat/gradient/mesh: VHS, Ink Tape, Contour, Broadcast, Mirage, Ember.
  - Real wallpaper files: `public/bio-themes/<id>.mp4|.webp`, tile thumbs in `public/bio-themes/thumbs/`.
    These are the actual product art, so use them in videos.
- Themes are filed by goal: **Creator / Business / Personal**. Onboarding asks for the goal first.
- **Bio has its own plans:** Bio Free, Bio Starter, Bio Pro, Bio Studio. Premium themes and the
  design options locked on Free are photo/video wallpaper, stripes/contour/rays patterns, radial
  gradient, glass buttons, slide-up/scale entrance, Hero/Banner header, non-circle avatars, and a logo title.
- **18 block types**, grouped Essentials / Media / Content / Forms / Layout: Link, Social icons,
  Heading, Text, Image, Gallery, Video (YouTube/Vimeo/TikTok), **Music** (Spotify, Apple Music and 16 more),
  Divider, Spacer, FAQ, Contact (vCard), File download, **Map**, **App store** badges,
  Email capture, **Stats**, **Collection** (grouped links).
- **Per-block controls** (icon strip on each card): Animate, Schedule (with timezone), Lock,
  Geo (hidden, on no plan yet, so never show it), and **Redirect** (send every visitor to one link
  until a countdown ends).
- **Onboarding wizard:** handle + domain → goal → platforms → links → theme → photo/name/bio.
  **Import from Linktree** (or other providers), with a review step before anything is saved.
- Page sections: editor, Design, Insights (visitor map, per-block clicks), **Audience** (email
  contacts), Settings, plus Domains. Share: QR studio, preview card, "add to bio".
- Archive for blocks (restore later) instead of only deleting.

## How to apply
- For a Bio Pages video, capture real screens from this repo using the old mock-API approach
  (`work\linkutm-bio-v4\capture\`). Note that the mock API and themes.json there are the OLD schema,
  so rebuild them from `src/lib/bio/types.ts` and `themes.ts`.
- Headline features worth a reel: video wallpapers, Linktree import, the Music block, the Redirect
  countdown, Email capture → Audience.
