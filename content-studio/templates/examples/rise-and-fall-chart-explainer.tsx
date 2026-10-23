// "ACoS: the $82 million lesson" (16:9, 30 fps, Leda VO, RISE-AND-FALL CHART theme, NEWSPAPER-HEADLINE captions).
// Real case: Pets.com. Sources: Amazon press release 29 Mar 1999 (~50% stake); Pets.com S-1 (Feb–Sep 1999: net sales $619K,
// advertising expense $7.634M, negative gross margin −$1.223M); 1999 Macy's parade balloon; Super Bowl XXXIV ad (Jan 2000);
// IPO Feb 2000 (~$82.5M raised); shutdown announced Nov 2000 (~268 days after IPO).
// Generic sock puppet drawn for the story (not the trademarked mascot artwork).
import { AbsoluteFill, Audio, Composition, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import React from "react";
import { loadFont as loadPlay } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadOld } from "@remotion/google-fonts/OldStandardTT";
import { loadFont as loadFrak } from "@remotion/google-fonts/UnifrakturMaguntia";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { W } from "./words";
import { HOOK_END, WARP } from "./warp";

const { fontFamily: PLAY } = loadPlay("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: OLD } = loadOld("normal", { weights: ["400", "700"], subsets: ["latin"] });
const { fontFamily: FRAK } = loadFrak("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: INTER } = loadInter("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });
const FPS = 30, DUR = 151.6, WD = 1920, HT = 1080;
const SHIFT = 1.42; // everything after the re-voiced plug moved later by this much
const INK = "#1E1B16", PAPER = "#F3EEE3", PAPER2 = "#FBF8F1", GRID = "rgba(60,50,30,0.09)", GREEN = "#1F8A4C", RED = "#C8322B", MUTE = "#7A7263", OR = "#F2541B";
const EZ = Easing.bezier(0.22, 1, 0.36, 1);
const ci = (t: number, a: number, b: number, x = 0, y = 1, e = EZ) => interpolate(t, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const sp = (t: number, a: number, d = 13, s = 190) => (t < a ? 0 : spring({ frame: (t - a) * FPS, fps: FPS, config: { damping: d, stiffness: s } }));

// ---------- shared art ----------
const Puppet: React.FC<{ s?: number; t: number; talk?: boolean }> = ({ s = 1, t, talk }) => {
  const m = talk ? Math.abs(Math.sin(t * 9)) * 10 : 2;
  return (
    <svg width={200 * s} height={260 * s} viewBox="0 0 200 260" style={{ overflow: "visible" }}>
      <path d="M 40 250 L 46 120 C 46 50, 160 30, 170 100 C 176 140, 168 170, 150 182 L 156 250 Z" fill="#F4F1EA" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M 46 214 L 156 214 M 45 230 L 156 230" stroke="#C8322B" strokeWidth="6" />
      <path d={`M 98 ${150 - m} Q 140 ${148 - m} 168 ${138 - m}`} fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d={`M 98 ${152 + m} Q 140 ${156 + m} 166 ${146 + m}`} fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      {[[104, 92], [136, 84]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="17" fill="#fff" stroke={INK} strokeWidth="4" /><circle cx={x + 4 + Math.sin(t * 2) * 3} cy={y + 3} r="8" fill={INK} /></g>)}
      <circle cx="168" cy="122" r="9" fill={INK} />
    </svg>
  );
};
const Clip: React.FC<{ head: string; kicker?: string; w?: number; rot?: number; children?: React.ReactNode; k: number; style?: React.CSSProperties }> = ({ head, kicker, w = 520, rot = -2, children, k, style }) => (
  <div style={{ position: "absolute", width: w, background: PAPER2, padding: "18px 22px 22px", boxShadow: "0 22px 40px -18px rgba(40,30,10,0.45)", transform: `rotate(${rot}deg) scale(${0.6 + k * 0.4})`, opacity: Math.min(1, k * 2), clipPath: "polygon(0 2%, 4% 0, 9% 1.5%, 15% 0, 22% 1.2%, 30% 0, 38% 1.6%, 47% 0, 55% 1.3%, 63% 0, 72% 1.8%, 80% 0, 88% 1.4%, 95% 0, 100% 1.5%, 100% 98%, 96% 100%, 89% 98.5%, 81% 100%, 73% 98.3%, 64% 100%, 56% 98.6%, 47% 100%, 39% 98.4%, 30% 100%, 22% 98.7%, 14% 100%, 7% 98.4%, 0 100%)", ...style }}>
    {kicker && <div style={{ fontFamily: OLD, fontSize: 17, letterSpacing: 2, color: MUTE, textTransform: "uppercase", borderBottom: `2px solid ${INK}`, paddingBottom: 6, marginBottom: 10 }}>{kicker}</div>}
    <div style={{ fontFamily: PLAY, fontWeight: 900, fontSize: 40, lineHeight: 1.08, color: INK }}>{head}</div>
    {children}
  </div>
);
const Stamp: React.FC<{ text: string; t: number; a: number; col?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ text, t, a, col = RED, size = 70, rot = -8, style }) => {
  if (t < a) return null;
  const k = sp(t, a, 10, 320);
  return <div style={{ position: "absolute", fontFamily: OLD, fontWeight: 700, fontSize: size, color: col, border: `${size * 0.09}px solid ${col}`, borderRadius: 10, padding: `${size * 0.05}px ${size * 0.3}px`, letterSpacing: 2, transform: `rotate(${rot}deg) scale(${interpolate(k, [0, 1], [2.2, 1])})`, opacity: Math.min(1, k * 3), background: "rgba(251,248,241,0.85)", whiteSpace: "nowrap", ...style }}>{text}</div>;
};
const Paper: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #F7F3EA 0%, ${PAPER} 60%, #E8E1D2 100%)` }}>
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(${GRID} 1px, transparent 1px), linear-gradient(90deg, ${GRID} 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(60,50,30,0.05) 1px, transparent 1px)", backgroundSize: "5px 5px" }} />
  </AbsoluteFill>
);
const H: React.CSSProperties = { fontFamily: PLAY, fontWeight: 900, color: INK, lineHeight: 1.05 };

// ---------- PART 1: the rise-and-fall chart world (0–34.6) ----------
// line points: [time, x, y] in world px (y down)
const PTS: [number, number, number][] = [[0.0, 0, 1650], [0.4, 120, 1620], [4.2, 900, 1420], [6.2, 1420, 1330], [9.2, 2180, 1120], [12.5, 2980, 930], [14.06, 3500, 760], [16.4, 3980, 560], [19.0, 4520, 430], [22.1, 5080, 330], [24.9, 5300, 300], [25.6, 5420, 900], [26.4, 5520, 1500], [27.2, 5600, 1880]];
const head = (t: number): [number, number] => {
  if (t <= PTS[0][0]) return [PTS[0][1], PTS[0][2]];
  for (let i = 1; i < PTS.length; i++) if (t <= PTS[i][0]) { const [a, x0, y0] = PTS[i - 1], [b, x1, y1] = PTS[i]; const u = (t - a) / (b - a); const e = i >= 11 ? u * u : u; return [x0 + (x1 - x0) * e, y0 + (y1 - y0) * e]; }
  const l = PTS[PTS.length - 1]; return [l[1], l[2]];
};
const pathUntil = (t: number) => { const pts: [number, number][] = PTS.filter((p) => p[0] < t).map((p) => [p[1], p[2]]); pts.push(head(t)); return pts; };
const CLIPS: { a: number; x: number; y: number; rot: number; node: (t: number, k: number) => React.ReactNode }[] = [
  { a: 4.15, x: 700, y: 980, rot: -3, node: (t, k) => <Clip k={k} kicker="Business · March 1999" head="Amazon buys about half of a pet-supply startup" w={500}><svg width={160} height={110} viewBox="0 0 160 110" style={{ marginTop: 12 }}><path d="M 20 40 L 80 20 L 140 40 L 140 100 L 80 108 L 20 100 Z" fill="#D8B98A" stroke={INK} strokeWidth="4" strokeLinejoin="round" /><path d="M 20 40 L 80 58 L 140 40 M 80 58 L 80 108" fill="none" stroke={INK} strokeWidth="4" /></svg></Clip> },
  { a: 6.1, x: 1260, y: 760, rot: 2, node: (t, k) => <Clip k={k} kicker="Advertising" head="Meet the mascot: a talking sock puppet" w={440}><div style={{ marginTop: 6, marginLeft: 120 }}><Puppet s={0.8} t={t} talk={t > 6.2 && t < 9.1} /></div></Clip> },
  { a: 9.1, x: 1900, y: 380, rot: -1, node: (t, k) => (
    <div style={{ opacity: Math.min(1, k * 2), transform: `translateY(${(1 - k) * 200 + Math.sin(t * 1.5) * 10}px)` }}>
      <div style={{ position: "relative", width: 420, height: 560 }}>
        <div style={{ position: "absolute", left: 60, top: 0, transform: "scale(1.5)", transformOrigin: "0 0" }}><Puppet s={1} t={t} /></div>
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 120 + i * 50, top: 380, width: 2, height: 180, background: INK, transform: `rotate(${(i - 1) * 8}deg)` }} />)}
      </div>
      <Clip k={1} kicker="Thanksgiving · 1999" head="Its own giant parade balloon" w={420} rot={2} style={{ position: "relative" }} />
    </div>) },
  { a: 12.4, x: 2820, y: 280, rot: 2, node: (t, k) => <Clip k={k} kicker="Super Bowl · January 2000" head="…and its own Super Bowl ad" w={460}><div style={{ marginTop: 12, width: 300, height: 200, borderRadius: 26, background: "#3A3530", padding: 16, boxSizing: "border-box" }}><div style={{ width: "100%", height: "100%", borderRadius: 14, background: "linear-gradient(180deg,#5FAF5A,#3E8A3B)", position: "relative", overflow: "hidden" }}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 20 + i * 50, top: 0, bottom: 0, width: 3, background: "rgba(255,255,255,0.7)" }} />)}<div style={{ position: "absolute", left: 80, top: 10, transform: "scale(0.55)", transformOrigin: "0 0" }}><Puppet t={t} talk /></div></div></div></Clip> },
  { a: 14.0, x: 3560, y: 980, rot: -2, node: (t, k) => <Clip k={k} kicker="Markets · February 2000" head="Goes public. Raises $82.5 million." w={480}><div style={{ marginTop: 12, display: "flex", gap: 16, alignItems: "center", fontFamily: INTER, fontWeight: 800, fontSize: 34, background: "#14120F", color: "#5BE37D", padding: "10px 16px", borderRadius: 8, width: "fit-content" }}>IPET <span style={{ fontSize: 26 }}>▲ ${(11 + ci(t, 14.5, 17, 0, 3)).toFixed(2)}</span></div></Clip> },
  { a: 18.95, x: 3560, y: -230, rot: 0, node: (t) => (
    <div style={{ position: "relative", width: 900, height: 360 }}>
      {["THE NEXT BIG THING", "The future of shopping", "Investors can't get enough", "Dot-com darling"].map((h, i) => { const k = sp(t, 18.95 + i * 0.35, 12, 240); return <div key={h} style={{ position: "absolute", left: [0, 420, 60, 470][i], top: [0, 40, 200, 230][i], transform: `rotate(${[-4, 3, 2, -3][i]}deg) scale(${0.6 + k * 0.4})`, opacity: Math.min(1, k * 2) }}><Clip k={1} head={h} w={i ? 380 : 470} rot={0} style={{ position: "relative" }} /></div>; })}
    </div>) },
];
const ChartWorld: React.FC<{ t: number }> = ({ t }) => {
  const [hx, hy] = head(Math.min(t, 27.2));
  const out = ci(t, 30.2, 32.2, 0, 1, Easing.inOut(Easing.cubic));
  const s = interpolate(out, [0, 1], [1, 0.27]) * (1 + ci(t, 22.0, 24.6) * 0.15 * (1 - out));
  const cx = interpolate(out, [0, 1], [hx - 260, 2900]), cy = interpolate(out, [0, 1], [hy - 120, 520]);
  const shake = t > 25.3 && t < 27.6 ? (1 - (t - 25.3) / 2.3) * 18 : 0;
  const pts = pathUntil(Math.min(t, 27.2));
  const peakI = pts.findIndex((p) => p[0] >= 5300);
  const up = peakI < 0 ? pts : pts.slice(0, peakI + 1), down = peakI < 0 ? [] : pts.slice(peakI);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 6200, height: 2200, transformOrigin: "0 0", transform: `translate(${960 - cx * s + Math.sin(t * 70) * shake}px, ${520 - cy * s + Math.cos(t * 60) * shake}px) scale(${s})` }}>
        <svg width={6200} height={2200} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={0} y1={200 + i * 150} x2={6000} y2={200 + i * 150} stroke={GRID} strokeWidth="3" />)}
          {["1999", "", "", "", "", "2000", "", "", ""].map((l, i) => l && <text key={i} x={i * 600 + 20} y={1960} fontFamily="Old Standard TT" fontSize="48" fill={MUTE}>{l}</text>)}
          <line x1={0} y1={1900} x2={6000} y2={1900} stroke={INK} strokeWidth="5" />
          <polygon points={`${up.map((p) => p.join(",")).join(" ")} ${up[up.length - 1][0]},1900 0,1900`} fill="rgba(31,138,76,0.12)" />
          <polyline points={up.map((p) => p.join(",")).join(" ")} fill="none" stroke={GREEN} strokeWidth="14" strokeLinejoin="round" strokeLinecap="round" />
          {down.length > 1 && <polyline points={down.map((p) => p.join(",")).join(" ")} fill="none" stroke={RED} strokeWidth="16" strokeLinejoin="round" strokeLinecap="round" />}
          <circle cx={hx} cy={hy} r={22} fill={t > 24.9 ? RED : GREEN} stroke="#fff" strokeWidth="6" />
          <circle cx={hx} cy={hy} r={22 + ((t * 1.6) % 1) * 40} fill="none" stroke={t > 24.9 ? RED : GREEN} strokeWidth="4" opacity={1 - ((t * 1.6) % 1)} />
        </svg>
        {CLIPS.map((c, i) => { if (t < c.a) return null; const k = sp(t, c.a, 12, 180); return <div key={i} style={{ position: "absolute", left: c.x, top: c.y, transform: `rotate(${c.rot}deg)`, opacity: i === 5 ? 1 - ci(t, 30.0, 30.6) : 1 }}>{c.node(t, k)}</div>; })}
        {/* the name */}
        {t > 22.0 && <div style={{ position: "absolute", left: 4700, top: -40, ...H, fontSize: 190, letterSpacing: -4, transform: `scale(${sp(t, 22.05, 11, 200)})`, transformOrigin: "50% 100%", textShadow: "6px 6px 0 rgba(31,138,76,0.25)" }}>Pets.com</div>}
        <Stamp text="SHUT DOWN · NOV 2000" t={t} a={27.1} size={100} style={{ left: 4620, top: 1420 }} />
        {t > 28.0 && <div style={{ position: "absolute", left: 4700, top: 1640, fontFamily: OLD, fontWeight: 700, fontSize: 64, color: INK, opacity: ci(t, 28.0, 28.4) }}>Hundreds of jobs lost.</div>}
        {t > 24.9 && <div style={{ position: "absolute", left: 5500, top: 700, fontFamily: OLD, fontWeight: 700, fontSize: 70, color: RED, opacity: ci(t, 24.95, 25.3) }}>9 months later…</div>}
      </div>
      {/* the question */}
      {t > 30.4 && <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center", opacity: ci(t, 30.4, 30.8) * (1 - ci(t, 34.3, 34.6)) }}><div style={{ ...H, fontSize: 96 }}>What went wrong?</div><div style={{ fontFamily: OLD, fontSize: 44, color: MUTE, marginTop: 10, opacity: ci(t, 32.2, 32.6) }}>It comes down to one number.</div></div>}
    </AbsoluteFill>
  );
};

// ---------- PART 2: the explainer ----------
const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => <div style={{ position: "absolute", background: PAPER2, boxShadow: "0 30px 60px -28px rgba(40,30,10,0.45), 0 0 0 1px rgba(40,30,10,0.08)", borderRadius: 6, ...style }}>{children}</div>;
const Kicker: React.FC<{ text: string }> = ({ text }) => <div style={{ fontFamily: OLD, fontSize: 22, letterSpacing: 3, color: MUTE, textTransform: "uppercase", borderBottom: `3px double ${INK}`, paddingBottom: 8, marginBottom: 18 }}>{text}</div>;
const money = (v: number) => (v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${Math.round(v / 1000)}K`);

const Bars: React.FC<{ t: number }> = ({ t }) => {
  const g1 = ci(t, 36.0, 38.6, 0, 1, Easing.out(Easing.cubic)), g2 = ci(t, 40.2, 41.4, 0, 1, Easing.out(Easing.cubic));
  const ratio = t > 43.9;
  return (
    <AbsoluteFill>
      <Panel style={{ left: 200, top: 70, width: 1520, height: 740, padding: "34px 48px", boxSizing: "border-box" }}>
        <Kicker text="Pets.com · first 7 months · Feb–Sep 1999" />
        {!ratio && <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 220, height: 520 }}>
          {([["Spent on ads", 7.634e6, RED, g1], ["Sales", 0.619e6, GREEN, g2]] as [string, number, string, number][]).map(([l, v, c, g]) => (
            <div key={l} style={{ width: 300, textAlign: "center" }}>
              <div style={{ ...H, fontSize: 64, color: c, opacity: g > 0.05 ? 1 : 0 }}>{money(v * g)}</div>
              <div style={{ height: 400 * (v / 7.634e6) * g + 4, background: c, marginTop: 10 }} />
              <div style={{ fontFamily: OLD, fontWeight: 700, fontSize: 34, marginTop: 14, color: INK }}>{l}</div>
            </div>))}
        </div>}
        {ratio && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 60, height: 520 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 150px)", gap: 14 }}>{Array.from({ length: 12 }).map((_, i) => { const k = sp(t, 44.1 + i * 0.07, 12, 260); return <div key={i} style={{ height: 76, borderRadius: 8, background: "#F6D9D5", border: `3px solid ${RED}`, display: "flex", alignItems: "center", justifyContent: "center", ...H, fontSize: 36, color: RED, transform: `scale(${k})` }}>$1 ad</div>; })}</div>
          <div style={{ ...H, fontSize: 90 }}>→</div>
          <div style={{ width: 200, height: 110, borderRadius: 10, background: "#D7EEDD", border: `4px solid ${GREEN}`, display: "flex", alignItems: "center", justifyContent: "center", ...H, fontSize: 44, color: GREEN, transform: `scale(${sp(t, 45.9, 11, 240)})` }}>$1 sale</div>
        </div>}
      </Panel>
    </AbsoluteFill>
  );
};
const Name: React.FC<{ t: number }> = ({ t }) => {
  const f = t > 53.3;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: f ? 110 : 240, textAlign: "center", transform: `scale(${sp(t, 49.3, 10, 220) * (f ? 0.62 : 1)})`, transformOrigin: "50% 0" }}>
        <div style={{ ...H, fontSize: 300, letterSpacing: -6 }}>ACoS</div>
        <div style={{ fontFamily: OLD, fontWeight: 700, fontSize: 64, marginTop: -10, opacity: ci(t, 50.8, 51.2) }}>{["Advertising", "Cost", "of", "Sales"].map((w, i) => <span key={w} style={{ marginRight: 22 }}><span style={{ color: RED, fontSize: 80 }}>{w[0]}</span>{w.slice(1)}</span>)}</div>
      </div>
      {f && <Panel style={{ left: 310, top: 520, width: 1300, padding: "34px 40px", boxSizing: "border-box", transform: `translateY(${(1 - sp(t, 53.4, 14, 200)) * 300}px)` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 30, ...H, fontSize: 70 }}>
          <span>ACoS</span><span>=</span>
          <div style={{ textAlign: "center" }}><div style={{ color: RED, opacity: ci(t, 54.2, 54.6) }}>Ad spend</div><div style={{ height: 6, background: INK, margin: "8px 0" }} /><div style={{ color: GREEN, opacity: ci(t, 55.6, 56.0) }}>Sales from ads</div></div>
          <span style={{ fontSize: 56, color: MUTE }}>× 100%</span>
        </div>
      </Panel>}
    </AbsoluteFill>
  );
};
const Calc: React.FC<{ t: number }> = ({ t }) => {
  const pets = t > 63.2;
  const needle = pets ? interpolate(sp(t, 64.6, 9, 120), [0, 1], [0, 1.25]) : ci(t, 60.9, 61.8) * 0.2;
  const Row: React.FC<{ a: string; b: string; r: string; a0: number; col: string }> = ({ a, b, r, a0, col }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 26, ...H, fontSize: 84 }}>
      <span style={{ color: RED, opacity: ci(t, a0, a0 + 0.3) }}>{a}</span><span style={{ opacity: ci(t, a0 + 0.6, a0 + 0.9) }}>÷</span><span style={{ color: GREEN, opacity: ci(t, a0 + 1.4, a0 + 1.7) }}>{b}</span><span style={{ opacity: ci(t, a0 + 2.6, a0 + 2.9) }}>=</span>
      <span style={{ color: col, opacity: ci(t, a0 + 3.2, a0 + 3.5), transform: `scale(${1 + 0.2 * (1 - ci(t, a0 + 3.2, a0 + 3.7))})`, display: "inline-block" }}>{r}</span>
    </div>);
  return (
    <AbsoluteFill>
      <Panel style={{ left: 260, top: 70, width: 1400, height: 760, padding: "34px 48px", boxSizing: "border-box" }}>
        <Kicker text={pets ? "Pets.com, 1999" : "Example"} />
        {!pets ? <Row a="$20 ads" b="$100 sales" r="20%" a0={57.4} col={GREEN} /> : <Row a="$7.6M" b="$0.6M" r="1,233%" a0={63.0} col={RED} />}
        {/* gauge */}
        <div style={{ position: "relative", margin: "70px auto 0", width: 1100, height: 70 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 35, background: "linear-gradient(90deg, #BFE3C9 0%, #F3E2B3 50%, #F2C3BD 100%)", border: `4px solid ${INK}` }} />
          {[0, 25, 50, 75, 100].map((v) => <div key={v} style={{ position: "absolute", left: `${v}%`, top: 84, transform: "translateX(-50%)", fontFamily: OLD, fontSize: 30, color: MUTE }}>{v}%</div>)}
          <div style={{ position: "absolute", left: `${Math.min(needle, 1.12) * 100}%`, top: -40, width: 8, height: 150, background: needle > 1 ? RED : INK, borderRadius: 4, transform: `translateX(-50%) rotate(${needle > 1 ? 25 : 0}deg)` }} />
          {needle > 1 && <Stamp text="OFF THE CHART" t={t} a={65.0} size={64} style={{ left: 640, top: 130 }} />}
        </div>
      </Panel>
    </AbsoluteFill>
  );
};
const Worse: React.FC<{ t: number }> = ({ t }) => {
  const g = ci(t, 68.6, 70.4, 0, 1, Easing.out(Easing.cubic));
  const sales = Math.max(0, Math.floor((t - 72.1) * 3));
  return (
    <AbsoluteFill>
      <Panel style={{ left: 200, top: 70, width: 1520, height: 760, padding: "34px 48px", boxSizing: "border-box" }}>
        <Kicker text="And it was worse · on average, per sale" />
        <div style={{ display: "flex", gap: 120, alignItems: "flex-end", justifyContent: "center", height: 420 }}>
          {([["What customers paid", 0.55, GREEN], ["What it cost Pets.com", 1, RED]] as [string, number, string][]).map(([l, v, c], i) => (
            <div key={l} style={{ width: 360, textAlign: "center" }}>
              <div style={{ height: 340 * v * ci(t, 68.6 + i * 0.6, 70 + i * 0.6, 0, 1, Easing.out(Easing.cubic)), background: c, borderRadius: "8px 8px 0 0" }} />
              <div style={{ fontFamily: OLD, fontWeight: 700, fontSize: 32, marginTop: 14 }}>{l}</div>
            </div>))}
          <div style={{ alignSelf: "center", ...H, fontSize: 64, color: RED, opacity: g }}>loss on<br />every sale</div>
        </div>
        {t > 72.0 && <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 30, justifyContent: "center" }}>
          {Array.from({ length: Math.min(9, sales) }).map((_, i) => <div key={i} style={{ padding: "8px 16px", borderRadius: 8, background: "#F6D9D5", border: `3px solid ${RED}`, ...H, fontSize: 30, color: RED, transform: `scale(${sp(t, 72.1 + i / 3, 12, 300)})` }}>−$</div>)}
        </div>}
      </Panel>
    </AbsoluteFill>
  );
};
const Rule: React.FC<{ t: number }> = ({ t }) => {
  const pets = t > 86.9;
  const margin = pets ? interpolate(ci(t, 87.0, 88.2), [0, 1], [0.3, -0.12]) : 0.3;
  const needle = pets ? 0.12 : ci(t, 83.1, 84.0) * 0.2;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", ...H, fontSize: 76, transform: `scale(${sp(t, 76.4, 12, 220)})` }}>Break-even ACoS <span style={{ color: MUTE }}>=</span> your profit margin</div>
      <Panel style={{ left: 260, top: 230, width: 1400, height: 600, padding: "30px 48px", boxSizing: "border-box", opacity: ci(t, 80.0, 80.4) }}>
        <Kicker text={pets ? "Pets.com" : "Example · a $100 sale"} />
        <div style={{ position: "relative", height: 90, display: "flex", border: `4px solid ${INK}`, borderRadius: 8, overflow: "visible" }}>
          <div style={{ width: `${(1 - Math.max(0, margin)) * 100}%`, background: "#D9D2C4", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: OLD, fontWeight: 700, fontSize: 30 }}>cost of the product</div>
          {margin > 0 && <div style={{ width: `${margin * 100}%`, background: "#BFE3C9", display: "flex", alignItems: "center", justifyContent: "center", ...H, fontSize: 34, color: GREEN }}>${Math.round(margin * 100)} profit</div>}
          {margin < 0 && <div style={{ position: "absolute", right: -4, top: 96, width: `${-margin * 100 * 3}%`, height: 60, background: "#F2C3BD", border: `4px solid ${RED}`, display: "flex", alignItems: "center", justifyContent: "center", ...H, fontSize: 30, color: RED }}>below zero</div>}
        </div>
        <div style={{ position: "relative", marginTop: 120, height: 64 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 32, background: "#F2C3BD", border: `4px solid ${INK}`, overflow: "hidden" }}><div style={{ width: `${Math.max(0, margin) * 100}%`, height: "100%", background: "#9ED3AE" }} /></div>
          {margin > 0 && <div style={{ position: "absolute", left: `${margin * 100}%`, top: -54, transform: "translateX(-50%)", fontFamily: OLD, fontWeight: 700, fontSize: 28, color: GREEN, whiteSpace: "nowrap" }}>break-even {Math.round(margin * 100)}%</div>}
          <div style={{ position: "absolute", left: `${needle * 100}%`, top: -24, width: 8, height: 112, background: INK, borderRadius: 4, transform: "translateX(-50%)" }} />
          <div style={{ position: "absolute", left: 0, top: 82, fontFamily: OLD, fontSize: 28, color: MUTE }}>ACoS 0%</div><div style={{ position: "absolute", right: 0, top: 82, fontFamily: OLD, fontSize: 28, color: MUTE }}>100%</div>
          {!pets && t > 84.5 && <div style={{ position: "absolute", left: "8%", top: 130, ...H, fontSize: 40, color: GREEN, opacity: ci(t, 84.6, 85.0) }}>✓ under 30% → ads pay for themselves</div>}
        </div>
      </Panel>
      <Stamp text="NO SAFE ZONE" t={t} a={88.4} size={80} style={{ left: 1150, top: 640 }} />
    </AbsoluteFill>
  );
};
const QS: [string, number][] = [["What's my profit on each sale?", 96.7], ["What's my ACoS for each ad?", 99.5], ["Is it lower than my profit margin?", 102.6]];
const Questions: React.FC<{ t: number }> = ({ t }) => {
  const stuck = t > 105.6;
  return (
    <AbsoluteFill>
      <Panel style={{ left: 300, top: 70, width: 1320, height: 760, padding: "40px 56px", boxSizing: "border-box" }}>
        <Kicker text="Before you spend a dollar on ads" />
        {QS.map(([q, a], i) => { const k = sp(t, a, 13, 220), hl = stuck && i === 1, dim = stuck && i !== 1; return (
          <div key={q} style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 34, opacity: Math.min(1, k * 2) * (dim ? 0.35 : 1), transform: `translateX(${(1 - k) * -80}px) scale(${hl ? 1.06 : 1})`, transformOrigin: "0 50%" }}>
            <div style={{ width: 92, height: 92, borderRadius: 46, border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", ...H, fontSize: 54, background: hl ? OR : "transparent", color: hl ? "#fff" : INK, flexShrink: 0 }}>{i + 1}</div>
            <div style={{ ...H, fontSize: 62 }}>{q}</div>
          </div>); })}
      </Panel>
    </AbsoluteFill>
  );
};
const ADS: [string, string, number, number][] = [["Search ad", "go.yourstore.com/spring-search", 820, 64], ["Social ad", "go.yourstore.com/spring-social", 1240, 0], ["Video ad", "go.yourstore.com/spring-video", 410, 38]];
// honest plug: linkutm = real-time CLICKS per link; sales come from the user's own store (separate panel)
const Linkutm: React.FC<{ t: number }> = ({ t }) => {
  const store = t > 115.9, spot = t > 121.3, none = t > 122.1;
  const live = Math.sin(t * 6) > 0;
  return (
    <AbsoluteFill style={{ fontFamily: INTER }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", ...H, fontSize: 62, opacity: ci(t, 108.8, 109.2) }}>Start with what you can see</div>
      <div style={{ position: "absolute", left: store ? 110 : 360, top: 190, width: 1060, background: "#fff", borderRadius: 16, boxShadow: "0 24px 60px -26px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.06)", overflow: "hidden", opacity: ci(t, 109.5, 109.9), transform: `translateY(${(1 - sp(t, 109.5, 14, 200)) * 160}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 24px", borderBottom: "1px solid #EEE" }}><Img src={staticFile("lmv/logo.svg")} style={{ height: 34 }} /><span style={{ fontSize: 22, fontWeight: 700, color: "#6B6B6B" }}>Clicks per ad link</span><span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, fontSize: 18, fontWeight: 700, color: RED }}><span style={{ width: 12, height: 12, borderRadius: 6, background: RED, opacity: live ? 1 : 0.3 }} />LIVE</span></div>
        {ADS.map(([n, url, c], i) => { const v = Math.round(c * ci(t, 111.6 + i * 0.2, 115.6 + i * 0.2, 0, 1, Easing.out(Easing.quad))), hl = spot && i === 1; return (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 24px", borderBottom: "1px solid #F1F1F1", background: hl ? "#FEF2F2" : "#fff" }}>
            <div style={{ width: 150, fontWeight: 700, fontSize: 24 }}>{n}</div>
            <div style={{ fontFamily: "monospace", fontSize: 21, color: OR }}>{url}</div>
            <div style={{ marginLeft: "auto", fontSize: 34, fontWeight: 800, color: hl ? RED : INK }}>{v.toLocaleString("en-US")}<span style={{ fontSize: 18, fontWeight: 600, color: "#6B6B6B" }}> clicks</span></div>
          </div>); })}
      </div>
      {store && <div style={{ position: "absolute", left: 1210, top: 190, width: 600, background: PAPER2, borderRadius: 16, boxShadow: "0 24px 60px -26px rgba(0,0,0,0.35), 0 0 0 1px rgba(40,30,10,0.12)", overflow: "hidden", transform: `translateX(${(1 - sp(t, 115.95, 14, 200)) * 700}px)` }}>
        <div style={{ padding: "18px 24px", borderBottom: `3px double ${INK}`, fontFamily: OLD, fontWeight: 700, fontSize: 24, letterSpacing: 2, textTransform: "uppercase" }}>Your store · sales</div>
        {ADS.map(([n, , , o], i) => { const hl = spot && i === 1; return (
          <div key={n} style={{ display: "flex", alignItems: "center", padding: "24px 24px", borderBottom: "1px solid rgba(40,30,10,0.1)", background: hl ? "#F6D9D5" : undefined, opacity: ci(t, 116.3 + i * 0.2, 116.6 + i * 0.2) }}>
            <div style={{ fontFamily: OLD, fontWeight: 700, fontSize: 26 }}>from {n.toLowerCase()}</div>
            <div style={{ marginLeft: "auto", ...H, fontSize: 40, color: o === 0 ? (none ? RED : INK) : GREEN, transform: `scale(${o === 0 && none ? 1 + 0.25 * (1 - ci(t, 122.1, 122.5)) : 1})` }}>{o} orders</div>
          </div>); })}
      </div>}
      {spot && <div style={{ position: "absolute", left: 300, top: 640, ...H, fontSize: 52, color: RED, opacity: ci(t, 121.3, 121.7) }}>Lots of clicks… <span style={{ opacity: none ? 1 : 0 }}>but no sales.</span></div>}
      <Stamp text="FIX OR SWITCH OFF" t={t} a={124.25} size={56} style={{ left: 640, top: 300 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 770, textAlign: "center", fontFamily: OLD, fontSize: 24, color: MUTE, opacity: ci(t, 116.4, 116.8) }}>Clicks: linkutm · Sales: your own store or analytics · example numbers</div>
    </AbsoluteFill>
  );
};
const Close: React.FC<{ t: number }> = ({ t }) => {
  const items: [string, number, boolean][] = [["the hype", 125.95, true], ["the money", 126.6, true], ["the mascot", 127.45, true], ["the math", 130.1, false]];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", ...H, fontSize: 64, opacity: ci(t, 125.8, 126.2) }}>Pets.com had…</div>
      <div style={{ position: "absolute", left: 360, top: 210, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px 80px" }}>
        {items.map(([l, a, ok]) => { const k = sp(t, a, 12, 240); return (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 24, opacity: Math.min(1, k * 2), transform: `scale(${0.7 + k * 0.3})`, transformOrigin: "0 50%" }}>
            <div style={{ width: 96, height: 96, borderRadius: 14, border: `5px solid ${ok ? GREEN : RED}`, display: "flex", alignItems: "center", justifyContent: "center", ...H, fontSize: 70, color: ok ? GREEN : RED, background: ok ? "#D7EEDD" : "#F6D9D5" }}>{ok ? "✓" : "✗"}</div>
            <div style={{ ...H, fontSize: ok ? 76 : 96, color: ok ? INK : RED }}>{l}</div>
          </div>); })}
      </div>
      {t > 131.1 && <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", ...H, fontSize: 70, transform: `scale(${sp(t, 131.15, 12, 220)})` }}>Don't make the same mistake.</div>}
      <div style={{ position: "absolute", right: 70, top: 690, display: "flex", alignItems: "center", gap: 14, opacity: ci(t, 131.6, 132.0) }}><Img src={staticFile("lmv/logo.svg")} style={{ height: 40 }} /><span style={{ fontFamily: INTER, fontWeight: 600, fontSize: 26, color: MUTE }}>linkutm.com</span></div>
    </AbsoluteFill>
  );
};

// ---------- NEWSPAPER-HEADLINE captions ----------
const KEY = /^(\$[\d.,]+|million|unstoppable|amazon|pets\.com\.?|gone|acos|percent|margin|break-even|profit|linkutm|math|mistake|worse|zero|hype|money|mascot|1,200%|20%|30%)$/i;
type Chunk = { a: number; b: number; w: [number, number, string][] };
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = []; let cur: [number, number, string][] = [];
  W.forEach((w, i) => {
    cur.push(w);
    const next = W[i + 1], len = cur.reduce((s, x) => s + x[2].length + 1, 0);
    if (/[.?!]$/.test(w[2]) || (/[,:]$/.test(w[2]) && len > 22) || len > 40 || !next || next[0] - w[1] > 0.45) { out.push({ a: cur[0][0], b: cur[cur.length - 1][1], w: cur }); cur = []; }
  });
  out.forEach((c, i) => { c.b = out[i + 1] ? out[i + 1].a : c.b + 1.2; });
  return out;
})();
const Headline: React.FC<{ t: number }> = ({ t }) => {
  const i = CHUNKS.findIndex((c) => t >= c.a - 0.05 && t < c.b);
  if (i < 0) return null;
  const c = CHUNKS[i], k = sp(t, c.a - 0.05, 12, 320);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center" }}>
      <div style={{ background: PAPER2, padding: "10px 34px 14px", boxShadow: "0 18px 36px -18px rgba(40,30,10,0.55), 0 0 0 1px rgba(40,30,10,0.12)", transform: `rotate(${(i % 2 ? 0.6 : -0.6)}deg) scale(${interpolate(k, [0, 1], [1.12, 1])})`, opacity: Math.min(1, k * 3), maxWidth: 1600 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 30, borderBottom: `3px double ${INK}`, paddingBottom: 3, marginBottom: 6 }}>
          <span style={{ fontFamily: FRAK, fontSize: 22, color: INK }}>The Daily Chart</span><span style={{ fontFamily: OLD, fontSize: 15, letterSpacing: 2, color: MUTE }}>No. {String(i + 1).padStart(3, "0")}</span>
        </div>
        <div style={{ fontFamily: PLAY, fontWeight: 700, fontSize: 50, lineHeight: 1.12, color: INK, textAlign: "center" }}>
          {c.w.map(([a, , s], j) => { const on = t >= a - 0.03, key = KEY.test(s.replace(/[,?!]$/, "").replace(/\.$/, "")); return <span key={j} style={{ opacity: on ? 1 : 0.0, fontWeight: key ? 900 : 700, color: key ? (/(gone|zero|worse|mistake|math)/i.test(s) ? RED : INK) : "#3B352C", textDecoration: key ? "underline" : undefined, textDecorationThickness: 4, textUnderlineOffset: 8 }}>{s}{" "}</span>; })}
        </div>
      </div>
    </div>
  );
};

// ---------- master ----------
const SC: { a: number; b: number; node: (t: number) => React.ReactNode }[] = [
  { a: 0, b: 34.7, node: (t) => <ChartWorld t={t} /> },
  { a: 34.6, b: 49.15, node: (t) => <Bars t={t} /> },
  { a: 49.05, b: 57.3, node: (t) => <Name t={t} /> },
  { a: 57.2, b: 67.4, node: (t) => <Calc t={t} /> },
  { a: 67.3, b: 76.3, node: (t) => <Worse t={t} /> },
  { a: 76.2, b: 93.4, node: (t) => <Rule t={t} /> },
  { a: 93.3, b: 108.85, node: (t) => <Questions t={t} /> },
  { a: 108.75, b: 127.3, node: (t) => <Linkutm t={t} /> },
  { a: 127.2, b: DUR, node: (t) => <Close t={t - SHIFT} /> },
];
const warp = (t: number) => { if (t <= WARP[0][0]) return WARP[0][1] - (WARP[0][0] - t); for (let i = 1; i < WARP.length; i++) if (t <= WARP[i][0]) { const [a0, b0] = WARP[i - 1], [a1, b1] = WARP[i]; return b0 + ((t - a0) / (a1 - a0)) * (b1 - b0); } const [a, b] = WARP[WARP.length - 1]; return b + (t - a); };
const wt = (w: string) => { const x = W.find((q) => q[2].toLowerCase().startsWith(w.toLowerCase())); return x ? x[0] : 0; };
// v3 hook: the number shock, on a newspaper front page
const Hook3: React.FC<{ t: number }> = ({ t }) => {
  const a1 = wt("$7.6"), a2 = wt("$600"), a3 = wt("hottest");
  const v1 = Math.round(interpolate(ci(t, a1 - 0.1, a1 + 0.9, 0, 1, Easing.out(Easing.cubic)), [0, 1], [0, 7600000]));
  const v2 = Math.round(interpolate(ci(t, a2 - 0.1, a2 + 0.7, 0, 1, Easing.out(Easing.cubic)), [0, 1], [0, 600000]));
  const k1 = sp(t, a1 - 0.15, 10, 300), k2 = sp(t, a2 - 0.15, 10, 300), k3 = sp(t, a3 - 0.2, 12, 240);
  const flip = ci(t, HOOK_END - 0.45, HOOK_END + 0.05, 0, 1, Easing.in(Easing.cubic));
  const push = ci(t, 0, HOOK_END, 1.0, 1.06, (q) => q);
  return (
    <AbsoluteFill style={{ perspective: 2400 }}>
      <AbsoluteFill style={{ transformOrigin: "50% 0%", transform: `rotateX(${flip * 88}deg) scale(${push})`, opacity: 1 - flip * 0.4 }}>
        <Paper />
        <div style={{ position: "absolute", left: 160, right: 160, top: 60, textAlign: "center", opacity: ci(t, 0, 0.4) }}>
          <div style={{ fontFamily: FRAK, fontSize: 74, color: INK }}>The Daily Chart</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: OLD, fontSize: 22, letterSpacing: 3, color: MUTE, borderTop: `3px double ${INK}`, borderBottom: `3px double ${INK}`, padding: "6px 0", marginTop: 6 }}><span>VOL. MCMXCIX</span><span>SPECIAL EDITION</span><span>PRICE: 25¢</span></div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", gap: 90 }}>
          <div style={{ textAlign: "center", transform: `scale(${interpolate(k1, [0, 1], [2.2, 1])}) rotate(-2deg)`, opacity: Math.min(1, k1 * 3) }}>
            <div style={{ ...H, fontSize: 132, color: RED, letterSpacing: -3 }}>${v1.toLocaleString("en-US")}</div>
            <div style={{ fontFamily: OLD, fontWeight: 700, fontSize: 40, letterSpacing: 6, marginTop: 6 }}>SPENT ON ADS</div>
          </div>
          <div style={{ textAlign: "center", transform: `scale(${interpolate(k2, [0, 1], [2.2, 1])}) rotate(2deg)`, opacity: Math.min(1, k2 * 3) }}>
            <div style={{ ...H, fontSize: 132, color: GREEN, letterSpacing: -3 }}>${v2.toLocaleString("en-US")}</div>
            <div style={{ fontFamily: OLD, fontWeight: 700, fontSize: 40, letterSpacing: 6, marginTop: 6 }}>IN SALES</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 600, padding: "26px 0", borderTop: `6px solid ${INK}`, borderBottom: `6px solid ${INK}`, textAlign: "center", transform: `scaleX(${k3})`, opacity: Math.min(1, k3 * 2) }}>
          <div style={{ ...H, fontSize: 78, letterSpacing: -1 }}>…and it was the hottest startup in America.</div>
        </div>
        {t > a3 + 0.3 && <Stamp text="?!" t={t} a={a3 + 0.5} size={110} rot={12} style={{ right: 70, top: 470 }} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Film: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const tv = warp(t);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: PAPER }}>
      <Paper />
      {t >= HOOK_END - 0.45 && SC.map((s, i) => {
        if (tv < s.a || tv >= s.b) return null;
        const k = i === 0 ? 1 : ci(tv, s.a, s.a + 0.45, 0, 1, Easing.out(Easing.cubic)), o = ci(tv, s.b - 0.12, s.b);
        return <AbsoluteFill key={i} style={{ opacity: 1 - o, transform: `translateX(${(1 - k) * 1920}px) rotate(${(1 - k) * 4}deg)` }}>{s.node(Math.max(0, tv))}</AbsoluteFill>;
      })}
      {t < HOOK_END + 0.1 && <Hook3 t={t} />}
      <Headline t={t} />
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 45%, transparent 60%, rgba(60,45,20,0.18) 100%)" }} />
      <Audio src={staticFile("acos/vo3.wav")} />
    </AbsoluteFill>
  );
};
export const AcosFilmV3Comp: React.FC = () => <Composition id="AcosFilmV3" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={WD} height={HT} />;
