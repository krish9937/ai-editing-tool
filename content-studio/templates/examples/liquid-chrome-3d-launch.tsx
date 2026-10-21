// Tapformat launch film v2 — "Liquid chrome" (16:9, 32 s, music only, real Three.js renders + kinetic type).
// One continuous 3D studio: mirror-chrome ⇧⌘ keycaps, a glass format ring, liquid-metal morphs, hydraulic chrome plates,
// and the Tapformat icon rebuilt in 3D. Beat-locked to the 128 BPM bass-house bed (beat = 0.46875 s from 0).
import { AbsoluteFill, Audio, Composition, Easing, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";

const { fontFamily: GEIST } = loadGeist("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });
const { fontFamily: MONO } = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] });
const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });
const FPS = 30, DUR = 32.0, B = 0.46875, WD = 1920, HT = 1080;
const bt = (n: number) => n * B;
const INK = "#0c0c10", MUT = "#6c6c78";
const C = { heic: "#9e61ff", jpg: "#ff8f2e", png: "#3885ff", pdf: "#f5454d", gif: "#ff549e", shrink: "#2fc79c", rotate: "#7c6cf0", resize: "#1ab8cc", mp3: "#fab81f", docx: "#3b82ff", mov: "#29c770" };
const EZ = Easing.bezier(0.22, 1, 0.36, 1);
const ci = (t: number, a: number, b: number, x = 0, y = 1, e = EZ) => interpolate(t, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const sp = (t: number, a: number, d = 11, s = 170) => (t < a ? 0 : spring({ frame: (t - a) * FPS, fps: FPS, config: { damping: d, stiffness: s } }));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number) => { const v = Math.sin(i * 12.9898) * 43758.5453; return v - Math.floor(v); };
const hit = (t: number, a: number, len = 0.22) => (t >= a && t < a + len ? 1 - (t - a) / len : 0);

// ---------- textures ----------
const glyphTex = (txt: string, col = "#15151a", font = "500 300px Geist, sans-serif", w = 512, h = 512) => {
  const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d")!;
  g.clearRect(0, 0, w, h); g.fillStyle = col; g.font = font; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, w / 2, h / 2 + h * 0.03);
  const tx = new THREE.CanvasTexture(c); tx.anisotropy = 8; tx.colorSpace = THREE.SRGBColorSpace; return tx;
};
const roundedRect = (w: number, h: number, r: number) => {
  const s = new THREE.Shape(); const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
};
const slab = (w: number, h: number, r: number, depth: number, bevel: number) => {
  const g = new THREE.ExtrudeGeometry(roundedRect(w, h, r), { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 6, curveSegments: 18 });
  g.center(); return g;
};

const siteTex = () => {
  const w = 1080, h = 680, c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d")!;
  g.fillStyle = "#f4f4f7"; g.fillRect(0, 0, w, h); g.fillStyle = "#dcdce2"; g.fillRect(0, 0, w, 70);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => { g.fillStyle = col; g.beginPath(); g.arc(34 + i * 30, 35, 10, 0, 7); g.fill(); });
  g.fillStyle = "#fff"; g.fillRect(140, 16, 700, 38); g.fillStyle = "#777"; g.font = "500 24px Geist Mono, monospace"; g.fillText("free-online-file-converter.xyz", 160, 44);
  const grd = g.createLinearGradient(0, 0, w, 0); grd.addColorStop(0, "#ffe14d"); grd.addColorStop(1, "#ffb800"); g.fillStyle = grd; g.fillRect(40, 100, w - 80, 120);
  g.fillStyle = "#c4161c"; g.font = "800 46px Geist, sans-serif"; g.fillText("AD · WIN A FREE PHONE!!", 70, 178);
  g.fillStyle = "#222"; g.font = "700 40px Geist, sans-serif"; g.fillText("Uploading Sunset.heic…", 40, 290);
  g.fillStyle = "#ddd"; g.fillRect(40, 320, w - 80, 30); g.fillStyle = "#3b82ff"; g.fillRect(40, 320, (w - 80) * 0.34, 30);
  g.fillStyle = "#888"; g.font = "500 28px Geist Mono, monospace"; g.fillText("34% · position in queue: 2,481", 40, 400);
  g.fillStyle = "#e3e3ea"; g.fillRect(40, 440, w - 80, 200); g.fillStyle = "#999"; g.font = "700 40px Geist, sans-serif"; g.fillText("Please wait… (ad)", 360, 555);
  const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; return tx;
};

// ---------- env / camera ----------
const Env: React.FC = () => {
  const { gl, scene } = useThree();
  useMemo(() => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; const pm = new THREE.PMREMGenerator(gl); scene.environment = pm.fromScene(new RoomEnvironment(), 0.02).texture; }, [gl, scene]);
  return null;
};
type V3 = [number, number, number];
const Cam: React.FC<{ p: V3; l: V3; fov: number; roll?: number }> = ({ p, l, fov, roll = 0 }) => {
  const { camera } = useThree(); const c = camera as THREE.PerspectiveCamera;
  c.position.set(...p); c.up.set(Math.sin(roll), Math.cos(roll), 0); c.lookAt(...l); if (c.fov !== fov) c.fov = fov; c.updateProjectionMatrix(); return null;
};
// camera keyframes [time, pos, look, fov]
const KEYS: [number, V3, V3, number][] = [
  [0, [1.0, 4.6, 9.4], [1.0, 1.3, 0], 36], [bt(4), [1.6, 4.2, 8.0], [2.0, 1.0, 0], 36],
  [bt(6) - 0.05, [-2.2, 4.4, 6.4], [0, 0.4, 0], 36], [bt(11.5), [2.0, 3.8, 5.6], [0, 0.5, 0], 36],
  [bt(12.4), [0.2, 1.9, 6.6], [0.2, 1.6, -2], 36], [bt(21.5), [0.4, 1.75, 5.2], [0.4, 1.6, -2], 36],
  [bt(22.4), [0, 2.3, 1.6], [0, 1.8, -6], 38], [bt(33.5), [1.0, 2.1, 0.6], [0, 1.8, -6], 38],
  [bt(34.4), [0, 3.0, -3.4], [0, 1.6, -10], 36], [bt(41.5), [-1.0, 2.6, -4.2], [0, 1.4, -10], 36],
  [bt(42.4), [0, 2.0, -7.6], [0, 1.6, -14], 36], [bt(51.5), [0.4, 2.0, -8.2], [0, 1.6, -14], 36],
  [bt(52.4), [0.6, 3.6, -11.0], [0.6, 1.0, -18], 36], [bt(59.5), [0.6, 3.0, -12.0], [0.6, 1.0, -18], 36],
  [bt(60.4), [-3.2, 2.6, -13.6], [0, 1.5, -22], 34], [DUR, [2.6, 2.3, -14.4], [0, 1.5, -22], 32],
];
const camAt = (t: number) => {
  let i = 0; while (i < KEYS.length - 2 && t >= KEYS[i + 1][0]) i++;
  const [a, pa, la, fa] = KEYS[i], [b, pb, lb, fb] = KEYS[i + 1];
  const k = EZ(Math.max(0, Math.min(1, (t - a) / (b - a))));
  return { p: pa.map((v, j) => lerp(v, pb[j], k)) as V3, l: la.map((v, j) => lerp(v, lb[j], k)) as V3, fov: lerp(fa, fb, k) };
};

// ---------- materials ----------
const useMats = () => useMemo(() => ({
  chrome: new THREE.MeshPhysicalMaterial({ color: "#e9eaef", metalness: 1, roughness: 0.06, envMapIntensity: 1.25, clearcoat: 1, clearcoatRoughness: 0.02 }),
  darkChrome: new THREE.MeshPhysicalMaterial({ color: "#2a2b31", metalness: 1, roughness: 0.18, envMapIntensity: 1.1 }),
  glass: new THREE.MeshPhysicalMaterial({ color: "#ffffff", metalness: 0, roughness: 0.04, transmission: 1, thickness: 0.8, ior: 1.45, envMapIntensity: 1.2, clearcoat: 1, transparent: true }),
  floor: new THREE.MeshPhysicalMaterial({ color: "#a9abb6", metalness: 0.55, roughness: 0.22, envMapIntensity: 0.9 }),
  white: new THREE.MeshPhysicalMaterial({ color: "#f6f6f8", roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 }),
}), []);
const glossy = (col: string, em = 0.15) => new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.05, emissive: new THREE.Color(col), emissiveIntensity: em });

// ---------- 3D pieces ----------
const KEY_GEO = () => slab(1.0, 1.0, 0.2, 0.32, 0.07);
const Keycap3D: React.FC<{ glyph: string; pos: V3; drop: number; press: number; rot?: number; scale?: number }> = ({ glyph, pos, drop, press, rot = 0, scale = 1 }) => {
  const geo = useMemo(KEY_GEO, []); const m = useMats(); const tex = useMemo(() => glyphTex(glyph, "#121216"), [glyph]);
  const y = pos[1] + (1 - drop) * 9 - press * 0.12;
  return (
    <group position={[pos[0], y, pos[2]]} rotation={[-Math.PI / 2 + 0.0, 0, rot]} scale={[scale, scale, scale * (1 - press * 0.35)]}>
      <mesh geometry={geo} material={m.chrome} castShadow />
      <mesh position={[0, 0, 0.245]}><planeGeometry args={[0.8, 0.8]} /><meshBasicMaterial map={tex} transparent toneMapped={false} /></mesh>
    </group>
  );
};
const FileTile: React.FC<{ col: string; label: string; pos: V3; scale?: number | V3; rot?: V3; opacity?: number }> = ({ col, label, pos, scale = 1, rot = [0, 0, 0], opacity = 1 }) => {
  const geo = useMemo(() => slab(1.0, 1.3, 0.12, 0.08, 0.04), []); const m = useMats();
  const tex = useMemo(() => glyphTex(label, "#ffffff", "800 150px Geist, sans-serif", 512, 256), [label]);
  const band = useMemo(() => glossy(col, 0.25), [col]);
  return (
    <group position={pos} rotation={rot} scale={scale}>
      <mesh geometry={geo} material={m.white} />
      <mesh position={[0, 0.17, 0.125]}><planeGeometry args={[0.8, 0.62]} /><primitive object={band} attach="material" /></mesh>
      <mesh position={[0, -0.38, 0.126]}><planeGeometry args={[0.72, 0.36]} /><meshBasicMaterial map={tex} transparent toneMapped={false} color={col} opacity={opacity} /></mesh>
    </group>
  );
};
const noise3 = (x: number, y: number, z: number, t: number) => Math.sin(x * 1.9 + t * 2.4) * Math.sin(y * 2.2 - t * 1.8) * Math.sin(z * 2.0 + t * 1.5) + 0.45 * Math.sin(x * 3.3 - t * 3.1 + y * 2.4);
const LiquidBlob: React.FC<{ t: number; pos: V3; s: number; amp?: number; tint?: string }> = ({ t, pos, s, amp = 0.22, tint }) => {
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1, 28), []);
  const base = useMemo(() => Float32Array.from(geo.attributes.position.array as Float32Array), [geo]);
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#e9eaef", metalness: 1, roughness: 0.05, envMapIntensity: 1.3, clearcoat: 1 }), []);
  mat.color.set(tint ?? "#e9eaef");
  const p = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { const x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2]; const d = 1 + amp * noise3(x, y, z, t); p.setXYZ(i, x * d, y * d, z * d); }
  p.needsUpdate = true; geo.computeVertexNormals();
  return s > 0.01 ? <mesh geometry={geo} material={mat} position={pos} scale={s} rotation={[t * 0.5, t * 0.7, 0]} castShadow /> : null;
};
const GlassRing: React.FC<{ t: number; a: number; pos: V3; pick: number; items: [string, string][] }> = ({ t, a, pos, pick, items }) => {
  const m = useMats(); const k = sp(t, a, 10, 150);
  const labels = useMemo(() => items.map(([l]) => glyphTex(l, "#ffffff", "800 170px Geist, sans-serif", 512, 256)), [items]);
  const mats = useMemo(() => items.map(([, c]) => glossy(c, 0.35)), [items]);
  return (
    <group position={pos} scale={k} rotation={[0, 0, (1 - k) * -1.5]}>
      <mesh material={m.glass}><torusGeometry args={[2.3, 0.32, 48, 160]} /></mesh>
      <mesh material={m.darkChrome} position={[0, 0, -0.35]}><circleGeometry args={[2.7, 96]} /></mesh>
      {items.map(([l], i) => {
        const ang = Math.PI / 2 - (i / items.length) * Math.PI * 2 + t * 0.15, on = pick === i;
        const ki = sp(t, a + 0.08 + i * 0.06, 9, 220) * (on ? 1.25 + Math.sin(t * 20) * 0.03 : 1);
        return (
          <group key={l} position={[Math.cos(ang) * 2.3, Math.sin(ang) * 2.3, 0.1]} scale={ki}>
            <mesh material={mats[i]}><sphereGeometry args={[0.52, 48, 48]} /></mesh>
            <mesh position={[0, 0, 0.53]}><planeGeometry args={[0.9, 0.45]} /><meshBasicMaterial map={labels[i]} transparent toneMapped={false} /></mesh>
            {on && <pointLight color={items[i][1]} intensity={30} distance={6} />}
          </group>
        );
      })}
    </group>
  );
};
const Shards: React.FC<{ t: number; a: number; pos: V3 }> = ({ t, a, pos }) => {
  const e = t - a; if (e < 0 || e > 1.6) return null;
  return <group position={pos}>{Array.from({ length: 46 }).map((_, i) => {
    const r1 = rnd(i), r2 = rnd(i + 9), r3 = rnd(i + 21);
    const vx = (r1 - 0.5) * 9, vy = 2 + r2 * 7, vz = (r3 - 0.5) * 6;
    return <mesh key={i} position={[vx * e, vy * e - 9 * e * e, vz * e]} rotation={[e * 9 * r1, e * 7 * r2, e * 5]} scale={0.12 + r3 * 0.22}>
      <tetrahedronGeometry args={[1, 0]} /><meshPhysicalMaterial color={i % 3 ? "#f2f3f6" : "#ffcf3a"} metalness={i % 3 ? 0 : 0.2} roughness={0.08} transmission={i % 3 ? 0.9 : 0} thickness={0.3} />
    </mesh>;
  })}</group>;
};
const Sparks3D: React.FC<{ t: number; a: number; pos: V3; col: string; n?: number }> = ({ t, a, pos, col, n = 40 }) => {
  const e = t - a; if (e < 0 || e > 0.9) return null;
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: col, toneMapped: false, transparent: true }), [col]);
  mat.opacity = 1 - e / 0.9;
  return <group position={pos}>{Array.from({ length: n }).map((_, i) => { const th = rnd(i) * Math.PI * 2, ph = rnd(i + 5) * Math.PI, sp2 = 3 + rnd(i + 3) * 6;
    return <mesh key={i} material={mat} position={[Math.sin(ph) * Math.cos(th) * sp2 * e, Math.cos(ph) * sp2 * e, Math.sin(ph) * Math.sin(th) * sp2 * e]} scale={0.05 + 0.05 * (1 - e)}><sphereGeometry args={[1, 8, 8]} /></mesh>; })}</group>;
};
const SiteFace: React.FC = () => { const tx = useMemo(siteTex, []); return <mesh position={[0, 0.9, 0.07]}><planeGeometry args={[5.2, 3.27]} /><meshBasicMaterial map={tx} toneMapped={false} /></mesh>; };
const AppIcon3D: React.FC<{ t: number; a: number; pos: V3 }> = ({ t, a, pos }) => {
  const geo = useMemo(() => slab(2.4, 2.4, 0.55, 0.3, 0.12), []); const m = useMats(); const k = sp(t, a, 10, 120);
  const dots = [C.jpg, C.heic, C.png, C.mov, C.gif, C.pdf];
  const dm = useMemo(() => dots.map((d) => glossy(d, 0.6)), []);
  return (
    <group position={[pos[0], pos[1] + (1 - k) * -4, pos[2]]} rotation={[0.08, (1 - k) * Math.PI * 1.5 + Math.sin(t * 1.2) * 0.25, 0]} scale={0.4 + k * 0.6}>
      <mesh geometry={geo} material={m.darkChrome} />
      {dots.map((_, i) => { const ang = Math.PI / 2 - (i / 6) * Math.PI * 2; const pop = sp(t, a + 0.4 + i * 0.08, 9, 240); return <mesh key={i} material={dm[i]} position={[Math.cos(ang) * 0.68, Math.sin(ang) * 0.68, 0.3]} scale={0.16 * pop}><sphereGeometry args={[1, 32, 32]} /></mesh>; })}
      <mesh material={m.white} position={[0, 0, 0.3]} scale={0.3 * sp(t, a + 0.3, 9, 200)}><sphereGeometry args={[1, 48, 48]} /></mesh>
    </group>
  );
};

// ---------- the 3D world ----------
const MORPH: [string, string, number][] = [["HEIC", C.heic, 22], ["JPG", C.jpg, 24], ["PNG", C.png, 26], ["PDF", C.pdf, 28], ["DOCX", C.docx, 29], ["MP3", C.mp3, 30], ["GIF", C.gif, 32]];
const World: React.FC<{ t: number }> = ({ t }) => {
  const m = useMats(); const cam = camAt(t);
  const shake = hit(t, bt(4), 0.35) * 0.18 + hit(t, bt(6), 0.25) * 0.1 + hit(t, bt(7), 0.25) * 0.12 + hit(t, bt(36), 0.3) * 0.12 + hit(t, bt(64), 0.3) * 0.1;
  const p: V3 = [cam.p[0] + Math.sin(t * 90) * shake, cam.p[1] + Math.cos(t * 77) * shake, cam.p[2]];
  // section helpers
  const sweep = Math.sin(t * 0.9) * 8;
  // hook: ⌘ crushes the converter slab
  const crushDrop = ci(t, bt(4) - 0.32, bt(4), 0, 1, Easing.in(Easing.cubic));
  // ring section
  const pickJ = t > bt(17.2) ? 0 : -1;
  const melt = ci(t, bt(17.8), bt(18.4)), reform = ci(t, bt(18.4), bt(19.2), 0, 1, Easing.out(Easing.back(1.6)));
  // morph section
  let mi = 0; MORPH.forEach((mm, i) => { if (t >= bt(mm[2])) mi = i; });
  const mk = ci(t, bt(MORPH[mi][2]), bt(MORPH[mi][2]) + 0.25, 0, 1, Easing.out(Easing.back(2)));
  // shrink
  const pressDown = ci(t, bt(35.6), bt(36), 0, 1, Easing.in(Easing.cubic)), pressUp = ci(t, bt(36.7), bt(38));
  const sq = pressDown * (1 - pressUp);
  // tools
  const TOOL_AT = [42, 43.5, 45, 46.5, 48];
  let ti = 0; TOOL_AT.forEach((a, i) => { if (t >= bt(a)) ti = i; });
  const tk = ci(t, bt(TOOL_AT[ti]), bt(TOOL_AT[ti]) + 0.45, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <>
      <Env />
      <Cam p={p} l={cam.l} fov={cam.fov} roll={shake * 0.2} />
      <fog attach="fog" args={["#c9cbd4", 12, 30]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 12, 8]} intensity={2.4} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-14} />
      <pointLight position={[sweep, 5, 4]} intensity={60} distance={18} color="#ffffff" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]} material={m.floor} receiveShadow><planeGeometry args={[120, 120]} /></mesh>

      {/* HOOK (z=0): converter slab + ⌘ */}
      {t < bt(6.5) && (
        <group position={[2.6, 0, 0]}>
          {t < bt(4) + 0.05 && <group position={[0, 0.2, 0]} rotation={[-0.15, 0, 0]}>
            <mesh material={m.white} position={[0, 0.9, 0]} castShadow><boxGeometry args={[5.4, 3.4, 0.12]} /></mesh>
            <SiteFace />
          </group>}
          <Keycap3D glyph="⌘" pos={[0, 0.7, 0.6]} drop={crushDrop} press={hit(t, bt(4), 0.3)} scale={2.2} />
          <Shards t={t} a={bt(4)} pos={[0, 1.6, 0.4]} />
        </group>
      )}
      {/* TITLE (z=0): ⇧ ⌘ slam */}
      {t >= bt(5.6) && t < bt(12.6) && (
        <group>
          <Keycap3D glyph="⇧" pos={[-1.25, 0.32, 0]} drop={ci(t, bt(6) - 0.3, bt(6), 0, 1, Easing.in(Easing.cubic))} press={hit(t, bt(6), 0.3) + hit(t, bt(9), 0.25) * 0.6} scale={2} rot={0.06} />
          <Keycap3D glyph="⌘" pos={[1.25, 0.32, 0]} drop={ci(t, bt(7) - 0.3, bt(7), 0, 1, Easing.in(Easing.cubic))} press={hit(t, bt(7), 0.3) + hit(t, bt(9.25), 0.25) * 0.6} scale={2} rot={-0.06} />
          <Sparks3D t={t} a={bt(6)} pos={[-1.25, 0.6, 0]} col="#ffffff" />
          <Sparks3D t={t} a={bt(7)} pos={[1.25, 0.6, 0]} col={C.heic} />
        </group>
      )}
      {/* RING (z=-2) */}
      {t >= bt(12) && t < bt(22.6) && (
        <group position={[0, 1.6, -2]}>
          <GlassRing t={t} a={bt(14.6)} pos={[1.3, 0, 0]} pick={pickJ} items={[["JPG", C.jpg], ["PNG", C.png], ["PDF", C.pdf], ["SHRINK", C.shrink]]} />
          <FileTile col={C.heic} label="HEIC" pos={[1.3, 0, 0.3]} scale={(1 - melt) * sp(t, bt(12.3), 10, 180) * 1.05} rot={[0, Math.sin(t * 1.4) * 0.3, 0]} />
          <LiquidBlob t={t * 1.4} pos={[1.3, 0, 0.3]} s={Math.sin(Math.min(1, melt + reform * 0.0) * Math.PI) * 0.8 * (1 - reform)} amp={0.3} tint="#ffc49a" />
          {reform > 0 && <FileTile col={C.jpg} label="JPG" pos={[1.3, 0, 0.35]} scale={reform * 1.15} rot={[0, (1 - reform) * 3 + Math.sin(t * 1.4) * 0.25, 0]} />}
          <Sparks3D t={t} a={bt(18.4)} pos={[1.3, 0, 0.4]} col={C.jpg} n={60} />
        </group>
      )}
      {/* MORPH (z=-6): liquid chrome blob ejects formats */}
      {t >= bt(21.6) && t < bt(34.6) && (
        <group position={[0, 1.8, -6]}>
          <LiquidBlob t={t * 1.6} pos={[0, 0, -0.6]} s={1.55 + hit(t, bt(MORPH[mi][2]), 0.3) * 0.3} amp={0.26} />
          <FileTile col={MORPH[mi][1]} label={MORPH[mi][0]} pos={[0, -0.1, 1.3]} scale={0.7 + mk * 0.6} rot={[0, (1 - mk) * Math.PI * 2, 0]} />
          {MORPH.slice(0, mi).map((mm, i) => { const ang = Math.PI - (i / (MORPH.length - 1)) * Math.PI; return <FileTile key={mm[0]} col={mm[1]} label={mm[0]} pos={[Math.cos(ang) * 4.2, Math.sin(ang) * 1.6 - 0.2, -0.8]} scale={0.62} rot={[0, -Math.cos(ang) * 0.5, 0]} />; })}
          {MORPH.map((mm) => <Sparks3D key={mm[0]} t={t} a={bt(mm[2])} pos={[0, 0, 1.2]} col={mm[1]} n={34} />)}
        </group>
      )}
      {/* SHRINK (z=-10): hydraulic chrome plates */}
      {t >= bt(33.6) && t < bt(42.6) && (
        <group position={[0, 0, -10]}>
          <mesh material={m.chrome} position={[0, 3.6 - sq * 1.55, 0]} castShadow><boxGeometry args={[4.2, 0.5, 2.4]} /></mesh>
          <mesh material={m.chrome} position={[0, 5.5 - sq * 0.78, 0]}><cylinderGeometry args={[0.28, 0.28, 3.4 - sq * 1.55, 32]} /></mesh>
          <mesh material={m.darkChrome} position={[0, 0.15, 0]}><boxGeometry args={[4.6, 0.3, 2.8]} /></mesh>
          <FileTile col={C.mov} label="MOV" pos={[0, 1.15 - sq * 0.25 - pressUp * 0.25, 0]} scale={[1, 1 - sq * 0.55, 1].map((v) => v * (1.3 - pressUp * 0.45)) as V3} />
          <Sparks3D t={t} a={bt(36)} pos={[0, 0.9, 0.6]} col={C.shrink} n={70} />
        </group>
      )}
      {/* TOOLS (z=-14) */}
      {t >= bt(42.1) && t < bt(52.6) && (
        <group position={[0, 1.6, -14]}>
          {ti === 0 && <group><FileTile col={C.jpg} label="JPG" pos={[0, 0, 0]} scale={1.8} />{[[-1, 1], [1, 1], [1, -1], [-1, -1]].map(([sx, sy], i) => <group key={i} position={[sx * lerp(1.25, 0.7, tk), sy * lerp(1.45, 0.75, tk), 0.4]} rotation={[0, 0, Math.atan2(sy, sx) - Math.PI / 4 + Math.PI]}><mesh material={m.chrome} position={[0.25, 0, 0]}><boxGeometry args={[0.6, 0.12, 0.12]} /></mesh><mesh material={m.chrome} position={[0, 0.25, 0]}><boxGeometry args={[0.12, 0.6, 0.12]} /></mesh></group>)}</group>}
          {ti === 1 && <FileTile col={C.resize} label="PNG" pos={[0, 0, 0]} scale={lerp(2.0, 0.9, tk)} />}
          {ti === 2 && <FileTile col={C.rotate} label="HEIC" pos={[0, 0, 0]} scale={1.7} rot={[0, 0, -tk * Math.PI / 2]} />}
          {ti === 3 && <group><FileTile col={C.mov} label="MOV" pos={[0, 0, 0]} scale={1.7} /><mesh position={[0, 0, 0.6]} rotation={[0, 0, -0.7]} scale={[tk, 1, 1]}><boxGeometry args={[3.2, 0.18, 0.1]} /><meshPhysicalMaterial color={C.pdf} emissive={C.pdf} emissiveIntensity={0.5} roughness={0.2} /></mesh></group>}
          {ti === 4 && <group><FileTile col={C.pdf} label="PDF" pos={[lerp(-1.6, -0.08, tk), 0, 0]} scale={1.5} rot={[0, lerp(0.5, 0, tk), lerp(0.2, 0, tk)]} /><FileTile col={C.pdf} label="PDF" pos={[lerp(1.6, 0.08, tk), 0, 0.12]} scale={1.5} rot={[0, lerp(-0.5, 0, tk), lerp(-0.2, 0, tk)]} /></group>}
          {TOOL_AT.map((a) => <Sparks3D key={a} t={t} a={bt(a) + 0.42} pos={[0, 0, 0.6]} col="#ffffff" n={26} />)}
        </group>
      )}
      {/* PRIVACY (z=-18): file safe inside a glass dome on a chrome base */}
      {t >= bt(51.6) && t < bt(60.6) && (
        <group position={[0, 0, -18]}>
          <mesh material={m.chrome} position={[0, 0.2, 0]}><cylinderGeometry args={[2.0, 2.2, 0.4, 96]} /></mesh>
          <mesh material={m.glass} position={[0, 0.4, 0]} scale={sp(t, bt(52.4), 10, 150)}><sphereGeometry args={[1.95, 96, 64, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
          <FileTile col={C.heic} label="HEIC" pos={[0, 1.35, 0]} scale={1.1} rot={[0, Math.sin(t) * 0.6, 0]} />
          <pointLight position={[0, 2.2, 1.5]} intensity={18} distance={6} color="#bfefff" />
        </group>
      )}
      {/* OUTRO (z=-22): app icon in 3D + keycaps */}
      {t >= bt(59.6) && (
        <group position={[0, 0, -22]}>
          <group scale={0.72}><AppIcon3D t={t} a={bt(60.2)} pos={[0, 1.75, 0]} /></group>
          <Keycap3D glyph="⇧" pos={[-3.2, 0.2, 0.6]} drop={ci(t, bt(64) - 0.28, bt(64), 0, 1, Easing.in(Easing.cubic))} press={hit(t, bt(64), 0.3)} scale={1} />
          <Keycap3D glyph="⌘" pos={[3.2, 0.2, 0.6]} drop={ci(t, bt(64) - 0.28, bt(64), 0, 1, Easing.in(Easing.cubic))} press={hit(t, bt(64), 0.3)} scale={1} />
          <Sparks3D t={t} a={bt(64)} pos={[-3.2, 0.6, 0.6]} col={C.jpg} n={40} /><Sparks3D t={t} a={bt(64)} pos={[3.2, 0.6, 0.6]} col={C.heic} n={40} />
        </group>
      )}
    </>
  );
};

// ---------- kinetic type overlay ----------
const Mask: React.FC<{ t: number; a: number; out?: number; children: React.ReactNode; style?: React.CSSProperties; dir?: 1 | -1 }> = ({ t, a, out = 99, children, style, dir = 1 }) => {
  const k = ci(t, a, a + 0.4, 0, 1, Easing.out(Easing.cubic)), o = ci(t, out, out + 0.25, 0, 1, Easing.in(Easing.cubic));
  return <div style={{ position: "absolute", overflow: "hidden", ...style }}><div style={{ transform: `translateY(${(1 - k) * 110 * dir + o * -110}%)`, filter: k < 1 ? `blur(${(1 - k) * 8}px)` : undefined }}>{children}</div></div>;
};
const Big: React.FC<{ children: React.ReactNode; size?: number; col?: string; italic?: boolean }> = ({ children, size = 150, col = INK, italic }) => (
  <div style={{ fontFamily: SERIF, fontSize: size, lineHeight: 1.0, color: col, fontStyle: italic ? "italic" : undefined, letterSpacing: -2, whiteSpace: "nowrap" }}>{children}</div>
);
const Chip: React.FC<{ children: React.ReactNode; col?: string }> = ({ children, col = INK }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 999, background: "rgba(255,255,255,0.72)", border: "1px solid rgba(0,0,0,0.08)", backdropFilter: "blur(12px)", fontFamily: GEIST, fontWeight: 600, fontSize: 28, color: col, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>{children}</div>
);
const Overlay: React.FC<{ t: number }> = ({ t }) => {
  let mi = 0; MORPH.forEach((mm, i) => { if (t >= bt(mm[2])) mi = i; });
  const size = Math.round(interpolate(ci(t, bt(36), bt(37.6)), [0, 1], [248, 62]));
  const TOOLS: [string, string, number][] = [["Crop", C.jpg, 42], ["Resize", C.resize, 43.5], ["Rotate", C.rotate, 45], ["Mute video", C.mov, 46.5], ["Merge PDFs", C.pdf, 48]];
  let ti = 0; TOOLS.forEach((x, i) => { if (t >= bt(x[2])) ti = i; });
  return (
    <AbsoluteFill>
      {/* hook */}
      <Mask t={t} a={0.05} out={bt(3.6)} style={{ left: 110, top: 120 }}><Big size={110}>Still using</Big></Mask>
      <Mask t={t} a={0.25} out={bt(3.6)} style={{ left: 110, top: 240 }}><Big size={110} italic col="#7a7a86">converter websites?</Big></Mask>
      {t < bt(4) && <div style={{ position: "absolute", left: 110, top: 430, display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
        {[["⏳ Uploading… 34%", 0.4], ["⚠️ position in queue: 2,481", 0.75], ["📢 AD · WIN A FREE PHONE!!", 1.1]].map(([s, a]) => <div key={s as string} style={{ opacity: ci(t, a as number, (a as number) + 0.2), transform: `translateX(${(1 - ci(t, a as number, (a as number) + 0.3)) * 60}px)` }}><Chip col="#b42318">{s as string}</Chip></div>)}
      </div>}
      {/* title */}
      <Mask t={t} a={bt(8)} out={bt(11.6)} style={{ left: 0, right: 0, top: 120, textAlign: "center" }}><Big size={210}>Tap ⇧⌘.</Big></Mask>
      <Mask t={t} a={bt(10)} out={bt(11.6)} style={{ left: 0, right: 0, top: 770, textAlign: "center" }}><Big size={110} italic>Convert anything.</Big></Mask>
      {/* ring */}
      <Mask t={t} a={bt(12.4)} out={bt(21.6)} style={{ left: 110, top: 380 }}><Big size={96}>Select.</Big></Mask>
      <Mask t={t} a={bt(14)} out={bt(21.6)} style={{ left: 110, top: 490 }}><Big size={96} col={C.jpg}>⇧⌘.</Big></Mask>
      <Mask t={t} a={bt(18.4)} out={bt(21.6)} style={{ left: 110, top: 600 }}><Big size={96} italic>Done.</Big></Mask>
      {t > bt(19) && t < bt(21.8) && <div style={{ position: "absolute", left: 110, top: 760, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start", opacity: ci(t, bt(19), bt(19.6)) }}><Chip><span style={{ fontFamily: MONO, color: MUT }}>Sunset.heic</span> → <span style={{ fontFamily: MONO, color: C.jpg }}>Sunset.jpg</span></Chip><Chip col="#0f8a5f">✓ saved next to the original</Chip></div>}
      {/* morph */}
      <Mask t={t} a={bt(22.4)} out={bt(33.6)} style={{ left: 0, right: 0, top: 80, textAlign: "center" }}><Big size={104}>Only what <i>makes sense.</i></Big></Mask>
      {t > bt(22.4) && t < bt(33.8) && <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, display: "flex", justifyContent: "center", gap: 14 }}>{["Images", "PDFs", "Docs", "Audio", "Video"].map((c2, i) => { const lit = mi >= [1, 3, 4, 5, 6][i]; return <div key={c2} style={{ opacity: lit ? 1 : 0.35, transform: `scale(${lit ? 1 : 0.92})` }}><Chip col={lit ? MORPH[[1, 3, 4, 5, 6][i]][1] : MUT}>{c2}</Chip></div>; })}</div>}
      {t > bt(22) && t < bt(34) && <div key={mi} style={{ position: "absolute", right: 120, top: 430, fontFamily: GEIST, fontWeight: 800, fontSize: 120, color: MORPH[mi][1], opacity: ci(t, bt(MORPH[mi][2]), bt(MORPH[mi][2]) + 0.12), transform: `translateY(${(1 - ci(t, bt(MORPH[mi][2]), bt(MORPH[mi][2]) + 0.25)) * 40}px)`, letterSpacing: -3 }}>.{MORPH[mi][0].toLowerCase()}</div>}
      {/* shrink */}
      <Mask t={t} a={bt(34.3)} out={bt(41.6)} style={{ left: 110, top: 300 }}><Big size={140} col="#0f8a5f">Shrink</Big></Mask>
      <Mask t={t} a={bt(34.8)} out={bt(41.6)} style={{ left: 110, top: 440 }}><Big size={140} italic>anything.</Big></Mask>
      {t > bt(35) && t < bt(41.8) && <div style={{ position: "absolute", right: 120, top: 360, textAlign: "right" }}><div style={{ fontFamily: GEIST, fontWeight: 800, fontSize: 150, color: t > bt(37) ? "#0f8a5f" : INK, letterSpacing: -4 }}>{size} MB</div>{t > bt(37.6) && <div style={{ fontFamily: MONO, fontSize: 32, color: MUT, opacity: ci(t, bt(37.6), bt(38.2)) }}>Interview (smaller).mov</div>}<div style={{ marginTop: 18, fontFamily: SERIF, fontStyle: "italic", fontSize: 54, color: INK, opacity: ci(t, bt(39), bt(39.6)) }}>Same file. A fraction of the size.</div></div>}
      {/* tools */}
      {t > bt(42) && t < bt(51.8) && <div key={ti} style={{ position: "absolute", left: 120, top: 380, fontFamily: SERIF, fontSize: 180, color: TOOLS[ti][1], letterSpacing: -3, transform: `translateX(${(1 - ci(t, bt(TOOLS[ti][2]), bt(TOOLS[ti][2]) + 0.25)) * -80}px)`, opacity: ci(t, bt(TOOLS[ti][2]), bt(TOOLS[ti][2]) + 0.15) }}>{TOOLS[ti][0]}</div>}
      <Mask t={t} a={bt(50)} out={bt(51.6)} style={{ right: 120, top: 760 }}><Big size={96} italic>Not just formats.</Big></Mask>
      {/* privacy */}
      {[["On your Mac.", 52.6], ["Nothing uploaded.", 54], ["Originals untouched.", 56]].map(([s, a], i) => <Mask key={s as string} t={t} a={bt(a as number)} out={bt(59.6)} style={{ left: 120, top: 260 + i * 130 }}><div style={{ display: "flex", alignItems: "center", gap: 22 }}><div style={{ width: 70, height: 70, borderRadius: 35, background: "#2fc79c", color: "#fff", fontSize: 40, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div><Big size={100}>{s as string}</Big></div></Mask>)}
      {/* outro */}
      <Mask t={t} a={bt(61)} style={{ left: 0, right: 0, top: 60, textAlign: "center" }}><Big size={150}>Tapformat</Big></Mask>
      <Mask t={t} a={bt(62)} style={{ left: 0, right: 0, top: 230, textAlign: "center" }}><Big size={70} italic col="#55555f">Tap ⇧⌘. Convert anything.</Big></Mask>
      {t > bt(65) && <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: `scale(${sp(t, bt(65), 9, 220)})` }}><div style={{ background: INK, color: "#fff", fontFamily: GEIST, fontWeight: 700, fontSize: 42, padding: "16px 50px", borderRadius: 999, boxShadow: "0 20px 50px rgba(0,0,0,0.25)" }}>Download free for Mac</div><div style={{ fontFamily: MONO, fontSize: 24, color: MUT }}>macOS 15+ · works offline · never uploaded</div></div>}
    </AbsoluteFill>
  );
};

// ---------- master ----------
const Film: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const flash = Math.max(hit(t, bt(4), 0.14), hit(t, bt(7), 0.1), hit(t, bt(18.4), 0.1), hit(t, bt(36), 0.12), hit(t, bt(64), 0.12));
  // section whip blur at camera transitions
  const WHIPS = [bt(6), bt(12.4), bt(22.4), bt(34.4), bt(42.4), bt(52.4), bt(60.4)];
  const whip = Math.max(...WHIPS.map((a) => Math.max(0, 1 - Math.abs(t - a) / 0.16)));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, #fbfbfd 0%, #d9dae1 40%, #8f919c 100%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: whip > 0 ? `blur(${whip * 10}px)` : undefined, transform: `scale(${1 + whip * 0.04})` }}>
        <ThreeCanvas width={WD} height={HT} shadows gl={{ alpha: true, antialias: true }} camera={{ fov: 38, near: 0.1, far: 200 }} style={{ position: "absolute", inset: 0 }}>
          <World t={t} />
        </ThreeCanvas>
      </AbsoluteFill>
      {/* moving light streak + vignette */}
      <AbsoluteFill style={{ background: `linear-gradient(105deg, transparent ${30 + ((t * 40) % 140) - 40}%, rgba(255,255,255,0.35) ${35 + ((t * 40) % 140) - 40}%, transparent ${40 + ((t * 40) % 140) - 40}%)`, mixBlendMode: "screen", pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(40,40,50,0.18) 100%)" }} />
      <Overlay t={t} />
      {flash > 0 && <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.75 }} />}
      <Audio src={staticFile("tapformat/music.wav")} />
    </AbsoluteFill>
  );
};
export const TapChromeComp: React.FC = () => <Composition id="TapformatChrome" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={WD} height={HT} />;
