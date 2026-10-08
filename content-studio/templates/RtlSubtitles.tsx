// Generic RTL (Arabic / Hebrew / Urdu) subtitle line over a voice in another language.
// units: [firstWordIdx, lastWordIdx, line] against the VO word timings W ([start, end, word][]).
// *accent groups* render in a serif with a gold gradient. Rules: keep the Arabic conjunction "و" attached to its word
// (write "*ومساعد*", never "و*مساعد*"); punctuation tokens are glued to the previous word; words reveal right-to-left
// across the spoken sentence.
import { Easing, interpolate, spring } from "remotion";
import React from "react";

const FPS = 30;
const ci = (t: number, a: number, b: number, c: number, d: number) => interpolate(t, [a, b], [c, d], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
const sp = (t: number, s: number) => (t < s ? 0 : spring({ frame: (t - s) * FPS, fps: FPS, config: { damping: 12, mass: 0.55 } }));

export const RtlSubtitles: React.FC<{ t: number; W: [number, number, string][]; units: [number, number, string][]; font: string; accentFont: string; latinFont: string; color?: string; gold?: [string, string, string]; size?: number; top?: number }> = ({ t, W, units, font, accentFont, latinFont, color = "#fff", gold = ["#F7E2A0", "#E9C46A", "#B8862B"], size = 56, top = 60 }) => {
  const ws = (i: number) => W[i][0];
  const idx = units.reduce((acc, [a], i) => (t >= ws(a) - 0.1 ? i : acc), 0);
  const [a, b, line] = units[idx];
  const nextAt = units[idx + 1] ? ws(units[idx + 1][0]) - 0.1 : 1e9;
  const fade = 1 - ci(t, Math.min(W[b][1] + 0.6, nextAt - 0.12), Math.min(W[b][1] + 0.85, nextAt), 0, 1);
  const toks: { w: string; acc: boolean }[] = [];
  line.split(/(\*[^*]+\*)/).filter(Boolean).forEach((part) => {
    const acc = part.startsWith("*");
    part.replace(/\*/g, "").split(" ").filter(Boolean).forEach((w) => { if (!/[\p{L}\p{N}]/u.test(w) && toks.length) toks[toks.length - 1].w += w; else toks.push({ w, acc }); });
  });
  const s0 = ws(a) - 0.08, span = Math.max(0.3, (W[b][1] - ws(a)) * 0.8);
  return (
    <div style={{ position: "absolute", left: 140, right: 140, top, height: size * 3, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: fade }}>
      <div dir="rtl" style={{ fontFamily: font, fontWeight: 800, fontSize: size, lineHeight: 1.35, color }}>
        {toks.map(({ w, acc }, i) => {
          const p = sp(t, s0 + (i / Math.max(1, toks.length)) * span);
          const latin = /[A-Za-z]/.test(w);
          return <span key={i} style={{ display: "inline-block", margin: "0 0.14em", opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 30}px)`, filter: p < 0.7 ? `blur(${(0.7 - p) * 12}px)` : undefined,
            fontFamily: acc ? (latin ? latinFont : accentFont) : undefined, fontWeight: acc ? 700 : undefined, fontSize: acc && !latin ? "1.12em" : undefined,
            background: acc ? `linear-gradient(180deg, ${gold[0]}, ${gold[1]} 55%, ${gold[2]})` : undefined, WebkitBackgroundClip: acc ? "text" : undefined, color: acc ? "transparent" : color }}>{w}</span>;
        })}
      </div>
    </div>
  );
};
