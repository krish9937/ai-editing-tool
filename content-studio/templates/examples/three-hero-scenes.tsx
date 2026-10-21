// Tapformat v6: real Three.js hero renders, one transparent canvas per scene, layered under v5's CSS kinetic graphics.
// All take T = film time on the v5 timeline (warped onto the phonk's beat grid by CrazyRender).
import React from "react";
import { Easing, interpolate } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Cam, ci, COLS, FileCard3D, GlassRing, Keycap, Orb, sp, Studio } from "./Render3D";

const FPS_W = 1920, FPS_H = 1080;
const C = { heic: "#9e61ff", jpg: "#ff8f2e", png: "#3885ff", pdf: "#f5454d", gif: "#ff549e", shrink: "#2fc79c", mov: "#29c770", mp3: "#fab81f", docx: "#2b6cf6" };
const IO = Easing.bezier(0.7, 0, 0.3, 1);
const hitAt = (t: number, a: number, len = 0.3) => (t >= a && t < a + len ? 1 - (t - a) / len : 0);
const Canvas: React.FC<{ children: React.ReactNode; w?: number; h?: number }> = ({ children, w = FPS_W, h = FPS_H }) => (
  <ThreeCanvas width={w} height={h} shadows gl={{ alpha: true, antialias: true }} camera={{ fov: 36, near: 0.1, far: 100 }} style={{ position: "absolute", left: 0, top: 0 }}>{children}</ThreeCanvas>
);

// 0–3.95: the ⌘ keycap falls out of the sky and smashes the converter popups
export const Chaos3D: React.FC<{ t: number }> = ({ t }) => {
  if (t < 3.0) return null;
  const crush = ci(t, 3.2, 3.55, 0, 1, Easing.in(Easing.cubic)), press = hitAt(t, 3.55, 0.3);
  return (
    <Canvas>
      <Cam pos={[0, 3.0, 5.6]} look={[0, 0, 0]} roll={press * 0.05} />
      <Studio hue={C.pdf} floor={false} />
      <Keycap glyph="⌘" glow="#ffffff" press={press} s={1.7} pos={[0, interpolate(crush, [0, 1], [7, 0]), 0]} rot={[0.25 + (1 - crush) * 1.2, -0.3 + (1 - crush) * 2.5, -0.12]} />
      {press > 0 && Array.from({ length: 14 }).map((_, i) => { const a = (i / 14) * Math.PI * 2, e = 1 - press, d = 1.2 + e * 2.6; return <Orb key={i} col={[C.pdf, C.jpg, "#ffffff"][i % 3]} r={0.09 * press + 0.02} pos={[Math.cos(a) * d, 0.2 + Math.sin(e * Math.PI) * 0.9, Math.sin(a) * d * 0.6]} />; })}
    </Canvas>
  );
};

// 3.9–8.15: ⇧ ⌘ keycaps on a mirror floor, slams, glass ring + orbs rise, camera flies through the ring
export const Keys3D: React.FC<{ t: number }> = ({ t }) => {
  const k1 = sp(t, 4.05, 11, 140), k2 = sp(t, 4.35, 11, 140);
  const press = hitAt(t, 5.08, 0.28) + hitAt(t, 6.08, 0.25);
  const ringUp = ci(t, 6.0, 6.8, 0, 1, Easing.out(Easing.back(1.3)));
  const fly = ci(t, 7.35, 8.1, 0, 1, Easing.in(Easing.cubic));
  const base: [number, number, number] = [Math.sin(t * 0.45) * 1.8, interpolate(ci(t, 3.9, 7.0), [0, 1], [3.2, 2.0]), interpolate(ci(t, 3.9, 7.0), [0, 1], [7.0, 5.4])];
  const pos: [number, number, number] = [base[0] * (1 - fly), interpolate(fly, [0, 1], [base[1], 1.15]), interpolate(fly, [0, 1], [base[2], -1.2])];
  const look: [number, number, number] = [0, interpolate(ringUp, [0, 1], [0.1, 1.45]) - fly * 0.3, -fly * 5];
  return (
    <Canvas>
      <Cam pos={pos} look={look} roll={Math.sin(t * 1.3) * 0.04 + press * 0.04} />
      <Studio hue={C.jpg} />
      <Keycap glyph="⇧" glow={C.jpg} press={press} s={1.25} pos={[-1.05 - ringUp * 0.55, interpolate(k1, [0, 1], [6, 0]), 0]} rot={[0.08 * Math.sin(t * 2), -0.35 + (1 - k1) * 3, (1 - k1) * 0.8]} />
      <Keycap glyph="⌘" glow={C.heic} press={press} s={1.25} pos={[1.05 + ringUp * 0.55, interpolate(k2, [0, 1], [6, 0]), 0]} rot={[0.08 * Math.cos(t * 2), 0.35 - (1 - k2) * 3, -(1 - k2) * 0.8]} />
      {ringUp > 0.001 && (
        <group position={[0, 1.15, 0]}>
          <GlassRing rot={[0.12, Math.sin(t * 0.8) * 0.25, t * 0.4]} s={ringUp * 0.52} />
          {COLS.map((c, i) => { const a = (i / 6) * Math.PI * 2 + t * 2.4, r = 0.83 * ringUp; return <Orb key={i} col={c} r={0.16 * ringUp} pos={[Math.cos(a) * r, Math.sin(a) * r, Math.sin(t * 5 + i) * 0.1]} />; })}
          {Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * Math.PI * 2 - t * 3, r = 0.46 * ringUp + Math.sin(t * 6 + i) * 0.05; return <Orb key={"s" + i} col={COLS[i % 6]} r={0.06 * ringUp} pos={[Math.cos(a) * r, Math.sin(a) * r, 0]} />; })}
        </group>
      )}
    </Canvas>
  );
};

// 12–16.15: the drop — hero file card spins & changes format every beat, finished files orbit, orb bursts
export const MORPHS3: [string, string][] = [["HEIC", C.heic], ["JPG", C.jpg], ["PNG", C.png], ["PDF", C.pdf], ["DOCX", C.docx], ["MOV", C.mov], ["GIF", C.gif], ["MP3", C.mp3]];
export const Storm3D: React.FC<{ t: number }> = ({ t }) => {
  const i = Math.min(MORPHS3.length - 1, Math.max(0, Math.floor((t - 12.08) / 0.5)));
  const ph = ((t - 12.08) / 0.5) % 1;
  const [ext, col] = MORPHS3[i];
  return (
    <Canvas>
      <Cam pos={[Math.sin(t * 0.7) * 1.4, 0.35 + Math.sin(t * 1.1) * 0.2, 5.0]} look={[0, 0, 0]} fov={36} roll={Math.sin(t * 2.2) * 0.05} />
      <Studio hue={col} floor={false} />
      <FileCard3D ext={ext} col={col} rot={[Math.sin(t * 3) * 0.14, IO(Math.min(1, ph * 2.2)) * Math.PI * 2, Math.sin(t * 2) * 0.06]} s={1.05 * (1 + Math.max(0, 1 - ph * 5) * 0.14) * sp(t, 12.0, 10, 180)} />
      {MORPHS3.slice(0, i).map(([e, c], j) => { const a = (j / 8) * Math.PI * 2 + t * 1.1; return <FileCard3D key={e} ext={e} col={c} pos={[Math.cos(a) * 2.7, Math.sin(t * 1.6 + j) * 0.35, Math.sin(a) * 1.6 - 0.4]} rot={[0.15, -a + t * 1.5, 0.2]} s={0.42} />; })}
      {ph < 0.65 && Array.from({ length: 16 }).map((_, k) => { const a = (k / 16) * Math.PI * 2 + i, d = 0.7 + ph * 3.4; return <Orb key={k} col={k % 3 ? col : "#ffffff"} r={0.1 * (1 - ph / 0.65) + 0.01} pos={[Math.cos(a) * d, Math.sin(a) * d * 0.62 - ph * ph * 1.2, Math.sin(a * 3) * 0.5]} />; })}
    </Canvas>
  );
};

// 16.05–20.1: chrome hydraulic press squeezes the MOV card, green droplets spray
export const Shrink3D: React.FC<{ t: number }> = ({ t }) => {
  const sq = ci(t, 16.9, 17.2, 0, 1, Easing.in(Easing.cubic)) * (1 - ci(t, 17.6, 18.4));
  const size = interpolate(ci(t, 17.6, 18.6), [0, 1], [1, 0.72]);
  const half = 0.625 * size * (1 - sq * 0.4), gap = 0.45 * (1 - sq) + ci(t, 18.3, 19.0, 0, 4, Easing.in(Easing.cubic));
  const drop = sp(t, 16.1, 12, 140);
  return (
    <Canvas>
      <Cam pos={[Math.sin(t * 0.5) * 1.6, 0.6, 5.2]} look={[0, -0.05, 0]} roll={hitAt(t, 17.2, 0.3) * 0.06} />
      <Studio hue={C.shrink} floor={false} />
      <group position={[0, -0.15, 0]}>
        <FileCard3D ext="MOV" col={C.mov} rot={[0.05, t * 0.8, 0]} s={1.0 * size * drop} />
        {[1, -1].map((d) => (
          <mesh key={d} position={[0, d * (half + 0.17 + gap) + (1 - drop) * d * 3, 0]} castShadow>
            <boxGeometry args={[3.0, 0.3, 1.3]} />
            <meshPhysicalMaterial color="#e2e2ea" metalness={1} roughness={0.14} clearcoat={1} clearcoatRoughness={0.05} />
          </mesh>
        ))}
        {Array.from({ length: 18 }).map((_, k) => { const e = ci(t, 17.15 + (k % 6) * 0.025, 17.95 + (k % 6) * 0.025); if (e <= 0 || e >= 1) return null; const a = (k / 18) * Math.PI * 2; return <Orb key={k} col={k % 2 ? C.shrink : C.mov} r={0.1 * (1 - e) + 0.01} pos={[Math.cos(a) * (0.6 + e * 2.8), Math.sin(a) * (0.2 + e * 0.9) - e * e * 0.8, Math.sin(a * 2) * 0.6]} />; })}
      </group>
    </Canvas>
  );
};

// 28.05–33: glossy orbs swirl in and merge into the icon spot (600×600 canvas over the icon)
export const End3D: React.FC<{ t: number }> = ({ t }) => {
  const m = ci(t, 28.2, 29.3, 0, 1, Easing.inOut(Easing.cubic)), gone = ci(t, 29.15, 29.4);
  if (gone >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 960 - 300, top: 330 - 300, width: 600, height: 600 }}>
      <Canvas w={600} h={600}>
        <Cam pos={[0, 0, 6]} look={[0, 0, 0]} />
        <Studio hue={C.heic} floor={false} />
        {COLS.map((c, i) => { const a = -Math.PI / 2 + (i / 6) * Math.PI * 2 + (1 - m) * 3, r = interpolate(m, [0, 1], [3.4, 0.38]); return <Orb key={i} col={c} r={0.34 * (1 - gone)} pos={[Math.cos(a) * r, Math.sin(a) * r, Math.sin(a * 2) * (1 - m)]} />; })}
      </Canvas>
    </div>
  );
};
