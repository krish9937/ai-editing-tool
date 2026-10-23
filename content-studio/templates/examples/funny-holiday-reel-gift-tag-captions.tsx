// "Santa's Budget Went South" — 9:16 funny linkutm reel. Pixar-style toy cast (chars.tsx), full voice
// cast (narrator Lily, Santa Bill, Mrs. Claus Matilda, elf Jessica), gift-tag captions, every shot moving.
// The real linkutm logo is shown untouched on a white plate. linkutm claims: clicks per link + dynamic QR only.
import React from "react";
import { AbsoluteFill, Audio, Composition, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import QRCode from "qrcode";
import { loadFont as loadFredoka } from "@remotion/google-fonts/Fredoka";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { Santa, MrsClaus, Elf, Penguin, Rudolph, Blimp, Gift, Mood } from "./chars";
import { DUR, W, MOUTH, SPK } from "./data";

const { fontFamily: FRED } = loadFredoka("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });
const { fontFamily: INTER } = loadInter("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] });
const FPS = 30, WD = 1080, HT = 1920;
const RED = "#D9262B", INK = "#2A1810", GREEN = "#2E9E55", GOLD = "#F2C14E";
const EZ = Easing.bezier(0.22, 1, 0.36, 1);
const ci = (t: number, a: number, b: number, x = 0, y = 1, e = EZ) => interpolate(t, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const sp = (t: number, a: number, d = 12, s = 200) => (t < a ? 0 : spring({ frame: (t - a) * FPS, fps: FPS, config: { damping: d, stiffness: s } }));
const kfx = (t: number, k: [number, number][], e: (x: number) => number = Easing.inOut(Easing.cubic)) => { if (t <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (t <= k[i][0]) return k[i - 1][1] + (k[i][1] - k[i - 1][1]) * e((t - k[i - 1][0]) / (k[i][0] - k[i - 1][0])); return k[k.length - 1][1]; };
const rnd = (i: number) => { const v = Math.sin(i * 12.9898) * 43758.5453; return v - Math.floor(v); };
const T = (w: string, n = 0) => { let k = 0; for (const x of W) if (x[2].toLowerCase().replace(/[^a-z0-9]/g, "") === w.toLowerCase()) { if (k === n) return x[0]; k++; } return 0; };
const talkOf = (t: number, who: "s" | "m" | "e") => { const f = Math.round(t * FPS); return SPK[f] === who ? MOUTH[f] ?? 0 : 0; };
const shake = (t: number, a: number, d: number, amp: number) => (t > a && t < a + d ? amp * (1 - (t - a) / d) * Math.sin(t * 70) : 0);
const QRM = (() => { const q = QRCode.create("https://go.santa.co/flyer", { errorCorrectionLevel: "M" }); const n = q.modules.size; const m: boolean[][] = []; for (let y = 0; y < n; y++) { m.push([]); for (let x = 0; x < n; x++) m[y].push(!!q.modules.get(x, y)); } return m; })();
const QR: React.FC<{ size: number }> = ({ size }) => { const n = QRM.length, c = (size * 0.88) / n, o = size * 0.06; return <svg width={size} height={size}><rect width={size} height={size} rx={size * 0.05} fill="#fff" />{QRM.map((r, y) => r.map((on, x) => (on ? <rect key={x + "_" + y} x={o + x * c} y={o + y * c} width={c + 0.3} height={c + 0.3} fill={INK} /> : null)))}</svg>; };
const Logo: React.FC<{ w: number }> = ({ w }) => <div style={{ background: "#fff", borderRadius: 26, padding: "22px 34px", boxShadow: "0 18px 40px rgba(20,10,30,0.25)" }}><Img src={staticFile("lmv/logo.svg")} style={{ width: w, display: "block" }} /></div>;

// ---------- snow + worlds ----------
const Snow: React.FC<{ t: number; n?: number; speed?: number; wind?: number; size?: number; op?: number }> = ({ t, n = 60, speed = 90, wind = 20, size = 8, op = 0.85 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {Array.from({ length: n }).map((_, i) => { const y = ((rnd(i) * HT + t * speed * (0.6 + rnd(i + 3))) % (HT + 40)) - 20; const x = (rnd(i + 7) * WD + t * wind + Math.sin(t * 1.3 + i) * 24 + WD * 2) % WD; const r = size * (0.4 + rnd(i + 11)); return <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: r, background: "#fff", opacity: op * (0.5 + rnd(i + 5) * 0.5) }} />; })}
  </AbsoluteFill>
);
const MAPW = 640, MAPH = 400;
const CONT = ["M60 80 C 120 40 220 50 250 110 C 230 160 180 170 160 210 C 130 200 90 170 60 80 Z", "M190 222 C 230 220 250 262 232 320 C 216 360 200 370 195 340 C 185 290 172 250 190 222 Z", "M300 92 C 340 70 380 80 380 120 C 360 140 330 140 322 160 C 360 172 382 212 362 280 C 342 322 322 330 312 292 C 300 242 290 202 300 160 Z", "M384 80 C 452 50 560 70 590 122 C 570 172 520 170 482 190 C 452 172 422 152 392 140 Z", "M520 262 C 560 250 590 270 582 300 C 552 312 520 302 520 262 Z", "M40 368 C 200 352 440 352 600 368 L 600 396 L 40 396 Z"];
const PINS: [number, number][] = [[120, 100], [200, 130], [215, 280], [340, 110], [350, 230], [450, 110], [540, 140], [555, 280], [160, 170], [420, 160], [300, 200], [500, 100]];
const WorldMap: React.FC<{ t: number; burst: number; bag?: number }> = ({ t, burst, bag = -1 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: MAPW, height: MAPH, borderRadius: 18, background: "linear-gradient(160deg,#FBF1D9,#EBD6AA)", boxShadow: "0 24px 50px rgba(40,20,10,0.45), inset 0 0 40px rgba(150,100,40,0.35)", border: "10px solid #7A4A22" }}>
    <svg width={MAPW - 20} height={MAPH - 20} viewBox={`0 0 ${MAPW} ${MAPH}`}>
      {CONT.map((d, i) => <path key={i} d={d} fill={i === 5 ? "#E8F4FF" : "#9CC98A"} stroke={i === 5 ? "#A9C9E6" : "#6E9E5E"} strokeWidth={3} />)}
      <text x={320} y={388} textAnchor="middle" fontFamily={FRED} fontWeight={700} fontSize={18} fill="#5A86B0">SOUTH POLE</text>
      <path d="M600 30 L 600 70 M 590 42 L 600 30 L 610 42" stroke="#7A4A22" strokeWidth={4} fill="none" /><text x={600} y={88} textAnchor="middle" fontFamily={FRED} fontWeight={700} fontSize={16} fill="#7A4A22">N</text>
      {PINS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill={RED} stroke="#fff" strokeWidth={2} opacity={burst > 0 ? 1 - ci(burst, i * 0.04, i * 0.04 + 0.1) * 0.8 : 1} />)}
    </svg>
    {bag >= 0 && <div style={{ position: "absolute", left: 300 + Math.sin(bag * 9) * 14 * (1 - bag), top: interpolate(bag, [0, 1], [10, 310], { extrapolateRight: "clamp" }), transform: `rotate(${Math.sin(bag * 14) * 20}deg)` }}><MoneyBag s={0.32} /></div>}
  </div>
);
const MoneyBag: React.FC<{ s?: number; label?: boolean }> = ({ s = 1, label = true }) => (
  <svg width={260 * s} height={300 * s} viewBox="0 0 260 300" style={{ overflow: "visible" }}>
    <defs><radialGradient id="mb" cx="36%" cy="35%" r="75%"><stop offset="0%" stopColor="#F3DDA8" /><stop offset="55%" stopColor="#C9A060" /><stop offset="100%" stopColor="#7A5A2A" /></radialGradient></defs>
    <path d="M90 70 Q 60 20 100 18 L 160 18 Q 200 20 170 70 Z" fill="url(#mb)" />
    <path d="M90 70 C 10 120, 10 290, 130 290 C 250 290, 250 120, 170 70 Z" fill="url(#mb)" />
    <rect x={84} y={60} width={92} height={18} rx={9} fill="#8A2A1A" />
    <text x={130} y={210} textAnchor="middle" fontFamily={FRED} fontWeight={700} fontSize={110} fill="#5A3A12" opacity={0.85}>$</text>
    {label && <g transform="rotate(-8 130 120)"><rect x={60} y={98} width={140} height={40} rx={8} fill="#fff" stroke={RED} strokeWidth={4} /><text x={130} y={126} textAnchor="middle" fontFamily={FRED} fontWeight={700} fontSize={22} fill={RED}>BUDGET</text></g>}
  </svg>
);
const Workshop: React.FC<{ t: number; alarm?: number; cx?: number }> = ({ t, alarm = 0, cx = 0 }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg,#8E5B3A 0px,#8E5B3A 118px,#7C4D30 118px,#7C4D30 122px)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(255,210,140,0.45) 0%, rgba(60,25,10,0.55) 80%)" }} />
    {/* window with night snow */}
    <div style={{ position: "absolute", left: 760 - cx * 0.2, top: 120, width: 250, height: 320, borderRadius: "125px 125px 14px 14px", background: "linear-gradient(#1B2A55,#3A4F8A)", border: "16px solid #5A3520", overflow: "hidden", boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)" }}>
      {Array.from({ length: 22 }).map((_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 230, top: ((rnd(i + 4) * 320 + t * 40 * (0.6 + rnd(i))) % 330) - 10, width: 6, height: 6, borderRadius: 3, background: "#fff", opacity: 0.8 }} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 6, background: "#5A3520" }} /><div style={{ position: "absolute", top: 0, bottom: 0, left: 104, width: 6, background: "#5A3520" }} />
    </div>
    {/* shelf with toys */}
    <div style={{ position: "absolute", left: 40 - cx * 0.2, top: 420, width: 330, height: 22, background: "linear-gradient(#A8714A,#6E4426)", borderRadius: 6, boxShadow: "0 10px 16px rgba(0,0,0,0.3)" }} />
    <Gift x={100 - cx * 0.2} y={420} w={80} h={70} c={GREEN} id="sh1" /><Gift x={190 - cx * 0.2} y={420} w={70} h={95} c="#3E6FD8" r="#fff" id="sh2" /><Gift x={290 - cx * 0.2} y={420} w={90} h={60} c="#E8A33C" r={RED} id="sh3" />
    {/* floor */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1300, bottom: 0, background: "linear-gradient(#6A3E24,#4A2814)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1296, height: 10, background: "#3A1E0E" }} />
    {/* alarm */}
    {alarm > 0 && <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${50 + Math.sin(t * 9) * 45}% 10%, rgba(255,30,30,${0.42 * alarm}) 0%, transparent 55%)`, mixBlendMode: "screen" }} />}
    {alarm > 0 && <div style={{ position: "absolute", left: 470, top: 40, width: 140, height: 80, borderRadius: "70px 70px 10px 10px", background: `radial-gradient(circle at 50% 40%, #FFD0D0 0%, ${Math.sin(t * 18) > 0 ? "#FF2A2A" : "#A01010"} 60%)`, boxShadow: Math.sin(t * 18) > 0 ? "0 0 90px 40px rgba(255,40,40,0.55)" : "none" }} />}
  </AbsoluteFill>
);
const Desk: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 760 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: 260 }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 46, borderRadius: 14, background: "linear-gradient(#C98A55,#8A5530)", boxShadow: "0 16px 30px rgba(0,0,0,0.35)" }} />
    <div style={{ position: "absolute", left: 30, right: 30, top: 46, height: 214, background: "linear-gradient(#8A5530,#5E3518)", borderRadius: "0 0 14px 14px" }} />
  </div>
);
const SouthPole: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const land = sp(t, a + 0.15, 9, 220);
  const look = t > T("literally") - 0.1 && t < T("literally") + 0.55 ? -1 : 1;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#9FD4FF 0%, #DDF0FF 55%, #F6FBFF 100%)" }} />
      <svg width={WD} height={HT} style={{ position: "absolute", transform: `translateX(${-(t - a) * 8}px)` }}>
        <path d="M-50 1000 L 160 640 L 300 820 L 470 560 L 660 860 L 820 620 L 1130 1000 Z" fill="#BFDDF6" />
        <path d="M160 640 L 205 715 L 130 700 Z M470 560 L 520 640 L 430 635 Z M820 620 L 870 700 L 780 690 Z" fill="#fff" />
      </svg>
      <svg width={WD} height={HT} style={{ position: "absolute" }}>
        <path d="M0 980 C 260 930 520 1000 1080 940 L 1080 1920 L 0 1920 Z" fill="#FFFFFF" />
        <path d="M0 1080 C 300 1040 640 1110 1080 1060" stroke="#D6E9F8" strokeWidth={30} fill="none" opacity={0.7} />
      </svg>
      {/* sign post */}
      <div style={{ position: "absolute", left: 120, top: 610, width: 26, height: 520, background: "repeating-linear-gradient(180deg,#D9262B 0 40px,#fff 40px 80px)", borderRadius: 13, boxShadow: "6px 0 10px rgba(0,0,0,0.15)" }} />
      <div style={{ position: "absolute", left: 60, top: 640, padding: "12px 26px", background: "linear-gradient(#FFF,#E6EEF6)", borderRadius: 12, fontFamily: FRED, fontWeight: 700, fontSize: 40, color: "#2A4A78", transform: "rotate(-5deg)", boxShadow: "0 8px 18px rgba(0,0,0,0.18)" }}>SOUTH POLE</div>
      {/* gift mountain */}
      {[[700, 1180, 180, 150, RED], [860, 1170, 150, 190, GREEN], [790, 1030, 140, 120, "#3E6FD8"], [960, 1050, 120, 110, "#E8A33C"], [620, 1040, 110, 120, "#8E44AD"], [880, 900, 110, 100, RED], [740, 900, 100, 90, GREEN]].map(([x, y, w, h, c], i) => <Gift key={i} x={x as number} y={(y as number) - (1 - sp(t, a + 0.05 + i * 0.04, 10, 260)) * 600} w={w as number} h={h as number} c={c as string} id={"sp" + i} rot={(rnd(i) - 0.5) * 10} />)}
      {/* TV */}
      <div style={{ position: "absolute", left: 300, top: 980, width: 220, height: 180, borderRadius: 26, background: "linear-gradient(#5A5E6A,#2A2D36)", boxShadow: "0 14px 24px rgba(0,0,0,0.3)" }}>
        <div style={{ position: "absolute", left: 18, top: 18, width: 150, height: 120, borderRadius: 18, background: "#0E1A30", overflow: "hidden", boxShadow: "0 0 40px rgba(94,200,255,0.7)" }}>
          <div style={{ position: "absolute", left: 20 + ((t * 120) % 110), top: 70, width: 18, height: 18, background: "#7BE39A" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 88, height: 6, background: "#5EC8FF" }} />
          {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: ((i * 60 - t * 90) % 170 + 170) % 170 - 10, top: 30 + i * 12, width: 12, height: 12, background: "#FFD23F", borderRadius: 6 }} />)}
        </div>
        <div style={{ position: "absolute", right: 16, top: 30, width: 26, height: 26, borderRadius: 13, background: "#9BA3B4" }} />
      </div>
      <div style={{ position: "absolute", left: 340 + 30, top: 1160, width: 60, height: 90, background: "#4A4E58" }} />
      {/* money bag landed + coins */}
      <div style={{ position: "absolute", left: 440, top: 1180 - (1 - land) * 900, transform: `scale(${1 + (1 - Math.min(1, land)) * 0.1}, ${Math.min(1.08, 0.75 + land * 0.3)})`, transformOrigin: "50% 100%" }}><MoneyBag s={0.55} /></div>
      {land > 0.5 && Array.from({ length: 9 }).map((_, i) => { const p = ci(t, a + 0.35, a + 1.0); return <div key={i} style={{ position: "absolute", left: 500 + (rnd(i) - 0.5) * 300 * p, top: 1320 - Math.sin(p * Math.PI) * 120 * rnd(i + 2), width: 34, height: 34, borderRadius: 17, background: "radial-gradient(circle at 35% 35%,#FFF3A6,#F2C14E 60%,#A06A12)", border: "3px solid #B88A20" }} />; })}
      <Penguin t={t} x={720} y={1330} s={0.9} look={look} mash={look > 0 ? 1 : 0} />
      <Snow t={t} n={50} speed={70} wind={30} />
    </AbsoluteFill>
  );
};

// ---------- spending montage: one long snowy strip, camera trucks right ----------
const PriceTag: React.FC<{ t: number; a: number; x: number; y: number; text: string; rot?: number }> = ({ t, a, x, y, text, rot = -8 }) => {
  if (t < a) return null; const k = sp(t, a, 9, 320);
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${interpolate(k, [0, 1], [2.6, 1])})`, opacity: Math.min(1, k * 3), padding: "14px 30px 14px 54px", background: "linear-gradient(#FFFFFF,#F1ECE4)", clipPath: "polygon(36px 0,100% 0,100% 100%,36px 100%,0 50%)", fontFamily: FRED, fontWeight: 700, fontSize: 64, color: RED, filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.3))", whiteSpace: "nowrap" }}><span style={{ fontSize: 26, color: "#8A7E70", display: "block", marginBottom: -8 }}>SPENT</span>{text}</div>;
};
const Montage: React.FC<{ t: number }> = ({ t }) => {
  const st = [T("he"), T("billboards"), T("ads"), T("jingle") - 0.2, T("blimp") - 0.6];
  const camX = kfx(t, [[st[0] - 0.3, 0], [st[1] - 0.35, 0], [st[1], 1080], [st[2] - 0.3, 1080], [st[2] + 0.05, 2160], [st[3] - 0.3, 2160], [st[3] + 0.05, 3240], [st[4] - 0.35, 3240], [st[4] + 0.05, 4320]], Easing.inOut(Easing.cubic));
  const blz = ci(t, T("snow") + 0.45, T("snow") + 1.4);
  const def = ci(t, T("blimp") + 0.35, T("blimp") + 1.0);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "linear-gradient(#A9D8FF 0%, #E4F3FF 60%, #F7FBFF 100%)" }} />
      <div style={{ position: "absolute", left: -camX * 0.3, top: 0, width: 6000, height: HT }}>
        <svg width={6000} height={1100}><path d={"M0 1000 " + Array.from({ length: 30 }).map((_, i) => `L ${i * 200 + 100} ${700 + rnd(i) * 160} L ${i * 200 + 200} 1000`).join(" ") + " Z"} fill="#C9E3F7" /></svg>
      </div>
      <div style={{ position: "absolute", left: -camX, top: 0, width: 5400, height: HT }}>
        <div style={{ position: "absolute", left: 0, top: 1150, width: 5400, height: 800, background: "linear-gradient(#FFFFFF,#E8F2FB)", borderRadius: "40% 40% 0 0 / 60px 60px 0 0" }} />
        {/* 0: Santa throws money */}
        <Santa t={t} x={540} y={1300} s={0.95} mood="happy" talk={0} armL={150} armR={150} hat={0.4} id="m0" />
        {Array.from({ length: 16 }).map((_, i) => { const p = ((t - st[0]) * 0.9 + rnd(i)) % 1; return t > st[0] - 0.2 ? <div key={i} style={{ position: "absolute", left: 540 + (rnd(i + 1) - 0.5) * 900 * p, top: 500 - Math.sin(p * Math.PI) * 300 + p * 500, fontFamily: FRED, fontWeight: 700, fontSize: 56, color: "#2E9E55", transform: `rotate(${p * 400}deg)`, opacity: 1 - p }}>{i % 2 ? "$" : "💵"}</div> : null; })}
        {/* 1: billboard in a blizzard */}
        <div style={{ position: "absolute", left: 1080 + 150, top: 520, width: 780, height: 460, borderRadius: 18, background: "linear-gradient(#FFF,#F4EDE2)", border: "14px solid #7A4A22", boxShadow: "0 30px 50px rgba(0,0,0,0.25)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: FRED, fontWeight: 700, fontSize: 92, color: RED, lineHeight: 1.05 }}>VISIT SANTA!<br /><span style={{ fontSize: 62, color: GREEN }}>Best gifts in town</span></div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 460 * blz * 0.92, background: "linear-gradient(#FFFFFF,#EEF5FC)", borderRadius: "0 0 40px 60px" }} />
        </div>
        {[1300, 1860].map((x, i) => <div key={i} style={{ position: "absolute", left: x, top: 970, width: 40, height: 260, background: "linear-gradient(90deg,#8A5530,#5E3518)" }} />)}
        <div style={{ position: "absolute", left: 1080, top: 0, width: 1080, height: HT, overflow: "hidden" }}><Snow t={t * 3} n={140} speed={260} wind={-420} size={12} op={blz} /></div>
        <PriceTag t={t} a={T("snow") + 0.05} x={1080 + 540} y={1080} text="$2,000,000" />
        {/* 2: Rudolph covered in ads */}
        <Rudolph t={t} x={2160 + 540} y={1330} s={1.25} stickers={[0, 1, 2, 3, 4, 5].map((i) => sp(t, T("ads") + 0.05 + i * 0.14, 8, 380))} nose={0.25 + 0.2 * Math.abs(Math.sin(t * 7))} look={-0.3} mood="deadpan" id="rm" />
        <PriceTag t={t} a={T("reindeer") + 0.3} x={2160 + 540} y={520} text="$800,000" rot={6} />
        {/* 3: elf choir, one crying */}
        <div style={{ position: "absolute", left: 3240 + 120, top: 1190, width: 840, height: 70, borderRadius: 20, background: "linear-gradient(#C8202C,#8A0F18)", boxShadow: "0 16px 24px rgba(0,0,0,0.25)" }} />
        <Elf t={t} x={3240 + 270} y={1220} s={0.9} mood="sing" seed={1} id="c1" />
        <Elf t={t} x={3240 + 540} y={1220} s={0.95} mood={t > T("nobody") ? "cry" : "sing"} seed={2} id="c2" hatCol="#D9262B" />
        <Elf t={t} x={3240 + 810} y={1220} s={0.9} mood="sing" seed={3} id="c3" />
        {Array.from({ length: 6 }).map((_, i) => { const p = ((t * 0.7 + i / 6) % 1); return <div key={i} style={{ position: "absolute", left: 3240 + 200 + i * 130 + Math.sin(t * 3 + i) * 30, top: 700 - p * 300, fontSize: 60, opacity: Math.sin(p * Math.PI), color: i % 2 ? RED : GREEN }}>{i % 2 ? "♪" : "♫"}</div>; })}
        <PriceTag t={t} a={T("for") + 0.1} x={3240 + 540} y={500} text="$1,200,000" rot={-5} />
        {/* 4: the blimp */}
        <Blimp t={t} x={4320 + 540 + (t - st[4]) * 40} y={720 + def * 260 + Math.sin(t * 1.4) * 14} s={1.25} deflate={def} id="bm" />
        <PriceTag t={t} a={T("blimp") + 0.15} x={4320 + 540} y={1180} text="$3,000,000" rot={7} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- linkutm world: rooftops + chimneys, each link gets its own label ----------
const CH = [{ x: 220, name: "Instagram", link: "go.santa.co/insta", n: 1240, w: "instagram" }, { x: 540, name: "Email", link: "go.santa.co/mail", n: 320, w: "emails" }, { x: 860, name: "Flyer QR", link: "go.santa.co/flyer", n: 410, w: "qr" }];
const Rooftops: React.FC<{ t: number }> = ({ t }) => {
  const a = T("every", 1) || T("link");
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(#0F1B44 0%, #24356E 55%, #3B4E8C 100%)" }} />
      {Array.from({ length: 40 }).map((_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * WD, top: rnd(i + 9) * 800, width: 4, height: 4, borderRadius: 2, background: "#fff", opacity: 0.3 + 0.6 * Math.abs(Math.sin(t * 1.5 + i)) }} />)}
      <div style={{ position: "absolute", left: 760, top: 300, width: 170, height: 170, borderRadius: 85, background: "radial-gradient(circle at 40% 38%,#FFFBEA,#F3E7C9 60%,#D9C9A2)", boxShadow: "0 0 100px 30px rgba(243,231,201,0.25)" }} />
      <svg width={WD} height={HT} style={{ position: "absolute" }}>
        <path d="M-40 1180 L 380 930 L 760 1180 Z" fill="#7A2E2A" /><path d="M-40 1180 L 380 930 L 760 1180 L 720 1170 L 380 960 L 0 1185 Z" fill="#fff" opacity={0.9} />
        <path d="M420 1220 L 820 980 L 1160 1220 Z" fill="#5E2420" /><path d="M420 1220 L 820 980 L 1160 1220 L 1120 1212 L 820 1010 L 460 1226 Z" fill="#fff" opacity={0.9} />
        <rect x={-40} y={1180} width={1200} height={760} fill="#2A1E3A" />
        {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={60 + (i % 4) * 260} y={1290 + Math.floor(i / 4) * 170} width={110} height={90} rx={10} fill={rnd(i) > 0.4 ? "#FFD27A" : "#3A2E50"} opacity={0.9} />)}
      </svg>
      {CH.map((c, i) => {
        const top = 960 - (i === 1 ? -40 : 0), lab = sp(t, a + 0.35 + i * 0.25, 8, 200), hl = T(c.w) > 0 && t > T(c.w) - 0.1 ? 1 : 0;
        const cnt = Math.round(c.n * ci(t, T("so", 1) + 0.2 + i * 0.2, T(c.w) + 0.6, 0, 1, Easing.out(Easing.cubic)));
        return (
          <div key={i}>
            <div style={{ position: "absolute", left: c.x - 60, top, width: 120, height: 200, background: "repeating-linear-gradient(0deg,#A0442E 0 34px,#7A2E22 34px 38px)", borderRadius: 8, boxShadow: hl ? `0 0 60px 14px rgba(255,210,90,${0.5 * (0.7 + 0.3 * Math.sin(t * 8))})` : "0 10px 20px rgba(0,0,0,0.3)" }} />
            <div style={{ position: "absolute", left: c.x - 74, top: top - 26, width: 148, height: 40, background: "#fff", borderRadius: 20 }} />
            {/* click puffs */}
            {t > T("so", 1) && Array.from({ length: 5 }).map((_, k) => { const p = ((t - T("so", 1)) * (0.55 + i * 0.12) + k / 5) % 1; return <div key={k} style={{ position: "absolute", left: c.x - 40 + Math.sin(p * 6 + k) * 30, top: top - 60 - p * 330, padding: "6px 14px", borderRadius: 30, background: "rgba(255,255,255,0.92)", fontFamily: FRED, fontWeight: 700, fontSize: 28, color: GREEN, opacity: Math.sin(p * Math.PI), transform: `scale(${0.7 + p * 0.5})` }}>+1</div>; })}
            {/* counter */}
            {t > T("so", 1) && <div style={{ position: "absolute", left: c.x, top: top - 470, transform: `translate(-50%,0) scale(${1 + hl * 0.12 * Math.exp(-(t - T(c.w)) * 4)})`, padding: "12px 22px", background: "#fff", borderRadius: 22, boxShadow: "0 12px 26px rgba(0,0,0,0.35)", fontFamily: INTER, fontWeight: 800, fontSize: 44, color: INK, textAlign: "center", border: hl ? `5px solid ${GOLD}` : "5px solid transparent", whiteSpace: "nowrap" }}>{cnt.toLocaleString("en-US")}<div style={{ fontSize: 20, fontWeight: 600, color: "#7A6E64", marginTop: -2 }}>clicks</div></div>}
            {/* gift-tag label on a string */}
            {lab > 0.01 && <div style={{ position: "absolute", left: c.x - 4, top: top + 70, transformOrigin: "0 0", transform: `rotate(${(1 - lab) * -60 + Math.sin(t * 2 + i) * 4}deg)` }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 4, height: 70, background: "#E8D2A8" }} />
              <div style={{ position: "absolute", left: -88, top: 66, width: 180, padding: "16px 12px 14px", background: "linear-gradient(#F3DFB6,#DCC08A)", borderRadius: 14, textAlign: "center", boxShadow: "0 10px 18px rgba(0,0,0,0.35)" }}>
                <div style={{ fontFamily: FRED, fontWeight: 700, fontSize: 32, color: RED }}>{c.name}</div>
                <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 16, color: INK }}>{c.link}</div>
              </div>
            </div>}
          </div>
        );
      })}
      {/* flyer with QR, pinned on the third chimney */}
      {t > T("qr") - 0.3 && <div style={{ position: "absolute", left: 760, top: 1250, transform: `scale(${sp(t, T("qr") - 0.3, 9, 260)}) rotate(4deg)`, width: 220, padding: 14, background: "#FFF8EC", borderRadius: 10, boxShadow: "0 14px 24px rgba(0,0,0,0.4)", textAlign: "center" }}>
        <div style={{ fontFamily: FRED, fontWeight: 700, fontSize: 26, color: RED, lineHeight: 1 }}>WORKSHOP<br />SALE!</div><div style={{ margin: "8px auto 0", width: 130 }}><QR size={130} /></div>
      </div>}
      <Snow t={t} n={40} speed={60} wind={20} size={7} />
    </AbsoluteFill>
  );
};
// dynamic QR: same flyer, new destination, no reprint
const QrRepoint: React.FC<{ t: number }> = ({ t }) => {
  const a = T("change"), sw = ci(t, T("goes") - 0.05, T("goes") + 0.35), stamp = sp(t, T("without") + 0.1, 8, 320);
  const cur = { x: kfx(t, [[a - 0.2, 1000], [a + 0.6, 760], [T("goes") - 0.1, 760]]), y: kfx(t, [[a - 0.2, 1500], [a + 0.6, 1120], [T("goes") - 0.1, 1120]]) };
  const press = t > T("goes") - 0.15 && t < T("goes") + 0.05;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #2E4382 0%, #121B40 80%)" }}>
      <div style={{ position: "absolute", left: 80, top: 520, width: 400, padding: 24, background: "#FFF8EC", borderRadius: 16, boxShadow: "0 30px 50px rgba(0,0,0,0.45)", textAlign: "center", transform: `rotate(-4deg) scale(${1 + ci(t, a - 1, a + 3, 0, 0.04)})` }}>
        <div style={{ fontFamily: FRED, fontWeight: 700, fontSize: 52, color: RED, lineHeight: 1 }}>WORKSHOP<br />SALE!</div>
        <div style={{ margin: "18px auto 0", width: 260 }}><QR size={260} /></div>
        <div style={{ fontFamily: FRED, fontWeight: 600, fontSize: 26, color: INK, marginTop: 10 }}>Scan me!</div>
        {stamp > 0 && <div style={{ position: "absolute", left: 40, top: 230, padding: "10px 22px", border: `7px solid ${GREEN}`, borderRadius: 14, color: GREEN, fontFamily: FRED, fontWeight: 700, fontSize: 48, transform: `rotate(-14deg) scale(${interpolate(stamp, [0, 1], [2.4, 1])})`, opacity: Math.min(1, stamp * 3), background: "rgba(255,255,255,0.85)", whiteSpace: "nowrap" }}>NO REPRINT ✓</div>}
      </div>
      <svg width={WD} height={HT} style={{ position: "absolute" }}><path d="M470 760 C 560 700, 600 700, 640 740" stroke="#FFD27A" strokeWidth={8} strokeDasharray="18 14" strokeDashoffset={-t * 60} fill="none" /><path d="M630 720 L 650 745 L 622 752" stroke="#FFD27A" strokeWidth={8} fill="none" /></svg>
      {/* phone with destination */}
      <div style={{ position: "absolute", left: 640, top: 470, width: 340, height: 640, borderRadius: 52, background: "#1C1F2A", padding: 14, boxShadow: "0 30px 50px rgba(0,0,0,0.5)", transform: "rotate(3deg)" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 40, overflow: "hidden", position: "relative", background: "#fff" }}>
          {[0, 1].map((k) => <div key={k} style={{ position: "absolute", inset: 0, opacity: k ? sw : 1 - sw, background: k ? "linear-gradient(#D9262B,#8A0F18)" : "linear-gradient(#FFD27A,#FF9F1C)", transform: `translateY(${k ? (1 - sw) * 40 : -sw * 40}px)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: FRED, fontWeight: 700, textAlign: "center" }}>
            <div style={{ fontSize: 110 }}>{k ? "🎄" : "☀️"}</div><div style={{ fontSize: 50, lineHeight: 1.05 }}>{k ? "Christmas" : "Summer"}<br />Sale</div>
          </div>)}
        </div>
      </div>
      {/* linkutm edit popover */}
      <div style={{ position: "absolute", left: 300, top: 1150, width: 600, padding: "22px 26px", background: "#fff", borderRadius: 22, boxShadow: "0 24px 40px rgba(0,0,0,0.45)", fontFamily: INTER, opacity: ci(t, a - 0.3, a), transform: `translateY(${(1 - ci(t, a - 0.3, a)) * 40}px)` }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: "#7A6E64" }}>go.santa.co/flyer → destination</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
          <div style={{ flex: 1, padding: "12px 16px", border: "2px solid #E3DED6", borderRadius: 12, fontSize: 24, fontWeight: 600, color: INK }}>{sw > 0.5 ? "santa.shop/christmas-sale" : "santa.shop/summer-sale"}</div>
          <div style={{ padding: "12px 20px", borderRadius: 12, background: sw > 0.5 ? GREEN : "#F2541B", color: "#fff", fontSize: 22, fontWeight: 700, transform: `scale(${press ? 0.92 : 1})` }}>{sw > 0.5 ? "Saved ✓" : "Update"}</div>
        </div>
      </div>
      <svg width={60} height={70} viewBox="0 0 24 28" style={{ position: "absolute", left: cur.x, top: cur.y, opacity: ci(t, a - 0.2, a) * (1 - ci(t, T("without"), T("without") + 0.3)), filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))" }}><path d="M2 2 L 2 22 L 8 17 L 12 26 L 16 24 L 12 15 L 20 15 Z" fill="#fff" stroke="#111" strokeWidth={1.6} /></svg>
    </AbsoluteFill>
  );
};
const ROWSD: [string, string, number, string][] = [["Instagram", "go.santa.co/insta", 1240, GREEN], ["Flyer QR", "go.santa.co/flyer", 410, GREEN], ["Email", "go.santa.co/mail", 320, GREEN], ["Blimp", "go.santa.co/blimp", 3, RED]];
const Dashboard: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const k = sp(t, a, 11, 200), bh = ci(t, T("blimp", 1) - 0.1, T("blimp", 1) + 0.3);
  return (
    <div style={{ position: "absolute", left: 70, top: 250, width: 900, padding: "34px 36px", background: "#fff", borderRadius: 34, boxShadow: "0 40px 70px rgba(10,10,40,0.45)", transform: `translateY(${(1 - k) * 900}px) rotate(${(1 - k) * 8}deg)`, fontFamily: INTER }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><Img src={staticFile("lmv/logo.svg")} style={{ height: 46 }} /><div style={{ fontSize: 24, fontWeight: 600, color: "#7A6E64" }}>Clicks per link · December</div></div>
      <div style={{ height: 2, background: "#EEE8E0", margin: "24px 0 10px" }} />
      {ROWSD.map(([n, l, v, c], i) => {
        const g = ci(t, a + 0.3 + i * 0.12, a + 1.0 + i * 0.12, 0, 1, Easing.out(Easing.cubic)), hl = i === 3 ? bh : 0;
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 14px", borderRadius: 18, background: hl ? `rgba(217,38,43,${0.1 * hl})` : "transparent", border: hl ? `4px solid rgba(217,38,43,${hl})` : "4px solid transparent", transform: `scale(${1 + hl * 0.04})` }}>
          <div style={{ width: 230 }}><div style={{ fontSize: 34, fontWeight: 800, color: INK }}>{n}</div><div style={{ fontSize: 18, fontWeight: 500, color: "#8A7E70" }}>{l}</div></div>
          <div style={{ flex: 1, height: 26, background: "#F3EFE9", borderRadius: 13, overflow: "hidden" }}><div style={{ width: `${Math.max(1.2, (v / 1240) * 100) * g}%`, height: "100%", background: c, borderRadius: 13 }} /></div>
          <div style={{ width: 150, textAlign: "right", fontSize: 40, fontWeight: 800, color: i === 3 ? RED : INK }}>{Math.round(v * g).toLocaleString("en-US")}</div>
        </div>;
      })}
    </div>
  );
};

// ---------- gift-tag captions ----------
type Chunk = { a: number; b: number; who: string; words: [number, string][] };
const CHUNKS: Chunk[] = (() => { const out: Chunk[] = []; let cur: Chunk | null = null; W.forEach(([a, b, w, who], i) => { const prev = W[i - 1]; const brk = !cur || who !== cur.who || /[.?!]$/.test(prev[2]) && prev[2] !== "Mrs." || /,$/.test(prev[2]) && cur.words.length >= 4 || cur.words.length >= 7 && w !== "Claus." || a - prev[1] > 0.7; if (brk) { cur = { a, b, who, words: [] }; out.push(cur); } cur!.words.push([a, w]); cur!.b = b; }); return out; })();
const KEY = new Set(["millions", "playstation?!", "south.", "literally.", "everything.", "blimp.", "worked?", "yes.", "santa.", "linkutm,", "label,", "exactly", "anytime", "reprinting.", "three", "claus.", "spend.", "linkutm.", "know."]);
const NAME: Record<string, string> = { santa: "SANTA", mrs: "MRS. CLAUS", elf: "ELF" };
const Captions: React.FC<{ t: number }> = ({ t }) => {
  const i = CHUNKS.findIndex((c, k) => t >= c.a - 0.08 && t < (CHUNKS[k + 1]?.a ?? c.b + 1) - 0.08 && t < c.b + 0.9);
  if (i < 0) return null; const c = CHUNKS[i]; const d = t - (c.a - 0.08);
  const drop = sp(t, c.a - 0.08, 10, 260), swing = 9 * Math.exp(-d * 3.2) * Math.sin(d * 10) + Math.sin(t * 1.6) * 1.4;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1430, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ position: "relative", transformOrigin: "46px 50%", transform: `translateY(${(1 - drop) * -50}px) rotate(${swing}deg)`, opacity: Math.min(1, drop * 2.5) }}>
        <svg width={120} height={160} style={{ position: "absolute", left: -40, top: -120, overflow: "visible" }}><path d={`M86 118 C 70 60, 40 30, 20 -10`} stroke="#B8935A" strokeWidth={4} fill="none" /><path d="M20 -10 l -14 -10 m 14 10 l 4 -16" stroke={RED} strokeWidth={8} strokeLinecap="round" /></svg>
        <div style={{ maxWidth: 900, padding: "22px 40px 24px 92px", background: "linear-gradient(170deg,#F6E4BE 0%,#E3C690 100%)", clipPath: "polygon(52px 0,100% 0,100% 100%,52px 100%,0 50%)", filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.35))", fontFamily: FRED, fontWeight: 600, fontSize: 60, lineHeight: 1.12, color: INK, textAlign: "left" }}>
          {NAME[c.who] && <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 3, color: RED, marginBottom: 2 }}>{NAME[c.who]}</div>}
          {c.words.map(([a, w], k) => <span key={k} style={{ opacity: t >= a - 0.05 ? 1 : 0.35, color: KEY.has(w.toLowerCase()) ? RED : INK, fontWeight: KEY.has(w.toLowerCase()) ? 700 : 600 }}>{w}{k < c.words.length - 1 ? " " : ""}</span>)}
        </div>
        <div style={{ position: "absolute", left: 30, top: "50%", width: 30, height: 30, marginTop: -15, borderRadius: 15, background: "radial-gradient(circle,#5A3A1A 0 40%,#C9A26E 45%)", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)" }} />
      </div>
    </div>
  );
};

// ---------- film ----------
const Film: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const ts = talkOf(t, "s"), tm = talkOf(t, "m"), te = talkOf(t, "e");
  const B = T("where") - 0.05, C = T("and", 0) - 0.05, D = T("south") + 0.05, E = T("he") - 0.1, F = T("so", 0) - 0.15, G = T("yes") + 0.75, H = T("dont") - 0.12, I = T("with") - 0.1, J = T("and", 2) - 0.2, K = T("the", 3) - 0.25, L = T("two") - 0.1, M = T("know") - 0.15;
  const shk = shake(t, B, 0.6, 14) + shake(t, T("playstation"), 0.5, 10);
  let scene: React.ReactNode = null;
  if (t < D + 0.2) {
    // A/B/C: workshop, map, alarm; punch-in for the shout; "went south" = bag slides down the map, camera dives into Antarctica
    const burst = ci(t, T("millions"), T("millions") + 1.2), bag = ci(t, T("budget") + 0.1, T("south") + 0.05, 0, 1, Easing.in(Easing.quad));
    const z = kfx(t, [[0, 1.0], [B - 0.3, 1.08], [B, 1.55], [C - 0.2, 1.6], [C + 0.35, 1.0], [T("south") - 0.25, 1.15], [D + 0.2, 7]], Easing.inOut(Easing.cubic));
    const oy = kfx(t, [[0, 0], [B - 0.3, 0], [B, 260], [C - 0.2, 260], [C + 0.35, 0]]);
    const mood: Mood = t < T("millions") ? "neutral" : t < B ? "panic" : "panic";
    scene = (
      <AbsoluteFill style={{ transform: `translate(${shk}px, ${oy + shk * 0.5}px) scale(${z})`, transformOrigin: t > C + 0.35 ? "540px 528px" : "50% 30%" }}>
        <Workshop t={t} alarm={ci(t, T("millions") - 0.1, T("millions") + 0.3)} />
        <div style={{ position: "absolute", left: 220, top: 160 }}><WorldMap t={t} burst={burst} bag={t > T("budget") ? bag : -1} /></div>
        {/* gifts fly off the map */}
        {burst > 0 && burst < 1 && Array.from({ length: 22 }).map((_, i) => { const p = ci(t, T("millions") + i * 0.02, T("millions") + 1.1 + rnd(i) * 0.3), px = PINS[i % PINS.length]; const vx = (rnd(i) - 0.5) * 1400, vy = -400 - rnd(i + 2) * 500; return p > 0 && p < 1 ? <Gift key={i} x={220 + 10 + px[0] + vx * p} y={160 + px[1] + vy * p + 1500 * p * p} w={60 + rnd(i) * 40} h={50 + rnd(i + 1) * 40} c={[RED, GREEN, "#3E6FD8", "#E8A33C", "#8E44AD"][i % 5]} id={"fly" + i} rot={p * 500 * (rnd(i) - 0.5)} /> : null; })}
        {t < T("budget") - 0.1 && <Desk x={540} y={1110} />}
        <Santa t={t} x={540} y={1290 + ci(t, T("budget") - 0.1, T("budget") + 0.6, 0, 900, Easing.in(Easing.back(1.4)))} s={1.05} mood={mood} talk={ts} lx={t < T("millions") ? -0.2 : 0.3} ly={-0.4} armR={t > T("millions") + 0.4 ? -150 : 10} phone={t > T("millions") + 0.4} armL={t > B ? 120 + Math.sin(t * 14) * 12 : 10} hat={t > B && t < C ? 0.6 : 0} sq={t > B && t < B + 0.3 ? -0.04 : 0} sweat={t > T("millions") ? ci(t, T("millions"), C) : 0} />
        {t >= T("budget") - 0.1 && <Desk x={540} y={1110} />}
      </AbsoluteFill>
    );
    if (t > D - 0.1) scene = <>{scene}<AbsoluteFill style={{ background: "#F6FBFF", opacity: ci(t, D - 0.1, D + 0.2) }} /></>;
  }
  if (t >= D + 0.2 && t < E) scene = <AbsoluteFill style={{ transform: `scale(${kfx(t, [[D, 1.25], [D + 0.5, 1.0], [E, 1.06]])})` }}><SouthPole t={t} a={D} /><AbsoluteFill style={{ background: "#F6FBFF", opacity: 1 - ci(t, D + 0.2, D + 0.5) }} /></AbsoluteFill>;
  if (t >= E && t < F) scene = <><Montage t={t} />{t < E + 0.3 && <AbsoluteFill style={{ background: "#F6FBFF", opacity: 1 - ci(t, E, E + 0.3) }} />}</>;
  if (t >= F && t < G) {
    const z = kfx(t, [[F, 1.0], [T("worked") + 0.3, 1.1], [T("yes") - 0.2, 1.1], [T("yes"), 1.35]]);
    scene = (
      <AbsoluteFill style={{ transform: `translateX(${(1 - sp(t, F, 14, 160)) * 1080}px) scale(${z})`, transformOrigin: "62% 40%" }}>
        <Workshop t={t} />
        <MrsClaus t={t} x={300} y={1300} s={1.1} mood="skeptic" talk={tm} lx={0.7} />
        <Santa t={t} x={760} y={1300} s={0.95} mood={t > T("yes") - 0.4 ? "blank" : "guilty"} talk={ts} lx={t > T("yes") - 0.4 ? 0 : -0.6} ly={0.1} sweat={ci(t, T("worked") + 0.2, T("yes"))} armL={14} armR={14} />
      </AbsoluteFill>
    );
  }
  if (t >= G && t < H) {
    const u = ci(t, G + 0.1, H - 0.1, 0, 1, Easing.out(Easing.cubic));
    const lines = ["Billboards ........ $2,000,000", "Reindeer ads ........ $800,000", "Jingle ........ $1,200,000", "Blimp ........ $3,000,000", "SPENT: EVERYTHING", "WORKED: NO IDEA"];
    scene = (
      <AbsoluteFill style={{ transform: `translateY(${-u * 120}px)` }}>
        <Workshop t={t} />
        <Elf t={t} x={300} y={1000} s={1.15} mood="deadpan" glasses id="acc" arms={-40} />
        <div style={{ position: "absolute", left: 420, top: 560, width: 560, height: 120 + u * 1500, background: "linear-gradient(90deg,#F3E2BC,#FFF6DE 40%,#E8D3A6)", borderRadius: 8, boxShadow: "0 20px 30px rgba(0,0,0,0.35)", overflow: "hidden", transform: "rotate(-2deg)" }}>
          {lines.map((l, i) => <div key={i} style={{ position: "absolute", left: 30, right: 30, top: 50 + i * 100 + (i > 3 ? 20 : 0), fontFamily: FRED, fontWeight: i > 3 ? 700 : 600, fontSize: i > 3 ? 44 : 36, whiteSpace: "nowrap", color: i > 3 ? RED : INK, opacity: ci(t, G + 0.15 + i * 0.12, G + 0.3 + i * 0.12) }}>{l}</div>)}
        </div>
        <div style={{ position: "absolute", left: 400, top: 560 + 110 + u * 1500, width: 600, height: 90, borderRadius: 45, background: "linear-gradient(#FFF6DE,#C9A26E)", transform: `rotate(-2deg) rotateX(0)`, boxShadow: "0 10px 20px rgba(0,0,0,0.35)" }} />
      </AbsoluteFill>
    );
  }
  if (t >= H && t < I) {
    // freeze-frame on Santa's "...Yes." face, record scratch, DON'T stamp
    const fz = T("yes") + 0.3, st = sp(t, H + 0.35, 8, 320);
    scene = (
      <AbsoluteFill style={{ filter: `grayscale(${ci(t, H, H + 0.2, 0, 0.85)}) contrast(1.1)`, transform: `scale(${1.35 + ci(t, H, I, 0, 0.12)}) rotate(${ci(t, H, H + 0.25, 0, -3)}deg)`, transformOrigin: "62% 40%" }}>
        <Workshop t={fz} />
        <MrsClaus t={fz} x={300} y={1300} s={1.1} mood="skeptic" lx={0.7} />
        <Santa t={fz} x={760} y={1300} s={0.95} mood="blank" sweat={1} armL={14} armR={14} />
      </AbsoluteFill>
    );
    scene = <>{scene}{st > 0 && <div style={{ position: "absolute", left: 540, top: 560, transform: `translate(-50%,-50%) rotate(-12deg) scale(${interpolate(st, [0, 1], [3, 1])})`, opacity: Math.min(1, st * 3), padding: "18px 44px", border: `14px solid ${RED}`, borderRadius: 26, color: RED, fontFamily: FRED, fontWeight: 700, fontSize: 150, background: "rgba(255,255,255,0.75)", letterSpacing: 4 }}>DON'T</div>}<AbsoluteFill style={{ background: "#fff", opacity: 1 - ci(t, H, H + 0.12) }} /></>;
  }
  if (t >= I && t < J) scene = <AbsoluteFill style={{ transform: `translateY(${(1 - sp(t, I, 13, 140)) * -1920}px) scale(${kfx(t, [[I, 1.0], [J, 1.08]])})` }}><Rooftops t={t} /></AbsoluteFill>;
  if (t >= J && t < K) scene = <AbsoluteFill style={{ transform: `scale(${interpolate(sp(t, J, 14, 180), [0, 1], [2.4, 1])})`, transformOrigin: "75% 70%" }}><QrRepoint t={t} /></AbsoluteFill>;
  if (t >= K && t < M) {
    // dashboard; Santa pops in shocked; elf whispers; whip up to the blimp: Mrs. Claus waving
    const up = ci(t, T("mrs") - 0.1, T("mrs") + 0.35, 0, 1, Easing.inOut(Easing.cubic));
    scene = (
      <AbsoluteFill>
        <AbsoluteFill style={{ transform: `translateY(${up * 1920}px)` }}>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, #3B4E8C 0%, #121B40 85%)" }} />
          <Snow t={t} n={30} speed={50} />
          <AbsoluteFill style={{ transform: `scale(${kfx(t, [[K, 1], [T("blimp", 1), 1], [T("blimp", 1) + 0.5, 1.12]])})`, transformOrigin: "50% 70%" }}><Dashboard t={t} a={K} /></AbsoluteFill>
          <Santa t={t} x={890} y={1500 + (1 - sp(t, T("the", 3) - 0.1, 9, 260)) * 900} s={0.72} mood="shock" talk={ts} lx={-0.8} ly={-0.6} armL={70} armR={70} hat={0.6} id="ks" />
          <Elf t={t} x={230} y={1380 + (1 - sp(t, L - 0.15, 10, 240)) * 900} s={1.0} mood="deadpan" talk={te} lx={0.6} id="ke" tilt={-6} />
        </AbsoluteFill>
        <AbsoluteFill style={{ transform: `translateY(${(up - 1) * 1920}px)` }}>
          <AbsoluteFill style={{ background: "linear-gradient(#8FC9FF,#E4F3FF)" }} />
          <Snow t={t} n={30} speed={50} />
          <svg width={WD} height={HT} style={{ position: "absolute" }}><path d="M420 930 L 400 1150 M 660 930 L 680 1150" stroke="#5A4A40" strokeWidth={6} /></svg>
          <Blimp t={t} x={540} y={760} s={1.3} id="bk" />
          <MrsClaus t={t} x={540} y={1330} s={0.62} mood="sheepish" wave={1} phone clipboard={false} lx={0.5} id="bmc" />
          <div style={{ position: "absolute", left: 360, top: 1140, width: 360, height: 150, borderRadius: "16px 16px 60px 60px", background: "repeating-linear-gradient(90deg,#B07A40 0 26px,#8A5A2A 26px 30px)", boxShadow: "inset 0 10px 0 #6A4020, 0 20px 30px rgba(0,0,0,0.2)" }} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (t >= M) {
    const k = sp(t, M, 14, 160);
    const laugh = t > T("ho") - 0.05 && t < T("know") - 0.15, peel = ci(t, T("know", 1) + 0.25, T("know", 1) + 1.3);
    scene = (
      <AbsoluteFill style={{ transform: `scale(${kfx(t, [[M, 1.0], [DUR, 1.1]])})`, transformOrigin: "50% 55%", opacity: k }}>
        <Workshop t={t} />
        <Rudolph t={t} x={860} y={1180} s={0.75} stickers={[1, 1, 1, 1, 1, 1]} peel={peel} nose={t > T("know", 1) + 1.1 ? 1 : 0.2} look={-0.6} mood="deadpan" id="er" />
        {t > T("know", 1) + 1.1 && <div style={{ position: "absolute", left: 860 - 120, top: 1180 - 610 * 0.75 + 352 * 0.75 - 120, width: 240, height: 240, borderRadius: 120, background: "radial-gradient(circle, rgba(255,60,60,0.55), transparent 70%)", opacity: 1 - ci(t, T("know", 1) + 1.1, T("know", 1) + 1.8, 0, 0.5) }} />}
        <div style={{ position: "absolute", left: 540, top: 330, transform: `translate(-50%,-50%) scale(${interpolate(sp(t, T("linkutm", 1) - 0.25, 9, 260), [0, 1], [0.4, 1])})`, opacity: ci(t, T("linkutm", 1) - 0.25, T("linkutm", 1)) }}><Logo w={520} /></div>
        <Santa t={t} x={430} y={1310 + (laugh ? -Math.abs(Math.sin(t * 16)) * 26 : 0)} s={1.05} mood={laugh ? "laugh" : t > T("know", 1) - 0.1 ? "wink" : "happy"} talk={ts} lx={0.3} armL={t > T("know", 1) - 0.1 ? 120 : laugh ? 40 : 20} armR={20} sq={laugh ? Math.sin(t * 32) * 0.03 : 0} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#120B20" }}>
      {scene}
      <Captions t={t} />
      <Audio src={staticFile("santa/vo.wav")} />
    </AbsoluteFill>
  );
};
export const SantaReelComp: React.FC = () => <Composition id="SantaBudgetReel" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={WD} height={HT} />;
