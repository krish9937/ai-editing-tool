// "The Link" v2 — linkutm launch film, 16:9, ~30 s, music only (129.2 BPM grid, drop on beat 16 = 7.61 s).
// v1 feedback: "the video is too small" (elements filled ~half the frame; 15 s too short) → every scene laid out to fill
// ~80 % of the frame at zoom 1, each feature gets ~2× the time, plus two real features: OS/referrer click breakdowns and an AI
// assistant creating a link through the linkutm MCP server. Same hero: one orange-outlined link pill that never leaves the
// screen. 2D only; no glows/particles/crossfades/shake; claims = clicks only (no sales).
import { AbsoluteFill, Audio, Composition, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import React from "react";
import QRCode from "qrcode";
import { INTER, K, MONO, Cursor } from "../lmv/ui";
import { WORLD_D, WORLD_W } from "../world-map-data";

const WD = 1920, HT = 1080;
export const DUR2 = 30.4;
const BEAT = 0.4644, PH = 0.176, B = (n: number) => PH + n * BEAT;
const OR = K.orange, INK = "#1C1C1C", CANVAS = "#F7F4EF", MUTE = "#7A7670", GREEN = "#16A34A", RED = "#E5383B";
const EZ = Easing.bezier(0.16, 1, 0.3, 1), IO = Easing.bezier(0.65, 0, 0.35, 1);
const ci = (t: number, a: number, b: number, x = 0, y = 1, e = EZ) => interpolate(t, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const sp = (t: number, a: number, fps: number, d = 18, s = 220) => (t < a ? 0 : spring({ frame: (t - a) * fps, fps, config: { damping: d, stiffness: s } }));
const kf = (t: number, k: [number, number][], e = IO) => { if (t <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (t <= k[i][0]) return k[i - 1][1] + (k[i][1] - k[i - 1][1]) * e((t - k[i - 1][0]) / (k[i][0] - k[i - 1][0])); return k[k.length - 1][1]; };
const kfLog = (t: number, k: [number, number][]) => Math.exp(kf(t, k.map(([a, v]) => [a, Math.log(v)] as [number, number])));

const UGLY = "https://www.yourbrand.com/collections/spring-sale-2026?utm_source=Facebook&utm_medium=Paid%20Social&utm_campaign=SPRING_sale_v2_FINAL&fbclid=IwAR3xQ8kz";
const TAGGED = "https://www.yourbrand.com/collections/spring-sale?utm_source=facebook&utm_medium=paid-social&utm_campaign=spring-sale";
const SHORT = "go.yourbrand.com/spring";
const PROMPT = "Create a tagged link for our spring email";
const QRM = (() => { const q = QRCode.create("https://go.yourbrand.com/spring", { errorCorrectionLevel: "M" }); const n = q.modules.size; const m: boolean[][] = []; for (let y = 0; y < n; y++) { m.push([]); for (let x = 0; x < n; x++) m[y].push(!!q.modules.get(x, y)); } return m; })();
const typedN = (t: number) => Math.max(0, Math.min(UGLY.length, Math.floor((t - 0.1) * 105)));

// ---------- hero pill geometry ----------
const geom = (t: number) => {
  const n = typedN(t), lines = Math.max(1, Math.ceil(n / 62)), tw = Math.min(1720, 300 + n * 25), th = 52 + lines * 66 + 44;
  const w = t < B(4) ? tw : kf(t, [[B(4), 1720], [B(4) + 0.45, 1500], [B(13), 1500], [B(13) + 0.4, 1800], [B(14.2), 1800], [B(15.8), 980], [B(16), 980], [B(16) + 0.35, 620], [B(20), 620], [B(20) + 0.45, 420], [B(28), 420], [B(28) + 0.45, 1150], [B(40), 1150], [B(40.6), 520], [B(47.6), 520], [B(48.3), 1260], [B(50.6), 1260], [B(51.4), 860], [B(56), 860], [B(57.4), 46]]);
  const h = t < B(4) ? th : kf(t, [[B(4), 52 + 3 * 66 + 44], [B(4) + 0.45, 780], [B(13), 780], [B(13) + 0.4, 150], [B(16), 150], [B(16) + 0.35, 620], [B(20), 620], [B(20) + 0.45, 420], [B(28), 420], [B(28) + 0.45, 150], [B(40), 150], [B(40.6), 120], [B(47.6), 120], [B(48.3), 110], [B(50.6), 110], [B(51.4), 124], [B(56), 124], [B(57.4), 46]]);
  const r = kf(t, [[B(4), 48], [B(4) + 0.45, 30], [B(13), 30], [B(13) + 0.4, 75], [B(16), 75], [B(16) + 0.35, 36], [B(20) + 0.45, 24], [B(28), 24], [B(28) + 0.45, 75], [B(40.6), 60], [B(48.3), 55], [B(51.4), 62], [B(56), 62], [B(57.4), 23]]);
  const x = kf(t, [[B(20), 960], [B(20) + 0.45, 640], [B(28), 640], [B(28) + 0.45, 960], [B(51), 960], [B(51.4), 800], [B(56), 800], [B(57.4), 960], [B(57.9), 420], [B(59), 1494]]);
  const y = kf(t, [[B(20), 540], [B(20) + 0.45, 520], [B(28), 520], [B(28) + 0.45, 180], [B(40), 180], [B(40.6), 560], [B(47.6), 560], [B(48.3), 860], [B(50.6), 860], [B(51.4), 640], [B(56), 640], [B(57.4), 560], [B(57.9), 553], [B(59), 553]]);
  return { x, y, w, h, r, dot: t > B(57) };
};
const cam = (t: number) => ({
  z: kfLog(t, [[0, 1.12], [B(4), 1.0], [B(13), 1.04], [B(13) + 0.4, 1.0], [B(16), 1.03], [B(16) + 0.4, 1.32], [B(19.6), 1.36], [B(20) + 0.5, 1.0], [B(28), 1.03], [B(28) + 0.5, 1.0], [B(40), 1.02], [B(40.6), 1.0], [B(48), 1.02], [B(48.4), 1.0], [B(56), 1.04], [B(57.4), 1.25], [B(58.8), 1.0], [DUR2, 1.05]]),
  x: 960, y: kf(t, [[B(56), 540], [B(57.4), 560], [B(58.8), 600], [DUR2, 600]]),
});

// ---------- hero contents ----------
const Chip: React.FC<{ label: string; val: string; k: number; tone?: "ok" | "bad" | "plain" }> = ({ label, val, k, tone = "plain" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, height: 104, padding: "0 30px", borderRadius: 18, border: `2px solid ${tone === "bad" ? RED : K.border}`, background: tone === "bad" ? "#FEF2F2" : "#fff", transform: `translateY(${(1 - k) * -80}px)`, opacity: Math.min(1, k * 2) }}>
    <span style={{ width: 190, fontSize: 30, color: MUTE, fontWeight: 600 }}>{label}</span>
    <span style={{ fontFamily: MONO, fontSize: 40, color: tone === "bad" ? RED : INK, fontWeight: 600 }}>{val}</span>
    {tone === "ok" && <span style={{ marginLeft: "auto", width: 48, height: 48, borderRadius: 24, background: "#DCFCE7", color: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800 }}>✓</span>}
  </div>
);
const Builder: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const fb = t > B(8), fbType = "FB".slice(0, Math.max(0, Math.floor((t - B(8)) * 6))), bad = t > B(10) && t < B(11), fixed = t > B(11);
  const shake = bad ? Math.sin((t - B(10)) * 55) * 10 * (1 - (t - B(10)) / 0.46) : 0;
  const tpl = t > B(5) + 0.1;
  return (
    <div style={{ position: "absolute", inset: 0, padding: "48px 60px", opacity: ci(t, B(4) + 0.2, B(4) + 0.45) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}><Img src={staticFile("lmv/logo.svg")} style={{ height: 44 }} /><span style={{ fontSize: 32, color: MUTE, fontWeight: 600 }}>· Create link</span>
        <span style={{ marginLeft: "auto", padding: "12px 22px", borderRadius: 14, border: `2px solid ${tpl ? OR : K.border}`, background: tpl ? K.orangeBg : "#fff", fontSize: 30, fontWeight: 600, transform: `scale(${1 + 0.06 * Math.max(0, 1 - Math.abs(t - B(5) - 0.15) / 0.2)})` }}>Template · Spring sale</span></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 50 }}>
        <div style={{ position: "relative", transform: `translateX(${shake}px)` }}>
          {!fb ? <Chip label="Source" val="—" k={1} /> : <Chip label="Source" val={fixed ? "facebook" : fbType} k={1} tone={fixed ? "ok" : bad ? "bad" : "plain"} />}
          {fb && t < B(10) && <div style={{ position: "absolute", right: 30, top: 32, display: "flex", alignItems: "center", gap: 10, fontSize: 26, color: MUTE }}><span style={{ width: 40, height: 40, borderRadius: 20, background: "#EC4899", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 17 }}>PN</span>Priya is typing…</div>}
          {t > B(10) && <div style={{ position: "absolute", right: 96, top: 26, padding: "10px 18px", borderRadius: 12, background: fixed ? "#DCFCE7" : "#FEF3C7", color: fixed ? "#15803D" : "#B45309", fontSize: 26, fontWeight: 700, transform: `scale(${sp(t, B(10), fps, 16, 260)})`, transformOrigin: "100% 50%" }}>{fixed ? "✓ Naming rule applied" : "Naming rule: use “facebook”"}</div>}
        </div>
        <Chip label="Medium" val="paid-social" k={sp(t, B(7), fps, 16, 260)} tone={t > B(7) ? "ok" : "plain"} />
        <Chip label="Campaign" val="spring-sale" k={sp(t, B(6), fps, 16, 260)} tone={t > B(6) ? "ok" : "plain"} />
      </div>
    </div>
  );
};
const Collapse: React.FC<{ t: number }> = ({ t }) => {
  const p = ci(t, B(14.2), B(15.8), 0, 1, (x) => x), L = TAGGED.length;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 54px", whiteSpace: "nowrap", fontFamily: MONO, fontSize: 34, color: INK }}>
      {p < 0.75 && [...TAGGED].map((c, i) => { const d = ci(p, ((L - i) / L) * 0.6, ((L - i) / L) * 0.6 + 0.12); return <span key={i} style={{ display: "inline-block", width: `${(1 - d) * 0.6}em`, transform: `scale(${1 - d})`, opacity: 1 - d, color: i >= 25 ? OR : INK }}>{c}</span>; })}
      {p > 0.45 && <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 60, position: p < 0.75 ? "absolute" : "relative", left: p < 0.75 ? 54 : undefined }}>{[...SHORT].map((c, i) => { const k = ci(p, 0.45 + (i / SHORT.length) * 0.4, 0.5 + (i / SHORT.length) * 0.4); return <span key={i} style={{ display: "inline-block", opacity: k, transform: `translateY(${(1 - k) * 18}px)`, color: i < 16 ? INK : OR }}>{c}</span>; })}</span>}
    </div>
  );
};
const QRBuild: React.FC<{ t: number; size: number }> = ({ t, size }) => {
  const n = QRM.length, pad = size * 0.07, c = (size - pad * 2) / n, rows = ci(t, B(16) + 0.15, B(19.5), 0, n, (x) => x);
  return (
    <svg width={size} height={size} style={{ position: "absolute", left: 0, top: 0 }}>
      {QRM.map((row, y) => row.map((on, x) => { if (!on) return null; const a = Math.max(0, Math.min(1, rows - y)); if (a <= 0) return null; return <rect key={x + "_" + y} x={pad + x * c + (c * (1 - a)) / 2} y={pad + y * c + (c * (1 - a)) / 2} width={(c + 0.4) * a} height={(c + 0.4) * a} rx={c * 0.18} fill={INK} />; }))}
    </svg>
  );
};
const Counter: React.FC<{ t: number }> = ({ t }) => {
  const v = Math.round(interpolate(ci(t, B(28.6), B(38), 0, 1, (x) => x), [0, 1], [0, 1284]));
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 50px", gap: 22, opacity: ci(t, B(28) + 0.25, B(28) + 0.5) }}>
      <span style={{ fontWeight: 700, fontSize: 56, color: INK }}>go.yourbrand.com/<span style={{ color: OR }}>spring</span></span>
      <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14, padding: "12px 24px", borderRadius: 999, background: "#111", color: "#fff", fontWeight: 700, fontSize: 38 }}><span style={{ width: 16, height: 16, borderRadius: 8, background: RED, opacity: Math.sin(t * 7) > 0 ? 1 : 0.35 }} />{v.toLocaleString("en-US")} clicks</span>
    </div>
  );
};
const Hero: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const g = geom(t);
  const typed = UGLY.slice(0, typedN(t));
  const prompt = PROMPT.slice(0, Math.max(0, Math.floor((t - B(48.4)) * 19)));
  return (
    <div style={{ position: "absolute", left: g.x - g.w / 2, top: g.y - g.h / 2, width: g.w, height: g.h, borderRadius: g.r, background: g.dot ? OR : "#fff", border: `${g.dot ? 0 : 4}px solid ${OR}`, boxShadow: g.dot ? "none" : "0 34px 80px -36px rgba(40,30,20,0.45)", overflow: "hidden", fontFamily: INTER, color: INK, boxSizing: "border-box", zIndex: 5 }}>
      {t < B(4) + 0.25 && <div style={{ position: "absolute", left: 52, right: 52, top: 40, fontFamily: MONO, fontSize: 40, lineHeight: "66px", wordBreak: "break-all", opacity: 1 - ci(t, B(4) + 0.05, B(4) + 0.25) }}>{typed}<span style={{ display: "inline-block", width: 4, height: 44, background: OR, verticalAlign: "middle", opacity: Math.sin(t * 14) > 0 ? 1 : 0 }} /></div>}
      {t >= B(4) && t < B(13) + 0.3 && <div style={{ position: "absolute", left: 0, top: 0, width: 1500, height: 780, opacity: 1 - ci(t, B(13), B(13) + 0.25) }}><Builder t={t} fps={fps} /></div>}
      {t >= B(13) + 0.15 && t < B(16) + 0.25 && <div style={{ position: "absolute", inset: 0, opacity: ci(t, B(13) + 0.15, B(13) + 0.4) * (1 - ci(t, B(16) + 0.05, B(16) + 0.25)) }}><Collapse t={t} /></div>}
      {t >= B(16) + 0.1 && t < B(28) + 0.3 && <div style={{ position: "absolute", left: (g.w - Math.min(g.w, g.h)) / 2, top: (g.h - Math.min(g.w, g.h)) / 2, width: Math.min(g.w, g.h), height: Math.min(g.w, g.h), opacity: 1 - ci(t, B(28), B(28) + 0.25) }}><QRBuild t={t} size={Math.min(g.w, g.h)} /></div>}
      {t >= B(28) + 0.2 && t < B(40.6) && <div style={{ position: "absolute", inset: 0, opacity: 1 - ci(t, B(40.2), B(40.5)) }}><Counter t={t} /></div>}
      {t >= B(40.4) && t < B(47.9) && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 38, opacity: ci(t, B(40.5), B(40.8)) * (1 - ci(t, B(47.5), B(47.8))) }}>go.<span style={{ color: OR }}>northwind</span>.co/menu</div>}
      {t >= B(48.2) && t < B(50.8) && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 40px", fontSize: 38, color: prompt ? INK : "#A8A29A", opacity: ci(t, B(48.2), B(48.4)) * (1 - ci(t, B(50.6), B(50.8))) }}>{prompt || "Ask your AI assistant…"}<span style={{ display: "inline-block", width: 3, height: 42, marginLeft: 3, background: OR, opacity: Math.sin(t * 14) > 0 ? 1 : 0 }} /><span style={{ marginLeft: "auto", width: 64, height: 64, borderRadius: 32, background: t > B(50.3) ? OR : "#E7E2DA", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 800 }}>↑</span></div>}
      {t >= B(51.1) && t < B(56.6) && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 48, opacity: ci(t, B(51.2), B(51.6)) * (1 - ci(t, B(56.2), B(56.6))) }}>go.yourbrand.com/<span style={{ color: OR }}>spring-email</span></div>}
    </div>
  );
};

// ---------- supporting scenes ----------
const Menu: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const k = sp(t, B(20), fps, 18, 160), out = ci(t, B(27.6), B(28) + 0.15, 0, 1, Easing.in(Easing.cubic));
  const sw = ci(t, B(24.6), B(25.4));
  return (
    <>
      <div style={{ position: "absolute", left: 640 - 380, top: 50, width: 760, height: 990, borderRadius: 12, background: "#FFFDF8", boxShadow: "0 50px 100px -40px rgba(40,30,20,0.5)", transform: `translateY(${(1 - k) * 1000 + out * 1100}px) rotate(-1.5deg)`, fontFamily: INTER, textAlign: "center" }}>
        <div style={{ marginTop: 48, fontFamily: "Georgia, serif", fontSize: 82, fontWeight: 700, letterSpacing: 4 }}>CAFÉ LUNA</div>
        <div style={{ fontSize: 30, color: MUTE, letterSpacing: 6, marginTop: 6 }}>SPRING MENU</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, fontSize: 36, fontWeight: 700 }}>Scan to order</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, fontSize: 24, color: MUTE }}>printed · 2,000 copies</div>
      </div>
      <div style={{ position: "absolute", left: 1080, top: 300, width: 780, padding: "36px 40px", borderRadius: 24, background: "#fff", boxShadow: "0 40px 90px -36px rgba(40,30,20,0.45), 0 0 0 1px rgba(0,0,0,0.06)", fontFamily: INTER, transform: `translateX(${(1 - sp(t, B(22), fps, 18, 200)) * 1000 + out * 1300}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><Img src={staticFile("lmv/logo.svg")} style={{ height: 38 }} /><span style={{ fontSize: 30, color: MUTE, fontWeight: 600 }}>· Dynamic QR</span></div>
        <div style={{ fontSize: 26, color: MUTE, fontWeight: 600, marginTop: 30 }}>Destination</div>
        <div style={{ position: "relative", height: 90, marginTop: 10, borderRadius: 16, border: `2px solid ${t > B(24) && t < B(26) ? OR : K.border}`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 24, top: 22, fontFamily: MONO, fontSize: 36, transform: `translateY(${-sw * 80}px)`, opacity: 1 - sw }}>yourbrand.com/spring-menu</div>
          <div style={{ position: "absolute", left: 24, top: 22, fontFamily: MONO, fontSize: 36, transform: `translateY(${(1 - sw) * 80}px)`, color: OR, fontWeight: 600 }}>yourbrand.com/summer-menu</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 26, fontSize: 32, fontWeight: 700, color: "#15803D", opacity: ci(t, B(26), B(26.4)), transform: `translateY(${(1 - ci(t, B(26), B(26.4))) * 14}px)` }}>✓ Same printed QR · new page</div>
      </div>
      {t > B(23.2) && t < B(26) && <Cursor x={kf(t, [[B(23.2), 1700], [B(24), 1640]])} y={kf(t, [[B(23.2), 820], [B(24), 520]])} click={ci(t, B(24), B(24) + 0.35)} />}
    </>
  );
};
const nePt = (lon: number, lat: number): [number, number] => { const l = (lon * Math.PI) / 180, p = (lat * Math.PI) / 180, p2 = p * p, p4 = p2 * p2; const x = l * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4))); const y = p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4))); return [500 + x * 182.8, 260 - y * 182.8]; };
const SPOTS: [string, number, number, string, number, number][] = [["United States", -98, 39, "236", 29, 1], ["United Kingdom", -2, 53, "98", 30, -1], ["Germany", 10, 51, "61", 31, 1], ["India", 78, 21, "412", 32, 1]];
const BREAK: [string, number, [string, number, string][]][] = [
  ["Device", 34, [["Mobile", 72, INK], ["Desktop", 28, OR]]],
  ["OS", 35.5, [["iOS", 52, INK], ["Android", 31, OR], ["Windows", 17, "#B9B2A8"]]],
  ["Referrer", 37, [["instagram.com", 44, INK], ["direct", 31, OR], ["facebook.com", 25, "#B9B2A8"]]],
];
const Clicks: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const k = ci(t, B(28) + 0.35, B(28) + 0.8), out = ci(t, B(40), B(40.5));
  const sh = ci(t, B(33.6), B(34.4), 0, 1, IO);
  const MW = interpolate(sh, [0, 1], [1560, 1080]), s = MW / WORLD_W, ox = interpolate(sh, [0, 1], [960 - 780, 70]), oy = interpolate(sh, [0, 1], [290, 330]);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: WD, height: HT, opacity: k * (1 - out), transform: `translateY(${(1 - k) * 60 + out * 80}px)` }}>
      <svg width={WD} height={HT} style={{ position: "absolute", left: 0, top: 0 }}><g transform={`translate(${ox} ${oy}) scale(${s})`}><path d={WORLD_D} fill="#E3DED5" stroke={CANVAS} strokeWidth={0.6 / s} /></g></svg>
      {SPOTS.map(([n, lon, lat, v, b, side]) => { if (t < B(b)) return null; const [px, py] = nePt(lon, lat); const X = ox + px * s, Y = oy + py * s, kk = sp(t, B(b), fps, 14, 260); return (
        <React.Fragment key={n}>
          <div style={{ position: "absolute", left: X - 15, top: Y - 15, width: 30, height: 30, borderRadius: 15, background: OR, border: "4px solid #fff", transform: `scale(${kk})`, boxShadow: "0 6px 14px rgba(0,0,0,0.2)" }} />
          <div style={{ position: "absolute", left: side > 0 ? X + 24 : undefined, right: side < 0 ? WD - X + 24 : undefined, top: Y - (side < 0 ? 66 : 28), padding: "8px 18px", borderRadius: 999, background: "#fff", boxShadow: "0 12px 30px -14px rgba(0,0,0,0.35)", fontFamily: INTER, fontSize: 30 * (1 - sh * 0.2), fontWeight: 700, whiteSpace: "nowrap", opacity: kk }}>{n} <span style={{ color: OR }}>{v}</span></div>
        </React.Fragment>); })}
      {BREAK.map(([title, b, rows], i) => { const kk = sp(t, B(b), fps, 18, 200); return (
        <div key={title} style={{ position: "absolute", left: 1200, top: 300 + i * 232, width: 660, height: 208, padding: "22px 28px", boxSizing: "border-box", borderRadius: 22, background: "#fff", boxShadow: "0 26px 60px -34px rgba(40,30,20,0.4), 0 0 0 1px rgba(0,0,0,0.05)", fontFamily: INTER, transform: `translateX(${(1 - kk) * 800}px)`, opacity: Math.min(1, kk * 2) }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: MUTE }}>{title}</div>
          <div style={{ display: "flex", height: 30, borderRadius: 15, overflow: "hidden", background: "#EFEAE2", marginTop: 16 }}>{rows.map(([n, v, c]) => <div key={n} style={{ width: `${v * ci(t, B(b) + 0.2, B(b) + 0.9)}%`, background: c }} />)}</div>
          <div style={{ display: "flex", gap: 22, marginTop: 16, fontSize: 25, fontWeight: 700 }}>{rows.map(([n, v, c]) => <span key={n}><span style={{ color: c === "#B9B2A8" ? MUTE : c }}>●</span> {n} {v}%</span>)}</div>
        </div>); })}
      <div style={{ position: "absolute", left: 70, top: 960, fontFamily: INTER, fontSize: 22, color: MUTE, opacity: ci(t, B(30), B(30.5)) }}>Real-time clicks · example data</div>
    </div>
  );
};
const WS: [string, string, string, string][] = [["Bluepeak", "#3B82F6", "go.bluepeak.com/spring", "184 links"], ["Northwind", "#22C55E", "", "96 links"], ["Maple & Co", "#F97316", "go.maple.co/launch", "142 links"]];
const Team: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const split = ci(t, B(40.6), B(41.6)), out = ci(t, B(47.4), B(48.2), 0, 1, Easing.in(Easing.cubic));
  const on = t < B(43) ? 1 : t < B(45) ? 1 : t < B(46.5) ? 2 : 0;
  return (
    <>
      {WS.map(([n, c, link, cnt], i) => { const dx = (i - 1) * 640 * split; const sel = on === i && t > B(42.6); return (
        <div key={n} style={{ position: "absolute", left: 960 - 300 + dx, top: 320 + out * 900, width: 600, height: 470, borderRadius: 28, background: "#fff", border: `3px solid ${sel ? OR : "transparent"}`, boxShadow: "0 40px 90px -40px rgba(40,30,20,0.5)", opacity: Math.min(1, split * 3), fontFamily: INTER }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "30px 34px" }}><span style={{ width: 66, height: 66, borderRadius: 33, background: c, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 30 }}>{n[0]}</span><div><div style={{ fontSize: 38, fontWeight: 700 }}>{n}</div><div style={{ fontSize: 24, color: MUTE }}>Workspace</div></div></div>
          {i !== 1 && <div style={{ position: "absolute", left: 40, right: 40, top: 180, height: 120, borderRadius: 60, border: `4px solid ${OR}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 34 }}>{link}</div>}
          <div style={{ position: "absolute", left: 36, bottom: 30, fontSize: 26, color: MUTE, fontWeight: 600 }}>{cnt}</div>
        </div>); })}
      {t > B(42) && t < B(46.6) && <Cursor x={kf(t, [[B(42), 1300], [B(42.6), 1000], [B(45), 1000], [B(45.6), 1640]])} y={kf(t, [[B(42), 950], [B(42.6), 400], [B(45), 400], [B(45.6), 400]])} click={Math.max(ci(t, B(42.6), B(42.6) + 0.3), ci(t, B(45.6), B(45.6) + 0.3))} />}
    </>
  );
};
const Chat: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const k = sp(t, B(47.8), fps, 18, 180), out = ci(t, B(56), B(56.8));
  const sent = t > B(50.6), reply = t > B(51.2);
  return (
    <div style={{ position: "absolute", left: 210, top: 110, width: 1500, height: 880, borderRadius: 30, background: "#FBFAF7", boxShadow: "0 50px 110px -50px rgba(40,30,20,0.5), 0 0 0 1px rgba(0,0,0,0.06)", fontFamily: INTER, transform: `translateY(${(1 - k) * 900}px) scale(${0.96 + k * 0.04})`, opacity: 1 - out }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "26px 36px", borderBottom: "1px solid #ECE7DF" }}><span style={{ width: 16, height: 16, borderRadius: 8, background: GREEN }} /><span style={{ fontSize: 30, fontWeight: 700 }}>Your AI assistant</span><span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, fontSize: 24, color: MUTE, fontWeight: 600 }}>connected to <Img src={staticFile("lmv/logo.svg")} style={{ height: 26 }} /> via MCP</span></div>
      {sent && <div style={{ position: "absolute", right: 40, top: 140, maxWidth: 900, padding: "20px 28px", borderRadius: "26px 26px 6px 26px", background: INK, color: "#fff", fontSize: 36, fontWeight: 500, transform: `translateY(${(1 - sp(t, B(50.6), fps, 16, 240)) * 500}px)` }}>{PROMPT}</div>}
      {reply && <div style={{ position: "absolute", left: 40, top: 290, fontSize: 36, fontWeight: 600, opacity: ci(t, B(51.2), B(51.5)) }}>Done. Here's your tagged link:</div>}
      {t > B(52.6) && <div style={{ position: "absolute", left: 40, top: 640, display: "flex", gap: 14 }}>{["utm_source=newsletter", "utm_medium=email", "utm_campaign=spring"].map((c, i) => <span key={c} style={{ padding: "10px 18px", borderRadius: 12, background: K.orangeBg, color: OR, fontFamily: MONO, fontSize: 26, fontWeight: 600, transform: `scale(${sp(t, B(52.6) + i * 0.15, fps, 16, 260)})` }}>{c}</span>)}</div>}
      {t > B(54) && <div style={{ position: "absolute", left: 40, top: 720, fontSize: 32, fontWeight: 700, color: "#15803D", opacity: ci(t, B(54), B(54.4)) }}>✓ Created in your linkutm workspace</div>}
    </div>
  );
};
const End: React.FC<{ t: number }> = ({ t }) => {
  const dx = geom(t).x, lk = t < B(57.9) ? 0 : Math.max(0, Math.min(1, (dx - 410) / 1100)), line = "Every link, clean and counted.";
  const typed = line.slice(0, Math.max(0, Math.floor((t - B(59.5)) * 18)));
  return (
    <>
      <div style={{ position: "absolute", left: 410, top: 431, width: 1100, height: 218, clipPath: `inset(0 ${(1 - lk) * 100}% 0 0)` }}><Img src={staticFile("lmv/logo.svg")} style={{ width: 1100, height: 218 }} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center", fontFamily: INTER, fontWeight: 600, fontSize: 70, color: INK, letterSpacing: -1.5 }}>{typed}<span style={{ display: "inline-block", width: 4, height: 66, marginLeft: 5, background: OR, verticalAlign: "middle", opacity: t > B(59.5) && Math.sin(t * 12) > 0 ? 1 : 0 }} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center", fontFamily: INTER, fontWeight: 600, fontSize: 44, color: MUTE, opacity: ci(t, B(62), B(62.5)), transform: `translateY(${(1 - ci(t, B(62), B(62.5))) * 16}px)` }}>linkutm.com</div>
    </>
  );
};

// ---------- master ----------
const Film: React.FC<{ fps: number }> = ({ fps }) => {
  const t = useCurrentFrame() / fps;
  const c = cam(t);
  return (
    <AbsoluteFill style={{ background: CANVAS, overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(60,50,40,0.07) 1.4px, transparent 1.4px)", backgroundSize: "30px 30px" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: WD, height: HT, transformOrigin: "0 0", transform: `translate(${WD / 2}px, ${HT / 2}px) scale(${c.z}) translate(${-c.x}px, ${-c.y}px)` }}>
        {t > B(20) - 0.05 && t < B(28) + 0.6 && <Menu t={t} fps={fps} />}
        {t > B(28) && t < B(40.6) && <Clicks t={t} fps={fps} />}
        {t > B(40.4) && t < B(48.3) && <Team t={t} fps={fps} />}
        {t > B(47.6) && t < B(57) && <Chat t={t} fps={fps} />}
        <Hero t={t} fps={fps} />
        {t > B(4.4) && t < B(5.6) && <Cursor x={kf(t, [[B(4.4), 1750], [B(5), 1560]])} y={kf(t, [[B(4.4), 900], [B(5), 250]])} click={ci(t, B(5), B(5) + 0.35)} />}
        {t > B(13.6) && t < B(16.5) && <Cursor x={kf(t, [[B(13.6), 1880], [B(14.2), 1830], [B(15.8), 1430], [B(16), 1420]])} y={kf(t, [[B(13.6), 820], [B(14.2), 545], [B(16), 545]])} click={Math.max(t > B(14.2) && t < B(15.8) ? 0.5 : 0, ci(t, B(16) - 0.05, B(16) + 0.3))} />}
        {t > B(57.2) && <End t={t} />}
      </div>
      <Audio src={staticFile("thelink/music_v2.wav")} />
    </AbsoluteFill>
  );
};
export const TheLinkV2Comp: React.FC = () => (
  <>
    <Composition id="TheLinkV2" component={Film} defaultProps={{ fps: 60 }} durationInFrames={Math.round(DUR2 * 60)} fps={60} width={WD} height={HT} />
    <Composition id="TheLinkV2-240" component={Film} defaultProps={{ fps: 240 }} durationInFrames={Math.round(DUR2 * 240)} fps={240} width={WD} height={HT} />
  </>
);
