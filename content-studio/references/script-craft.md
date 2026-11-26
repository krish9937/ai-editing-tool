# Script craft: how a script is BUILT and CHECKED (learned 2026-11-26)

Source: the "Script Writing" skill in github.com/Serennity007/awesome-video-creation (`skills/creative-planning/script-writing.md`,
commit 4a67670, MIT), studied at the user's request and **adapted to our rules**. Use it together with
`value-scripting.md`: that file decides WHAT to say (angle, value, no jargon, relatable person, first-person brand); this one
decides HOW the script is built, formatted and tested. Claude writes every script itself (user rule 2026-10-07).

Where the source conflicts with this user's rules, our rule wins. Those spots are marked **(ours)**.

---

## 1. Lock the parameters before writing (add to the intake)
| Parameter | Options |
|---|---|
| Video type | tutorial · explainer · story · review · promo/launch · value tip · founder |
| Script ANGLE | from `value-scripting.md` §0 (ask + recommend), **(ours)** |
| Length | reel 15–60 s · short promo 30–60 s · film 1–3 min · YouTube tutorial 3–25 min |
| Audience | beginner · intermediate · expert · general (default: non-technical) |
| Platform | IG/TikTok/Shorts · YouTube · LinkedIn · website/ads |
| Tone | professional · casual · humorous · educational · hype |
| Voice | founder's own voice · AI voice (which) · music-only (then on-screen words ARE the script), **(ours)** |

**Write the title / cover text FIRST** (≤ 4 words). If you can't, the core promise isn't clear yet.

## 2. The hook: pattern interrupt → pain → promise
The source's timing (0–5 s / 5–15 s / 15–30 s) is for long YouTube videos. Scaled:
| Format | Pattern interrupt | Pain / problem | Promise / preview |
|---|---|---|---|
| Reel / short promo (ours) | **0–1 s, spoken at frame 0 + on screen** | 1–3 s | 3–6 s |
| 16:9 film 1–3 min | 0–3 s | 3–10 s | 10–20 s |
| YouTube tutorial / long-form | 0–5 s | 5–15 s | 15–30 s ("by the end you'll have…") |

Hook openers that work: a bold claim, a question, a surprising (TRUE) fact, a known truth ("Half my ad money is wasted…").
Never "Hey guys, welcome to my channel…". A curiosity gap must open before the promise.

## 3. Body frameworks
- **Problem → Agitate → Solve → Prove → CTA** (the source's default): pain, why it hurts (money/time/growth), the fix
  (the product as a RESULT), proof (honest numbers, real UI), low-risk CTA.
- **Feature promo** (our benchmark, Bio Pages v2): Hook → Problem → REVEAL (product named on the drop) → 2–4 concrete
  features, each as a result → payoff → CTA.
- **Story** (cold open → setup → conflict → resolution → lesson → CTA), scaled for a 30–60 s reel: cold open 0–2 s ·
  setup 2–8 s · conflict 8–20 s · resolution 20–40 s · lesson + CTA last 5 s. 16:9 story films: double it.
- **Tutorial**: hook (result first) → "here's what we're building" preview → one section per step (key point +
  concrete example + checkpoint line) → recap → CTA/next video.

## 4. Writing for the EAR (spoken, not read)
- Sentences < 20 words (long-form); **< 12 words in reels**. Fragments are fine; spoken language is fragmented.
- Address the viewer as **"you"**. **(ours)** When the brand speaks about itself in its own promo, it says "we", never "they" or "the company".
- Active voice. No jargon, or say what it DOES (`value-scripting.md` §2).
- **Specific numbers and examples**, not vague claims, but only TRUE ones; illustrative numbers only inside a clearly fictional story.
- One idea per beat. **Beats, not paragraphs:** long-form beat = 15–30 s; reel beat = 2–6 s (one line, one visual).

## 5. Engagement patterns (frequencies scaled to the format)
| Pattern | Long-form | Reel / promo |
|---|---|---|
| Open loop (tease what's coming) | each section | once, in the hook ("…and the third one surprised us") |
| Rhetorical question / direct address ("If you're thinking…") | every 60–90 s | 1 in the middle |
| "But here's the thing…" turn | at each act change | at the reveal |
| Micro-summary after a complex part | after each complex section | the CTA line doubles as the summary |
| Pattern interrupt | every 3–4 min | a visual change every 2–5 s, a re-hook every 10–15 s (`SKILL` §5) |
| Rewatch reward (a hidden detail, a loop ending that flows into the start) | optional | aim for one |

Front-load value: the best content sits in the first 60 % of the runtime.

## 6. Production format: OUR script layout (replaces the source's bracket notes)
The source puts visual notes `[B-ROLL: …]`, `[TRANSITION]` and pauses `[...]` INSIDE the narration. **Don't (ours):** our TTS
(ElevenLabs v3, Gemini) reads square brackets as emotion tags or speaks them. Use a beat table instead:

| # | Time | VO (spoken text only) | On-screen words | Visual + named motion recipe | Music / SFX cue |
|---|---|---|---|---|---|
| 1 | 0–1.2 s | `[playful] Everyone says "link in bio"… but your bio only fits ONE link.` | "ONE link" | 3D phone mid-orbit, `MK.crunch` on "ONE" | drop-in kick, phone buzz |

- VO column: spoken words + **emotion tags only** in `[ ]` (sparse for ElevenLabs v3; full per-beat profile for Gemini),
  `…` for pauses, CAPS for emphasis. Nothing else in brackets.
- Visual column: what's on screen + the §0m motion recipe; B-roll/visual change every beat (reels) or every 30–45 s (long-form).
- Mark lower-thirds/title cards, music and SFX cues in their own columns. **No end screen / outro card (ours):** the CTA is
  spoken (or shown) in the last 2–4 s on a moving shot.
- Word budget: 2.0–2.5 words/s; VO = 85–90 % of the runtime (`openmontage-lessons.md`).

## 7. Quality checks before showing the user
- [ ] **Read it aloud, then render it with the actual TTS voice** and whisper-check it: no tongue-twisters, numbers said the way they're written.
- [ ] Hook timed: reels spoken at frame 0 and the promise by ~6 s; long-form under 10–30 s.
- [ ] **"So what?" test** after every beat (pairs with the café-owner test): if the viewer can't say why it matters, rewrite.
- [ ] Something happens on screen in every beat (no static talking-head stretches; `motion_qa` catches the rest later).
- [ ] Variety: an engagement pattern or visual change at the format's rate (§5).
- [ ] Length matches the target (word budget §6).
- [ ] Platform fit: never the same script for a 30 s reel and a 20-min tutorial.
- [ ] Truth: every claim and feature verified (real, shipped, mounted in the app); no sales claims for linkutm.

## 8. Pitfalls (from the source; all apply)
1. Writing for eyes, not ears. 2. No breathing room (pauses before the punchline). 3. A weak hook ("welcome to my
channel"). 4. Burying the lead. 5. No visual variety cues. 6. Ignoring platform norms. 7. The perfect-grammar trap.

## 9. Pro tips worth using
- **Founder-voice reels:** ask the founder to talk the idea through as a voice memo first, then tighten it into the
  beat table, keeping their phrases. Mark 1–2 spots for ad-libs.
- **Script the rewatch:** a detail in the first second that pays off at the end, or an ending that loops into frame 0.
- **Write the cover/title first** (§1) and check that the hook delivers exactly that promise.
