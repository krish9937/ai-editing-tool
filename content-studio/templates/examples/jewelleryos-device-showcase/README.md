# JewelleryOS device showcase (recovered example, 2026-10-07)

Closing "proof" scene from the JewelleryOS v4 promo: the client's real store on a MacBook → iPhone → iPad, then all three
line up under the logo, timed to VO words. Recovered on 2026-10-28 from the old branch `skills-update-2026-10-08`.

- `DeviceShowcase.tsx` — the scene (springs between device states anchored to VO words).
- `Devices.tsx` — the CLIENT-SPECIFIC version of the device frames (store screens re-flowed from a full-page capture
  `store_full.png`, 1910×9441; imports `S` from the project's `SiteCards.tsx`).
- Also needs the project files `SiteCards.tsx` and `AssistantWidget.tsx` (in the studio at `src/jos/`; not copied here — client-specific).

For new work use the generic frames in `content-studio/templates/Devices.tsx` (MacBook / IPhone / IPad / Crop with `src`)
and treat this folder as a reference for re-flowing a desktop capture into phone/tablet layouts.
