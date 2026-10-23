// "The Link" — linkutm launch film (16:9, music only, drift phonk ≈129 BPM). Built from the Prompt Motion brief skeleton
// (content-studio/templates/briefs/linkutm-launch-film.md): ONE hero element — an orange-outlined link pill — never leaves the
// screen and morphs into every scene (ugly URL → UTM builder → naming rule → short link → QR → café menu → live clicks →
// 3 workspaces → the full stop of the wordmark). 2D only; no glows/particles/crossfades/shake. Claims = clicks only.
import { AbsoluteFill, Audio, Composition, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import React from "react";
import QRCode from "qrcode";
import { INTER, K, MONO, Cursor } from "../lmv/ui";
import { WORLD_D, WORLD_W } from "../world-map-data";

const WD = 1920, HT = 1080, DUR = 15.6;
const BEAT = 0.4644, PH = 0.176, B = (n: number) => PH + n * BEAT;
const OR = K.orange, INK = "#1C1C1C", CANVAS = "#F7F4EF", MUTE = "#7A7670", GREEN = "#16A34A", RED = "#E5383B";
const EZ = Easing.bezier(0.16, 1, 0.3, 1), IO = Easing.bezier(0.65, 0, 0.35, 1);
const ci = (t: number, a: number, b: number, x = 0, y = 1, e = EZ) => interpolate(t, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const sp = (t: number, a: number, fps: number, d = 18, s = 220) => (t < a ? 0 : spring({ frame: (t - a) * fps, fps, config: { damping: d, stiffness: s } }));
// piecewise eased keyframes: [[time, value], ...]
const kf = (t: number, k: [number, number][], e = IO) => { if (t <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (t <= k[i][0]) return k[i - 1][1] + (k[i][1] - k[i - 1][1]) * e((t - k[i - 1][0]) / (k[i][0] - k[i - 1][0])); return k[k.length - 1][1]; };
const kfLog = (t: number, k: [number, number][]) => Math.exp(kf(t, k.map(([a, v]) => [a, Math.log(v)] as [number, number])));

const UGLY = "https://www.yourbrand.com/collections/spring-sale-2026?utm_source=Facebook&utm_medium=Paid%20Social&utm_campaign=SPRING_sale_v2_FINAL&fbclid=IwAR3xQ8kz";
const TAGGED = "https://www.yourbrand.com/collections/spring-sale?utm_source=facebook&utm_medium=paid-social&utm_campaign=spring-sale";
const SHORT = "go.yourbrand.com/spring";
const QRM = (() => { const q = QRCode.create("https://go.yourbrand.com/spring", { errorCorrectionLevel: "M" }); const n = q.modules.size; const m: boolean[][] = []; for (let y = 0; y < n; y++) { m.push([]); for (let x = 0; x < n; x++) m[y].push(!!q.modules.get(x, y)); } return m; })();

// ---------- the hero pill: geometry over time (world coords = screen coords before the camera) ----------
type G = { x: number; y: number; w: number; h: number; r: number; fill: string };
const geom = (t: number): G => {
  const chars = Math.max(0, Math.min(UGLY.length, Math.floor((t - 0.05) * 165)));
  const lines = Math.max(1, Math.ceil(chars / 58));
  // S1 typing → S2 card → S3 long pill → collapse → QR square → menu → pill w/ counter → (split) → merge → dot
  const w = kf(t, [[0, Math.min(1380, 220 + chars * 22)], [B(2), 1380], [B(2) + 0.4, 1120], [B(6), 1120], [B(6) + 0.4, 1560], [B(7), 1560], [B(7.85), 720], [B(8), 720], [B(8) + 0.35, 460], [B(10), 460], [B(10) + 0.45, 330], [B(14), 330], [B(14) + 0.45, 760], [B(20), 760], [B(20.6), 520], [B(24), 520], [B(24.8), 520], [B(25.6), 34]]);
  const h = kf(t, [[0, 40 + lines * 52 + 34], [B(2), 40 + 3 * 52 + 34], [B(2) + 0.4, 600], [B(6), 600], [B(6) + 0.4, 116], [B(8), 116], [B(8) + 0.35, 460], [B(10), 460], [B(10) + 0.45, 330], [B(14), 330], [B(14) + 0.45, 116], [B(24.8), 116], [B(25.6), 34]]);
  const r = kf(t, [[B(2), 40], [B(2) + 0.4, 26], [B(6), 26], [B(6) + 0.4, 58], [B(8), 58], [B(8) + 0.35, 30], [B(14), 24], [B(14) + 0.45, 58], [B(25.6), 17]]);
  const x = kf(t, [[B(10), 960], [B(10) + 0.45, 760], [B(14), 760], [B(14) + 0.45, 960], [B(25.6), 960], [B(26.4), 1336]]);
  const y = kf(t, [[B(10), 540], [B(10) + 0.45, 500], [B(14), 500], [B(14) + 0.45, 250], [B(20), 250], [B(20.6), 560], [B(25.6), 560], [B(26.4), 545]]);
  return { x, y, w, h, r, fill: t > B(25.3) ? OR : "#FFFFFF" };
};
// camera: focus + log zoom
const cam = (t: number) => ({
  z: kfLog(t, [[0, 1.75], [0.9, 1.3], [B(2), 1.3], [B(2) + 0.45, 1.45], [B(4), 1.45], [B(4.6), 1.5], [B(5.8), 1.5], [B(6) + 0.4, 1.15], [B(7), 1.15], [B(7.9), 1.6], [B(8), 1.6], [B(8) + 0.4, 1.85], [B(10), 1.85], [B(10) + 0.5, 1.12], [B(14), 1.12], [B(14) + 0.5, 1.12], [B(20), 1.12], [B(20.6), 1.0], [B(24), 1.0], [B(24.8), 1.25], [B(25.6), 1.6], [B(26.4), 1.15], [DUR, 1.2]]),
  x: kf(t, [[B(4), 960], [B(4.6), 950], [B(5.8), 950], [B(6) + 0.4, 960], [B(10), 960], [B(10) + 0.5, 1095], [B(14), 1095], [B(14) + 0.5, 960], [B(25.6), 960], [B(26.4), 1000]]),
  y: kf(t, [[B(4), 540], [B(4.6), 420], [B(5.8), 420], [B(6) + 0.4, 540], [B(10), 540], [B(10) + 0.5, 550], [B(14), 550], [B(14) + 0.5, 600], [B(20), 600], [B(20.6), 560], [B(25.6), 560], [B(26.4), 640]]),
});

// ---------- pill contents ----------
const Chip: React.FC<{ label: string; val: string; k: number; tone?: "ok" | "bad" | "plain" }> = ({ label, val, k, tone = "plain" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, height: 70, padding: "0 22px", borderRadius: 14, border: `1.5px solid ${tone === "bad" ? RED : K.border}`, background: tone === "bad" ? "#FEF2F2" : "#fff", transform: `translateY(${(1 - k) * -60}px)`, opacity: Math.min(1, k * 2) }}>
    <span style={{ width: 120, fontSize: 21, color: MUTE, fontWeight: 600 }}>{label}</span>
    <span style={{ fontFamily: MONO, fontSize: 26, color: tone === "bad" ? RED : INK, fontWeight: 600 }}>{val}</span>
    {tone === "ok" && <span style={{ marginLeft: "auto", width: 32, height: 32, borderRadius: 16, background: "#DCFCE7", color: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 800 }}>✓</span>}
  </div>
);
const Builder: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const fb = t > B(4), fbType = "FB".slice(0, Math.max(0, Math.floor((t - B(4)) * 8))), bad = t > B(5) && t < B(5.6), fixed = t > B(5.6);
  const shake = bad ? Math.sin((t - B(5)) * 60) * 8 * (1 - (t - B(5)) / 0.6) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, padding: "36px 44px", opacity: ci(t, B(2) + 0.2, B(2) + 0.45) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}><Img src={staticFile("lmv/logo.svg")} style={{ height: 30 }} /><span style={{ fontSize: 22, color: MUTE, fontWeight: 600 }}>· Create link</span>
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 10, border: `1.5px solid ${t > B(2) + 0.55 ? OR : K.border}`, background: t > B(2) + 0.55 ? K.orangeBg : "#fff", fontSize: 21, fontWeight: 600 }}>Template · Spring sale</span></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 34 }}>
        <div style={{ transform: `translateX(${shake}px)` }}>
          {!fb ? <Chip label="Source" val="—" k={1} /> : <Chip label="Source" val={fixed ? "facebook" : fbType} k={1} tone={fixed ? "ok" : bad ? "bad" : "plain"} />}
        </div>
        <Chip label="Medium" val="paid-social" k={sp(t, B(3.5), fps, 16, 260)} tone={t > B(3.5) ? "ok" : "plain"} />
        <Chip label="Campaign" val="spring-sale" k={sp(t, B(3), fps, 16, 260)} tone={t > B(3) ? "ok" : "plain"} />
      </div>
      {t > B(5) && <div style={{ position: "absolute", left: 590, top: 125, display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 10, background: fixed ? "#DCFCE7" : "#FEF3C7", color: fixed ? "#15803D" : "#B45309", fontSize: 19, fontWeight: 700, transform: `translateY(${(1 - sp(t, B(5), fps, 16, 260)) * 20}px)`, opacity: sp(t, B(5), fps, 16, 260) }}>{fixed ? "✓ Naming rule applied" : "Naming rule: use “facebook”"}</div>}
      {fb && t < B(5) && <div style={{ position: "absolute", left: 700, top: 134, display: "flex", alignItems: "center", gap: 8, fontSize: 18, color: MUTE }}><span style={{ width: 30, height: 30, borderRadius: 15, background: "#EC4899", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>PN</span>Priya is typing…</div>}
    </div>
  );
};
const Collapse: React.FC<{ t: number }> = ({ t }) => {
  const p = ci(t, B(7), B(7.85), 0, 1, (x) => x);
  const L = TAGGED.length;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 44px", whiteSpace: "nowrap", fontFamily: MONO, fontSize: 28, color: INK }}>
      {p < 0.75 && [...TAGGED].map((c, i) => { const d = ci(p, ((L - i) / L) * 0.6, ((L - i) / L) * 0.6 + 0.12); return <span key={i} style={{ display: "inline-block", width: `${(1 - d) * 0.6}em`, transform: `scale(${1 - d})`, opacity: 1 - d, color: i >= 25 ? OR : INK }}>{c}</span>; })}
      {p > 0.45 && <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 40, position: p < 0.75 ? "absolute" : "relative", left: p < 0.75 ? 44 : undefined }}>{[...SHORT].map((c, i) => { const k = ci(p, 0.45 + (i / SHORT.length) * 0.4, 0.5 + (i / SHORT.length) * 0.4); return <span key={i} style={{ display: "inline-block", opacity: k, transform: `translateY(${(1 - k) * 14}px)`, color: i < 16 ? INK : OR }}>{c}</span>; })}</span>}
    </div>
  );
};
const QRBuild: React.FC<{ t: number; size: number }> = ({ t, size }) => {
  const n = QRM.length, c = (size - 40) / n, rows = ci(t, B(8) + 0.12, B(10) - 0.1, 0, n, (x) => x);
  return (
    <svg width={size} height={size} style={{ position: "absolute", left: 0, top: 0 }}>
      {QRM.map((row, y) => row.map((on, x) => { if (!on) return null; const a = Math.max(0, Math.min(1, rows - y)); if (a <= 0) return null; return <rect key={x + "_" + y} x={20 + x * c + (c * (1 - a)) / 2} y={20 + y * c + (c * (1 - a)) / 2} width={(c + 0.4) * a} height={(c + 0.4) * a} rx={c * 0.18} fill={INK} />; }))}
    </svg>
  );
};
const Counter: React.FC<{ t: number }> = ({ t }) => {
  const v = Math.round(interpolate(ci(t, B(14.6), B(19.2), 0, 1, (x) => x), [0, 1], [0, 1284]));
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 34px", gap: 18, opacity: ci(t, B(14) + 0.25, B(14) + 0.5) }}>
      <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 36, color: INK }}>go.yourbrand.com/<span style={{ color: OR }}>spring</span></span>
      <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999, background: "#111", color: "#fff", fontWeight: 700, fontSize: 26 }}><span style={{ width: 11, height: 11, borderRadius: 6, background: RED, opacity: Math.sin(t * 7) > 0 ? 1 : 0.35 }} />{v.toLocaleString("en-US")} clicks</span>
    </div>
  );
};
const Hero: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const g = geom(t);
  const typed = UGLY.slice(0, Math.max(0, Math.floor((t - 0.05) * 165)));
  return (
    <div style={{ position: "absolute", left: g.x - g.w / 2, top: g.y - g.h / 2, width: g.w, height: g.h, borderRadius: g.r, background: g.fill, border: `${t > B(25.3) ? 0 : 3}px solid ${OR}`, boxShadow: t > B(25.3) ? "none" : "0 26px 60px -30px rgba(40,30,20,0.4)", overflow: "hidden", fontFamily: INTER, color: INK, boxSizing: "border-box" }}>
      {t < B(2) + 0.25 && <div style={{ position: "absolute", left: 40, right: 40, top: 30, fontFamily: MONO, fontSize: 30, lineHeight: "52px", wordBreak: "break-all", opacity: 1 - ci(t, B(2) + 0.05, B(2) + 0.25) }}>{typed}<span style={{ display: "inline-block", width: 3, height: 34, background: OR, verticalAlign: "middle", opacity: Math.sin(t * 14) > 0 ? 1 : 0 }} /></div>}
      {t >= B(2) && t < B(6) + 0.3 && <div style={{ position: "absolute", left: 0, top: 0, width: 1120, height: 600, opacity: 1 - ci(t, B(6), B(6) + 0.25) }}><Builder t={t} fps={fps} /></div>}
      {t >= B(6) + 0.15 && t < B(8) + 0.25 && <div style={{ position: "absolute", inset: 0, opacity: ci(t, B(6) + 0.15, B(6) + 0.4) * (1 - ci(t, B(8) + 0.05, B(8) + 0.25)) }}><Collapse t={t} /></div>}
      {t >= B(8) + 0.1 && t < B(14) + 0.3 && <div style={{ position: "absolute", left: (g.w - Math.min(g.w, g.h)) / 2, top: (g.h - Math.min(g.w, g.h)) / 2, width: Math.min(g.w, g.h), height: Math.min(g.w, g.h), opacity: 1 - ci(t, B(14), B(14) + 0.25) }}><QRBuild t={t} size={Math.min(g.w, g.h)} /></div>}
      {t >= B(14) + 0.2 && t < B(20.6) && <div style={{ position: "absolute", inset: 0, opacity: 1 - ci(t, B(20.2), B(20.5)) }}><Counter t={t} /></div>}
      {t >= B(20.4) && t < B(25.2) && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 700, fontSize: 30, opacity: ci(t, B(20.5), B(20.8)) * (1 - ci(t, B(24.9), B(25.2))) }}>go.<span style={{ color: OR }}>northwind</span>.co/menu</div>}
    </div>
  );
};

// ---------- supporting scenes (world layer) ----------
const Menu: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const k = sp(t, B(10), fps, 18, 160), out = ci(t, B(14) - 0.1, B(14) + 0.35, 0, 1, Easing.in(Easing.cubic));
  const swapped = t > B(12.5), sw = ci(t, B(12.3), B(12.9));
  return (
    <>
      <div style={{ position: "absolute", left: 760 - 280, top: 160, width: 560, height: 780, borderRadius: 10, background: "#FFFDF8", boxShadow: "0 40px 80px -30px rgba(40,30,20,0.45)", transform: `translateY(${(1 - k) * 700 + out * 900}px) rotate(-2deg)`, zIndex: 0, fontFamily: INTER, textAlign: "center" }}>
        <div style={{ marginTop: 40, fontFamily: "Georgia, serif", fontSize: 54, fontWeight: 700, letterSpacing: 3 }}>CAFÉ LUNA</div>
        <div style={{ fontSize: 22, color: MUTE, letterSpacing: 4, marginTop: 6 }}>SPRING MENU</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, fontSize: 24, fontWeight: 600 }}>Scan to order</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, fontSize: 18, color: MUTE }}>printed · 2,000 copies</div>
      </div>
      <div style={{ position: "absolute", left: 1090, top: 330, width: 620, padding: "26px 30px", borderRadius: 18, background: "#fff", boxShadow: "0 30px 70px -30px rgba(40,30,20,0.4), 0 0 0 1px rgba(0,0,0,0.06)", fontFamily: INTER, transformOrigin: "0 50%", transform: `translateX(${(1 - sp(t, B(11), fps, 18, 200)) * 900 + out * 1200}px) scale(1.3)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Img src={staticFile("lmv/logo.svg")} style={{ height: 26 }} /><span style={{ fontSize: 20, color: MUTE, fontWeight: 600 }}>· Dynamic QR</span></div>
        <div style={{ fontSize: 18, color: MUTE, fontWeight: 600, marginTop: 22 }}>Destination</div>
        <div style={{ position: "relative", height: 62, marginTop: 8, borderRadius: 12, border: `1.5px solid ${t > B(12) && t < B(13) ? OR : K.border}`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 18, top: 15, fontFamily: MONO, fontSize: 25, transform: `translateY(${-sw * 60}px)`, opacity: 1 - sw }}>yourbrand.com/spring-menu</div>
          <div style={{ position: "absolute", left: 18, top: 15, fontFamily: MONO, fontSize: 25, transform: `translateY(${(1 - sw) * 60}px)`, color: OR, fontWeight: 600 }}>yourbrand.com/summer-menu</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18, fontSize: 21, fontWeight: 700, color: swapped ? "#15803D" : MUTE, opacity: ci(t, B(13), B(13.3)) }}>✓ Same printed QR · new page</div>
      </div>
      {t > B(11.4) && t < B(13.4) && <Cursor x={kf(t, [[B(11.4), 1500], [B(12), 1600]])} y={kf(t, [[B(11.4), 760], [B(12), 520]])} click={ci(t, B(12), B(12) + 0.35)} />}
    </>
  );
};
const nePt = (lon: number, lat: number): [number, number] => { const l = (lon * Math.PI) / 180, p = (lat * Math.PI) / 180, p2 = p * p, p4 = p2 * p2; const x = l * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4))); const y = p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4))); return [500 + x * 182.8, 260 - y * 182.8]; };
const SPOTS: [string, number, number, string, number, number][] = [["India", 78, 21, "412", 15, 1], ["United States", -98, 39, "236", 16, 1], ["United Kingdom", -2, 53, "98", 17, -1], ["Germany", 10, 51, "61", 17.5, 1]];
const MapScene: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const k = ci(t, B(14) + 0.1, B(14) + 0.6), out = ci(t, B(20), B(20.5));
  const MW = 1300, s = MW / WORLD_W, ox = 960 - MW / 2, oy = 360;
  const dev = ci(t, B(18), B(19));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: WD, height: HT, opacity: k * (1 - out), transform: `translateY(${(1 - k) * 60 + out * 80}px)` }}>
      <svg width={WD} height={HT} style={{ position: "absolute", left: 0, top: 0 }}><g transform={`translate(${ox} ${oy}) scale(${s})`}><path d={WORLD_D} fill="#E3DED5" stroke="#F7F4EF" strokeWidth={0.6 / s} /></g></svg>
      {SPOTS.map(([n, lon, lat, v, b, side]) => { const [px, py] = nePt(lon, lat); const X = ox + px * s, Y = oy + py * s, kk = sp(t, B(b), fps, 14, 260); if (t < B(b)) return null; return (
        <React.Fragment key={n}>
          <div style={{ position: "absolute", left: X - 11, top: Y - 11, width: 22, height: 22, borderRadius: 11, background: OR, border: "3px solid #fff", transform: `scale(${kk})`, boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }} />
          <div style={{ position: "absolute", left: side > 0 ? X + 18 : undefined, right: side < 0 ? WD - X + 18 : undefined, top: Y - (side < 0 ? 52 : 22), padding: "6px 14px", borderRadius: 999, background: "#fff", boxShadow: "0 10px 26px -12px rgba(0,0,0,0.35)", fontFamily: INTER, fontSize: 21, fontWeight: 700, whiteSpace: "nowrap", opacity: kk, transform: `translateX(${(1 - kk) * -12}px)` }}>{n} <span style={{ color: OR }}>{v}</span></div>
        </React.Fragment>); })}
      <div style={{ position: "absolute", left: 960 - 330, top: 930, width: 660, fontFamily: INTER, opacity: ci(t, B(18), B(18.3)) }}>
        <div style={{ display: "flex", height: 30, borderRadius: 15, overflow: "hidden", background: "#E3DED5" }}><div style={{ width: `${72 * dev}%`, background: INK }} /><div style={{ width: `${28 * dev}%`, background: OR }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 21, fontWeight: 700 }}><span>Mobile 72%</span><span style={{ color: MUTE, fontWeight: 500, fontSize: 17 }}>live clicks · example data</span><span style={{ color: OR }}>Desktop 28%</span></div>
      </div>
    </div>
  );
};
const WS: [string, string, string][] = [["Bluepeak", "#3B82F6", "go.bluepeak.com/spring"], ["Northwind", "#22C55E", ""], ["Maple & Co", "#F97316", "go.maple.co/launch"]];
const Team: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  const split = ci(t, B(20.6), B(21.4)), merge = ci(t, B(24), B(24.8), 0, 1, Easing.in(Easing.cubic));
  const on = t < B(22) ? 1 : t < B(23) ? 0 : 2;
  const off = (1 - merge) * split;
  return (
    <>
      {WS.map(([n, c, link], i) => { const dx = (i - 1) * 600 * off; const sel = on === i && t > B(21.5); return (
        <div key={n} style={{ position: "absolute", left: 960 - 280 + dx, top: 400, width: 560, height: 330, borderRadius: 22, background: "#fff", border: `2px solid ${sel ? OR : "transparent"}`, boxShadow: "0 30px 70px -32px rgba(40,30,20,0.45)", opacity: Math.min(1, split * 3) * (i === 1 ? 1 : 1 - merge), zIndex: 0, fontFamily: INTER }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 26px" }}><span style={{ width: 44, height: 44, borderRadius: 22, background: c, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20 }}>{n[0]}</span><div><div style={{ fontSize: 26, fontWeight: 700 }}>{n}</div><div style={{ fontSize: 17, color: MUTE }}>Workspace</div></div></div>
          {i !== 1 && <div style={{ position: "absolute", left: 20, right: 20, top: 115, height: 116, borderRadius: 58, border: `3px solid ${OR}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 28 }}>{link}</div>}
          <div style={{ position: "absolute", left: 26, bottom: 22, fontSize: 18, color: MUTE }}>{["184 links", "96 links", "142 links"][i]}</div>
        </div>); })}
      {t > B(21.6) && t < B(23.6) && <Cursor x={kf(t, [[B(21.6), 1200], [B(22), 980], [B(22.6), 980], [B(23), 1560]])} y={kf(t, [[B(21.6), 900], [B(22), 450], [B(22.6), 450], [B(23), 450]])} click={Math.max(ci(t, B(22), B(22) + 0.3), ci(t, B(23), B(23) + 0.3))} />}
    </>
  );
};
const End: React.FC<{ t: number }> = ({ t }) => {
  const lk = ci(t, B(25.6), B(26.3)), line = "Every link, clean and counted.";
  const typed = line.slice(0, Math.max(0, Math.floor((t - B(27.3)) * 20)));
  return (
    <>
      <div style={{ position: "absolute", left: 960 - 405, top: 545 - 90, width: 810, height: 161, clipPath: `inset(0 ${(1 - lk) * 100}% 0 0)` }}><Img src={staticFile("lmv/logo.svg")} style={{ width: 810, height: 161 }} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: INTER, fontWeight: 600, fontSize: 52, color: INK, letterSpacing: -1 }}>{typed}<span style={{ display: "inline-block", width: 3, height: 50, marginLeft: 4, background: OR, verticalAlign: "middle", opacity: t > B(27.3) && Math.sin(t * 12) > 0 ? 1 : 0 }} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, textAlign: "center", fontFamily: INTER, fontWeight: 600, fontSize: 32, color: MUTE, opacity: ci(t, B(29.5), B(29.9)), transform: `translateY(${(1 - ci(t, B(29.5), B(29.9))) * 14}px)` }}>linkutm.com</div>
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
        {t > B(10) - 0.05 && t < B(14) + 0.6 && <Menu t={t} fps={fps} />}
        {t > B(14) && t < B(20.6) && <MapScene t={t} fps={fps} />}
        {t > B(20.4) && t < B(25) && <Team t={t} fps={fps} />}
        <Hero t={t} fps={fps} />
        {t > B(2) + 0.1 && t < B(2) + 0.9 && <Cursor x={kf(t, [[B(2) + 0.1, 1700], [B(2) + 0.5, 1370]])} y={kf(t, [[B(2) + 0.1, 800], [B(2) + 0.5, 300]])} click={ci(t, B(2) + 0.5, B(2) + 0.8)} />}
        {t > B(6.6) && t < B(8.4) && <Cursor x={kf(t, [[B(6.6), 1800], [B(7), 1735], [B(7.85), 1320], [B(8), 1290]])} y={kf(t, [[B(6.6), 760], [B(7), 545], [B(8), 545]])} click={Math.max(t > B(7) && t < B(7.85) ? 0.5 : 0, ci(t, B(8) - 0.05, B(8) + 0.25))} />}
        {t > B(25.5) && <End t={t} />}
      </div>
      <Audio src={staticFile("thelink/music.wav")} />
    </AbsoluteFill>
  );
};
export const TheLinkComp: React.FC = () => (
  <>
    <Composition id="TheLink" component={Film} defaultProps={{ fps: 60 }} durationInFrames={Math.round(DUR * 60)} fps={60} width={WD} height={HT} />
    <Composition id="TheLink240" component={Film} defaultProps={{ fps: 240 }} durationInFrames={Math.round(DUR * 240)} fps={240} width={WD} height={HT} />
  </>
);
