// Generic Apple-style device frames (space grey), drawn in CSS — no images needed.
// <MacBook sw={1200}>…</MacBook>  screen = sw × sw·10/16
// <IPhone k={1}>…</IPhone>        children laid out in a 390×844 logical screen, scaled by k
// <IPad k={1}>…</IPad>            children laid out in an 820×1180 logical screen, scaled by k
// <Crop src … />                  draw a rectangle of a big capture (e.g. a full-page website screenshot); use it to
//                                  re-flow a desktop capture into phone / tablet layouts when no real mobile capture exists.
// Animate with springs between [time, {x, y, scale, rotY}] states anchored to VO words (see production-lessons.md).
import { Img } from "remotion";
import React from "react";

export const Crop: React.FC<{ src: string; pageW: number; pageH: number; x: number; y: number; cw: number; ch: number; w: number; r?: number; style?: React.CSSProperties }> = ({ src, pageW, pageH, x, y, cw, ch, w, r = 0, style }) => {
  const k = w / cw;
  return <div style={{ width: w, height: ch * k, borderRadius: r, overflow: "hidden", position: "relative", flexShrink: 0, ...style }}>
    <Img src={src} style={{ position: "absolute", left: -x * k, top: -y * k, width: pageW * k, height: pageH * k, maxWidth: "none" }} />
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
