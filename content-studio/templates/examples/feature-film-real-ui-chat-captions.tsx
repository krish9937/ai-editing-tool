// linkutm feature film — Team Workspaces (16:9, 30 fps, founder voice; face ONLY in the hook, then the real app UI).
// Real UI = the Links-tutorial kit (lmv/*, rebuilt 1:1 from the frontend). Captions = TEAM-CHAT bubbles (founder avatar).
// Facts from linkutm.com/features/teams: one workspace per client/team, shared templates + naming rules, switch instantly,
// email invites with Admin / Editor / Viewer roles, full audit log. Roles named as the founder says them (feature page wording).
import { AbsoluteFill, Audio, Composition, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";
import React from "react";
import { Check, ChevronDown, Eye, FileText, Link2, ListChecks, Mail, MousePointerClick, Pencil, Plus, ShieldCheck, Trash2, UserPlus, Users, X, History, Lock } from "lucide-react";
import { Avatar, Badge, Btn, Card, Field, I, Shell } from "../lmv/kit";
import { INTER, K, MONO, Cursor } from "../lmv/ui";
import { W } from "./words";

const FPS = 30, DUR = 69.8, WD = 1920, HT = 1080;
const EZ = Easing.bezier(0.22, 1, 0.36, 1);
const ci = (t: number, a: number, b: number, x = 0, y = 1, e = EZ) => interpolate(t, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const sp = (t: number, a: number, d = 16, s = 170) => (t < a ? 0 : spring({ frame: (t - a) * FPS, fps: FPS, config: { damping: d, stiffness: s } }));
const RED = "#E5383B", GREEN = "#16A34A";
const CLIENTS: [string, string][] = [["Bluepeak", "#3B82F6"], ["Northwind", "#22C55E"], ["Maple & Co", "#F97316"], ["Orbit Foods", "#A855F7"], ["Kite Labs", "#EC4899"], ["Harbor", "#0EA5E9"], ["Fable", "#EAB308"], ["Vela", "#14B8A6"], ["Copper", "#F43F5E"], ["Lumen", "#6366F1"], ["Atlas Gym", "#84CC16"], ["Juno", "#D946EF"]];
const TEAM: [string, string, string][] = [["SL", "Sam", "#EF4444"], ["PN", "Priya", "#EC4899"], ["AR", "Alex", "#F97316"], ["JD", "Jordan", "#3B82F6"]];

// ---------- app window (browser chrome + real app shell at 1920×1080, scaled) ----------
const AppWindow: React.FC<{ children: React.ReactNode; url?: string; style?: React.CSSProperties }> = ({ children, url = "app.linkutm.com", style }) => (
  <div style={{ position: "absolute", left: 160, top: 70, width: 1600, height: 940, borderRadius: 18, overflow: "hidden", background: "#fff", boxShadow: "0 40px 100px -30px rgba(40,30,20,0.45), 0 0 0 1px rgba(0,0,0,0.06)", ...style }}>
    <div style={{ height: 40, background: "#F3F2F0", borderBottom: "1px solid #E7E5E2", display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />)}
      <div style={{ marginLeft: 120, flex: 1, maxWidth: 760, height: 26, borderRadius: 7, background: "#fff", border: "1px solid #E5E5E5", display: "flex", alignItems: "center", gap: 8, padding: "0 12px", fontFamily: INTER, fontSize: 13, color: "#555" }}>{I(Lock, 12, "#888")}{url}</div>
    </div>
    <div style={{ position: "relative", width: 1280, height: 720, transform: "scale(1.25)", transformOrigin: "0 0" }}>{children}</div>
  </div>
);
// camera on the whole window: scale around a point (window px)
const Cam: React.FC<{ s: number; x: number; y: number; children: React.ReactNode }> = ({ s, x, y, children }) => <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${x}px ${y}px` }}>{children}</AbsoluteFill>;
const Pg: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ position: "absolute", inset: 0, padding: "34px 32px 0", overflow: "hidden", fontFamily: INTER, color: K.text }}>{children}</div>;
const Title: React.FC<{ t: string; s: string; right?: React.ReactNode }> = ({ t, s, right }) => <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 22 }}><div><div style={{ fontSize: 21, fontWeight: 600 }}>{t}</div><div style={{ fontSize: 14.5, color: K.muted, marginTop: 4 }}>{s}</div></div><div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>{right}</div></div>;
const ClientDot: React.FC<{ c: [string, string]; s?: number }> = ({ c, s = 30 }) => <Avatar txt={c[0][0]} c={c[1]} s={s} />;
const Row: React.FC<{ title: string; short: string; client?: [string, string]; by?: [string, string, string]; clicks?: string; hl?: string; style?: React.CSSProperties }> = ({ title, short, client, by, clicks = "—", hl, style }) => (
  <div style={{ height: 84, marginBottom: 10, borderRadius: 12, border: `1.5px solid ${hl ?? K.border}`, background: hl ? "#FFF8F4" : "#fff", display: "flex", alignItems: "center", padding: "0 20px", gap: 16, boxShadow: hl ? `0 0 0 4px ${hl}33` : undefined, ...style }}>
    {client ? <ClientDot c={client} s={36} /> : <div style={{ width: 36, height: 36, borderRadius: 18, background: "#EEF0F6" }} />}
    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 16.5, fontWeight: 500 }}>{title}</div><div style={{ fontFamily: MONO, fontSize: 14, color: K.orange, marginTop: 6 }}>{short}</div></div>
    {by && <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: K.muted }}><Avatar txt={by[0]} c={by[2]} s={26} />{by[1]}</div>}
    <div style={{ width: 90, textAlign: "right", color: K.orange, fontWeight: 700, fontSize: 20 }}>{clicks}</div>
  </div>
);

// ---------- S0 hook: founder face (0–6.75) ----------
const WRONG: [number, number, number, string, string][] = [[3.2, 300, 260, "go.linkutm.com/bluepeak-sale", "sent to Northwind"], [3.9, 1270, 330, "go.linkutm.com/kite-launch", "sent to Orbit Foods"], [4.6, 260, 700, "go.linkutm.com/maple-promo", "sent to Harbor"], [5.3, 1290, 760, "go.linkutm.com/atlas-trial", "sent to Fable"]];
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const out = ci(t, 6.45, 6.85, 0, 1, Easing.in(Easing.cubic));
  return (
    <AbsoluteFill>
      {WRONG.map(([a, x, y, l, to], i) => { const k = sp(t, a, 13, 220); return (
        <div key={i} style={{ position: "absolute", left: x - 60, top: y, width: 470, padding: "18px 22px", borderRadius: 16, background: "#fff", boxShadow: "0 18px 40px -14px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)", fontFamily: INTER, transform: `scale(${k}) rotate(${i % 2 ? 3 : -3}deg)`, opacity: Math.min(1, k * 2) * (1 - out) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: 19, color: K.orange }}>{I(Link2, 18, K.orange)}{l}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 21, fontWeight: 700, color: RED }}>{I(X, 20, RED)}{to}</div>
        </div>); })}
      <div style={{ position: "absolute", left: 960 - 270, top: 40, width: 540, height: 960, borderRadius: 28, overflow: "hidden", boxShadow: "0 40px 90px -30px rgba(40,30,20,0.5), 0 0 0 6px #fff", transform: `scale(${(1 - out * 0.4) * (0.96 + sp(t, 0, 18, 140) * 0.04)}) translateY(${out * 140}px)`, opacity: 1 - out }}>
        <OffthreadVideo src={staticFile("teamws/face.mp4")} muted style={{ width: 540, height: 960, objectFit: "cover" }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- S1 one shared account, a pile of links (6.75–12.9) ----------
const PILE = Array.from({ length: 40 }).map((_, i) => { const c = CLIENTS[(i * 5) % 12]; const camp = ["summer sale", "launch", "webinar", "promo", "newsletter", "black friday", "retargeting"][i % 7]; return { title: `${c[0].toLowerCase()} — ${camp}`, short: `go.linkutm.com/${c[0].toLowerCase().replace(/[^a-z]/g, "").slice(0, 6)}-${(i * 37) % 97}`, client: c, clicks: `${((i * 173) % 900) + 40}` }; });
const Pile: React.FC<{ t: number }> = ({ t }) => {
  const scroll = ci(t, 9.6, 12.9, 0, 1, (x) => x * x) * 2600;
  const n = Math.round(interpolate(ci(t, 10.3, 12.4), [0, 1], [212, 4812]));
  return (
    <Shell active="Links" crumbs={["Agency HQ", "Links"]}>
      <Pg>
        <Title t="Links" s="One shared account · every client" right={<><div style={{ display: "flex", alignItems: "center", gap: 8, height: 36, padding: "0 14px", borderRadius: 8, border: `1px solid ${K.border}`, fontSize: 14, fontWeight: 600 }}>{I(Link2, 15)}{n.toLocaleString("en-US")} links</div><Btn primary>{I(Plus, 15, "#fff")}Create Link</Btn></>} />
        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>{CLIENTS.map((c, i) => { const k = sp(t, 8.1 + i * 0.05, 14, 260); return <div key={c[0]} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px 4px 4px", borderRadius: 999, border: `1px solid ${K.border}`, fontSize: 13, transform: `scale(${k})`, opacity: k }}><ClientDot c={c} s={22} />{c[0]}</div>; })}</div>
        <div style={{ transform: `translateY(${-scroll}px)`, filter: `blur(${Math.min(4, ci(t, 10.2, 12.9) * 4)}px)` }}>{PILE.map((r, i) => <Row key={i} {...r} />)}</div>
      </Pg>
    </Shell>
  );
};

// ---------- S2 two spellings → two campaigns (12.9–20.1) ----------
const Names: React.FC<{ t: number }> = ({ t }) => {
  const chart = t > 17.0;
  return (
    <Shell active={chart ? "Analytics" : "Links"} crumbs={["Agency HQ", chart ? "Analytics" : "Links"]}>
      <Pg>
        {!chart && <>
          <Title t="Links" s="Bluepeak campaign links" />
          <div style={{ transform: `translateY(${(1 - sp(t, 13.0, 14, 200)) * 40}px)`, opacity: sp(t, 13.0, 14, 200) }}><Row title="bluepeak — summer sale (instagram)" short="?utm_campaign=summer-sale" client={CLIENTS[0]} by={TEAM[0]} clicks="1,240" hl={t > 15.6 ? RED : undefined} /></div>
          <div style={{ transform: `translateY(${(1 - sp(t, 14.7, 14, 200)) * 40}px)`, opacity: sp(t, 14.7, 14, 200) }}><Row title="bluepeak — summer sale (email)" short="?utm_campaign=Summer_Sale" client={CLIENTS[0]} by={TEAM[1]} clicks="980" hl={t > 15.6 ? RED : undefined} /></div>
          {t > 15.6 && <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 8, padding: "8px 14px", borderRadius: 10, background: "#FEE2E2", color: "#B91C1C", fontSize: 15, fontWeight: 600, transform: `scale(${sp(t, 15.6, 12, 260)})`, transformOrigin: "0 50%" }}>summer-sale ≠ Summer_Sale</div>}
        </>}
        {chart && <>
          <Title t="Analytics" s="Campaigns · last 30 days" />
          <Card style={{ padding: 26 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 18 }}>Clicks by campaign</div>
            {([["summer-sale", 1240, K.orange], ["Summer_Sale", 980, "#FB923C"], ["webinar", 610, "#CBD5E1"], ["black friday", 420, "#CBD5E1"]] as [string, number, string][]).map(([n, v, c], i) => { const g = ci(t, 17.2 + i * 0.12, 18.0 + i * 0.12); return (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}><div style={{ width: 160, fontFamily: MONO, fontSize: 15 }}>{n}</div><div style={{ width: 560 * (v / 1240) * g, height: 34, borderRadius: 8, background: c }} /><div style={{ fontSize: 15, fontWeight: 600 }}>{Math.round(v * g).toLocaleString("en-US")}</div></div>); })}
            <div style={{ position: "absolute", left: 850, top: 176, display: "flex", alignItems: "center", gap: 10, opacity: ci(t, 18.6, 18.9) }}>
              <div style={{ width: 22, height: 96, border: `3px solid ${RED}`, borderLeft: "none", borderRadius: "0 10px 10px 0" }} />
              <div style={{ fontSize: 22, fontWeight: 700, color: RED }}>same campaign,<br />split in two</div>
            </div>
          </Card>
        </>}
      </Pg>
    </Shell>
  );
};

// ---------- S3 a printed link gets deleted (20.1–26.0) ----------
const Deleted: React.FC<{ t: number }> = ({ t }) => {
  const dlg = t > 20.7 && t < 22.25, gone = ci(t, 22.25, 22.7);
  return (
    <AbsoluteFill>
      <AppWindow>
        <Shell active="Links" crumbs={["Agency HQ", "Links"]}>
          <Pg>
            <Title t="Links" s="Northwind" />
            <Row title="northwind — spring menu" short="go.linkutm.com/nw-menu" client={CLIENTS[1]} clicks="3,410" />
            <div style={{ height: 94 * (1 - gone), opacity: 1 - gone, overflow: "hidden" }}><Row title="northwind — flyer QR (printed)" short="go.linkutm.com/nw-flyer" client={CLIENTS[1]} clicks="5,120" hl={K.orange} /></div>
            <Row title="northwind — instagram bio" short="go.linkutm.com/nw-bio" client={CLIENTS[1]} clicks="760" />
          </Pg>
          {dlg && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 460, borderRadius: 12, background: "#fff", padding: 24, fontFamily: INTER, transform: `scale(${sp(t, 20.75, 16, 260)})` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, fontWeight: 600 }}>{I(Trash2, 18, RED)}Delete link?</div>
              <div style={{ fontSize: 14, color: K.muted, marginTop: 8 }}>go.linkutm.com/nw-flyer will stop working.</div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}><Btn>Cancel</Btn><Btn danger hl={ci(t, 21.7, 22.0)}>Delete</Btn></div>
            </div>
          </div>}
          {dlg && <Cursor x={interpolate(ci(t, 20.9, 21.7), [0, 1], [560, 820])} y={interpolate(ci(t, 20.9, 21.7), [0, 1], [600, 432])} click={ci(t, 21.85, 22.2)} />}
        </Shell>
      </AppWindow>
      {/* the printed flyer */}
      <div style={{ position: "absolute", left: 1380, top: 330, width: 360, padding: 24, borderRadius: 14, background: "#FFFDF8", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.35)", fontFamily: INTER, textAlign: "center", transform: `rotate(5deg) translateX(${(1 - sp(t, 20.2, 14, 160)) * 700}px)` }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#15803D" }}>NORTHWIND</div>
        <div style={{ fontSize: 15, color: K.muted }}>Spring menu · scan to order</div>
        <div style={{ position: "relative", width: 180, height: 180, margin: "16px auto", background: "repeating-conic-gradient(#222 0 25%, #fff 0 50%) 0 0/30px 30px", border: "8px solid #222", borderRadius: 6 }}>
          {gone > 0.5 && <div style={{ position: "absolute", inset: -20, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ padding: "6px 18px", border: `5px solid ${RED}`, borderRadius: 10, background: "#fff", color: RED, fontSize: 40, fontWeight: 800, transform: `rotate(-12deg) scale(${interpolate(sp(t, 22.6, 10, 300), [0, 1], [2, 1])})` }}>404</div></div>}
        </div>
        <div style={{ fontSize: 14, color: K.muted }}>printed · 5,000 copies</div>
      </div>
      {t > 24.6 && <div style={{ position: "absolute", left: 560, top: 470, display: "flex", alignItems: "center", gap: 14, padding: "16px 24px", borderRadius: 16, background: "#fff", boxShadow: "0 24px 60px -20px rgba(0,0,0,0.35)", fontFamily: INTER, fontSize: 24, fontWeight: 600, transform: `scale(${sp(t, 24.65, 13, 220)})` }}>Deleted by: {TEAM.map((m, i) => <span key={i} style={{ filter: "grayscale(1)", opacity: 0.55 }}><Avatar txt="?" c={m[2]} s={40} /></span>)}<span style={{ fontSize: 34 }}>🤷</span></div>}
    </AbsoluteFill>
  );
};

// ---------- S4 it falls apart (26.0–30.85) ----------
const Apart: React.FC<{ t: number }> = ({ t }) => {
  const f = (i: number) => ci(t, 28.4 + i * 0.12, 29.9 + i * 0.12, 0, 1, Easing.in(Easing.quad));
  const piece = (i: number, x: number, y: number, w: number, h: number, node: React.ReactNode) => { const k = f(i); return <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `translate(${(i % 2 ? 1 : -1) * k * 120}px, ${k * k * 1100}px) rotate(${(i % 2 ? 1 : -1) * k * 35}deg)` }}>{node}</div>; };
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 160, top: 70, width: 1600, height: 940 }}>
        {piece(0, 0, 0, 1600, 40, <div style={{ height: 40, background: "#F3F2F0", borderRadius: "18px 18px 0 0", boxShadow: "0 0 0 1px rgba(0,0,0,0.06)" }} />)}
        {piece(1, 0, 40, 233, 900, <div style={{ height: 900, background: "#F8F8F8", borderRight: `1px solid ${K.border}`, boxShadow: "0 0 0 1px rgba(0,0,0,0.06)" }} />)}
        {Array.from({ length: 7 }).map((_, i) => piece(i + 2, 260, 90 + i * 120, 1300, 100, <div style={{ transform: "scale(0.8333)", transformOrigin: "0 0", width: 1560, fontFamily: INTER }}><Row {...PILE[i + 3]} by={TEAM[i % 4]} hl={i === 3 ? RED : undefined} /></div>))}
        {CLIENTS.slice(0, 6).map((c, i) => piece(i + 9, 300 + i * 200, 60, 120, 40, <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px 4px 4px", borderRadius: 999, background: "#fff", border: `1px solid ${K.border}`, fontFamily: INTER, fontSize: 13 }}><ClientDot c={c} s={22} />{c[0]}</div>))}
      </div>
      {[["Wrong link sent", 26.2, 520, 220], ["2 versions of 1 campaign", 26.7, 1080, 300], ["Who deleted this?", 27.2, 640, 640]].map(([l, a, x, y]) => { const k = sp(t, a as number, 12, 240); return <div key={l as string} style={{ position: "absolute", left: x as number, top: y as number, padding: "10px 18px", borderRadius: 10, background: "#FEE2E2", color: "#B91C1C", fontFamily: INTER, fontWeight: 700, fontSize: 24, transform: `scale(${k}) translateY(${f(4) * f(4) * 1100}px)`, boxShadow: "0 12px 30px -12px rgba(185,28,28,0.5)" }}>⚠ {l as string}</div>; })}
    </AbsoluteFill>
  );
};

// ---------- S5 + S6 Team Workspaces: one per client (30.85–37.45) ----------
const WS: { c: [string, string]; links: number; tpl: number; clicks: number[] }[] = [
  { c: CLIENTS[0], links: 184, tpl: 6, clicks: [3, 5, 4, 7, 6, 9, 8] }, { c: CLIENTS[1], links: 96, tpl: 4, clicks: [2, 3, 5, 4, 6, 5, 7] }, { c: CLIENTS[2], links: 142, tpl: 5, clicks: [4, 4, 6, 5, 8, 7, 9] },
];
const Spaces: React.FC<{ t: number }> = ({ t }) => {
  const sw = sp(t, 31.0, 15, 180), cards = t > 34.0;
  const hlL = t > 34.5 && t < 35.7, hlT = t > 35.7 && t < 36.6, hlN = t > 36.6;
  return (
    <AbsoluteFill style={{ fontFamily: INTER, color: K.text }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: cards ? 90 : 300, textAlign: "center", transition: "none", transform: `translateY(${cards ? 0 : 0}px)` }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16, transform: `scale(${sp(t, 31.4, 14, 200)})` }}><Img src={staticFile("lmv/logo.svg")} style={{ height: 54 }} /><span style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1.5 }}>Team Workspaces</span></div>
      </div>
      {!cards && (
        <div style={{ position: "absolute", left: 960 - 200, top: 440, width: 400, borderRadius: 16, background: "#fff", padding: 10, boxShadow: "0 30px 70px -20px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.06)", transform: `scale(${sw})`, transformOrigin: "50% 0" }}>
          <div style={{ fontSize: 13, color: K.muted, padding: "8px 12px", fontWeight: 600, letterSpacing: "0.05em" }}>WORKSPACES</div>
          {CLIENTS.slice(0, 5).map((c, i) => <div key={c[0]} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 10, fontSize: 18, background: i === Math.floor(Math.max(0, t - 32.2) / 0.4) % 5 ? K.orangeBg : undefined, opacity: ci(t, 31.3 + i * 0.08, 31.6 + i * 0.08) }}><ClientDot c={c} s={32} />{c[0]}<span style={{ marginLeft: "auto", fontSize: 13, color: K.muted }}>workspace</span></div>)}
          <div style={{ borderTop: `1px solid ${K.border}`, marginTop: 6, padding: "12px", display: "flex", gap: 8, alignItems: "center", fontSize: 16, color: K.orange, fontWeight: 600 }}>{I(Plus, 16, K.orange)}New workspace</div>
        </div>
      )}
      {cards && WS.map((w, i) => { const k = sp(t, 34.05 + i * 0.12, 14, 190); return (
        <div key={w.c[0]} style={{ position: "absolute", left: 110 + i * 580, top: 250, width: 540, transform: `translateY(${(1 - k) * 300}px)`, opacity: k }}>
          <Card style={{ padding: 26, boxShadow: "0 30px 70px -26px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}><ClientDot c={w.c} s={58} /><div><div style={{ fontSize: 32, fontWeight: 700 }}>{w.c[0]}</div><div style={{ fontSize: 18, color: K.muted }}>Workspace</div></div></div>
            {([["Links", Link2, `${w.links}`, hlL], ["UTM templates", FileText, `${w.tpl}`, hlT]] as [string, typeof Link2, string, boolean][]).map(([l, Ic, v, on]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, padding: "12px 14px", borderRadius: 10, background: on ? K.orangeBg : "#F8F8F8", border: `1.5px solid ${on ? K.orange : "transparent"}`, fontSize: 23 }}>{I(Ic, 22, on ? K.orange : K.muted)}{l}<span style={{ marginLeft: "auto", fontWeight: 700 }}>{v}</span></div>))}
            <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 10, background: hlN ? K.orangeBg : "#F8F8F8", border: `1.5px solid ${hlN ? K.orange : "transparent"}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 23 }}>{I(MousePointerClick, 22, hlN ? K.orange : K.muted)}Clicks this week</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 70, marginTop: 10 }}>{w.clicks.map((v, j) => <div key={j} style={{ flex: 1, height: `${v * 10 * ci(t, 34.3 + j * 0.05, 34.9 + j * 0.05)}%`, borderRadius: 4, background: hlN ? K.orange : "#CBD5E1" }} />)}</div>
            </div>
          </Card>
        </div>); })}
    </AbsoluteFill>
  );
};

// ---------- S7 shared rules + templates (37.45–44.5) ----------
const Shared: React.FC<{ t: number }> = ({ t }) => {
  const same = t > 41.9;
  return (
    <Shell active="UTM Templates" crumbs={["Bluepeak", "UTM Templates"]}>
      <Pg>
        <Title t="UTM Templates & Rules" s="Shared with everyone in this workspace" right={<div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ display: "flex" }}>{TEAM.map((m, i) => <span key={i} style={{ marginLeft: i ? -8 : 0, transform: `scale(${sp(t, 37.6 + i * 0.1, 12, 260)})`, display: "inline-block", boxShadow: "0 0 0 2px #fff", borderRadius: 20 }}><Avatar txt={m[0]} c={m[2]} s={36} /></span>)}</div><Badge tone="green">{I(Users, 12, "#15803D")}Shared automatically</Badge></div>} />
        <Card style={{ overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.2fr", padding: "12px 18px", fontSize: 13, color: K.muted, borderBottom: `1px solid ${K.border}`, background: "#FAFAFA" }}><span>Template</span><span>Source</span><span>Medium</span><span>Rule</span></div>
          {[["Summer campaign", "instagram", "social", "lowercase · hyphens"], ["Newsletter", "newsletter", "email", "lowercase · hyphens"], ["Paid search", "google", "cpc", "allowed values only"]].map(([n, s, m, r], i) => (
            <div key={n} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.2fr", padding: "16px 18px", alignItems: "center", borderBottom: `1px solid ${K.border}`, fontSize: 15, opacity: ci(t, 37.7 + i * 0.15, 38.1 + i * 0.15), background: i === 0 && t > 38.6 && t < 41.8 ? "#FFF8F4" : "#fff" }}>
              <span style={{ fontWeight: 500 }}>{n}</span><span style={{ fontFamily: MONO }}>{s}</span><span style={{ fontFamily: MONO }}>{m}</span><span style={{ display: "flex", alignItems: "center", gap: 6 }}>{I(ListChecks, 14, K.orange)}{r}</span></div>))}
        </Card>
        <div style={{ display: "flex", gap: 24, marginTop: 30 }}>
          {[TEAM[0], TEAM[1]].map((m, i) => { const a = 40.0 + i * 0.5; return (
            <Card key={m[1]} style={{ flex: 1, padding: 22, opacity: ci(t, a - 0.3, a) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 600 }}><Avatar txt={m[0]} c={m[2]} s={30} />{m[1]} builds a link</div>
              <Field label="Campaign" value={(i ? "Summer Sale" : "summer sale").slice(0, Math.max(0, Math.floor((t - a) * 14)))} mono />
              <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 16, color: same ? GREEN : K.muted, display: "flex", alignItems: "center", gap: 8 }}>→ utm_campaign=<b>{same ? "summer-sale" : "…"}</b>{same && I(Check, 18, GREEN)}</div>
            </Card>); })}
        </div>
        {same && <div style={{ position: "absolute", left: 380, top: 476, boxShadow: "0 10px 30px -10px rgba(21,128,61,0.5)", display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 10, background: "#DCFCE7", color: "#15803D", fontSize: 17, fontWeight: 600, transform: `scale(${sp(t, 42.0, 12, 260)})`, transformOrigin: "0 50%" }}>{I(Check, 18, "#15803D")}Same name, every time</div>}
      </Pg>
    </Shell>
  );
};

// ---------- S8 invite + roles (44.5–57.5) ----------
const ROLES: [string, number, [string, boolean][], string][] = [
  ["Admin", 48.95, [["Create links", true], ["Edit links", true], ["Delete links", true]], "#F97316"],
  ["Editor", 50.55, [["Create links", true], ["Edit links", true], ["Delete links", false]], "#3B82F6"],
  ["Viewer", 54.05, [["View links & results", true], ["Edit links", false], ["Delete links", false]], "#64748B"],
];
const Roles: React.FC<{ t: number }> = ({ t }) => {
  const cards = t > 48.7;
  const email = "jordan@bluepeak.com".slice(0, Math.max(0, Math.floor((t - 45.3) * 14)));
  const sent = t > 47.6;
  return (
    <AbsoluteFill>
      <AppWindow style={{ transform: `scale(${cards ? 0.92 : 1})`, filter: cards ? "blur(3px)" : undefined, opacity: cards ? 0.55 : 1 }}>
        <Shell settings active="Members" crumbs={["Bluepeak", "Settings", "Members"]}>
          <Pg>
            <Title t="Team Members" s="Manage your workspace members, invites, and permissions." />
            <Card style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600 }}>{I(UserPlus, 16)}Invite Member</div>
              <div style={{ fontSize: 13.5, color: K.muted, marginTop: 4 }}>They'll receive an email with a link to join this workspace.</div>
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}><Field value={email} ph="colleague@company.com" icon={I(Mail, 15, K.muted)} caret={!sent && t > 45.3} /><div style={{ width: 150, height: 40, border: `1px solid ${K.border}`, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14, gap: 6 }}>Editor<span style={{ marginLeft: "auto" }}>{I(ChevronDown, 14)}</span></div><Btn primary hl={ci(t, 47.2, 47.6)}>{I(UserPlus, 15, "#fff")}Send Invite</Btn></div>
            </Card>
            {sent && <Card style={{ padding: 20, marginTop: 16 }}><div style={{ fontSize: 15, fontWeight: 600 }}>Pending Invites</div><div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12, transform: `translateY(${(1 - sp(t, 47.65, 14, 220)) * 20}px)` }}>{I(Mail, 18, K.muted)}<div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>jordan@bluepeak.com</div><div style={{ fontSize: 12.5, color: K.muted }}>Invited just now · email sent</div></div><Badge tone="blue">Editor</Badge></div></Card>}
          </Pg>
          {!sent && t > 46.3 && <Cursor x={interpolate(ci(t, 46.3, 47.1), [0, 1], [900, 1185])} y={interpolate(ci(t, 46.3, 47.1), [0, 1], [480, 262])} click={ci(t, 47.25, 47.6)} />}
        </Shell>
      </AppWindow>
      {cards && ROLES.map(([r, a, perms, c], i) => { const k = sp(t, a, 14, 190); const who = r === "Viewer" && t > 56.2; return (
        <div key={r} style={{ position: "absolute", left: 210 + i * 520, top: 230, width: 460, transform: `translateY(${(1 - k) * 400}px) scale(${0.9 + k * 0.1})`, opacity: Math.min(1, k * 2), fontFamily: INTER }}>
          <Card style={{ padding: 28, boxShadow: "0 40px 80px -26px rgba(0,0,0,0.35)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 48, height: 48, borderRadius: 12, background: `${c}1F`, display: "flex", alignItems: "center", justifyContent: "center" }}>{I(r === "Admin" ? ShieldCheck : r === "Editor" ? Pencil : Eye, 24, c)}</div><div style={{ fontSize: 30, fontWeight: 700 }}>{r}</div></div>
            {perms.map(([p, ok], j) => <div key={p} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18, fontSize: 21, color: ok ? K.text : K.faint, opacity: ci(t, a + 0.25 + j * 0.15, a + 0.5 + j * 0.15) }}><div style={{ width: 30, height: 30, borderRadius: 15, background: ok ? "#DCFCE7" : "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center" }}>{I(ok ? Check : X, 17, ok ? GREEN : RED)}</div><span style={{ textDecoration: ok ? undefined : "line-through" }}>{p}</span></div>)}
            {who && <div style={{ display: "flex", gap: 8, marginTop: 20 }}>{["your boss", "your client"].map((w, j) => <span key={w} style={{ transform: `scale(${sp(t, 56.25 + j * 0.25, 12, 260)})`, display: "inline-block" }}><Badge tone="purple">{w}</Badge></span>)}</div>}
          </Card>
        </div>); })}
    </AbsoluteFill>
  );
};

// ---------- S9 audit log (57.5–63.45) ----------
const LOG: [string, string, string, string, number, string][] = [
  ["SL", "Sam", "#EF4444", "created go.linkutm.com/bp-summer", 59.85, "10:02"],
  ["PN", "Priya", "#EC4899", "changed the destination of go.linkutm.com/bp-menu", 60.85, "10:14"],
  ["AR", "Alex", "#F97316", "deleted go.linkutm.com/bp-flyer", 61.6, "10:31"],
];
const Audit: React.FC<{ t: number }> = ({ t }) => (
  <Shell settings active="General" crumbs={["Bluepeak", "Settings", "Activity"]}>
    <Pg>
      <Title t="Activity log" s="Every action in this workspace is logged." right={<Badge tone="orange">{I(History, 12, K.orange)}Audit trail</Badge>} />
      <Card style={{ padding: "6px 22px" }}>
        {LOG.map(([a, n, c, what, at, tm], i) => { const k = sp(t, at - 0.1, 15, 220), del = what.startsWith("deleted"), hl = del && t > 62.4; return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 0", borderBottom: i < 2 ? `1px solid ${K.border}` : undefined, opacity: k, transform: `translateX(${(1 - k) * 40}px)`, background: hl ? "#FFF8F4" : undefined, borderRadius: 10, boxShadow: hl ? `0 0 0 3px ${K.orange}55` : undefined, paddingLeft: hl ? 12 : 0 }}>
            <Avatar txt={a} c={c} s={44} /><div style={{ flex: 1, fontSize: 19 }}><b>{n}</b> {what}</div>
            <Badge tone={del ? "red" : what.startsWith("created") ? "green" : "blue"}>{del ? "Deleted" : what.startsWith("created") ? "Created" : "Edited"}</Badge>
            <span style={{ fontFamily: MONO, fontSize: 15, color: K.muted, width: 60, textAlign: "right" }}>{tm}</span>
          </div>); })}
      </Card>
      {t > 62.4 && <div style={{ marginTop: 22, display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 12, background: "#DCFCE7", color: "#15803D", fontSize: 19, fontWeight: 600, transform: `scale(${sp(t, 62.45, 12, 260)})`, transformOrigin: "0 50%" }}>{I(Check, 18, "#15803D")}Mystery solved: Alex, 10:31</div>}
    </Pg>
  </Shell>
);

// ---------- S10 one tool, every client, whole team (63.45–DUR) ----------
const Close: React.FC<{ t: number }> = ({ t }) => {
  const url = t > 66.8;
  return (
    <AbsoluteFill style={{ fontFamily: INTER, color: K.text }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}>
        <div style={{ display: "inline-flex", gap: 14 }}>{CLIENTS.map((c, i) => <span key={c[0]} style={{ transform: `scale(${sp(t, 63.9 + i * 0.05, 13, 240)})`, display: "inline-block" }}><ClientDot c={c} s={64} /></span>)}</div>
        <div style={{ marginTop: 34, display: "inline-flex", alignItems: "center", gap: 18, padding: "18px 28px", borderRadius: 999, background: "#fff", boxShadow: "0 24px 60px -24px rgba(0,0,0,0.3)", opacity: ci(t, 64.7, 65.1), transform: `translateY(${(1 - ci(t, 64.7, 65.1)) * 30}px)` }}>
          <div style={{ display: "flex" }}>{TEAM.map((m, i) => <span key={i} style={{ marginLeft: i ? -12 : 0, boxShadow: "0 0 0 3px #fff", borderRadius: 30, display: "inline-block" }}><Avatar txt={m[0]} c={m[2]} s={56} /></span>)}</div>
          <span style={{ fontSize: 30, fontWeight: 600 }}>Your whole team, on the same page</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 960 - 420, top: 560, width: 840, height: 72, borderRadius: 16, background: "#fff", boxShadow: "0 30px 70px -24px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 14, padding: "0 24px", fontSize: 30, opacity: ci(t, 66.7, 67.0), transform: `scale(${0.9 + sp(t, 66.7, 14, 200) * 0.1})` }}>
        {I(Lock, 20, "#888")}<span style={{ color: K.text, fontWeight: 600 }}>{"linkutm.com".slice(0, url ? Math.max(0, Math.floor((t - 67.6) * 14)) : 0)}</span><span style={{ width: 2, height: 32, background: K.text, opacity: Math.sin(t * 8) > 0 ? 1 : 0 }} />
        <span style={{ marginLeft: "auto" }}><Btn primary>Try Team Workspaces</Btn></span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- TEAM-CHAT captions ----------
const KEY = /^(clients?|wrong|workspace|workspaces|templates|rules|admins|editors|viewers|everything|deleted?|deletes|email|team|tool|guessing|linkutm(\.com)?|apart)$/i;
type Chunk = { a: number; b: number; w: [number, number, string][] };
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = []; let cur: [number, number, string][] = [];
  W.forEach((w, i) => {
    cur.push(w);
    const next = W[i + 1], len = cur.reduce((s, x) => s + x[2].length + 1, 0);
    if (/[.?!]$/.test(w[2]) || (/,$/.test(w[2]) && len > 18) || len > 44 || !next || next[0] - w[1] > 0.45) { out.push({ a: cur[0][0], b: cur[cur.length - 1][1], w: cur }); cur = []; }
  });
  out.forEach((c, i) => { c.b = out[i + 1] ? out[i + 1].a : c.b + 1.0; });
  return out;
})();
const Bubble: React.FC<{ c: Chunk; t: number; old?: number }> = ({ c, t, old = 0 }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, opacity: 1 - old * 0.55, transform: `scale(${1 - old * 0.08})`, transformOrigin: "0 100%" }}>
    <Img src={staticFile("teamws/avatar.jpg")} style={{ width: 54, height: 54, borderRadius: 27, boxShadow: "0 0 0 3px #fff", flexShrink: 0 }} />
    <div style={{ background: "#fff", borderRadius: "6px 20px 20px 20px", padding: "12px 22px 14px", boxShadow: "0 16px 40px -16px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.05)", fontFamily: INTER, maxWidth: 1000 }}>
      {!old && <div style={{ fontSize: 15, color: K.muted, fontWeight: 600, marginBottom: 3 }}>linkutm <span style={{ fontWeight: 400 }}>· now</span></div>}
      <div style={{ fontSize: 34, fontWeight: 600, color: K.text, lineHeight: 1.25, letterSpacing: -0.3 }}>
        {c.w.map(([a, , s], i) => { const on = old || t >= a - 0.03; const key = KEY.test(s.replace(/[.,?!]/g, "")); return <span key={i} style={{ opacity: on ? 1 : 0, color: key ? K.orange : undefined, fontWeight: key ? 700 : 600 }}>{s}{" "}</span>; })}
      </div>
    </div>
  </div>
);
const Chat: React.FC<{ t: number }> = ({ t }) => {
  const i = CHUNKS.findIndex((c) => t >= c.a - 0.05 && t < c.b);
  if (i < 0) return null;
  const c = CHUNKS[i], prev = i > 0 && c.a - CHUNKS[i - 1].b < 0.5 ? CHUNKS[i - 1] : null, k = sp(t, c.a - 0.05, 17, 260);
  return (
    <div style={{ position: "absolute", left: 220, bottom: 40, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      {prev && <div style={{ transform: `translateY(${(1 - k) * 40}px)` }}><Bubble c={prev} t={t} old={1} /></div>}
      <div style={{ transform: `translateY(${(1 - k) * 40}px)`, opacity: Math.min(1, k * 2) }}><Bubble c={c} t={t} /></div>
    </div>
  );
};

// ---------- master ----------
const BGC = "linear-gradient(160deg, #F7F4EF 0%, #EFEAE3 100%)";
type Sc = { a: number; b: number; node: (t: number) => React.ReactNode; cam?: (t: number) => [number, number, number] };
const SC: Sc[] = [
  { a: 0, b: 6.8, node: (t) => <Hook t={t} /> },
  { a: 6.7, b: 12.95, node: (t) => <AppWindow><Pile t={t} /></AppWindow>, cam: (t) => [1.08 + ci(t, 6.7, 12.9) * 0.08, 1150, 300] },
  { a: 12.9, b: 20.15, node: (t) => <AppWindow><Names t={t} /></AppWindow>, cam: (t) => [t < 17 ? 1.32 : 1.1, t < 17 ? 1150 : 1000, 260] },
  { a: 20.1, b: 26.05, node: (t) => <Deleted t={t} />, cam: (t) => [1 + ci(t, 20.1, 25.9) * 0.06, 960, 500] },
  { a: 26.0, b: 30.9, node: (t) => <Apart t={t} /> },
  { a: 30.85, b: 37.5, node: (t) => <Spaces t={t} /> },
  { a: 37.45, b: 44.55, node: (t) => <AppWindow><Shared t={t} /></AppWindow>, cam: (t) => [1.12 + ci(t, 37.5, 44.4) * 0.04, 1150, 700] },
  { a: 44.5, b: 57.55, node: (t) => <Roles t={t} />, cam: (t) => [t < 48.7 ? 1.3 : 1, 1150, 250] },
  { a: 57.5, b: 63.5, node: (t) => <AppWindow><Audit t={t} /></AppWindow>, cam: (t) => [1.25 + ci(t, 57.6, 63.4) * 0.04, 1150, 620] },
  { a: 63.45, b: DUR, node: (t) => <Close t={t} /> },
];
const Film: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ background: BGC, overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(120,100,80,0.10) 1.5px, transparent 1.5px)", backgroundSize: "34px 34px" }} />
      {SC.map((s, i) => {
        if (t < s.a || t >= s.b) return null;
        const k = i === 0 ? 1 : ci(t, s.a, s.a + 0.4, 0, 1, Easing.out(Easing.cubic)), o = ci(t, s.b - 0.12, s.b);
        const [z, x, y] = s.cam ? s.cam(t) : [1, 960, 540];
        return <AbsoluteFill key={i} style={{ opacity: k * (1 - o), transform: `translateY(${(1 - k) * 60}px) scale(${0.97 + k * 0.03})` }}><Cam s={z} x={x} y={y}>{s.node(t)}</Cam></AbsoluteFill>;
      })}
      <Chat t={t} />
      <Audio src={staticFile("teamws/vo.wav")} />
    </AbsoluteFill>
  );
};
export const TeamWorkspacesComp: React.FC = () => <Composition id="TeamWorkspaces" component={Film} durationInFrames={Math.round(DUR * FPS)} fps={FPS} width={WD} height={HT} />;
