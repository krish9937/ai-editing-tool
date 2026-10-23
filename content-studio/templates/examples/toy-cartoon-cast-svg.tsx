// Santa reel — Pixar-style "3D toy" cartoon cast drawn in SVG: soft radial shading, specular
// highlights, contact shadows, big glossy eyes, blinks, breathing, squash/stretch and lip-sync.
import React from "react";

export type Mood = "neutral" | "panic" | "blank" | "shock" | "wink" | "laugh" | "guilty" | "skeptic" | "sheepish" | "sing" | "cry" | "deadpan" | "happy";

// shared radial "toy plastic" gradient: light top-left, base, dark rim
export const Ball: React.FC<{ id: string; c: [string, string, string]; cx?: string; cy?: string }> = ({ id, c, cx = "36%", cy = "30%" }) => (
  <radialGradient id={id} cx={cx} cy={cy} r="75%"><stop offset="0%" stopColor={c[0]} /><stop offset="55%" stopColor={c[1]} /><stop offset="100%" stopColor={c[2]} /></radialGradient>
);
const blinkAt = (t: number, seed: number) => { const p = (t + seed * 1.7) % 3.6; return p < 0.07 ? p / 0.07 : p < 0.14 ? 1 - (p - 0.07) / 0.07 : 0; };

// glossy cartoon eye: white, iris, pupil, two highlights, lid (0 open .. 1 closed)
export const Eye: React.FC<{ x: number; y: number; rx: number; ry: number; iris: number; col: string; lx: number; ly: number; lid: number; skin: string; closed?: "happy" | "line" | null; id: string }> = ({ x, y, rx, ry, iris, col, lx, ly, lid, skin, closed, id }) => {
  if (closed === "happy") return <path d={`M${x - rx} ${y + 4} Q ${x} ${y - ry * 0.9} ${x + rx} ${y + 4}`} stroke="#3A2318" strokeWidth={rx * 0.22} strokeLinecap="round" fill="none" />;
  if (closed === "line") return <path d={`M${x - rx} ${y} Q ${x} ${y + ry * 0.35} ${x + rx} ${y}`} stroke="#3A2318" strokeWidth={rx * 0.2} strokeLinecap="round" fill="none" />;
  const ix = x + lx * rx * 0.35, iy = y + ly * ry * 0.3;
  return (
    <g>
      <defs>
        <radialGradient id={id + "w"} cx="40%" cy="35%" r="70%"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="80%" stopColor="#EEF2F7" /><stop offset="100%" stopColor="#C9D1DC" /></radialGradient>
        <radialGradient id={id + "i"} cx="50%" cy="60%" r="60%"><stop offset="0%" stopColor={col} stopOpacity={0.55} /><stop offset="70%" stopColor={col} /><stop offset="100%" stopColor="#120A06" /></radialGradient>
        <clipPath id={id + "c"}><ellipse cx={x} cy={y} rx={rx} ry={ry} /></clipPath>
      </defs>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={`url(#${id}w)`} />
      <g clipPath={`url(#${id}c)`}>
        <circle cx={ix} cy={iy} r={iris} fill={`url(#${id}i)`} />
        <circle cx={ix} cy={iy} r={iris * 0.5} fill="#0A0605" />
        <circle cx={ix - iris * 0.38} cy={iy - iris * 0.42} r={iris * 0.32} fill="#fff" />
        <circle cx={ix + iris * 0.35} cy={iy + iris * 0.3} r={iris * 0.13} fill="#fff" opacity={0.85} />
        {lid > 0.01 && <rect x={x - rx - 2} y={y - ry - 2} width={rx * 2 + 4} height={(ry * 2 + 4) * lid} fill={skin} />}
        {lid > 0.01 && <rect x={x - rx - 2} y={y - ry - 2 + (ry * 2 + 4) * lid - 3} width={rx * 2 + 4} height={4} fill="#3A2318" opacity={0.55} />}
      </g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke="rgba(60,30,20,0.25)" strokeWidth={2} />
    </g>
  );
};

const Shadow: React.FC<{ cx: number; cy: number; rx: number }> = ({ cx, cy, rx }) => <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.14} fill="rgba(20,10,30,0.28)" style={{ filter: "blur(8px)" }} />;

const mouthShape = (cx: number, cy: number, talk: number, w: number, mood: Mood, id: string, lip = "#4A1010") => {
  if (mood === "laugh" || mood === "happy") {
    const o = 0.5 + talk * 0.5;
    return <g><path d={`M${cx - w * 1.4} ${cy - 4} Q ${cx} ${cy + w * 1.6 * o} ${cx + w * 1.4} ${cy - 4} Z`} fill={lip} /><path d={`M${cx - w * 0.8} ${cy + w * 0.9 * o} Q ${cx} ${cy + w * 0.4 * o} ${cx + w * 0.8} ${cy + w * 0.9 * o} Q ${cx} ${cy + w * 1.5 * o} ${cx - w * 0.8} ${cy + w * 0.9 * o}`} fill="#E0605A" /></g>;
  }
  const open = mood === "shock" ? Math.max(0.75, talk) : mood === "sing" ? Math.max(0.55, talk) : talk;
  if (open < 0.08) {
    if (mood === "blank" || mood === "deadpan") return <path d={`M${cx - w * 0.7} ${cy} L ${cx + w * 0.7} ${cy}`} stroke={lip} strokeWidth={w * 0.22} strokeLinecap="round" />;
    if (mood === "guilty" || mood === "panic" || mood === "cry") return <path d={`M${cx - w * 0.8} ${cy + 6} Q ${cx} ${cy - 8} ${cx + w * 0.8} ${cy + 6}`} stroke={lip} strokeWidth={w * 0.22} strokeLinecap="round" fill="none" />;
    if (mood === "skeptic") return <path d={`M${cx - w * 0.7} ${cy + 2} Q ${cx + w * 0.2} ${cy + 4} ${cx + w * 0.8} ${cy - 6}`} stroke={lip} strokeWidth={w * 0.22} strokeLinecap="round" fill="none" />;
    return <path d={`M${cx - w * 0.9} ${cy - 4} Q ${cx} ${cy + 10} ${cx + w * 0.9} ${cy - 4}`} stroke={lip} strokeWidth={w * 0.22} strokeLinecap="round" fill="none" />;
  }
  const rx = w * (0.75 + 0.35 * open) * (mood === "shock" || mood === "sing" ? 0.8 : 1), ry = w * (0.18 + 0.95 * open);
  return (
    <g>
      <defs><clipPath id={id + "m"}><ellipse cx={cx} cy={cy + ry * 0.35} rx={rx} ry={ry} /></clipPath></defs>
      <ellipse cx={cx} cy={cy + ry * 0.35} rx={rx} ry={ry} fill={lip} />
      <g clipPath={`url(#${id}m)`}><ellipse cx={cx} cy={cy + ry * 1.2} rx={rx * 0.75} ry={ry * 0.6} fill="#E0605A" /><rect x={cx - rx} y={cy + ry * 0.35 - ry - 2} width={rx * 2} height={ry * 0.28} fill="#FFF8F0" /></g>
    </g>
  );
};

// ======================= SANTA =======================
export type SantaP = { t: number; x: number; y: number; s?: number; mood?: Mood; talk?: number; lx?: number; ly?: number; armL?: number; armR?: number; phone?: boolean; tilt?: number; sq?: number; hat?: number; id?: string; sweat?: number; flip?: boolean };
export const Santa: React.FC<SantaP> = ({ t, x, y, s = 1, mood = "neutral", talk = 0, lx = 0, ly = 0, armL = 8, armR = 8, phone = false, tilt = 0, sq = 0, hat = 0, id = "sa", sweat = 0, flip = false }) => {
  const breathe = Math.sin(t * 2.2) * 0.012;
  const bl = blinkAt(t, 1);
  const eye = mood === "panic" ? { ry: 44, ir: 14 } : mood === "shock" ? { ry: 48, ir: 12 } : { ry: 38, ir: 17 };
  const lid = mood === "blank" || mood === "deadpan" ? 0.5 : mood === "guilty" ? 0.3 : 0;
  const bro = mood === "panic" ? [18, -26] : mood === "shock" ? [0, -40] : mood === "blank" ? [0, 4] : mood === "guilty" ? [16, -10] : mood === "wink" ? [-8, -16] : [0, -6];
  const SK = "#F7C4A0";
  const tipX = 470 + hat * 40 + Math.sin(t * 3) * 6, tipY = 120 - hat * 20;
  return (
    <div style={{ position: "absolute", left: x - 300 * s, top: y - 800 * s, width: 600 * s, height: 820 * s, transformOrigin: "50% 97%", transform: `scaleX(${(flip ? -1 : 1) * (1 + sq)}) scaleY(${1 - sq + breathe})` }}>
      <svg viewBox="0 0 600 820" width={600 * s} height={820 * s} style={{ overflow: "visible" }}>
        <defs>
          <Ball id={id + "coat"} c={["#FF6B5E", "#D9262B", "#8A0F18"]} />
          <Ball id={id + "fur"} c={["#FFFFFF", "#F3EFE8", "#C8C0B4"]} />
          <Ball id={id + "skin"} c={["#FFE4D0", SK, "#D88E6C"]} />
          <Ball id={id + "nose"} c={["#FFB4A4", "#EE7A66", "#B8503F"]} />
          <Ball id={id + "boot"} c={["#5A4A48", "#231A1A", "#0A0606"]} />
          <Ball id={id + "glove"} c={["#FFFFFF", "#ECE7DF", "#B9B1A4"]} />
          <radialGradient id={id + "cheek"}><stop offset="0%" stopColor="#FF7A7A" stopOpacity={0.75} /><stop offset="100%" stopColor="#FF7A7A" stopOpacity={0} /></radialGradient>
          <linearGradient id={id + "belt"} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B2E2C" /><stop offset="100%" stopColor="#120C0C" /></linearGradient>
          <linearGradient id={id + "gold"} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FFF0A6" /><stop offset="50%" stopColor="#F2C14E" /><stop offset="100%" stopColor="#B07A1A" /></linearGradient>
          <clipPath id={id + "bc"}><ellipse cx={300} cy={575} rx={232} ry={215} /></clipPath>
        </defs>
        <Shadow cx={300} cy={792} rx={230} />
        {/* boots */}
        <ellipse cx={215} cy={770} rx={78} ry={42} fill={`url(#${id}boot)`} /><ellipse cx={385} cy={770} rx={78} ry={42} fill={`url(#${id}boot)`} />
        <ellipse cx={195} cy={755} rx={26} ry={9} fill="#fff" opacity={0.25} /><ellipse cx={365} cy={755} rx={26} ry={9} fill="#fff" opacity={0.25} />
        {/* left arm (behind) */}
        <g transform={`rotate(${armL}, 92, 470)`}>
          <rect x={50} y={450} width={84} height={205} rx={42} fill={`url(#${id}coat)`} />
          <ellipse cx={92} cy={655} rx={50} ry={22} fill={`url(#${id}fur)`} />
          <circle cx={92} cy={695} r={44} fill={`url(#${id}glove)`} /><circle cx={124} cy={680} r={16} fill={`url(#${id}glove)`} />
        </g>
        {/* body */}
        <ellipse cx={300} cy={575} rx={232} ry={215} fill={`url(#${id}coat)`} />
        <g clipPath={`url(#${id}bc)`}>
          <rect x={60} y={588} width={480} height={58} fill={`url(#${id}belt)`} />
          <ellipse cx={300} cy={790} rx={260} ry={52} fill={`url(#${id}fur)`} />
          <rect x={282} y={380} width={36} height={420} rx={18} fill={`url(#${id}fur)`} />
        </g>
        <rect x={252} y={578} width={96} height={78} rx={14} fill="none" stroke={`url(#${id}gold)`} strokeWidth={14} />
        <ellipse cx={210} cy={450} rx={70} ry={36} fill="#fff" opacity={0.13} transform="rotate(-25 210 450)" />
        {/* head */}
        <g transform={`translate(0 ${-talk * 5}) rotate(${tilt + Math.sin(t * 1.3) * 1.2} 300 330)`}>
          <circle cx={182} cy={262} r={26} fill={`url(#${id}skin)`} /><circle cx={418} cy={262} r={26} fill={`url(#${id}skin)`} />
          <ellipse cx={300} cy={258} rx={120} ry={114} fill={`url(#${id}skin)`} />
          {/* beard */}
          {[[300, 425, 98], [222, 385, 72], [378, 385, 72], [248, 458, 62], [352, 458, 62], [300, 492, 54], [190, 318, 50], [410, 318, 50], [205, 430, 48], [395, 430, 48]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={`url(#${id}fur)`} />)}
          {mouthShape(300, 352, talk, 30, mood, id)}
          <ellipse cx={222} cy={296} rx={36} ry={24} fill={`url(#${id}cheek)`} /><ellipse cx={378} cy={296} rx={36} ry={24} fill={`url(#${id}cheek)`} />
          {/* moustache */}
          <ellipse cx={252} cy={326} rx={62} ry={27} fill={`url(#${id}fur)`} transform={`rotate(${-12 - talk * 6} 252 326)`} />
          <ellipse cx={348} cy={326} rx={62} ry={27} fill={`url(#${id}fur)`} transform={`rotate(${12 + talk * 6} 348 326)`} />
          <circle cx={300} cy={312} r={24} fill={`url(#${id}fur)`} />
          <circle cx={300} cy={290} r={31} fill={`url(#${id}nose)`} /><ellipse cx={290} cy={279} rx={10} ry={7} fill="#fff" opacity={0.6} />
          {/* eyes + specs */}
          <Eye id={id + "e1"} x={254} y={236} rx={30} ry={eye.ry} iris={eye.ir} col="#5B3A22" lx={lx} ly={ly} lid={Math.max(lid, bl)} skin={SK} closed={mood === "laugh" ? "happy" : null} />
          <Eye id={id + "e2"} x={346} y={236} rx={30} ry={eye.ry} iris={eye.ir} col="#5B3A22" lx={lx} ly={ly} lid={Math.max(lid, bl)} skin={SK} closed={mood === "laugh" ? "happy" : mood === "wink" ? "line" : null} />
          <circle cx={254} cy={240} r={46} fill="rgba(255,255,255,0.07)" stroke={`url(#${id}gold)`} strokeWidth={6} /><circle cx={346} cy={240} r={46} fill="rgba(255,255,255,0.07)" stroke={`url(#${id}gold)`} strokeWidth={6} />
          <path d="M290 238 Q 300 230 310 238" stroke={`url(#${id}gold)`} strokeWidth={5} fill="none" />
          {/* brows */}
          <ellipse cx={250} cy={180 + bro[1]} rx={42} ry={16} fill={`url(#${id}fur)`} transform={`rotate(${bro[0]} 250 ${180 + bro[1]})`} />
          <ellipse cx={350} cy={180 + bro[1] + (mood === "wink" ? 14 : 0)} rx={42} ry={16} fill={`url(#${id}fur)`} transform={`rotate(${-bro[0]} 350 ${180 + bro[1]})`} />
          {/* hat */}
          <path d={`M170 160 C 176 60, 258 2, 345 10 C 420 18, 462 62, ${tipX} ${tipY} C 446 96, 426 116, 432 160 Z`} fill={`url(#${id}coat)`} />
          <circle cx={tipX + 4} cy={tipY + 8} r={34} fill={`url(#${id}fur)`} />
          <ellipse cx={300} cy={160} rx={142} ry={40} fill={`url(#${id}fur)`} />
          {sweat > 0 && <path d={`M${430} ${170 + sweat * 60} q -12 22 0 30 q 12 -8 0 -30`} fill="#9FD3FF" stroke="#5AA8E8" strokeWidth={2} opacity={Math.min(1, sweat * 3)} />}
        </g>
        {/* right arm (front) */}
        <g transform={`rotate(${-armR}, 508, 470)`}>
          <rect x={466} y={450} width={84} height={205} rx={42} fill={`url(#${id}coat)`} />
          <ellipse cx={508} cy={655} rx={50} ry={22} fill={`url(#${id}fur)`} />
          {phone && <g><rect x={470} y={640} width={60} height={110} rx={14} fill="#1E2230" /><rect x={476} y={648} width={48} height={92} rx={9} fill="#5EC8FF" opacity={0.85} /></g>}
          <circle cx={508} cy={695} r={44} fill={`url(#${id}glove)`} /><circle cx={476} cy={680} r={16} fill={`url(#${id}glove)`} />
        </g>
      </svg>
    </div>
  );
};

// ======================= MRS. CLAUS =======================
export type MrsP = { t: number; x: number; y: number; s?: number; mood?: Mood; talk?: number; lx?: number; ly?: number; wave?: number; clipboard?: boolean; phone?: boolean; id?: string; tilt?: number };
export const MrsClaus: React.FC<MrsP> = ({ t, x, y, s = 1, mood = "neutral", talk = 0, lx = 0, ly = 0, wave = 0, clipboard = true, phone = false, id = "mc", tilt = 0 }) => {
  const SK = "#F9CDB0", bl = blinkAt(t, 2.3), breathe = Math.sin(t * 2.0 + 1) * 0.012;
  const brL = mood === "skeptic" ? -22 : mood === "sheepish" ? -6 : 0, brR = mood === "skeptic" ? 6 : mood === "sheepish" ? -6 : 0;
  return (
    <div style={{ position: "absolute", left: x - 250 * s, top: y - 790 * s, width: 500 * s, height: 800 * s, transformOrigin: "50% 98%", transform: `scaleY(${1 + breathe})` }}>
      <svg viewBox="0 0 500 800" width={500 * s} height={800 * s} style={{ overflow: "visible" }}>
        <defs>
          <Ball id={id + "dress"} c={["#FF6F6A", "#C8202C", "#7A0E18"]} />
          <Ball id={id + "white"} c={["#FFFFFF", "#F4F0EA", "#CFC7BB"]} />
          <Ball id={id + "skin"} c={["#FFE6D6", SK, "#DB9878"]} />
          <Ball id={id + "hair"} c={["#FFFFFF", "#D9D9E0", "#8F8F9E"]} />
          <radialGradient id={id + "cheek"}><stop offset="0%" stopColor="#FF7A8A" stopOpacity={0.7} /><stop offset="100%" stopColor="#FF7A8A" stopOpacity={0} /></radialGradient>
          <linearGradient id={id + "gold"} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FFF0A6" /><stop offset="100%" stopColor="#B07A1A" /></linearGradient>
          <linearGradient id={id + "wood"} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#C98A4E" /><stop offset="100%" stopColor="#7A4A22" /></linearGradient>
        </defs>
        <Shadow cx={250} cy={782} rx={170} />
        <path d="M100 770 C 92 560, 150 430, 250 422 C 350 430, 408 560, 400 770 Z" fill={`url(#${id}dress)`} />
        <path d="M100 770 Q 250 800 400 770 L 398 740 Q 250 768 102 740 Z" fill={`url(#${id}white)`} />
        <path d="M178 470 L 322 470 L 338 720 Q 250 746 162 720 Z" fill={`url(#${id}white)`} />
        <ellipse cx={250} cy={430} rx={90} ry={30} fill={`url(#${id}white)`} />
        {/* left arm */}
        <path d="M150 470 Q 110 560 160 600" stroke={`url(#${id}dress)`} strokeWidth={56} strokeLinecap="round" fill="none" />
        {/* head */}
        <g transform={`translate(0 ${-talk * 4}) rotate(${tilt + Math.sin(t * 1.1 + 2) * 1.2} 250 360)`}>
          {[[250, 180, 52], [170, 250, 58], [330, 250, 58], [200, 205, 60], [300, 205, 60], [160, 320, 40], [340, 320, 40]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={`url(#${id}hair)`} />)}
          <ellipse cx={250} cy={300} rx={100} ry={104} fill={`url(#${id}skin)`} />
          <path d="M155 262 Q 200 205 250 228 Q 300 205 345 262 Q 330 220 250 210 Q 170 220 155 262 Z" fill={`url(#${id}hair)`} />
          <ellipse cx={192} cy={330} rx={28} ry={18} fill={`url(#${id}cheek)`} /><ellipse cx={308} cy={330} rx={28} ry={18} fill={`url(#${id}cheek)`} />
          <Eye id={id + "e1"} x={214} y={292} rx={22} ry={26} iris={12} col="#3F6E9E" lx={lx} ly={ly} lid={Math.max(mood === "skeptic" ? 0.32 : 0, bl)} skin={SK} closed={mood === "happy" ? "happy" : null} />
          <Eye id={id + "e2"} x={286} y={292} rx={22} ry={26} iris={12} col="#3F6E9E" lx={lx} ly={ly} lid={Math.max(mood === "skeptic" ? 0.18 : 0, bl)} skin={SK} closed={mood === "happy" ? "happy" : null} />
          <circle cx={214} cy={294} r={33} fill="rgba(255,255,255,0.06)" stroke={`url(#${id}gold)`} strokeWidth={5} /><circle cx={286} cy={294} r={33} fill="rgba(255,255,255,0.06)" stroke={`url(#${id}gold)`} strokeWidth={5} />
          <path d="M240 290 Q 250 284 260 290" stroke={`url(#${id}gold)`} strokeWidth={4} fill="none" />
          <path d={`M188 ${252 + brL} Q 212 ${240 + brL} 236 ${250 + brL * 0.5}`} stroke="#A9A9B5" strokeWidth={8} strokeLinecap="round" fill="none" />
          <path d={`M264 ${250 + brR * 0.5} Q 288 ${240 + brR} 312 ${252 + brR}`} stroke="#A9A9B5" strokeWidth={8} strokeLinecap="round" fill="none" />
          <circle cx={250} cy={326} r={15} fill={`url(#${id}skin)`} stroke="rgba(150,80,60,0.25)" strokeWidth={2} />
          {mouthShape(250, 362, talk, 22, mood, id, "#9E1F2E")}
        </g>
        {/* right arm: clipboard or wave */}
        {wave > 0 ? (
          <g transform={`rotate(${-140 + Math.sin(t * 9) * 14 * wave}, 350, 480)`}>
            <path d="M350 480 L 350 600" stroke={`url(#${id}dress)`} strokeWidth={56} strokeLinecap="round" />
            {phone && <rect x={322} y={600} width={52} height={92} rx={12} fill="#1E2230" />}
            <circle cx={350} cy={620} r={30} fill={`url(#${id}skin)`} />
          </g>
        ) : <path d="M350 470 Q 392 560 340 600" stroke={`url(#${id}dress)`} strokeWidth={56} strokeLinecap="round" fill="none" />}
        {clipboard && wave === 0 && (
          <g transform="rotate(-6 250 600)">
            <rect x={168} y={520} width={164} height={200} rx={12} fill={`url(#${id}wood)`} />
            <rect x={182} y={540} width={136} height={168} rx={4} fill="#FFFDF6" />
            {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={194} y={562 + i * 26} width={i % 2 ? 80 : 108} height={8} rx={4} fill="#C9C1B2" />)}
            <rect x={222} y={510} width={56} height={26} rx={6} fill="#C8CDD6" />
          </g>
        )}
        <circle cx={168} cy={604} r={28} fill={`url(#${id}skin)`} />{wave === 0 && <circle cx={336} cy={604} r={28} fill={`url(#${id}skin)`} />}
      </svg>
    </div>
  );
};

// ======================= ELF =======================
export type ElfP = { t: number; x: number; y: number; s?: number; mood?: Mood; talk?: number; lx?: number; ly?: number; glasses?: boolean; seed?: number; id?: string; tilt?: number; arms?: number; hatCol?: string };
export const Elf: React.FC<ElfP> = ({ t, x, y, s = 1, mood = "neutral", talk = 0, lx = 0, ly = 0, glasses = false, seed = 0, id = "el", tilt = 0, arms = 0, hatCol = "#2FA35A" }) => {
  const SK = "#FAD2B4", bl = blinkAt(t, seed + 0.4), bob = Math.sin(t * 2.6 + seed) * 0.015;
  const singO = mood === "sing" ? 0.55 + 0.35 * Math.abs(Math.sin(t * 4 + seed)) : talk;
  return (
    <div style={{ position: "absolute", left: x - 180 * s, top: y - 590 * s, width: 360 * s, height: 600 * s, transformOrigin: "50% 98%", transform: `scaleY(${1 + bob})` }}>
      <svg viewBox="0 0 360 600" width={360 * s} height={600 * s} style={{ overflow: "visible" }}>
        <defs>
          <Ball id={id + "g"} c={["#7BE39A", "#2E9E55", "#14572C"]} />
          <Ball id={id + "hat"} c={[hatCol === "#2FA35A" ? "#7BE39A" : "#FF8A80", hatCol, "#14572C"]} />
          <Ball id={id + "skin"} c={["#FFE9DA", SK, "#DE9C7C"]} />
          <Ball id={id + "gold"} c={["#FFF5B8", "#F2C14E", "#A06A12"]} />
          <Ball id={id + "hair"} c={["#C98A55", "#8A4E25", "#4A2610"]} />
          <radialGradient id={id + "cheek"}><stop offset="0%" stopColor="#FF7A7A" stopOpacity={0.7} /><stop offset="100%" stopColor="#FF7A7A" stopOpacity={0} /></radialGradient>
        </defs>
        <Shadow cx={180} cy={584} rx={110} />
        {/* legs stripes + shoes */}
        {[140, 220].map((lx2, i) => <g key={i}><rect x={lx2 - 16} y={470} width={32} height={95} rx={14} fill="#fff" />{[0, 1, 2].map((k) => <rect key={k} x={lx2 - 16} y={480 + k * 28} width={32} height={13} fill="#E53935" />)}<path d={`M${lx2 - 30} 582 Q ${lx2 - 30} 556 ${lx2} 556 Q ${lx2 + (i ? 46 : -46)} 556 ${lx2 + (i ? 52 : -52)} 540 Q ${lx2 + (i ? 40 : -40)} 584 ${lx2 - 30 * (i ? -1 : 1)} 584 Z`} fill="#3B2A20" /></g>)}
        {/* body tunic */}
        <path d="M95 490 L 120 340 Q 180 320 240 340 L 265 490 L 240 470 L 215 492 L 190 470 L 165 492 L 140 470 L 115 492 Z" fill={`url(#${id}g)`} />
        <rect x={112} y={420} width={136} height={22} rx={6} fill="#2A1A12" /><rect x={166} y={416} width={30} height={30} rx={5} fill="none" stroke={`url(#${id}gold)`} strokeWidth={6} />
        <path d="M128 342 L 150 372 L 166 344 L 180 374 L 194 344 L 210 372 L 232 342 Z" fill="#E53935" />
        {/* arms */}
        <g transform={`rotate(${20 + arms}, 122, 360)`}><rect x={104} y={350} width={36} height={100} rx={18} fill={`url(#${id}g)`} /><circle cx={122} cy={458} r={20} fill={`url(#${id}skin)`} /></g>
        <g transform={`rotate(${-20 - arms}, 238, 360)`}><rect x={220} y={350} width={36} height={100} rx={18} fill={`url(#${id}g)`} /><circle cx={238} cy={458} r={20} fill={`url(#${id}skin)`} /></g>
        {/* head */}
        <g transform={`translate(0 ${-talk * 3}) rotate(${tilt + Math.sin(t * 1.7 + seed) * 2} 180 300)`}>
          <path d="M104 212 C 64 200, 30 172, 16 140 C 30 196, 58 252, 104 272 Z" fill={`url(#${id}skin)`} /><path d="M256 212 C 296 200, 330 172, 344 140 C 330 196, 302 252, 256 272 Z" fill={`url(#${id}skin)`} /><path d="M92 222 C 64 206, 44 186, 34 168 C 46 200, 66 232, 92 248 Z" fill="#E9A486" opacity={0.6} /><path d="M268 222 C 296 206, 316 186, 326 168 C 314 200, 294 232, 268 248 Z" fill="#E9A486" opacity={0.6} />
          <ellipse cx={180} cy={240} rx={92} ry={88} fill={`url(#${id}skin)`} />
          <path d="M100 200 Q 120 150 180 160 Q 250 150 262 205 Q 230 178 180 182 Q 130 180 100 200" fill={`url(#${id}hair)`} />
          <path d={`M88 196 Q 180 120 272 196 L 262 168 Q 240 60 ${150 + Math.sin(t * 2.4 + seed) * 10} 30 Q 120 120 98 168 Z`} fill={`url(#${id}hat)`} />
          <circle cx={150 + Math.sin(t * 2.4 + seed) * 10} cy={30} r={17} fill={`url(#${id}gold)`} />
          <rect x={84} y={180} width={192} height={28} rx={14} fill="#E53935" />
          {[[138, 272], [150, 282], [210, 282], [222, 272]].map(([fx, fy], i) => <circle key={i} cx={fx} cy={fy} r={3.5} fill="#C9744E" opacity={0.7} />)}
          <ellipse cx={130} cy={268} rx={22} ry={14} fill={`url(#${id}cheek)`} /><ellipse cx={230} cy={268} rx={22} ry={14} fill={`url(#${id}cheek)`} />
          <Eye id={id + "e1"} x={150} y={238} rx={22} ry={27} iris={13} col="#4B7A2A" lx={lx} ly={ly} lid={Math.max(mood === "deadpan" ? 0.42 : 0, bl)} skin={SK} closed={mood === "cry" ? "happy" : null} />
          <Eye id={id + "e2"} x={210} y={238} rx={22} ry={27} iris={13} col="#4B7A2A" lx={lx} ly={ly} lid={Math.max(mood === "deadpan" ? 0.42 : 0, bl)} skin={SK} closed={mood === "cry" ? "happy" : null} />
          {glasses && <g><rect x={122} y={216} width={56} height={44} rx={10} fill="rgba(255,255,255,0.08)" stroke="#2A1A12" strokeWidth={5} /><rect x={182} y={216} width={56} height={44} rx={10} fill="rgba(255,255,255,0.08)" stroke="#2A1A12" strokeWidth={5} /></g>}
          {mood === "cry" && [0, 1].map((i) => { const p = ((t * 1.6 + i * 0.5) % 1); return <g key={i}><path d={`M${i ? 214 : 146} ${258 + p * 70} q -8 14 0 20 q 8 -6 0 -20`} fill="#8FD0FF" opacity={1 - p} /><path d={`M${i ? 226 : 134} 250 q ${i ? 30 : -30} 10 ${i ? 46 : -46} 2`} stroke="#8FD0FF" strokeWidth={5} fill="none" opacity={0.7} /></g>; })}
          <ellipse cx={180} cy={268} rx={13} ry={10} fill="#F0A88A" />
          {mouthShape(180, 296, singO, 18, mood === "cry" ? "sing" : mood, id)}
        </g>
      </svg>
    </div>
  );
};

// ======================= PENGUIN =======================
export const Penguin: React.FC<{ t: number; x: number; y: number; s?: number; glow?: number; id?: string; look?: number; mash?: number }> = ({ t, x, y, s = 1, glow = 1, id = "pg", look = 1, mash = 1 }) => {
  const bl = blinkAt(t, 3.1), bob = Math.sin(t * 9) * 0.01 * mash;
  return (
    <div style={{ position: "absolute", left: x - 180 * s, top: y - 450 * s, width: 360 * s, height: 460 * s, transformOrigin: "50% 98%", transform: `scaleY(${1 + bob})` }}>
      <svg viewBox="0 0 360 460" width={360 * s} height={460 * s} style={{ overflow: "visible" }}>
        <defs>
          <Ball id={id + "b"} c={["#56627A", "#222A3A", "#0B0E15"]} />
          <Ball id={id + "w"} c={["#FFFFFF", "#EEF3F8", "#B9C6D6"]} />
          <Ball id={id + "o"} c={["#FFD27A", "#FF9F1C", "#C2610A"]} />
          <Ball id={id + "r"} c={["#FF6B5E", "#D9262B", "#8A0F18"]} />
          <Ball id={id + "pad"} c={["#6B7280", "#2D3340", "#111"]} />
        </defs>
        <Shadow cx={180} cy={444} rx={130} />
        <ellipse cx={135} cy={436} rx={42} ry={16} fill={`url(#${id}o)`} /><ellipse cx={225} cy={436} rx={42} ry={16} fill={`url(#${id}o)`} />
        <ellipse cx={180} cy={270} rx={132} ry={172} fill={`url(#${id}b)`} />
        <ellipse cx={180} cy={300} rx={94} ry={132} fill={`url(#${id}w)`} />
        <ellipse cx={162} cy={168} rx={30} ry={34} fill={`url(#${id}w)`} /><ellipse cx={222} cy={168} rx={30} ry={34} fill={`url(#${id}w)`} />
        <Eye id={id + "e1"} x={162} y={170} rx={22} ry={26} iris={11} col="#222" lx={look} ly={0.2} lid={Math.max(0.35, bl)} skin="#222A3A" />
        <Eye id={id + "e2"} x={222} y={170} rx={22} ry={26} iris={11} col="#222" lx={look} ly={0.2} lid={Math.max(0.35, bl)} skin="#222A3A" />
        <path d="M168 205 L 222 214 L 170 230 Z" fill={`url(#${id}o)`} />
        {/* hat */}
        <path d={`M100 120 Q 150 20 250 40 Q 300 60 ${305 + Math.sin(t * 3) * 4} 110 Q 280 80 260 110 Z`} fill={`url(#${id}r)`} />
        <circle cx={305 + Math.sin(t * 3) * 4} cy={114} r={18} fill={`url(#${id}w)`} />
        <ellipse cx={180} cy={118} rx={96} ry={24} fill={`url(#${id}w)`} />
        {/* flippers + controller */}
        <path d={`M60 260 Q 70 330 ${130} ${330 + Math.sin(t * 18) * 3 * mash}`} stroke={`url(#${id}b)`} strokeWidth={40} strokeLinecap="round" fill="none" />
        <path d={`M300 260 Q 290 330 ${230} ${330 + Math.cos(t * 16) * 3 * mash}`} stroke={`url(#${id}b)`} strokeWidth={40} strokeLinecap="round" fill="none" />
        <rect x={112} y={312} width={136} height={58} rx={28} fill={`url(#${id}pad)`} />
        <circle cx={145} cy={340} r={9} fill="#9BA3B4" /><circle cx={215} cy={334} r={7} fill="#5EC8FF" /><circle cx={230} cy={348} r={7} fill="#FF5A5A" />
        <ellipse cx={240} cy={230} rx={110} ry={150} fill="#5EC8FF" opacity={0.16 * glow * (0.8 + 0.2 * Math.sin(t * 13))} style={{ filter: "blur(18px)" }} />
      </svg>
    </div>
  );
};

// ======================= RUDOLPH =======================
export const Rudolph: React.FC<{ t: number; x: number; y: number; s?: number; stickers?: number[]; peel?: number; id?: string; nose?: number; look?: number; mood?: Mood }> = ({ t, x, y, s = 1, stickers = [], peel = 0, id = "ru", nose = 1, look = 0, mood = "neutral" }) => {
  const bl = blinkAt(t, 4.2);
  const ST: [number, number, number, string, string][] = [[118, 92, -14, "AD", "#FFD23F"], [362, 330, 12, "50% OFF", "#5EC8FF"], [250, 196, 4, "BUY ME", "#FF5A8A"], [205, 520, 10, "SALE!", "#7BE39A"], [138, 330, -10, "LIMITED", "#FFB347"], [250, 352, -4, "AD", "#FFD23F"]];
  return (
    <div style={{ position: "absolute", left: x - 250 * s, top: y - 610 * s, width: 500 * s, height: 620 * s }}>
      <svg viewBox="0 0 500 620" width={500 * s} height={620 * s} style={{ overflow: "visible" }}>
        <defs>
          <Ball id={id + "fur"} c={["#D7A070", "#9A6038", "#5A3018"]} />
          <Ball id={id + "muz"} c={["#FFF1DC", "#EBCB9F", "#B98E5E"]} />
          <Ball id={id + "nose"} c={["#FF9A8A", "#FF2A2A", "#9A0A0A"]} />
          <Ball id={id + "ant"} c={["#F2DDB8", "#C9A26E", "#7E5A30"]} />
          <radialGradient id={id + "glow"}><stop offset="0%" stopColor="#FF3B3B" stopOpacity={0.6} /><stop offset="100%" stopColor="#FF3B3B" stopOpacity={0} /></radialGradient>
        </defs>
        <ellipse cx={250} cy={600} rx={170} ry={90} fill={`url(#${id}fur)`} />
        <rect x={185} y={430} width={130} height={170} rx={60} fill={`url(#${id}fur)`} />
        {[-1, 1].map((d) => <g key={d}>
          <path d={`M${250 + d * 60} 205 C ${250 + d * 90} 120, ${250 + d * 150} 100, ${250 + d * 175} 30`} stroke={`url(#${id}ant)`} strokeWidth={22} strokeLinecap="round" fill="none" />
          <path d={`M${250 + d * 118} 120 C ${250 + d * 150} 110, ${250 + d * 195} 115, ${250 + d * 215} 85`} stroke={`url(#${id}ant)`} strokeWidth={18} strokeLinecap="round" fill="none" />
          <path d={`M${250 + d * 88} 160 C ${250 + d * 70} 120, ${250 + d * 70} 90, ${250 + d * 85} 55`} stroke={`url(#${id}ant)`} strokeWidth={16} strokeLinecap="round" fill="none" />
          <ellipse cx={250 + d * 128} cy={250} rx={52} ry={24} fill={`url(#${id}fur)`} transform={`rotate(${d * 28 + Math.sin(t * 2 + d) * 4} ${250 + d * 128} 250)`} />
        </g>)}
        <ellipse cx={250} cy={300} rx={118} ry={128} fill={`url(#${id}fur)`} />
        <ellipse cx={250} cy={388} rx={86} ry={66} fill={`url(#${id}muz)`} />
        <Eye id={id + "e1"} x={208} y={270} rx={26} ry={32} iris={15} col="#3A2210" lx={look} ly={0} lid={Math.max(mood === "deadpan" ? 0.4 : 0, bl)} skin="#9A6038" />
        <Eye id={id + "e2"} x={292} y={270} rx={26} ry={32} iris={15} col="#3A2210" lx={look} ly={0} lid={Math.max(mood === "deadpan" ? 0.4 : 0, bl)} skin="#9A6038" />
        <circle cx={250} cy={352} r={90 * nose} fill={`url(#${id}glow)`} />
        <circle cx={250} cy={352} r={34} fill={`url(#${id}nose)`} opacity={0.35 + 0.65 * nose} /><ellipse cx={240} cy={340} rx={10} ry={7} fill="#fff" opacity={0.7} />
        {mouthShape(250, 412, 0, 20, mood === "deadpan" ? "deadpan" : "neutral", id, "#4A2410")}
        {ST.map(([sx, sy, r, txt, col], i) => {
          const k = stickers[i] ?? 0; if (k <= 0) return null;
          const pl = i === 5 ? peel : 0;
          return <g key={i} transform={`translate(${sx} ${sy}) rotate(${r + pl * 40}) scale(${k})`} opacity={1 - Math.max(0, pl - 0.7) * 3.3}>
            <rect x={-62} y={-24} width={124} height={48} rx={10} fill={col} stroke="#fff" strokeWidth={5} transform={pl > 0 ? `skewX(${-pl * 20})` : undefined} />
            <text x={0} y={10} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={txt.length > 5 ? 22 : 28} fill="#1E1420">{txt}</text>
          </g>;
        })}
      </svg>
    </div>
  );
};

// ======================= BLIMP =======================
export const Blimp: React.FC<{ t: number; x: number; y: number; s?: number; deflate?: number; id?: string; rider?: React.ReactNode }> = ({ t, x, y, s = 1, deflate = 0, id = "bl", rider }) => {
  const wob = deflate * Math.sin(t * 14) * 0.05;
  return (
    <div style={{ position: "absolute", left: x - 340 * s, top: y - 200 * s, width: 680 * s, height: 400 * s, transform: `rotate(${Math.sin(t * 1.2) * 3 + deflate * 14}deg)` }}>
      <svg viewBox="0 0 680 400" width={680 * s} height={400 * s} style={{ overflow: "visible" }}>
        <defs>
          <Ball id={id + "b"} c={["#FFFFFF", "#C9CED8", "#6D7486"]} cy="25%" />
          <Ball id={id + "r"} c={["#FF6B5E", "#D9262B", "#8A0F18"]} />
        </defs>
        <g transform={`translate(330 160) scale(${1 - deflate * 0.35 + wob}, ${1 - deflate * 0.55 - wob})`}>
          <path d="M210 -20 L 300 -90 L 300 -10 Z M210 20 L 300 90 L 300 10 Z" fill={`url(#${id}r)`} />
          <ellipse cx={0} cy={0} rx={260} ry={110} fill={`url(#${id}b)`} />
          <path d="M-200 -70 Q 0 -40 200 -70 L 200 -50 Q 0 -20 -200 -50 Z" fill={`url(#${id}r)`} opacity={0.9} />
          <path d="M-210 55 Q 0 85 210 55 L 205 72 Q 0 102 -205 72 Z" fill={`url(#${id}r)`} opacity={0.9} />
          <text x={-10} y={22} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={60} fill="#C8202C">SANTA ♥ YOU</text>
          {deflate > 0.2 && [0, 1, 2].map((i) => <path key={i} d={`M${-150 + i * 120} ${-60 + i * 30} q 20 10 40 0`} stroke="#8A90A0" strokeWidth={4} fill="none" opacity={deflate} />)}
        </g>
        <path d="M290 260 L 300 300 M 370 260 L 360 300" stroke="#5A4A40" strokeWidth={4} />
        <rect x={270} y={290} width={120} height={50} rx={14} fill="#B0262E" />
        <rect x={286} y={298} width={30} height={22} rx={5} fill="#BFE6FF" /><rect x={344} y={298} width={30} height={22} rx={5} fill="#BFE6FF" />
        {rider}
      </svg>
    </div>
  );
};

// ======================= PROPS =======================
export const Gift: React.FC<{ x: number; y: number; w: number; h: number; c: string; r?: string; rot?: number; id: string }> = ({ x, y, w, h, c, r = "#FFD23F", rot = 0, id }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h, width: w, height: h + w * 0.25, transform: `rotate(${rot}deg)`, transformOrigin: "50% 100%" }}>
    <svg viewBox={`0 0 ${w} ${h + w * 0.25}`} width={w} height={h + w * 0.25} style={{ overflow: "visible" }}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ffffff" stopOpacity={0.35} /><stop offset="45%" stopColor="#ffffff" stopOpacity={0} /><stop offset="100%" stopColor="#000" stopOpacity={0.3} /></linearGradient></defs>
      <rect x={0} y={w * 0.25 + h * 0.18} width={w} height={h * 0.82} rx={w * 0.06} fill={c} />
      <rect x={-w * 0.04} y={w * 0.25} width={w * 1.08} height={h * 0.22} rx={w * 0.05} fill={c} />
      <rect x={0} y={w * 0.25} width={w} height={h} rx={w * 0.06} fill={`url(#${id})`} />
      <rect x={w * 0.42} y={w * 0.25} width={w * 0.16} height={h} fill={r} />
      <ellipse cx={w * 0.36} cy={w * 0.2} rx={w * 0.16} ry={w * 0.1} fill="none" stroke={r} strokeWidth={w * 0.07} transform={`rotate(-20 ${w * 0.36} ${w * 0.2})`} />
      <ellipse cx={w * 0.64} cy={w * 0.2} rx={w * 0.16} ry={w * 0.1} fill="none" stroke={r} strokeWidth={w * 0.07} transform={`rotate(20 ${w * 0.64} ${w * 0.2})`} />
    </svg>
  </div>
);
