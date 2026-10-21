// Tapformat v6 RENDER TEST (7 s, 60 fps): real Three.js renders — glossy clearcoat keycaps, glass (transmission) ring,
// glossy format orbs, extruded file cards, reflective studio floor, coloured rim lights, camera fly-through.
import { AbsoluteFill, Audio, Composition, Easing, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const FPS = 60, WD = 1920, HT = 1080;
const C = { heic: "#9e61ff", jpg: "#ff8f2e", png: "#3885ff", pdf: "#f5454d", gif: "#ff549e", shrink: "#2fc79c", mov: "#29c770", mp3: "#fab81f", docx: "#2b6cf6" };
export const COLS = [C.jpg, C.heic, C.png, C.mov, C.gif, C.pdf];
const EZ = Easing.bezier(0.16, 1, 0.3, 1), IO = Easing.bezier(0.7, 0, 0.3, 1);
export const ci = (t: number, a: number, b: number, x = 0, y = 1, e = EZ) => interpolate(t, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
export const sp = (t: number, a: number, d = 12, s = 200) => (t < a ? 0 : spring({ frame: (t - a) * FPS, fps: FPS, config: { damping: d, stiffness: s } }));
const hitAt = (t: number, a: number, len = 0.3) => (t >= a && t < a + len ? 1 - (t - a) / len : 0);

// ---------- textures ----------
const texCache = new Map<string, THREE.CanvasTexture>();
export const glyphTex = (g: string, col = "#15151a") => {
  const k = "g" + g + col; if (texCache.has(k)) return texCache.get(k)!;
  const cv = document.createElement("canvas"); cv.width = cv.height = 512; const x = cv.getContext("2d")!;
  x.fillStyle = col; x.font = "700 330px 'Segoe UI Symbol','Apple Symbols','Segoe UI',sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(g, 256, 270);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; texCache.set(k, t); return t;
};
export const cardTex = (ext: string, col: string) => {
  const k = "c" + ext + col; if (texCache.has(k)) return texCache.get(k)!;
  const cv = document.createElement("canvas"); cv.width = 512; cv.height = 640; const x = cv.getContext("2d")!;
  x.fillStyle = "#f6f5fa"; x.fillRect(0, 0, 512, 640);
  const g = x.createLinearGradient(0, 50, 0, 380); g.addColorStop(0, col); g.addColorStop(1, col + "bb"); x.fillStyle = g;
  x.beginPath(); x.roundRect(50, 56, 412, 330, 40); x.fill();
  x.fillStyle = "rgba(255,255,255,0.35)"; x.beginPath(); x.arc(150, 150, 46, 0, Math.PI * 2); x.fill();
  x.fillStyle = "rgba(255,255,255,0.55)"; x.beginPath(); x.moveTo(60, 380); x.lineTo(220, 220); x.lineTo(330, 330); x.lineTo(390, 270); x.lineTo(460, 380); x.closePath(); x.fill();
  x.fillStyle = col; x.font = "900 128px 'Segoe UI','Arial Black',sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(ext, 256, 520);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; texCache.set(k, t); return t;
};

// ---------- objects ----------
const keyGeo = new RoundedBoxGeometry(1, 0.46, 1, 8, 0.17);
export const Keycap: React.FC<{ glyph: string; pos: [number, number, number]; rot: [number, number, number]; press?: number; glow: string; s?: number }> = ({ glyph, pos, rot, press = 0, glow, s = 1 }) => (
  <group position={pos} rotation={rot} scale={[s, s * (1 - press * 0.35), s]}>
    <mesh geometry={keyGeo} castShadow receiveShadow>
      <meshPhysicalMaterial color="#f4f3f8" roughness={0.32} clearcoat={1} clearcoatRoughness={0.08} sheen={0.4} sheenColor={glow} />
    </mesh>
    <mesh position={[0, 0.232, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.84, 0.84]} />
      <meshStandardMaterial map={glyphTex(glyph)} transparent roughness={0.4} />
    </mesh>
    <pointLight position={[0, -0.4, 0]} color={glow} intensity={6 + press * 30} distance={3} />
  </group>
);
const cardGeo = new RoundedBoxGeometry(1, 1.25, 0.1, 6, 0.08);
export const FileCard3D: React.FC<{ ext: string; col: string; pos?: [number, number, number]; rot?: [number, number, number]; s?: number }> = ({ ext, col, pos = [0, 0, 0], rot = [0, 0, 0], s = 1 }) => (
  <group position={pos} rotation={rot} scale={s}>
    <mesh geometry={cardGeo} castShadow><meshPhysicalMaterial color="#ffffff" roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} /></mesh>
    <mesh position={[0, 0, 0.052]}><planeGeometry args={[0.9, 1.125]} /><meshPhysicalMaterial map={cardTex(ext, col)} roughness={0.3} clearcoat={1} clearcoatRoughness={0.05} /></mesh>
    <mesh position={[0, 0, -0.052]} rotation={[0, Math.PI, 0]}><planeGeometry args={[0.9, 1.125]} /><meshPhysicalMaterial map={cardTex(ext, col)} roughness={0.3} clearcoat={1} /></mesh>
  </group>
);
export const Orb: React.FC<{ col: string; pos: [number, number, number]; r?: number }> = ({ col, pos, r = 0.22 }) => (
  <mesh position={pos} castShadow><sphereGeometry args={[r, 48, 32]} /><meshPhysicalMaterial color={col} roughness={0.12} clearcoat={1} clearcoatRoughness={0.03} emissive={col} emissiveIntensity={0.18} /></mesh>
);
export const GlassRing: React.FC<{ pos?: [number, number, number]; rot?: [number, number, number]; s?: number }> = ({ pos = [0, 0, 0], rot = [0, 0, 0], s = 1 }) => (
  <mesh position={pos} rotation={rot} scale={s}>
    <torusGeometry args={[1.6, 0.3, 64, 200]} />
    <meshPhysicalMaterial color="#ffffff" transmission={1} thickness={0.8} roughness={0.04} ior={1.45} iridescence={1} iridescenceIOR={1.3} clearcoat={1} attenuationColor="#d9d0ff" attenuationDistance={2.5} />
  </mesh>
);

// ---------- studio ----------
export const Studio: React.FC<{ hue: string; exposure?: number; floor?: boolean }> = ({ hue, exposure = 1.1, floor = true }) => {
  const { gl, scene } = useThree();
  useMemo(() => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = exposure; gl.shadowMap.type = THREE.PCFSoftShadowMap; const pm = new THREE.PMREMGenerator(gl); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.55; scene.fog = floor ? new THREE.Fog("#07070b", 7, 16) : null; }, [gl, scene, exposure, floor]);
  return (
    <>
      <ambientLight intensity={0.15} />
      <spotLight position={[3, 7, 4]} angle={0.55} penumbra={0.8} intensity={140} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} />
      <pointLight position={[-5, 2, -2]} color={C.heic} intensity={70} distance={14} />
      <pointLight position={[5, 1.5, -3]} color={hue} intensity={70} distance={14} />
      <pointLight position={[0, 3, -6]} color={C.png} intensity={40} distance={14} />
      {floor && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshPhysicalMaterial color="#040407" roughness={0.22} metalness={0.85} clearcoat={1} clearcoatRoughness={0.06} />
      </mesh>}
    </>
  );
};
export const Cam: React.FC<{ pos: [number, number, number]; look: [number, number, number]; fov?: number; roll?: number }> = ({ pos, look, fov = 38, roll = 0 }) => {
  const { camera } = useThree();
  camera.position.set(...pos); camera.up.set(Math.sin(roll), Math.cos(roll), 0); camera.lookAt(...look);
  const pc = camera as THREE.PerspectiveCamera; if (pc.fov !== fov) { pc.fov = fov; pc.updateProjectionMatrix(); }
  return null;
};

// ---------- test choreography ----------
const MORPHS: [string, string][] = [["HEIC", C.heic], ["JPG", C.jpg], ["PNG", C.png], ["PDF", C.pdf], ["MOV", C.mov], ["GIF", C.gif], ["MP3", C.mp3]];
const Scene: React.FC<{ t: number }> = ({ t }) => {
  const k1 = sp(t, 0.1, 11, 140), k2 = sp(t, 0.35, 11, 140);
  const press = hitAt(t, 1.0, 0.25) + hitAt(t, 1.5, 0.25);
  const ringUp = ci(t, 1.6, 2.5, 0, 1, Easing.out(Easing.back(1.2)));
  const fly = ci(t, 2.9, 3.55, 0, 1, Easing.in(Easing.cubic));
  const inB = t >= 3.5;
  const mi = Math.min(MORPHS.length - 1, Math.max(0, Math.floor((t - 3.6) / 0.5)));
  const ph = ((t - 3.6) / 0.5) % 1;
  // camera: low orbit around keys → push into ring → fly through → orbit the hero card
  const camA: [number, number, number] = [Math.sin(t * 0.35) * 1.6, interpolate(ci(t, 0, 2.6), [0, 1], [3.4, 2.2]), interpolate(ci(t, 0, 2.6), [0, 1], [7.2, 5.4])];
  const camPos: [number, number, number] = inB ? [Math.sin(t * 0.6) * 2.4, 0.9 + Math.sin(t * 0.8) * 0.3, 4.6 - ci(t, 3.5, 4.2, -2, 0)] : [camA[0] * (1 - fly), camA[1] + fly * 0.2, camA[2] - fly * 5.6];
  const look: [number, number, number] = inB ? [0, 0.9, 0] : [0, interpolate(ringUp, [0, 1], [0.2, 1.1]), 0];
  return (
    <>
      <Cam pos={camPos} look={look} fov={inB ? 34 : 36} roll={Math.sin(t * 1.3) * 0.04 + press * 0.03} />
      <Studio hue={inB ? MORPHS[mi][1] : C.jpg} />
      {!inB && (
        <>
          <Keycap glyph="⇧" glow={C.jpg} press={press} pos={[-1.05 - ringUp * 0.5, interpolate(k1, [0, 1], [6, 0]), 0]} rot={[0.1 * Math.sin(t * 2), -0.35 + (1 - k1) * 3, (1 - k1) * 0.8]} s={1.25} />
          <Keycap glyph="⌘" glow={C.heic} press={press} pos={[1.05 + ringUp * 0.5, interpolate(k2, [0, 1], [6, 0]), 0]} rot={[0.1 * Math.cos(t * 2), 0.35 - (1 - k2) * 3, -(1 - k2) * 0.8]} s={1.25} />
          {ringUp > 0.001 && (
            <group position={[0, 1.15, 0]}>
              <GlassRing rot={[0.15, t * 0.6, 0]} s={ringUp * 0.62} />
              {COLS.map((c, i) => { const a = (i / 6) * Math.PI * 2 + t * 2.2, r = 0.99 * ringUp; return <Orb key={i} col={c} r={0.16 * ringUp} pos={[Math.cos(a) * r, Math.sin(a) * r, Math.sin(t * 5 + i) * 0.08]} />; })}
            </group>
          )}
        </>
      )}
      {inB && (
        <group position={[0, 0.9, 0]}>
          <FileCard3D ext={MORPHS[mi][0]} col={MORPHS[mi][1]} rot={[Math.sin(t * 3) * 0.12, IO(Math.min(1, ph * 2.2)) * Math.PI * 2, 0]} s={1.15 * (1 + Math.max(0, 1 - ph * 5) * 0.12) * sp(t, 3.5, 10, 160)} />
          {MORPHS.slice(0, mi).map(([e, c], j) => { const a = (j / 7) * Math.PI * 2 + t * 0.9; return <FileCard3D key={e} ext={e} col={c} pos={[Math.cos(a) * 2.3, Math.sin(t * 1.5 + j) * 0.4, Math.sin(a) * 2.3]} rot={[0, -a + Math.PI / 2 + t, 0.2]} s={0.45} />; })}
          {ph < 0.6 && Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * Math.PI * 2 + mi, d = 0.6 + ph * 3.2; return <Orb key={i} col={MORPHS[mi][1]} r={0.11 * (1 - ph / 0.6)} pos={[Math.cos(a) * d, Math.sin(a) * d * 0.6 - ph * ph * 1.5, Math.sin(a * 3) * 0.4]} />; })}
          <GlassRing rot={[0.25, 0, t * 0.5]} pos={[0, 0, -1.4]} s={0.75} />
        </group>
      )}
    </>
  );
};
const Test: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #1a1630 0%, #07070b 70%)" }}>
      <ThreeCanvas width={WD} height={HT} shadows gl={{ alpha: true, antialias: true }} camera={{ fov: 36, near: 0.1, far: 100 }} style={{ position: "absolute", inset: 0 }}>
        <Scene t={t} />
      </ThreeCanvas>
      {t > 3.4 && t < 3.75 && <AbsoluteFill style={{ background: "#fff", opacity: 1 - Math.abs(t - 3.55) / 0.2 }} />}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
      <Audio src={staticFile("tapformat/test_music.wav")} />
    </AbsoluteFill>
  );
};
export const TapRender3DTestComp: React.FC = () => <Composition id="TapformatRender3DTest" component={Test} durationInFrames={7 * FPS} fps={FPS} width={WD} height={HT} />;
