// "The three-sources problem" — 9:16 ~27 s linkutm reel. No face: bright, clean product motion graphics.
// Hook report (3 Facebook rows) → teammates type 3 spellings → split bars vs the real total → real linkutm UTM dialog
// (template + lowercase rule) → rows merge into one → free plan CTA. Spreadsheet-cell captions. Logo untouched on a white plate.
// Claims checked on linkutm.com/pricing: templates on every plan, UTM Rules = naming conventions; Free = 25 links/mo, no card.
import React from "react";
import { AbsoluteFill, Audio, Composition, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { UtmDialog, Cursor } from "../lmv/ui";
import { DUR, W } from "./data";

const { fontFamily: INTER } = loadInter("normal", { weights: ["500", "600", "700", "800", "900"], subsets: ["latin"] });
const { fontFamily: MONO } = loadMono("normal", { weights: ["500", "700"], subsets: ["latin"] });
const FPS = 30, WD = 1080, HT = 1920;
const OR = "#F2541B", INK = "#1C1C1C", GREEN = "#16A34A", BG = "#F6F3EE";
const EZ = Easing.bezier(0.22, 1, 0.36, 1);
const ci = (t: number, a: number, b: number, x = 0, y = 1, e = EZ) => interpolate(t, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const sp = (t: number, a: number, d = 13, s = 210) => (t < a ? 0 : spring({ frame: (t - a) * FPS, fps: FPS, config: { damping: d, stiffness: s } }));
const kfx = (t: number, k: [number, number][], e: (x: number) => number = Easing.inOut(Easing.cubic)) => { if (t <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (t <= k[i][0]) return k[i - 1][1] + (k[i][1] - k[i - 1][1]) * e((t - k[i - 1][0]) / (k[i][0] - k[i - 1][0])); return k[k.length - 1][1]; };
const T = (w: string, n = 0) => { let k = 0; for (const x of W) if (x[2].toLowerCase().replace(/[^a-z0-9]/g, "") === w) { if (k === n) return x[0]; k++; } return 0; };
const typed = (s: string, t: number, a: number, cps = 14) => s.slice(0, Math.max(0, Math.min(s.length, Math.floor((t - a) * cps))));

// --- the three Facebook rows (same numbers everywhere) ---
const FB: [string, number, string][] = [["facebook", 412, "#3B82F6"], ["Facebook", 287, "#8B5CF6"], ["FB", 135, "#EC4899"]];
const TOTAL = 834;

const Studio: React.FC<{ t: number; px?: number }> = ({ t, px = 0 }) => (
  <AbsoluteFill style={{ background: BG }}>
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.045) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.045) 2px, transparent 2px)", backgroundSize: "72px 72px", backgroundPosition: `${-px * 0.3}px ${-t * 6}px` }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.9) 0%, rgba(246,243,238,0) 65%)" }} />
  </AbsoluteFill>
);
const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => <div style={{ position: "absolute", background: "#fff", borderRadius: 28, boxShadow: "0 40px 80px -30px rgba(40,20,0,0.35), 0 0 0 1px rgba(0,0,0,0.05)", fontFamily: INTER, color: INK, ...style }}>{children}</div>;

// Report table: other rows + the 3 Facebook rows; merge = 0..1 collapses them into one "facebook 834" row
const Report: React.FC<{ t: number; hl: number; merge: number; title?: string }> = ({ t, hl, merge, title = "Traffic by source" }) => {
  const rows: [string, number][] = [["google", 1904], ["(direct)", 1288], ["newsletter", 466]];
  const RH = 112;
  return (
    <Card style={{ left: 50, top: 450, width: 980, padding: "40px 44px 34px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FFF1E8", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width={24} height={24} viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke={OR} strokeWidth={2.4} fill="none" strokeLinecap="round" /></svg></div>
        <div><div style={{ fontSize: 44, fontWeight: 800 }}>{title}</div><div style={{ fontSize: 26, color: "#8A8A8A", fontWeight: 500 }}>Analytics report · Last 30 days</div></div>
      </div>
      <div style={{ display: "flex", fontSize: 24, fontWeight: 700, color: "#9A9A9A", letterSpacing: 1.5, margin: "30px 0 8px", padding: "0 16px" }}><span style={{ flex: 1 }}>SESSION SOURCE</span><span>SESSIONS</span></div>
      <div style={{ position: "relative", height: RH * (rows.length + 3 - 2 * merge) }}>
        {rows.slice(0, 2).map(([n, v], i) => <Row key={n} y={i * RH} n={n} v={v} />)}
        {FB.map(([n, v, c], i) => {
          const y = 2 * RH + i * RH * (1 - merge);
          const shownN = merge > 0.6 ? "facebook" : n, shownV = merge > 0.6 ? Math.round(interpolate(merge, [0.6, 1], [412, TOTAL], { extrapolateLeft: "clamp" })) : v;
          if (merge > 0.6 && i > 0) return null;
          return <Row key={i} y={y} n={shownN} v={shownV} color={merge > 0.6 ? GREEN : c} hl={merge > 0.6 ? merge : hl} jig={hl * Math.sin(t * 9 + i * 2) * 4 * (1 - merge)} big={merge > 0.6} />;
        })}
        <Row y={RH * (5 - 2 * merge)} n={rows[2][0]} v={rows[2][1]} />
      </div>
      {hl > 0 && merge < 0.3 && <div style={{ position: "absolute", right: -22, top: 200 + 2 * RH, width: 40, height: RH * 3 - 10, border: `6px solid ${OR}`, borderLeft: "none", borderRadius: "0 18px 18px 0", opacity: hl * (1 - merge * 3) }} />}
    </Card>
  );
};
const Row: React.FC<{ y: number; n: string; v: number; color?: string; hl?: number; jig?: number; big?: boolean }> = ({ y, n, v, color, hl = 0, jig = 0, big }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, height: 100, display: "flex", alignItems: "center", padding: "0 20px", borderRadius: 18, background: color && hl ? `${color}${big ? "22" : "16"}` : "transparent", border: color && hl ? `3px solid ${color}` : "3px solid transparent", transform: `translateX(${jig}px) scale(${big ? 1.03 : 1})`, fontSize: 46, fontWeight: color ? 800 : 600 }}>
    {color && <span style={{ width: 16, height: 16, borderRadius: 8, background: color, marginRight: 16 }} />}
    <span style={{ flex: 1, fontFamily: MONO, fontWeight: 700, color: color || "#444" }}>{n}</span><span style={{ fontVariantNumeric: "tabular-nums" }}>{v.toLocaleString("en-US")}</span>
  </div>
);

// Spreadsheet with 3 teammates typing the three spellings
const PEOPLE: [string, string][] = [["Priya", "#3B82F6"], ["Sam", "#8B5CF6"], ["Alex", "#EC4899"]];
const Sheet: React.FC<{ t: number }> = ({ t }) => {
  const at = [T("facebook", 1) - 0.35, T("facebook", 2) - 0.35, T("fb") - 0.35];
  const campaigns = ["spring_sale", "spring_sale", "spring_sale"];
  return (
    <Card style={{ left: 30, top: 440, width: 1020, padding: 0, overflow: "hidden", borderRadius: 24 }}>
      <div style={{ height: 70, background: "#1F7A4A", color: "#fff", display: "flex", alignItems: "center", padding: "0 26px", gap: 14, fontSize: 26, fontWeight: 700 }}><svg width={30} height={30} viewBox="0 0 24 24"><rect x={3} y={3} width={18} height={18} rx={3} fill="none" stroke="#fff" strokeWidth={2} /><path d="M3 9h18M3 15h18M9 3v18" stroke="#fff" strokeWidth={2} /></svg>campaign-links.xlsx<span style={{ marginLeft: "auto", display: "flex" }}>{PEOPLE.map(([p, c], i) => <span key={p} style={{ width: 44, height: 44, borderRadius: 22, background: c, border: "3px solid #1F7A4A", marginLeft: -10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, opacity: ci(t, at[i] - 0.4, at[i] - 0.1) }}>{p[0]}</span>)}</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "64px 0.9fr 1.15fr 1fr", fontSize: 26 }}>
        {["", "A  link", "B  utm_source", "C  utm_campaign"].map((h, i) => <div key={i} style={{ height: 64, background: "#F1F3F4", borderRight: "1px solid #DADCE0", borderBottom: "1px solid #DADCE0", display: "flex", alignItems: "center", padding: "0 14px", color: "#5F6368", fontWeight: 700, fontFamily: MONO, fontSize: 22 }}>{h}</div>)}
        {[0, 1, 2, 3, 4].map((r) => {
          const i = r - 1, live = i >= 0 && i < 3, s = live ? FB[i][0] : "", typing = live && t > at[i];
          const cells = [String(r + 1), live ? `go.co/ad-${i + 1}` : "", "", live ? campaigns[i] : ""];
          return cells.map((c, k) => {
            const isSrc = k === 2 && live, txt = isSrc ? typed(s, t, at[i], 12) : c;
            const active = isSrc && typing && t < at[i] + 1.1;
            return <div key={r + "_" + k} style={{ position: "relative", height: 124, borderRight: "1px solid #E3E5E8", borderBottom: "1px solid #E3E5E8", display: "flex", alignItems: "center", padding: "0 16px", fontFamily: k === 0 ? INTER : MONO, fontSize: k === 0 ? 24 : isSrc ? 40 : 28, fontWeight: isSrc ? 800 : 500, color: k === 0 ? "#80868B" : isSrc ? FB[i][2] : "#555", background: k === 0 ? "#F8F9FA" : active ? `${FB[i][2]}12` : "#fff", outline: active ? `4px solid ${FB[i][2]}` : undefined, outlineOffset: -4 }}>
              {txt}{active && Math.floor(t * 2.5) % 2 === 0 && <span style={{ width: 4, height: 44, background: FB[i][2], marginLeft: 3 }} />}
              {active && <span style={{ position: "absolute", left: 10, top: -30, padding: "3px 12px", borderRadius: 6, background: FB[i][2], color: "#fff", fontFamily: INTER, fontSize: 22, fontWeight: 700 }}>{PEOPLE[i][0]}</span>}
            </div>;
          });
        })}
      </div>
    </Card>
  );
};

// split bars vs the real total
const Bars: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const full = ci(t, T("full") - 0.2, T("full") + 0.3);
  const BW = 892, H = 170;
  return (
    <Card style={{ left: 50, top: 450, width: 980, padding: "44px 44px 50px" }}>
      <div style={{ fontSize: 44, fontWeight: 800 }}>Facebook, says your report</div>
      <div style={{ fontSize: 26, color: "#8A8A8A", fontWeight: 500, marginTop: 4 }}>Sessions, split by spelling</div>
      {FB.map(([n, v, c], i) => { const g = ci(t, a + 0.15 + i * 0.12, a + 0.8 + i * 0.12, 0, 1, Easing.out(Easing.back(1.4))); return (
        <div key={i} style={{ marginTop: 26 }}>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 800, marginBottom: 10 }}><span style={{ fontFamily: MONO, color: c }}>{n}</span><span style={{ marginLeft: "auto" }}>{Math.round(v * Math.min(1, g)).toLocaleString("en-US")}</span></div>
          <div style={{ position: "relative", height: 70, borderRadius: 16, background: "#F2EFEA" }}>
            <div style={{ width: (v / TOTAL) * BW * g, height: "100%", borderRadius: 14, background: c }} />
          </div>
        </div>); })}
      <div style={{ marginTop: 34, height: H, position: "relative" }}>
        <div style={{ fontSize: 38, fontWeight: 800, marginBottom: 10, opacity: full, display: "flex" }}>The full picture<span style={{ marginLeft: "auto", color: GREEN }}>{Math.round(TOTAL * full).toLocaleString("en-US")}</span></div>
        <div style={{ height: 70, width: BW, borderRadius: 16, border: `4px dashed ${GREEN}`, opacity: 0.25 + 0.75 * full, background: full > 0 ? `rgba(22,163,74,${0.12 * full})` : undefined, transform: `scale(${1 + 0.03 * Math.sin(t * 8) * full})` }} />
      </div>
    </Card>
  );
};

// spreadsheet-cell captions: chunk types into a highlighted cell, key word gets a green "fixed" fill
type Chunk = { a: number; b: number; words: [number, string][] };
const CH: Chunk[] = (() => { const out: Chunk[] = []; let cur: Chunk | null = null; W.forEach(([a, b, w], i) => { const p = W[i - 1]; const brk = !cur || /[.?!:]$/.test(p[2]) || /,$/.test(p[2]) && cur.words.length >= 3 || cur.words.length >= 5; if (brk) { cur = { a, b, words: [] }; out.push(cur); } cur!.words.push([a, w]); cur!.b = b; }); return out; })();
const KEYW = new Set(["three", "one", "facebook.", "fb.", "full", "picture.", "linkutm,", "template", "naming", "rules", "same.", "free.", "25"]);
const Captions: React.FC<{ t: number }> = ({ t }) => {
  const i = CH.findIndex((c, k) => t >= c.a - 0.06 && t < (CH[k + 1]?.a ?? c.b + 1.2) - 0.06);
  if (i < 0) return null; const c = CH[i]; const k = sp(t, c.a - 0.06, 14, 320);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1480, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ display: "flex", alignItems: "stretch", background: "#fff", borderRadius: 14, boxShadow: "0 18px 36px -10px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.08)", overflow: "hidden", transform: `translateY(${(1 - k) * 24}px)`, opacity: Math.min(1, k * 2) }}>
        <div style={{ width: 66, background: "#F1F3F4", borderRight: "1px solid #DADCE0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontWeight: 700, fontSize: 24, color: "#80868B" }}>{i + 1}</div>
        <div style={{ padding: "18px 28px", outline: `4px solid ${OR}`, outlineOffset: -4, fontFamily: INTER, fontWeight: 800, fontSize: 54, lineHeight: 1.15, color: INK, maxWidth: 840 }}>
          {c.words.map(([a, w], j) => { const on = t >= a - 0.04, key = KEYW.has(w.toLowerCase()); return <span key={j} style={{ opacity: on ? 1 : 0.25, background: key && on ? "rgba(22,163,74,0.18)" : "transparent", color: key && on ? GREEN : INK, borderRadius: 8, padding: key ? "0 6px" : 0, fontFamily: ["facebook.", "Facebook.", "FB."].includes(w) ? MONO : INTER }}>{w}{j < c.words.length - 1 ? " " : ""}</span>; })}
        </div>
      </div>
    </div>
  );
};

const Film: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const S2 = T("facebook", 1) - 0.9, S3 = T("three", 1) - 0.25, S4 = T("with") - 0.2, S5 = T("start") - 0.6;
  // hook title always on screen from frame 0
  const title = (txt: React.ReactNode, a: number, top = 220) => <div style={{ position: "absolute", left: 60, right: 60, top, textAlign: "center", fontFamily: INTER, fontWeight: 900, fontSize: 88, letterSpacing: -2, lineHeight: 1.02, color: INK, transform: `scale(${interpolate(sp(t, a, 11, 260), [0, 1], [a <= 0 ? 1 : 0.85, 1])})`, opacity: a <= 0 ? 1 : Math.min(1, sp(t, a, 11, 260) * 2) }}>{txt}</div>;
  let scene: React.ReactNode;
  if (t < S2) {
    const z = kfx(t, [[0, 1.12], [T("three") - 0.1, 1.0], [S2, 1.04]]);
    scene = <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 55%" }}>
      {title(<><span style={{ color: OR }}>3</span> Facebook<br />sources?</>, 0)}
      <Report t={t} hl={ci(t, T("three") - 0.1, T("three") + 0.3)} merge={0} />
      {t > T("one") - 0.1 && <div style={{ position: "absolute", left: 540, top: 1270, transform: `translate(-50%,0) scale(${sp(t, T("one") - 0.1, 9, 300)})`, padding: "16px 30px", borderRadius: 999, background: INK, color: "#fff", fontFamily: INTER, fontWeight: 800, fontSize: 40 }}>…for <span style={{ color: "#FFB089" }}>ONE</span> channel</div>}
    </AbsoluteFill>;
  } else if (t < S3) {
    const k = sp(t, S2, 14, 170);
    scene = <AbsoluteFill style={{ transform: `translateY(${(1 - k) * 700}px) rotate(${(1 - k) * 4}deg) scale(${kfx(t, [[S2, 1.0], [S3, 1.05]])})`, transformOrigin: "50% 50%" }}>
      {title(<>Same channel.<br /><span style={{ color: OR }}>3 spellings.</span></>, S2 + 0.1)}
      <Sheet t={t} />
    </AbsoluteFill>;
  } else if (t < S4) {
    const k = sp(t, S3, 14, 170);
    scene = <AbsoluteFill style={{ transform: `translateX(${(1 - k) * 1080}px) scale(${kfx(t, [[S3, 1.0], [S4, 1.05]])})` }}>
      {title(<>3 rows.<br /><span style={{ color: OR }}>0 full picture.</span></>, S3 + 0.1)}
      <Bars t={t} a={S3} />
    </AbsoluteFill>;
  } else if (t < S5) {
    // linkutm UTM dialog: template fills the fields, the lowercase rule fixes "Facebook"
    const k = sp(t, S4, 14, 160), tp = T("template"), nr = T("naming");
    const picked = t > tp + 0.25, typing = t > nr - 0.5;
    const srcTyped = typed("Facebook", t, nr - 0.5, 18), fixed = t > nr + 0.35;
    const v = { Template: picked ? "Facebook · Paid social" : "", Campaign: picked ? "spring_sale" : "", Source: typing ? (fixed ? "facebook" : srcTyped) : picked ? "facebook" : "", Medium: picked ? "paid_social" : "" };
    const cur = { x: kfx(t, [[S4 + 0.3, 900], [tp - 0.1, 600], [nr - 0.6, 600], [nr - 0.3, 560]]), y: kfx(t, [[S4 + 0.3, 1300], [tp - 0.1, 870], [nr - 0.6, 870], [nr - 0.3, 880]]) };
    const same = ci(t, T("every") - 0.1, T("every") + 0.4);
    // camera on the dialog: focus point (dialog coords) -> screen centre; zooms in on Template, then Source, then pulls back
    const camS = kfx(t, [[S4, 1.25], [tp - 0.5, 1.95], [T("every") - 0.4, 1.95], [T("every") + 0.2, 1.15]]);
    const fx = kfx(t, [[S4, 384], [tp - 0.5, 268], [nr - 0.7, 268], [T("every") - 0.4, 268], [T("every") + 0.2, 384]]), fy = kfx(t, [[S4, 280], [tp - 0.5, 205], [nr - 0.7, 205], [nr - 0.3, 262], [T("every") + 0.2, 280]]);
    const sy = kfx(t, [[S4, 860], [T("every") - 0.4, 860], [T("every") + 0.2, 640]]);
    const camX = 540 - fx * camS, camY = sy - fy * camS;
    scene = <AbsoluteFill style={{ transform: `translateY(${(1 - k) * 1920}px)` }}>
      <div style={{ position: "absolute", left: 540, top: 250, transform: `translate(-50%,-50%) scale(${interpolate(sp(t, T("linkutm") - 0.1, 10, 260), [0, 1], [0.6, 1])})`, opacity: ci(t, T("linkutm") - 0.1, T("linkutm") + 0.1), background: "#fff", borderRadius: 26, padding: "22px 36px", boxShadow: "0 18px 40px -12px rgba(0,0,0,0.25)" }}><Img src={staticFile("lmv/logo.svg")} style={{ width: 440, display: "block" }} /></div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 768, transformOrigin: "0 0", transform: `translate(${camX}px, ${camY}px) scale(${camS})` }}>
        <UtmDialog v={v} hl={t > tp - 0.2 && t < tp + 0.4 ? "Template" : typing && t < nr + 0.8 ? "Source" : undefined} preview={`https://yourstore.com/?utm_source=${v.Source ? "facebook" : ""}&utm_medium=${v.Medium}&utm_campaign=${v.Campaign}`} />
        {t > nr + 0.3 && <div style={{ position: "absolute", left: 150, top: 286, transform: `scale(${sp(t, nr + 0.3, 9, 320)})`, transformOrigin: "0 0", padding: "6px 12px", borderRadius: 999, background: GREEN, color: "#fff", fontFamily: INTER, fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 6px 14px rgba(22,163,74,0.35)" }}>✓ Naming rule: lowercase</div>}
      </div>
      {t < T("every") - 0.3 && <Cursor x={cur.x} y={cur.y} click={t > tp - 0.1 ? ci(t, tp - 0.1, tp + 0.35) : 0} />}
      {/* every link the same */}
      {same > 0 && [0, 1, 2].map((i) => { const g = sp(t, T("every") + i * 0.12, 12, 260); return <div key={i} style={{ position: "absolute", left: 60, right: 60, top: 1010 + i * 120, height: 100, borderRadius: 22, background: "#fff", boxShadow: "0 10px 24px -8px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 16, padding: "0 24px", fontFamily: MONO, fontSize: 34, fontWeight: 700, transform: `translateY(${(1 - g) * 60}px)`, opacity: Math.min(1, g * 2) }}><span style={{ color: "#999" }}>go.co/ad-{i + 1}</span><span style={{ color: GREEN }}>utm_source=facebook</span><span style={{ marginLeft: "auto", width: 44, height: 44, borderRadius: 22, background: GREEN, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: INTER, fontSize: 22 }}>✓</span></div>; })}
    </AbsoluteFill>;
  } else {
    // payoff: the 3 rows merge into one + CTA
    const k = sp(t, S5, 14, 170), merge = ci(t, S5 + 0.25, S5 + 1.1, 0, 1, Easing.inOut(Easing.cubic));
    const cta = sp(t, T("start") - 0.05, 11, 240);
    scene = <AbsoluteFill style={{ transform: `scale(${interpolate(k, [0, 1], [0.8, 1])})`, opacity: Math.min(1, k * 2) }}>
      {title(<>1 channel.<br /><span style={{ color: GREEN }}>1 row.</span></>, S5 + 0.2, 200)}
      <Report t={t} hl={1} merge={merge} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 1150, transform: `translateY(${(1 - cta) * 80}px)`, opacity: Math.min(1, cta * 2), background: "#fff", borderRadius: 30, padding: "30px 34px", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: 24, fontFamily: INTER }}>
        <Img src={staticFile("lmv/logo.svg")} style={{ width: 250 }} />
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ display: "inline-block", padding: "16px 30px", borderRadius: 16, background: OR, color: "#fff", fontWeight: 800, fontSize: 38, transform: `scale(${1 + 0.04 * Math.sin(t * 6)})` }}>Start free</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#6B6B6B", marginTop: 10, opacity: ci(t, T("25") - 0.1, T("25") + 0.2) }}>25 links/month · No credit card</div>
        </div>
      </div>
    </AbsoluteFill>;
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Studio t={t} />
      {scene}
      <Captions t={t} />
      <Audio src={staticFile("sources/vo.wav")} />
    </AbsoluteFill>
  );
};
export const SourcesReelComp: React.FC = () => <Composition id="ThreeSourcesReel" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={WD} height={HT} />;
