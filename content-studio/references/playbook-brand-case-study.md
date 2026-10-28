# Playbook: brand case-study reel from the user's own footage (APPROVED benchmark, 2026-10-27)

The user's verdict on the Duolingo "Duo died" reel: **"very good… the content you created using the real statistics"**.
Use this playbook whenever the user films themselves explaining a brand's marketing move (Spotify Wrapped, Duolingo, Zomato…)
for their personal channel. Example build: `templates/examples/brand-case-study-duolingo-lesson.html`.

## What made it work (keep all of it)
1. **Real material, not illustrations.** The brand's actual posts, images, videos, app screens and campaign pages,
   plus third-party posts (other brands reacting), each shown verbatim with a small "Real post · @handle · date" label.
2. **Verified statistics on screen**, every number from a primary or major source (company statement via NPR,
   TechCrunch, Music Week), source line under the number, third-party estimates labelled as estimates.
   Examples: 712.5K likes on the death post, 50.9B XP vs a 50B goal, top countries; Spotify 500M+ shares on day one.
3. **The whole reel dressed as the brand's own UI.** The subtitles and frame act out the brand:
   - Duolingo: lesson page, progress bar, hearts lost and refilled, word-bank tile captions, green "Nicely done!" sheet, CONTINUE button.
   - Spotify: lyrics-card captions (colour per section), an "On Repeat" now-playing card.
4. **Timing on the word.** Every card lands on the spoken word that names it, and real clips are trimmed so the action lands
   on the word (the Cybertruck hit lands on "Cybertruck"). Hold a still from the same clip until then.
5. **The user's own voice and Hinglish kept.** Cut only pauses and English filler; all Hindi lines stay, captioned in Roman script.
6. **Natural colour** (libplacebo HDR→SDR, no grade). **The user's original opening line is the hook**, written on the first frame.

## Pipeline
1. Probe the footage, then transcribe (turbo `en` on English slices, turbo `hi` on Hindi lines, no VAD). Build pauses from an RMS envelope.
2. Research: 3–6 verified facts with sources; save them in project memory.
3. Collect real posts **without a browser**: scrape news articles that embed them for status IDs →
   `cdn.syndication.twimg.com/tweet-result?id=<id>&token=4` → text, date, likes, avatar, photos, `video_info.variants` mp4s.
   Instagram/TikTok: use the stills the user sends, or Chrome when it is connected.
4. Plan → ask: style (2–3 options), brand-themed subtitles, how screenshots will be sourced, colour A/B still. Then build.
5. HyperFrames: write times as SOURCE times and map them through the edit list with `S(src)`, so re-cuts don't break the sync.
   Card mode (brand UI page on top, footage shifted down ≈ 660 px so the face is in the lower half) alternates with full-frame reaction beats.
6. Stills → fix → full render (~5 min on the RTX 3060) → mix (voice −16 LUFS pre-level, bed 0.13, master −14) → QA → Desktop draft.

## Don'ts
- No invented posts, quotes, numbers or like counts. Mock UI (notifications) only when clearly generic, and say so in the handover.
- Don't use generic card/list slides or a "Wrapped-lookalike" slideshow. Every beat is a specific real object.
- Don't caption words you're unsure of. Leave a gap and ask the user.

## Variant: face only in the hook (Nike/Jordan reel, 2026-10-28)
- The user asked to show their face only in the hook, then cover it. Matte only the hook seconds (cheap); a red diagonal wipe hands over to full-frame "archive" pages while their voice continues.
- Historic stories: the best real material is on **Wikimedia Commons**. Search `list=search&srnamespace=6` and pull `imageinfo` with `extmetadata` (LicenseShortName, Artist). Many 1980s press photos are public domain (UPI, newspaper, NBA scorer's sheets) and museum items are often CC0 (Smithsonian). Put the credit in each photo's caption strip.
- "1985 ad archive" look: paper with feTurbulence grain, taped photo prints, Old Standard TT news clippings, condensed italic headlines, censor bars over the shoes (like the original TV spot), shoebox-label captions (orange label, barcode, key words inverted). Each page gets a slow 1.06→1.11 push so it's never static.
- Quote real ad copy verbatim and label it "AD COPY". Put disputed numbers on screen with the dispute stated ("as told by agent David Falk; other accounts dispute it").
