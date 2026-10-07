# Style catalog — every edit type this user has shown, asked for or approved (index)

Read this when picking a direction; each row points to the deep reference + the Remotion comp that implements it
(`D:\codes\promo-video-studio\src\…`). Verdicts are the user's own words/outcomes.

## A. Reference reels the user showed (studied → technique names → rules)
| # | Reference | Style | Spec / reference | Built test |
|---|---|---|---|---|
| 1 | HeyClicky reel | founder hook + illustrated cutaways | `D:\codes\video-ideas\ig1\VISUAL-SPEC.md` | — |
| 3 | @adilet.fndr value reel | numbered chapters, live counter, headline-as-caption, colour world per chapter, "Comment KEY" | `video-ideas\ig3` | — |
| 4 | "Claude Cooked" (Tally) | **filmed-screen promo**: phone films a laptop playing a motion promo; number-subtraction story; meta "made with AI" | `references/style-filmed-screen-promo.md`, `ig4` | `StyleTestFilmedScreen.tsx` |
| 5 | @grafigator showreel | **motion showreel**: decode intro, word-per-beat, dot grids, metaballs, UI assembly, HUD | `references/style-motion-showreel.md`, `ig5` | — |
| 6 | "Radar" waitlist promo | **framed narrated promo**: kinetic blur-in words, UI cards, map + counter, CTA pill | `style-motion-showreel.md` (variant), `ig6` | `LinkutmPromoRadar.tsx` |
| 7 | Heinz reel (user's own footage) | talking head + whiteboard | `playbook-talking-head.md` | `HeinzReel.tsx` |

## B. Formats built and their verdicts
| Style | When | Key techniques | Comp | Verdict |
|---|---|---|---|---|
| **Launch / coming-soon teaser** (benchmark) | any launch | phone drop on bass hit, colour-flip world, slow-mo hero moment, abundance wall (QR banners), built drop, context outro + store badges | `LinkutmMobileTeaserV3.tsx` | "best video by far" |
| Store-listing cut | Play/App Store | no "coming soon"/badges/CTA; App Store = real screen capture only | `LinkutmMobileStore.tsx` | delivered |
| **Talking-head value reel** | founder footage | spoken hook at frame 0; cut-out speaker on ORIGINAL background with visuals behind the head; visuals fill frame; captions under | `GlossaryDirectTraffic.tsx` | approved after fixes |
| **User-reel edit: doodles above head** | creator footage | per-shot grade + mirroring, case-file/whiteboard paper panel above the head, sticker captions, whiteboard highlighter (removed after the point), tape unroll, no subs on Hindi lines | `HeinzReel.tsx` | "rest all is good" |
| Radar-style promo v1/v2 | brand promo | kinetic text → v2: captions + UI labels, fill the frame | `LinkutmPromoRadar(V2).tsx` | v2 still "too technical" |
| **Value promo (problem-solving)** | non-technical buyers | famous-quote hook, torn banknote, mini real-looking UIs, coins/budget bar, scoreboard, budget sliders | `LinkutmPromoValue.tsx` | accepted |
| **Storytelling 16:9 (consumer)** | SMB/consumer | persona story, illustrated world + character moods, chat-bubble subtitles | `LinkutmCafeStory.tsx` | posted (IG/X/YT/LI copy written) |
| B2B cinematic product promo | B2B (product) | real-time 3D ring (three.js), glass panels in 3D perspective, gold dust, light sweeps | `JewelleryOSPromoV2.tsx` | superseded (client is a SERVICE) |
| B2B story with cartoons | — | — | `JewelleryOSStory.tsx` | ✗ "cartoonish" for B2B |
| **B2B fluid film** (current B2B benchmark) | B2B service | researched pain hook, liquid-gold metaball thread (flood reveal, droplets→cards→melt, merge into ring → 3D ring), living gradient, stretch kinetic type, first-person brand VO | `JewelleryOSFluid.tsx` | "good, make it more refined" → refined |

## C. Subtitle styles used (never reuse the last one by default — ask)
dark typewriter strip · chat bubbles · sticker captions · elegant lower-third · kinetic spoken words (Radar / fluid) ·
karaoke (older) · handwritten marker / bold word-pop / censor-bar (offered).

## D. Voices
User's own recording (best) · Smit clone (founder, ElevenLabs) · Emma / Riya Rao (ElevenLabs v3 with emotion tags —
user later found ElevenLabs "very AI" for B2B) · **Gemini TTS Kore** with AUDIO PROFILE/DIRECTOR'S NOTES prompt (current
pick for B2B). Brand promos speak in FIRST person ("we").

## E. Standing rules (where they live)
Retention first 2 s, value-first + angle question, orientation + subtitle style + audience type asked every time,
B2B = no cartoons, product vs service check, fill the frame, deliver only the final mp4 to Desktop, voice/picture polish,
skills + repo updated after every round → `SKILL.md` §0–0d, `production-lessons.md`, `value-scripting.md`.
