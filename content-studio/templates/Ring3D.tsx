// Real-time 3D solitaire ring (three.js via @remotion/three): metal band + 4 prongs + faceted brilliant diamond,
// lit by a procedural studio environment (RoomEnvironment) so metal + stone get real reflections. Deterministic.
import React, { useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export const METALS: Record<string, string> = { yellow: "#E9C46A", rose: "#E9A58E", white: "#E3E6EA" };

const Env: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const tex = pm.fromScene(new RoomEnvironment(), 0.03).texture;
    scene.environment = tex;
    (scene as unknown as { environmentIntensity: number }).environmentIntensity = intensity;
    return () => { tex.dispose(); pm.dispose(); };
  }, [gl, scene, intensity]);
  return null;
};

// brilliant-cut profile (radius, height) revolved with few segments → visible facets
const useDiamondGeo = (shape: "round" | "oval" | "pear") => useMemo(() => {
  const pts = [new THREE.Vector2(0, -0.62), new THREE.Vector2(0.28, -0.3), new THREE.Vector2(0.5, -0.03), new THREE.Vector2(0.52, 0.03), new THREE.Vector2(0.43, 0.15), new THREE.Vector2(0.3, 0.26), new THREE.Vector2(0.0, 0.27)];
  const g = new THREE.LatheGeometry(pts, 24);
  if (shape === "oval") g.scale(0.82, 1, 1.25);
  if (shape === "pear") { const p = g.attributes.position as THREE.BufferAttribute; for (let i = 0; i < p.count; i++) { const z = p.getZ(i); if (z > 0) p.setX(i, p.getX(i) * (1 - z * 0.9)); p.setZ(i, z * 1.25); } p.needsUpdate = true; }
  g.computeVertexNormals();
  return g.toNonIndexed();
}, [shape]);

const RingModel: React.FC<{ rotY: number; tilt: number; metal: string; shape: "round" | "oval" | "pear" }> = ({ rotY, tilt, metal, shape }) => {
  const dia = useDiamondGeo(shape);
  const metalMat = useMemo(() => new THREE.MeshStandardMaterial({ color: metal, metalness: 1, roughness: 0.16 }), [metal]);
  const stoneMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#F4F8FF", metalness: 0.92, roughness: 0.02, flatShading: true, envMapIntensity: 3.2, clearcoat: 1, clearcoatRoughness: 0, iridescence: 0.6, iridescenceIOR: 1.8 }), []);
  return (
    <group position={[0, -0.62, 0]} rotation={[tilt, rotY, 0]}>
      {/* band */}
      <mesh material={metalMat} rotation={[0, 0, 0]}>
        <torusGeometry args={[1, 0.11, 48, 220]} />
      </mesh>
      {/* head + prongs */}
      <group position={[0, 1.17, 0]}>
        <mesh material={metalMat} position={[0, -0.07, 0]}><cylinderGeometry args={[0.2, 0.12, 0.18, 32]} /></mesh>
        {[0, 1, 2, 3].map((k) => {
          const a = Math.PI / 4 + (k * Math.PI) / 2;
          return <mesh key={k} material={metalMat} position={[Math.cos(a) * 0.33, 0.24, Math.sin(a) * 0.33]} rotation={[Math.sin(a) * 0.22, 0, -Math.cos(a) * 0.22]}><cylinderGeometry args={[0.03, 0.045, 0.46, 12]} /></mesh>;
        })}
        <mesh geometry={dia} material={stoneMat} position={[0, 0.36, 0]} scale={0.74} rotation={[0, rotY * 0.0, 0]} />
      </group>
    </group>
  );
};

export const Ring3D: React.FC<{ width: number; height: number; rotY: number; tilt?: number; metal?: string; shape?: "round" | "oval" | "pear"; zoom?: number; bg?: string | null; envIntensity?: number; key2?: string }> = ({ width, height, rotY, tilt = 0.28, metal = METALS.yellow, shape = "round", zoom = 1, bg = null, envIntensity = 1 }) => (
  <ThreeCanvas width={width} height={height} camera={{ position: [0, 0.05, 7.0 / zoom], fov: 32 }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }} dpr={1.5} style={{ background: bg ?? "transparent" }}>
    <Env intensity={envIntensity} />
    <ambientLight intensity={0.25} />
    <directionalLight position={[3, 5, 4]} intensity={2.2} />
    <directionalLight position={[-4, 2, -2]} intensity={1.2} color="#FFE7B0" />
    <pointLight position={[0, 3, 2]} intensity={6} distance={10} />
    <pointLight position={[1.2, 1.6, 2.4]} intensity={14} distance={6} color="#ffffff" />
    <pointLight position={[-1.4, 1.2, 2]} intensity={10} distance={6} color="#BFD4FF" />
    <RingModel rotY={rotY} tilt={tilt} metal={metal} shape={shape} />
  </ThreeCanvas>
);
