# Value-first scripting for NON-technical viewers (user rule, 2026-10-06)

## 0. ALWAYS ask the script ANGLE first (user rule) — never default to technical
In the intake, ask which kind of video this is, and RECOMMEND one based on the market/audience:
| Angle | Best when | Example |
|---|---|---|
| Problem-solving / value (money · time · growth) | broad / non-technical buyers, owners, SMBs | "Half my ad money is wasted — which half?" |
| Storytelling (a person + a moment + a turn) | consumer, local business, emotional products, founders | "Meet Riya, she runs a café…" |
| Technical / how-it-works | experts, devs, marketers who already know the category | "Your GA4 shows Facebook, facebook and FB…" |
| Demo / walkthrough | users evaluating the tool, onboarding | screen + clicks |
| Social proof / testimonial / case study | trust-sensitive, B2B, higher price | customer result, quote |
| Educational / value tip (no selling) | top-of-funnel growth content | glossary reels |
| Hype / launch teaser | announcements, coming soon | mobile teaser v3 |
| Founder / behind-the-scenes, UGC-style, comparison | personal brands, challengers | "why we built it", "X vs Y" |
Recommend per market: SMB/consumer → problem-solving or story; marketers/agencies → technical-light + proof;
developers → technical/demo; launch → hype. Offer 2–3 scripts in the chosen angle (and one in another angle if useful).


User feedback on the linkutm promo v2: "the script is too technical… assume a guy who is not related to links,
campaign tracking, GA4… a person will only watch if we provide value: saves time or money or grows the individual
or the company." Every promo/explainer script goes through this before it's shown to the user.

## 1. Translate features → outcomes a business owner feels
Write the product as a table first: feature → what changes in the viewer's life → which of the 3 values.
| Value | Questions to answer in the script |
|---|---|
| Money | What do they stop wasting? What do they stop paying for twice? |
| Time | What manual/annoying job disappears? How much faster is it? |
| Growth | What can they finally do more of because they now know what works? |

## 2. Rules
- **Jargon ban** in VO and captions unless the audience is explicitly technical: UTM, GA4, source/medium,
  parameters, attribution, API, CTR, conversion, analytics stack. Say what it DOES ("see which post brought
  the customers"), not what it IS.
- **A relatable person + a concrete situation** (café owner, boutique, coach, small agency, creator) in the
  first 3 s. Money/time in their units (posters, WhatsApp blasts, Instagram ads, influencers, reprints).
- **Hook = the pain or a known truth**, e.g. Wanamaker's "Half the money I spend on advertising is wasted;
  the trouble is I don't know which half." → "Now you can know."
- **One idea per video.** Max 3 features, each said as a result.
- **Honest outcomes:** claim only what the product measures (e.g. clicks per link, where they came from) —
  "which one brought sales" only if it really can (say "your website analytics can tell" when it's via another tool).
  Illustrative numbers are fine in a story, but never as customer results.
- **The "café owner test":** read the script as someone who has never run an ad. If any line needs a definition,
  rewrite it.
- End on the value + a low-risk CTA ("free to start").

## 3. linkutm in plain words (from linkutm.com, 2026-10)
- What it is: one place to create the links and QR codes you share everywhere, and see which ones people
  actually click — and from where.
- Money: stop paying for promotions that don't bring people; put more into the ones that do. Change where a
  printed QR code goes without reprinting ("Change destination after printing without reprints").
- Time: no spreadsheets or copy-pasting; templates fill the details in one click; the whole team's links stay
  consistent automatically, so reports don't need cleaning.
- Growth: you know which channel/post/partner works → double down on it.
- Trust: links on your own name (yourshop.com/…) instead of random short links.
- Proof on site: free plan (25 links/month, no credit card); quote "linkutm keeps every campaign link clean and
  consistent across our whole team" — Aakash, GTM Expert. CTA "Start for free".

## 4. Built example (2026-10-06): linkutm "Which half?" (`promo-video-studio/src/LinkutmPromoValue.tsx`)
Visual grammar for a non-technical value promo: famous quote on old paper + a banknote torn in half (half greys
"wasted", halves shuffle with "?" on "which half") → the 4 places you promote as real-looking mini UIs (Instagram
post, WhatsApp chat, printed poster, influencer story) with coins flying from a budget bar into each → "New orders"
counter + red "?" on each place ("but from where?") → calendar flip "NEXT MONTH", coins fly again → brand drop →
each place gets its own link chip / QR → cards morph into a "Clicks this month" scoreboard + city chips → weak rows
"Paused", budget sliders move money to the winner → CTA. Only show what the product measures (clicks/scans/where),
never claim it counts sales.

## 5. Built example: storytelling promo, 16:9 (linkutm café story, `src/LinkutmCafeStory.tsx`)
- Layout 16:9: illustrated stage on the left (1300 px), a chat panel on the right as the SUBTITLES.
- Chat-bubble subtitles: each spoken phrase = one message; words appear as spoken; "typing…" dots + header
  status before the next message; narrator bubbles left/white, the character's emotional beats right/brand gradient;
  stack with a bottom-anchored flex column (browser measures heights — no overlap), older messages fade.
- Code-drawn flat character (Riya) with moods per beat: happy / neutral / excited / confused (+ "?" marks) /
  sigh (closed eyes + sweat drop) / amused; she waves at the start and holds up her phone on the brand drop.
- Story beats: everything she tried pops in with coins from the till → café packed (guests pop in) → "?" on every
  prop → calendar flips "NEXT MONTH", coins fly again → brand drop from her phone → each prop gets its own link/QR →
  "a week later" laptop with clicks & scans → flyers crossed, coins move to the winner → café busy, she waves → CTA.

## 6. Know if the client sells a PRODUCT or a SERVICE (lesson, 2026-10-06)
I once built two promos treating a client as SaaS ("replace your Excel"); the user corrected: it's a SERVICE that builds
a custom system for each jeweller. Before scripting, state in one line "what they sell, to whom, how it's delivered"
(product / done-for-you service / marketplace…) and confirm it with the user. Signals of a service: "requirement-based
quote", "custom work", "how we work with you", "discuss your requirement", portfolio of client builds.
Story shape for a service: the client's customer (persona) has a goal → hard questions → the service team builds it
around them (not a template) → each deliverable appears → one connected result → life after → CTA.

## 7. Brand voice = FIRST PERSON (user rule, 2026-10-06)
When the video is the brand's own promo, the narrator IS the brand: "we", "we're <Brand>", "we build…",
never "they"/"the company". Third person only for the customer in the story (the persona, "her customers").
