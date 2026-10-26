// "Stop guessing" — 9:16 linkutm reel on the founder's own recorded voice. Editorial paper style (studied reel technique,
// original design): warm paper + grain, ink + one red, halftone dot shadows + halftone wipes, red rubber stamps, headline
// captions word-by-word with red italic-serif keywords, hand-drawn underline/circle/strike marks and live number counters,
// mono HUD label + per-beat counter. linkutm shown counting CLICKS per link only. Logo untouched on a white plate.
import React from "react";
import { AbsoluteFill, Audio, Composition, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { DUR, W } from "./data";

const { fontFamily: GRO } = loadGrotesk("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });
const { fontFamily: SERIF } = loadSerif("italic", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: MONO } = loadMono("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });
const FPS = 30, WD = 1080, HT = 1920;
const PAPER = "#EEEBE5", INK = "#141414", RED = "#E2231A", GREY = "#BDB7AE", GREEN = "#1E9E57";
const EZ = Easing.bezier(0.22, 1, 0.36, 1);
const ci = (t: number, a: number, b: number, x = 0, y = 1, e = EZ) => interpolate(t, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const sp = (t: number, a: number, d = 12, s = 220) => (t < a ? 0 : spring({ frame: (t - a) * FPS, fps: FPS, config: { damping: d, stiffness: s } }));
const rnd = (i: number) => { const v = Math.sin(i * 12.9898) * 43758.5453; return v - Math.floor(v); };
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const T = (w: string, n = 0) => { let k = 0; for (const x of W) if (norm(x[2]) === w) { if (k === n) return x[0]; k++; } return -99; };

// section starts
const S2 = T("instagram") - 0.35, S3 = T("so") - 0.25, S4 = T("heres") - 0.3, S5 = T("thats") - 0.3, S6 = T("next") - 0.3, S7 = T("if") - 0.3;

const stampTimes: number[] = [0, 1, 2, 3, 4].map((i) => T("worked") + 0.1 + i * 0.09).concat([T("credit"), T("wrong"), T("off"), T("stop")]);
// ---------- design atoms ----------
const Grain: React.FC<{ t: number }> = ({ t }) => (
  <svg width={WD} height={HT} style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "multiply", opacity: 0.16 }}>
    <filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={Math.floor(t * 12) % 6} /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width={WD} height={HT} filter="url(#gr)" />
  </svg>
);
// object with a halftone dot drop shadow
const HT_BG = "radial-gradient(circle, rgba(20,20,20,0.75) 1.7px, transparent 2.3px)";
const Dotted: React.FC<{ x: number; y: number; w: number; h: number; r?: number; rot?: number; s?: number; o?: number; bg?: string; border?: string; children?: React.ReactNode; z?: number }> = ({ x, y, w, h, r = 26, rot = 0, s = 1, o = 1, bg = "#fff", border = `3px solid ${INK}`, children, z }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg) scale(${s})`, opacity: o, zIndex: z }}>
    <div style={{ position: "absolute", left: 16, top: 18, width: w, height: h, borderRadius: r, backgroundImage: HT_BG, backgroundSize: "7px 7px" }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: r, background: bg, border, overflow: "hidden", fontFamily: GRO, color: INK }}>{children}</div>
  </div>
);
const Stamp: React.FC<{ t: number; a: number; text: string; x: number; y: number; rot?: number; size?: number; color?: string }> = ({ t, a, text, x, y, rot = -10, size = 92, color = RED }) => {
  if (t < a) return null; const k = sp(t, a, 9, 380), d = t - a;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${interpolate(k, [0, 1], [2.6, 1])})`, opacity: Math.min(1, k * 3), zIndex: 30 }}>
      <div style={{ padding: "8px 26px", border: `8px solid ${color}`, borderRadius: 14, color, fontFamily: GRO, fontWeight: 700, fontSize: size, letterSpacing: 2, whiteSpace: "nowrap", textTransform: "uppercase", background: "rgba(238,235,229,0.35)", maskImage: "radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,0.75) 100%)" }}>{text}</div>
      {d < 0.6 && Array.from({ length: 7 }).map((_, i) => { const ang = rnd(i + a) * Math.PI * 2, dist = 60 + d * 520 * (0.6 + rnd(i + 3)); return <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: 14, height: 9, background: i % 2 ? INK : color, transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist + d * d * 600}px) rotate(${d * 900 * (rnd(i) - 0.5)}deg)`, opacity: 1 - d / 0.6 }} />; })}
    </div>
  );
};

const shakeAt = (t: number) => { let v = 0; for (const a of stampTimes) if (t > a && t < a + 0.25) v += Math.sin((t - a) * 90) * 9 * (1 - (t - a) / 0.25); return v; };
const HalftoneWipe: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const p = (t - a) / 0.8; if (p <= 0 || p >= 1) return null;
  const g = 54, cols = Math.ceil(WD / g) + 1, rows = Math.ceil(HT / g) + 1, cov = p < 0.5 ? p * 2 : (1 - p) * 2;
  const dots: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const d = Math.hypot((c * g - WD / 2) / WD, (r * g - HT / 2) / HT) / 0.72;
    const rad = Math.max(0, Math.min(1, (cov * 1.6 - d) / 0.35)) * g * 0.75;
    if (rad > 0.5) dots.push(<circle key={r * 99 + c} cx={c * g} cy={r * g} r={rad} fill={INK} />);
  }
  return <svg width={WD} height={HT} style={{ position: "absolute", inset: 0, zIndex: 50 }}>{dots}</svg>;
};
const Phone: React.FC<{ children: React.ReactNode; w?: number; h?: number }> = ({ children, w = 300, h = 560 }) => (
  <div style={{ width: w, height: h, borderRadius: 44, background: INK, padding: 10 }}><div style={{ width: "100%", height: "100%", borderRadius: 34, overflow: "hidden", background: "#fff", position: "relative" }}>{children}</div></div>
);
const LinkPill: React.FC<{ text: string; size?: number }> = ({ text, size = 34 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 26px", borderRadius: 999, background: "#fff", border: `3px solid ${INK}`, fontFamily: MONO, fontWeight: 700, fontSize: size, color: INK }}>
    <svg width={size} height={size} viewBox="0 0 24 24"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" /></svg>{text}
  </div>
);
const Tag: React.FC<{ text: string; t: number; a: number; blank?: boolean }> = ({ text, t, a, blank }) => {
  const k = sp(t, a, 8, 260), sw = Math.sin((t - a) * 9) * 18 * Math.exp(-(t - a) * 3);
  return <div style={{ position: "absolute", left: "100%", top: "50%", transformOrigin: "0 0", transform: `rotate(${(1 - k) * -70 + 18 + sw}deg)`, opacity: Math.min(1, k * 3) }}>
    <div style={{ position: "absolute", left: -6, top: 0, width: 70, height: 3, background: INK, transform: "rotate(30deg)", transformOrigin: "0 0" }} />
    <div style={{ position: "absolute", left: 56, top: 26, padding: "12px 22px 12px 36px", background: blank ? "#E4E0D8" : "#F7E7C8", border: `3px solid ${INK}`, clipPath: "polygon(20px 0,100% 0,100% 100%,20px 100%,0 50%)", fontFamily: MONO, fontWeight: 700, fontSize: 30, color: blank ? "#8A847A" : RED, whiteSpace: "nowrap" }}>{text}</div>
  </div>;
};

// ---------- headline captions ----------
type Mark = "serif" | "under" | "circle" | "strike" | "count";
const MARKS: Record<string, Mark> = { worked: "circle", credit: "under", guessed: "serif", wrong: "strike", label: "under", never: "serif", linkutm: "serif", clicks: "under", "1200": "count", "3": "count", "5": "count", off: "serif", stop: "serif", free: "under", tiny: "serif", exactly: "serif", everyone: "serif" };
type Chunk = { a: number; b: number; words: [number, number, string][] };
const CH: Chunk[] = (() => { const out: Chunk[] = []; let cur: Chunk | null = null; W.forEach(([a, b, w], i) => { const p = W[i - 1]; const brk = !cur || /[.?!]$/.test(p[2]) || (/,$/.test(p[2]) && cur.words.length >= 4) || cur.words.length >= 9 || a - p[1] > 0.7; if (brk) { cur = { a, b, words: [] }; out.push(cur); } cur!.words.push([a, b, w]); cur!.b = b; }); return out; })();
const countText = (w: string, t: number, a: number) => { const n = parseInt(w.replace(/[^0-9]/g, ""), 10); const k = ci(t, a - 0.05, a + (n > 100 ? 0.7 : 0.35), 0, 1, Easing.out(Easing.cubic)); return Math.max(n > 5 ? 0 : 1, Math.round(n * k)).toLocaleString("en-US") + w.replace(/[0-9,]/g, ""); };
const Word: React.FC<{ w: string; a: number; t: number }> = ({ w, a, t }) => {
  const on = t >= a - 0.05, m = MARKS[norm(w)], k = ci(t, a - 0.05, a + 0.35);
  const base: React.CSSProperties = { position: "relative", display: "inline-block", color: on ? INK : GREY, transform: `translateY(${on ? (1 - sp(t, a - 0.05, 14, 400)) * 14 : 0}px)` };
  if (!m || !on) return <span style={base}>{w}</span>;
  const red: React.CSSProperties = { ...base, color: RED };
  if (m === "count") return <span style={{ ...red, fontVariantNumeric: "tabular-nums", transform: `scale(${1 + 0.25 * Math.exp(-(t - a) * 6)})` }}>{countText(w, t, a)}</span>;
  if (m === "serif") return <span style={{ ...red, fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: "1.12em", lineHeight: 0.9 }}>{w}</span>;
  const svg = m === "under" ? <path d="M2 8 C 30 2, 70 12, 98 5" pathLength={1} /> : m === "strike" ? <path d="M0 6 L 100 4" pathLength={1} /> : <ellipse cx={50} cy={50} rx={52} ry={46} pathLength={1} transform="rotate(-4 50 50)" />;
  return <span style={{ ...red, fontFamily: m === "strike" ? GRO : SERIF, fontStyle: m === "strike" ? "normal" : "italic", fontWeight: m === "strike" ? 700 : 400, fontSize: m === "strike" ? "1em" : "1.12em", lineHeight: 0.9 }}>{w}
    <svg viewBox={m === "circle" ? "0 0 100 100" : "0 0 100 12"} preserveAspectRatio="none" style={{ position: "absolute", left: m === "circle" ? "-14%" : "-2%", width: m === "circle" ? "128%" : "104%", top: m === "under" ? "92%" : m === "strike" ? "44%" : "-18%", height: m === "circle" ? "136%" : 16, overflow: "visible" }}>
      {React.cloneElement(svg, { stroke: m === "strike" ? INK : RED, strokeWidth: m === "circle" ? 3 : 5, fill: "none", strokeLinecap: "round", strokeDasharray: 1, strokeDashoffset: 1 - k, vectorEffect: "non-scaling-stroke" } as React.SVGProps<SVGElement>)}
    </svg></span>;
};
const Headline: React.FC<{ t: number }> = ({ t }) => {
  const i = CH.findIndex((c, k) => (k === 0 || t >= c.a - 0.1) && t < (CH[k + 1]?.a ?? DUR + 1) - 0.1);
  if (i < 0) return null; const c = CH[i];
  return <div style={{ position: "absolute", left: 70, right: 70, top: 190, fontFamily: GRO, fontWeight: 700, fontSize: 76, lineHeight: 1.08, letterSpacing: -1.5 }}>
    {c.words.map(([a, , w], j) => <React.Fragment key={j}><Word w={w} a={a} t={t} />{j < c.words.length - 1 ? " " : ""}</React.Fragment>)}
  </div>;
};
const HUD_S: [number, string, (t: number) => string][] = [
  [0, "// 01 · the confession", (t) => `ADS RUNNING: ${t < T("5") ? 0 : Math.min(5, 1 + Math.floor((t - T("5")) * 10))}`],
  [S2, "// 02 · the problem", (t) => `CREDIT CLAIMED: ${[T("instagram"), T("google"), T("email")].filter((x) => t > x).length * 100}%`],
  [S3, "// 03 · the mistake", (t) => `GUESSES: ${t > T("guessed") ? 1 : 0}`],
  [S4, "// 04 · the secret", () => "LABELLED LINKS: 0%"],
  [S5, "// 05 · the fix", (t) => `LABELLED LINKS: ${t > T("post") ? 100 : 0}%`],
  [S6, "// 06 · the result", (t) => `CLICKS: ${Math.round(1200 * ci(t, T("1200") - 0.05, T("1200") + 0.7)).toLocaleString("en-US")}`],
  [S7, "// 07 · your move", (t) => `GUESSES: ${t > T("stop") ? 0 : 1}`],
];
const Hud: React.FC<{ t: number }> = ({ t }) => {
  let k = 0; HUD_S.forEach((h, i) => { if (t >= h[0]) k = i; }); const [, l, f] = HUD_S[k];
  return <div style={{ position: "absolute", left: 70, right: 70, top: 120, display: "flex", fontFamily: MONO, fontSize: 24, color: "#7A746B", letterSpacing: 1 }}>
    <span>{l}</span><span style={{ marginLeft: "auto", color: RED, fontWeight: 700 }}>{f(t)}</span>
  </div>;
};

// ---------- scenes (stage area y≈520..1560) ----------
const ADS: [string, string][] = [["Ad #1", "#F4A6A0"], ["Ad #2", "#9EC5F2"], ["Ad #3", "#F5D27A"], ["Ad #4", "#A8DDB5"], ["Ad #5", "#C9B3F0"]];
const AdCard: React.FC<{ n: string; c: string }> = ({ n, c }) => (
  <div style={{ padding: 16 }}>
    <div style={{ height: 150, borderRadius: 16, background: c, border: `3px solid ${INK}`, position: "relative" }}><div style={{ position: "absolute", left: 22, bottom: 18, width: 70, height: 70, borderRadius: 35, background: "rgba(255,255,255,0.7)", border: `3px solid ${INK}` }} /><div style={{ position: "absolute", right: 20, top: 24, width: 90, height: 14, borderRadius: 7, background: INK, opacity: 0.8 }} /></div>
    <div style={{ fontWeight: 700, fontSize: 30, marginTop: 14 }}>{n}</div>
    <div style={{ fontFamily: MONO, fontSize: 18, color: "#8A847A" }}>sponsored</div>
  </div>
);
const Scene1: React.FC<{ t: number }> = ({ t }) => {
  const a5 = T("5"), wk = T("worked");
  return <>{ADS.map(([n, c], i) => {
    const k = sp(t, i === 0 ? -0.3 : Math.min(0.15 + i * 0.12, a5 - 0.5 + i * 0.13), 11, 240), ang = (i - 2) * 9, x = 540 + (i - 2) * 150 * k, y = 1060 + Math.abs(i - 2) * 40 * k;
    return <Dotted key={i} x={x} y={y + (1 - k) * 700} w={290} h={300} rot={ang * k} o={Math.min(1, k * 2)} z={i}><AdCard n={n} c={c} /></Dotted>;
  })}
    {ADS.map((_, i) => { const a = wk + 0.1 + i * 0.09; return <Stamp key={i} t={t} a={a} text="?" x={540 + (i - 2) * 150} y={1020 + Math.abs(i - 2) * 40} rot={(i - 2) * 9 - 6} size={120} />; })}
  </>;
};
const CLAIM: [string, string, string][] = [["Insights", "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)", "instagram"], ["Ads report", "linear-gradient(135deg,#4285F4,#34A853)", "google"], ["Campaign stats", "linear-gradient(135deg,#FFB547,#FF7A45)", "email"]];
const Scene2: React.FC<{ t: number }> = ({ t }) => {
  const ev = T("everyone"), cr = T("credit");
  return <>{CLAIM.map(([title, g, w], i) => {
    const a = T(w) - 0.25, k = sp(t, a, 12, 220), x = 200 + i * 340, y = 1080, me = sp(t, T(w, 1), 8, 320);
    return <div key={i} style={{ position: "absolute", left: x - 150, top: y - 280 + (1 - k) * 800, transform: `rotate(${(i - 1) * 4}deg)` }}>
      <div style={{ position: "absolute", left: 16, top: 18, width: 300, height: 560, borderRadius: 44, backgroundImage: HT_BG, backgroundSize: "7px 7px" }} />
      <div style={{ position: "relative" }}><Phone>
        <div style={{ height: 120, background: g, color: "#fff", fontFamily: GRO, fontWeight: 700, fontSize: 28, display: "flex", alignItems: "flex-end", padding: 18 }}>{title}</div>
        <div style={{ padding: 20, fontFamily: GRO }}>
          <div style={{ fontSize: 20, color: "#8A847A" }}>Credit for your result</div>
          <div style={{ fontSize: 76, fontWeight: 700, color: INK }}>{Math.round(100 * ci(t, a + 0.2, a + 0.8))}%</div>
          {[0.9, 0.6, 0.75, 0.4].map((w2, j) => <div key={j} style={{ height: 16, width: `${w2 * 100}%`, borderRadius: 8, background: "#ECE8E1", marginTop: 16 }} />)}
        </div>
      </Phone></div>
      {me > 0.01 && <div style={{ position: "absolute", left: 150, top: -70, transform: `translateX(-50%) scale(${me})`, padding: "10px 24px", background: INK, color: "#fff", borderRadius: 18, fontFamily: GRO, fontWeight: 700, fontSize: 40 }}>ME!</div>}
    </div>;
  })}
    <Stamp t={t} a={cr} text="300% credit?" x={540} y={1120} rot={-8} size={60} />
    {t > ev && <div style={{ position: "absolute", left: 0, right: 0, top: 1460, textAlign: "center", fontFamily: MONO, fontSize: 26, color: "#7A746B", opacity: ci(t, ev, ev + 0.3) }}>3 tools · 1 result · 300% credit</div>}
  </>;
};
const Scene3: React.FC<{ t: number }> = ({ t }) => {
  const g = T("guessed"), mo = T("money"), wr = T("wrong");
  const dk = sp(t, g - 0.3, 9, 200), roll = ci(t, g - 0.3, g + 0.5) * 720;
  return <>
    <div style={{ position: "absolute", left: 300 - 110, top: 820 - (1 - dk) * 600, width: 220, height: 220, transform: `rotate(${roll}deg)` }}>
      <Dotted x={110} y={110} w={210} h={210} r={40}>{[[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x * 204 - 18, top: y * 204 - 18, width: 36, height: 36, borderRadius: 18, background: i === 2 ? RED : INK }} />)}</Dotted>
    </div>
    <Dotted x={760} y={1080} w={300} h={310} rot={5} s={sp(t, S3 + 0.1, 12, 200)}><AdCard n="Ad #3" c="#F5D27A" /></Dotted>
    {Array.from({ length: 10 }).map((_, i) => { const p = ci(t, mo - 0.2 + i * 0.06, mo + 0.35 + i * 0.06); return p > 0 && p < 1 ? <div key={i} style={{ position: "absolute", left: 300 + (760 - 300) * p, top: 900 + (1080 - 900) * p - Math.sin(p * Math.PI) * 260, width: 56, height: 56, borderRadius: 28, background: "radial-gradient(circle at 35% 35%,#FFF3A6,#F2C14E 60%,#A06A12)", border: `3px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GRO, fontWeight: 700, fontSize: 30, color: INK }}>$</div> : null; })}
    <Stamp t={t} a={wr} text="wrong one" x={760} y={1090} rot={-12} size={80} />
  </>;
};
const Scene4: React.FC<{ t: number }> = ({ t }) => {
  const tiny = T("tiny"), cl = T("click"), mp = T("most"), nv = T("never");
  const up = ci(t, mp - 0.2, mp + 0.4);
  return <>
    <div style={{ position: "absolute", left: 90, top: 860 - up * 120, transform: `scale(${sp(t, S4 + 0.5, 12, 200)})`, transformOrigin: "0 50%" }}>
      <div style={{ position: "relative", display: "inline-block" }}><LinkPill text="yourshop.com/sale" size={38} />{t > tiny - 0.1 && <Tag text="from: instagram" t={t} a={tiny - 0.1} />}</div>
    </div>
    {t > cl - 0.2 && <div style={{ position: "absolute", left: 640, top: 1060 - up * 120, opacity: ci(t, cl - 0.2, cl + 0.1) * (1 - up), fontFamily: MONO, fontWeight: 700, fontSize: 30, color: GREEN }}>→ 1 click from Instagram</div>}
    {[0, 1, 2].map((i) => { const k = sp(t, mp + 0.1 + i * 0.15, 12, 220); return <div key={i} style={{ position: "absolute", left: 90, top: 1000 + i * 140, opacity: Math.min(1, k * 2), transform: `translateX(${(1 - k) * -400}px)` }}>
      <div style={{ position: "relative", display: "inline-block" }}><LinkPill text={["yourshop.com/promo", "yourshop.com/new", "yourshop.com/deal"][i]} size={30} />{t > nv && <Tag text="?" t={t} a={nv + i * 0.12} blank />}</div>
    </div>; })}
  </>;
};
const ROWS: [string, string, number, string][] = [["Instagram", "go.yourshop.com/ig", 1200, "instagram"], ["Emails", "go.yourshop.com/mail", 340, "emails"], ["Flyer QR", "go.yourshop.com/flyer", 85, "qr"]];
const Scene5: React.FC<{ t: number }> = ({ t }) => {
  const lu = T("linkutm"), cnt = T("counts");
  return <>
    <div style={{ position: "absolute", left: 540, top: 600, transform: `translate(-50%,-50%) scale(${interpolate(sp(t, lu - 0.15, 10, 260), [0, 1], [0.5, 1])})`, opacity: ci(t, lu - 0.15, lu + 0.1) }}>
      <div style={{ position: "absolute", left: 14, top: 16, right: -14, bottom: -16, borderRadius: 26, backgroundImage: HT_BG, backgroundSize: "7px 7px" }} />
      <div style={{ position: "relative", background: "#fff", borderRadius: 26, padding: "24px 40px", border: `3px solid ${INK}` }}><Img src={staticFile("lmv/logo.svg")} style={{ width: 420, display: "block" }} /></div>
    </div>
    {ROWS.map(([n, l, v, w], i) => {
      const a = T(w, w === "instagram" ? 2 : 0) - 0.2, k = sp(t, Math.min(a, T("post") + i * 0.15), 12, 220), hl = t > a ? 1 : 0;
      const val = Math.round(v * ci(t, cnt - 0.2 + i * 0.1, cnt + 1.2, 0, 1, Easing.out(Easing.cubic)));
      return <Dotted key={i} x={540} y={830 + i * 190} w={920} h={150} r={24} o={Math.min(1, k * 2)} s={0.9 + 0.1 * k + hl * 0.02 * Math.exp(-(t - a) * 4)} border={`3px solid ${hl ? RED : INK}`}>
        <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 30px", gap: 20 }}>
          <div><div style={{ fontWeight: 700, fontSize: 40 }}>{n}</div><div style={{ fontFamily: MONO, fontSize: 22, color: "#8A847A" }}>{l}</div></div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}><div style={{ fontWeight: 700, fontSize: 54, color: t > cnt - 0.2 ? INK : GREY, fontVariantNumeric: "tabular-nums" }}>{val.toLocaleString("en-US")}</div><div style={{ fontFamily: MONO, fontSize: 20, color: "#8A847A" }}>clicks</div></div>
        </div>
      </Dotted>;
    })}
    {t > T("flyer") - 0.3 && <Dotted x={850} y={1440} w={230} h={250} r={12} rot={6} s={sp(t, T("flyer") - 0.3, 9, 260)} bg="#FFF8EA">
      <div style={{ textAlign: "center", padding: 14 }}><div style={{ fontWeight: 700, fontSize: 30, color: RED, lineHeight: 1 }}>BIG SALE</div>
        <svg width={130} height={130} viewBox="0 0 13 13" style={{ marginTop: 10 }}>{Array.from({ length: 169 }).map((_, j) => { const x = j % 13, y = Math.floor(j / 13), corner = (x < 4 && y < 4) || (x > 8 && y < 4) || (x < 4 && y > 8); const on = corner ? (x % 12 === 0 || y % 12 === 0 || x === 3 || y === 3 || x === 9 || y === 9 || (x % 12 > 0 && x % 12 < 3 && y % 12 > 0 && y % 12 < 3) || (x > 9 && x < 12 && y > 0 && y < 3) || (x > 0 && x < 3 && y > 9 && y < 12)) : rnd(j) > 0.5; return on ? <rect key={j} x={x} y={y} width={1.02} height={1.02} fill={INK} /> : null; })}</svg></div>
    </Dotted>}
  </>;
};
const Scene6: React.FC<{ t: number }> = ({ t }) => {
  const a1 = T("1200"), a3 = T("3"), off = T("off"), oc = T("course");
  const k1 = sp(t, a1 - 0.3, 11, 220), k3 = sp(t, a3 - 0.15, 10, 260), sw = ci(t, off - 0.25, off + 0.05), gone = ci(t, oc - 0.1, oc + 0.4, 0, 1, Easing.in(Easing.cubic));
  const zoom = 1 + 0.12 * Math.exp(-Math.max(0, t - a1) * 3) * (t > a1 ? 1 : 0);
  return <>
    <Dotted x={540 - 200 * (1 - gone)} y={980} w={460} h={560} rot={-3} s={k1 * zoom * (1 + gone * 0.12)} o={Math.min(1, k1 * 2)}>
      <AdCard n="Ad A" c="#9EC5F2" /><div style={{ padding: "0 16px" }}><div style={{ fontWeight: 700, fontSize: 96, color: GREEN, fontVariantNumeric: "tabular-nums" }}>{Math.round(1200 * ci(t, a1 - 0.05, a1 + 0.7, 0, 1, Easing.out(Easing.cubic))).toLocaleString("en-US")}</div><div style={{ fontFamily: MONO, fontSize: 24, color: "#8A847A" }}>clicks</div></div>
    </Dotted>
    <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${gone * 900}px) rotate(${gone * 25}deg)`, transformOrigin: "800px 1000px" }}>
      <Dotted x={800} y={1040 + (1 - k3) * -500} w={330} h={430} rot={7} o={Math.min(1, k3 * 2)}>
        <AdCard n="Ad B" c="#F4A6A0" /><div style={{ padding: "0 16px", display: "flex", alignItems: "center" }}><div><div style={{ fontWeight: 700, fontSize: 72, color: RED }}>3</div><div style={{ fontFamily: MONO, fontSize: 20, color: "#8A847A" }}>clicks</div></div>
          <div style={{ marginLeft: "auto", width: 96, height: 52, borderRadius: 26, background: sw > 0.5 ? "#D6D1C8" : GREEN, border: `3px solid ${INK}`, position: "relative" }}><div style={{ position: "absolute", top: 4, left: 4 + (1 - sw) * 44, width: 38, height: 38, borderRadius: 19, background: "#fff", border: `3px solid ${INK}` }} /></div></div>
      </Dotted>
      <Stamp t={t} a={off} text="off" x={800} y={1000} rot={-14} size={110} />
    </div>
  </>;
};
const Scene7: React.FC<{ t: number }> = ({ t }) => {
  const st = T("stop"), lu = T("linkutm", 1);
  const pack = ci(t, lu - 0.3, lu + 0.2);
  return <>
    {ADS.map(([n, c], i) => { const k = sp(t, S7 + 0.15 + i * 0.1, 11, 240); return <div key={i} style={{ opacity: 1 - pack }}><Dotted x={540 + (i - 2) * 160} y={1050 + Math.abs(i - 2) * 30 + (1 - k) * 800} w={260} h={280} rot={(i - 2) * 8} o={Math.min(1, k * 2)}><AdCard n={n} c={c} /></Dotted>
      {t > st + i * 0.07 && <div style={{ position: "absolute", left: 540 + (i - 2) * 160 - 50, top: 990 + Math.abs(i - 2) * 30, width: 100, height: 100, borderRadius: 50, background: GREEN, border: `4px solid ${INK}`, color: "#fff", fontFamily: GRO, fontWeight: 700, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp(t, st + i * 0.07, 9, 320)})` }}>✓</div>}</div>; })}
    <Stamp t={t} a={st} text="no more guessing" x={540} y={830} rot={-6} size={70} />
    {pack > 0 && <div style={{ position: "absolute", left: 540, top: 1080, transform: `translate(-50%,-50%) scale(${interpolate(sp(t, lu - 0.3, 10, 220), [0, 1], [0.6, 1])})`, opacity: pack, textAlign: "center" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <div style={{ position: "absolute", left: 16, top: 18, right: -16, bottom: -18, borderRadius: 30, backgroundImage: HT_BG, backgroundSize: "7px 7px" }} />
        <div style={{ position: "relative", background: "#fff", borderRadius: 30, padding: "40px 56px", border: `3px solid ${INK}` }}>
          <Img src={staticFile("lmv/logo.svg")} style={{ width: 520, display: "block" }} />
          <div style={{ marginTop: 30, display: "inline-block", padding: "18px 40px", borderRadius: 18, background: RED, color: "#fff", fontFamily: GRO, fontWeight: 700, fontSize: 46, transform: `scale(${1 + 0.03 * Math.sin(t * 6)})` }}>Start free</div>
          <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 24, color: "#7A746B" }}>no credit card</div>
        </div>
      </div>
    </div>}
  </>;
};

const Film: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const [sc, ss, sy] = t < S2 ? [<Scene1 t={t} />, 1.38, 60] : t < S3 ? [<Scene2 t={t} />, 1.05, 40] : t < S4 + 0.4 ? [<Scene3 t={t} />, 1.4, 60] : t < S5 + 0.4 ? [<Scene4 t={t} />, 1.05, 40] : t < S6 ? [<Scene5 t={t} />, 1.08, 80] : t < S7 + 0.4 ? [<Scene6 t={t} />, 1.12, 80] : [<Scene7 t={t} />, 1.08, 80];
  // whip pans at S2, S3, S6 (no halftone there); slow camera drift everywhere
  const whip = (a: number) => (t > a - 0.12 && t < a + 0.3 ? (t < a ? -(1 - (a - t) / 0.12) * 260 : (1 - ci(t, a, a + 0.3)) * 260) : 0);
  const wx = whip(S2) + whip(S3) + whip(S6);
  const drift = 1 + ((t * 0.012) % 0.04);
  const sh = shakeAt(t);
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.55) 0%, rgba(238,235,229,0) 60%)" }} />
      <AbsoluteFill style={{ transformOrigin: "540px 1000px", transform: `translate(${wx + sh}px, ${sh * 0.6 + (sy as number)}px) scale(${drift * (ss as number)})`, filter: Math.abs(wx) > 30 ? `blur(${Math.min(6, Math.abs(wx) / 40)}px)` : undefined }}>{sc}</AbsoluteFill>
      <Hud t={t} />
      <Headline t={t} />
      <HalftoneWipe t={t} a={S4 - 0.4} /><HalftoneWipe t={t} a={S5 - 0.4} /><HalftoneWipe t={t} a={S7 - 0.4} />
      <Grain t={t} />
      <Audio src={staticFile("guess/vo.wav")} />
    </AbsoluteFill>
  );
};
export const GuessReelComp: React.FC = () => <Composition id="StopGuessingReel" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={WD} height={HT} />;
