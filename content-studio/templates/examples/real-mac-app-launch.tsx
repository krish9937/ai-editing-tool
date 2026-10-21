// Tapformat launch film v3 — "Real Mac, real product" (16:9, 33 s, music only).
// Screen-Studio-style: a believable macOS desktop, big cursor, smooth auto-zoom camera with motion blur, keystroke HUD,
// the Tapformat ring, success toasts, clean Geist type cards. Locked to song C (120 BPM, beat 0.5 s; build 8 s; drop 16 s).
import { AbsoluteFill, Audio, Composition, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import React from "react";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";

const { fontFamily: GEIST } = loadGeist("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });
const { fontFamily: MONO } = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] });
const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
const FPS = 30, DUR = 33.0, WD = 1920, HT = 1080;
const INK = "#0b0b0e", MUT = "#8b8b96", SEL = "#3b82ff";
const C = { heic: "#9e61ff", jpg: "#ff8f2e", png: "#3885ff", pdf: "#f5454d", gif: "#ff549e", shrink: "#2fc79c", docx: "#2b6cf6", mov: "#29c770", mp3: "#fab81f" };
const EZ = Easing.bezier(0.22, 1, 0.36, 1), IO = Easing.bezier(0.65, 0, 0.35, 1);
const ci = (t: number, a: number, b: number, x = 0, y = 1, e = EZ) => interpolate(t, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const sp = (t: number, a: number, d = 14, s = 180) => (t < a ? 0 : spring({ frame: (t - a) * FPS, fps: FPS, config: { damping: d, stiffness: s } }));
type KF = [number, number, number, number]; // t, x, y, zoom (camera centre in desktop coords)
const track = (kf: KF[], t: number) => {
  let i = 0; while (i < kf.length - 2 && t >= kf[i + 1][0]) i++;
  const [a, ax, ay, az] = kf[i], [b, bx, by, bz] = kf[i + 1], k = IO(Math.max(0, Math.min(1, (t - a) / Math.max(0.001, b - a))));
  return { x: ax + (bx - ax) * k, y: ay + (by - ay) * k, z: az + (bz - az) * k };
};
type PK = [number, number, number]; // t, x, y
const path = (kf: PK[], t: number) => {
  let i = 0; while (i < kf.length - 2 && t >= kf[i + 1][0]) i++;
  const [a, ax, ay] = kf[i], [b, bx, by] = kf[i + 1], k = IO(Math.max(0, Math.min(1, (t - a) / Math.max(0.001, b - a))));
  return [ax + (bx - ax) * k, ay + (by - ay) * k];
};

// ---------- macOS chrome ----------
const Wallpaper: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 20% 15%, #ffcf9e 0%, transparent 45%), radial-gradient(ellipse at 85% 30%, #b49cff 0%, transparent 50%), radial-gradient(ellipse at 60% 95%, #6fb8ff 0%, transparent 55%), linear-gradient(160deg, #f6d9c4, #c8c2f2 55%, #8fb7f0)" }}>
    <svg width={WD} height={HT} style={{ position: "absolute", opacity: 0.35 }}><path d="M -100 760 C 400 600, 800 980, 1300 720 S 2000 640, 2100 700 L 2100 1200 L -100 1200 Z" fill="#ffffff" /><path d="M -100 860 C 500 760, 900 1060, 1400 840 S 2000 800, 2100 860 L 2100 1200 L -100 1200 Z" fill="#ffffff" /></svg>
  </AbsoluteFill>
);
const MenuBar: React.FC<{ t: number; wifiOff?: number }> = ({ t, wifiOff = 0 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 34, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", padding: "0 18px", gap: 22, fontFamily: GEIST, fontSize: 17, color: INK }}>
    <div style={{ width: 16, height: 16, borderRadius: 4, background: INK }} />
    <b>Finder</b>{["File", "Edit", "View", "Go", "Window", "Help"].map((m) => <span key={m}>{m}</span>)}
    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ position: "relative", width: 22, height: 16 }}>
        <svg width={22} height={16} viewBox="0 0 22 16"><path d="M1 5 Q 11 -3 21 5 M4 8.5 Q 11 3 18 8.5 M7.5 12 Q 11 9 14.5 12" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" /><circle cx="11" cy="14.5" r="1.4" fill={INK} /></svg>
        {wifiOff > 0 && <div style={{ position: "absolute", left: -2, top: 7, width: 26 * wifiOff, height: 2.5, background: "#e5484d", transform: "rotate(-35deg)", transformOrigin: "0 50%" }} />}
      </div>
      <div style={{ width: 28, height: 13, borderRadius: 3, border: `1.5px solid ${INK}`, padding: 1.5, boxSizing: "border-box" }}><div style={{ width: "80%", height: "100%", background: INK, borderRadius: 1 }} /></div>
      <span>Tue 9:41 AM</span>
    </div>
  </div>
);
const Dock: React.FC = () => (
  <div style={{ position: "absolute", left: "50%", bottom: 10, transform: "translateX(-50%)", display: "flex", gap: 12, padding: "10px 14px", borderRadius: 26, background: "rgba(255,255,255,0.4)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.5)" }}>
    {["#2f8cff", "#34c759", "#ff9f0a", "#ff375f", "#5e5ce6", "#8e8e93"].map((c, i) => <div key={i} style={{ width: 62, height: 62, borderRadius: 15, background: `linear-gradient(160deg, ${c}, ${c}cc)` }} />)}
    <Img src={staticFile("tapformat/icon.png")} style={{ width: 62, height: 62 }} />
  </div>
);
const Win: React.FC<{ x: number; y: number; w: number; h: number; title: string; children: React.ReactNode; dark?: boolean }> = ({ x, y, w, h, title, children, dark }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 14, overflow: "hidden", background: dark ? "#1e1e22" : "#ffffff", boxShadow: "0 30px 80px rgba(20,20,40,0.35), 0 0 0 1px rgba(0,0,0,0.08)" }}>
    <div style={{ height: 46, background: dark ? "#2a2a2f" : "#f3f3f5", borderBottom: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 9, padding: "0 16px" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />)}
      <div style={{ marginLeft: 14, fontFamily: GEIST, fontWeight: 600, fontSize: 16, color: dark ? "#ddd" : "#444" }}>{title}</div>
    </div>
    <div style={{ position: "relative", height: h - 46 }}>{children}</div>
  </div>
);
const FIcon: React.FC<{ ext: string; col: string; s?: number }> = ({ ext, col, s = 34 }) => (
  <div style={{ position: "relative", width: s * 0.8, height: s, borderRadius: s * 0.1, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.25)", flexShrink: 0 }}>
    <div style={{ position: "absolute", left: s * 0.1, right: s * 0.1, top: s * 0.14, height: s * 0.42, borderRadius: s * 0.06, background: col }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: s * 0.06, textAlign: "center", fontFamily: GEIST, fontWeight: 800, fontSize: s * 0.2, color: col }}>{ext}</div>
  </div>
);
type Row = { n: string; ext: string; col: string; size: string; kind: string; isNew?: number; sel?: boolean };
const FinderList: React.FC<{ rows: Row[] }> = ({ rows }) => (
  <div style={{ display: "flex", height: "100%" }}>
    <div style={{ width: 210, background: "#f6f6f8", borderRight: "1px solid rgba(0,0,0,0.06)", padding: "16px 14px", fontFamily: GEIST, fontSize: 16, color: "#555", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 13, color: "#999", fontWeight: 600 }}>Favourites</div>{["Desktop", "Downloads", "Documents", "Pictures"].map((f, i) => <div key={f} style={{ padding: "6px 10px", borderRadius: 8, background: i === 1 ? "rgba(0,0,0,0.07)" : "transparent" }}>{f}</div>)}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", padding: "10px 24px", fontFamily: GEIST, fontWeight: 600, fontSize: 14, color: "#999", borderBottom: "1px solid rgba(0,0,0,0.06)" }}><span style={{ flex: 1 }}>Name</span><span style={{ width: 130 }}>Size</span><span style={{ width: 150 }}>Kind</span></div>
      {rows.map((r) => (
        <div key={r.n} style={{ display: "flex", alignItems: "center", gap: 14, height: r.isNew !== undefined ? 58 * Math.min(1, r.isNew) : 58, overflow: "hidden", padding: "0 24px", background: r.sel ? SEL : r.isNew !== undefined && r.isNew > 0 ? `rgba(47,199,156,${0.22 * Math.max(0, 1.6 - r.isNew)})` : "transparent", color: r.sel ? "#fff" : INK, fontFamily: GEIST, fontSize: 19, borderRadius: r.sel ? 8 : 0, margin: r.sel ? "0 8px" : 0 }}>
          <FIcon ext={r.ext} col={r.col} /><span style={{ flex: 1, fontWeight: 500 }}>{r.n}</span>
          <span style={{ width: 130, fontFamily: MONO, fontSize: 16, color: r.sel ? "#e6eeff" : MUT }}>{r.size}</span><span style={{ width: 150, fontSize: 16, color: r.sel ? "#e6eeff" : MUT }}>{r.kind}</span>
        </div>
      ))}
    </div>
  </div>
);
const Ring: React.FC<{ t: number; a: number; items: [string, string][]; pick: number; size?: number; thumb?: string; close?: number }> = ({ t, a, items, pick, size = 300, thumb = "linear-gradient(180deg,#ffb36b,#ff6f61 60%,#3b2b5a)", close = 99 }) => {
  const k = sp(t, a, 12, 260) * (1 - ci(t, close, close + 0.15));
  if (k <= 0.01) return null;
  return (
    <div style={{ position: "absolute", width: size, height: size, left: -size / 2, top: -size / 2, transform: `scale(${k})` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(24,24,28,0.92)", backdropFilter: "blur(10px)", boxShadow: "0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)" }} />
      {items.map(([l, col], i) => {
        const ang = -Math.PI / 2 + (i / items.length) * Math.PI * 2, r = size * 0.33, on = pick === i, ki = sp(t, a + 0.04 + i * 0.03, 12, 300);
        return <div key={l} style={{ position: "absolute", left: size / 2 + Math.cos(ang) * r - size * 0.12, top: size / 2 + Math.sin(ang) * r - size * 0.12, width: size * 0.24, height: size * 0.24, borderRadius: "50%", background: on ? col : `${col}26`, border: `2px solid ${col}`, color: on ? "#fff" : col, fontFamily: GEIST, fontWeight: 700, fontSize: size * 0.055, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${ki * (on ? 1.12 : 1)})`, boxShadow: on ? `0 0 24px ${col}` : undefined }}>{l}</div>;
      })}
      <div style={{ position: "absolute", left: size * 0.38, top: size * 0.38, width: size * 0.24, height: size * 0.24, borderRadius: "50%", background: thumb, boxShadow: "0 0 0 3px rgba(255,255,255,0.12)" }} />
    </div>
  );
};
const Cursor: React.FC<{ x: number; y: number; down?: boolean }> = ({ x, y, down }) => (
  <svg width={34} height={44} viewBox="0 0 24 30" style={{ position: "absolute", left: x - 3, top: y - 2, transform: `scale(${down ? 0.86 : 1})`, transformOrigin: "10% 5%", filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.4))" }}><path d="M2 2 L 2 24 L 8 18 L 12 28 L 16 26 L 12 17 L 20 17 Z" fill="#111" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" /></svg>
);
const Toast: React.FC<{ t: number; a: number; text: string; out?: number }> = ({ t, a, text, out = 99 }) => {
  const k = sp(t, a, 14, 220) * (1 - ci(t, out, out + 0.3));
  if (k <= 0) return null;
  return <div style={{ position: "absolute", right: 24, top: 52, transform: `translateX(${(1 - k) * 420}px)`, display: "flex", alignItems: "center", gap: 14, padding: "14px 22px", borderRadius: 18, background: "rgba(255,255,255,0.78)", backdropFilter: "blur(20px)", boxShadow: "0 12px 30px rgba(0,0,0,0.18)", fontFamily: GEIST, fontWeight: 600, fontSize: 19, color: INK }}><Img src={staticFile("tapformat/icon.png")} style={{ width: 36, height: 36 }} /><div><div style={{ fontWeight: 700 }}>Tapformat</div><div style={{ color: "#555", fontWeight: 500 }}>{text}</div></div></div>;
};

// ---------- the desktop story (camera space 1920×1080) ----------
const ROWS0: Row[] = [
  { n: "Sunset.heic", ext: "HEIC", col: C.heic, size: "2.4 MB", kind: "HEIC image" },
  { n: "Report.pdf", ext: "PDF", col: C.pdf, size: "880 KB", kind: "PDF document" },
  { n: "Interview.mov", ext: "MOV", col: C.mov, size: "248 MB", kind: "QuickTime movie" },
  { n: "Logo.png", ext: "PNG", col: C.png, size: "1.2 MB", kind: "PNG image" },
  { n: "Podcast.wav", ext: "WAV", col: C.mp3, size: "64 MB", kind: "WAVE audio" },
];
const FX = 380, FY = 150, FW = 1160, FH = 640;
const rowY = (i: number) => FY + 46 + 38 + i * 58 + 29; // centre y of row i (approx)
const MONTAGE: { at: number; row: string; ext: string; col: string; newN: string; newSize: string; kind: string; ring: [string, string][]; pick: number; label: string }[] = [
  { at: 10.0, row: "Report.pdf", ext: "DOCX", col: C.docx, newN: "Report.docx", newSize: "312 KB", kind: "Word document", ring: [["DOCX", C.docx], ["JPG", C.jpg], ["PNG", C.png], ["Shrink", C.shrink]], pick: 0, label: "PDF → Word" },
  { at: 11.5, row: "Interview.mov", ext: "GIF", col: C.gif, newN: "Interview.gif", newSize: "9.8 MB", kind: "GIF image", ring: [["MP4", C.mov], ["GIF", C.gif], ["MP3", C.mp3], ["Shrink", C.shrink]], pick: 1, label: "Video → GIF" },
  { at: 13.0, row: "Logo.png", ext: "JPG", col: C.jpg, newN: "Logo.jpg", newSize: "420 KB", kind: "JPEG image", ring: [["JPG", C.jpg], ["PDF", C.pdf], ["HEIC", C.heic], ["Shrink", C.shrink]], pick: 0, label: "PNG → JPG" },
  { at: 14.5, row: "Podcast.wav", ext: "MP3", col: C.mp3, newN: "Podcast.mp3", newSize: "11 MB", kind: "MP3 audio", ring: [["MP3", C.mp3], ["M4A", C.png], ["AAC", C.heic], ["Shrink", C.shrink]], pick: 0, label: "WAV → MP3" },
];
const Desktop: React.FC<{ t: number }> = ({ t }) => {
  // rows state over time
  const rows: Row[] = [];
  ROWS0.forEach((r) => {
    rows.push({ ...r, sel: (r.n === "Sunset.heic" && t > 5.4 && t < 8.6) || MONTAGE.some((m) => m.row === r.n && t > m.at - 0.5 && t < m.at + 0.55) });
    if (r.n === "Sunset.heic" && t > 8.6) rows.push({ n: "Sunset.jpg", ext: "JPG", col: C.jpg, size: "1.1 MB", kind: "JPEG image", isNew: ci(t, 8.6, 9.0) + ci(t, 9.0, 11, 0, 1) });
    MONTAGE.forEach((m) => { if (m.row === r.n && t > m.at + 0.5) rows.push({ n: m.newN, ext: m.ext, col: m.col, size: m.newSize, kind: m.kind, isNew: ci(t, m.at + 0.5, m.at + 0.8) + ci(t, m.at + 0.8, m.at + 2, 0, 1) }); });
  });
  // where is the ring / cursor
  const heicY = rowY(0);
  const cur = path([[4.6, 1300, 900], [5.3, 700, heicY], [8.0, 700, heicY], [8.2, 700 + 0, heicY - 100], [8.6, 700, heicY - 100], [9.6, 760, rowY(2) + 40],
    ...MONTAGE.flatMap((m, i) => { const ry = rowY(2 + i * 2), px = m.pick === 1 ? 786 : 700, py = m.pick === 1 ? ry : ry - 86; return [[m.at - 0.5, 700, ry], [m.at + 0.12, px, py], [m.at + 0.5, px, py]] as PK[]; }), [16.0, 900, 700]], t);
  return (
    <AbsoluteFill>
      <Wallpaper />
      <MenuBar t={t} />
      <Dock />
      <Win x={FX} y={FY} w={FW} h={FH} title="Downloads"><FinderList rows={rows} /></Win>
      {/* main ring on Sunset.heic */}
      <div style={{ position: "absolute", left: 700, top: heicY }}><Ring t={t} a={6.4} close={8.55} pick={t > 7.6 ? 0 : -1} items={[["JPG", C.jpg], ["PNG", C.png], ["PDF", C.pdf], ["Shrink", C.shrink]]} /></div>
      {MONTAGE.map((m, i) => { const ry = rowY(2 + i * 2); return <div key={m.row} style={{ position: "absolute", left: 700, top: ry }}><Ring t={t} a={m.at - 0.15} close={m.at + 0.45} pick={t > m.at + 0.1 ? m.pick : -1} items={m.ring} size={260} thumb={`linear-gradient(160deg, ${ROWS0.find((r) => r.n === m.row)!.col}, #222)`} /></div>; })}
      {t > 4.6 && t < 16 && <Cursor x={cur[0]} y={cur[1]} down={(t > 8.0 && t < 8.12) || MONTAGE.some((m) => t > m.at + 0.15 && t < m.at + 0.27)} />}
      <Burst t={t} a={8.05} x={700} y={heicY - 100} col={C.jpg} />
      <FlyIcon t={t} a={8.1} from={[700, heicY - 100]} to={[560, rowY(1)]} ext="JPG" col={C.jpg} />
      {MONTAGE.map((m, i) => { const ry = rowY(2 + i * 2), px = m.pick === 1 ? 786 : 700, py = m.pick === 1 ? ry : ry - 86; return <React.Fragment key={m.newN}><Burst t={t} a={m.at + 0.17} x={px} y={py} col={m.col} /><FlyIcon t={t} a={m.at + 0.2} from={[px, py]} to={[560, ry + 58]} ext={m.ext} col={m.col} /></React.Fragment>; })}
      <Toast t={t} a={8.7} text="Sunset.jpg saved next to the original" out={10.6} />
    </AbsoluteFill>
  );
};

// ---------- HOOK: converter website hell (0–3.6) ----------
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const pct = Math.min(34, Math.floor(ci(t, 1.4, 3.4, 0, 34)));
  const drag = path([[0, 300, 860], [0.3, 300, 860], [1.2, 960, 560], [1.3, 960, 560], [3.6, 1180, 680]], t);
  return (
    <AbsoluteFill>
      <Wallpaper />
      <MenuBar t={t} />
      <Dock />
      <Win x={360} y={110} w={1200} h={760} title="free-online-file-converter.xyz">
        <div style={{ padding: 28, fontFamily: GEIST }}>
          <div style={{ height: 120, borderRadius: 12, background: "repeating-linear-gradient(45deg,#ffe14d 0 30px,#ffd000 30px 60px)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 40, color: "#c4161c" }}>WIN A FREE PHONE!! CLICK HERE</div>
          <div style={{ marginTop: 24, height: 300, borderRadius: 16, border: "3px dashed #c8c8d0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: t > 1.25 ? "#f0f6ff" : "#fafafa" }}>
            <div style={{ fontWeight: 700, fontSize: 30, color: "#444" }}>{t > 1.25 ? "Uploading Sunset.heic…" : "Drop your file here"}</div>
            {t > 1.25 && <><div style={{ width: 600, height: 18, borderRadius: 9, background: "#e3e3ea" }}><div style={{ width: `${pct}%`, height: 18, borderRadius: 9, background: SEL }} /></div><div style={{ fontFamily: MONO, fontSize: 20, color: "#888" }}>{pct}% · position in queue: 2,481 · est. 4 min</div></>}
          </div>
          <div style={{ marginTop: 24, display: "flex", gap: 20 }}>{["⏳ Please wait… (ad)", "🔒 Sign up to download", "⚠️ Max 1 file / day"].map((s, i) => <div key={s} style={{ flex: 1, height: 120, borderRadius: 12, background: "#eeeef2", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, color: "#888", opacity: ci(t, 1.8 + i * 0.4, 2.0 + i * 0.4) }}>{s}</div>)}</div>
        </div>
      </Win>
      {t < 1.3 && <div style={{ position: "absolute", left: drag[0] - 30, top: drag[1] - 40, transform: "rotate(-6deg)", opacity: 0.95 }}><FIcon ext="HEIC" col={C.heic} s={80} /></div>}
      <Cursor x={drag[0]} y={drag[1]} down={t < 1.25} />
      {t > 2.6 && <div style={{ position: "absolute", left: 760, top: 420, padding: "24px 30px", borderRadius: 16, background: "#fff", boxShadow: "0 30px 80px rgba(0,0,0,0.35)", fontFamily: GEIST, transform: `scale(${sp(t, 2.6, 12, 260)})` }}><div style={{ fontWeight: 800, fontSize: 26 }}>🎉 Congratulations!</div><div style={{ fontSize: 18, color: "#666", marginTop: 6 }}>You've been selected for a free iPhone.</div></div>}
    </AbsoluteFill>
  );
};

// ---------- SHRINK + TOOLS (18–26) ----------
const Shrink: React.FC<{ t: number }> = ({ t }) => {
  const menu = t > 18.4 && t < 19.4, hover = t > 18.9;
  const mb = Math.round(interpolate(ci(t, 19.6, 21.2, 0, 1, Easing.out(Easing.cubic)), [0, 1], [248, 62]));
  const done = t > 21.2;
  const rows: Row[] = [ROWS0[0], ROWS0[1], { ...ROWS0[2], sel: t < 19.5 }, ...(t > 19.5 ? [{ n: "Interview (smaller).mov", ext: "MOV", col: C.mov, size: `${mb} MB`, kind: "QuickTime movie", isNew: ci(t, 19.5, 19.8) + ci(t, 19.8, 22, 0, 1) }] : []), ROWS0[3]];
  const cur = path([[18.0, 1100, 700], [18.35, 760, rowY(2)], [18.85, 860, rowY(2) + 150], [19.3, 860, rowY(2) + 150], [20.5, 1300, 900]], t);
  return (
    <AbsoluteFill>
      <Wallpaper /><MenuBar t={t} /><Dock />
      <Win x={FX} y={FY} w={FW} h={FH} title="Downloads"><FinderList rows={rows} /></Win>
      {menu && (
        <div style={{ position: "absolute", left: 770, top: rowY(2) + 10, width: 300, borderRadius: 12, background: "rgba(245,245,247,0.95)", backdropFilter: "blur(20px)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", padding: 6, fontFamily: GEIST, fontSize: 17, transform: `scale(${sp(t, 18.4, 16, 400)})`, transformOrigin: "0 0" }}>
          {["Open", "Get Info", "—", "Convert with Tapformat", "Shrink with Tapformat"].map((it) => it === "—" ? <div key={it} style={{ height: 1, background: "rgba(0,0,0,0.12)", margin: "5px 8px" }} /> : <div key={it} style={{ padding: "8px 12px", borderRadius: 7, background: hover && it.startsWith("Shrink") ? SEL : "transparent", color: hover && it.startsWith("Shrink") ? "#fff" : INK }}>{it}</div>)}
        </div>
      )}
      <Cursor x={cur[0]} y={cur[1]} down={t > 19.3 && t < 19.42} />
      <Toast t={t} a={21.2} text={`248 MB → ${mb} MB · same format`} out={22.0} />
      {done && <div style={{ position: "absolute", left: 1130, top: rowY(3) - 22, padding: "6px 14px", borderRadius: 999, background: C.shrink, color: "#fff", fontFamily: GEIST, fontWeight: 800, fontSize: 18, transform: `scale(${sp(t, 21.2, 10, 300)})` }}>−75%</div>}
    </AbsoluteFill>
  );
};
const Tools: React.FC<{ t: number }> = ({ t }) => {
  const seg = t < 23.0 ? 0 : t < 24.0 ? 1 : t < 25.0 ? 2 : 3;
  const k = ci(t, [22.0, 23.0, 24.0, 25.0][seg] + 0.15, [22.0, 23.0, 24.0, 25.0][seg] + 0.7, 0, 1, IO);
  const names = ["Crop", "Rotate", "Merge PDFs", "Batch convert"];
  return (
    <AbsoluteFill>
      <Wallpaper /><MenuBar t={t} /><Dock />
      <Win x={460} y={140} w={1000} h={700} title={["Sunset.jpg", "Sunset.jpg", "Downloads", "Downloads"][seg]}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: seg < 2 ? "#2a2a2f" : "#fff" }}>
          {seg === 0 && <div style={{ position: "relative", width: 760, height: 500, borderRadius: 8, background: "linear-gradient(180deg,#ffb36b,#ff6f61 55%,#3b2b5a)" }}><div style={{ position: "absolute", left: 120 * k, top: 80 * k, right: 140 * k, bottom: 90 * k, border: "3px solid #fff", boxShadow: "0 0 0 2000px rgba(0,0,0,0.5)" }}>{[[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x ? undefined : -6, right: x ? -6 : undefined, top: y ? undefined : -6, bottom: y ? -6 : undefined, width: 26, height: 26, borderLeft: x ? undefined : "6px solid #fff", borderRight: x ? "6px solid #fff" : undefined, borderTop: y ? undefined : "6px solid #fff", borderBottom: y ? "6px solid #fff" : undefined }} />)}</div></div>}
          {seg === 1 && <div style={{ width: 640, height: 420, borderRadius: 8, background: "linear-gradient(180deg,#ffb36b,#ff6f61 55%,#3b2b5a)", transform: `rotate(${k * 90}deg) scale(${1 - Math.sin(k * Math.PI) * 0.15})` }} />}
          {seg === 2 && <div style={{ position: "relative", width: 700, height: 420 }}>{[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 250 + (i ? 1 : -1) * 170 * (1 - k), top: 40 + i * 14 * (1 - k), transform: `rotate(${(i ? 6 : -6) * (1 - k)}deg)` }}><FIcon ext="PDF" col={C.pdf} s={300} /></div>)}{k > 0.95 && <div style={{ position: "absolute", left: 0, right: 0, bottom: -30, textAlign: "center", fontFamily: GEIST, fontWeight: 700, fontSize: 26, color: INK }}>Merged.pdf</div>}</div>}
          {seg === 3 && <div style={{ display: "flex", gap: 22 }}>{[C.heic, C.png, C.pdf, C.mov, C.mp3].map((c, i) => { const kk = ci(t, 25.2 + i * 0.08, 25.5 + i * 0.08); return <div key={i} style={{ transform: `translateY(${(1 - kk) * 40}px) rotate(${(1 - kk) * 12}deg)`, filter: kk > 0.5 ? "none" : "grayscale(1)" }}><FIcon ext={["JPG", "JPG", "JPG", "GIF", "MP3"][i]} col={kk > 0.5 ? [C.jpg, C.jpg, C.jpg, C.gif, C.mp3][i] : c} s={150} /></div>; })}</div>}
        </div>
      </Win>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, display: "flex", justifyContent: "center" }}><div key={seg} style={{ fontFamily: GEIST, fontWeight: 700, fontSize: 30, color: "#fff", background: "rgba(11,11,14,0.82)", padding: "12px 26px", borderRadius: 999, transform: `scale(${sp(t, [22.0, 23.0, 24.0, 25.0][seg], 12, 300)})` }}>{names[seg]}</div></div>
    </AbsoluteFill>
  );
};

// ---------- type cards (v4: inline kinetic cards in Film) ----------
const KeyHUD: React.FC<{ t: number; a: number; out: number }> = ({ t, a, out }) => {
  const k = sp(t, a - 0.2, 14, 260) * (1 - ci(t, out, out + 0.2));
  if (k <= 0) return null;
  const down1 = t > a && t < a + 0.35, down2 = t > a + 0.12 && t < a + 0.4;
  const cap = (g: string, d: boolean) => <div style={{ width: 92, height: 92, borderRadius: 18, background: d ? "#d9d9e0" : "#fff", boxShadow: d ? "inset 0 3px 6px rgba(0,0,0,0.25)" : "0 6px 0 #b8b8c2, 0 10px 20px rgba(0,0,0,0.3)", transform: `translateY(${d ? 6 : 0}px)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GEIST, fontWeight: 500, fontSize: 50, color: INK }}>{g}</div>;
  return <div style={{ position: "absolute", right: 80, bottom: 90, transform: `translateY(${(1 - k) * 40}px)`, opacity: k, display: "flex", gap: 16, padding: "18px 22px", borderRadius: 28, background: "rgba(11,11,14,0.78)", backdropFilter: "blur(18px)" }}>{cap("⇧", down1)}{cap("⌘", down2)}</div>;
};

// ---------- master with camera ----------
const CAM: KF[] = [
  [0, 960, 540, 1], [3.5, 960, 540, 1.04],
  [4.6, 960, 540, 1], [5.4, 820, 300, 1.9], [6.3, 760, 330, 2.1], [8.4, 760, 330, 2.15], [9.6, 900, 420, 1.45],
  [10.0, 860, 420, 1.55], [15.6, 860, 520, 1.55], [16.0, 960, 540, 1],
  [18.0, 960, 540, 1], [18.5, 860, 470, 1.7], [20.6, 860, 470, 1.75], [21.6, 1100, 420, 1.35], [22.0, 960, 540, 1],
];
// ---------- v4 motion graphics ----------
const BEAT = 0.5, PH = 0.08;
const beatBump = (t: number) => {
  if (t < 8.0 || t > 32) return 0;
  const n = Math.floor((t - PH) / BEAT), e = t - PH - n * BEAT, bar = n % 4 === 0;
  const amp = t < 16 ? (bar ? 0.03 : 0.012) : (bar ? 0.045 : 0.02);
  return amp * Math.exp(-e * 14);
};
const Burst: React.FC<{ t: number; a: number; x: number; y: number; col: string; s?: number }> = ({ t, a, x, y, col, s = 1 }) => {
  const e = t - a; if (e < 0 || e > 0.7) return null;
  const k = 1 - Math.pow(1 - e / 0.7, 3);
  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}>
      {[0, 1].map((r) => <div key={r} style={{ position: "absolute", left: -120 * s, top: -120 * s, width: 240 * s, height: 240 * s, borderRadius: "50%", border: `${6 - r * 3}px solid ${col}`, transform: `scale(${0.2 + k * (1.3 + r * 0.6)})`, opacity: (1 - k) * (r ? 0.6 : 1) }} />)}
      {Array.from({ length: 14 }).map((_, i) => { const ang = (i / 14) * Math.PI * 2 + i, d = (60 + (i % 3) * 30) * s * k * 2.2; return <div key={i} style={{ position: "absolute", left: Math.cos(ang) * d - 5, top: Math.sin(ang) * d - 5, width: 10 * (1 - k * 0.6), height: 10 * (1 - k * 0.6), borderRadius: i % 2 ? 2 : 5, background: i % 3 ? col : "#fff", transform: `rotate(${k * 300}deg)`, opacity: 1 - k }} />; })}
    </div>
  );
};
const FlyIcon: React.FC<{ t: number; a: number; from: [number, number]; to: [number, number]; ext: string; col: string }> = ({ t, a, from, to, ext, col }) => {
  const e = (t - a) / 0.42; if (e < 0 || e > 1) return null;
  const k = IO(e), x = from[0] + (to[0] - from[0]) * k, y = from[1] + (to[1] - from[1]) * k - Math.sin(k * Math.PI) * 120;
  return <div style={{ position: "absolute", left: x - 28, top: y - 35, transform: `scale(${1.8 - k * 0.8}) rotate(${(1 - k) * -25}deg)`, filter: `drop-shadow(0 10px 18px ${col}88)` }}><FIcon ext={ext} col={col} s={60} /></div>;
};
const WIPES: [number, string[]][] = [[3.5, [C.heic, C.pdf, "#08080a"]], [4.6, [C.png, C.jpg, "#f4f4f6"]], [16.0, [C.jpg, C.heic, "#08080a"]], [18.0, [C.shrink, C.png, "#f4f4f6"]], [22.0, [C.gif, C.jpg, "#f4f4f6"]], [26.0, [C.png, C.shrink, "#f4f4f6"]], [29.5, [C.heic, C.jpg, "#08080a"]]];
const SlashWipe: React.FC<{ t: number }> = ({ t }) => (
  <>{WIPES.map(([a, cols], w) => {
    const e = (t - (a - 0.22)) / 0.44; if (e < 0 || e > 1) return null;
    return <AbsoluteFill key={w} style={{ pointerEvents: "none" }}>{cols.map((c, i) => { const k = IO(Math.max(0, Math.min(1, e * 1.25 - i * 0.12))); return <div key={i} style={{ position: "absolute", top: -400, bottom: -400, width: 900, left: interpolate(k, [0, 1], [-1400, 2600]) - i * 120, background: c, transform: "skewX(-18deg)" }} />; })}</AbsoluteFill>;
  })}</>
);
const Floaters: React.FC<{ t: number; dark?: boolean }> = ({ t, dark = true }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {[C.heic, C.jpg, C.png, C.pdf, C.gif, C.shrink].map((c, i) => { const x = 200 + ((i * 331) % 1520) + Math.sin(t * 0.8 + i) * 60, y = 140 + ((i * 197) % 800) + Math.cos(t * 0.7 + i * 2) * 50, s = 60 + (i % 3) * 40;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: i % 2 ? "50%" : s * 0.25, border: `5px solid ${c}`, opacity: dark ? 0.55 : 0.45, transform: `rotate(${t * (i % 2 ? 40 : -30)}deg) scale(${1 + beatBump(t) * 4})` }} />; })}
  </AbsoluteFill>
);
const Ripples: React.FC<{ t: number; at: number[]; col: string; x?: number; y?: number }> = ({ t, at, col, x = 960, y = 540 }) => (
  <>{at.map((a) => { const e = t - a; if (e < 0 || e > 1) return null; return <div key={a} style={{ position: "absolute", left: x - 300, top: y - 300, width: 600, height: 600, borderRadius: "50%", border: `4px solid ${col}`, transform: `scale(${0.3 + e * 2.2})`, opacity: 1 - e }} />; })}</>
);
const Words: React.FC<{ t: number; a: number; words: string[]; style: React.CSSProperties; step?: number; italicLast?: boolean }> = ({ t, a, words, style, step = 0.12, italicLast }) => (
  <div style={{ display: "flex", gap: "0 0.25em", justifyContent: "center", flexWrap: "wrap", ...style }}>
    {words.map((w, i) => { const k = sp(t, a + i * step, 11, 260); return <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - k) * -120}px) scale(${0.6 + k * 0.4}) rotate(${(1 - k) * (i % 2 ? 12 : -12)}deg)`, opacity: Math.min(1, k * 2), fontStyle: italicLast && i === words.length - 1 ? "italic" : undefined }}>{w}</span>; })}
  </div>
);
const Label: React.FC<{ t: number; a: number; out: number; from: string; to?: string; col: string }> = ({ t, a, out, from, to, col }) => {
  const k = sp(t, a, 13, 300), o = ci(t, out - 0.2, out);
  if (k <= 0 || o >= 1) return null;
  const arrow = ci(t, a + 0.1, a + 0.35);
  return (
    <div style={{ position: "absolute", left: 80, top: 850, display: "flex", alignItems: "center", gap: 18, transform: `translateX(${(1 - k) * -500 + o * -500}px) skewX(${(1 - k) * -12}deg)` }}>
      <div style={{ width: 14, height: 96, borderRadius: 7, background: col }} />
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 30px", borderRadius: 22, background: "rgba(255,255,255,0.88)", backdropFilter: "blur(14px)", boxShadow: `0 16px 40px ${col}44`, fontFamily: GEIST, fontWeight: 800, fontSize: 66, letterSpacing: -2, color: INK }}>
        <span>{from}</span>
        {to && <><svg width={80} height={40} viewBox="0 0 80 40"><path d="M4 20 H 66 M 52 6 L 70 20 L 52 34" stroke={col} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - arrow }} /></svg><span style={{ color: col, opacity: arrow }}>{to}</span></>}
      </div>
    </div>
  );
};
const Check: React.FC<{ t: number; a: number; s?: number }> = ({ t, a, s = 84 }) => {
  const k = sp(t, a, 10, 280), d = ci(t, a + 0.08, a + 0.32);
  return <div style={{ width: s, height: s, borderRadius: s / 2, background: C.shrink, transform: `scale(${k})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 ${8 * (1 - d)}px ${C.shrink}55` }}><svg width={s * 0.6} height={s * 0.6} viewBox="0 0 24 24"><path d="M4 12.5 L 10 18 L 20 6" stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - d }} /></svg></div>;
};

// ---------- master with camera (v4: beat punches, slash wipes, kinetic cards) ----------
const Film: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const cam = track(CAM, t), prev = track(CAM, t - 1 / FPS);
  const speed = Math.hypot((cam.x - prev.x) * cam.z, (cam.y - prev.y) * cam.z) + Math.abs(cam.z - prev.z) * 900;
  const blur = Math.min(1.4, speed * 0.03);
  const bump = beatBump(t);
  const S = (a: number, b: number) => t >= a && t < b;
  const camStyle: React.CSSProperties = { transform: `translate(${WD / 2}px, ${HT / 2}px) scale(${cam.z * (1 + bump)}) translate(${-cam.x}px, ${-cam.y}px)`, transformOrigin: "0 0", filter: blur > 0.4 ? `blur(${blur}px)` : undefined };
  const cardBump: React.CSSProperties = { transform: `scale(${1 + bump * 1.5})` };
  const glitch = (a: number) => (t > a && t < a + 0.12 ? Math.sin(t * 300) * 14 : 0);
  const toolSeg = t < 23 ? 0 : t < 24 ? 1 : t < 25 ? 2 : 3;
  return (
    <AbsoluteFill style={{ background: "#08080a", overflow: "hidden" }}>
      {S(0, 3.5) && <AbsoluteFill style={camStyle}><Hook t={t} /></AbsoluteFill>}
      {S(0.3, 3.45) && <div style={{ position: "absolute", left: 70, top: 900, fontFamily: GEIST, fontWeight: 800, fontSize: 58, color: "#fff", letterSpacing: -2, textShadow: "0 6px 24px rgba(0,0,0,0.5)" }}><Words t={t} a={0.3} words={["Still", "converting", "files", "like", "this?"]} style={{ justifyContent: "flex-start" }} step={0.1} /></div>}
      {S(3.5, 4.6) && (
        <AbsoluteFill style={{ background: "#08080a", ...cardBump }}>
          <Floaters t={t} />
          <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", transform: `translateX(${glitch(3.5)}px)` }}>
            <div style={{ position: "relative" }}>
              <Words t={t} a={3.52} words={["Stop", "doing", "this."]} italicLast style={{ fontFamily: SERIF, fontSize: 220, color: "#f4f4f6", letterSpacing: -4 }} step={0.09} />
              <div style={{ position: "absolute", left: "58%", right: "-2%", top: "52%", height: 14, borderRadius: 7, background: C.pdf, transform: `scaleX(${ci(t, 3.95, 4.2)}) rotate(-4deg)`, transformOrigin: "0 50%" }} />
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      {S(4.6, 16.0) && <AbsoluteFill style={camStyle}><Desktop t={t} /></AbsoluteFill>}
      {S(4.6, 16.0) && <KeyHUD t={t} a={6.0} out={6.9} />}
      {MONTAGE.map((m) => S(m.at - 0.35, m.at + 0.6) && <KeyHUD key={m.at} t={t} a={m.at - 0.3} out={m.at + 0.3} />)}
      {S(4.6, 9.2) && <Label t={t} a={5.4} out={6.0} from="Select a file." col={SEL} />}
      {S(5.9, 9.2) && <Label t={t} a={6.0} out={7.6} from="Tap ⇧⌘." col={C.heic} />}
      {S(7.5, 9.2) && <Label t={t} a={7.6} out={9.1} from="Pick." to="Done." col={C.jpg} />}
      {MONTAGE.map((m) => { const parts = m.label.split(" → "); return S(m.at - 0.35, m.at + 1.45) && <Label key={m.label} t={t} a={m.at - 0.3} out={m.at + 1.4} from={parts[0]} to={parts[1]} col={m.col} />; })}
      {S(16.0, 18.0) && (
        <AbsoluteFill style={{ background: "#08080a", ...cardBump }}>
          <Floaters t={t} />
          <Ripples t={t} at={[16.0, 16.5, 17.0, 17.5]} col={C.heic} />
          <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `translateX(${glitch(16.0)}px)` }}>
            <div style={{ display: "flex", fontFamily: GEIST, fontWeight: 800, fontSize: 240, color: "#f4f4f6", letterSpacing: -8, lineHeight: 0.95 }}>
              {["T", "a", "p", " ", "⇧", "⌘", "."].map((ch, i) => { const at = 16.0 + (i < 4 ? i * 0.06 : 0.25 + (i - 4) * 0.25); const k = sp(t, at, 9, 320); return <span key={i} style={{ display: "inline-block", width: ch === " " ? 60 : undefined, transform: `scale(${2.4 - k * 1.4}) translateY(${(1 - k) * -40}px)`, opacity: Math.min(1, k * 3), color: i === 4 ? C.jpg : i === 5 ? C.heic : undefined }}>{ch}</span>; })}
            </div>
            <Words t={t} a={16.9} words={["Convert", "anything."]} italicLast style={{ fontFamily: SERIF, fontSize: 120, color: "#c9c9d2", marginTop: 14 }} step={0.15} />
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      {S(18.0, 22.0) && <AbsoluteFill style={camStyle}><Shrink t={t} /></AbsoluteFill>}
      {S(18.0, 22.0) && <Label t={t} a={18.2} out={21.9} from="Shrink" to="anything" col={C.shrink} />}
      {S(19.6, 22.0) && <div style={{ position: "absolute", right: 90, top: 300, fontFamily: GEIST, fontWeight: 800, fontSize: 170, letterSpacing: -6, color: INK, textShadow: "0 10px 40px rgba(255,255,255,0.8)", transform: `scale(${1 + Math.max(0, 1 - Math.abs(t - 21.2) * 6) * 0.15})` }}>{Math.round(interpolate(ci(t, 19.6, 21.2, 0, 1, Easing.out(Easing.cubic)), [0, 1], [248, 62]))}<span style={{ fontSize: 80, color: C.shrink }}> MB</span></div>}
      {S(22.0, 26.0) && <AbsoluteFill style={{ transform: `translateX(${(1 - sp(t, [22.0, 23.0, 24.0, 25.0][toolSeg], 12, 260)) * (toolSeg % 2 ? 300 : -300)}px) scale(${1 + bump})` }}><Tools t={t} /></AbsoluteFill>}
      {S(22.0, 26.0) && <Ripples t={t} at={[22.15, 23.15, 24.15, 25.15]} col={C.jpg} x={960} y={490} />}
      {S(26.0, 29.5) && (
        <AbsoluteFill style={{ ...cardBump }}>
          <Wallpaper /><MenuBar t={t} wifiOff={ci(t, 26.4, 26.8)} />
          <div style={{ position: "absolute", right: 200, top: 300, transform: `scale(${sp(t, 26.1, 11, 200)}) rotate(${(1 - sp(t, 26.1, 11, 200)) * -20}deg)` }}>
            <svg width={360} height={300} viewBox="0 0 22 16"><path d="M1 5 Q 11 -3 21 5 M4 8.5 Q 11 3 18 8.5 M7.5 12 Q 11 9 14.5 12" stroke={INK} strokeWidth="1.6" fill="none" strokeLinecap="round" /><circle cx="11" cy="14.5" r="1.2" fill={INK} /><line x1="2" y1="15" x2="20" y2="1" stroke="#e5484d" strokeWidth="1.8" strokeLinecap="round" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - ci(t, 26.4, 26.8) }} /></svg>
          </div>
          <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 140, gap: 26 }}>
            {([["Works offline.", 26.5], ["Nothing uploaded.", 27.3], ["Originals untouched.", 28.1]] as [string, number][]).map(([s2, a]) => { const k = sp(t, a, 10, 260); return <div key={s2} style={{ display: "flex", alignItems: "center", gap: 26, transform: `translateX(${(1 - k) * -700}px) skewX(${(1 - k) * -14}deg)` }}><Check t={t} a={a + 0.05} /><div style={{ fontFamily: GEIST, fontWeight: 800, fontSize: 100, color: INK, letterSpacing: -4 }}>{s2}</div></div>; })}
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      {S(29.5, DUR) && (
        <AbsoluteFill style={{ background: "#08080a", ...cardBump }}>
          <Floaters t={t} />
          <Ripples t={t} at={[30.1, 31.1]} col={C.jpg} x={960} y={330} />
          <div style={{ position: "absolute", left: 960 - 110, top: 330 - 110, width: 220, height: 220 }}>
            {[C.jpg, C.heic, C.png, C.mov, C.gif, C.pdf].map((c, i) => { const ang = -Math.PI / 2 + (i / 6) * Math.PI * 2, k = ci(t, 29.55 + i * 0.05, 30.05 + i * 0.05, 0, 1, Easing.out(Easing.back(1.4))); const fx2 = Math.cos(ang + 1.2) * 900, fy = Math.sin(ang + 1.2) * 600; return <div key={i} style={{ position: "absolute", left: 110 + interpolate(k, [0, 1], [fx2, Math.cos(ang) * 64]) - 20, top: 110 + interpolate(k, [0, 1], [fy, Math.sin(ang) * 64]) - 20, width: 40, height: 40, borderRadius: 20, background: c, boxShadow: `0 0 20px ${c}`, opacity: 1 - ci(t, 30.15, 30.3) }} />; })}
            <Img src={staticFile("tapformat/icon.png")} style={{ position: "absolute", inset: 0, width: 220, height: 220, opacity: ci(t, 30.1, 30.3), transform: `scale(${0.8 + sp(t, 30.1, 9, 220) * 0.2})` }} />
          </div>
          <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 480 }}>
            <Words t={t} a={30.3} words={["Tapformat"]} style={{ fontFamily: GEIST, fontWeight: 800, fontSize: 150, color: "#f4f4f6", letterSpacing: -6 }} />
            <Words t={t} a={30.6} words={["Tap", "⇧⌘.", "Convert", "anything."]} italicLast style={{ fontFamily: SERIF, fontSize: 64, color: "#a9a9b4" }} step={0.08} />
            <div style={{ marginTop: 30, padding: "18px 48px", borderRadius: 999, background: "#f4f4f6", color: "#08080a", fontFamily: GEIST, fontWeight: 700, fontSize: 38, transform: `scale(${sp(t, 31.1, 9, 300) * (1 + Math.max(0, Math.sin((t - 31.1) * 6)) * 0.03)})` }}>Download free for Mac</div>
            <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 22, color: MUT, opacity: ci(t, 31.4, 31.7) }}>macOS 15+ · works offline · never uploaded</div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      <SlashWipe t={t} />
      <Audio src={staticFile("tapformat/music3.wav")} />
    </AbsoluteFill>
  );
};
export const TapRealMacComp: React.FC = () => <Composition id="TapformatRealMac" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={WD} height={HT} />;
