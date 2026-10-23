// "The Undead Links" — linkutm Halloween reel (9:16, 30 fps, Leda VO, moody illustrated night, TOMBSTONE captions).
// Real features only: dynamic QR (change destination after printing), repoint a link without changing it, live scans/clicks.
// The real linkutm logo is shown untouched on a light plate (never modified). Playful, not gory.
import { AbsoluteFill, Audio, Composition, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import React from "react";
import QRCode from "qrcode";
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadCreep } from "@remotion/google-fonts/Creepster";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { W } from "./words";
import { Cursor } from "../lmv/ui";

const { fontFamily: CINZEL } = loadCinzel("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: CREEP } = loadCreep("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: INTER } = loadInter("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] });
const FPS = 30, DUR = 58.0, WD = 1080, HT = 1920;
const OR = "#F2541B", PUMP = "#FF8A1F", CREAM = "#F6EFE2", INK = "#17121F", PAPER = "#E9E3D2", ZOMB = "#B9C7A8", GREEN = "#3DBE6E", RED = "#E5383B", MOON = "#F3E7C9";
const EZ = Easing.bezier(0.22, 1, 0.36, 1);
const ci = (t: number, a: number, b: number, x = 0, y = 1, e = EZ) => interpolate(t, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const sp = (t: number, a: number, d = 14, s = 180) => (t < a ? 0 : spring({ frame: (t - a) * FPS, fps: FPS, config: { damping: d, stiffness: s } }));
const kfx = (t: number, k: [number, number][], e: (x: number) => number = Easing.inOut(Easing.cubic)) => { if (t <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (t <= k[i][0]) return k[i - 1][1] + (k[i][1] - k[i - 1][1]) * e((t - k[i - 1][0]) / (k[i][0] - k[i - 1][0])); return k[k.length - 1][1]; };
const rnd = (i: number) => { const v = Math.sin(i * 12.9898) * 43758.5453; return v - Math.floor(v); };
// time of the n-th spoken word that starts with `w`
const T = (w: string, n = 0) => { let k = 0; for (const x of W) if (x[2].toLowerCase().replace(/[^a-z0-9,]/g, "").startsWith(w.toLowerCase())) { if (k === n) return x[0]; k++; } return 0; };
const QRM = (() => { const q = QRCode.create("https://go.yourshop.com/sale", { errorCorrectionLevel: "M" }); const n = q.modules.size; const m: boolean[][] = []; for (let y = 0; y < n; y++) { m.push([]); for (let x = 0; x < n; x++) m[y].push(!!q.modules.get(x, y)); } return m; })();
const QR: React.FC<{ size: number; fg?: string; bg?: string }> = ({ size, fg = INK, bg = "#fff" }) => { const n = QRM.length, c = (size * 0.86) / n, o = size * 0.07; return <svg width={size} height={size}><rect width={size} height={size} rx={size * 0.06} fill={bg} />{QRM.map((r, y) => r.map((on, x) => on ? <rect key={x + "_" + y} x={o + x * c} y={o + y * c} width={c + 0.3} height={c + 0.3} fill={fg} /> : null))}</svg>; };

// ---------- the night world ----------
const NightP: React.FC<{ t: number; lit: number; cx: number; cy: number }> = ({ t, lit, cx, cy }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #120B20 0%, #24163A 45%, #3A2350 78%, #2A1A3C 100%)` }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 100%, rgba(255,138,31,${0.28 * lit}) 0%, transparent 60%)` }} />
    <div style={{ position: "absolute", inset: 0, transform: `translate(${-cx * 0.08}px, ${-cy * 0.08}px)` }}>
    {/* stars */}
    {Array.from({ length: 40 }).map((_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * WD, top: rnd(i + 9) * 760, width: 3, height: 3, borderRadius: 2, background: "#fff", opacity: 0.25 + 0.5 * Math.abs(Math.sin(t * 1.3 + i)) }} />)}
    {/* moon */}
    <div style={{ position: "absolute", left: 640, top: 170, width: 260, height: 260, borderRadius: 130, background: `radial-gradient(circle at 40% 38%, #FFF8E4 0%, ${MOON} 55%, #D9C9A2 100%)`, boxShadow: "0 0 120px 30px rgba(243,231,201,0.18)" }}>
      {[[60, 70, 28], [150, 140, 20], [90, 170, 14]].map(([x, y, r], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: r * 2, height: r * 2, borderRadius: r, background: "rgba(190,170,130,0.35)" }} />)}
    </div>
    </div>
    {/* bats */}
    {[0, 1, 2].map((i) => { const p = ((t * 0.06 + i * 0.33) % 1); return <svg key={i} width={70} height={30} viewBox="0 0 70 30" style={{ position: "absolute", left: -80 + p * 1240, top: 260 + i * 90 + Math.sin(t * 2 + i) * 30 }}><path d={`M35 15 Q 25 ${4 + Math.abs(Math.sin(t * 12 + i)) * 10} 2 10 Q 14 16 10 24 Q 22 18 35 22 Q 48 18 60 24 Q 56 16 68 10 Q 45 ${4 + Math.abs(Math.sin(t * 12 + i)) * 10} 35 15 Z`} fill="#0B0712" /></svg>; })}
    {/* hills + trees */}
    <svg width={WD} height={HT} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", transform: `translate(${-cx * 0.5}px, ${-cy * 0.5}px)` }}>
      <path d="M0 1080 C 200 980, 420 1020, 620 960 S 960 900, 1080 960 L 1080 1920 L 0 1920 Z" fill="#1A1028" />
      <path d="M0 1200 C 260 1130, 520 1180, 760 1120 S 1000 1100, 1080 1130 L 1080 1920 L 0 1920 Z" fill="#120A1C" />
      <path d="M90 1140 L 96 900 M 96 980 L 40 920 M 96 1010 L 150 950 M 96 940 L 70 880 M 150 950 L 175 930" stroke="#0B0712" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M960 1110 L 966 860 M 966 930 L 900 870 M 966 960 L 1030 900 M 966 900 L 990 840 M 900 870 L 880 850" stroke="#0B0712" strokeWidth="14" strokeLinecap="round" fill="none" />
      {/* fence */}
      {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${i * 80 + 10} 1215 L ${i * 80 + 10} 1150 L ${i * 80 + 18} 1138 L ${i * 80 + 26} 1150 L ${i * 80 + 26} 1215`} fill="#0D0815" />)}
      <rect x={0} y={1168} width={WD} height={8} fill="#0D0815" />
    </svg>
    {/* drifting fog */}
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: -400 + ((t * (12 + i * 8)) % 600) - cx * 0.8, top: 1180 + i * 70 - cy * 0.8, width: 1900, height: 160, borderRadius: 80, background: "radial-gradient(ellipse at center, rgba(210,200,230,0.16) 0%, transparent 70%)" }} />)}
  </AbsoluteFill>
);
const Ground: React.FC = () => <div style={{ position: "absolute", left: 0, right: 0, top: 1490, bottom: 0, background: "linear-gradient(180deg, #2A1C1A 0%, #1C1210 100%)", borderTop: "6px solid #3A2A22" }} />;

// ---------- characters ----------
const Zombie: React.FC<{ t: number; x: number; y: number; s?: number; rise?: number; alive?: number; walk?: number; i?: number; label?: string }> = ({ t, x, y, s = 1, rise = 1, alive = 0, walk = 0, i = 0, label }) => {
  const bob = Math.sin(t * 5 + i * 2) * 6 * (walk ? 1 : 0.4), tilt = Math.sin(t * 2.5 + i) * (5 - alive * 4);
  const body = alive > 0.5 ? "#FFFDF6" : PAPER, face = alive > 0.5 ? GREEN : "#5E6B52";
  return (
    <div style={{ position: "absolute", left: x - 110 * s, top: y - 300 * s, width: 220 * s, height: 300 * s, clipPath: rise < 1 ? `inset(0 -40% ${0}% -40%)` : undefined, transform: `translateY(${(1 - rise) * 300 * s + bob}px) rotate(${tilt}deg)`, transformOrigin: "50% 100%" }}>
      <svg width={220 * s} height={300 * s} viewBox="0 0 220 300" style={{ overflow: "visible" }}>
        {/* arms */}
        <path d={`M40 130 Q ${-10 + alive * 20} ${110 - alive * 50} ${-30 + alive * 30} ${118 - alive * 70}`} stroke={alive > 0.5 ? "#F2C9A8" : ZOMB} strokeWidth="18" strokeLinecap="round" fill="none" />
        <path d={`M180 130 Q ${230 - alive * 20} ${110 - alive * 50} ${250 - alive * 30} ${118 - alive * 70}`} stroke={alive > 0.5 ? "#F2C9A8" : ZOMB} strokeWidth="18" strokeLinecap="round" fill="none" />
        {/* legs */}
        <path d={`M85 270 L ${80 + Math.sin(t * 5 + i) * 10 * walk} 300 M 135 270 L ${140 - Math.sin(t * 5 + i) * 10 * walk} 300`} stroke="#2E2833" strokeWidth="16" strokeLinecap="round" />
        {/* page body with dog-ear */}
        <path d="M30 40 L 160 40 L 190 70 L 190 275 L 30 275 Z" fill={body} stroke="#1A1424" strokeWidth="6" strokeLinejoin="round" />
        <path d="M160 40 L 160 70 L 190 70" fill="none" stroke="#1A1424" strokeWidth="6" strokeLinejoin="round" />
        {alive <= 0.5 && <path d="M60 230 L 75 245 L 90 228 L 108 248 L 125 230 L 140 246 L 160 232" stroke="#8A8A7A" strokeWidth="4" fill="none" />}
        <text x="110" y="148" textAnchor="middle" fontFamily="Creepster" fontSize="62" fill={face}>{alive > 0.5 ? "200" : "404"}</text>
        {alive > 0.5 ? <path d="M78 190 Q 110 222 142 190" stroke={face} strokeWidth="8" fill="none" strokeLinecap="round" /> : <path d="M80 200 Q 110 180 140 200" stroke={face} strokeWidth="8" fill="none" strokeLinecap="round" />}
      </svg>
      {label && <div style={{ position: "absolute", left: "50%", top: -70 * s, transform: "translateX(-50%)", whiteSpace: "nowrap", padding: "6px 16px", borderRadius: 999, background: "rgba(23,18,31,0.85)", color: CREAM, fontFamily: INTER, fontWeight: 700, fontSize: 26 * s, opacity: rise }}>{label}</div>}
    </div>
  );
};
const FlyerStone: React.FC<{ s?: number; hl?: string }> = ({ s = 1, hl }) => (
  <div style={{ position: "relative", width: 360 * s, height: 500 * s, background: "#F3EADB", borderRadius: 8 * s, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7)", transform: "rotate(-4deg)", fontFamily: INTER, textAlign: "center", outline: hl === "flyer" ? `6px solid ${OR}` : undefined }}>
    <div style={{ paddingTop: 26 * s, fontFamily: CREEP, fontSize: 52 * s, color: OR, letterSpacing: 2 }}>HALLOWEEN</div>
    <div style={{ fontWeight: 800, fontSize: 40 * s, color: INK, marginTop: -4 * s }}>SALE · 50% OFF</div>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 18 * s, outline: hl === "qr" ? `6px solid ${OR}` : undefined, outlineOffset: 6, width: 220 * s, marginLeft: "auto", marginRight: "auto", borderRadius: 10 }}><QR size={220 * s} /></div>
    <div style={{ fontWeight: 700, fontSize: 26 * s, color: INK, marginTop: 14 * s }}>scan to shop</div>
    <div style={{ position: "absolute", right: -8 * s, top: -10 * s, width: 70 * s, height: 70 * s, background: "#D9CBB2", clipPath: "polygon(0 0, 100% 100%, 100% 0)" }} />
  </div>
);
const Phone: React.FC<{ children: React.ReactNode; s?: number }> = ({ children, s = 1 }) => (
  <div style={{ width: 380 * s, height: 760 * s, borderRadius: 60 * s, background: "#0E0B14", padding: 16 * s, boxSizing: "border-box", boxShadow: "0 40px 80px -24px rgba(0,0,0,0.8), 0 0 0 3px #3A3346" }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 46 * s, overflow: "hidden", background: "#fff", position: "relative" }}>{children}</div>
  </div>
);
const LinkCard: React.FC<{ children: React.ReactNode; w?: number; title: string }> = ({ children, w = 940, title }) => (
  <div style={{ width: w, borderRadius: 34, background: "#1E1729", boxShadow: "0 50px 100px -40px rgba(0,0,0,0.85), 0 0 0 2px #3A2E4A", overflow: "hidden", fontFamily: INTER, color: CREAM }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 30px", background: CREAM }}><Img src={staticFile("lmv/logo.svg")} style={{ height: 40 }} /><span style={{ marginLeft: "auto", fontSize: 28, fontWeight: 700, color: "#6E6577" }}>{title}</span></div>
    <div style={{ padding: "30px 34px 36px" }}>{children}</div>
  </div>
);

// ---------- motion helpers (library recipes: svg-path-draw, debris, damped swing, card flip, flood morph, scan beam) ----------
const swing = (t: number, a: number, amp = 16) => (t < a ? 0 : amp * Math.exp(-(t - a) * 2.6) * Math.sin((t - a) * 9));
const Bolt: React.FC<{ t: number; a: number; x: number; s?: number }> = ({ t, a, x, s = 1 }) => {
  if (t < a || t > a + 0.75) return null;
  const draw = ci(t, a, a + 0.12, 0, 1, (q) => q), fade = 1 - ci(t, a + 0.3, a + 0.75);
  const d = "M180 0 L 120 260 L 190 270 L 90 560 L 160 570 L 60 900";
  return <svg width={300 * s} height={900 * s} viewBox="0 0 300 900" style={{ position: "absolute", left: x - 150 * s, top: 0, opacity: fade }}><path d={d} fill="none" stroke="#B9A8FF" strokeWidth="26" strokeLinejoin="round" opacity="0.35" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - draw }} /><path d={d} fill="none" stroke="#F4F0FF" strokeWidth="12" strokeLinejoin="round" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - draw }} /></svg>;
};
const Dirt: React.FC<{ t: number; a: number; x: number; y: number; n?: number; s?: number }> = ({ t, a, x, y, n = 8, s = 1 }) => {
  const e = (t - a) / 0.8; if (e < 0 || e > 1) return null;
  return <>{Array.from({ length: n }).map((_, i) => { const ang = -Math.PI * (0.15 + 0.7 * rnd(i + a * 3)), v = (260 + rnd(i + 7) * 260) * s; const px = x + Math.cos(ang) * v * e, py = y + Math.sin(ang) * v * e + 900 * e * e * s; const r = (10 + rnd(i) * 14) * s; return <div key={i} style={{ position: "absolute", left: px - r, top: py - r, width: r * 2, height: r * 1.6, borderRadius: "45%", background: i % 2 ? "#4A3326" : "#2E1F17", opacity: 1 - e * 0.6 }} />; })}</>;
};
const Hand: React.FC<{ x: number; y: number; k: number; flip?: boolean; s?: number; t: number }> = ({ x, y, k, flip, s = 1, t }) => k <= 0 ? null : (
  <svg width={90 * s} height={150 * s} viewBox="0 0 90 150" style={{ position: "absolute", left: x - 45 * s, top: y - 150 * s * k, transform: `scaleX(${flip ? -1 : 1}) rotate(${Math.sin(t * 9) * 8}deg)`, transformOrigin: "50% 100%" }}>
    <path d="M30 150 L 32 70 L 22 30 Q 20 18 28 20 L 38 50 L 40 12 Q 42 2 50 8 L 50 48 L 58 14 Q 64 6 68 16 L 62 54 L 72 34 Q 80 30 78 42 L 64 90 L 62 150 Z" fill={ZOMB} stroke="#1A1424" strokeWidth="5" strokeLinejoin="round" />
  </svg>
);
const SwingSign: React.FC<{ t: number; a: number; text: string; rot?: number; arrow?: boolean; col?: string; bump?: number }> = ({ t, a, text, rot = -4, arrow, col = "#7A4B2A", bump = 999 }) => {
  if (t < a) return null;
  const k = sp(t, a, 11, 220), ang = rot + swing(t, a + 0.15, 14) + swing(t, bump, 22);
  return (
    <div style={{ transform: `translateY(${(1 - k) * 260}px)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ transform: `rotate(${ang}deg)`, transformOrigin: "50% 100%" }}><div style={{ padding: "16px 34px", background: col, border: "6px solid #3E2414", borderRadius: 8, fontFamily: CREEP, fontSize: 64, color: "#F6E2C2", letterSpacing: 3, clipPath: arrow ? "polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)" : undefined, paddingRight: arrow ? 80 : 34 }}>{text}</div></div>
      <div style={{ width: 22, height: 220, background: "#3E2414" }} />
    </div>
  );
};
// zombie with squash/stretch on landing + card-flip from 404 to 200
const Zombie2: React.FC<{ t: number; x: number; y: number; s?: number; rise?: number; flip?: number; walk?: number; i?: number; label?: string; rA?: number }> = ({ t, x, y, s = 1, rise = 1, flip = 0, walk = 0, i = 0, label, rA = -9 }) => {
  const sq = rA > 0 && t > rA + 0.55 ? Math.exp(-(t - rA - 0.55) * 7) * Math.sin((t - rA - 0.55) * 22) * 0.12 : 0;
  const fx = Math.max(0.02, Math.abs(Math.cos(Math.PI * flip)));
  return <div style={{ position: "absolute", left: 0, top: 0, width: WD, height: HT, clipPath: rA > 0 ? `inset(0 0 ${HT - 1480}px 0)` : undefined }}><div style={{ position: "absolute", left: 0, top: 0, width: WD, height: HT, transform: `scale(${fx * (1 - sq * 0.6)}, ${1 + sq})`, transformOrigin: `${x}px ${y}px` }}><Zombie t={t} x={x} y={y} s={s} rise={rise} alive={flip > 0.5 ? 1 : 0} walk={walk} i={i} label={label} /></div></div>;
};
const ScanBeam: React.FC<{ t: number; a: number; x: number; y: number; w: number; h: number }> = ({ t, a, x, y, w, h }) => {
  if (t < a || t > a + 1.0) return null;
  const p = ci(t, a, a + 0.9, 0, 1, (q) => q), yy = y + h * (0.5 - 0.5 * Math.cos(p * Math.PI * 2));
  return <><div style={{ position: "absolute", left: x - 10, top: yy - 3, width: w + 20, height: 6, borderRadius: 3, background: PUMP }} /><div style={{ position: "absolute", left: x, top: Math.min(yy, y + h / 2), width: w, height: Math.abs(yy - (y + h / 2)), background: "rgba(255,138,31,0.14)" }} /></>;
};

// ---------- scenes ----------
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const f0 = T("5,000"), fan = ci(t, f0, f0 + 0.9);
  const n = Math.round(interpolate(ci(t, f0 - 0.2, f0 + 0.9, 0, 1, (q) => q), [0, 1], [0, 5000]));
  return (
    <AbsoluteFill>
      {Array.from({ length: 6 }).map((_, i) => { const a = (i - 2.5) * 13 * fan; return <div key={i} style={{ position: "absolute", left: 540 - 112 + Math.sin((a * Math.PI) / 180) * 380 * fan, top: 940 + fan * 40, transform: `rotate(${a + Math.sin(t * 3 + i) * 2}deg)`, transformOrigin: "50% 100%", opacity: fan }}><FlyerStone s={0.62} /></div>; })}
      {[[-300, 1250, -14, 0.5], [320, 1255, 11, 0.5]].map(([dx, y, r, s], i) => <div key={"g" + i} style={{ position: "absolute", left: 540 + dx - 180 * s, top: y - 500 * s, transform: `rotate(${r + Math.sin(t * 4 + i) * 3}deg)`, transformOrigin: "50% 100%", opacity: ci(t, 1.7 + i * 0.3, 2.1 + i * 0.3) }}><FlyerStone s={s} /></div>)}
      <div style={{ position: "absolute", left: 540 - 180 * 1.15, top: 560, transform: `translateY(${(1 - sp(t, 1.45, 12, 170)) * 700}px) rotate(${Math.sin(t * 3.2) * 1.5}deg)`, opacity: t < 1.45 ? 0 : 1, transformOrigin: "50% 100%" }}><FlyerStone s={1.15} /></div>
      <Dirt t={t} a={1.55} x={540} y={1150} n={10} />
      {t > T("died") && <div style={{ position: "absolute", left: 540 - 250, top: 300, width: 500, padding: "18px 0", borderRadius: "220px 220px 16px 16px", background: "linear-gradient(180deg,#8E8796,#6B6474)", textAlign: "center", fontFamily: CINZEL, fontWeight: 900, color: "#2E2833", transform: `translateY(${(1 - sp(t, T("died"), 10, 260)) * -500}px) rotate(${swing(t, T("died") + 0.25, 4)}deg)`, boxShadow: "0 20px 40px -16px rgba(0,0,0,0.7)" }}><div style={{ fontSize: 40 }}>R.I.P.</div><div style={{ fontSize: 28 }}>/halloween-sale</div><div style={{ fontSize: 24, color: "#3E3746" }}>died 3 months ago</div></div>}
      {t > f0 - 0.2 && <div style={{ position: "absolute", left: 600, top: 1150, padding: "10px 24px", borderRadius: 999, background: OR, color: "#fff", fontFamily: INTER, fontWeight: 800, fontSize: 44 * (1 + 0.25 * (n / 5000)), transform: `scale(${sp(t, f0 - 0.2, 10, 260)}) rotate(6deg)` }}>× {n.toLocaleString("en-US")} printed</div>}
    </AbsoluteFill>
  );
};
const Rise: React.FC<{ t: number }> = ({ t }) => {
  const Z: [number, string, string][] = [[200, "print", "printed QR"], [540, "post", "social post"], [880, "share", "shared link"]];
  const walk = ci(t, T("walking") - 0.2, 21.1, 0, 1, (q) => q);
  const bump = T("straight") + 0.35;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 40, top: 560 }}><SwingSign t={t} a={T("sale")} text="SALE ENDED" rot={-5} col="#6B3B2A" /></div>
      <div style={{ position: "absolute", left: 590, top: 520 }}><SwingSign t={t} a={T("moves")} text="PAGE MOVED" rot={4} arrow /></div>
      <div style={{ position: "absolute", left: 640, top: 250 }}><SwingSign t={t} a={T("straight") - 0.3} text="DEAD END" rot={-3} col="#8A2A1F" bump={bump} /></div>
      {Z.map(([x, w, label], i) => { const a = T(w); return (
        <React.Fragment key={i}>
          <Hand t={t} x={x - 60} y={1475} k={ci(t, a - 0.45, a - 0.2) * (1 - ci(t, a + 0.1, a + 0.3))} />
          <Hand t={t} x={x + 60} y={1475} k={ci(t, a - 0.35, a - 0.1) * (1 - ci(t, a + 0.1, a + 0.3))} flip />
          <Dirt t={t} a={a - 0.05} x={x} y={1470} n={7} s={0.8} />
          <Zombie2 t={t} i={i} x={x + walk * 520} y={1465} s={1.35} rise={ci(t, a, a + 0.55, 0, 1, Easing.out(Easing.back(1.4)))} rA={a} walk={t > T("walking") - 0.2 ? 1 : 0.3} label={t < T("sale") ? label : undefined} />
        </React.Fragment>); })}
    </AbsoluteFill>
  );
};
const Scan: React.FC<{ t: number }> = ({ t }) => {
  const k = sp(t, 21.2, 16, 140), hit = T("hit"), err = t > hit, lost = T("never");
  const shake = err && t < hit + 0.6 ? Math.sin((t - hit) * 40) * 14 * (1 - (t - hit) / 0.6) : 0;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 520, transform: `rotate(${Math.sin(t * 3) * 1.2}deg)` }}><FlyerStone s={0.95} /></div>
      <ScanBeam t={t} a={21.5} x={157} y={680} w={209} h={209} />
      <div style={{ position: "absolute", left: 560, top: 330, transform: `translateX(${(1 - k) * 600 + shake}px) rotate(${-8 + (t > lost ? ci(t, lost, lost + 0.6, 0, 22) : 0)}deg) translateY(${t > lost ? ci(t, lost + 0.2, lost + 1.0, 0, 900, Easing.in(Easing.cubic)) : 0}px)` }}>
        <Phone s={1.05}>
          {!err ? <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, fontFamily: INTER, fontWeight: 700, fontSize: 30, color: "#888" }}><svg width={90} height={90} viewBox="0 0 90 90" style={{ transform: `rotate(${t * 400}deg)` }}><circle cx="45" cy="45" r="34" fill="none" stroke="#DDD" strokeWidth="10" /><path d="M45 11 A 34 34 0 0 1 79 45" fill="none" stroke={OR} strokeWidth="10" strokeLinecap="round" /></svg>Opening…</div>
            : <div style={{ position: "absolute", inset: 0, background: "#F2F0EC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: INTER }}><div style={{ fontFamily: CREEP, fontSize: 150, color: "#5E6B52", transform: `scale(${sp(t, hit, 9, 280)})` }}>404</div><div style={{ fontSize: 34, fontWeight: 800, color: INK }}>Page not found</div><div style={{ fontSize: 24, color: "#888", marginTop: 8 }}>/halloween-sale</div></div>}
        </Phone>
      </div>
      {t > lost && <div style={{ position: "absolute", left: 560, top: 1120, padding: "8px 26px", border: `7px solid ${RED}`, borderRadius: 14, fontFamily: CREEP, fontSize: 70, color: RED, background: "rgba(18,11,32,0.6)", transform: `scale(${interpolate(sp(t, lost, 10, 300), [0, 1], [2.4, 1])}) rotate(-8deg)`, opacity: Math.min(1, sp(t, lost, 10, 300) * 3) }}>CUSTOMER LOST</div>}
    </AbsoluteFill>
  );
};
const Cure: React.FC<{ t: number }> = ({ t }) => {
  const parts = [26.3, 26.5, 26.7], cu = T("cure"), lit = t > cu;
  return (
    <AbsoluteFill>
      <svg width={420} height={380} viewBox="0 0 420 380" style={{ position: "absolute", left: 330, top: 980, transform: `scale(${0.85 + sp(t, 25.4, 12, 160) * 0.15 + (lit ? 0.08 * Math.exp(-(t - cu) * 5) : 0)}) rotate(${swing(t, 25.85, 5)}deg)`, transformOrigin: "50% 100%" }}>
        <path d="M200 40 Q 210 10 240 14" stroke="#3C5A2A" strokeWidth="16" fill="none" strokeLinecap="round" />
        {[-120, -60, 0, 60, 120].map((dx, i) => <ellipse key={i} cx={210 + dx * 0.9} cy={210} rx={110 - Math.abs(dx) * 0.25} ry={150} fill={i % 2 ? "#E8701A" : PUMP} stroke="#9A4A10" strokeWidth="5" />)}
        <g fill={lit ? "#FFE38A" : "#2A1608"}>
          {t > parts[0] && <path d="M120 170 L 165 120 L 185 180 Z" />}
          {t > parts[1] && <path d="M300 170 L 255 120 L 235 180 Z" />}
          {t > parts[2] && <path d="M110 250 Q 210 330 310 250 L 280 262 L 262 240 L 240 266 L 210 244 L 180 266 L 158 240 L 140 262 Z" />}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
// flood: lantern light fills the frame, then contracts into the logo plate (object-driven transition)
const Flood: React.FC<{ t: number }> = ({ t }) => {
  const a = T("cure") + 0.25; if (t < a || t > 31.95) return null;
  const grow = ci(t, a, a + 0.38, 0, 1, Easing.in(Easing.quad)), shrink = ci(t, a + 0.75, a + 1.25, 0, 1, Easing.inOut(Easing.cubic));
  const cy = interpolate(shrink, [0, 1], [1170, 640]);
  const w = shrink > 0 ? interpolate(shrink, [0, 1], [2700, 780]) : grow * 2700, h = shrink > 0 ? interpolate(shrink, [0, 1], [2700, 300]) : grow * 2700;
  const r = shrink > 0 ? interpolate(shrink, [0, 1], [1350, 44]) : w / 2;
  const logo = ci(t, a + 1.15, a + 1.45);
  return (
    <div style={{ position: "absolute", left: 540 - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: r, background: shrink > 0.4 ? CREAM : PUMP, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: shrink > 0.9 ? "0 40px 90px -30px rgba(0,0,0,0.8)" : undefined, transform: `translateY(${ci(t, 31.5, 31.95, 0, -900, Easing.in(Easing.cubic))}px)` }}>
      <Img src={staticFile("lmv/logo.svg")} style={{ width: 560, opacity: logo, transform: `scale(${0.9 + logo * 0.1})` }} />
    </div>
  );
};
const DynQR: React.FC<{ t: number }> = ({ t }) => {
  const old = "/halloween-sale", nu = "/winter-collection", pr = T("printed"), ed = T("change");
  const fall = (i: number) => ci(t, pr - 0.7 + i * 0.03, pr - 0.2 + i * 0.03, 0, 1, Easing.in(Easing.quad));
  const typed = nu.slice(0, Math.max(0, Math.floor((t - (pr - 0.15)) * 26)));
  const same = T("same"), fly = ci(t, same - 0.1, same + 0.5, 0, 1, Easing.inOut(Easing.cubic));
  const hl = t > T("brand") ? "page" : t > T("same", 1) ? "qr" : t > same + 0.5 ? "flyer" : undefined;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, top: 380, transform: `translateY(${(1 - sp(t, 31.9, 13, 170)) * -1000}px)`, opacity: 1 - ci(t, same - 0.1, same + 0.25) }}>
        <LinkCard title="Dynamic QR">
          <div style={{ display: "flex", gap: 34, alignItems: "center" }}>
            <div style={{ width: 300, height: 300, opacity: t > same - 0.1 ? 0 : 1 }}><QR size={300} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 28, color: "#A79FB2", fontWeight: 700 }}>Goes to</div>
              <div style={{ height: 70, marginTop: 10, fontSize: 38, fontWeight: 700, whiteSpace: "nowrap", position: "relative" }}>
                {[...old].map((c, i) => <span key={i} style={{ display: "inline-block", transform: `translateY(${fall(i) * 260}px) rotate(${fall(i) * (i % 2 ? 40 : -40)}deg)`, opacity: 1 - fall(i) }}>{c}</span>)}
                <span style={{ position: "absolute", left: 0, top: 0, color: PUMP }}>{typed}{t > pr - 0.15 && t < pr + 0.6 && <span style={{ opacity: Math.sin(t * 16) > 0 ? 1 : 0 }}>|</span>}</span>
              </div>
              <div style={{ height: 44 }}>{t < pr - 0.4 ? <span style={{ padding: "6px 14px", borderRadius: 10, background: "rgba(229,56,59,0.2)", color: "#FF8A8A", fontWeight: 800, fontSize: 26 }}>404 · dead</span> : t > pr + 0.55 ? <span style={{ display: "inline-block", padding: "6px 14px", borderRadius: 10, background: "rgba(61,190,110,0.2)", color: "#7CE3A2", fontWeight: 800, fontSize: 26, transform: `scale(${sp(t, pr + 0.55, 9, 300)})` }}>✓ live</span> : null}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 24 }}>
            <span style={{ padding: "12px 22px", borderRadius: 14, background: t > ed + 0.2 && t < pr + 0.6 ? OR : "#2A2234", color: CREAM, fontWeight: 800, fontSize: 28, transform: `scale(${t > ed + 0.15 && t < ed + 0.35 ? 0.92 : 1})` }}>Edit destination</span>
            <span style={{ fontSize: 26, color: "#A79FB2", fontWeight: 600 }}>even after printing</span>
          </div>
        </LinkCard>
      </div>
      {t > ed - 0.6 && t < pr + 0.4 && <Cursor x={kfx(t, [[ed - 0.6, 900], [ed + 0.1, 270]])} y={kfx(t, [[ed - 0.6, 1100], [ed + 0.1, 905]])} click={ci(t, ed + 0.15, ed + 0.5)} />}
      {t > same - 0.1 && <div style={{ position: "absolute", left: 70, top: 470, opacity: ci(t, same - 0.1, same + 0.2), transform: `scale(${1 + (hl === "flyer" ? 0.03 * Math.exp(-(t - same - 0.5) * 3) : 0)})` }}><FlyerStone s={1.0} hl={hl} /></div>}
      {t > same - 0.1 && t < same + 0.55 && <div style={{ position: "absolute", left: interpolate(fly, [0, 1], [104, 140]), top: interpolate(fly, [0, 1], [512, 616]), transform: `scale(${interpolate(fly, [0, 1], [1, 0.733])}) rotate(${interpolate(fly, [0, 1], [0, -4])}deg)`, transformOrigin: "0 0" }}><QR size={300} /></div>}
      {t > T("same", 1) - 0.1 && <div style={{ position: "absolute", left: 600, top: 340, transform: `translateX(${(1 - sp(t, T("same", 1) - 0.1, 15, 170)) * 700}px) rotate(4deg)`, outline: hl === "page" ? `8px solid ${OR}` : undefined, borderRadius: 64 }}>
        <Phone s={1.0}><div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#E9F1F8,#FFFFFF)", fontFamily: INTER, padding: 30, boxSizing: "border-box" }}>
          {[0, 1, 2, 3].map((j) => { const kk = sp(t, T("brand") + j * 0.12, 15, 220); return <div key={j} style={{ transform: `translateY(${(1 - kk) * 80}px)`, opacity: kk }}>{j === 0 ? <div style={{ height: 300, borderRadius: 24, background: "linear-gradient(135deg,#9CC3E6,#D8E8F5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 90 }}>❄️</div> : j === 1 ? <div style={{ fontSize: 40, fontWeight: 800, color: INK, marginTop: 24 }}>Winter collection</div> : j === 2 ? <div style={{ fontSize: 26, color: "#667", marginTop: 8 }}>New arrivals · shop now</div> : <div style={{ marginTop: 26, height: 70, borderRadius: 18, background: INK, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 28 }}>Shop</div>}</div>; })}
        </div></Phone>
      </div>}
    </AbsoluteFill>
  );
};
const Repoint: React.FC<{ t: number }> = ({ t }) => {
  const pt = T("point"), drag = ci(t, pt + 0.2, pt + 1.1, 0, 1, Easing.inOut(Easing.cubic)), draw = ci(t, 41.3, 41.8);
  const ex = interpolate(drag, [0, 1], [270, 810]), ey = 900 - Math.sin(drag * Math.PI) * 120;
  const pk = sp(t, 40.8, 11, 260);
  return (
    <AbsoluteFill style={{ fontFamily: INTER }}>
      <div style={{ position: "absolute", left: 540 - 430, top: 330, width: 860, padding: "34px 0", borderRadius: 999, background: "#1E1729", border: `5px solid ${OR}`, textAlign: "center", color: CREAM, fontWeight: 800, fontSize: 54, transform: `scale(${interpolate(pk, [0, 1], [1.6, 1])})`, opacity: Math.min(1, pk * 3) }}>go.yourshop.com/<span style={{ color: PUMP }}>sale</span></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", color: "#A79FB2", fontWeight: 700, fontSize: 32, opacity: ci(t, T("without"), T("without") + 0.4) }}>✓ same link, never changes</div>
      <svg width={WD} height={HT} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M540 520 Q ${(540 + ex) / 2} 700 ${ex} ${ey}`} fill="none" stroke={PUMP} strokeWidth="10" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - draw }} /><circle cx={ex} cy={ey} r={14 * draw} fill={PUMP} /></svg>
      <div style={{ position: "absolute", left: 60, top: 930, width: 420, padding: "26px 0", borderRadius: 26, background: "#2A2234", textAlign: "center", color: "#8E8496", fontWeight: 700, fontSize: 34, textDecoration: drag > 0.5 ? "line-through" : "none", opacity: 1 - drag * 0.5 }}>old page</div>
      {drag > 0.3 && <div style={{ position: "absolute", left: 200 - ci(t, pt + 0.5, pt + 2.5, 0, 60), top: 880 - ci(t, pt + 0.5, pt + 2.5, 0, 420), fontSize: 90, opacity: 1 - ci(t, pt + 1.8, pt + 2.6), transform: `rotate(${Math.sin(t * 4) * 12}deg)` }}>👻</div>}
      <div style={{ position: "absolute", left: 600, top: 930, width: 420, padding: "26px 0", borderRadius: 26, background: drag > 0.95 ? "rgba(61,190,110,0.25)" : "#2A2234", border: `4px solid ${drag > 0.95 ? GREEN : "transparent"}`, textAlign: "center", color: CREAM, fontWeight: 800, fontSize: 34, transform: `scale(${drag > 0.95 ? 1 + 0.08 * Math.exp(-(t - pt - 1.1) * 6) : 1})` }}>new page ✓</div>
      {t > pt - 0.4 && t < pt + 1.6 && <Cursor x={t < pt + 0.2 ? kfx(t, [[pt - 0.4, 500], [pt + 0.2, 270]]) : ex} y={t < pt + 0.2 ? kfx(t, [[pt - 0.4, 1200], [pt + 0.2, 900]]) : ey} click={t > pt + 0.15 && t < pt + 1.1 ? 0.5 : 0} />}
    </AbsoluteFill>
  );
};
const Live: React.FC<{ t: number }> = ({ t }) => {
  const g = ci(t, 46.0, 50.4, 0, 1, (q) => q), al = T("alive");
  const pts = Array.from({ length: 40 }).map((_, i) => `${i * 22},${150 - (i * 2.6 + Math.sin(i * 1.3) * 14 + rnd(i) * 18)}`);
  return (
    <AbsoluteFill style={{ fontFamily: INTER }}>
      <div style={{ position: "absolute", left: 70, top: 300, transform: `translateY(${(1 - sp(t, 45.9, 13, 170)) * -900}px)` }}>
        <LinkCard title="Live">
          <div style={{ display: "flex", gap: 24 }}>{([["Scans", 1284], ["Clicks", 3912]] as [string, number][]).map(([l, v]) => <div key={l} style={{ flex: 1, padding: "20px 24px", borderRadius: 22, background: "#2A2234" }}><div style={{ fontSize: 28, color: "#A79FB2", fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 14, height: 14, borderRadius: 7, background: RED, opacity: Math.sin(t * 7) > 0 ? 1 : 0.3 }} />{l}</div><div style={{ fontSize: 76, fontWeight: 800, color: CREAM, transform: `scale(${1 + 0.18 * g})`, transformOrigin: "0 50%" }}>{Math.round(v * g).toLocaleString("en-US")}</div></div>)}</div>
          <svg width={872} height={170} style={{ marginTop: 22 }}><polyline points={pts.slice(0, Math.max(2, Math.round(g * 40))).join(" ")} fill="none" stroke={PUMP} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" /></svg>
          <div style={{ fontSize: 22, color: "#7E7488", marginTop: 6 }}>example data</div>
        </LinkCard>
      </div>
      {[200, 540, 880].map((x, i) => <Zombie2 key={i} t={t} i={i} x={x} y={1465} s={1.05} flip={ci(t, al + i * 0.3, al + i * 0.3 + 0.45)} />)}
    </AbsoluteFill>
  );
};
const Finale: React.FC<{ t: number }> = ({ t }) => {
  const walk = ci(t, 50.7, 54.6, 0, 1, (q) => q), end = sp(t, 55.3, 11, 170), door = ci(t, 51.0, 51.6, 0, 1, Easing.out(Easing.cubic));
  const word = "Happy Halloween", b0 = 26.9 + Math.ceil((50.7 - 26.9) / 0.6) * 0.6;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 300, top: 760, width: 600, height: 700, background: "#3B2A3E", border: "8px solid #22182A", borderRadius: "16px 16px 0 0", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7)", transform: `translateY(${(1 - sp(t, 50.6, 14, 150)) * 800}px)` }}>
        <div style={{ position: "absolute", left: -40, right: -40, top: -90, height: 110, background: "#22182A", clipPath: "polygon(8% 100%, 50% 0, 92% 100%)" }} />
        {[[60, 80], [380, 80]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 160, height: 150, borderRadius: 10, background: t > 50.9 + i * 0.3 ? "#FFC56E" : "#3A3046", boxShadow: "inset 0 0 0 8px #22182A" }} />)}
        <div style={{ position: "absolute", left: 210, top: 330, width: 180, height: 362, borderRadius: "90px 90px 0 0", background: "#FFB04A", boxShadow: "inset 0 0 0 8px #22182A", overflow: "hidden" }}><div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 180 * (1 - door * 0.85), background: "#5A3A28", borderRight: "6px solid #22182A" }} /></div>
        <div style={{ position: "absolute", left: 160, top: 270, padding: "6px 22px", background: "#22182A", color: "#FFC56E", fontFamily: CREEP, fontSize: 44, transform: `rotate(${swing(t, T("dead"), 10)}deg) scale(${sp(t, T("dead"), 10, 240)})`, transformOrigin: "50% 0" }}>OPEN</div>
      </div>
      <div style={{ position: "absolute", left: 540 - 220, top: 1455, width: 440, height: 60, background: `rgba(255,176,74,${0.35 * door})`, clipPath: "polygon(30% 0, 70% 0, 100% 100%, 0 100%)" }} />
      {[0, 1, 2, 3, 4, 5].map((n) => { const k = sp(t, b0 + n * 0.6, 9, 300), x = n % 2 ? 860 - n * 18 : 220 + n * 18; return <div key={n} style={{ position: "absolute", left: x - 40, top: 1410, fontSize: 70, transform: `scale(${k})`, transformOrigin: "50% 100%" }}>🎃</div>; })}
      {[0, 1, 2].map((i) => <Zombie2 key={i} t={t} i={i} x={interpolate(walk, [0, 1], [140 + i * 140, 540 + (i - 1) * 40])} y={interpolate(walk, [0, 1], [1465, 1440])} s={interpolate(walk, [0, 1], [0.8, 0.38]) * (1 - ci(t, 54.4, 54.9))} flip={1} walk={1} />)}
      {t > 55.3 && <AbsoluteFill style={{ background: `rgba(18,11,32,${0.72 * Math.min(1, end)})` }}>
        <div style={{ position: "absolute", left: 540 - 420, top: 620, width: 840, padding: "70px 0 56px", borderRadius: 44, background: CREAM, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, transform: `translateY(${(1 - end) * -900}px) rotate(${swing(t, 55.75, 3)}deg)` }}>
          <Img src={staticFile("lmv/logo.svg")} style={{ width: 600 }} />
          <div style={{ fontFamily: CREEP, fontSize: 64, color: OR, letterSpacing: 3 }}>{[...word].map((c, i) => { const kk = sp(t, 55.9 + i * 0.04, 9, 300); return <span key={i} style={{ display: "inline-block", whiteSpace: "pre", transform: `translateY(${(1 - kk) * 70}px)`, opacity: Math.min(1, kk * 2) }}>{c}</span>; })}</div>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 34, color: "#6E6577", opacity: ci(t, 56.6, 57.0) }}>linkutm.com</div>
        </div>
      </AbsoluteFill>}
    </AbsoluteFill>
  );
};

// ---------- TOMBSTONE captions ----------
const KEY = /^(died|5,000|zombie|dead|404|cure|linkutm|die|dynamic|change|printed|same|brand|new|live|alive|halloween|back)$/i;
type Chunk = { a: number; b: number; w: [number, number, string][] };
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = []; let cur: [number, number, string][] = [];
  W.forEach((w, i) => {
    cur.push(w);
    const next = W[i + 1], len = cur.reduce((s, x) => s + x[2].length + 1, 0);
    if (/[.?!]$/.test(w[2]) || (/,$/.test(w[2]) && len > 14) || len > 24 || !next || next[0] - w[1] > 0.4) { out.push({ a: cur[0][0], b: cur[cur.length - 1][1], w: cur }); cur = []; }
  });
  out.forEach((c, i) => { c.b = out[i + 1] ? out[i + 1].a : c.b + 1.0; });
  return out;
})();
const Tomb: React.FC<{ t: number }> = ({ t }) => {
  const i = CHUNKS.findIndex((c) => t >= c.a - 0.08 && t < c.b);
  if (i < 0) return null;
  const c = CHUNKS[i], k = sp(t, c.a - 0.08, 15, 260), sink = ci(t, c.b - 0.12, c.b, 0, 1, Easing.in(Easing.cubic));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1500, height: 420, overflow: "hidden", display: "flex", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 40 + (1 - k) * 330 + sink * 330, maxWidth: 960, padding: "44px 46px 40px", borderRadius: "200px 200px 18px 18px", background: "linear-gradient(180deg,#9A93A3 0%,#7B7485 60%,#655F70 100%)", boxShadow: "inset 0 6px 0 rgba(255,255,255,0.18), inset 0 -10px 0 rgba(0,0,0,0.18), 0 20px 30px -10px rgba(0,0,0,0.6)", textAlign: "center", fontFamily: CINZEL, fontWeight: 900, fontSize: 54, lineHeight: 1.15, color: "#2C2633", textShadow: "0 2px 0 rgba(255,255,255,0.28), 0 -1px 0 rgba(0,0,0,0.35)", transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)` }}>
        {c.w.map(([a, , s], j) => { const on = t >= a - 0.04, key = KEY.test(s.replace(/[.?!,]$/, "")); const brand = /^linkutm/i.test(s); return <span key={j} style={{ opacity: on ? 1 : 0.18, color: key ? OR : undefined, fontFamily: brand ? INTER : undefined, fontWeight: brand ? 800 : undefined, letterSpacing: brand ? -1 : undefined }}>{brand ? s.toLowerCase() : s.toUpperCase()}{" "}</span>; })}
      </div>
    </div>
  );
};

// ---------- master: one camera with parallax + beat pulse ----------
const SC: { a: number; b: number; C: React.FC<{ t: number }> }[] = [
  { a: 0, b: 8.65, C: Hook }, { a: 8.6, b: 21.25, C: Rise }, { a: 21.2, b: 25.4, C: Scan }, { a: 25.35, b: 31.95, C: Cure },
  { a: 31.9, b: 40.85, C: DynQR }, { a: 40.8, b: 45.95, C: Repoint }, { a: 45.9, b: 50.65, C: Live }, { a: 50.6, b: DUR, C: Finale },
];
const camAt = (t: number) => {
  const y = kfx(t, [[0, -820], [1.45, 0]], Easing.inOut(Easing.cubic));
  const x = kfx(t, [[T("walking") - 0.2, 0], [21.1, 300], [21.2, 0]], (q) => q);
  let z = kfx(t, [[0, 1.0], [8.6, 1.08], [8.62, 1.0], [25.3, 1.0], [T("cure"), 1.32], [T("cure") + 0.6, 1.0], [50.6, 1.0], [55.2, 1.06]]);
  if (t > 26.9) { const n = Math.floor((t - 26.9) / 0.6), e = t - 26.9 - n * 0.6; z *= 1 + 0.014 * Math.exp(-e * 10); }
  return { x: x + Math.sin(t * 0.4) * 10, y: y + Math.cos(t * 0.33) * 8, z };
};
const Film: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const lit = ci(t, T("cure"), T("cure") + 1.2);
  const c = camAt(t);
  const flash = Math.max(t > 25.75 && t < 26.1 ? 1 - Math.abs(t - 25.85) / 0.25 : 0, t > T("died") && t < T("died") + 0.3 ? 0.8 - ((t - T("died")) / 0.3) * 0.8 : 0);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#120B20" }}>
      <NightP t={t} lit={lit} cx={c.x} cy={c.y} />
      <Bolt t={t} a={T("died")} x={300} /><Bolt t={t} a={25.78} x={760} s={1.2} />
      <div style={{ position: "absolute", left: 0, top: 0, width: WD, height: HT, transform: `translate(${-c.x}px, ${-c.y}px) scale(${c.z})`, transformOrigin: "540px 1150px" }}>
        <Ground />
        {SC.map((s, i) => {
          if (t < s.a || t >= s.b) return null;
          const o = ci(t, s.b - 0.1, s.b);
          return <AbsoluteFill key={i} style={{ opacity: 1 - o }}><s.C t={t} /></AbsoluteFill>;
        })}
      </div>
      <Flood t={t} />
      {flash > 0 && <AbsoluteFill style={{ background: "#E8E4FF", opacity: flash * 0.7 }} />}
      <Tomb t={t} />
      <Audio src={staticFile("undead/vo.wav")} />
    </AbsoluteFill>
  );
};
export const UndeadV2Comp: React.FC = () => <Composition id="UndeadLinksV2" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={WD} height={HT} />;
