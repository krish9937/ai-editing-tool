<inputs>
Ask me for: the one-line promise (default: "Every link, clean and counted."), 3–5 real linkutm moments to show
(default: UTM builder with a template, naming rule fixing "FB" → "facebook", branded short link, dynamic QR, live click
map), the accent colour (default linkutm orange #F2541B on warm off-white #F7F4EF, ink #1C1C1C), fonts (default Inter for UI,
Inter Display 800 for the wordmark), the orientation (16:9 1920×1080 or 9:16 1080×1920), and a licensed track ~120 BPM with a
clear drop + its drop time. If I skip anything, use the defaults and a placeholder track I can swap later.
</inputs>

<direction>
A 15-second launch film for linkutm, 2D only, one continuous take. The hero is THE LINK: a single orange-outlined pill that
never leaves the screen. It starts as an ugly 140-character URL, and every scene is that same pill changing state — it never
fades, never cuts, it morphs (width, radius, fill) while its text swaps inside its own mask.
Look: warm off-white canvas, black UI chrome rebuilt from the real linkutm app (not screenshots), one orange accent used only
on the hero pill, the cursor halo and the final dot. One UI font. A real cursor drives every change with clicks and drags;
the camera zooms Screen-Studio style so each moment fills the frame, one eased move per scene, never in-then-out.
Only show what linkutm really does: UTM templates and naming rules, branded short links, dynamic QR codes, real-time clicks
by country and device. Never show sales, revenue, conversions or ROAS — linkutm counts clicks.
Banned: glows (→ crisp 1px borders), particle bursts (→ the pill itself reacts), crossfades (→ morphs), bouncy springs
(→ tiny overshoot only on landings), camera shake (→ one eased push), gradients on UI (→ flat fills), text in frame corners,
holds over 1 s, invented numbers or features, anything that looks like a template.
</direction>

<structure>
120 BPM, 30 beats (15 s), something happens on every beat; the drop lands on beat 8.
b0–2 Hook: the long ugly URL types itself across the frame and wraps three times; it stutters, overflows the pill.
b2–4 Builder: the cursor clicks "UTM template · Spring sale"; source/medium/campaign chips drop into slots on the beats.
b4–6 Rule: a teammate types "FB"; the chip flashes, a naming-rule tag slides under it, and it snaps to "facebook".
b6–8 Shorten: the cursor drags the pill's end; the 140 characters collapse letter by letter into go.yourbrand.com/spring.
b8 DROP: the short link clicks itself; the pill folds into a square and becomes a QR code (modules fill row by row).
b8–12 Dynamic QR: the QR prints onto a café menu card; the cursor swaps the destination — the printed code stays, only the
      destination under it changes (old page slides out, new page slides in).
b12–18 Clicks: the QR unfolds back into the pill, which now carries a counter; dots land on a world map on the beats
       (country chips), a device split draws in (mobile / desktop), the counter ticks — real-time, nothing else.
b18–24 Team: the pill duplicates into three client workspaces (switcher), each keeping its own links; one click switches.
b24–30 End: the three pills merge back into one, shrink to an orange dot, the dot becomes the full stop of the wordmark
       "linkutm", the promise line types under it, URL linkutm.com. Last frame matches the first frame's framing.
</structure>

<sound>
Analyse the track for the beat grid and drop; start on a downbeat; every cut-free scene change on a downbeat. One real SFX per
event (key taps while typing, chip drops, a soft click on each cursor press, a paper slide for the menu print, quiet ticks for
the counter), each placed by its measured peak and kept under the music. No pings, no risers longer than one bar. Music-only
master around −10 LUFS, true peak −1 dBTP.
</sound>

<build>
1. Remotion (or HyperFrames) composition at the chosen size, 60 fps. Every value computed from time; no timers, no randomness.
2. One world layer + one camera transform (x, y, log-zoom keyframes). Springs as closed-form step responses; a value with
   several targets = the sum of one spring per change.
3. The hero pill is ONE component through the whole film with continuous props (width, radius, fill, content mask); the QR is
   drawn from a real QR matrix of go.yourbrand.com/spring so it scans.
4. UI rebuilt from the real app kit (Links page, UTM dialog, workspace switcher, analytics map) at a readable virtual size
   (1280×720 scaled into the frame), never a scaled-down full-size screenshot.
5. Motion blur from 4–8 sub-frames on fast moves only; stationary text stays sharp.
</build>

<gotchas>
The collapsing URL must keep its letters in order while they shrink — no scramble. Text swapping inside the pill needs its own
mask and separate in/out timings. The QR must scan in the final render. Keep every on-screen claim to clicks, never sales.
Floods/morphs that fill the frame must overscale past the corners. Keep the counter readable during camera moves.
</gotchas>

<start>
Ask me for the inputs, then show me the beat map and 4 stills (ugly URL, rule fix, QR on the menu, click map) before building
the full film.
</start>
