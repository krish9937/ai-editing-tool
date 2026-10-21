// "Q" — a living QR-code mascot narrator: a rounded QR tile body with a white face window, finder-pattern "cheeks",
// noodle arms/legs, sneakers. Props: pose (arms), talk (0..1 mouth), mood, hop. Glossary pastel palette.
import React from "react";

const INK = "#2F2A4A", LAV = "#B9B2E6", ORG = "#F08A4B", CREAM = "#FFF8EF";
export type QPose = "idle" | "wave" | "point" | "shrug" | "cheer" | "think";
const ARM: Record<QPose, [number, number]> = { idle: [28, 28], wave: [28, 150], point: [28, 95], shrug: [115, 115], cheer: [155, 155], think: [28, 160] }; // degrees from straight down, outward
const cells = (() => { const out: [number, number][] = []; for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) { const r = Math.sin((x * 31 + y * 17) * 12.9898) * 43758.5453; if (r - Math.floor(r) > 0.52) out.push([x, y]); } return out; })();

export const QMascot: React.FC<{ t: number; size?: number; pose?: QPose; talk?: number; mood?: "happy" | "wow" | "wink"; hop?: number; style?: React.CSSProperties }> = ({ t, size = 360, pose = "idle", talk = 0, mood = "happy", hop = 0, style }) => {
  const [la, ra] = ARM[pose];
  const bob = Math.sin(t * 2.4) * 6 - Math.abs(Math.sin(t * 7)) * 22 * hop;
  const blink = (t % 3.4) > 3.27;
  const wave = pose === "wave" ? Math.sin(t * 10) * 18 : 0;
  const arm = (x: number, y: number, a: number, flip: number) => {
    const r = Math.PI / 180, L = 100, ex = x + flip * Math.sin(a * r) * L, ey = y + Math.cos(a * r) * L;
    const mx = x + flip * Math.sin(a * r) * L * 0.5 + flip * 14, my = y + Math.cos(a * r) * L * 0.5;
    return <g>
      <path d={`M ${x} ${y} Q ${mx} ${my} ${ex} ${ey}`} stroke={INK} strokeWidth={14} fill="none" strokeLinecap="round" />
      <circle cx={ex} cy={ey} r={18} fill={CREAM} stroke={INK} strokeWidth={5} />
    </g>;
  };
  return (
    <svg viewBox="0 0 400 520" width={size} height={size * 1.3} style={{ overflow: "visible", ...style }}>
      <ellipse cx="200" cy="508" rx="120" ry="12" fill="rgba(47,42,74,0.15)" />
      <g transform={`translate(0 ${bob})`}>
        {/* legs */}
        <path d="M 160 380 Q 150 430 156 470" stroke={INK} strokeWidth={12} fill="none" strokeLinecap="round" />
        <path d="M 240 380 Q 250 430 244 470" stroke={INK} strokeWidth={12} fill="none" strokeLinecap="round" />
        <path d="M 130 470 h 50 q 12 0 12 14 h -70 q 0 -14 8 -14 z" fill={ORG} stroke={INK} strokeWidth={5} />
        <path d="M 222 470 h 50 q 8 0 8 14 h -70 q 0 -14 12 -14 z" fill={ORG} stroke={INK} strokeWidth={5} />
        {/* arms (behind body) */}
        
        {/* QR body */}
        <rect x="70" y="100" width="260" height="290" rx="46" fill="#fff" stroke={INK} strokeWidth={8} />
        <g transform="translate(96 126)">
          {cells.map(([x, y], i) => <rect key={i} x={x * 23} y={y * 23} width={21} height={21} rx={4} fill={INK} opacity={0.85} />)}
          {[[0, 0], [154, 0], [0, 154]].map(([x, y], i) => <g key={i}><rect x={x} y={y} width={54} height={54} rx={12} fill={INK} /><rect x={x + 9} y={y + 9} width={36} height={36} rx={8} fill="#fff" /><rect x={x + 17} y={y + 17} width={20} height={20} rx={5} fill={i === 2 ? ORG : LAV} /></g>)}
        </g>
        {/* arms (in front, from the sides) */}
        {arm(72, 250, la, -1)}
        <g transform={`rotate(${wave} 328 250)`}>{arm(328, 250, ra, 1)}</g>
        {/* face window */}
        <rect x="118" y="196" width="164" height="118" rx="36" fill={CREAM} stroke={INK} strokeWidth={6} />
        {blink ? <><path d="M 152 240 q 12 8 24 0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" /><path d="M 224 240 q 12 8 24 0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" /></>
          : mood === "wink" ? <><circle cx="164" cy="238" r={11} fill={INK} /><path d="M 224 240 q 12 8 24 0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" /></>
          : <><circle cx="164" cy="238" r={mood === "wow" ? 14 : 11} fill={INK} /><circle cx="236" cy="238" r={mood === "wow" ? 14 : 11} fill={INK} /><circle cx="168" cy="233" r="4" fill="#fff" /><circle cx="240" cy="233" r="4" fill="#fff" /></>}
        <ellipse cx="140" cy="266" rx="12" ry="7" fill="#F7A9A0" opacity="0.7" />
        <ellipse cx="260" cy="266" rx="12" ry="7" fill="#F7A9A0" opacity="0.7" />
        {talk > 0.08 ? <ellipse cx="200" cy="278" rx={14 + talk * 4} ry={3 + talk * 13} fill="#B5475A" stroke={INK} strokeWidth={5} /> : mood === "wow" ? <ellipse cx="200" cy="280" rx="11" ry="14" fill="#B5475A" stroke={INK} strokeWidth={5} /> : <path d="M 182 272 q 18 16 36 0" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />}
      </g>
    </svg>
  );
};
