// ===========================================================================
// Harness.tsx — the GENERIC engineering scaffold every video in this studio
// shares. Copy into src/ and build your composition on top; replace PALETTE and
// Stage with the brand's own design system. This file is deliberately
// brand-neutral: it is the plumbing, NOT the look.
//
// WHY THIS EXISTS: this ~200 lines is identical across every video and is where
// the expensive mistakes live (the 30→60fps scale maths, the blur trap, where
// captions must be mounted). Rewriting it per project reintroduces bugs already
// paid for. Every non-obvious line below is commented with the reason.
// ===========================================================================
import {
  AbsoluteFill, Composition, Sequence,
  interpolate, spring, useCurrentFrame, useVideoConfig,
} from "remotion";
import React from "react";

// ---- the 30→60fps harness -------------------------------------------------
// Author everything in LOGICAL frames at 30fps on a 1920×1080 canvas, then
// render at 60fps 4K by scaling ×2. Keeps timing arithmetic human-readable
// while still delivering true 4K60. Multiply logical frames by SCALE for
// anything Remotion consumes (Sequence.from, durationInFrames, spring frames).
export const LOGICAL_FPS = 30;
export const RENDER_FPS = 60;
export const SCALE = RENDER_FPS / LOGICAL_FPS;

export const clampI = (f: number, a: number, b: number, c: number, d: number): number =>
  interpolate(f, [a, b], [c, d], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const hexA = (hex: string, a: number): string => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export const SANS = "Inter, system-ui, sans-serif";
export const MONO = "'JetBrains Mono', ui-monospace, monospace";

// REPLACE THIS per brand — pull real hex values off the product's site.
export const PALETTE = {
  stage: "#fdfdfc", ink: "#141414", dim: "#6f675d", faint: "#a89f95",
  line: "rgba(20,16,12,0.09)", accent: "#ff6200",
  good: "#16a34a", bad: "#dc2626",
};

// ---- context --------------------------------------------------------------
// Layout is provided once at the root so every child can react to portrait vs
// landscape WITHOUT prop-drilling. SceneCtx carries the per-scene LOGICAL frame
// so scene internals never do their own SCALE maths.
type Layout = { LW: number; LH: number; portrait: boolean };
export const LayoutCtx = React.createContext<Layout>({ LW: 1920, LH: 1080, portrait: false });
export const useLayout = () => React.useContext(LayoutCtx);
export const SceneCtx = React.createContext(0);
export const useSceneFrame = () => React.useContext(SceneCtx);

// ---- SceneFrame — continuous push + drift + zoom-through cuts --------------
// Satisfies the "something moves every frame" rule: a slow scale push plus a
// sinusoidal drift means nothing ever pops in and freezes.
export const SceneFrame: React.FC<{ seed: number; durL: number; children: React.ReactNode }> = ({ seed, durL, children }) => {
  const rf = useCurrentFrame();
  const fL = rf / SCALE;

  const push = 1 + clampI(fL, 0, durL, 0, 0.05);
  const driftY = Math.sin(fL / 24 + seed) * 6;   // seed keeps scenes out of phase
  const driftX = Math.cos(fL / 33 + seed * 1.7) * 4;

  const inPop = spring({ frame: rf, fps: RENDER_FPS, config: { damping: 16, mass: 0.9 }, durationInFrames: 16 });
  const inScale = interpolate(inPop, [0, 1], [1.07, 1]);
  const inBlur = clampI(fL, 0, 9, 5, 0);
  const inOp = clampI(fL, 0, 8, 0, 1);

  const outStart = durL - 10;
  const outScale = clampI(fL, outStart, durL, 1, 1.04);
  const outBlur = clampI(fL, outStart, durL, 0, 4);
  const outOp = clampI(fL, outStart, durL, 1, 0);

  const blurAmt = inBlur + outBlur;

  return (
    <SceneCtx.Provider value={fL}>
      <AbsoluteFill
        style={{
          opacity: inOp * outOp,
          // RENDER-COST TRAP: `filter: blur(0px)` still forces a full-frame
          // rasterisation every frame at 4K. Emit "none" when there is no blur
          // — this is worth many minutes over a long render.
          filter: blurAmt > 0.05 ? `blur(${blurAmt}px)` : "none",
          transform: `translate(${driftX}px, ${driftY}px) scale(${push * inScale * outScale})`,
        }}
      >
        {children}
      </AbsoluteFill>
    </SceneCtx.Provider>
  );
};

// ---- primitives -----------------------------------------------------------
export const fadeUp = (f: number, delay: number, dist = 16) => ({
  opacity: clampI(f, delay, delay + 12, 0, 1),
  transform: `translateY(${clampI(f, delay, delay + 14, dist, 0)}px)`,
});

// `top` undefined = vertically centred; a number = pinned that far from the top.
// NOTE the width cap: in PORTRAIT this is only ~928px, which silently wraps
// large headlines. Check your widest line before rendering.
export const Center: React.FC<{ children: React.ReactNode; gap?: number; top?: number }> = ({ children, gap = 26, top }) => {
  const { LW } = useLayout();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: top === undefined ? "center" : "flex-start", paddingTop: top }}>
      <div style={{ width: Math.min(LW * 0.86, 1520), display: "flex", flexDirection: "column", alignItems: "center", gap, textAlign: "center" }}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

export const Kicker: React.FC<{ children: React.ReactNode; delay?: number; color?: string }> = ({ children, delay = 0, color = PALETTE.accent }) => {
  const f = useSceneFrame();
  return (
    <div style={{ ...fadeUp(f, delay), display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 26, height: 3, borderRadius: 2, background: color }} />
      <div style={{ fontFamily: MONO, fontSize: 17, letterSpacing: "0.34em", textTransform: "uppercase", color: PALETTE.dim, fontWeight: 600 }}>{children}</div>
    </div>
  );
};

export const Head: React.FC<{ children: React.ReactNode; size?: number; delay?: number; color?: string }> = ({ children, size = 78, delay = 4, color = PALETTE.ink }) => {
  const f = useSceneFrame();
  return (
    <div style={{ ...fadeUp(f, delay, 20), fontFamily: SANS, fontSize: size, fontWeight: 850, letterSpacing: "-0.02em", lineHeight: 1.04, color }}>
      {children}
    </div>
  );
};

export const Sub: React.FC<{ children: React.ReactNode; delay?: number; size?: number }> = ({ children, delay = 16, size = 32 }) => {
  const f = useSceneFrame();
  return (
    <div style={{ ...fadeUp(f, delay), fontFamily: SANS, fontSize: size, fontWeight: 500, lineHeight: 1.4, color: PALETTE.dim, maxWidth: 1080 }}>
      {children}
    </div>
  );
};

// ---- karaoke captions -----------------------------------------------------
// Data comes from scripts/build-captions.mjs (real ElevenLabs word timings).
// MOUNT THIS OUTSIDE <SceneFrame> (but inside the scaled div) or the per-scene
// blur/zoom-through will drag the pills around mid-word.
// Caption offsets MUST match the adelay values used in the audio mux.
export type CWord = { w: string; s: number; e: number };
export type CChunk = { t0: number; t1: number; words: CWord[] };

export const KaraokeCaptions: React.FC<{ data: CChunk[] }> = ({ data }) => {
  const sec = useCurrentFrame() / RENDER_FPS;   // absolute video seconds
  const { LW, LH, portrait } = useLayout();
  const chunk = data.find((c) => sec >= c.t0 && sec < c.t1);
  if (!chunk) return null;
  const size = portrait ? 58 : 50;
  const top = portrait ? LH * 0.72 : LH * 0.8;
  const appear = clampI(sec, chunk.t0, chunk.t0 + 0.12, 0, 1);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", padding: "0 50px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 13, justifyContent: "center", maxWidth: LW * 0.9, transform: `translateY(${(1 - appear) * 16}px)`, opacity: appear }}>
        {chunk.words.map((wd, i) => {
          const spoken = sec >= wd.s;
          const active = sec >= wd.s && sec < wd.e + 0.08;
          return (
            <div key={i} style={{
              padding: portrait ? "8px 20px" : "7px 18px", borderRadius: 15,
              background: spoken ? `linear-gradient(135deg, ${PALETTE.accent} 0%, ${PALETTE.accent} 55%, ${hexA(PALETTE.accent, 0.85)} 100%)` : "#ffffff",
              boxShadow: spoken ? `0 12px 28px -10px ${hexA(PALETTE.accent, 0.6)}` : "0 8px 22px -12px rgba(20,16,12,0.4)",
              transform: `scale(${active ? 1.07 : 1})`,
            }}>
              <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: size, letterSpacing: "-0.01em", color: spoken ? "#ffffff" : PALETTE.ink, whiteSpace: "nowrap" }}>{wd.w}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===========================================================================
// Root wiring — copy this shape into your composition file.
// ===========================================================================

// Scene boundaries in LOGICAL 30fps frames. Beat-map these to the music for
// music-led cuts, or derive them from actual VO line durations for talk-led
// cuts. BOUNDS_L must have SCENES.length + 1 entries.
export const BOUNDS_L = [0, 270, 780, 1380, 2010];      // ← replace
export const BOUNDS = BOUNDS_L.map((x) => x * SCALE);
export const TOTAL_FRAMES = BOUNDS_L[BOUNDS_L.length - 1] * SCALE;

export const makeComp = (
  SCENES: React.FC[],
  Stage: React.FC,
  captions?: CChunk[],
): React.FC => () => {
  const { width, height } = useVideoConfig();
  const S = 2;                       // logical → output multiplier
  const LW = width / S;
  const LH = height / S;
  return (
    <LayoutCtx.Provider value={{ LW, LH, portrait: height > width }}>
      <AbsoluteFill style={{ background: PALETTE.stage }}>
        {/* Author at logical size, scale the whole tree once. Rendering at
            1920×1080 and scaling ×2 is far cheaper than laying out at 4K. */}
        <div style={{ position: "absolute", top: 0, left: 0, width: LW, height: LH, transform: `scale(${S})`, transformOrigin: "0 0" }}>
          <Stage />
          {SCENES.map((Scene, i) => (
            // premountFor lets a scene's assets warm up before it is visible,
            // preventing a blank first frame after a cut.
            <Sequence key={i} from={BOUNDS[i]} durationInFrames={BOUNDS[i + 1] - BOUNDS[i]} premountFor={20}>
              <SceneFrame seed={i} durL={BOUNDS_L[i + 1] - BOUNDS_L[i]}>
                <Scene />
              </SceneFrame>
            </Sequence>
          ))}
          {captions && <KaraokeCaptions data={captions} />}
        </div>
      </AbsoluteFill>
    </LayoutCtx.Provider>
  );
};

// Register BOTH orientations. 9:16 is a different LAYOUT, not a reframe — see
// the vertical rules in SKILL.md (type needs ~1.5–2× its landscape size).
export const Example: React.FC = () => {
  const Comp = makeComp([], () => null);
  return (
    <>
      <Composition id="Example" component={Comp} durationInFrames={TOTAL_FRAMES} fps={RENDER_FPS} width={3840} height={2160} />
      <Composition id="ExampleVertical" component={Comp} durationInFrames={TOTAL_FRAMES} fps={RENDER_FPS} width={2160} height={3840} />
    </>
  );
};
