// "Eight creators, one link" — 9:16 linkutm reel (D2C skincare launch, example story). Lily VO (ElevenLabs v3, one take).
// Look: "the feed is the world" — ONE continuous camera travels a large warm off-white world (no cuts, no crossfades),
// motion blur only while the camera moves; creators = gradient-initial profile cards (no drawn characters, no real faces);
// one accent colour (linkutm orange), sentence case, no glow. Captions: IG story-sticker blocks (per-line background).
// linkutm claim: one link per creator, each counts its own clicks. Logo untouched on a white plate.
import React from "react";
import { AbsoluteFill, Audio, Composition, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { DUR, W } from "./data";

const { fontFamily: INTER } = loadInter("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] });
const FPS = 30, WD = 1080, HT = 1920;
const OR = "#F2541B", INK = "#161412", MUTE = "#8A8178", BG = "#F4EFE8", LINE = "#E6DFD5";
const EZ = Easing.bezier(0.2, 0.6, 0.35, 1);
const ci = (t: number, a: number, b: number, x = 0, y = 1, e = EZ) => interpolate(t, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const sp = (t: number, a: number, d = 14, s = 180) => (t < a ? 0 : spring({ frame: (t - a) * FPS, fps: FPS, config: { damping: d, stiffness: s } }));
const rnd = (i: number) => { const v = Math.sin(i * 12.9898) * 43758.5453; return v - Math.floor(v); };
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const T = (w: string, n = 0) => { let k = 0; for (const x of W) if (norm(x[2]) === w) { if (k === n) return x[0]; k++; } return -99; };

const CR: [string, string, string, string][] = [
  ["Ananya", "@ananya.glows", "#F59E0B", "#EF4444"], ["Rahul", "@rahulskin", "#6366F1", "#06B6D4"], ["Meera", "@meera.daily", "#EC4899", "#F97316"], ["Kabir", "@kabir.grooms", "#10B981", "#3B82F6"],
  ["Zoya", "@zoyaaa", "#8B5CF6", "#EC4899"], ["Arjun", "@arjun.fit", "#0EA5E9", "#22C55E"], ["Isha", "@isha.minimal", "#F43F5E", "#A855F7"], ["Dev", "@devtalks", "#64748B", "#0EA5E9"],
];
const SAYS = ["did amazing ✨", "went viral 🔥", "best post ever", "so many DMs", "crushed it 💅", "huge reach!", "loved it 💛", "insane views"];
const Avatar: React.FC<{ i: number; s?: number }> = ({ i, s = 96 }) => <div style={{ width: s, height: s, borderRadius: s / 2, background: `linear-gradient(135deg, ${CR[i][2]}, ${CR[i][3]})`, color: "#fff", fontFamily: INTER, fontWeight: 800, fontSize: s * 0.42, display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #fff", boxShadow: `0 0 0 3px ${CR[i][2]}55` }}>{CR[i][0][0]}</div>;
const card: React.CSSProperties = { position: "absolute", background: "#fff", borderRadius: 28, boxShadow: "0 30px 50px -24px rgba(60,40,20,0.35), 0 0 0 1px rgba(0,0,0,0.05)", fontFamily: INTER, color: INK };

// ---------- world regions (world coords; camera centres on them) ----------
const Hook: React.FC<{ t: number }> = ({ t }) => (
  <>{CR.map((c, i) => {
    const col = i % 2, row = Math.floor(i / 2), x = 70 + col * 480, y = 380 + row * 300, k = sp(t, -0.2 + i * 0.07, 13, 200), b = sp(t, T("every") + 0.25 + i * 0.28, 11, 260);
    return <div key={i} style={{ ...card, left: x, top: y + (1 - k) * 260, width: 460, height: 250, opacity: Math.min(1, k * 2), padding: 26 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}><Avatar i={i} s={82} /><div><div style={{ fontSize: 34, fontWeight: 800 }}>{c[0]}</div><div style={{ fontSize: 22, color: MUTE, fontWeight: 600 }}>{c[1]}</div></div></div>
      <div style={{ display: "flex", gap: 24, marginTop: 26, fontSize: 22, color: MUTE, fontWeight: 600 }}><span>♥ {Math.round(2 + rnd(i) * 40)}k</span><span>▶ {Math.round(50 + rnd(i + 3) * 400)}k</span></div>
      {b > 0.01 && <div style={{ position: "absolute", right: 18, top: -36, transform: `scale(${b}) rotate(${(rnd(i) - 0.5) * 8}deg)`, transformOrigin: "80% 100%", padding: "12px 20px", background: INK, color: "#fff", borderRadius: 22, fontSize: 26, fontWeight: 700, whiteSpace: "nowrap" }}>{SAYS[i]}</div>}
    </div>;
  })}
    {/* example tag */}
    <div style={{ position: "absolute", left: 70, top: 1600, padding: "8px 18px", borderRadius: 999, border: `2px solid ${LINE}`, fontFamily: INTER, fontSize: 22, fontWeight: 600, color: MUTE, opacity: 1 - ci(t, 6, 6.6) }}>Example story</div>
  </>
);
const Phone: React.FC<{ x: number; y: number; w?: number; i: number; children?: React.ReactNode; o?: number; s?: number }> = ({ x, y, w = 210, i, children, o = 1, s = 1 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.95, width: w, height: w * 1.9, borderRadius: w * 0.16, background: INK, padding: 8, opacity: o, transform: `scale(${s})`, boxShadow: "0 26px 40px -22px rgba(0,0,0,0.5)" }}>
    <div style={{ width: "100%", height: "100%", borderRadius: w * 0.13, background: "#fff", overflow: "hidden", position: "relative", fontFamily: INTER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12 }}><Avatar i={i} s={42} /><span style={{ fontSize: 17, fontWeight: 700 }}>{CR[i][0]}</span></div>
      <div style={{ margin: "0 12px", height: w * 0.75, borderRadius: 14, background: `linear-gradient(160deg, ${CR[i][2]}33, ${CR[i][3]}44)` }} />
      {children}
    </div>
  </div>
);
const LinkPill: React.FC<{ text: string; size?: number; color?: string; bg?: string }> = ({ text, size = 30, color = INK, bg = "#fff" }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: `${size * 0.4}px ${size * 0.7}px`, borderRadius: 999, background: bg, border: `2px solid ${LINE}`, fontFamily: INTER, fontWeight: 700, fontSize: size, color, whiteSpace: "nowrap", boxShadow: "0 12px 24px -14px rgba(0,0,0,0.35)" }}>
    <svg width={size} height={size} viewBox="0 0 24 24"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" /></svg>{text}
  </div>
);
const PH = (i: number) => ({ x: 1210 + (i % 4) * 225, y: 1050 + Math.floor(i / 4) * 470 });
const Setup: React.FC<{ t: number }> = ({ t }) => {
  const a = T("same") - 0.1, q = T("which");
  return <>
    <div style={{ position: "absolute", left: 1640, top: 560, transform: `translate(-50%,-50%) scale(${sp(t, a - 0.6, 12, 220)})` }}><LinkPill text="priyaskin.co/diwali" size={40} /></div>
    {CR.map((_, i) => { const p = PH(i), k = ci(t, a + i * 0.09, a + 0.5 + i * 0.09, 0, 1, Easing.inOut(Easing.cubic)), ph = sp(t, a - 0.4 + i * 0.05, 14, 200);
      return <React.Fragment key={i}>
        <Phone x={p.x} y={p.y} i={i} o={Math.min(1, ph * 2)} s={0.85 + 0.15 * ph}>
          {k >= 1 && <div style={{ position: "absolute", left: 12, right: 12, bottom: 20, padding: "8px 0", borderRadius: 12, background: "#F3F0EB", fontSize: 15, fontWeight: 700, textAlign: "center", color: INK }}>🔗 priyaskin.co/diwali</div>}
          {t > q && <div style={{ position: "absolute", left: "50%", top: "40%", transform: `translate(-50%,-50%) scale(${sp(t, q + i * 0.06, 9, 300)})`, width: 70, height: 70, borderRadius: 35, background: INK, color: "#fff", fontSize: 44, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>?</div>}
        </Phone>
        {k > 0 && k < 1 && <div style={{ position: "absolute", left: 1640 + (p.x - 1640) * k - 60, top: 560 + (p.y + 120 - 560) * k - 20, transform: `scale(${1 - 0.5 * k})`, opacity: 0.9 }}><LinkPill text="🔗" size={26} /></div>}
      </React.Fragment>; })}
  </>;
};
// pain: screenshot pile + store with an empty doorway; "clicks do" brings people in
const Pain: React.FC<{ t: number }> = ({ t }) => {
  const lk = T("likes"), vw = T("views"), st = T("store", 1), cd = T("clicks");
  const shots = Array.from({ length: 9 }).map((_, i) => ({ a: (i < 5 ? lk : vw) - 0.1 + (i % 5) * 0.16, i }));
  return <>
    {shots.map(({ a, i }) => { const k = sp(t, a, 12, 220); if (k <= 0) return null; const x = 1260 + (rnd(i) * 520), y = 2120 + rnd(i + 7) * 260 - i * 6;
      return <div key={i} style={{ ...card, left: x, top: y - (1 - k) * 500, width: 300, height: 220, padding: 20, transform: `rotate(${(rnd(i + 2) - 0.5) * 24}deg)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar i={i % 8} s={40} /><div style={{ fontSize: 18, fontWeight: 700 }}>{CR[i % 8][0]}</div></div>
        <div style={{ fontSize: 50, fontWeight: 800, marginTop: 18 }}>{i < 5 ? "♥" : "▶"} {Math.round(5 + rnd(i) * 90)}k</div>
        <div style={{ fontSize: 18, color: MUTE, fontWeight: 600 }}>{i < 5 ? "likes" : "views"} · screenshot</div>
      </div>; })}
    {/* storefront */}
    <div style={{ ...card, left: 1240, top: 2560, width: 800, height: 560, borderRadius: 36, overflow: "hidden" }}>
      <div style={{ height: 110, background: `repeating-linear-gradient(90deg, ${OR} 0 70px, #fff 70px 140px)` }} />
      <div style={{ padding: "26px 36px", fontSize: 40, fontWeight: 800 }}>Priya's skincare store</div>
      <div style={{ position: "absolute", left: 300, bottom: 0, width: 200, height: 300, borderRadius: "100px 100px 0 0", background: "#EFE8DE", border: `4px solid ${LINE}` }} />
      {Array.from({ length: 6 }).map((_, i) => { const p = ci(t, cd + 0.1 + i * 0.12, cd + 1.0 + i * 0.12); return p > 0 && p < 1 ? <div key={i} style={{ position: "absolute", left: 60 + p * 340 + (i % 2) * 30, bottom: 30 + (i % 3) * 18, width: 44, height: 44, borderRadius: 22, background: `linear-gradient(135deg, ${CR[i][2]}, ${CR[i][3]})`, border: "3px solid #fff", opacity: Math.sin(p * Math.PI) }} /> : null; })}
      <div style={{ position: "absolute", right: 36, top: 150, fontSize: 24, fontWeight: 700, color: MUTE }}>{t > cd ? "visitors arriving" : "visitors: …"}</div>
    </div>
    {t > st - 0.3 && <div style={{ position: "absolute", left: 1640, top: 2500, transform: `translate(-50%,-50%) scale(${sp(t, st - 0.3, 11, 260)})`, padding: "14px 26px", borderRadius: 18, background: INK, color: "#fff", fontFamily: INTER, fontSize: 34, fontWeight: 700 }}>Likes ≠ visits</div>}
  </>;
};
// twist: 8 coloured paths merge into one grey stream
const Twist: React.FC<{ t: number }> = ({ t }) => {
  const a = T("shared") - 0.3, split = ci(t, T("creator", 1) - 0.1, T("creator", 1) + 0.9, 0, 1, Easing.inOut(Easing.cubic)), same = T("same", 1);
  const tops = CR.map((_, i) => 110 + i * 123);
  const draw = ci(t, a, a + 1.0);
  return <>
    {CR.map((_, i) => <div key={i} style={{ position: "absolute", left: tops[i] - 46, top: 2240 }}><Avatar i={i} s={92} /></div>)}
    <svg width={WD} height={1400} style={{ position: "absolute", left: 0, top: 2330, overflow: "visible" }}>
      {CR.map((c, i) => { const mx = 540 + (tops[i] - 540) * split; const d = `M ${tops[i]} 0 C ${tops[i]} 260, ${mx} 300, ${mx} 520 L ${mx} ${1000}`; const col = split > 0.3 ? c[2] : `rgb(${interpolate(draw, [0, 1], [180, 170])},${170},${165})`;
        return <path key={i} d={d} stroke={split > 0.3 ? col : i === 0 ? c[2] : "#BDB4A8"} strokeOpacity={split > 0.3 ? 1 : draw > 0.9 ? 0.9 : 0.4 + 0.6 * draw} strokeWidth={split > 0.3 ? 14 : 16} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />; })}
      {/* identical grey dots flowing down the merged stream */}
      {split < 0.3 && t > same - 0.6 && Array.from({ length: 7 }).map((_, k) => { const p = ((t - same + 0.6) * 0.6 + k / 7) % 1; return <g key={k} transform={`translate(540 ${520 + p * 600})`}><circle r={22} fill="#A69C90" /><text y={8} textAnchor="middle" fontFamily={INTER} fontWeight={800} fontSize={24} fill="#fff">?</text></g>; })}
      {split > 0.3 && CR.map((c, i) => { const mx = 540 + (tops[i] - 540) * split; return Array.from({ length: 3 }).map((_, k) => { const p = ((t * 0.7 + k / 3 + i * 0.07) % 1); return <circle key={i + "_" + k} cx={mx} cy={520 + p * 480} r={13} fill={c[2]} />; }); })}
    </svg>
    {split < 0.5 && t > same - 0.2 && <div style={{ position: "absolute", left: 540, top: 3050, transform: `translate(-50%,-50%) scale(${sp(t, same - 0.2, 10, 260)})`, padding: "14px 26px", borderRadius: 18, background: "#fff", border: `2px solid ${LINE}`, fontFamily: INTER, fontSize: 32, fontWeight: 700, color: MUTE }}>1 link · 8 creators · no idea</div>}
  </>;
};
// fix + payoff: linkutm Links card with one link per creator
const CLK = [900, 64, 212, 4, 138, 2, 76, 41];
const Fix: React.FC<{ t: number }> = ({ t }) => {
  const lu = T("linkutm"), per = T("per"), cnt = T("counts"), n9 = T("900"), alm = T("almost"), gs = T("guess");
  const tick = (i: number) => Math.round(CLK[i] * ci(t, cnt - 0.2 + i * 0.05, i === 0 ? n9 + 0.5 : cnt + 1.6, 0, 1, Easing.out(Easing.cubic)));
  const dim = ci(t, alm - 0.3, alm + 0.2);
  return <>
    <div style={{ position: "absolute", left: 540, top: 4150, transform: `translate(-50%,-50%) scale(${interpolate(sp(t, lu - 0.15, 11, 240), [0, 1], [0.6, 1])})`, opacity: ci(t, lu - 0.15, lu + 0.1) }}>
      <div style={{ background: "#fff", borderRadius: 26, padding: "22px 36px", boxShadow: "0 20px 40px -20px rgba(0,0,0,0.3)" }}><Img src={staticFile("lmv/logo.svg")} style={{ width: 400, display: "block" }} /></div>
    </div>
    <div style={{ ...card, left: 50, top: 4290, width: 980, padding: "28px 30px 18px", opacity: ci(t, per - 0.5, per - 0.1), transform: `translateY(${(1 - sp(t, per - 0.5, 14, 160)) * 120}px)` }}>
      <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 800 }}>Links<span style={{ marginLeft: 14, fontSize: 22, color: MUTE, fontWeight: 600 }}>Diwali launch · 8 creators</span><span style={{ marginLeft: "auto", padding: "10px 18px", borderRadius: 12, background: OR, color: "#fff", fontSize: 22 }}>+ Create link</span></div>
      {CR.map((c, i) => { const k = sp(t, per - 0.2 + i * 0.1, 14, 220), v = tick(i), low = (i === 3 || i === 5) ? dim : 0, hero = i === 0 && t > n9 - 0.1;
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 12px", marginTop: 6, borderRadius: 16, background: hero ? "#FFF1EA" : low ? "#F6F3EF" : "transparent", border: hero ? `3px solid ${OR}` : "3px solid transparent", opacity: Math.min(1, k * 2) * (1 - low * 0.55), transform: `translateX(${(1 - k) * 80}px) scale(${hero ? 1 + 0.03 * Math.exp(-(t - n9) * 3) : 1})` }}>
          <Avatar i={i} s={68} />
          <div style={{ flex: 1 }}><div style={{ fontSize: 33, fontWeight: 800 }}>{c[0]}</div><div style={{ fontSize: 24, fontWeight: 600, color: OR }}>go.priyaskin.co/{c[0].toLowerCase()}</div></div>
          <div style={{ textAlign: "right" }}><div style={{ fontSize: 44, fontWeight: 800, color: hero ? OR : INK, fontVariantNumeric: "tabular-nums" }}>{t > cnt - 0.2 ? v.toLocaleString("en-US") : "—"}</div><div style={{ fontSize: 17, color: MUTE, fontWeight: 600 }}>clicks</div></div>
        </div>; })}
    </div>
    {t > gs - 0.2 && <div style={{ position: "absolute", left: 540, top: 3960, transform: `translate(-50%,-50%) scale(${sp(t, gs - 0.2, 10, 240)})`, display: "flex", alignItems: "center", gap: 16, padding: "16px 28px", borderRadius: 999, background: OR, color: "#fff", fontFamily: INTER, fontWeight: 800, fontSize: 36, boxShadow: "0 18px 30px -14px rgba(242,84,27,0.6)" }}><Avatar i={0} s={60} />Ananya · next campaign ✓</div>}
  </>;
};
const Cta: React.FC<{ t: number }> = ({ t }) => {
  const g = T("give"), lu = T("linkutm", 1);
  return <>
    {CR.map((c, i) => { const k = sp(t, g - 0.4 + i * 0.07, 13, 220), x = 1210 + (i % 2) * 460, y = 3560 + Math.floor(i / 2) * 150;
      return <div key={i} style={{ ...card, left: x, top: y + (1 - k) * 200, width: 440, height: 124, display: "flex", alignItems: "center", gap: 14, padding: "0 18px", opacity: Math.min(1, k * 2) }}>
        <Avatar i={i} s={64} /><div><div style={{ fontSize: 24, fontWeight: 800 }}>{c[0]}</div><div style={{ fontSize: 18, fontWeight: 700, color: OR }}>go.priyaskin.co/{c[0].toLowerCase()}</div></div>
      </div>; })}
    <div style={{ position: "absolute", left: 1640, top: 4330, transform: `translate(-50%,-50%) scale(${interpolate(sp(t, lu - 0.3, 11, 220), [0, 1], [0.6, 1])})`, opacity: ci(t, lu - 0.3, lu), textAlign: "center" }}>
      <div style={{ background: "#fff", borderRadius: 30, padding: "36px 54px", boxShadow: "0 30px 60px -26px rgba(0,0,0,0.4)" }}>
        <Img src={staticFile("lmv/logo.svg")} style={{ width: 500, display: "block" }} />
        <div style={{ marginTop: 28, display: "inline-block", padding: "18px 42px", borderRadius: 18, background: OR, color: "#fff", fontFamily: INTER, fontWeight: 800, fontSize: 44 }}>Start free</div>
        <div style={{ marginTop: 12, fontFamily: INTER, fontWeight: 600, fontSize: 24, color: MUTE }}>No credit card</div>
      </div>
    </div>
  </>;
};
// diya lamps (small, warm, no glow halo)
const Diyas: React.FC<{ t: number; x: number; y: number; n?: number }> = ({ t, x, y, n = 5 }) => <>{Array.from({ length: n }).map((_, i) => <svg key={i} width={90} height={110} viewBox="0 0 90 110" style={{ position: "absolute", left: x + i * 120, top: y }}>
  <path d={`M45 ${22 + Math.sin(t * 9 + i) * 3} C 36 40, 40 54, 45 56 C 50 54, 54 40, 45 ${22 + Math.sin(t * 9 + i) * 3} Z`} fill="#FDB022" /><path d="M45 36 C 41 46, 43 54, 45 55 C 47 54, 49 46, 45 36 Z" fill="#FFF2C4" />
  <path d="M8 62 Q 45 58 82 62 Q 76 96 45 98 Q 14 96 8 62 Z" fill="#C2622D" /><path d="M8 62 Q 45 72 82 62" stroke="#8E4220" strokeWidth={4} fill="none" />
</svg>)}</>;

// ---------- camera ----------
type K = [number, number, number, number];
const CAM: K[] = [
  [0, 540, 1010, 1.12], [T("said") + 1.2, 540, 1010, 1.05],
  [T("but") - 0.35, 540, 1010, 1.05], [T("but") + 0.25, 1547, 1000, 1.15], [T("which") + 1.5, 1547, 1020, 1.2],
  [T("screenshots") - 0.35, 1547, 1020, 1.2], [T("screenshots") + 0.2, 1660, 2320, 1.2], [T("but", 1) - 0.2, 1660, 2360, 1.22], [T("but", 1) + 0.4, 1640, 2800, 1.22], [T("clicks") + 0.9, 1640, 2820, 1.26],
  [T("and", 1) - 0.25, 1640, 2820, 1.26], [T("and", 1) + 0.35, 540, 2800, 1.0], [T("same", 1) + 0.6, 540, 2840, 1.04],
  [T("thats") - 0.5, 540, 2860, 1.04], [T("thats") + 0.2, 540, 4600, 1.0], [T("900") - 0.3, 540, 4600, 1.0], [T("900") + 0.2, 540, 4480, 1.15], [T("two") + 0.1, 540, 4620, 1.04], [T("guess") + 0.6, 540, 4450, 1.02],
  [T("paying") - 0.3, 540, 4450, 1.02], [T("paying") + 0.3, 1640, 4000, 1.12], [DUR, 1640, 4060, 1.16],
];
const camAt = (t: number) => { let i = 1; while (i < CAM.length - 1 && t > CAM[i][0]) i++; const a = CAM[i - 1], b = CAM[i]; const p = Easing.inOut(Easing.cubic)(Math.max(0, Math.min(1, (t - a[0]) / Math.max(0.001, b[0] - a[0])))); return { x: a[1] + (b[1] - a[1]) * p, y: a[2] + (b[2] - a[2]) * p, z: a[3] + (b[3] - a[3]) * p }; };

// ---------- story-sticker captions ----------
type Chunk = { a: number; b: number; words: [number, string][] };
const CH: Chunk[] = (() => { const out: Chunk[] = []; let cur: Chunk | null = null; W.forEach(([a, b, w], i) => { const p = W[i - 1]; const brk = !cur || /[.?!:]$/.test(p[2]) || (/,$/.test(p[2]) && cur.words.length >= 3) || cur.words.length >= 6 || a - p[1] > 0.65; if (brk) { cur = { a, b, words: [] }; out.push(cur); } cur!.words.push([a, w]); cur!.b = b; }); return out; })();
const KEY = new Set(["eight", "8", "amazing!", "same", "which", "likes.", "views.", "clicks", "do.", "same.", "own", "linkutm.", "900", "nobody.", "next", "campaign?", "free"]);
const Captions: React.FC<{ t: number }> = ({ t }) => {
  const i = CH.findIndex((c, k) => (k === 0 || t >= c.a - 0.08) && t < (CH[k + 1]?.a ?? DUR + 1) - 0.08);
  if (i < 0) return null; const c = CH[i]; const k = i === 0 ? 1 : sp(t, c.a - 0.08, 12, 300), rot = (rnd(i) - 0.5) * 4;
  return <div style={{ position: "absolute", left: 70, right: 70, top: 1470, textAlign: "center", transform: `rotate(${rot}deg) scale(${interpolate(k, [0, 1], [0.8, 1])})`, opacity: Math.min(1, k * 2.5) }}>
    <span style={{ fontFamily: INTER, fontWeight: 800, fontSize: 54, lineHeight: 1.55, color: INK, background: "#fff", padding: "6px 22px", borderRadius: 16, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", boxShadow: "0 10px 24px -12px rgba(0,0,0,0.35)" }}>
      {c.words.map(([a, w], j) => { const on = t >= a - 0.06, key = KEY.has(w.toLowerCase()); return <span key={j} style={{ color: !on ? "#C9C1B6" : key ? OR : INK }}>{w}{j < c.words.length - 1 ? " " : ""}</span>; })}
    </span>
  </div>;
};

// stage band: scenes live in the top ~3/4 (centre y=VY), captions get their own clear band below
const VY = 700, VZ = 0.9;
const Film: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const c = camAt(t), c2 = camAt(t + 1 / FPS);
  const speed = Math.hypot(c2.x - c.x, c2.y - c.y);
  const blur = Math.min(7, Math.max(0, (speed - 6) / 8));
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.7) 0%, rgba(244,239,232,0) 60%)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 2400, height: 4800, transformOrigin: "0 0", transform: `translate(${540 - c.x * c.z * VZ}px, ${VY - c.y * c.z * VZ}px) scale(${c.z * VZ})`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
        <Hook t={t} />
        <Diyas t={t} x={260} y={1600} />
        <Setup t={t} />
        <Pain t={t} />
        <Twist t={t} />
        <Fix t={t} />
        <Cta t={t} />
        <Diyas t={t} x={1340} y={4620} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1400, bottom: 0, background: `linear-gradient(180deg, rgba(244,239,232,0) 0%, ${BG} 22%)` }} />
      <Captions t={t} />
      <Audio src={staticFile("creators/vo.wav")} />
    </AbsoluteFill>
  );
};
export const CreatorsReelComp: React.FC = () => <Composition id="EightCreatorsReel" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={WD} height={HT} />;
