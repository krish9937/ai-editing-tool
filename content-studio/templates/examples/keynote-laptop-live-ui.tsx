// Tapformat v7 — "Apple keynote" launch film (16:9, 60 fps, 30.75 s, drift phonk).
// Real MacBook model ("Laptop" by Oleg Muzyka, Sketchfab, CC BY 4.0 — credit in the post) in a warm-grey studio with soft
// shadows; v3's real-Mac UI runs LIVE on its display (DOM overlay mapped onto the projected screen corners with a
// homography), hard cuts to the full-screen UI, Apple-style type cards. Cuts locked to the phonk (beat 0.4644 s, phase 0.176).
import { AbsoluteFill, Audio, Composition, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { CLOSED_ANGLE, Env, OPEN_ANGLE, Rig, SCALE, shadowTex, useRig } from "../biodesk/LaptopIntro";
import { Desktop, Hook, KeyHUD, Shrink, Tools } from "./RealMac";

const { fontFamily: GEIST } = loadGeist("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });
const FPS = 60, DUR = 30.75, WD = 1920, HT = 1080;
const BEAT = 0.4644, PH = 0.176, BAR = BEAT * 4;
const bt = (n: number) => PH + n * BEAT; // time of beat n
const INK = "#1d1d1f", BGC = "#ebe8e3";
const EZ = Easing.bezier(0.22, 1, 0.36, 1), IO = Easing.bezier(0.65, 0, 0.35, 1);
const ci = (t: number, a: number, b: number, x = 0, y = 1, e = EZ) => interpolate(t, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

// ---------- rig placement + screen pose (computed once at the OPEN pose) ----------
type Pose = { c: THREE.Vector3; n: THREE.Vector3; r: THREE.Vector3; u: THREE.Vector3; w: number };
let PLACED = false, POSE: Pose | null = null;
const place = (rig: Rig) => {
  if (PLACED) return; PLACED = true;
  rig.root.scale.setScalar(SCALE); rig.pivot.rotation.x = OPEN_ANGLE; rig.root.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(rig.root); rig.root.position.set(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2); rig.root.updateMatrixWorld(true);
  const M = rig.screen.matrixWorld, c = rig.dispC.clone().applyMatrix4(M);
  const ex = rig.dispC.clone().add(new THREE.Vector3(rig.dispW / 2, 0, 0)).applyMatrix4(M);
  POSE = { c, n: new THREE.Vector3(0, -1, 0).transformDirection(M).normalize(), r: new THREE.Vector3(1, 0, 0).transformDirection(M).normalize(), u: new THREE.Vector3(0, 0, 1).transformDirection(M).normalize(), w: ex.distanceTo(c) * 2 };
  rig.screen.visible = false; // the live DOM overlay is the display
};
// camera shot = offsets in screen-widths from the display centre (n = out of the screen, r = right, u = up)
type Shot = { n: number; r: number; u: number; lr?: number; lu?: number };
const FILL = (() => { const hfov = 2 * Math.atan(Math.tan((30 * Math.PI) / 360) * (16 / 9)); return 1 / (2 * Math.tan(hfov / 2)); })();
const shotCam = (s: Shot) => { const P = POSE!; const pos = P.c.clone().addScaledVector(P.n, s.n * P.w).addScaledVector(P.r, s.r * P.w).addScaledVector(P.u, s.u * P.w); const look = P.c.clone().addScaledVector(P.r, (s.lr ?? 0) * P.w).addScaledVector(P.u, (s.lu ?? 0) * P.w); return { pos, look }; };
const lerpShot = (a: Shot, b: Shot, k: number): Shot => ({ n: a.n + (b.n - a.n) * k, r: a.r + (b.r - a.r) * k, u: a.u + (b.u - a.u) * k, lr: (a.lr ?? 0) + ((b.lr ?? 0) - (a.lr ?? 0)) * k, lu: (a.lu ?? 0) + ((b.lu ?? 0) - (a.lu ?? 0)) * k });

// ---------- homography: map a W×H div onto 4 projected points ----------
const solve = (A: number[][], b: number[]) => { const n = b.length; const M = A.map((r, i) => [...r, b[i]]);
  for (let i = 0; i < n; i++) { let p = i; for (let k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[p][i])) p = k; [M[i], M[p]] = [M[p], M[i]];
    for (let k = i + 1; k < n; k++) { const f = M[k][i] / M[i][i]; for (let j = i; j <= n; j++) M[k][j] -= f * M[i][j]; } }
  const x = new Array(n).fill(0); for (let i = n - 1; i >= 0; i--) { let s = M[i][n]; for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j]; x[i] = s / M[i][i]; } return x; };
const homography = (w: number, h: number, q: [number, number][]) => {
  const src: [number, number][] = [[0, 0], [w, 0], [w, h], [0, h]]; const A: number[][] = [], b: number[] = [];
  for (let i = 0; i < 4; i++) { const [x, y] = src[i], [X, Y] = q[i]; A.push([x, y, 1, 0, 0, 0, -x * X, -y * X]); b.push(X); A.push([0, 0, 0, x, y, 1, -x * Y, -y * Y]); b.push(Y); }
  const [a, bb, c, d, e, f, g, hh] = solve(A, b);
  return `matrix3d(${a},${d},0,${g},${bb},${e},0,${hh},0,0,1,0,${c},${f},0,1)`;
};

// ---------- the 3D laptop shot with live UI on the display ----------
const Cam: React.FC<{ cam: THREE.PerspectiveCamera }> = ({ cam }) => { const { camera } = useThree(); camera.position.copy(cam.position); camera.quaternion.copy(cam.quaternion); (camera as THREE.PerspectiveCamera).fov = cam.fov; (camera as THREE.PerspectiveCamera).updateProjectionMatrix(); return null; };
let SHADOW: THREE.Texture | null = null;
const Stage: React.FC<{ cam: THREE.PerspectiveCamera; rig: Rig }> = ({ cam, rig }) => {
  SHADOW = SHADOW ?? shadowTex();
  return <>
    <Cam cam={cam} /><Env />
    <fog attach="fog" args={[BGC, 45, 120]} />
    <ambientLight intensity={0.45} />
    <directionalLight position={[-24, 50, 34]} intensity={2.1} color="#fff6ea" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-40} shadow-camera-right={40} shadow-camera-top={40} shadow-camera-bottom={-40} shadow-radius={14} shadow-bias={-0.0005} />
    <directionalLight position={[34, 18, 30]} intensity={0.55} color="#eaf0ff" />
    <directionalLight position={[0, 25, -60]} intensity={0.9} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[700, 700]} /><meshPhysicalMaterial color={BGC} roughness={0.55} clearcoat={0.25} clearcoatRoughness={0.4} envMapIntensity={0.25} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0.5]}><planeGeometry args={[46, 34]} /><meshBasicMaterial map={SHADOW} transparent depthWrite={false} /></mesh>
    <primitive object={rig.root} />
  </>;
};
const Laptop3D: React.FC<{ shot: Shot; lid?: number; screenOn?: number; children: React.ReactNode; roll?: number }> = ({ shot, lid = OPEN_ANGLE, screenOn = 1, children, roll = 0 }) => {
  const rig = useRig();
  if (!rig) return null;
  place(rig);
  rig.pivot.rotation.x = lid; rig.root.updateMatrixWorld(true);
  const { pos, look } = shotCam(shot);
  const cam = new THREE.PerspectiveCamera(30, WD / HT, 0.5, 700); cam.position.copy(pos); cam.up.set(Math.sin(roll), Math.cos(roll), 0); cam.lookAt(look); cam.updateMatrixWorld(true);
  // display corners (TL, TR, BR, BL) → pixels
  const M = rig.screen.matrixWorld, d = rig.dispC, hw = rig.dispW / 2, hh = rig.dispH / 2;
  const q = ([[-hw, hh], [hw, hh], [hw, -hh], [-hw, -hh]] as [number, number][]).map(([x, z]) => { const v = new THREE.Vector3(d.x + x, d.y - 0.02, d.z + z).applyMatrix4(M).project(cam); return [((v.x + 1) / 2) * WD, ((1 - v.y) / 2) * HT] as [number, number]; });
  const SW = 1920, SH = Math.round((1920 * rig.dispH) / rig.dispW);
  return (
    <AbsoluteFill>
      <ThreeCanvas width={WD} height={HT} shadows="variance" gl={{ alpha: true, antialias: true, toneMapping: THREE.NoToneMapping }} camera={{ fov: 30, near: 0.5, far: 700 }} style={{ position: "absolute", inset: 0 }}>
        <Stage cam={cam} rig={rig} />
      </ThreeCanvas>
      {screenOn > 0 && (
        <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, transformOrigin: "0 0", transform: homography(SW, SH, q), overflow: "hidden", opacity: screenOn, borderRadius: 6 }}>
          <div style={{ position: "absolute", inset: 0 }}>{children}</div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(118deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 38%, transparent 55%)", pointerEvents: "none" }} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- keynote type ----------
const Words: React.FC<{ t: number; items: [string, number][]; size: number; color?: string; weight?: number; gap?: number; style?: React.CSSProperties }> = ({ t, items, size, color = INK, weight = 600, gap = 0.26, style }) => (
  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: size * gap, fontFamily: GEIST, fontWeight: weight, fontSize: size, letterSpacing: -size * 0.035, color, lineHeight: 1.08, ...style }}>
    {items.map(([w, a], i) => { const k = ci(t, a, a + 0.38); return <span key={i} style={{ display: "inline-block", opacity: k, transform: `translateY(${(1 - k) * size * 0.32}px)`, filter: `blur(${(1 - k) * 10}px)` }}>{w}</span>; })}
  </div>
);
const Caption: React.FC<{ t: number; a: number; b: number; text: string; dark?: boolean }> = ({ t, a, b, text, dark }) => {
  const k = ci(t, a, a + 0.3) * (1 - ci(t, b - 0.2, b));
  if (k <= 0) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, display: "flex", justifyContent: "center", opacity: k, transform: `translateY(${(1 - k) * 18}px)` }}><div style={{ fontFamily: GEIST, fontWeight: 600, fontSize: 40, letterSpacing: -1, color: dark ? "#fff" : INK, background: dark ? "rgba(20,20,22,0.72)" : "rgba(255,255,255,0.82)", backdropFilter: "blur(20px)", padding: "14px 30px", borderRadius: 999, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}>{text}</div></div>;
};
const StudioBG: React.FC<{ dark?: boolean }> = ({ dark }) => <AbsoluteFill style={{ background: dark ? "radial-gradient(ellipse at 50% 45%, #1c1c1f 0%, #0a0a0b 75%)" : "radial-gradient(ellipse at 50% 40%, #f3f1ed 0%, #ebe8e3 60%, #e4e1dc 100%)" }} />;
// Screen-Studio style zoom on the flat UI
const Zoom: React.FC<{ s: number; x: number; y: number; children: React.ReactNode }> = ({ s, x, y, children }) => <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${x}px ${y}px` }}>{children}</AbsoluteFill>;

// ---------- timeline (real seconds) ----------
const B = (n: number) => PH + n * BAR; // bar downbeats: 0.18 2.03 3.89 5.75 7.61 9.47 11.32 13.18 15.04 16.89 18.75 20.61 22.47 24.32 26.18 28.04 29.90
const DROP = 11.25;
const map = (t: number, a: number, b: number, va: number, vb: number) => va + ((t - a) / (b - a)) * (vb - va);

const Film: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let body: React.ReactNode = null;

  if (t < B(2)) {
    // A · lid opens in the studio, the sketchy converter site is on screen; headline on the beats
    const lid = interpolate(ci(t, 0.1, 1.15, 0, 1, Easing.out(Easing.cubic)), [0, 1], [CLOSED_ANGLE, OPEN_ANGLE]);
    const k = ci(t, 0, B(2), 0, 1, IO);
    const shot = lerpShot({ n: 2.25, r: -0.5, u: 0.2, lu: 0.1 }, { n: 1.9, r: 0.04, u: 0.24, lu: 0.1 }, k);
    body = <>
      <StudioBG />
      <Laptop3D shot={shot} lid={lid} screenOn={ci(t, 0.95, 1.25)}><Hook t={Math.max(0, map(t, 1.0, B(2), 0.2, 3.5))} /></Laptop3D>
      <div style={{ position: "absolute", left: 0, right: 0, top: 46 }}><Words t={t} size={84} items={[["Still", bt(2)], ["converting", bt(2) + 0.12], ["files", bt(3)], ["on", bt(4)], ["sketchy", bt(4) + 0.12], ["websites?", bt(5)]]} /></div>
    </>;
  } else if (t < B(3)) {
    // B · meet Tapformat
    const ik = ci(t, B(2), B(2) + 0.5, 0, 1, Easing.out(Easing.back(1.4)));
    body = <>
      <StudioBG />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26 }}>
        <Img src={staticFile("tapformat/icon.png")} style={{ width: 190, height: 190, transform: `scale(${ik})`, opacity: Math.min(1, ik * 2), filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.18))" }} />
        <Words t={t} size={150} weight={700} items={[["Tapformat.", bt(9)]]} />
        <Words t={t} size={46} weight={500} color="#6e6e73" items={[["Convert", bt(10)], ["any", bt(10) + 0.08], ["file", bt(10) + 0.16], ["right", bt(10) + 0.24], ["in", bt(10) + 0.32], ["Finder.", bt(10) + 0.4]]} />
      </AbsoluteFill>
    </>;
  } else if (t < DROP) {
    // C · the demo: dolly into the display, then the live desktop full-screen
    const v = map(t, B(3), DROP, 4.6, 9.9); // v3 desktop clock
    const push = ci(t, B(3), B(3) + 1.0, 0, 1, IO);
    const ui = <Desktop t={v} />;
    if (t < B(3) + 1.0) {
      body = <><StudioBG /><Laptop3D shot={lerpShot({ n: 1.35, r: 0.62, u: 0.22, lu: 0.06 }, { n: FILL * 1.0, r: 0, u: 0 }, push)}>{ui}</Laptop3D></>;
    } else {
      const z = 1 + 0.32 * ci(t, map(6.2, 4.6, 9.9, B(3), DROP), map(6.6, 4.6, 9.9, B(3), DROP), 0, 1, IO) * (1 - ci(t, map(9.0, 4.6, 9.9, B(3), DROP), map(9.5, 4.6, 9.9, B(3), DROP), 0, 1, IO));
      body = <>
        <Zoom s={z} x={700} y={300}>{ui}</Zoom>
        <KeyHUD t={v} a={6.3} out={7.4} />
        <Caption t={t} a={B(3) + 1.05} b={map(6.25, 4.6, 9.9, B(3), DROP)} text="Select a file in Finder." />
        <Caption t={t} a={map(6.3, 4.6, 9.9, B(3), DROP)} b={map(7.55, 4.6, 9.9, B(3), DROP)} text="Tap ⇧⌘." />
        <Caption t={t} a={map(7.6, 4.6, 9.9, B(3), DROP)} b={map(8.6, 4.6, 9.9, B(3), DROP)} text="Pick a format." />
        <Caption t={t} a={map(8.65, 4.6, 9.9, B(3), DROP)} b={DROP} text="Done. Saved right next to the original." />
      </>;
    }
  } else if (t < B(7)) {
    // DROP · black card
    body = <><StudioBG dark /><AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}><Words t={t} size={190} weight={700} color="#f5f5f7" items={[["Convert", DROP], ["anything.", DROP + BEAT]]} /></AbsoluteFill></>;
  } else if (t < B(9)) {
    // D · conversion montage, cutting between 3D angles and the screen every half bar
    const v = map(t, B(7), B(9), 9.6, 16.0);
    const ui = <Desktop t={v} />;
    const seg = Math.floor((t - B(7)) / (BAR / 2));
    const lt = (t - B(7) - seg * (BAR / 2)) / (BAR / 2);
    const SH: Shot[][] = [[{ n: 1.25, r: -0.75, u: -0.12, lu: 0.05 }, { n: 1.12, r: -0.6, u: -0.1, lu: 0.05 }], [{ n: 0, r: 0, u: 0 }, { n: 0, r: 0, u: 0 }], [{ n: 1.0, r: 0.72, u: 0.75, lu: -0.05 }, { n: 0.9, r: 0.55, u: 0.68, lu: -0.05 }], [{ n: 0, r: 0, u: 0 }, { n: 0, r: 0, u: 0 }]];
    const s = SH[seg % 4];
    const flat = s[0].n === 0;
    const lab = [["PDF → Word", 10.0], ["Video → GIF", 11.5], ["PNG → JPG", 13.0], ["WAV → MP3", 14.5]].filter(([, a]) => v >= (a as number) - 0.3).pop();
    body = <>
      <StudioBG />
      {flat ? <Zoom s={1.06 + lt * 0.05} x={960} y={500}>{ui}</Zoom> : <Laptop3D shot={lerpShot(s[0], s[1], EZ(lt))}>{ui}</Laptop3D>}
      {lab && <Caption t={v} a={(lab[1] as number) - 0.3} b={(lab[1] as number) + 1.4} text={lab[0] as string} dark={!flat} />}
    </>;
  } else if (t < B(11)) {
    // E · shrink
    const v = map(t, B(9), B(11), 18.0, 22.0);
    const z = 1 + 0.22 * ci(v, 18.2, 18.6, 0, 1, IO);
    body = <><Zoom s={z} x={760} y={430}><Shrink t={v} /></Zoom><Caption t={t} a={B(9) + 0.2} b={B(11)} text="Shrink big files. Same format." /></>;
  } else if (t < B(13)) {
    // F · tools
    const v = map(t, B(11), B(13), 22.0, 26.0);
    body = <Zoom s={1.04 + ci(t, B(11), B(13)) * 0.06} x={960} y={500}><Tools t={v} /></Zoom>;
  } else if (t < B(15)) {
    // G · trust: slow orbit around the laptop, type on the left
    const k = ci(t, B(13), B(15), 0, 1, (x) => x);
    body = <>
      <StudioBG />
      <Laptop3D shot={lerpShot({ n: 3.1, r: -1.05, u: 0.4, lu: 0.0, lr: -0.42 }, { n: 2.9, r: -0.6, u: 0.38, lu: 0.0, lr: -0.4 }, k)}><Desktop t={16.6} /></Laptop3D>
      <div style={{ position: "absolute", left: 110, top: 330, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
        {([["Works offline.", B(13)], ["Nothing uploaded.", B(13) + BAR / 2], ["Originals untouched.", B(14)]] as [string, number][]).map(([w, a]) => <Words key={w} t={t} size={76} weight={700} items={[[w, a]]} style={{ justifyContent: "flex-start" }} />)}
        <Words t={t} size={34} weight={500} color="#6e6e73" items={[["Everything", B(14) + BAR / 2], ["stays", B(14) + BAR / 2 + 0.08], ["on", B(14) + BAR / 2 + 0.16], ["your", B(14) + BAR / 2 + 0.24], ["Mac.", B(14) + BAR / 2 + 0.32]]} style={{ marginTop: 18, justifyContent: "flex-start" }} />
      </div>
    </>;
  } else {
    // H · end card
    const ik = ci(t, B(15), B(15) + 0.5, 0, 1, Easing.out(Easing.back(1.4)));
    const ck = ci(t, bt(64) + 0.1, bt(64) + 0.5, 0, 1, Easing.out(Easing.back(1.6)));
    body = <>
      <StudioBG />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 22 }}>
        <Img src={staticFile("tapformat/icon.png")} style={{ width: 170, height: 170, transform: `scale(${ik})`, opacity: Math.min(1, ik * 2), filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.18))" }} />
        <Words t={t} size={140} weight={700} items={[["Tapformat", bt(61)]]} />
        <Words t={t} size={48} weight={500} color="#6e6e73" items={[["Tap", bt(62)], ["⇧⌘.", bt(62) + 0.1], ["Convert", bt(63)], ["anything.", bt(63) + 0.1]]} />
        <div style={{ marginTop: 22, padding: "20px 50px", borderRadius: 999, background: INK, color: "#fff", fontFamily: GEIST, fontWeight: 600, fontSize: 36, transform: `scale(${ck})`, opacity: Math.min(1, ck * 2) }}>Download free for Mac</div>
        <div style={{ fontFamily: GEIST, fontSize: 24, color: "#86868b", opacity: ci(t, bt(65), bt(65) + 0.4) }}>macOS 15+ · works offline · never uploaded</div>
      </AbsoluteFill>
    </>;
  }

  // beat-synced micro push on downbeats (subtle, keynote-safe)
  const { n, e } = (() => { const nn = Math.floor((t - PH) / BEAT); return { n: nn, e: t - PH - nn * BEAT }; })();
  const punch = t > DROP && n % 2 === 0 ? Math.exp(-e * 14) * 0.012 : 0;
  return (
    <AbsoluteFill style={{ background: BGC, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + punch})` }}>{body}</AbsoluteFill>
      {/* film grain + soft vignette */}
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.22 }}>
        <svg width={WD} height={HT}><filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={Math.floor(t * 30) % 97} /><feColorMatrix type="saturate" values="0" /></filter><rect width={WD} height={HT} filter="url(#gr)" /></svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 50%, transparent 62%, rgba(0,0,0,0.16) 100%)" }} />
      <Audio src={staticFile("tapformat/music6.wav")} />
    </AbsoluteFill>
  );
};
export const TapKeynoteComp: React.FC = () => <Composition id="TapformatKeynote" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={WD} height={HT} />;
