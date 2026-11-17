// Bio Pages reel v4 — "One link becomes everything". 9:16, ~29.6 s, 30 fps, music-only (ElevenLabs bass house, 123 BPM,
// bar = 1.951 s, beat phase 0.395 s, energy lift at bar 8 = 16.0 s). ONE hero (the orange link pill) morphs through every
// beat: pill → typed handle → phone screen → theme wipes → blocks → folds into a QR → QR on poster/story/DM → bars of a
// chart → back into the pill → "Claim your link". Text-rewrite headlines (letter swap), cold studio → warm world on the
// lift, motion blur only while moving, sentence case, one accent colour. Real bio page renderer + 26-theme engine from
// src/bio (staging app code). Logo untouched on a white plate. No explosions / drawer / 3D carousel (that was v3).
import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Composition, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import QRCode from "qrcode";
import { IPhone, BioPage, sS, C, JOST, INTER, MONO, Block } from "../bio/kit";

const FPS = 30, WD = 1080, HT = 1920, DUR = 29.6;
const BAR = 1.951, PH = 0.395;
const B = (n: number) => PH + BAR * n; // bar lines
const OR = C.orange, INK = "#121214";
const EZ = Easing.bezier(0.2, 0.6, 0.35, 1);
const ci = (t: number, a: number, b: number, x = 0, y = 1, e: (v: number) => number = EZ) => interpolate(t, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const sp = (t: number, a: number, d = 14, s = 200) => (t < a ? 0 : spring({ frame: (t - a) * FPS, fps: FPS, config: { damping: d, stiffness: s } }));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ---------------- timing (bars) ----------------
const T_CLAIM = B(1), T_GROW = B(1) + 1.0, T_STYLE = B(3), T_BUILD = B(6), T_SHARE = B(8), T_TRACK = B(11), T_END = B(13);

// ---------------- headline text-rewrite (letters out → letters in) ----------------
const HEAD: [number, string, string][] = [
  [0, "Your bio has room for", "one link."], [T_CLAIM - 0.1, "Make it a", "whole page."], [T_STYLE - 0.1, "26 themes.", "One tap."],
  [T_BUILD - 0.1, "Blocks that", "actually move."], [T_SHARE - 0.1, "Share it", "anywhere."], [T_TRACK - 0.1, "See every", "tap."], [T_END - 0.1, "Bio Pages", "by linkutm"],
];
const Headline: React.FC<{ t: number; dark: number }> = ({ t, dark }) => {
  let i = 0; HEAD.forEach((h, k) => { if (t >= h[0]) i = k; });
  const [a, l1, l2] = HEAD[i], prev = i > 0 ? HEAD[i - 1] : null;
  const col = dark > 0.5 ? "#fff" : INK;
  const line = (s: string, accent: boolean, row: number, inT: number, out: boolean) => (
    <div style={{ display: "flex", justifyContent: "center", height: 112, whiteSpace: "pre" }}>
      {s.split("").map((ch, j) => {
        const d = j * 0.018 + row * 0.06;
        const k = out ? ci(t, inT + d, inT + d + 0.22, 0, 1, Easing.in(Easing.cubic)) : ci(t, inT + d, inT + d + 0.3, 0, 1, Easing.out(Easing.back(1.6)));
        const y = out ? -k * 60 : (1 - k) * 70, o = out ? 1 - k : k;
        return <span key={j} style={{ display: "inline-block", transform: `translateY(${y}px)`, opacity: o, color: accent ? OR : col, fontStyle: accent ? "italic" : "normal" }}>{ch}</span>;
      })}
    </div>
  );
  return <div style={{ position: "absolute", left: 40, right: 40, top: 190, fontFamily: JOST, fontWeight: 800, fontSize: 92, letterSpacing: "-0.02em", lineHeight: 1, textRendering: "geometricPrecision" }}>
    {prev && t < a + 0.35 && t >= a && <div style={{ position: "absolute", left: 0, right: 0, top: 0 }}>{line(prev[1], false, 0, a, true)}{line(prev[2], true, 1, a, true)}</div>}
    <div>{line(l1, false, 0, i === 0 ? -1 : a + 0.12, false)}{line(l2, true, 1, i === 0 ? -1 : a + 0.12, false)}</div>
  </div>;
};

// ---------------- worlds ----------------
const World: React.FC<{ t: number; warm: number }> = ({ t, warm }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#EEEFF2 0%,#E1E3E8 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#FFE7D6 0%,#FFC9A6 55%,#FF9F6E 100%)", opacity: warm }} />
    {/* studio floor + soft contact shadow under the stage */}
    <div style={{ position: "absolute", left: -200, right: -200, top: 1520, bottom: -100, background: warm > 0.5 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.5)", borderRadius: "50% 50% 0 0 / 80px 80px 0 0" }} />
    {/* drifting dot grid */}
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(circle, rgba(18,18,20,${0.09 - warm * 0.04}) 2px, transparent 2.5px)`, backgroundSize: "54px 54px", backgroundPosition: `${(t * 14) % 54}px ${(t * 9) % 54}px` }} />
  </AbsoluteFill>
);

// ---------------- hero pill geometry ----------------
type G = { x: number; y: number; w: number; h: number; r: number };
const PW = 590, PX = 540, PY = 1070; // phone outer width & centre
const SCR = { w: PW * 0.927, h: PW * 0.927 * (844 / 390) }; // bio screen area inside the phone
const PILL: G = { x: 540, y: 960, w: 780, h: 160, r: 80 };
const SCREEN: G = { x: PX, y: PY + 6, w: SCR.w, h: SCR.h, r: 58 };
const mixG = (a: G, b: G, k: number): G => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k), r: lerp(a.r, b.r, k) });

const THEMES = ["clean-light", "sunset-drive", "neon-noir", "festival", "blueprint", "bubblegum", "chrome", "forest", "aurora"];
const BLOCKS_IN: Block[] = [{ kind: "link", title: "Latest video" }, { kind: "link", title: "Shop my presets" }, { kind: "video" }, { kind: "link", title: "Book a session" }, { kind: "music" }];
const ANIMS = ["bounce", "pulse", "shake", "wiggle"];

const Film: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const warm = ci(t, T_SHARE - 0.05, T_SHARE + 0.4);
  const dark = 0;
  const qr = useMemo(() => QRCode.create("https://lnkutm.me/maya", { errorCorrectionLevel: "H" }), []);
  const qn = qr.modules.size;

  // --- hero pill: hook → typed handle → grows into the phone screen
  const grow = ci(t, T_GROW, T_GROW + 0.7, 0, 1, Easing.inOut(Easing.cubic));
  const bob = Math.sin(t * 2.6) * 10 * (1 - grow);
  const g = mixG({ ...PILL, y: PILL.y + bob }, SCREEN, grow);
  const handle = t < T_CLAIM ? "link in bio" : "lnkutm.me/" + "maya".slice(0, Math.max(0, Math.floor((t - T_CLAIM - 0.25) * 9)));
  const pillOn = t < T_GROW + 0.75;
  const phoneIn = ci(t, T_GROW + 0.55, T_GROW + 0.85);

  // --- phone presence: from claim-grow until it folds into the QR
  const fold = ci(t, T_SHARE - 0.2, T_SHARE + 0.55, 0, 1, Easing.inOut(Easing.cubic));
  const phoneScale = lerp(1, 0.45, fold), phoneRot = lerp(0, -12, fold);

  // --- theme wipes (STYLE): a new theme every half bar, wiped on a diagonal
  const step = BAR / 2;
  const ti = t < T_STYLE ? 0 : Math.min(THEMES.length - 1, Math.floor((t - T_STYLE) / step) + 1);
  const wipeK = t < T_STYLE ? 1 : ci((t - T_STYLE) % step, 0, 0.32, 0, 1, Easing.inOut(Easing.cubic));
  const buildTheme = "sunset-drive";
  const themeNow = t >= T_BUILD - 0.2 ? buildTheme : THEMES[ti];
  const themePrev = t >= T_BUILD - 0.2 ? buildTheme : THEMES[Math.max(0, ti - 1)];

  // --- blocks (BUILD): drop in with springs, each shows an animation on its beat
  const blocks: Block[] = BLOCKS_IN.map((b, i) => {
    if (b.kind !== "link") return b;
    const li = [0, 1, 3].indexOf(i); const a = T_BUILD + 1.0 + li * (BAR / 2.5);
    return { ...b, anim: ANIMS[li % 4], animT: t > a ? Math.min(1.01, (t - a) / 0.9) : -1, hl: t > a && t < a + 0.9 ? 1 : 0 };
  });
  const blockIn = (i: number) => (t < T_BUILD ? 1 : sp(t, T_BUILD + 0.1 + i * 0.16, 9, 260));

  // --- motion blur only while the hero moves fast
  const mv = Math.abs(ci(t + 1 / FPS, T_GROW, T_GROW + 0.7, 0, 1, Easing.inOut(Easing.cubic)) - grow) + Math.abs(ci(t + 1 / FPS, T_SHARE - 0.2, T_SHARE + 0.55, 0, 1, Easing.inOut(Easing.cubic)) - fold);
  const blur = Math.min(6, mv * 220);

  // --- QR (SHARE): page squares down into a QR code, then the QR lands on 3 surfaces
  const qrK = ci(t, T_SHARE + 0.15, T_SHARE + 0.9);
  const surfaces = ci(t, T_SHARE + 1.3, T_SHARE + 2.2);
  const toBars = ci(t, T_TRACK - 0.1, T_TRACK + 0.8, 0, 1, Easing.inOut(Easing.cubic));
  const QS = 600;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#E9EAEE" }}>
      <World t={t} warm={warm} />
      <Headline t={t} dark={dark} />

      {/* ---------------- PHONE (claim → style → build), folds away on the lift ---------------- */}
      {t >= T_GROW + 0.55 && t < T_SHARE + 0.9 && (
        <div style={{ position: "absolute", left: PX - PW / 2, top: PY - PW * 1.025, transform: `scale(${phoneScale * (0.96 + 0.04 * phoneIn)}) rotate(${phoneRot}deg)`, transformOrigin: "50% 50%", opacity: phoneIn * (1 - ci(t, T_SHARE + 0.5, T_SHARE + 0.85)), filter: blur > 0.4 ? `blur(${blur}px)` : undefined }}>
          <IPhone w={PW}>
            <div style={{ position: "absolute", inset: 0 }}><BioPage theme={themePrev} scale={sS(PW)} blocks={t >= T_BUILD ? blocks : undefined} blockIn={t >= T_BUILD ? blockIn : undefined} /></div>
            {themeNow !== themePrev && <div style={{ position: "absolute", inset: 0, clipPath: `polygon(0 0, ${wipeK * 160}% 0, ${wipeK * 160 - 60}% 100%, 0 100%)` }}><BioPage theme={themeNow} scale={sS(PW)} /></div>}
          </IPhone>
        </div>
      )}
      {/* theme name chips during STYLE */}
      {t >= T_STYLE && t < T_BUILD - 0.2 && <div style={{ position: "absolute", left: 0, right: 0, top: 1600, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "14px 30px", borderRadius: 999, background: "#fff", boxShadow: "0 14px 30px -16px rgba(0,0,0,0.4)", fontFamily: INTER, fontWeight: 700, fontSize: 34, color: INK, transform: `scale(${1 + 0.06 * Math.exp(-((t - T_STYLE) % step) * 8)})` }}>
          <span style={{ color: OR }}>Theme {ti + 1}</span> / 26 · {THEMES[ti].replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase())}
        </div></div>}
      {/* animation chips during BUILD */}
      {t >= T_BUILD + 0.9 && t < T_SHARE - 0.2 && [0, 1, 2].map((li) => { const a = T_BUILD + 1.0 + li * (BAR / 2.5), k = sp(t, a, 10, 280); return k > 0.01 ? <div key={li} style={{ position: "absolute", left: li % 2 ? 790 : 70, top: 760 + li * 190, transform: `scale(${k}) rotate(${li % 2 ? 4 : -4}deg)`, padding: "12px 24px", borderRadius: 999, background: INK, color: "#fff", fontFamily: INTER, fontWeight: 700, fontSize: 32, boxShadow: "0 14px 30px -16px rgba(0,0,0,0.5)" }}>{["Bounce", "Pulse", "Shake"][li]}</div> : null; })}

      {/* ---------------- HERO PILL (hook + claim) ---------------- */}
      {pillOn && (
        <div style={{ position: "absolute", left: g.x - g.w / 2, top: g.y - g.h / 2, width: g.w, height: g.h, borderRadius: g.r, background: grow > 0.6 ? "#fff" : OR, boxShadow: "0 30px 60px -24px rgba(242,84,27,0.55)", display: "flex", alignItems: "center", justifyContent: "center", gap: 18, color: "#fff", fontFamily: INTER, fontWeight: 800, fontSize: 64, overflow: "hidden", transform: `scale(${1 + 0.05 * Math.exp(-Math.max(0, t - T_CLAIM) * 6) * (t > T_CLAIM ? 1 : 0)})`, filter: blur > 0.4 ? `blur(${blur}px)` : undefined, opacity: 1 - ci(t, T_GROW + 0.6, T_GROW + 0.75) }}>
          {grow < 0.35 && <><svg width={66} height={66} viewBox="0 0 24 24"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" /></svg>
            <span style={{ fontFamily: t < T_CLAIM ? INTER : MONO }}>{handle}{t >= T_CLAIM && Math.floor(t * 3) % 2 === 0 && t < T_GROW ? "|" : ""}</span></>}
        </div>
      )}
      {/* hook: the lonely link is "the only one" — 4 ghost links try to squeeze in and get rejected */}
      {t < T_CLAIM && [0, 1, 2, 3].map((i) => { const a = 0.15 + i * 0.4, p = ci(t, a, a + 0.32, 0, 1, Easing.out(Easing.cubic)), back = ci(t, a + 0.32, a + 0.9, 0, 1, Easing.in(Easing.quad)); const side = i % 2 ? 1 : -1; if (p <= 0 || back >= 1) return null;
        return <div key={i} style={{ position: "absolute", left: 540 - 230, top: 960 - 50, width: 460, height: 100, borderRadius: 50, background: "#fff", border: `4px solid ${INK}`, transform: `translate(${side * (1 - p) * 700 + side * back * 260}px, ${-(1 - p) * 80 + 130 + back * 900}px) rotate(${side * back * 40}deg)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: INTER, fontWeight: 800, fontSize: 40, color: INK, boxShadow: "0 18px 30px -16px rgba(0,0,0,0.4)" }}>{["Shop", "YouTube", "Podcast", "Newsletter"][i]}<span style={{ color: "#E5383B" }}>✕</span></div>; })}

      {/* ---------------- SHARE: QR assembles from the folding page ---------------- */}
      {t >= T_SHARE && t < T_TRACK + 1.0 && (
        <div style={{ position: "absolute", left: 540 - QS / 2, top: 1000 - QS / 2 - surfaces * 80, width: QS, height: QS, transform: `scale(${(0.6 + 0.4 * sp(t, T_SHARE + 0.1, 12, 220)) * (1 - surfaces * 0.35)}) rotate(${lerp(-8, 0, qrK)}deg)`, borderRadius: 34, background: "#fff", padding: 26, boxShadow: "0 40px 80px -30px rgba(120,40,0,0.55)" }}>
          <svg width={QS - 52} height={QS - 52}>{Array.from({ length: qn * qn }).map((_, i) => { const x = i % qn, y = Math.floor(i / qn); if (!qr.modules.get(x, y)) return null; const c = (QS - 52) / qn; const d = ((x * 7 + y * 13) % 17) / 17; const k = ci(qrK, d * 0.5, d * 0.5 + 0.5);
            // TRACK: modules fall into columns of a bar chart
            const col = Math.floor(x / (qn / 7)); const bx = col * ((QS - 52) / 7) + 6, by = (QS - 52) - (y / qn) * (QS - 52) * [0.35, 0.5, 0.42, 0.7, 0.62, 0.85, 1][Math.min(6, col)];
            const X = lerp(x * c, bx, toBars), Y = lerp(y * c, by, toBars);
            return <rect key={i} x={X} y={Y} width={c * (0.3 + 0.7 * k)} height={c * (0.3 + 0.7 * k)} rx={c * 0.5 * (1 - k)} fill={toBars > 0.5 ? OR : INK} opacity={(0.3 + 0.7 * k) * (1 - ci(t, T_TRACK + 0.7, T_TRACK + 1.0))} />; })}</svg>
        </div>
      )}
      {/* QR lands on three surfaces: a café poster, an Instagram story sticker, a DM */}
      {t >= T_SHARE + 1.2 && t < T_TRACK && [0, 1, 2].map((i) => { const k = sp(t, T_SHARE + 1.3 + i * 0.3, 12, 200); const pos = [[220, 1300, -6], [540, 1380, 3], [860, 1300, 7]][i];
        return <div key={i} style={{ position: "absolute", left: pos[0] - 150, top: pos[1] - 190 + (1 - k) * 500, width: 300, height: 380, borderRadius: 26, transform: `rotate(${pos[2]}deg)`, opacity: Math.min(1, k * 2), background: ["#FFF6E9", "linear-gradient(160deg,#833AB4,#FD1D1D 60%,#FCB045)", "#fff"][i], boxShadow: "0 30px 60px -26px rgba(0,0,0,0.5)", padding: 22, fontFamily: INTER, color: i === 1 ? "#fff" : INK, overflow: "hidden" }}>
          <div style={{ fontWeight: 800, fontSize: 30 }}>{["Café poster", "Story sticker", "DM"][i]}</div>
          <div style={{ marginTop: 20, width: 150, height: 150, borderRadius: 16, background: "#fff", padding: 10, marginLeft: i === 2 ? 0 : 55 }}><svg width={130} height={130}>{Array.from({ length: qn * qn }).map((_, j) => { const x = j % qn, y = Math.floor(j / qn); return qr.modules.get(x, y) ? <rect key={j} x={x * 130 / qn} y={y * 130 / qn} width={130 / qn + 0.3} height={130 / qn + 0.3} fill={INK} /> : null; })}</svg></div>
          <div style={{ marginTop: 18, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: i === 1 ? "#fff" : OR }}>lnkutm.me/maya</div>
        </div>; })}

      {/* ---------------- TRACK: KPI cards + per-block taps ---------------- */}
      {t >= T_TRACK + 0.3 && t < T_END + 0.4 && <>
        {([["Views", 9410], ["Clicks", 1284], ["Top block", 0]] as [string, number][]).map(([l, v], i) => { const k = sp(t, T_TRACK + 0.4 + i * 0.18, 12, 220); const val = Math.round(v * ci(t, T_TRACK + 0.5 + i * 0.18, T_TRACK + 1.6 + i * 0.18, 0, 1, Easing.out(Easing.exp)));
          return <div key={l} style={{ position: "absolute", left: 40 + i * 340, top: 1000 + (1 - k) * 300, width: 320, height: 240, borderRadius: 30, background: "#fff", boxShadow: "0 26px 50px -24px rgba(120,40,0,0.5)", padding: "26px 24px", fontFamily: INTER, opacity: Math.min(1, k * 2) * (1 - ci(t, T_END, T_END + 0.35)) }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: "#6b6b73" }}>{l}</div>
            <div style={{ fontFamily: JOST, fontWeight: 800, fontSize: i === 2 ? 48 : 84, color: i === 1 ? OR : INK, marginTop: 10, fontVariantNumeric: "tabular-nums", lineHeight: 1.05 }}>{i === 2 ? "Shop my presets" : val.toLocaleString("en-US")}</div>
          </div>; })}
        {[["Latest video", 412], ["Shop my presets", 538], ["Book a session", 214], ["Spotify", 120]].map(([n, v], i) => { const k = sp(t, T_TRACK + 1.0 + i * 0.12, 12, 220), w = (Number(v) / 538) * 520 * ci(t, T_TRACK + 1.1 + i * 0.12, T_TRACK + 2.0 + i * 0.12, 0, 1, Easing.out(Easing.cubic));
          return <div key={String(n)} style={{ position: "absolute", left: 60, top: 1300 + i * 84, display: "flex", alignItems: "center", gap: 18, fontFamily: INTER, fontWeight: 700, fontSize: 34, color: INK, opacity: Math.min(1, k * 2) * (1 - ci(t, T_END, T_END + 0.35)) }}>
            <span style={{ width: 300 }}>{n}</span><div style={{ width: w, height: 42, borderRadius: 21, background: i === 1 ? OR : "#fff" }} /><span style={{ fontVariantNumeric: "tabular-nums" }}>{Math.round(Number(v) * w / Math.max(1, (Number(v) / 538) * 520))}</span>
          </div>; })}
      </>}

      {/* ---------------- END: everything collapses back into the pill → "Claim your link" ---------------- */}
      {t >= T_END - 0.05 && (() => { const k = sp(t, T_END + 0.15, 11, 220), logo = sp(t, T_END + 0.5, 12, 200), press = t > T_END + 2.2 && t < T_END + 2.45 ? 0.94 : 1;
        return <>
          <div style={{ position: "absolute", left: 540, top: 820, transform: `translate(-50%,-50%) scale(${interpolate(logo, [0, 1], [0.6, 1])})`, opacity: Math.min(1, logo * 2), background: "#fff", borderRadius: 30, padding: "30px 48px", boxShadow: "0 30px 60px -26px rgba(120,40,0,0.5)" }}><Img src={staticFile("lmv/logo.svg")} style={{ width: 520, display: "block" }} /></div>
          <div style={{ position: "absolute", left: 540, top: 1120, transform: `translate(-50%,-50%) scale(${interpolate(k, [0, 1], [0.3, 1]) * press})`, padding: "34px 64px", borderRadius: 999, background: OR, color: "#fff", fontFamily: INTER, fontWeight: 800, fontSize: 58, boxShadow: "0 30px 60px -24px rgba(242,84,27,0.6)", whiteSpace: "nowrap" }}>Claim your link →</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1260, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 40, color: INK, opacity: ci(t, T_END + 0.9, T_END + 1.2) }}>lnkutm.me/<span style={{ color: OR }}>you</span></div>
          {t > T_END + 2.0 && t < T_END + 2.6 && <svg width={60} height={70} viewBox="0 0 24 28" style={{ position: "absolute", left: lerp(900, 600, ci(t, T_END + 1.6, T_END + 2.1)), top: lerp(1500, 1140, ci(t, T_END + 1.6, T_END + 2.1)), filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))" }}><path d="M2 2 L 2 22 L 8 17 L 12 26 L 16 24 L 12 15 L 20 15 Z" fill="#fff" stroke="#111" strokeWidth={1.6} /></svg>}
        </>; })()}
      <Audio src={staticFile("bio4/music.mp3")} />
    </AbsoluteFill>
  );
};
export const Bio4Comp: React.FC = () => <Composition id="BioPagesV4" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={WD} height={HT} />;
