// Closing proof scene: the store we built, on a MacBook → iPhone → iPad, then all three line up under the logo.
// Timing comes from the VO words: show ("Yeh dekhiye"), best, fest, video, assist, cta ("Chaliye").
import { Easing, interpolate, spring } from "remotion";
import React from "react";
import { MacBook, IPhone, IPad, DesktopStore, MobileStore, TabletStore } from "./Devices";
import { AssistantWidget, ASSIST_TURN } from "./AssistantWidget";

const FPS = 30;
const IO = Easing.inOut(Easing.cubic);
const sp = (t: number, s: number, damping = 16, mass = 0.9) => (t < s ? 0 : spring({ frame: (t - s) * FPS, fps: FPS, config: { damping, mass } }));
const ci = (t: number, a: number, b: number, c: number, d: number, e = IO) => interpolate(t, [a, b], [c, d], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
type St = { x: number; y: number; s: number; r: number };
const lerpSt = (a: St, b: St, m: number): St => ({ x: a.x + (b.x - a.x) * m, y: a.y + (b.y - a.y) * m, s: a.s + (b.s - a.s) * m, r: a.r + (b.r - a.r) * m });
// walk a list of [start time, state] with springs between them
const track = (t: number, keys: [number, St][]): St => { let st = keys[0][1]; for (let i = 1; i < keys.length; i++) st = lerpSt(st, keys[i][1], sp(t, keys[i][0])); return st; };

const SW = 1200; // laptop screen width at scale 1
export const DeviceShowcase: React.FC<{ t: number; show: number; best: number; fest: number; video: number; assist: number; cta: number; light?: boolean }> = ({ t, show, best, fest, video, assist, cta }) => {
  if (t < show - 0.3) return null;
  // --- device placement (centre x/y in the 1920×1080 frame, scale, y-rotation) ---
  const lap = track(t, [[show - 0.2, { x: 960, y: 1500, s: 0.9, r: 0 }], [show - 0.2, { x: 960, y: 630, s: 0.92, r: 0 }], [video - 0.15, { x: 790, y: 600, s: 0.84, r: 6 }], [assist - 0.15, { x: 1010, y: 600, s: 0.78, r: 0 }], [cta - 0.1, { x: 960, y: 760, s: 0.58, r: 0 }]]);
  const ph = track(t, [[video - 0.15, { x: 2300, y: 640, s: 0.72, r: -10 }], [video - 0.15, { x: 1500, y: 620, s: 0.72, r: -6 }], [assist - 0.15, { x: 1560, y: 640, s: 0.62, r: -4 }], [cta - 0.1, { x: 1395, y: 815, s: 0.46, r: 0 }]]);
  const tb = track(t, [[assist - 0.15, { x: -500, y: 640, s: 0.6, r: 10 }], [assist - 0.15, { x: 470, y: 630, s: 0.6, r: 6 }], [cta - 0.1, { x: 540, y: 795, s: 0.38, r: 0 }]]);
  // --- what each screen shows ---
  const dScroll = t < cta ? ci(t, best - 0.5, best + 0.1, 0, 1770) + ci(t, fest - 0.5, fest + 0.1, 0, 947) : ci(t, cta, cta + 0.9, 2717, 0);
  const hl = (a: number) => ci(t, a, a + 0.3, 0, 1) * (1 - ci(t, a + 1.5, a + 1.9, 0, 1));
  const mScroll = t < cta ? ci(t, video - 0.1, video + 0.9, 0, 1850) : ci(t, cta, cta + 0.9, 1850, 0);
  const lapW = 1392;
  const show3 = (st: St, w: number, h: number, node: React.ReactNode, z: number) => (
    <div style={{ position: "absolute", left: st.x - w / 2, top: st.y - h / 2, width: w, height: h, transform: `perspective(2400px) rotateY(${st.r}deg) scale(${st.s})`, transformOrigin: "50% 50%", zIndex: z }}>{node}</div>
  );
  return (
    <>
      {show3(lap, lapW, 854, <MacBook sw={SW}><DesktopStore sw={SW} scroll={dScroll} hl={[{ x: 840, y: 1920, w: 882, h: 855, o: hl(best) }, { x: 220, y: 2958, w: 1470, h: 658, o: hl(fest) }]} /></MacBook>, 1)}
      {t > video - 0.3 && show3(ph, 412, 866, <IPhone k={1}><MobileStore scroll={mScroll} hlVideo={hl(video + 0.6)} /></IPhone>, 3)}
      {t > assist - 0.3 && show3(tb, 864, 1224, <IPad k={1}><TabletStore>
        <div style={{ position: "absolute", right: 22, bottom: 24, transform: `scale(${1.05 * sp(t, assist + 0.05, 14, 0.7)})`, transformOrigin: "100% 100%" }}>
          <AssistantWidget t={t} at={assist + 0.25} turn={ASSIST_TURN} theme="light" title="Store Assistant" height={600} greeting="Namaste! Main is store ki assistant hoon. Kya dhoondh rahe hain?" />
        </div>
      </TabletStore></IPad>, 2)}
    </>
  );
};
