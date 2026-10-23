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

const { fontFamily: CINZEL } = loadCinzel("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: CREEP } = loadCreep("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: INTER } = loadInter("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] });
const FPS = 30, DUR = 58.0, WD = 1080, HT = 1920;
const OR = "#F2541B", PUMP = "#FF8A1F", CREAM = "#F6EFE2", INK = "#17121F", PAPER = "#E9E3D2", ZOMB = "#B9C7A8", GREEN = "#3DBE6E", RED = "#E5383B", MOON = "#F3E7C9";
const EZ = Easing.bezier(0.22, 1, 0.36, 1);
const ci = (t: number, a: number, b: number, x = 0, y = 1, e = EZ) => interpolate(t, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const sp = (t: number, a: number, d = 14, s = 180) => (t < a ? 0 : spring({ frame: (t - a) * FPS, fps: FPS, config: { damping: d, stiffness: s } }));
const rnd = (i: number) => { const v = Math.sin(i * 12.9898) * 43758.5453; return v - Math.floor(v); };
// time of the n-th spoken word that starts with `w`
const T = (w: string, n = 0) => { let k = 0; for (const x of W) if (x[2].toLowerCase().replace(/[^a-z0-9,]/g, "").startsWith(w.toLowerCase())) { if (k === n) return x[0]; k++; } return 0; };
const QRM = (() => { const q = QRCode.create("https://go.yourshop.com/sale", { errorCorrectionLevel: "M" }); const n = q.modules.size; const m: boolean[][] = []; for (let y = 0; y < n; y++) { m.push([]); for (let x = 0; x < n; x++) m[y].push(!!q.modules.get(x, y)); } return m; })();
const QR: React.FC<{ size: number; fg?: string; bg?: string }> = ({ size, fg = INK, bg = "#fff" }) => { const n = QRM.length, c = (size * 0.86) / n, o = size * 0.07; return <svg width={size} height={size}><rect width={size} height={size} rx={size * 0.06} fill={bg} />{QRM.map((r, y) => r.map((on, x) => on ? <rect key={x + "_" + y} x={o + x * c} y={o + y * c} width={c + 0.3} height={c + 0.3} fill={fg} /> : null))}</svg>; };

// ---------- the night world ----------
const Night: React.FC<{ t: number; lit: number }> = ({ t, lit }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #120B20 0%, #24163A 45%, #3A2350 78%, #2A1A3C 100%)` }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 100%, rgba(255,138,31,${0.28 * lit}) 0%, transparent 60%)` }} />
    {/* stars */}
    {Array.from({ length: 40 }).map((_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * WD, top: rnd(i + 9) * 760, width: 3, height: 3, borderRadius: 2, background: "#fff", opacity: 0.25 + 0.5 * Math.abs(Math.sin(t * 1.3 + i)) }} />)}
    {/* moon */}
    <div style={{ position: "absolute", left: 640, top: 170, width: 260, height: 260, borderRadius: 130, background: `radial-gradient(circle at 40% 38%, #FFF8E4 0%, ${MOON} 55%, #D9C9A2 100%)`, boxShadow: "0 0 120px 30px rgba(243,231,201,0.18)" }}>
      {[[60, 70, 28], [150, 140, 20], [90, 170, 14]].map(([x, y, r], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: r * 2, height: r * 2, borderRadius: r, background: "rgba(190,170,130,0.35)" }} />)}
    </div>
    {/* bats */}
    {[0, 1, 2].map((i) => { const p = ((t * 0.06 + i * 0.33) % 1); return <svg key={i} width={70} height={30} viewBox="0 0 70 30" style={{ position: "absolute", left: -80 + p * 1240, top: 260 + i * 90 + Math.sin(t * 2 + i) * 30 }}><path d={`M35 15 Q 25 ${4 + Math.abs(Math.sin(t * 12 + i)) * 10} 2 10 Q 14 16 10 24 Q 22 18 35 22 Q 48 18 60 24 Q 56 16 68 10 Q 45 ${4 + Math.abs(Math.sin(t * 12 + i)) * 10} 35 15 Z`} fill="#0B0712" /></svg>; })}
    {/* hills + trees */}
    <svg width={WD} height={HT} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M0 1080 C 200 980, 420 1020, 620 960 S 960 900, 1080 960 L 1080 1920 L 0 1920 Z" fill="#1A1028" />
      <path d="M0 1200 C 260 1130, 520 1180, 760 1120 S 1000 1100, 1080 1130 L 1080 1920 L 0 1920 Z" fill="#120A1C" />
      <path d="M90 1140 L 96 900 M 96 980 L 40 920 M 96 1010 L 150 950 M 96 940 L 70 880 M 150 950 L 175 930" stroke="#0B0712" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M960 1110 L 966 860 M 966 930 L 900 870 M 966 960 L 1030 900 M 966 900 L 990 840 M 900 870 L 880 850" stroke="#0B0712" strokeWidth="14" strokeLinecap="round" fill="none" />
      {/* fence */}
      {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M${i * 80 + 10} 1215 L ${i * 80 + 10} 1150 L ${i * 80 + 18} 1138 L ${i * 80 + 26} 1150 L ${i * 80 + 26} 1215`} fill="#0D0815" />)}
      <rect x={0} y={1168} width={WD} height={8} fill="#0D0815" />
    </svg>
    {/* drifting fog */}
    {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: -400 + ((t * (12 + i * 8)) % 600), top: 1180 + i * 70, width: 1900, height: 160, borderRadius: 80, background: "radial-gradient(ellipse at center, rgba(210,200,230,0.16) 0%, transparent 70%)" }} />)}
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
const Sign: React.FC<{ text: string; k: number; rot?: number; arrow?: boolean; col?: string }> = ({ text, k, rot = -4, arrow, col = "#7A4B2A" }) => (
  <div style={{ transform: `translateY(${(1 - k) * 200}px) rotate(${rot}deg)`, opacity: Math.min(1, k * 2), display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ padding: "16px 34px", background: col, border: "6px solid #3E2414", borderRadius: 8, fontFamily: CREEP, fontSize: 64, color: "#F6E2C2", letterSpacing: 3, clipPath: arrow ? "polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)" : undefined, paddingRight: arrow ? 80 : 34 }}>{text}</div>
    <div style={{ width: 22, height: 220, background: "#3E2414" }} />
  </div>
);

// ---------- scenes ----------
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const push = ci(t, 0, 8.6, 1.0, 1.12, (x) => x);
  return (
    <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 70%" }}>
      {/* flyers scattered like graves */}
      {[[-260, 1235, -12, 0.55], [300, 1245, 9, 0.55], [-420, 1300, 14, 0.45], [430, 1310, -10, 0.45]].map(([dx, y, r, s], i) => <div key={i} style={{ position: "absolute", left: 540 + dx - 180 * s, top: y - 500 * s, transform: `rotate(${r}deg)`, opacity: ci(t, 0.4 + i * 0.25, 0.9 + i * 0.25) }}><FlyerStone s={s} /></div>)}
      <div style={{ position: "absolute", left: 540 - 180 * 1.15, top: 560, transform: `translateY(${(1 - sp(t, 0.1, 16, 120)) * 500}px)` }}><FlyerStone s={1.15} /></div>
      {t > T("died") && <div style={{ position: "absolute", left: 540 - 250, top: 330, width: 500, padding: "18px 0", borderRadius: "220px 220px 16px 16px", background: "linear-gradient(180deg,#8E8796,#6B6474)", textAlign: "center", fontFamily: CINZEL, fontWeight: 900, color: "#2E2833", transform: `translateY(${(1 - sp(t, T("died"), 14, 160)) * 300}px)`, boxShadow: "0 20px 40px -16px rgba(0,0,0,0.7)" }}><div style={{ fontSize: 40 }}>R.I.P.</div><div style={{ fontSize: 28 }}>/halloween-sale</div><div style={{ fontSize: 24, color: "#3E3746" }}>died 3 months ago</div></div>}
      {t > T("5,000") && <div style={{ position: "absolute", left: 640, top: 1170, padding: "10px 22px", borderRadius: 999, background: OR, color: "#fff", fontFamily: INTER, fontWeight: 800, fontSize: 40, transform: `scale(${sp(t, T("5,000"), 10, 260)}) rotate(6deg)` }}>× 5,000 printed</div>}
    </AbsoluteFill>
  );
};
const Rise: React.FC<{ t: number }> = ({ t }) => {
  const Z: [number, number, string, string][] = [[220, 1440, "print", "printed QR"], [540, 1460, "post", "social post"], [860, 1440, "share", "shared link"]];
  const walk = ci(t, T("walking"), 21.2, 0, 1, (x) => x);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 60, top: 560 }}><Sign text="SALE ENDED" k={sp(t, T("sale"), 12, 200)} rot={-5} col="#6B3B2A" /></div>
      <div style={{ position: "absolute", left: 600, top: 520 }}><Sign text="PAGE MOVED" k={sp(t, T("moves"), 12, 200)} rot={4} arrow /></div>
      {t > T("straight") && <div style={{ position: "absolute", left: 300, top: 300 }}><Sign text="DEAD END" k={sp(t, T("straight"), 11, 220)} rot={-3} col="#8A2A1F" /></div>}
      {Z.map(([x, y, w, label], i) => <Zombie key={i} t={t} i={i} x={x + walk * (i - 1) * -60} y={y} s={1.35} rise={ci(t, T(w), T(w) + 0.8)} walk={t > T("walking") ? 1 : 0.3} label={t < T("sale") ? label : undefined} />)}
    </AbsoluteFill>
  );
};
const Scan: React.FC<{ t: number }> = ({ t }) => {
  const k = sp(t, 21.2, 16, 140), err = t > T("hit");
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 520 }}><FlyerStone s={0.95} /></div>
      <div style={{ position: "absolute", left: 560, top: 330, transform: `translateX(${(1 - k) * 600}px) rotate(${-8 + (t > T("never") ? ci(t, T("never"), T("never") + 0.6, 0, 20) : 0)}deg)`, opacity: 1 - ci(t, T("never") + 0.4, T("never") + 1.0) }}>
        <Phone s={1.05}>
          {!err ? <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 700, fontSize: 30, color: "#888" }}>Opening…</div>
            : <div style={{ position: "absolute", inset: 0, background: "#F2F0EC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: INTER }}><div style={{ fontFamily: CREEP, fontSize: 150, color: "#5E6B52" }}>404</div><div style={{ fontSize: 34, fontWeight: 800, color: INK }}>Page not found</div><div style={{ fontSize: 24, color: "#888", marginTop: 8 }}>/halloween-sale</div></div>}
        </Phone>
      </div>
      {t > T("never") && <div style={{ position: "absolute", left: 640, top: 1180, fontFamily: CREEP, fontSize: 64, color: RED, transform: `scale(${sp(t, T("never"), 10, 260)}) rotate(-6deg)` }}>customer lost</div>}
    </AbsoluteFill>
  );
};
const Cure: React.FC<{ t: number }> = ({ t }) => {
  const plate = sp(t, T("with"), 15, 160);
  return (
    <AbsoluteFill>
      {/* jack-o'-lantern lights up on "cure" */}
      <svg width={420} height={380} viewBox="0 0 420 380" style={{ position: "absolute", left: 330, top: 980, transform: `scale(${0.8 + sp(t, T("cure"), 10, 200) * 0.2})` }}>
        <path d="M200 40 Q 210 10 240 14" stroke="#3C5A2A" strokeWidth="16" fill="none" strokeLinecap="round" />
        {[-120, -60, 0, 60, 120].map((dx, i) => <ellipse key={i} cx={210 + dx * 0.9} cy={210} rx={110 - Math.abs(dx) * 0.25} ry={150} fill={i % 2 ? "#E8701A" : PUMP} stroke="#9A4A10" strokeWidth="5" />)}
        <g fill={t > T("cure") ? "#FFE38A" : "#2A1608"}><path d="M120 170 L 165 120 L 185 180 Z" /><path d="M300 170 L 255 120 L 235 180 Z" /><path d="M110 250 Q 210 330 310 250 L 280 262 L 262 240 L 240 266 L 210 244 L 180 266 L 158 240 L 140 262 Z" /></g>
      </svg>
      {t > T("with") && <div style={{ position: "absolute", left: 540 - 380, top: 470, width: 760, padding: "54px 0", borderRadius: 40, background: CREAM, boxShadow: "0 40px 90px -30px rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", transform: `scale(${0.7 + plate * 0.3})`, opacity: Math.min(1, plate * 2) }}><Img src={staticFile("lmv/logo.svg")} style={{ width: 560 }} /></div>}
    </AbsoluteFill>
  );
};
const DynQR: React.FC<{ t: number }> = ({ t }) => {
  const sw = ci(t, T("printed") - 0.2, T("printed") + 0.5), same = t > T("same");
  const hl = t > T("brand") ? "page" : t > T("same", 1) ? "qr" : same ? "flyer" : undefined;
  return (
    <AbsoluteFill>
      {!same ? (
        <div style={{ position: "absolute", left: 70, top: 380, transform: `translateY(${(1 - sp(t, 31.8, 16, 140)) * 1000}px)` }}>
          <LinkCard title="Dynamic QR">
            <div style={{ display: "flex", gap: 34, alignItems: "center" }}>
              <QR size={300} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 28, color: "#A79FB2", fontWeight: 700 }}>Goes to</div>
                <div style={{ position: "relative", height: 150, marginTop: 10, overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${-sw * 160}px)`, opacity: 1 - sw }}><div style={{ fontSize: 36, fontWeight: 700 }}>/halloween-sale</div><div style={{ display: "inline-block", marginTop: 10, padding: "6px 14px", borderRadius: 10, background: "rgba(229,56,59,0.2)", color: "#FF8A8A", fontWeight: 800, fontSize: 26 }}>404 · dead</div></div>
                  <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${(1 - sw) * 160}px)` }}><div style={{ fontSize: 36, fontWeight: 700, color: PUMP }}>/winter-collection</div><div style={{ display: "inline-block", marginTop: 10, padding: "6px 14px", borderRadius: 10, background: "rgba(61,190,110,0.2)", color: "#7CE3A2", fontWeight: 800, fontSize: 26 }}>✓ live</div></div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 26, fontSize: 28, color: "#A79FB2", fontWeight: 600, opacity: ci(t, T("change"), T("change") + 0.4) }}>Change where it goes, any time.</div>
          </LinkCard>
        </div>
      ) : (
        <>
          <div style={{ position: "absolute", left: 70, top: 470, transform: `scale(${1 + (hl === "flyer" ? 0.04 : 0)})` }}><FlyerStone s={1.0} hl={hl} /></div>
          <div style={{ position: "absolute", left: 600, top: 340, transform: `translateX(${(1 - sp(t, T("same"), 16, 160)) * 600}px) rotate(4deg)`, outline: hl === "page" ? `8px solid ${OR}` : undefined, borderRadius: 64 }}>
            <Phone s={1.0}><div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#E9F1F8,#FFFFFF)", fontFamily: INTER, padding: 30, boxSizing: "border-box" }}><div style={{ height: 300, borderRadius: 24, background: "linear-gradient(135deg,#9CC3E6,#D8E8F5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 90 }}>❄️</div><div style={{ fontSize: 40, fontWeight: 800, color: INK, marginTop: 24 }}>Winter collection</div><div style={{ fontSize: 26, color: "#667", marginTop: 8 }}>New arrivals · shop now</div><div style={{ marginTop: 26, height: 70, borderRadius: 18, background: INK, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 28 }}>Shop</div></div></Phone>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
const Repoint: React.FC<{ t: number }> = ({ t }) => {
  const p = ci(t, T("point") + 0.2, T("point") + 1.1, 0, 1, Easing.inOut(Easing.cubic));
  const ang = interpolate(p, [0, 1], [-28, 28]);
  return (
    <AbsoluteFill style={{ fontFamily: INTER }}>
      <div style={{ position: "absolute", left: 540 - 430, top: 330, width: 860, padding: "34px 0", borderRadius: 999, background: "#1E1729", border: `5px solid ${OR}`, textAlign: "center", color: CREAM, fontWeight: 800, fontSize: 54, transform: `scale(${sp(t, 40.8, 14, 180)})` }}>go.yourshop.com/<span style={{ color: PUMP }}>sale</span></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", color: "#A79FB2", fontWeight: 700, fontSize: 30, opacity: ci(t, T("without"), T("without") + 0.4) }}>✓ same link, never changes</div>
      <div style={{ position: "absolute", left: 540 - 6, top: 540, width: 12, height: 360, background: PUMP, borderRadius: 6, transformOrigin: "50% 0", transform: `rotate(${ang}deg)` }} />
      <div style={{ position: "absolute", left: 60, top: 920, width: 420, padding: "26px 0", borderRadius: 26, background: "#2A2234", textAlign: "center", color: "#8E8496", fontWeight: 700, fontSize: 34, textDecoration: p > 0.5 ? "line-through" : "none", opacity: 1 - p * 0.55 }}>old page 👻</div>
      <div style={{ position: "absolute", left: 600, top: 920, width: 420, padding: "26px 0", borderRadius: 26, background: p > 0.5 ? "rgba(61,190,110,0.25)" : "#2A2234", border: `4px solid ${p > 0.5 ? GREEN : "transparent"}`, textAlign: "center", color: CREAM, fontWeight: 800, fontSize: 34 }}>new page ✓</div>
    </AbsoluteFill>
  );
};
const Live: React.FC<{ t: number }> = ({ t }) => {
  const g = ci(t, 46.0, 50.4, 0, 1, (x) => x);
  const alive = ci(t, T("alive"), T("alive") + 0.4);
  return (
    <AbsoluteFill style={{ fontFamily: INTER }}>
      <div style={{ position: "absolute", left: 70, top: 300, transform: `translateY(${(1 - sp(t, 45.9, 16, 160)) * 900}px)` }}>
        <LinkCard title="Live">
          <div style={{ display: "flex", gap: 24 }}>{[["Scans", 1284], ["Clicks", 3912]].map(([l, v]) => <div key={l as string} style={{ flex: 1, padding: "20px 24px", borderRadius: 22, background: "#2A2234" }}><div style={{ fontSize: 28, color: "#A79FB2", fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 14, height: 14, borderRadius: 7, background: RED, opacity: Math.sin(t * 7) > 0 ? 1 : 0.3 }} />{l as string}</div><div style={{ fontSize: 76, fontWeight: 800, color: CREAM }}>{Math.round((v as number) * g).toLocaleString("en-US")}</div></div>)}</div>
          <svg width={872} height={170} style={{ marginTop: 22 }}><polyline points={Array.from({ length: 40 }).filter((_, i) => i / 39 <= g).map((_, i) => `${i * 22},${150 - (i * 2.6 + Math.sin(i * 1.3) * 14 + rnd(i) * 18)}`).join(" ")} fill="none" stroke={PUMP} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" /></svg>
          <div style={{ fontSize: 22, color: "#7E7488", marginTop: 6 }}>example data</div>
        </LinkCard>
      </div>
      {[200, 540, 880].map((x, i) => <Zombie key={i} t={t} i={i} x={x} y={1460} s={1.0} alive={alive} />)}
    </AbsoluteFill>
  );
};
const Finale: React.FC<{ t: number }> = ({ t }) => {
  const walk = ci(t, 50.7, 54.6, 0, 1, (x) => x), end = sp(t, 55.3, 16, 150);
  return (
    <AbsoluteFill>
      {/* the shop */}
      <div style={{ position: "absolute", left: 540 - 300, top: 760, width: 600, height: 700, background: "#3B2A3E", border: "8px solid #22182A", borderRadius: "16px 16px 0 0", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7)" }}>
        <div style={{ position: "absolute", left: -40, right: -40, top: -90, height: 110, background: "#22182A", clipPath: "polygon(8% 100%, 50% 0, 92% 100%)" }} />
        {[[60, 80], [380, 80]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 160, height: 150, borderRadius: 10, background: "#FFC56E", boxShadow: "inset 0 0 0 8px #22182A" }} />)}
        <div style={{ position: "absolute", left: 210, top: 330, width: 180, height: 362, borderRadius: "90px 90px 0 0", background: "#FFB04A", boxShadow: "inset 0 0 0 8px #22182A" }} />
        <div style={{ position: "absolute", left: 160, top: 270, padding: "6px 22px", background: "#22182A", color: "#FFC56E", fontFamily: CREEP, fontSize: 44, transform: `scale(${sp(t, T("dead"), 10, 240)})` }}>OPEN</div>
      </div>
      {[0, 1, 2].map((i) => <Zombie key={i} t={t} i={i} x={interpolate(walk, [0, 1], [140 + i * 140, 540 + (i - 1) * 40])} y={interpolate(walk, [0, 1], [1460, 1430])} s={interpolate(walk, [0, 1], [0.75, 0.38]) * (1 - ci(t, 54.4, 54.9))} alive={1} walk={1} />)}
      {/* end card: real logo, untouched, on a light plate with clear space */}
      {t > 55.3 && <AbsoluteFill style={{ background: `rgba(18,11,32,${0.75 * end})` }}>
        <div style={{ position: "absolute", left: 540 - 420, top: 620, width: 840, padding: "70px 0 56px", borderRadius: 44, background: CREAM, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, transform: `scale(${0.8 + end * 0.2})`, opacity: Math.min(1, end * 2) }}>
          <Img src={staticFile("lmv/logo.svg")} style={{ width: 600 }} />
          <div style={{ fontFamily: CREEP, fontSize: 64, color: OR, letterSpacing: 3 }}>Happy Halloween</div>
          <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 34, color: "#6E6577" }}>linkutm.com</div>
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

// ---------- master ----------
const SC: { a: number; b: number; C: React.FC<{ t: number }> }[] = [
  { a: 0, b: 8.65, C: Hook }, { a: 8.6, b: 21.25, C: Rise }, { a: 21.2, b: 25.4, C: Scan }, { a: 25.35, b: 31.95, C: Cure },
  { a: 31.9, b: 40.85, C: DynQR }, { a: 40.8, b: 45.95, C: Repoint }, { a: 45.9, b: 50.65, C: Live }, { a: 50.6, b: DUR, C: Finale },
];
const Film: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const lit = ci(t, T("cure"), T("cure") + 1.2);
  const flash = t > 25.75 && t < 26.1 ? 1 - Math.abs(t - 25.85) / 0.25 : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#120B20" }}>
      <Night t={t} lit={lit} />
      <Ground />
      {SC.map((s, i) => {
        if (t < s.a || t >= s.b) return null;
        const k = i === 0 ? 1 : ci(t, s.a, s.a + 0.4, 0, 1, Easing.out(Easing.cubic)), o = ci(t, s.b - 0.12, s.b);
        return <AbsoluteFill key={i} style={{ opacity: 1 - o, transform: `translateY(${(1 - k) * 160}px)` }}><s.C t={t} /></AbsoluteFill>;
      })}
      {flash > 0 && <AbsoluteFill style={{ background: "#E8E4FF", opacity: flash * 0.75 }} />}
      <Tomb t={t} />
      <Audio src={staticFile("undead/vo.wav")} />
    </AbsoluteFill>
  );
};
export const UndeadComp: React.FC = () => <Composition id="UndeadLinks" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={WD} height={HT} />;
