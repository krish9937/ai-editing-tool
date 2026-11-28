/**
 * Seek and measure every sample for one tween inside a single browser
 * evaluation. GSAP/HyperFrames seeks update DOM state synchronously, so a
 * separate CDP round trip and wall-clock sleep per sample only adds latency.
 */
export async function sampleTweenBboxes(page, selector, times) {
  return page.evaluate(
    ({ selector: sel, times: sampleTimes }) => {
      const seek = (time) => {
        if (window.__hf && typeof window.__hf.seek === "function") {
          window.__hf.seek(time);
          return;
        }
        const timelines = window.__timelines;
        if (!timelines) return;
        for (const timeline of Object.values(timelines)) {
          if (typeof timeline.seek === "function") timeline.seek(time);
        }
      };

      return sampleTimes.map((time) => {
        seek(time);
        // Selectors built from utility classes (Tailwind "text-[0.85em]", "w-1/2", "md:flex") are invalid CSS unless
        // escaped, and shadow-DOM nodes never match document.querySelector: treat both as "missing", never crash.
        let el = null;
        try { el = document.querySelector(sel); }
        catch (e) {
          try {
            const safe = sel.replace(/\.([^\s.#>+~]*[\[\]\/:%][^\s.#>+~]*)/g, (m, c) => "." + CSS.escape(c));
            el = document.querySelector(safe);
          } catch (e2) { el = null; }
        }
        if (!el) return { t: time, x: 0, y: 0, w: 0, h: 0, missing: true };
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return {
          t: time,
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          w: Math.round(rect.width),
          h: Math.round(rect.height),
          opacity: parseFloat(style.opacity),
          visible: style.visibility !== "hidden" && style.display !== "none",
        };
      });
    },
    { selector, times },
  );
}
