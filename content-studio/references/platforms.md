# 05 — Platform Delivery Specs + Algorithm-Relevant Packaging (researched 2026-10-01)

Scope: Instagram Reels, TikTok, YouTube Shorts, YouTube long-form, LinkedIn video, X video, Facebook Reels.
Confidence tags: **[OFFICIAL]** = platform help/ads guide; **[REPORTED]** = reputable trade press quoting the platform (Mosseri posts, TechCrunch, SMT); **[INDUSTRY]** = third-party measurement or consensus. Platforms change UI often, so treat pixel safe zones as conservative design guides, not hard facts.

---

## 0. TL;DR rules for an agent

1. **One master, many exports.** Render a clean master (no watermark, no platform logos, no burned-in "follow me on X" for another platform). Export per platform from the master. Never re-upload a file downloaded from another platform (TikTok/IG watermark means it won't be recommended).
2. **Vertical default = 1080x1920, 9:16, H.264 High, yuv420p, BT.709, 30 fps (or native 24/25/60), AAC-LC 48 kHz stereo, -14 LUFS integrated, ≤ -1 dBTP, `+faststart`.** For premium quality on Reels, 1440x2560 is accepted (Meta ads guide lists it).
3. **Hook in the first 1–2 seconds, spoken + on-screen.** Every platform weights early retention (3-second hold) and completion.
4. **Keep key text inside the universal safe box** (Section 9) and keep the **cover title inside the centre 1080x1080** so it survives 1:1, 4:5 and 3:4 grid crops.
5. **Length sweet spots for discovery:** Reels ≤ 90 s (recommended to non-followers only ≤ 3 min); TikTok > 60 s if you want Creator Rewards, otherwise 15–45 s; Shorts ≤ 60 s if any third-party music (Content ID on > 1 min Shorts = global block); LinkedIn vertical ≤ 2 min (aim 20–45 s); X ≤ 140 s for non-Premium accounts.
6. **Disclose realistic AI content** (AI voice clones, synthetic people/scenes) via each platform's toggle; C2PA metadata from generators triggers auto-labels anyway.

---

## 1. Instagram Reels

| Item | Spec |
|---|---|
| Aspect / resolution | 9:16, 1080x1920 recommended; Meta ads guide lists 1440x2560 for Reels ads [OFFICIAL]. Min width 500 px. |
| Container / codec | MP4 or MOV; H.264 (or HEVC), progressive, closed GOP, 4:2:0, fixed frame rate, square pixels [OFFICIAL ads guide / INDUSTRY]. |
| FPS | 23–60 fps; 30 fps is the safe default. |
| Bitrate | No published cap; IG re-encodes heavily. 1080p: 8–12 Mbps VBR uploads well; 4K uploads are downscaled. |
| Audio | AAC stereo, ≥128 kbps (ads guide) — use 192–320 kbps @ 48 kHz. |
| File size | Max 4 GB [OFFICIAL ads guide]. |
| Length | Up to **3 min** since Jan 2025 (Mosseri) [REPORTED]. Late 2025 onward, **up to 20 min** is rolling out/tested on some accounts [INDUSTRY], but Reels over 3 min are **not recommended to non-followers** — treat 3:00 as the hard ceiling for reach. Reach sweet spot 7–30 s; 60–90 s for teaching content. |
| Captions | No SRT upload. Options: auto-generated captions (viewer toggle), the in-app "Captions" sticker, or **burn in** your own (recommended for a crafted look). |
| Caption text | 2,200 chars; ~125 visible before "more". |
| Hashtags | **Hard limit 5 per post** (caption + first comment combined) since Dec 18 2025 [REPORTED, @creators]. Use 3–5 specific tags; keywords in caption matter more (IG search). |
| Links | Caption links not clickable (Mar 2026 test of caption links is for Meta Verified feed posts, not Reels; Reels links only on paid Meta Verified business tiers, a few per month) [REPORTED]. Use "link in bio" / "comment KEYWORD" DM automation / Story link sticker. |
| Cover | Choose a frame or upload a custom cover; recommended 1080x1920. Profile grid is now **3:4 (≈1080x1440 crop, shown ~1013x1350)** since Jan 2025; feed shows Reels cropped to **4:5 (1080x1350 centre slice)**. Covers can be re-cropped after posting via "Adjust cover/preview" [REPORTED]. Legacy 1:1 / 420x654 cover advice is outdated — design 1080x1920 with title inside the centre 1080x1080. |
| Safe zone (1080x1920) | Ads guide: keep **14% top (269 px), 35% bottom (672 px), 6% sides (65 px)** clear [OFFICIAL — ads, worst case]. Organic: ~220 px top, ~420 px bottom (caption/audio/username), ~140 px right (like/comment/share/remix rail). |
| Trial Reels | Toggle "Trial" in composer: shown to non-followers only, not on grid; after ~24 h you see metrics and can share to followers (or auto-share if it performs). Public accounts, 1,000+ followers (mid-2025 expansion) [REPORTED]. Great for A/B testing hooks with the same master. |
| Algorithm signals | Mosseri (Jan 2025): top three = **watch time**, **likes per reach**, **sends per reach (DM shares)**. Sends weigh most for reaching non-followers; likes matter more for followers. Saves and comments help; watch past 3 s and completion are key. Replays count as plays. |
| Originality | Accounts whose posts in a rolling 30-day window are mostly reposts of others' content become **non-recommendable**; identical reposts are replaced by the original in recommendations; repost labels. Watermarked TikTok/CapCut exports are deprioritised. Adding voiceover, commentary, own text, green screen or Collab makes it "original" [REPORTED, Mosseri]. |
| AI label | "AI info" label applied automatically (C2PA/IPTC metadata, classifiers) or via the creator's toggle; disclosure required for realistic synthetic video/audio, incl. AI voice [REPORTED]. |
| Timing | Post when your audience is active (Insights > Most active times); first 30–60 min of engagement still matters. Collab posts share reach across both accounts. |

---

## 2. TikTok

| Item | Spec |
|---|---|
| Aspect / resolution | 9:16, 1080x1920 (accepts 360–4096 px per side). 1440p/4K uploads OK, served ≤1080p. |
| Container / codec | MP4 (recommended), MOV, WebM; H.264 recommended (H.265 accepted); AAC audio. |
| FPS | 23–60 fps. |
| Bitrate | Upload 8–15 Mbps @1080p30 (TikTok re-encodes; higher upload = fewer artefacts). Enable "Upload HD" in app. |
| File size | Web/desktop up to 4 GB (in-app smaller: ~287 MB iOS / 72 MB Android historically) [INDUSTRY]. |
| Length | Upload up to **60 min**; in-app camera up to 10 min. **Creator Rewards Program pays only on videos > 1 min**, scoring originality, play duration, search value, engagement [REPORTED]. |
| Captions | Auto-captions (creator can edit) — no SRT upload in app. Burn in captions for control; TikTok OCR reads on-screen text for search. |
| Caption text | 4,000 chars in app (API: 2,200); first ~100 visible. Photo-post title 90 chars. |
| Hashtags | No hard limit (counts against char limit). 3–5 relevant + keyword-rich caption. TikTok SEO uses caption, on-screen text (OCR), speech transcript, hashtags. |
| Links | No clickable links in captions. Bio link at 1,000+ followers or Business account. TikTok Shop / Lead-gen for commerce. |
| Cover | Pick any frame + optional text in app; desktop web lets you upload custom cover (JPG/PNG, **3:4** display on profile grid). Design 1080x1920 cover with title in centre 1080x1440. |
| Safe zone (1080x1920) | Ads/strict: **top 130, bottom 484, left 44, right 140 → safe 896x1306** [INDUSTRY from TikTok ad templates]. Organic: ~150 top, ~350–420 bottom, ~120 right. Long captions grow the bottom overlay. |
| Algorithm signals | Completion rate, re-watches (loops), shares, saves, comments, follows from video; watch time per view dominates. Loopable endings boost replays. Search value increasingly weighted. |
| Originality | For You feed eligibility standards exclude **unoriginal/reposted content without creative edits, and video with another platform's visible watermark/logo** [OFFICIAL Community Guidelines, FYF eligibility]. Static slideshows with watermarks deprioritised. |
| AI label | Must label realistic AIGC (toggle "AI-generated content"); auto-labels from C2PA Content Credentials since 2024–25. Unlabelled realistic AI can be removed/made ineligible. |
| Timing | Use Analytics > Followers active hours; consistency matters more than exact minute. |

---

## 3. YouTube Shorts

| Item | Spec |
|---|---|
| Aspect / resolution | **Square or vertical** (9:16 ideal, 1080x1920; 2160x3840 accepted). Anything 16:9 = long-form. |
| Length | **Up to 3 min** for uploads on/after **Oct 15 2024** [OFFICIAL]. Upload via YouTube app or Studio. |
| Content ID rule | Any Short **> 1 min with an active Content ID claim of any type is blocked globally** (unplayable, not recommended, not monetised) [OFFICIAL]. Shorts Audio Library tracks: up to 60–90 s use in a 3-min Short. Use your own/licensed-and-cleared or YouTube Audio Library music for > 60 s Shorts. |
| Encoding | Same as long-form (Section 4). |
| Captions | **SRT/VTT upload supported** in Studio (Subtitles); auto-captions too. Burn in for style anyway (viewers mostly see Shorts with captions off). |
| Title / description | Title ≤ 100 chars (only first ~40 show on Shorts). Description 5,000. #Shorts no longer required; > 60 hashtags = all ignored. |
| Links | Links in Shorts descriptions/comments **not clickable** since Aug 31 2023. Use the **"Related video" link** (Studio desktop, points to a video on your channel) to drive to long-form [OFFICIAL/REPORTED]. |
| Thumbnail / cover | Mobile: pick any frame. Desktop: choose from suggested frames; **custom thumbnail upload for Shorts rolled out (2026) to YPP channels, 1080x1920, < 2 MB, no A/B test** [REPORTED]. Shorts shelf shows ~9:16 crop; channel Shorts tab ~9:16. |
| Safe zone (1080x1920) | Top ~240 (12.5%), bottom ~380 (≈20%, title/channel/progress bar), right ~200 (action rail), left ~60 [INDUSTRY]. |
| Algorithm signals | Swipe-away vs. "viewed" rate (percentage who keep watching), average % viewed (>100% possible via loops), likes, shares, subscribes. Since **Mar 31 2025, views count on every start/replay**; "Engaged views" (watched beyond a few seconds) used for monetisation/analytics [REPORTED]. |
| Originality | July 15 2025: "repetitious content" renamed **"inauthentic content"** — mass-produced, templated, low-variation content not eligible for YPP; reused content must be significantly transformed (commentary, editing, narration) [REPORTED]. |
| AI label | "Altered or synthetic content" disclosure required in Studio for realistic AI (cloned voice of real person, realistic fake scenes). Not required for clearly unrealistic/animated, or AI used for scripts/captions/colour. Label shows in description (or on player for sensitive topics). |

---

## 4. YouTube long-form

| Item | Spec [OFFICIAL encoding page] |
|---|---|
| Container | MP4, moov atom at front (**fast start**), no edit lists. |
| Video | H.264 High profile, progressive, **2 consecutive B-frames, closed GOP (GOP = half the frame rate)**, CABAC, VBR, 4:2:0. Upload at recorded frame rate (24/25/30/48/50/60). |
| SDR bitrates | 1080p: 8 Mbps (24–30) / 12 Mbps (48–60). 1440p: 16 / 24. 2160p: 35–45 / 53–68. Uploading 1440p/4K even for 1080p content gets the better VP9/AV1 encode ladder. |
| Colour | BT.709 primaries/transfer/matrix for SDR. |
| Audio | AAC-LC (or Opus) 48 kHz, stereo 384 kbps / 5.1 512 kbps. |
| Loudness | YouTube normalises down to ~**-14 LUFS** (does not turn quiet content up). Master to -14 LUFS, ≤ -1 dBTP. |
| Limits | 256 GB or 12 h per file (verified accounts; unverified 15 min). |
| Title / desc / tags | Title 100 chars (aim 50–70); description 5,000 (first ~150 chars matter); tags 500 chars total; > 60 hashtags = all ignored; first 3 hashtags show above title. |
| Thumbnail | 1280x720 (16:9), min width 640, JPG/PNG/GIF, **≤ 2 MB** (50 MB for some channels in Studio test). Test & Compare (A/B up to 3 thumbnails / titles). Avoid bottom-right corner (timestamp). |
| Captions | SRT/VTT/SBV upload; edit auto-captions. Chapters via timestamps in description (first at 0:00, ≥3, each ≥10 s). |
| Links | Clickable in description; end screens (last 5–20 s) and cards. |
| Signals | Click-through rate × average view duration / % viewed, satisfaction surveys, return viewers. Packaging (title + thumbnail) decided before the edit. |

---

## 5. LinkedIn video

| Item | Spec [OFFICIAL help a548372 unless noted] |
|---|---|
| Formats | MP4 (best), MOV, WebM, MKV, AVI, etc. |
| Size / length | 75 KB – **5 GB**; **3 s – 15 min** (desktop; mobile ~10 min). Ads up to 30 min. |
| Resolution / ratio | 256x144 – 4096x2304; aspect **1:2.4 to 2.4:1** (9:16, 4:5, 1:1, 16:9 all OK). |
| FPS / bitrate | 10–60 fps; 192 kbps – 30 Mbps. Target 1080x1920 or 1080x1350 at 8–12 Mbps. |
| Vertical feed | Dedicated full-screen vertical video feed/tab (2025–26); vertical **≤ 2 min** is eligible for it; aim 20–45 s [REPORTED]. Impression counted after > 2–3 s play. |
| Captions | **SRT upload supported** when posting (desktop "Select caption" / edit video settings); also auto-captions. Most views muted — burn in or upload SRT. |
| Thumbnail | Custom thumbnail upload on desktop (same aspect as video, ≥ 1080 wide recommended); otherwise auto-frame. |
| Post text | 3,000 chars; ~140–210 visible before "see more". 3–5 hashtags max (low weight). |
| Links | External links in the post body are reported to cut reach materially (est. up to ~60%) under the 360Brew ranking model [INDUSTRY]. Put link in first comment or say "link in comments"; native video + no link performs best. |
| Signals | Dwell time / watch-through, meaningful comments (long, early), relevance to poster's expertise, saves, reposts with commentary. Engagement pods and generic AI text deprioritised. Weekday business hours (Tue–Thu mornings local) are traditional peaks. |
| Safe zone | Vertical feed overlays: ~200 px top, ~400 px bottom (text/CTA), ~120 px right. |

---

## 6. X (Twitter) video

| Item | Spec |
|---|---|
| Formats | MP4/MOV; H.264 High, AAC-LC; ≤ 60 fps (up to 60). |
| Length / size | **Free: 140 s, 512 MB.** Premium: up to ~3–4 h at 1080p (web/iOS; Android shorter), up to 16 GB; 4K upload for Premium [REPORTED]. |
| Resolution / ratio | 1:2.39 to 2.39:1; 1920x1080 or 1080x1920 (vertical plays full-screen in the immersive video tab); 1280x720 minimum recommended. |
| Bitrate | 1080p ~6–10 Mbps upload; 25 Mbps max historically for API. |
| Captions | **SRT upload supported** on web composer ("Upload caption file (.srt)") [OFFICIAL help.x.com]. Only .srt. |
| Thumbnail | No custom thumbnail for organic posts (first frame / chosen by X); Media Studio for some accounts. → **Make frame 0 a strong title card-free hook frame** (no black). |
| Post text | 280 chars (Premium 25,000). 1–2 hashtags max. |
| Links | X product head (Oct 2025) says the external-link de-boost was removed; but links to rival social platforms are still restricted and link posts from non-Premium accounts often get low reach in practice [REPORTED]. Safe pattern: native video + link in reply. |
| Signals | Replies (esp. author replying back), reposts, bookmarks, dwell, video watch time; Premium accounts get ranking boost. Video autoplays muted → burn-in captions. |

---

## 7. Facebook Reels

| Item | Spec |
|---|---|
| Format | All new videos are being published as Reels (2025 unification); length/format restrictions removed for Reels (short + long) [REPORTED]. Reels tab replaced Video tab. |
| Specs | Same as IG Reels: 9:16, 1080x1920 (1440x2560 OK), MP4/MOV H.264, AAC, ≤ 4 GB, 23–60 fps. Short-form discovery still favours ≤ 90 s. |
| Captions | **SRT upload supported** — filename must be `name.en_US.srt` (lowercase language, uppercase country) or it silently fails. Auto-captions also available. |
| Cover | Custom thumbnail or frame selection; feed may show 4:5 crop. |
| Safe zone | Meta Reels ads rule 14% top / 35% bottom / 6% sides; organic overlays similar to IG. |
| Originality | July 14 2025 crackdown: duplicate reposts of others' content get reduced distribution; repeat offenders lose monetisation; FB links duplicates back to originals. Adding commentary/reaction counts as original [REPORTED]. |
| Signals | Watch time, completion, shares (incl. Messenger), comments; cross-posting from IG allowed (same account family, no watermark issue). |
| AI label | "AI info" as on Instagram. |

---

## 8. Loudness & audio (all platforms)

- Platforms normalise playback, mostly toward **≈ -14 LUFS** (YouTube documented in practice; Spotify-like behaviour). Instagram/TikTok are reported to sit a bit louder (-12 to -10 LUFS) and short-form music-heavy content often masters at -12 to -11 LUFS [INDUSTRY].
- **Recommended master: -14 LUFS integrated (-13 to -12 for music-forward short-form), true peak ≤ -1.0 dBTP, LRA ≤ 11.** Voice should sit ~-16 to -18 LUFS short-term under music beds ducked 8–12 dB.
- AAC-LC, 48 kHz, stereo, 192–320 kbps (YouTube 384 kbps). Avoid mono-incompatible stereo widening (phones collapse to mono).
- Most short-form viewers start muted on LinkedIn/X/FB feed → captions mandatory there; IG/TikTok/Shorts are sound-on dominant but captions still raise retention.

---

## 9. Safe-zone overlay spec (for automated frame checks, 1080x1920)

Coordinates are (x, y, w, h) from top-left. Run checks on: frame 0, the chosen cover frame, and every frame containing on-screen text/logo/CTA (or sample every 0.5 s).

| Zone | Rect | Rule |
|---|---|---|
| **UNIVERSAL ORGANIC SAFE BOX** (union of IG/TikTok/Shorts/FB/LinkedIn overlays) | x 60–880, y 250–1500 → **(60, 250, 820, 1250)** | All captions, key text, faces' eyes, logos must lie inside. |
| STRICT/ADS SAFE BOX (Meta 14/35/6 + right rail) | **(65, 269, 815, 979)** → y 269–1248 | Use when the piece may be boosted/used as an ad, or for CTAs. |
| Top overlay band | (0, 0, 1080, 250) | Username, "Reels/Following" tabs, search, Sponsored. No text. |
| Bottom overlay band | (0, 1500, 1080, 420) | Caption, audio ticker, Shorts title, progress bar, CTA. No text. (Ads: from y 1248.) |
| Right action rail | (880, 700, 200, 1220) | Like/comment/share/save/remix buttons + avatar. No text or faces. |
| Caption track (burned subtitles) | centre-aligned, baseline y ≈ 1150–1400, max width 820 px, ≤ 2 lines | Sits above the bottom band and clear of the rail. Avoid y > 1450. |
| **Cover/grid crop zones** | 3:4 grid = (0, 240, 1080, 1440); 4:5 feed = (0, 285, 1080, 1350); 1:1 legacy = (0, 420, 1080, 1080) | Cover title + subject must sit inside **(90, 480, 900, 960)** to survive every crop with margin. |

16:9 long-form (1920x1080): keep text out of bottom-right 300x120 (timestamp on thumbnail) and bottom 150 px (player controls/captions); title-safe 90% inner box (96, 54, 1728, 972).

Agent check procedure: render an overlay PNG with semi-transparent red bands for unsafe zones and green outline for the safe box; composite on sampled frames (`ffmpeg -i video -i overlay.png -filter_complex overlay`), then visually or programmatically (text bounding boxes via OCR) assert that every text bbox ⊂ safe box. Fail on any intersection with the right rail or bottom band.

---

## 10. ffmpeg export presets (from a high-quality master `master.mov`/`master.mp4`)

Common flags used below: `-pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart -c:a aac -ar 48000 -ac 2`. Loudness: run a two-pass `loudnorm` first (pass 1 measures, pass 2 applies `measured_*` values) or pre-master the audio; the one-pass filter shown is acceptable for speech.

```bash
# Instagram Reels / Facebook Reels — 1080x1920 30fps (use 1440x2560 + -b:v 16M for max quality)
ffmpeg -i master.mp4 -vf "scale=1080:1920:flags=lanczos,fps=30,format=yuv420p" \
 -c:v libx264 -profile:v high -level 4.2 -preset slow -crf 18 -maxrate 12M -bufsize 24M \
 -g 15 -bf 2 -sc_threshold 0 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
 -af "loudnorm=I=-14:TP=-1:LRA=11" -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart ig_reel.mp4

# TikTok — 1080x1920 30fps, keep under 4 GB / ideally < 287 MB for mobile hand-off
ffmpeg -i master.mp4 -vf "scale=1080:1920:flags=lanczos,fps=30,format=yuv420p" \
 -c:v libx264 -profile:v high -level 4.2 -preset slow -crf 18 -maxrate 15M -bufsize 30M \
 -g 15 -bf 2 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
 -af "loudnorm=I=-14:TP=-1:LRA=11" -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart tiktok.mp4

# YouTube Shorts — upload 2160x3840 if master allows (better VP9/AV1 ladder), else 1080x1920
ffmpeg -i master.mp4 -vf "scale=2160:3840:flags=lanczos,fps=30,format=yuv420p" \
 -c:v libx264 -profile:v high -level 5.1 -preset slow -b:v 40M -maxrate 45M -bufsize 90M \
 -g 15 -bf 2 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
 -af "loudnorm=I=-14:TP=-1:LRA=11" -c:a aac -b:a 384k -ar 48000 -ac 2 -movflags +faststart yt_short.mp4

# YouTube long-form — 3840x2160 (or 1920x1080 with -b:v 8M -maxrate 10M -level 4.2)
ffmpeg -i master.mp4 -vf "scale=3840:2160:flags=lanczos,format=yuv420p" \
 -c:v libx264 -profile:v high -level 5.1 -preset slow -b:v 40M -maxrate 45M -bufsize 90M \
 -g 15 -bf 2 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
 -af "loudnorm=I=-14:TP=-1:LRA=11" -c:a aac -b:a 384k -ar 48000 -ac 2 -movflags +faststart yt_long.mp4
#   (-g = half fps for closed-GOP spec: 12 @24fps, 15 @30fps, 30 @60fps)

# LinkedIn — 1080x1920 vertical (or 1080x1350 4:5 / 1920x1080), stay < 30 Mbps
ffmpeg -i master.mp4 -vf "scale=1080:1920:flags=lanczos,fps=30,format=yuv420p" \
 -c:v libx264 -profile:v high -level 4.2 -preset slow -crf 19 -maxrate 10M -bufsize 20M \
 -g 15 -bf 2 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
 -af "loudnorm=I=-14:TP=-1:LRA=11" -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart linkedin.mp4

# X — 1080x1920 or 1920x1080, ≤140 s & ≤512 MB for free accounts (trim with -t 140)
ffmpeg -i master.mp4 -t 140 -vf "scale=1080:1920:flags=lanczos,fps=30,format=yuv420p" \
 -c:v libx264 -profile:v high -level 4.2 -preset slow -crf 20 -maxrate 8M -bufsize 16M \
 -g 15 -bf 2 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
 -af "loudnorm=I=-14:TP=-1:LRA=11" -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart x.mp4
```

Verify after export: `ffprobe -v error -show_entries stream=codec_name,profile,width,height,pix_fmt,r_frame_rate,bit_rate,sample_rate,channels -show_entries format=duration,size -of json out.mp4` and `ffmpeg -i out.mp4 -af ebur128=peak=true -f null -` (check I ≈ -14, true peak ≤ -1). Decode-check: `ffmpeg -v error -i out.mp4 -f null -` must print nothing.

---

## 11. Pre-publish checklist (per platform file)

**File**
- [ ] Correct canvas (1080x1920 / 1440x2560 / 2160x3840 / 1920x1080 / 3840x2160), square pixels (SAR 1:1), no letterbox bars.
- [ ] H.264 High, yuv420p, BT.709 tagged, constant frame rate, closed GOP, `+faststart`; decode check clean.
- [ ] AAC-LC 48 kHz stereo; -14 LUFS (±1), true peak ≤ -1 dBTP; no clipping; audio in sync at the end.
- [ ] Duration within platform cap AND reach sweet spot (Reels ≤ 3:00, X free ≤ 2:20, Shorts with claimed music ≤ 1:00, TikTok > 1:00 only if targeting Rewards, LinkedIn vertical ≤ 2:00).
- [ ] File size under cap (X 512 MB free; TikTok mobile hand-off ≲ 287 MB).
- [ ] No watermarks/logos from other platforms or editors (CapCut, TikTok, IG); no "follow me on [other platform]".

**Frames**
- [ ] Frame 0 is a strong, non-black hook frame (it is the default cover on X and often the thumbnail).
- [ ] Hook spoken + visible within the first 1–2 s; no logo intro, no outro card.
- [ ] All text/logos/faces inside the universal safe box; nothing under the right rail or bottom band (overlay check passed).
- [ ] Burned-in captions ≤ 2 lines, ≤ 820 px wide, high contrast, inside y 1150–1400.
- [ ] Ending loops cleanly into the start (short-form replays).

**Packaging**
- [ ] Cover/thumbnail exported: 1080x1920 for vertical (title in centre 900x960 box), 1280x720 ≤ 2 MB for YouTube long-form; YouTube title/thumbnail A/B set if available.
- [ ] Caption/title written per platform limits; keywords in first line (search); hashtags: IG ≤ 5, TikTok 3–5, LinkedIn ≤ 3–5, X ≤ 2, YouTube 3 (≤ 60).
- [ ] CTA routing: IG "comment KEYWORD"/link in bio; TikTok bio link; Shorts → Related video link; YouTube long-form → description link + end screen; LinkedIn → link in first comment; X → link in reply.
- [ ] Captions file: SRT ready for YouTube, LinkedIn, X, Facebook (`name.en_US.srt`).
- [ ] AI disclosure toggled where realistic AI voice/visuals are used (IG/FB "AI info", TikTok AIGC, YouTube altered/synthetic).
- [ ] Music: owned/licensed; for Shorts > 1 min confirm no Content ID claim; for TikTok/IG commercial accounts use commercial-cleared library.
- [ ] Consider Trial Reel (IG) for hook A/B; Collab tag if co-created.
- [ ] Schedule for the account's own peak-activity window; plan to reply to comments in the first hour.

---

## Sources

- YouTube — Understand three-minute YouTube Shorts: https://support.google.com/youtube/answer/15424877?hl=en
- YouTube — Recommended upload encoding settings: https://support.google.com/youtube/answer/1722171?hl=en
- Meta Ads Guide — Instagram Reels video specs (safe zone 14/35/6, 1440x2560, 4 GB): https://www.facebook.com/business/ads-guide/update/video/instagram-reels
- LinkedIn Help — Video upload requirements: https://www.linkedin.com/help/linkedin/answer/a548372
- X Help — Upload caption (.srt) file to posts: https://help.x.com/en/using-x/upload-caption-srt-file
- Storyboard18 — Instagram extends Reels to three minutes, profile layout update: https://www.storyboard18.com/digital/instagram-extends-reels-to-three-minutes-and-updates-profile-layout-54043.htm
- Kapwing — Instagram's new 3:4 grid: https://www.kapwing.com/resources/instagrams-new-grid-layout-size-and-dimensions-2025/
- Social Media Today — Instagram thumbnail/cover editing for grids: https://www.socialmediatoday.com/news/instagram-introduces-thumbnail-post-editing-for-grids/813444/
- Planoly — Instagram original content policy update: https://planoly.com/blog/instagram-updates-its-original-content-policy
- Planoly — Instagram Trial Reels: https://api.planoly.com/blog/instagram-trial-reels
- BetaNews — Instagram limits hashtags to five: https://betanews.com/2025/12/19/instagram-puts-a-limit-on-hashtag-usage/
- Social Samosa — Instagram five hashtags per post: https://www.socialsamosa.com/news-2/instagram-hashtags-five-per-post-10923075
- Inro — Instagram Reels 20-minute limit explained: https://www.inro.social/blog/instagram-reels-can-now-be-20-minutes-long-new-time-limit-explained-2025
- Buffer — Instagram Reels length: https://buffer.com/resources/instagram-reels-length
- PPC Land — Instagram tests clickable caption links (Meta Verified): https://ppc.land/instagram-tests-clickable-links-in-post-captions-for-meta-verified-users/
- Dataslayer — Instagram algorithm 2025 (Mosseri's three signals): https://www.dataslayer.ai/blog/instagram-algorithm-2025-complete-guide-for-marketers
- TechCrunch — Meta crackdown on unoriginal Facebook content (Jul 2025): https://techcrunch.com/2025/07/14/following-youtube-meta-announces-crackdown-on-unoriginal-facebook-content
- Tubefilter — Unoriginal content fight comes to Facebook: https://www.tubefilter.com/2025/07/15/ai-slop-unoriginal-repetitive-content-monetization-facebook-meta/
- Plagiarism Today — YouTube targets "inauthentic" content: https://www.plagiarismtoday.com/2025/07/08/youtube-targets-inauthentic-content/
- PPC Land — YouTube clarifies inauthentic content policy: https://ppc.land/youtube-clarifies-inauthentic-content-policy-changes/
- PPC Land — YouTube Shorts view counting change Mar 31 2025: https://ppc.land/youtube-changes-how-shorts-views-are-counted-from-march-31/
- PPC Land — Shorts custom thumbnails, no A/B testing: https://ppc.land/youtube-ends-2-year-wait-for-shorts-thumbnails-but-blocks-a-b-testing/
- Tubefilter — Clickable links removed from Shorts descriptions/comments: https://tubefilter.com/2023/08/10/youtube-shorts-comments-spam/
- Search Engine Journal — Shorts related-video links: https://www.searchenginejournal.com/youtube-adds-shorts-links-limits-links-elsewhere/495463
- Postfa.st — TikTok video specs: https://postfa.st/sizes/tiktok/video
- Postpone — TikTok media limits: https://help.postpone.app/en/scheduling-posts/tik-tok-media-limits
- ezUGC — TikTok safe zones guide (130/484/44/140): https://www.ezugc.ai/blog/tiktok-safe-zones-guide
- Social Media Today — TikTok Creator Rewards for > 1 min videos: https://www.socialmediatoday.com/news/tiktok-announces-revamped-creator-rewards-program-to-incentivize-longer-u/710639/
- OpenClip — TikTok unoriginal content flag: https://openclip.app/guides/tiktok-slideshow-unoriginal-content-flag
- Kapwing — Change TikTok cover: https://www.kapwing.com/resources/how-to-change-tiktok-thumbnail/
- Maginative — TikTok C2PA auto-labelling: https://www.maginative.com/article/tiktok-partners-with-c2pa-to-label-ai-generated-content-and-promote-media-literacy/
- Billo — Platform AI labeling 2026: https://billo.app/blog/ai-labeling/
- Postfa.st — X video specs: https://postfa.st/sizes/x/video
- PPC Land — X drops link penalty: https://ppc.land/x-drops-year-old-link-penalty-musk-tells-zuckerberg-on-platform/
- Social Media Today — X limiting reach of some links: https://www.socialmediatoday.com/news/x-limiting-the-reach-some-links-mentions-posts/690980/
- Pocket-lint / t2online — Facebook Reels length; all videos become Reels: https://t2online.in/tech/tech-news/facebook-will-convert-all-videos-to-reels/1500401
- SyncWords — Facebook SRT naming: https://www.syncwords.com/blog/how-to-add-captions-subtitles-to-facebook
- TechCrunch — LinkedIn vertical video tools: https://techcrunch.com/2025/02/04/linkedin-amps-up-vertical-video-tools-as-uploads-jump-36
- SocialPilot — LinkedIn algorithm 2026 (360Brew, link reach): https://www.socialpilot.co/de/blog/linkedin-algorithm
- Fora Soft — LUFS targets per platform 2026: https://www.forasoft.com/learn/audio-for-video/articles-audio/lufs-targets-per-platform-2026
- OpenClip — Audio normalization LUFS targets: https://openclip.app/learn/audio-normalization
- Reap — Shorts/Reels/TikTok safe zones: https://reap.video/blog/short-form-video-safe-zones
- Designsensory — Social safe zones 2025: https://designsensory.com/insights/social-media-safe-zone/
