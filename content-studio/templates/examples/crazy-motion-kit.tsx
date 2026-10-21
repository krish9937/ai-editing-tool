// Tapformat v5 MOTION TEST (8 s, 60 fps): infinite-zoom, never-cut camera; extruded CSS-3D keycaps; gooey liquid format
// orbs (SVG goo filter); fly-through the ring; liquid-morphing file with 3D flips + trails; Finder cascading in 3D.
import { AbsoluteFill, Audio, Composition, Easing, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import React from "react";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";

const { fontFamily: GEIST } = loadGeist("normal", { weights: ["500", "700", "800", "900"], subsets: ["latin"] });
const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
const FPS = 60, WD = 1920, HT = 1080;
const C = { heic: "#9e61ff", jpg: "#ff8f2e", png: "#3885ff", pdf: "#f5454d", gif: "#ff549e", shrink: "#2fc79c", mov: "#29c770", mp3: "#fab81f" };
const COLS = [C.jpg, C.heic, C.png, C.mov, C.gif, C.pdf];
const EZ = Easing.bezier(0.16, 1, 0.3, 1), IO = Easing.bezier(0.7, 0, 0.3, 1);
const ci = (t: number, a: number, b: number, x = 0, y = 1, e = EZ) => interpolate(t, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const sp = (t: number, a: number, d = 12, s = 200) => (t < a ? 0 : spring({ frame: (t - a) * FPS, fps: FPS, config: { damping: d, stiffness: s } }));

// ---------- extruded 3D keycap (stacked layers) ----------
export const Key3D: React.FC<{ glyph: string; size: number; rx: number; ry: number; rz?: number; press?: number; glow?: string }> = ({ glyph, size, rx, ry, rz = 0, press = 0, glow = "#fff" }) => {
  const L = 16, depth = size * 0.22 * (1 - press * 0.5);
  return (
    <div style={{ position: "relative", width: size, height: size, transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
      {Array.from({ length: L }).map((_, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, borderRadius: size * 0.22, background: i === L - 1 ? "linear-gradient(150deg,#ffffff 0%,#eceaf2 50%,#cfcdd8 100%)" : `hsl(250, 8%, ${62 + i * 1.4}%)`, transform: `translateZ(${(i / (L - 1)) * depth}px)`, boxShadow: i === 0 ? `0 0 ${size * 0.5}px ${glow}55` : undefined }}>
          {i === L - 1 && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GEIST, fontWeight: 500, fontSize: size * 0.5, color: "#141418" }}>{glyph}</div>}
          {i === L - 1 && <div style={{ position: "absolute", left: "8%", right: "8%", top: "6%", height: "34%", borderRadius: size * 0.18, background: "linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,255,255,0))" }} />}
        </div>
      ))}
    </div>
  );
};

// ---------- gooey liquid orbs ----------
export const Goo: React.FC<{ id: string; children: React.ReactNode; strength?: number }> = ({ id, children, strength = 22 }) => (
  <>
    <svg width={0} height={0} style={{ position: "absolute" }}><defs><filter id={id}><feGaussianBlur in="SourceGraphic" stdDeviation={strength} result="b" /><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 36 -14" result="g" /><feComposite in="SourceGraphic" in2="g" operator="atop" /></filter></defs></svg>
    <div style={{ position: "absolute", inset: 0, filter: `url(#${id})` }}>{children}</div>
  </>
);

// ---------- background: moving gradient mesh + grid ----------
export const BG: React.FC<{ t: number; hue: string }> = ({ t, hue }) => (
  <AbsoluteFill style={{ background: "#07070b" }}>
    {[[0.2, 0.3, C.heic], [0.8, 0.25, C.png], [0.55, 0.85, hue]].map(([x, y, c], i) => (
      <div key={i} style={{ position: "absolute", left: `${(x as number) * 100 + Math.sin(t * 0.9 + i * 2) * 12}%`, top: `${(y as number) * 100 + Math.cos(t * 0.7 + i) * 12}%`, width: 1100, height: 1100, marginLeft: -550, marginTop: -550, borderRadius: "50%", background: `radial-gradient(circle, ${c}55 0%, transparent 60%)`, filter: "blur(40px)" }} />
    ))}
    <AbsoluteFill style={{ perspective: 900 }}>
      <div style={{ position: "absolute", left: -1000, right: -1000, top: "55%", height: 1400, transform: "rotateX(75deg)", transformOrigin: "50% 0%", backgroundImage: "linear-gradient(rgba(255,255,255,0.09) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.09) 2px, transparent 2px)", backgroundSize: "140px 140px", backgroundPosition: `0 ${(t * 420) % 140}px`, maskImage: "linear-gradient(to bottom, black, transparent 80%)" }} />
    </AbsoluteFill>
  </AbsoluteFill>
);

// ---------- the test ----------
const Test: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  // master camera: continuous push + roll; dives at 3.6 and 5.9
  const dive1 = ci(t, 3.4, 4.0, 0, 1, Easing.in(Easing.cubic)), dive2 = ci(t, 5.7, 6.2, 0, 1, Easing.in(Easing.cubic));
  const camZ = 1 + t * 0.03, roll = Math.sin(t * 1.3) * 3;
  // keycaps
  const k1 = sp(t, 0.15, 11, 140), k2 = sp(t, 0.45, 11, 140);
  const slam = t > 1.0 && t < 1.25 ? 1 - (t - 1.0) / 0.25 : 0;
  // ring orbs
  const ringIn = ci(t, 1.6, 2.4, 0, 1, Easing.out(Easing.back(1.3)));
  const spin = t * 120 + ci(t, 2.4, 3.4, 0, 260, IO);
  // morph file
  const MORPH = [["HEIC", C.heic], ["JPG", C.jpg], ["PNG", C.png], ["PDF", C.pdf], ["GIF", C.gif]];
  const mi = Math.min(MORPH.length - 1, Math.max(0, Math.floor((t - 4.2) / 0.32)));
  const flip = ((t - 4.2) / 0.32) % 1;
  const shake = slam * 16;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <BG t={t} hue={t < 4 ? C.jpg : MORPH[mi][1]} />
      <AbsoluteFill style={{ perspective: 1400, transform: `scale(${camZ}) rotate(${roll}deg) translate(${Math.sin(t * 60) * shake}px, ${Math.cos(t * 50) * shake}px)` }}>
        {/* SCENE A: keycaps (0–3.8), dive through the gap */}
        {t < 4.0 && (
          <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `translateZ(${dive1 * 1300}px)`, opacity: 1 - ci(t, 3.8, 4.0) }}>
            <div style={{ position: "absolute", left: 960 - 520, top: 540 - 170, transformStyle: "preserve-3d", transform: `translateY(${(1 - k1) * -900}px) translateX(${-60 * ci(t, 1.6, 2.2)}px)` }}>
              <Key3D glyph="⇧" size={340} rx={38 - k1 * 8 + Math.sin(t * 2) * 4} ry={-25 + (1 - k1) * 160 + Math.sin(t * 1.4) * 6} rz={-6} press={slam} glow={C.jpg} />
            </div>
            <div style={{ position: "absolute", left: 960 + 180, top: 540 - 170, transformStyle: "preserve-3d", transform: `translateY(${(1 - k2) * -900}px) translateX(${60 * ci(t, 1.6, 2.2)}px)` }}>
              <Key3D glyph="⌘" size={340} rx={38 - k2 * 8 + Math.cos(t * 2) * 4} ry={25 - (1 - k2) * 160 + Math.cos(t * 1.4) * 6} rz={6} press={slam} glow={C.heic} />
            </div>
            {/* shock rings on slam */}
            {[0, 1, 2].map((i) => { const e = t - 1.0 - i * 0.08; if (e < 0 || e > 0.9) return null; return <div key={i} style={{ position: "absolute", left: 960 - 400, top: 540 - 400, width: 800, height: 800, borderRadius: "50%", border: `${10 - i * 3}px solid ${COLS[i]}`, transform: `rotateX(65deg) scale(${0.3 + e * 2.4})`, opacity: 1 - e / 0.9 }} />; })}
            {/* gooey ring of format orbs bursting out of the gap */}
            {t > 1.5 && (
              <div style={{ position: "absolute", left: 960 - 450, top: 540 - 450, width: 900, height: 900, transform: `rotateX(${55 - ringIn * 40}deg) rotateZ(${spin}deg) scale(${ringIn})`, transformStyle: "preserve-3d" }}>
                <Goo id="goo1">
                  {COLS.map((c, i) => { const ang = (i / 6) * Math.PI * 2, wob = Math.sin(t * 6 + i) * 30, r = 330 + wob - ci(t, 3.0, 3.5, 0, 230, IO); return <div key={i} style={{ position: "absolute", left: 450 + Math.cos(ang) * r - 85, top: 450 + Math.sin(ang) * r - 85, width: 170, height: 170, borderRadius: "50%", background: c }} />; })}
                  <div style={{ position: "absolute", left: 450 - 110, top: 450 - 110, width: 220, height: 220, borderRadius: "50%", background: "#ffffff", transform: `scale(${ci(t, 2.9, 3.5, 0.2, 1.2)})` }} />
                </Goo>
              </div>
            )}
          </AbsoluteFill>
        )}
        {/* light flash at the dive */}
        {t > 3.75 && t < 4.15 && <AbsoluteFill style={{ background: "#fff", opacity: 1 - Math.abs(t - 3.95) / 0.2 }} />}
        {/* SCENE B: file rockets in, liquid morphs with 3D flips (4.0–6.0) */}
        {t >= 3.95 && t < 6.25 && (
          <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `translateZ(${interpolate(ci(t, 3.95, 4.5, 0, 1), [0, 1], [-2400, 0]) + dive2 * 1500}px)` }}>
            {/* trails */}
            {Array.from({ length: 6 }).map((_, i) => { const lag = (i + 1) * 0.035; const tz = interpolate(ci(t - lag, 3.95, 4.5), [0, 1], [-2400, 0]); return <div key={i} style={{ position: "absolute", left: 960 - 160, top: 540 - 200, width: 320, height: 400, borderRadius: 40, background: MORPH[mi][1], opacity: 0.12 * (6 - i) / 6, transform: `translateZ(${tz - (i + 1) * 60}px) rotateY(${flip * 180}deg)` }} />; })}
            <div style={{ position: "absolute", left: 960 - 160, top: 540 - 200, width: 320, height: 400, transformStyle: "preserve-3d", transform: `rotateY(${t > 4.2 ? IO(Math.min(1, flip * 2.2)) * 360 : 0}deg) rotateX(${Math.sin(t * 3) * 10}deg) scale(${1 + (t > 4.2 ? Math.max(0, 1 - flip * 4) * 0.15 : 0)})` }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: 40, background: "linear-gradient(160deg,#ffffff,#e8e6f0)", boxShadow: `0 40px 120px ${MORPH[mi][1]}99` }}>
                <div style={{ position: "absolute", left: 30, right: 30, top: 40, height: 190, borderRadius: 24, background: `linear-gradient(160deg, ${MORPH[mi][1]}, ${MORPH[mi][1]}aa)` }} />
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, textAlign: "center", fontFamily: GEIST, fontWeight: 900, fontSize: 84, color: MORPH[mi][1], letterSpacing: -3 }}>{MORPH[mi][0]}</div>
              </div>
            </div>
            {/* liquid splash per morph */}
            <Goo id="goo2" strength={16}>
              {Array.from({ length: 10 }).map((_, i) => { const e = ((t - 4.2) % 0.32) / 0.32; if (t < 4.2) return null; const ang = (i / 10) * Math.PI * 2 + mi; const d = 180 + e * 260; return <div key={i} style={{ position: "absolute", left: 960 + Math.cos(ang) * d - 40 * (1 - e), top: 540 + Math.sin(ang) * d - 40 * (1 - e), width: 80 * (1 - e), height: 80 * (1 - e), borderRadius: "50%", background: MORPH[mi][1] }} />; })}
            </Goo>
            {/* kinetic words orbiting */}
            {["Convert", "anything."].map((w, i) => { const k = sp(t, 4.3 + i * 0.2, 10, 220); return <div key={w} style={{ position: "absolute", left: i ? 1180 : 220, top: i ? 700 : 260, fontFamily: i ? SERIF : GEIST, fontStyle: i ? "italic" : undefined, fontWeight: 900, fontSize: 150, color: "#fff", letterSpacing: -5, transform: `translateZ(${(1 - k) * 900}px) rotateY(${(1 - k) * (i ? -70 : 70)}deg)`, opacity: k }}>{w}</div>; })}
          </AbsoluteFill>
        )}
        {t > 5.95 && t < 6.3 && <AbsoluteFill style={{ background: "#fff", opacity: 1 - Math.abs(t - 6.12) / 0.18 }} />}
        {/* SCENE C: Finder tilting in 3D, files cascade (6.1–8) */}
        {t >= 6.05 && (
          <AbsoluteFill style={{ transformStyle: "preserve-3d" }}>
            <div style={{ position: "absolute", left: 960 - 620, top: 540 - 340, width: 1240, height: 680, borderRadius: 26, background: "rgba(255,255,255,0.96)", boxShadow: "0 60px 160px rgba(0,0,0,0.6)", transform: `translateZ(${interpolate(sp(t, 6.05, 13, 120), [0, 1], [-1800, 0])}px) rotateX(${interpolate(sp(t, 6.05, 13, 120), [0, 1], [50, 12])}deg) rotateY(${-14 + Math.sin(t * 1.5) * 6}deg)`, transformStyle: "preserve-3d", overflow: "hidden" }}>
              <div style={{ height: 60, background: "#f1f1f4", display: "flex", alignItems: "center", gap: 10, padding: "0 22px" }}>{["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}<div style={{ marginLeft: 16, fontFamily: GEIST, fontWeight: 700, fontSize: 22, color: "#555" }}>Downloads</div></div>
              {[["Sunset.jpg", C.jpg], ["Report.docx", "#2b6cf6"], ["Interview.gif", C.gif], ["Logo.jpg", C.jpg], ["Podcast.mp3", C.mp3], ["Clip (smaller).mov", C.mov]].map(([n, c], i) => { const k = sp(t, 6.4 + i * 0.09, 11, 260); return <div key={n} style={{ display: "flex", alignItems: "center", gap: 18, height: 86, padding: "0 30px", fontFamily: GEIST, fontWeight: 700, fontSize: 30, color: "#111", transform: `translateX(${(1 - k) * 700}px) rotateY(${(1 - k) * -60}deg)`, opacity: k, background: i % 2 ? "#fafafb" : "#fff" }}><div style={{ width: 46, height: 58, borderRadius: 8, background: c, boxShadow: `0 6px 16px ${c}66` }} />{n}<div style={{ marginLeft: "auto", width: 34, height: 34, borderRadius: 17, background: C.shrink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, transform: `scale(${sp(t, 6.6 + i * 0.09, 9, 300)})` }}>✓</div></div>; })}
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      {/* chromatic edge glow / vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
      <Audio src={staticFile("tapformat/test_music.wav")} />
    </AbsoluteFill>
  );
};
export const TapCrazyTestComp: React.FC = () => <Composition id="TapformatCrazyTest" component={Test} durationInFrames={8 * FPS} fps={FPS} width={WD} height={HT} />;
