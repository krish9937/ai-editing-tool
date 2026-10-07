// Apple-style device frames (space grey) drawn in CSS + the JewelleryOS-built store laid out for each screen.
// All store pixels come from the client's full-page capture (public/jos/site/store_full.png, 1910×9441):
// laptop = the real desktop page; phone / tablet = real crops of that page re-flowed into mobile / tablet layouts.
import { Img } from "remotion";
import React from "react";
import { S } from "./SiteCards";

export const PAGE_W = 1910, PAGE_H = 9441;
const STORE = S("store_full.png");

// a rectangle of the capture, drawn at `w` px wide
export const Crop: React.FC<{ x: number; y: number; cw: number; ch: number; w: number; r?: number; style?: React.CSSProperties }> = ({ x, y, cw, ch, w, r = 0, style }) => {
  const k = w / cw;
  return <div style={{ width: w, height: ch * k, borderRadius: r, overflow: "hidden", position: "relative", flexShrink: 0, ...style }}>
    <Img src={STORE} style={{ position: "absolute", left: -x * k, top: -y * k, width: PAGE_W * k, height: PAGE_H * k, maxWidth: "none" }} />
  </div>;
};

// ---- frames -----------------------------------------------------------------------------------------------
const SG = "#2B2C30", SG2 = "#3A3B40";
export const MacBook: React.FC<{ sw: number; children: React.ReactNode }> = ({ sw, children }) => {
  const sh = sw * 10 / 16, bz = sw * 0.018, top = sw * 0.024;
  const fw = sw + bz * 2, fh = sh + bz + top;
  return <div style={{ position: "relative", width: fw * 1.12, height: fh + sw * 0.045 }}>
    {/* lid */}
    <div style={{ position: "absolute", left: fw * 0.06, top: 0, width: fw, height: fh, borderRadius: sw * 0.022, background: "#0B0B0D", boxShadow: `0 0 0 ${sw * 0.004}px ${SG2}, 0 ${sw * 0.04}px ${sw * 0.09}px -${sw * 0.03}px rgba(0,0,0,0.65)` }}>
      <div style={{ position: "absolute", left: "50%", top: top * 0.32, width: sw * 0.006, height: sw * 0.006, borderRadius: "50%", background: "#1d2733", transform: "translateX(-50%)" }} />
      <div style={{ position: "absolute", left: bz, top, width: sw, height: sh, overflow: "hidden", borderRadius: sw * 0.004, background: "#fff" }}>{children}</div>
    </div>
    {/* base */}
    <div style={{ position: "absolute", left: 0, top: fh - sw * 0.002, width: fw * 1.12, height: sw * 0.026, borderRadius: `${sw * 0.004}px ${sw * 0.004}px ${sw * 0.03}px ${sw * 0.03}px`, background: `linear-gradient(180deg, #8E9097 0%, ${SG2} 35%, ${SG} 100%)`, boxShadow: `0 ${sw * 0.02}px ${sw * 0.04}px -${sw * 0.01}px rgba(0,0,0,0.6)` }}>
      <div style={{ position: "absolute", left: "50%", top: 0, width: sw * 0.16, height: sw * 0.009, transform: "translateX(-50%)", borderRadius: `0 0 ${sw * 0.01}px ${sw * 0.01}px`, background: "#1F2024" }} />
    </div>
  </div>;
};
export const IPhone: React.FC<{ k: number; children: React.ReactNode }> = ({ k, children }) => {
  const w = 390 * k, h = 844 * k, b = 11 * k;
  return <div style={{ position: "relative", width: w + b * 2, height: h + b * 2, borderRadius: 62 * k, background: "#0B0B0D", boxShadow: `0 0 0 ${3 * k}px ${SG2}, 0 0 0 ${4.5 * k}px #6E7077, 0 ${40 * k}px ${80 * k}px -${20 * k}px rgba(0,0,0,0.7)` }}>
    <div style={{ position: "absolute", left: b, top: b, width: w, height: h, borderRadius: 52 * k, overflow: "hidden", background: "#fff" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 390, height: 844, transform: `scale(${k})`, transformOrigin: "0 0" }}>{children}</div>
    </div>
    <div style={{ position: "absolute", left: "50%", top: b + 11 * k, width: 122 * k, height: 35 * k, borderRadius: 18 * k, background: "#000", transform: "translateX(-50%)" }} />
  </div>;
};
export const IPad: React.FC<{ k: number; children: React.ReactNode }> = ({ k, children }) => {
  const w = 820 * k, h = 1180 * k, b = 22 * k;
  return <div style={{ position: "relative", width: w + b * 2, height: h + b * 2, borderRadius: 46 * k, background: "#0B0B0D", boxShadow: `0 0 0 ${3 * k}px ${SG2}, 0 0 0 ${4.5 * k}px #6E7077, 0 ${40 * k}px ${90 * k}px -${20 * k}px rgba(0,0,0,0.7)` }}>
    <div style={{ position: "absolute", left: b, top: b, width: w, height: h, borderRadius: 26 * k, overflow: "hidden", background: "#fff" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 820, height: 1180, transform: `scale(${k})`, transformOrigin: "0 0" }}>{children}</div>
    </div>
    <div style={{ position: "absolute", left: "50%", top: b * 0.38, width: 7 * k, height: 7 * k, borderRadius: "50%", background: "#1d2733", transform: "translateX(-50%)" }} />
  </div>;
};

// ---- screens --------------------------------------------------------------------------------------------
const StatusBar: React.FC<{ w: number }> = ({ w }) => <div style={{ height: 50, width: w, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 30px 6px", boxSizing: "border-box", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 16, color: "#111" }}><span>9:41</span><span style={{ letterSpacing: 2 }}>▮▮▮ ◔ ▬</span></div>;
const Icon: React.FC<{ d: string }> = ({ d }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1E1C2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
const MobileHeader: React.FC<{ w: number }> = ({ w }) => <div style={{ width: w, background: "#fff" }}>
  <div style={{ height: 30, background: "#1E1A5C", color: "#fff", fontSize: 12, fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>Shop Gold and Lab Diamond Jewellery</div>
  <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
    <Icon d="M3 6h18M3 12h18M3 18h18" />
    <Crop x={96} y={40} cw={180} ch={40} w={150} />
    <div style={{ display: "flex", gap: 12 }}><Icon d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9z" /><Icon d="M6 7h12l-1 13H7L6 7zM9 7a3 3 0 0 1 6 0" /></div>
  </div>
  <div style={{ margin: "0 16px 10px", height: 40, borderRadius: 20, background: "#F4F4F8", display: "flex", alignItems: "center", gap: 8, padding: "0 14px", color: "#8A8A99", fontSize: 14, fontFamily: "Inter, sans-serif" }}><Icon d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.3-4.3" />Search for jewellery...</div>
</div>;

const CATS: [number, number][] = [[188, 1366], [446, 1366], [704, 1366], [962, 1366], [1220, 1366], [1480, 1366]];
const CARDS: [number, number][] = [[840, 1920], [1140, 1920], [1440, 1920], [840, 2360], [1140, 2360], [1440, 2360]];

/** phone layout, 390 px wide; returns its content and the y of named anchors */
export const MOBILE_Y = { cats: 470, best: 820, diwali: 1720, shop: 1990, video: 2380 };
export const MobileStore: React.FC<{ scroll: number; hlVideo?: number }> = ({ scroll, hlVideo = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 390, height: 844, overflow: "hidden", background: "#fff" }}>
    <div style={{ position: "absolute", left: 0, top: 50 - scroll, width: 390 }}>
      <MobileHeader w={390} />
      {/* hero: the model + "Love looks good on you" */}
      <div style={{ position: "relative", width: 390, height: 330, overflow: "hidden" }}>
        <Crop x={20} y={130} cw={900} ch={770} w={390} style={{ position: "absolute", left: 0, top: -4 }} />
        <Crop x={860} y={330} cw={990} ch={370} w={235} style={{ position: "absolute", right: 6, top: 18 }} />
      </div>
      <Crop x={760} y={1255} cw={400} ch={90} w={260} style={{ margin: "18px auto 6px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, padding: "0 12px" }}>{CATS.map(([x, y], i) => <Crop key={i} x={x} y={y} cw={242} ch={312} w={114} r={10} />)}</div>
      <Crop x={820} y={1810} cw={280} ch={90} w={200} style={{ margin: "22px auto 6px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, padding: "0 12px" }}>{CARDS.map(([x, y], i) => <Crop key={i} x={x} y={y} cw={284} ch={410} w={178} r={8} />)}</div>
      <Crop x={220} y={2958} cw={1470} ch={658} w={366} r={10} style={{ margin: "22px 12px 0" }} />
      <Crop x={640} y={7365} cw={640} ch={100} w={300} style={{ margin: "26px auto 8px" }} />
      <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 10 }}>
        <Crop x={834} y={7476} cw={888} ch={364} w={366} r={10} />
        <div style={{ display: "flex", gap: 10 }}><Crop x={834} y={7856} cw={436} ch={406} w={178} r={10} /><div style={{ position: "relative" }}><Crop x={1286} y={7856} cw={436} ch={406} w={178} r={10} /><div style={{ position: "absolute", inset: -3, borderRadius: 12, border: "3px solid #635BFF", opacity: hlVideo }} /></div></div>
      </div>
      <div style={{ height: 400 }} />
    </div>
    <StatusBar w={390} />
    {/* the store's launcher, fixed */}
    <div style={{ position: "absolute", right: 14, bottom: 26, width: 52, height: 52, borderRadius: 26, background: "#6E56CF", boxShadow: "0 6px 18px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M12 3C6.5 3 2 6.8 2 11.5c0 2.6 1.4 4.9 3.6 6.5-.1 1-.5 2.3-1.4 3.4 1.6-.1 3.2-.7 4.4-1.5 1 .3 2.2.5 3.4.5 5.5 0 10-3.8 10-8.9S17.5 3 12 3Z" /></svg></div>
  </div>
);

/** tablet layout, 820×1180 */
export const TabletStore: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 820, height: 1180, overflow: "hidden", background: "#fff" }}>
    <div style={{ position: "absolute", left: 0, top: 40, width: 820 }}>
      <Crop x={0} y={0} cw={1910} ch={130} w={820} />
      <Crop x={0} y={130} cw={1910} ch={770} w={820} />
      <Crop x={740} y={1255} cw={440} ch={90} w={300} style={{ margin: "26px auto 10px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "0 24px" }}>{CATS.map(([x, y], i) => <Crop key={i} x={x} y={y} cw={242} ch={312} w={248} r={12} />)}</div>
    </div>
    <div style={{ position: "absolute", left: 0, top: 0, width: 820, height: 40, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 15, color: "#111" }}><span>9:41</span><span>100% ▬</span></div>
    {children}
  </div>
);

/** desktop page inside the laptop, with a slim browser bar */
export const DesktopStore: React.FC<{ sw: number; scroll: number; hl?: { x: number; y: number; w: number; h: number; o: number }[] }> = ({ sw, scroll, hl = [] }) => {
  const k = sw / PAGE_W, bar = sw * 0.028;
  return <div style={{ position: "absolute", inset: 0, background: "#fff" }}>
    <div style={{ height: bar, background: "#EDEDF2", display: "flex", alignItems: "center", gap: bar * 0.3, padding: `0 ${bar * 0.5}px`, boxSizing: "border-box" }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{ width: bar * 0.3, height: bar * 0.3, borderRadius: "50%", background: c }} />)}
      <div style={{ marginLeft: bar * 0.5, flex: 0.6, height: bar * 0.62, borderRadius: bar * 0.31, background: "#fff", display: "flex", alignItems: "center", padding: `0 ${bar * 0.4}px`, fontFamily: "Inter, sans-serif", fontSize: bar * 0.38, color: "#555", whiteSpace: "nowrap" }}>🔒 Live jewellery store · built with JewelleryOS</div>
    </div>
    <div style={{ position: "absolute", left: 0, top: bar, right: 0, bottom: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: -scroll * k, width: sw, height: PAGE_H * k }}>
        <Img src={STORE} style={{ width: sw, height: PAGE_H * k }} />
        {hl.map((r, i) => <div key={i} style={{ position: "absolute", left: r.x * k, top: r.y * k, width: r.w * k, height: r.h * k, borderRadius: 14 * k * 2, border: `${Math.max(2, 6 * k)}px solid #635BFF`, opacity: r.o }} />)}
      </div>
    </div>
  </div>;
};
