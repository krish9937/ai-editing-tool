// Vector puppet rebuilt from the linkutm glossary ROAS page character (auburn wavy hair, lavender oversized sweater,
// lavender joggers with cream dots, lavender sneakers, warm maroon outline). Fully posable: arms/legs/head/expressions.
import React from "react";

export const PAL = { OUT: "#8E4B4B", SKIN: "#FBE1CF", SKIN2: "#F2C9B2", HAIR: "#8A3A2C", HAIR2: "#A2493A", SW: "#CBC8EA", SW2: "#B7B3E0", PANTS: "#C4C3EA", DOT: "#F3DCC6", SHOE: "#B9B5E4", SOLE: "#F6EFE7" };
const S = 3.4; // outline width

export type Mouth = "smile" | "open" | "o" | "flat" | "grin";
export type Pose = {
  la?: [number, number]; // character's RIGHT arm (viewer's left): [shoulder deg, elbow deg]
  ra?: [number, number]; // character's LEFT arm (viewer's right)
  ll?: [number, number]; // legs: [hip deg, knee deg]
  rl?: [number, number];
  head?: number; // head tilt deg
  lean?: number; // body lean deg
  mouth?: Mouth;
  blink?: boolean;
  brows?: number; // -1 worried .. 1 raised
  hand?: "open" | "point" | "fist";
};

// smooth bendy limb: one rounded stroke path (outline pass + fill pass), angles: 0 = straight down, + = toward viewer's left
const Limb: React.FC<{ x: number; y: number; a1: number; a2: number; l1: number; l2: number; w1: number; w2: number; fill: string; cuff?: string; end?: React.ReactNode; dots?: boolean }> = ({ x, y, a1, a2, l1, l2, w1, w2, fill, cuff, end, dots }) => {
  const r = Math.PI / 180, d1 = [-Math.sin(a1 * r), Math.cos(a1 * r)], t2 = a1 + a2, d2 = [-Math.sin(t2 * r), Math.cos(t2 * r)];
  const ex = x + d1[0] * l1, ey = y + d1[1] * l1, hx = ex + d2[0] * l2, hy = ey + d2[1] * l2;
  // control point pulls the elbow/knee into a soft curve
  const path = `M ${x} ${y} Q ${ex} ${ey} ${(ex + hx) / 2} ${(ey + hy) / 2} T ${hx} ${hy}`;
  const w = (w1 + w2) / 2;
  const c0x = ex + d2[0] * (l2 - 14), c0y = ey + d2[1] * (l2 - 14);
  return (
    <g>
      <path d={path} fill="none" stroke={PAL.OUT} strokeWidth={w + S * 2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={path} fill="none" stroke={fill} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      {dots && [0.35, 0.75].map((u, i) => { const px = u < 0.5 ? x + (ex - x) * u * 2 : ex + (hx - ex) * (u - 0.5) * 2, py = u < 0.5 ? y + (ey - y) * u * 2 : ey + (hy - ey) * (u - 0.5) * 2; return <circle key={i} cx={px + (i ? -10 : 12)} cy={py} r={12} fill={PAL.DOT} />; })}
      {cuff && <line x1={c0x} y1={c0y} x2={hx - d2[0] * 2} y2={hy - d2[1] * 2} stroke={PAL.OUT} strokeWidth={w2 + 6 + S * 2} strokeLinecap="butt" />}
      {cuff && <line x1={c0x + d2[0] * 1.5} y1={c0y + d2[1] * 1.5} x2={hx - d2[0] * 3.5} y2={hy - d2[1] * 3.5} stroke={cuff} strokeWidth={w2 + 6} strokeLinecap="butt" />}
      <g transform={`translate(${hx} ${hy}) rotate(${t2})`}>{end}</g>
    </g>
  );
};
const Hand: React.FC<{ kind: "open" | "point" | "fist" }> = ({ kind }) => <g transform="scale(1.45)"><HandIn kind={kind} /></g>;
const HandIn: React.FC<{ kind: "open" | "point" | "fist" }> = ({ kind }) => {
  if (kind === "point") return (<g><rect x="-4" y="16" width="8" height="24" rx="4" fill={PAL.SKIN} stroke={PAL.OUT} strokeWidth={S * 0.8} /><ellipse cx="0" cy="12" rx="13" ry="13" fill={PAL.SKIN} stroke={PAL.OUT} strokeWidth={S * 0.8} /></g>);
  if (kind === "fist") return <ellipse cx="0" cy="14" rx="16" ry="15" fill={PAL.SKIN} stroke={PAL.OUT} strokeWidth={S} />;
  return (
    <g>
      <path d="M -14 4 C -20 26, -12 40, 0 42 C 12 40, 20 26, 14 4 Z" fill={PAL.SKIN} stroke={PAL.OUT} strokeWidth={S} strokeLinejoin="round" />
      {[-8, -2, 4, 10].map((x, i) => <line key={i} x1={x} y1={30} x2={x * 1.15} y2={48 - Math.abs(i - 1.5) * 3} stroke={PAL.OUT} strokeWidth={S * 0.8} strokeLinecap="round" />)}
    </g>
  );
};
const Shoe: React.FC = () => (
  <g>
    <path d="M -26 -6 C -26 -22, 22 -24, 26 -6 L 56 4 C 64 8, 62 22, 52 22 L -26 22 Z" fill={PAL.SHOE} stroke={PAL.OUT} strokeWidth={S} strokeLinejoin="round" />
    <path d="M -26 16 L 56 16" stroke={PAL.OUT} strokeWidth={S * 0.8} />
    <rect x="-28" y="18" width="88" height="8" rx="4" fill={PAL.SOLE} stroke={PAL.OUT} strokeWidth={S * 0.8} />
    <path d="M 0 -14 L 18 -4 M 8 -18 L 26 -8" stroke={PAL.OUT} strokeWidth={S * 0.7} strokeLinecap="round" />
  </g>
);

// 400 × 900 artboard, feet on y≈880
export const Avatar: React.FC<{ pose?: Pose; t?: number; size?: number; flip?: boolean; style?: React.CSSProperties }> = ({ pose = {}, t = 0, size = 400, flip = false, style }) => {
  const p = { la: [12, -8], ra: [-12, 8], ll: [4, 0], rl: [-4, 0], head: 0, lean: 0, mouth: "smile", brows: 0, hand: "open", ...pose } as Required<Pose>;
  const breathe = Math.sin(t * 2.2) * 2.5;
  const blink = pose.blink ?? ((t % 3.7) > 3.55);
  return (
    <svg viewBox="0 0 400 900" width={size} height={size * 2.25} style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, ...style }}>
      <ellipse cx="200" cy="884" rx="150" ry="16" fill="rgba(142,75,75,0.12)" />
      <g transform={`rotate(${p.lean} 200 860)`}>
        {/* legs */}
        <Limb x={170} y={500} a1={p.ll[0]} a2={p.ll[1]} l1={170} l2={170} w1={74} w2={64} fill={PAL.PANTS} cuff={PAL.SW2} dots end={<g transform={`rotate(${-p.ll[0] - p.ll[1]})`}><g transform="scale(-1 1)"><Shoe /></g></g>} />
        <Limb x={232} y={500} a1={p.rl[0]} a2={p.rl[1]} l1={170} l2={170} w1={74} w2={64} fill={PAL.PANTS} cuff={PAL.SW2} dots end={<g transform={`rotate(${-p.rl[0] - p.rl[1]})`}><Shoe /></g>} />
        {/* back arm (character's left / viewer right) */}
        <Limb x={282} y={262 + breathe} a1={p.ra[0]} a2={p.ra[1]} l1={128} l2={118} w1={66} w2={56} fill={PAL.SW} cuff={PAL.SW2} end={<Hand kind={p.hand} />} />
        {/* torso: oversized sweater */}
        <g transform={`translate(0 ${breathe})`}>
          <path d="M 120 270 C 120 236, 156 222, 200 222 C 244 222, 282 236, 282 270 L 292 470 C 292 492, 280 504, 262 504 L 140 504 C 122 504, 110 492, 110 470 Z" fill={PAL.SW} stroke={PAL.OUT} strokeWidth={S} strokeLinejoin="round" />
          <path d="M 112 468 L 290 468" stroke={PAL.OUT} strokeWidth={S * 0.8} />
          {Array.from({ length: 14 }).map((_, i) => <line key={i} x1={122 + i * 12.5} y1={472} x2={122 + i * 12.5} y2={500} stroke={PAL.SW2} strokeWidth={3} />)}
          <path d="M 150 300 C 170 320, 180 360, 176 410 M 240 300 C 232 340, 236 380, 246 420" stroke={PAL.SW2} strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M 170 228 C 180 246, 220 246, 230 228" fill="none" stroke={PAL.OUT} strokeWidth={S} />
          <path d="M 166 226 C 178 254, 222 254, 234 226" fill="none" stroke={PAL.SW2} strokeWidth={8} />
        </g>
        {/* head */}
        <g transform={`translate(0 ${breathe}) rotate(${p.head} 200 200)`}>
          <rect x="184" y="186" width="32" height="44" rx="12" fill={PAL.SKIN2} stroke={PAL.OUT} strokeWidth={S} />
          <ellipse cx="200" cy="148" rx="50" ry="58" fill={PAL.SKIN} stroke={PAL.OUT} strokeWidth={S} />
          <ellipse cx="152" cy="156" rx="11" ry="15" fill={PAL.SKIN} stroke={PAL.OUT} strokeWidth={S} />
          {/* hair: wavy quiff */}
          <path d="M 146 140 C 136 96, 160 66, 196 70 C 214 58, 248 66, 254 92 C 262 104, 256 124, 246 128 C 240 112, 226 106, 212 112 C 196 100, 178 108, 170 122 C 162 116, 154 126, 156 146 Z" fill={PAL.HAIR} stroke={PAL.OUT} strokeWidth={S} strokeLinejoin="round" />
          <path d="M 184 84 C 196 78, 212 80, 220 90 M 226 76 C 238 78, 246 86, 248 96" stroke={PAL.HAIR2} strokeWidth={4} fill="none" strokeLinecap="round" />
          {/* brows */}
          <path d={`M 196 ${126 - p.brows * 5} q 9 ${-4 - p.brows * 3} 18 0`} stroke={PAL.OUT} strokeWidth={S} fill="none" strokeLinecap="round" />
          <path d={`M 226 ${126 - p.brows * 5} q 8 ${-4 - p.brows * 3} 16 0`} stroke={PAL.OUT} strokeWidth={S} fill="none" strokeLinecap="round" />
          {/* eyes */}
          {blink ? (<><path d="M 198 142 q 7 4 14 0" stroke={PAL.OUT} strokeWidth={S} fill="none" /><path d="M 226 142 q 7 4 14 0" stroke={PAL.OUT} strokeWidth={S} fill="none" /></>) : (<><ellipse cx="205" cy="142" rx="4" ry="5.5" fill={PAL.OUT} /><ellipse cx="233" cy="142" rx="4" ry="5.5" fill={PAL.OUT} /></>)}
          <path d="M 222 150 q 4 10 -4 12" stroke={PAL.OUT} strokeWidth={S * 0.8} fill="none" strokeLinecap="round" />
          <ellipse cx="196" cy="166" rx="9" ry="5" fill="#F4AFA0" opacity={0.55} />
          <ellipse cx="242" cy="164" rx="7" ry="4" fill="#F4AFA0" opacity={0.55} />
          {/* mouth */}
          {p.mouth === "smile" && <path d="M 208 176 q 12 9 24 0" stroke={PAL.OUT} strokeWidth={S} fill="none" strokeLinecap="round" />}
          {p.mouth === "grin" && <path d="M 206 172 q 14 18 28 0 z" fill="#fff" stroke={PAL.OUT} strokeWidth={S} strokeLinejoin="round" />}
          {p.mouth === "open" && <ellipse cx="220" cy="178" rx="10" ry="8" fill="#B4545A" stroke={PAL.OUT} strokeWidth={S} />}
          {p.mouth === "o" && <ellipse cx="220" cy="180" rx="7" ry="9" fill="#B4545A" stroke={PAL.OUT} strokeWidth={S} />}
          {p.mouth === "flat" && <path d="M 210 178 L 230 178" stroke={PAL.OUT} strokeWidth={S} strokeLinecap="round" />}
        </g>
        {/* front arm (character's right / viewer left) */}
        <Limb x={120} y={262 + breathe} a1={p.la[0]} a2={p.la[1]} l1={128} l2={118} w1={66} w2={56} fill={PAL.SW} cuff={PAL.SW2} end={<Hand kind={p.hand} />} />
      </g>
    </svg>
  );
};

// named poses
export const POSES: Record<string, Pose> = {
  stand: {},
  wave: { ra: [-150, -30], mouth: "grin", brows: 0.6 },
  point: { ra: [-95, 0], hand: "point", mouth: "open", brows: 0.4, head: 4 },
  think: { la: [-35, -138], mouth: "flat", head: -6, brows: 0.3, hand: "fist" },
  shrug: { la: [38, 112], ra: [-38, -112], mouth: "flat", brows: 0.9, head: -5 },
  shock: { la: [12, -168], ra: [-12, 168], mouth: "o", brows: 1, lean: -3 },
  cheer: { la: [160, 10], ra: [-160, -10], mouth: "grin", brows: 0.8, hand: "fist" },
  present: { ra: [-70, -40], la: [20, -20], mouth: "smile", brows: 0.3 },
};
export const walkPose = (t: number, base: Pose = {}): Pose => {
  const s = Math.sin(t * 8);
  return { ...base, ll: [s * 22, Math.max(0, -s) * 30], rl: [-s * 22, Math.max(0, s) * 30], la: [-s * 18 + 8, -12], ra: [s * 18 - 8, 12] };
};
