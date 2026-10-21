// Tapformat launch film v5 — "Crazy motion" (16:9, 33 s, 60 fps, music only, loud master).
// Never-cut infinite-zoom camera, extruded CSS-3D keycaps, gooey liquid orbs, 3D kinetic type, beat-locked flashes/shakes/
// colour swaps. Music: song C re-cut — build from 4 s, DROP at 12 s, full energy 12–32 s (beat 0.5 s, phase 0.08).
import { AbsoluteFill, Audio, Composition, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import React from "react";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { BG, Goo, Key3D } from "./Crazy";

const { fontFamily: GEIST } = loadGeist("normal", { weights: ["500", "700", "800", "900"], subsets: ["latin"] });
const { fontFamily: MONO } = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] });
const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
const FPS = 60, DUR = 33.0, WD = 1920, HT = 1080;
const C = { heic: "#9e61ff", jpg: "#ff8f2e", png: "#3885ff", pdf: "#f5454d", gif: "#ff549e", shrink: "#2fc79c", mov: "#29c770", mp3: "#fab81f", docx: "#2b6cf6" };
const COLS = [C.jpg, C.heic, C.png, C.mov, C.gif, C.pdf];
const EZ = Easing.bezier(0.16, 1, 0.3, 1), IO = Easing.bezier(0.7, 0, 0.3, 1);
const ci = (t: number, a: number, b: number, x = 0, y = 1, e = EZ) => interpolate(t, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const sp = (t: number, a: number, d = 12, s = 200) => (t < a ? 0 : spring({ frame: (t - a) * FPS, fps: FPS, config: { damping: d, stiffness: s } }));
const rnd = (i: number) => { const v = Math.sin(i * 12.9898) * 43758.5453; return v - Math.floor(v); };
const BEAT = 0.5, PH = 0.08;
const beatE = (t: number) => { const n = Math.floor((t - PH) / BEAT); return { n, e: t - PH - n * BEAT }; };
const pulse = (t: number, from = 4, to = 32) => { if (t < from || t > to) return 0; const { n, e } = beatE(t); const amp = t < 12 ? (n % 4 === 0 ? 0.6 : 0.25) : (n % 2 === 0 ? 1 : 0.55); return amp * Math.exp(-e * 12); };
const hitAt = (t: number, a: number, len = 0.3) => (t >= a && t < a + len ? 1 - (t - a) / len : 0);

// ---------- shared pieces ----------
const FileCard: React.FC<{ ext: string; col: string; w?: number }> = ({ ext, col, w = 320 }) => (
  <div style={{ width: w, height: w * 1.25, borderRadius: w * 0.12, background: "linear-gradient(160deg,#ffffff,#e8e6f0)", boxShadow: `0 ${w * 0.12}px ${w * 0.38}px ${col}99`, position: "relative" }}>
    <div style={{ position: "absolute", left: w * 0.1, right: w * 0.1, top: w * 0.12, height: w * 0.6, borderRadius: w * 0.08, background: `linear-gradient(160deg, ${col}, ${col}aa)` }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: w * 0.12, textAlign: "center", fontFamily: GEIST, fontWeight: 900, fontSize: w * 0.26, color: col, letterSpacing: -w * 0.01 }}>{ext}</div>
  </div>
);
const Splash: React.FC<{ t: number; a: number; col: string; x?: number; y?: number; n?: number; dist?: number }> = ({ t, a, col, x = 960, y = 540, n = 14, dist = 420 }) => {
  const e = (t - a) / 0.55; if (e < 0 || e > 1) return null;
  return <>{Array.from({ length: n }).map((_, i) => { const ang = (i / n) * Math.PI * 2 + a, d = 120 + e * dist * (0.6 + rnd(i + a) * 0.6), s = 70 * (1 - e) * (0.5 + rnd(i) * 0.8); return <div key={i} style={{ position: "absolute", left: x + Math.cos(ang) * d - s / 2, top: y + Math.sin(ang) * d - s / 2 + e * e * 120, width: s, height: s, borderRadius: "50%", background: col }} />; })}</>;
};
const Rings: React.FC<{ t: number; a: number; cols?: string[]; x?: number; y?: number; tilt?: number; s?: number }> = ({ t, a, cols = COLS.slice(0, 3), x = 960, y = 540, tilt = 0, s = 1 }) => (
  <>{cols.map((c, i) => { const e = t - a - i * 0.06; if (e < 0 || e > 0.9) return null; return <div key={i} style={{ position: "absolute", left: x - 400 * s, top: y - 400 * s, width: 800 * s, height: 800 * s, borderRadius: "50%", border: `${12 - i * 3}px solid ${c}`, transform: `rotateX(${tilt}deg) scale(${0.25 + e * 2.6})`, opacity: 1 - e / 0.9 }} />; })}</>
);
const Streaks: React.FC<{ t: number; on: number; col?: string }> = ({ t, on, col = "#fff" }) => on <= 0 ? null : (
  <AbsoluteFill style={{ pointerEvents: "none" }}>{Array.from({ length: 34 }).map((_, i) => { const ang = rnd(i) * Math.PI * 2, r0 = 200 + ((t * 2600 + rnd(i + 3) * 1600) % 1600); return <div key={i} style={{ position: "absolute", left: 960 + Math.cos(ang) * r0, top: 540 + Math.sin(ang) * r0, width: 160 * on, height: 4, background: i % 4 ? col : COLS[i % 6], opacity: 0.7 * on, transform: `rotate(${(ang * 180) / Math.PI}deg)`, transformOrigin: "0 50%" }} />; })}</AbsoluteFill>
);
const Big3D: React.FC<{ t: number; a: number; text: string; size?: number; col?: string; serif?: boolean; step?: number; y?: number; from?: number }> = ({ t, a, text, size = 220, col = "#fff", serif, step = 0.045, y = 540, from = 1 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y - size * 0.55, display: "flex", justifyContent: "center", transformStyle: "preserve-3d" }}>
    {[...text].map((ch, i) => { const k = sp(t, a + i * step, 10, 240); return <span key={i} style={{ display: "inline-block", whiteSpace: "pre", fontFamily: serif ? SERIF : GEIST, fontStyle: serif ? "italic" : undefined, fontWeight: 900, fontSize: size, color: col, letterSpacing: -size * 0.03, transform: `translateZ(${(1 - k) * 1200 * from}px) rotateX(${(1 - k) * 90}deg) rotateY(${(1 - k) * (i % 2 ? 50 : -50)}deg)`, opacity: Math.min(1, k * 2.5), textShadow: `0 0 ${size * 0.25}px ${col === "#fff" ? "rgba(255,255,255,0.35)" : col + "88"}` }}>{ch}</span>; })}
  </div>
);

// ---------- scenes ----------
// 0–4: converter chaos flying at the camera, shattered by ⌘
const Chaos: React.FC<{ t: number }> = ({ t }) => {
  const POP: [string, string, number, number, number][] = [["WIN A FREE PHONE!!", "#ffd000", -520, -230, 0.1], ["Uploading… 34%", "#3b82ff", 420, -260, 0.45], ["⚠ position in queue: 2,481", "#e5484d", -460, 210, 0.8], ["🔒 Sign up to download", "#9e61ff", 470, 230, 1.15], ["⏳ Please wait… (ad)", "#ff8f2e", -40, -20, 1.5], ["Max 1 file / day", "#ff549e", 60, 330, 1.85], ["🎉 Congratulations!", "#29c770", -80, -330, 2.2]];
  const crush = ci(t, 3.25, 3.55, 0, 1, Easing.in(Easing.cubic));
  return (
    <AbsoluteFill style={{ transformStyle: "preserve-3d" }}>
      {POP.map(([txt, col, x, y, a], i) => { const k = sp(t, a, 11, 200), wob = Math.sin(t * 9 + i) * 3, explode = ci(t, 3.5, 3.9, 0, 1, Easing.out(Easing.cubic));
        return <div key={i} style={{ position: "absolute", left: 960 + x - 260 + explode * x * 2.2, top: 540 + y - 60 + explode * y * 2.2, width: 520, padding: "26px 30px", borderRadius: 22, background: "#fff", boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 0 4px ${col}`, fontFamily: GEIST, fontWeight: 800, fontSize: 38, color: "#111", transform: `translateZ(${(1 - k) * 1600 - explode * 600}px) rotateZ(${wob + (1 - k) * 30 + explode * (i % 2 ? 80 : -80)}deg) rotateY(${(1 - k) * 60}deg)`, opacity: Math.min(1, k * 2) * (1 - explode) }}>{txt}</div>; })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: GEIST, fontWeight: 900, fontSize: 92, color: "#fff", letterSpacing: -3, transform: `translateX(${t > 1 && t < 1.12 ? 18 : t > 2 && t < 2.1 ? -16 : 0}px)`, textShadow: "3px 0 0 #ff2d55, -3px 0 0 #00e5ff", opacity: ci(t, 0.2, 0.5) * (1 - ci(t, 3.4, 3.6)) }}>Still converting files like this?</div>
      <div style={{ position: "absolute", left: 960 - 190, top: 540 - 190 + (1 - crush) * -1200, transformStyle: "preserve-3d" }}><Key3D glyph="⌘" size={380} rx={40} ry={-12 + (1 - crush) * 200} rz={-8} press={hitAt(t, 3.55, 0.3)} glow="#ffffff" /></div>
      <Rings t={t} a={3.55} cols={["#ffffff", C.pdf, C.jpg]} tilt={65} s={1.2} />
    </AbsoluteFill>
  );
};
// 4–8.1: keycaps, Tap ⇧⌘., gooey ring, dive
const Keys: React.FC<{ t: number }> = ({ t }) => {
  const k1 = sp(t, 4.05, 11, 150), k2 = sp(t, 4.35, 11, 150);
  const slam = hitAt(t, 5.08, 0.28) + hitAt(t, 6.08, 0.25);
  const ringIn = ci(t, 6.0, 6.8, 0, 1, Easing.out(Easing.back(1.4)));
  const spin = t * 140 + ci(t, 6.8, 7.8, 0, 300, IO);
  return (
    <AbsoluteFill style={{ transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", left: 960 - 560 - ci(t, 6.0, 6.6) * 80, top: 600 - 170, transformStyle: "preserve-3d", transform: `translateY(${(1 - k1) * -1100}px)` }}><Key3D glyph="⇧" size={340} rx={40 - k1 * 8 + Math.sin(t * 2) * 5} ry={-25 + (1 - k1) * 200 + Math.sin(t * 1.6) * 8} rz={-7} press={slam} glow={C.jpg} /></div>
      <div style={{ position: "absolute", left: 960 + 220 + ci(t, 6.0, 6.6) * 80, top: 600 - 170, transformStyle: "preserve-3d", transform: `translateY(${(1 - k2) * -1100}px)` }}><Key3D glyph="⌘" size={340} rx={40 - k2 * 8 + Math.cos(t * 2) * 5} ry={25 - (1 - k2) * 200 + Math.cos(t * 1.6) * 8} rz={7} press={slam} glow={C.heic} /></div>
      <Rings t={t} a={5.08} tilt={65} y={700} />
      <Rings t={t} a={6.08} cols={[C.heic, C.png, C.gif]} tilt={65} y={700} />
      <Big3D t={t} a={4.9} text="Tap ⇧⌘." size={180} y={190} />
      {t > 5.9 && (
        <div style={{ position: "absolute", left: 960 - 470, top: 600 - 470, width: 940, height: 940, transform: `rotateX(${55 - ringIn * 40}deg) rotateZ(${spin}deg) scale(${ringIn})`, transformStyle: "preserve-3d" }}>
          <Goo id="gooK">
            {COLS.map((c, i) => { const ang = (i / 6) * Math.PI * 2, r = 340 + Math.sin(t * 7 + i) * 34 - ci(t, 7.2, 7.8, 0, 240, IO); return <div key={i} style={{ position: "absolute", left: 470 + Math.cos(ang) * r - 90, top: 470 + Math.sin(ang) * r - 90, width: 180, height: 180, borderRadius: "50%", background: c }} />; })}
            {Array.from({ length: 12 }).map((_, i) => { const ang = (i / 12) * Math.PI * 2 + t * 2, r = 230 + Math.sin(t * 5 + i) * 40; return <div key={"s" + i} style={{ position: "absolute", left: 470 + Math.cos(ang) * r - 30, top: 470 + Math.sin(ang) * r - 30, width: 60, height: 60, borderRadius: "50%", background: COLS[i % 6] }} />; })}
            <div style={{ position: "absolute", left: 470 - 120, top: 470 - 120, width: 240, height: 240, borderRadius: "50%", background: "#fff", transform: `scale(${ci(t, 7.2, 7.9, 0.15, 1.3)})` }} />
          </Goo>
        </div>
      )}
    </AbsoluteFill>
  );
};
// 8.1–12: inside the ring — Finder in 3D, ring picks JPG, HEIC→JPG with splash (the demo beat)
const Demo: React.FC<{ t: number }> = ({ t }) => {
  const win = sp(t, 8.1, 13, 120);
  const ring = sp(t, 9.0, 11, 260) * (1 - ci(t, 10.05, 10.25));
  const pick = t > 9.6;
  const done = t > 10.1;
  return (
    <AbsoluteFill style={{ transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", left: 960 - 640, top: 540 - 330, width: 1280, height: 660, borderRadius: 28, background: "rgba(255,255,255,0.97)", boxShadow: "0 60px 160px rgba(0,0,0,0.6)", overflow: "hidden", transform: `translateZ(${(1 - win) * -2200}px) rotateX(${(1 - win) * 60 + 10}deg) rotateY(${-12 + Math.sin(t * 1.8) * 5}deg) rotateZ(${(1 - win) * -15}deg)` }}>
        <div style={{ height: 60, background: "#f1f1f4", display: "flex", alignItems: "center", gap: 10, padding: "0 22px" }}>{["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}<div style={{ marginLeft: 16, fontFamily: GEIST, fontWeight: 700, fontSize: 22, color: "#555" }}>Downloads</div></div>
        {[["Sunset.heic", C.heic, "2.4 MB", true], ...(done ? [["Sunset.jpg", C.jpg, "1.1 MB", false]] : []), ["Report.pdf", C.pdf, "880 KB", false], ["Interview.mov", C.mov, "248 MB", false], ["Logo.png", C.png, "1.2 MB", false]].map(([n, c, sz, sel], i) => {
          const isNew = n === "Sunset.jpg", kn = isNew ? sp(t, 10.1, 9, 300) : 1;
          return <div key={n as string} style={{ display: "flex", alignItems: "center", gap: 18, height: 88 * kn, overflow: "hidden", padding: "0 30px", fontFamily: GEIST, fontWeight: 700, fontSize: 30, color: sel && !done ? "#fff" : "#111", background: sel && t > 8.6 && !done ? "#3b82ff" : isNew ? "rgba(47,199,156,0.18)" : "transparent" }}><div style={{ width: 46, height: 58, borderRadius: 8, background: c as string }} />{n as string}<span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 22, opacity: 0.7 }}>{sz as string}</span></div>;
        })}
      </div>
      {/* the ring pops over the selected file */}
      {ring > 0.01 && (
        <div style={{ position: "absolute", left: 760 - 210, top: 330 - 210, width: 420, height: 420, transform: `scale(${ring}) rotate(${(1 - ring) * -90}deg)` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(20,20,26,0.94)", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }} />
          {[["JPG", C.jpg], ["PNG", C.png], ["PDF", C.pdf], ["Shrink", C.shrink]].map(([l, c], i) => { const ang = -Math.PI / 2 + (i / 4) * Math.PI * 2, on = pick && i === 0; return <div key={l} style={{ position: "absolute", left: 210 + Math.cos(ang) * 138 - 50, top: 210 + Math.sin(ang) * 138 - 50, width: 100, height: 100, borderRadius: "50%", background: on ? c : `${c}30`, border: `3px solid ${c}`, color: on ? "#fff" : c, fontFamily: GEIST, fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(t, 9.05 + i * 0.05, 9, 300) * (on ? 1.2 : 1)})`, boxShadow: on ? `0 0 40px ${c}` : undefined }}>{l}</div>; })}
          <div style={{ position: "absolute", left: 160, top: 160, width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(180deg,#ffb36b,#ff6f61 60%,#3b2b5a)" }} />
        </div>
      )}
      <Splash t={t} a={10.05} col={C.jpg} x={760} y={190} n={16} dist={320} />
      <Rings t={t} a={10.05} cols={[C.jpg, "#fff"]} x={760} y={190} s={0.6} />
      {t > 10.2 && <div style={{ position: "absolute", right: 70, top: 70, display: "flex", alignItems: "center", gap: 14, padding: "16px 24px", borderRadius: 20, background: "rgba(255,255,255,0.9)", boxShadow: "0 20px 50px rgba(0,0,0,0.4)", fontFamily: GEIST, fontWeight: 700, fontSize: 24, color: "#111", transform: `translateX(${(1 - sp(t, 10.2, 12, 260)) * 500}px)` }}><Img src={staticFile("tapformat/icon.png")} style={{ width: 44, height: 44 }} />Sunset.jpg · saved next to the original</div>}
      {/* the 3 steps as kinetic words */}
      {[["Select.", 8.3, 160], ["⇧⌘.", 9.0, 540], ["Done.", 10.1, 920]].map(([w, a, y]) => { const k = sp(t, a as number, 10, 260); return <div key={w as string} style={{ position: "absolute", left: 90, top: (y as number) - 80, fontFamily: w === "⇧⌘." ? GEIST : SERIF, fontStyle: w === "Done." ? "italic" : undefined, fontWeight: 900, fontSize: 130, color: w === "⇧⌘." ? C.jpg : "#fff", transform: `translateX(${(1 - k) * -600}px) rotateY(${(1 - k) * 70}deg)`, opacity: Math.min(1, k * 2) * (1 - ci(t, 11.6, 11.9)), textShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>{w as string}</div>; })}
    </AbsoluteFill>
  );
};
// 12–16.1: THE DROP — "Convert anything." + morph storm (file changes every beat)
const MORPHS: [string, string][] = [["HEIC", C.heic], ["JPG", C.jpg], ["PNG", C.png], ["PDF", C.pdf], ["DOCX", C.docx], ["MOV", C.mov], ["GIF", C.gif], ["MP3", C.mp3]];
const Storm: React.FC<{ t: number }> = ({ t }) => {
  const i = Math.min(MORPHS.length - 1, Math.max(0, Math.floor((t - 12.08) / 0.5)));
  const ph = ((t - 12.08) / 0.5) % 1;
  const [ext, col] = MORPHS[i];
  return (
    <AbsoluteFill style={{ transformStyle: "preserve-3d" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${col}66 0%, transparent 55%)` }} />
      {/* satellite cards orbiting in 3D */}
      {MORPHS.slice(0, i).map(([e2, c2], j) => { const ang = (j / 8) * Math.PI * 2 + t * 1.6; return <div key={e2} style={{ position: "absolute", left: 960 + Math.cos(ang) * 640 - 70, top: 540 + Math.sin(ang) * 300 - 88, transform: `translateZ(${Math.sin(ang) * 400}px) rotateY(${t * 140 + j * 40}deg) scale(0.45)`, transformOrigin: "50% 50%" }}><FileCard ext={e2} col={c2} w={300} /></div>; })}
      <div style={{ position: "absolute", left: 960 - 170, top: 540 - 212, transformStyle: "preserve-3d", transform: `rotateY(${IO(Math.min(1, ph * 2.4)) * 360}deg) rotateX(${Math.sin(t * 4) * 12}deg) scale(${1 + Math.max(0, 1 - ph * 5) * 0.25})` }}><FileCard ext={ext} col={col} w={340} /></div>
      <Goo id="gooS" strength={14}><Splash t={t} a={12.08 + i * 0.5} col={col} n={18} dist={520} /></Goo>
      <Big3D t={t} a={12.05} text="Convert" size={190} y={150} step={0.035} />
      <Big3D t={t} a={12.45} text="anything." size={190} y={930} serif step={0.035} col={col} />
    </AbsoluteFill>
  );
};
// 16.1–20: SHRINK — liquid press + 3D flip-counter
const ShrinkS: React.FC<{ t: number }> = ({ t }) => {
  const sq = ci(t, 16.9, 17.2, 0, 1, Easing.in(Easing.cubic)) * (1 - ci(t, 17.6, 18.4));
  const mb = Math.round(interpolate(ci(t, 17.1, 18.6, 0, 1, Easing.out(Easing.cubic)), [0, 1], [248, 62]));
  return (
    <AbsoluteFill style={{ transformStyle: "preserve-3d" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, ${C.shrink}55 0%, transparent 55%)` }} />
      <Big3D t={t} a={16.15} text="Shrink anything." size={150} y={130} col="#fff" step={0.03} />
      {/* liquid squeeze blob */}
      <div style={{ position: "absolute", left: 960 - 340, top: 600 - 220 }}>
        <div style={{ position: "relative", width: 680, height: 440 }}>
          <Goo id="gooP" strength={20}>
            <div style={{ position: "absolute", left: 340 - 170 * (1 + sq * 0.6), top: 220 - 170 * (1 - sq * 0.5), width: 340 * (1 + sq * 0.6), height: 340 * (1 - sq * 0.5), borderRadius: "50%", background: C.mov, transform: `rotate(${t * 40}deg)` }} />
            {Array.from({ length: 8 }).map((_, i) => { const e = ci(t, 17.15 + i * 0.03, 17.9 + i * 0.03); const ang = (i / 8) * Math.PI * 2; return <div key={i} style={{ position: "absolute", left: 340 + Math.cos(ang) * (60 + e * 330) - 34 * (1 - e), top: 220 + Math.sin(ang) * (40 + e * 200) - 34 * (1 - e), width: 68 * (1 - e), height: 68 * (1 - e), borderRadius: "50%", background: C.shrink }} />; })}
          </Goo>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - sq * 0.3 + (t > 18.4 ? 0 : 0)}) scale(${interpolate(ci(t, 17.6, 18.6), [0, 1], [1, 0.72])})` }}><FileCard ext="MOV" col={C.mov} w={200} /></div>
        </div>
      </div>
      {/* chrome plates */}
      {[-1, 1].map((d) => <div key={d} style={{ position: "absolute", left: 960 - 420, top: 600 + d * (300 - sq * 150) - 30, width: 840, height: 60, borderRadius: 16, background: "linear-gradient(180deg,#f4f4f8,#9a9aa6 60%,#5e5e68)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }} />)}
      <div style={{ position: "absolute", right: 90, top: 760, textAlign: "right", fontFamily: GEIST, fontWeight: 900, fontSize: 180, color: t > 18.6 ? C.shrink : "#fff", letterSpacing: -8, transform: `perspective(800px) rotateX(${Math.sin(Math.min(1, (t * 6) % 1) * Math.PI) * (t > 17.1 && t < 18.6 ? 25 : 0)}deg) scale(${1 + hitAt(t, 18.6, 0.3) * 0.25})` }}>{mb}<span style={{ fontSize: 90 }}> MB</span></div>
      {t > 18.6 && <div style={{ position: "absolute", left: 100, top: 860, fontFamily: MONO, fontSize: 34, color: "#cfcfd8", opacity: ci(t, 18.6, 18.9) }}>Interview (smaller).mov · same format</div>}
    </AbsoluteFill>
  );
};
// 20–24.1: TOOLS — 3D card barrage, one per beat-pair
const TOOLS: [string, string, number][] = [["Crop", C.jpg, 20.08], ["Rotate", C.heic, 21.08], ["Merge PDFs", C.pdf, 22.08], ["Batch", C.png, 23.08]];
const ToolsS: React.FC<{ t: number }> = ({ t }) => {
  const idx = Math.max(0, TOOLS.filter((x) => t >= x[2]).length - 1);
  const [name, col, a] = TOOLS[idx];
  const k = sp(t, a, 11, 220), e = ci(t, a + 0.15, a + 0.75, 0, 1, IO);
  const dir = [[-1, 0], [1, 0], [0, -1], [0, 1]][idx];
  return (
    <AbsoluteFill style={{ transformStyle: "preserve-3d" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${col}55 0%, transparent 55%)` }} />
      <div key={name} style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 190, color: col, transform: `translateZ(${(1 - k) * 900}px) rotateX(${(1 - k) * 80}deg)`, textShadow: `0 0 50px ${col}88` }}>{name}</div>
      <div style={{ position: "absolute", left: 960 - 330, top: 620 - 200, width: 660, height: 400, transform: `translate(${dir[0] * (1 - k) * 1600}px, ${dir[1] * (1 - k) * 1100}px) rotateY(${(1 - k) * dir[0] * 80}deg) rotateX(${(1 - k) * dir[1] * 80}deg)`, transformStyle: "preserve-3d" }}>
        {idx === 0 && <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "linear-gradient(180deg,#ffb36b,#ff6f61 55%,#3b2b5a)", boxShadow: "0 40px 100px rgba(0,0,0,0.6)" }}><div style={{ position: "absolute", left: 130 * e, top: 80 * e, right: 150 * e, bottom: 90 * e, border: "5px solid #fff", boxShadow: "0 0 0 2000px rgba(7,7,11,0.6)", borderRadius: 4 }} /></div>}
        {idx === 1 && <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "linear-gradient(180deg,#c4b8ff,#7c6cf0 55%,#2a2050)", boxShadow: "0 40px 100px rgba(0,0,0,0.6)", transform: `rotate(${e * 90}deg) scale(${(1 - Math.sin(e * Math.PI) * 0.2) * interpolate(e, [0, 1], [1, 0.62])})` }} />}
        {idx === 2 && [0, 1].map((j) => <div key={j} style={{ position: "absolute", left: 230 + (j ? 1 : -1) * 220 * (1 - e), top: 20 + j * 20 * (1 - e), transform: `rotate(${(j ? 10 : -10) * (1 - e)}deg) rotateY(${(1 - e) * (j ? -40 : 40)}deg)` }}><FileCard ext="PDF" col={C.pdf} w={300} /></div>)}
        {idx === 3 && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>{[C.heic, C.png, C.pdf, C.mov, C.mp3].map((c2, j) => { const kk = ci(t, a + 0.2 + j * 0.07, a + 0.45 + j * 0.07); return <div key={j} style={{ transform: `rotateY(${kk * 360}deg) translateY(${Math.sin(t * 8 + j) * 10}px)` }}><FileCard ext={kk > 0.5 ? ["JPG", "JPG", "JPG", "GIF", "MP3"][j] : ["HEIC", "PNG", "PDF", "MOV", "WAV"][j]} col={kk > 0.5 ? [C.jpg, C.jpg, C.jpg, C.gif, C.mp3][j] : c2} w={130} /></div>; })}</div>}
      </div>
      <Splash t={t} a={a + 0.7} col={col} n={14} dist={560} y={560} />
    </AbsoluteFill>
  );
};
// 24.1–28.1: TRUST — words slam + shattered cloud
const Trust: React.FC<{ t: number }> = ({ t }) => {
  const WORDS: [string, number, string][] = [["Offline.", 24.08, C.png], ["Nothing uploaded.", 25.08, C.heic], ["Originals untouched.", 26.08, C.shrink]];
  const shatter = ci(t, 24.5, 25.3, 0, 1, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{ transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", left: 960 - 260, top: 120 }}>
        {Array.from({ length: 9 }).map((_, i) => { const cx = (i % 3) * 170, cy = Math.floor(i / 3) * 70; return <div key={i} style={{ position: "absolute", left: cx, top: cy, width: 170, height: 70, overflow: "hidden", transform: `translate(${(cx - 170) * shatter * 2}px, ${(cy - 70) * shatter * 3 + shatter * shatter * 300}px) rotate(${(rnd(i) - 0.5) * 200 * shatter}deg)`, opacity: 1 - shatter * 0.9 }}><div style={{ position: "absolute", left: -cx, top: -cy, width: 510, height: 210 }}><svg width={510} height={210} viewBox="0 0 340 140"><path d="M70 130 C 20 130, 20 70, 70 66 C 74 20, 150 6, 180 46 C 210 10, 300 26, 286 84 C 330 90, 320 130, 270 130 Z" fill="#fff" /><text x="170" y="105" textAnchor="middle" fontFamily="Geist" fontWeight="800" fontSize="28" fill="#555">cloud upload</text></svg></div></div>; })}
      </div>
      {WORDS.map(([w, a, c], i) => { const k = sp(t, a, 10, 260); return <div key={w} style={{ position: "absolute", left: 0, right: 0, top: 380 + i * 190, textAlign: "center", fontFamily: GEIST, fontWeight: 900, fontSize: 150, color: "#fff", letterSpacing: -6, transform: `translateZ(${(1 - k) * 1400}px) rotateX(${(1 - k) * -70}deg) scale(${1 + hitAt(t, a, 0.2) * 0.08})`, opacity: Math.min(1, k * 2), textShadow: `0 0 60px ${c}aa` }}><span style={{ color: c }}>✓</span> {w}</div>; })}
    </AbsoluteFill>
  );
};
// 28.1–33: END — orbs merge into the icon (gooey), name, CTA
const End: React.FC<{ t: number }> = ({ t }) => {
  const m = ci(t, 28.2, 29.3, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill style={{ transformStyle: "preserve-3d" }}>
      <div style={{ position: "absolute", left: 960 - 300, top: 330 - 300, width: 600, height: 600, transform: `rotate(${(1 - m) * 360}deg)` }}>
        <Goo id="gooE" strength={18}>
          {COLS.map((c, i) => { const ang = -Math.PI / 2 + (i / 6) * Math.PI * 2, r = interpolate(m, [0, 1], [700, 90]); return <div key={i} style={{ position: "absolute", left: 300 + Math.cos(ang + (1 - m) * 3) * r - 36, top: 300 + Math.sin(ang + (1 - m) * 3) * r - 36, width: 72, height: 72, borderRadius: "50%", background: c }} />; })}
        </Goo>
      </div>
      <div style={{ position: "absolute", left: 960 - 130, top: 330 - 130, width: 260, height: 260, opacity: ci(t, 29.2, 29.45), transform: `scale(${0.6 + sp(t, 29.2, 9, 220) * 0.4}) rotateY(${(1 - sp(t, 29.2, 12, 160)) * 180}deg)` }}><Img src={staticFile("tapformat/icon.png")} style={{ width: 260, height: 260 }} /></div>
      <Rings t={t} a={29.3} cols={COLS.slice(0, 4)} y={330} s={0.8} />
      <Big3D t={t} a={29.5} text="Tapformat" size={170} y={650} step={0.04} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 770, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 66, color: "#bdbdc8", opacity: ci(t, 30.1, 30.4) }}>Tap ⇧⌘. Convert anything.</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ padding: "18px 52px", borderRadius: 999, background: "#fff", color: "#08080a", fontFamily: GEIST, fontWeight: 800, fontSize: 40, transform: `scale(${sp(t, 30.6, 9, 300) * (1 + pulse(t) * 0.04)})`, boxShadow: "0 0 60px rgba(255,255,255,0.35)" }}>Download free for Mac</div>
        <div style={{ fontFamily: MONO, fontSize: 22, color: "#8b8b96", opacity: ci(t, 31.0, 31.3) }}>macOS 15+ · works offline · never uploaded</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- master: one continuous camera ----------
const SC: { a: number; b: number; C: React.FC<{ t: number }>; hue: string; enter: "dive" | "drop" | "spin" | "zoom" }[] = [
  { a: 0, b: 3.95, C: Chaos, hue: C.pdf, enter: "zoom" },
  { a: 3.9, b: 8.15, C: Keys, hue: C.jpg, enter: "dive" },
  { a: 8.05, b: 12.1, C: Demo, hue: C.png, enter: "dive" },
  { a: 12.0, b: 16.15, C: Storm, hue: C.heic, enter: "spin" },
  { a: 16.05, b: 20.1, C: ShrinkS, hue: C.shrink, enter: "drop" },
  { a: 20.0, b: 24.15, C: ToolsS, hue: C.gif, enter: "spin" },
  { a: 24.05, b: 28.15, C: Trust, hue: C.png, enter: "dive" },
  { a: 28.05, b: DUR, C: End, hue: C.heic, enter: "zoom" },
];
const Film: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const pu = pulse(t);
  const cur = SC.findIndex((s) => t >= s.a && t < s.b);
  const s = SC[Math.max(0, cur)];
  const shake = pu * (t > 12 ? 14 : 7) + hitAt(t, 3.55, 0.35) * 24 + hitAt(t, 12.0, 0.4) * 30;
  const roll = Math.sin(t * 1.1) * 2.5 + (t > 12 ? Math.sin(t * 3.3) * 1.5 : 0);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#07070b" }}>
      <BG t={t} hue={s.hue} />
      <AbsoluteFill style={{ perspective: 1500, transform: `scale(${1.02 + pu * 0.04}) rotate(${roll}deg) translate(${Math.sin(t * 61) * shake}px, ${Math.cos(t * 53) * shake}px)` }}>
        {SC.map((sc, i) => {
          if (t < sc.a || t >= sc.b) return null;
          const k = ci(t, sc.a, sc.a + 0.35, 0, 1, EZ), o = ci(t, sc.b - 0.12, sc.b, 0, 1, Easing.in(Easing.cubic));
          const enter = i === 0 ? "" : sc.enter === "dive" ? `translateZ(${(1 - k) * -2600}px)` : sc.enter === "drop" ? `translateY(${(1 - k) * -1200}px) rotateX(${(1 - k) * 40}deg)` : sc.enter === "spin" ? `rotateZ(${(1 - k) * -120}deg) scale(${0.3 + k * 0.7})` : `scale(${0.4 + k * 0.6})`;
          return <AbsoluteFill key={i} style={{ transformStyle: "preserve-3d", transform: `${enter} translateZ(${o * 1600}px)`, opacity: 1 - o * 0.8 }}><sc.C t={t} /></AbsoluteFill>;
        })}
      </AbsoluteFill>
      <Streaks t={t} on={Math.max(...SC.slice(1).map((sc) => Math.max(0, 1 - Math.abs(t - sc.a) / 0.25)))} />
      {/* flashes on section changes + the drop */}
      {SC.slice(1).map((sc) => { const f = Math.max(0, 1 - Math.abs(t - sc.a) / 0.1); return f > 0 ? <AbsoluteFill key={sc.a} style={{ background: sc.a === 12.0 ? "#fff" : sc.hue, opacity: f * (sc.a === 12.0 ? 0.95 : 0.55), mixBlendMode: sc.a === 12.0 ? "normal" : "screen" }} /> : null; })}
      {/* beat colour pulse on edges */}
      <AbsoluteFill style={{ boxShadow: `inset 0 0 ${120 + pu * 160}px ${s.hue}${Math.round(40 + pu * 80).toString(16).padStart(2, "0")}`, pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)", pointerEvents: "none" }} />
      <Audio src={staticFile("tapformat/music5.wav")} />
    </AbsoluteFill>
  );
};
export const TapCrazyComp: React.FC = () => <Composition id="TapformatCrazy" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={WD} height={HT} />;
