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
| 8 | "Motion Designing is cooked" (Cevox) | **3D Bauhaus showreel**: numbered-chapter HUD, colour-per-section, travelling red-dot motif, shape match-cuts, word-does-what-it-says, primitive swarm | `references/style-motion-showreel.md` (2nd ref), `D:\codes\workef-reels\DeF8z3XoLdh\VISUAL-NOTES.md` | — |

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
| B2B cinematic product promo | B2B (product) | real-time 3D ring (three.js), glass panels in 3D perspective, gold dust, light sweeps | — | superseded (client is a SERVICE) |
| B2B story with cartoons | — | — | — | ✗ "cartoonish" for B2B |
| **B2B fluid film** (current B2B benchmark) | B2B service | researched pain hook, liquid-gold metaball thread (flood reveal, droplets→cards→melt, merge into ring → 3D ring), living gradient, stretch kinetic type, first-person brand VO | — | "good, make it more refined" → refined |
| **Client-website-accurate film** | brand gives site source | copy their public assets + rebuild their UI 1:1 (one shared cards module per client, kept in the project), honest wording for custom-scoped features, live-site scroll via `scripts/site_scroll_capture.mjs` | — | accepted |
| **Client widget in video** | brand gives component source | their real stylesheet + class markup, CSS keyframes pinned to frame (copy their stylesheet into the project only, never into the skill) | — | "looking good" |
| **Device-frame outro** (MacBook → iPhone → iPad → line-up) | proof / "we built this" ending | CSS space-grey frames, desktop capture re-flowed into phone/tablet crops, VO-anchored springs (`templates/Devices.tsx`) | — | delivered |
| **Hinglish VO** (user- or Gemini-made) | Indian SMB audience | Roman-Hinglish kinetic subtitles, script aligned to audio (`scripts/align_script_to_audio.py`), Gemini TTS (`scripts/gemini_tts.py`) | — | delivered |
| **English VO + Arabic subtitles** | Gulf / Arabic market | one Arabic line per spoken sentence, RTL word reveal, Almarai + Amiri gold accents (`templates/RtlSubtitles.tsx`) | — | delivered |

## C. Subtitle styles used (never reuse the last one by default — ask)
dark typewriter strip · chat bubbles · Roman-Hinglish kinetic words · Arabic RTL line reveal · sticker captions · elegant lower-third · kinetic spoken words (Radar / fluid) ·
karaoke (older) · handwritten marker / bold word-pop / censor-bar (offered).

## D. Voices
User's own recording (best) · Smit clone (founder, ElevenLabs) · Emma / Riya Rao (ElevenLabs v3 with emotion tags —
user later found ElevenLabs "very AI" for B2B) · **Gemini TTS Kore** with AUDIO PROFILE/DIRECTOR'S NOTES prompt (current
pick for B2B; `scripts/gemini_tts.py`; never quote transcript lines in the notes). User may also supply Gemini audio. Brand promos speak in FIRST person ("we").

## E. Standing rules (where they live)
Retention first 2 s, value-first + angle question, orientation + subtitle style + audience type asked every time,
B2B = no cartoons, product vs service check, fill the frame, deliver only the final mp4 to Desktop, voice/picture polish,
skills + repo updated after every round → `SKILL.md` §0–0d, `production-lessons.md`, `value-scripting.md`.
