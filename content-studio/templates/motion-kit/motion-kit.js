/* motion-kit.js: named motion recipes for HyperFrames (GSAP 3, deterministic, seek-safe).
 * content-studio SKILL §0m Motion law. Written 2026-11-25 after the "motion is dead" audit.
 *
 * WHY THIS EXISTS: our best moves lived in Remotion .tsx examples, while the default engine is HyperFrames.
 * Every build "ported them loosely" and the motion got lost. Copy this file next to index.html and CALL these
 * functions; don't re-derive the moves.
 *
 * USAGE (see motion-kit-demo.html):
 *   <script src="gsap.min.js"></script><script src="motion-kit.js"></script>
 *   MK.ready(() => {                       // waits for fonts + layout (recipes that measure need this)
 *     MK.init({ root: "#root" });          // injects blur filters + FX overlays
 *     const tl = gsap.timeline({ paused: true });
 *     MK.drop(tl, "#phone", 0.0);
 *     MK.whip(tl, "#sceneA", "#sceneB", 2.0, { dir: "left" });
 *     MK.finish(tl);                       // checks the motion log + registers window.__timelines.main
 *   });
 *
 * RULES BAKED IN
 * - Every tween placed later than t=0 uses immediateRender:false (a later fromTo otherwise applies its FROM at build
 *   time; this cost three re-renders on the GTA reel).
 * - Initial hidden states are set explicitly at t=0 with tl.set (MK.hide).
 * - Randomness is seeded (MK.rand), so every render is identical.
 * - Motion blur is directional, only while moving, then filter:none so holds stay pixel-sharp.
 * - Put secondary motion (idle/push/parallax) on a WRAPPER ("rig") so it never fights the element's entrance.
 * - NEVER call tl.seek() during the build once tweens exist (breaks earlier fromTo tweens in the real render).
 *   Measure layout before the first tween, or from offsets.
 * - HyperFrames forces visibility:visible on active .clip <video> elements, so hiding a PARENT with autoAlpha doesn't hide
 *   them. Toggle `display` on clip videos and their containers; any custom show helper must use visibility:inherit.
 * - Every transition is logged; MK.finish() enforces variety (>= 4 designs, none > 35 %, never the same twice in
 *   a row) and reports problems with console.error so `hyperframes validate` surfaces them.
 */
(function () {
  "use strict";
  const MK = {};
  const FPS = 30;
  const F = (n) => n / FPS; // frames -> seconds
  MK.F = F;
  MK.log = [];

  // ---------- setup ----------
  // NOTE: never wait on requestAnimationFrame/setTimeout here. HyperFrames' frame capture virtualises time, rAF never
  // fires and the timeline is never registered (render = blank, "sub_timeline_readiness_timeout"). fonts.ready is a
  // plain promise, so it resolves in capture too. Layout is final once fonts are in.
  MK.ready = function (build) {
    let done = false;
    const go = () => { if (!done) { done = true; build(); } };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
    else if (document.readyState !== "loading") go();
    else document.addEventListener("DOMContentLoaded", go);
  };

  MK.init = function (opts = {}) {
    const root = $(opts.root || "#root");
    MK.root = root;
    MK.W = Number(root.dataset.width || root.offsetWidth || 1080);
    MK.H = Number(root.dataset.height || root.offsetHeight || 1920);
    MK.seed = opts.seed || 7;
    _s = MK.seed;
    window.__timelines = window.__timelines || {};
    if (!document.getElementById("mk-defs")) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("id", "mk-defs");
      svg.setAttribute("width", "0");
      svg.setAttribute("height", "0");
      svg.style.position = "absolute";
      svg.innerHTML =
        '<filter id="mk-bx" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur id="mk-bxs" stdDeviation="0 0"/></filter>' +
        '<filter id="mk-by" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur id="mk-bys" stdDeviation="0 0"/></filter>';
      document.body.appendChild(svg);
    }
    // FX overlays (above everything)
    if (!document.getElementById("mk-flash")) {
      const flash = el("div", "mk-flash", "position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:9000;");
      const shock = el("div", "mk-shock",
        "position:absolute;left:0;top:0;width:200px;height:200px;margin:-100px 0 0 -100px;border-radius:50%;" +
        "border:14px solid rgba(255,255,255,.9);opacity:0;pointer-events:none;z-index:9001;");
      root.appendChild(flash);
      root.appendChild(shock);
    }
    return MK;
  };

  MK.finish = function (tl, opts = {}) {
    const name = opts.name || "main";
    const tr = MK.log.filter((e) => e.kind === "transition").sort((a, b) => a.t - b.t);
    const problems = [];
    if (tr.length >= 5) {
      const types = tr.map((e) => e.type);
      const distinct = new Set(types);
      if (distinct.size < 4) problems.push(`only ${distinct.size} transition designs (need >= 4)`);
      const counts = {};
      types.forEach((x) => (counts[x] = (counts[x] || 0) + 1));
      Object.entries(counts).forEach(([k, n]) => {
        if (n / types.length > 0.35) problems.push(`transition "${k}" used ${n}/${types.length} times (> 35 %)`);
      });
    }
    for (let i = 1; i < tr.length; i++)
      if (tr[i].type === tr[i - 1].type) problems.push(`same transition "${tr[i].type}" twice in a row at ${tr[i].t}s`);
    const ent = MK.log.filter((e) => e.kind === "entrance").length;
    const sec = MK.log.filter((e) => e.kind === "secondary").length;
    if (ent === 0) problems.push("no physical entrances logged");
    if (sec === 0) problems.push("no secondary motion logged (holds will look dead)");
    const report = { transitions: tr, entrances: ent, secondary: sec, problems, ok: problems.length === 0 };
    window.__mkReport = report;
    document.documentElement.setAttribute("data-mk-report", JSON.stringify({ ok: report.ok, problems }));
    problems.forEach((p) => console.error("[motion-kit] " + p));
    window.__timelines = window.__timelines || {};
    window.__timelines[name] = tl;
    tl.seek(0);
    return report;
  };

  // ---------- helpers ----------
  function $(s) { return typeof s === "string" ? document.querySelector(s) : s; }
  function $$(s) {
    if (typeof s === "string") return Array.from(document.querySelectorAll(s));
    if (s instanceof Element) return [s];
    return Array.from(s);
  }
  function el(tag, id, css) { const e = document.createElement(tag); if (id) e.id = id; if (css) e.style.cssText = css; return e; }
  function note(kind, type, t) { MK.log.push({ kind, type, t: +(+t).toFixed(2) }); }
  MK.note = note; // log a custom hand-built move: MK.note("transition", "my-move", 4.2)
  let _s = 7;
  MK.rand = function () { // mulberry32, seeded by MK.init({seed})
    _s |= 0; _s = (_s + 0x6d2b79f5) | 0;
    let t = Math.imul(_s ^ (_s >>> 15), 1 | _s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const R = (a, b) => a + (b - a) * MK.rand();
  function rectIn(node, host) { // node rect in host coordinates (layout, ignores transforms on host)
    const a = node.getBoundingClientRect(), b = host.getBoundingClientRect();
    return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height };
  }
  const NI = { immediateRender: false };

  MK.hide = function (tl, targets) { tl.set(targets, { autoAlpha: 0 }, 0); };
  MK.show = function (tl, targets, t) { tl.set(targets, { autoAlpha: 1 }, t); };

  // ---------- motion blur (directional, only while moving) ----------
  MK.blur = function (tl, target, t, dur, o = {}) {
    const axis = o.axis || "x", max = o.max == null ? 16 : o.max;
    const fid = axis === "x" ? "#mk-bx" : "#mk-by", sid = axis === "x" ? "#mk-bxs" : "#mk-bys";
    const dev = (v) => (axis === "x" ? `${v} 0` : `0 ${v}`);
    tl.set(target, { filter: `url(${fid})` }, t);
    tl.fromTo(sid, { attr: { stdDeviation: dev(0) } }, { attr: { stdDeviation: dev(max) }, duration: dur * 0.45, ease: "power2.in", ...NI }, t);
    tl.to(sid, { attr: { stdDeviation: dev(0) }, duration: dur * 0.55, ease: "power2.out" }, t + dur * 0.45);
    tl.set(target, { filter: "none" }, t + dur);
  };

  // ---------- TRANSITIONS (object-driven; each logs its type) ----------
  /** whip: one camera curve, outgoing and incoming ride the same ease + directional blur. dir = where content travels. */
  MK.whip = function (tl, outEl, inEl, t, o = {}) {
    const dir = o.dir || "left", dur = o.dur || 0.5;
    const horiz = dir === "left" || dir === "right";
    const sign = dir === "left" || dir === "up" ? -1 : 1;
    const D = (horiz ? MK.W : MK.H) * (o.dist || 1.1);
    const p = horiz ? "x" : "y";
    tl.set(inEl, { autoAlpha: 1, [p]: -sign * D }, t);
    tl.to(outEl, { [p]: sign * D, duration: dur, ease: "power3.inOut" }, t);
    tl.fromTo(inEl, { [p]: -sign * D }, { [p]: 0, duration: dur, ease: "power3.inOut", ...NI }, t);
    MK.blur(tl, [$(outEl), $(inEl)], t, dur, { axis: horiz ? "x" : "y", max: o.blur || 18 });
    tl.set(outEl, { autoAlpha: 0 }, t + dur);
    note("transition", horiz ? "whip" : "crane", t);
  };
  /** crane: vertical whip (the camera rises/falls to the next world). */
  MK.crane = function (tl, outEl, inEl, t, o = {}) { MK.whip(tl, outEl, inEl, t, { ...o, dir: o.dir || "up" }); };

  /** zoomThrough / screen-becomes-world: the camera dives into `target` (e.g. a phone screen) until it fills the
   *  frame, then `next` (the world that screen showed) continues the move from 1.12 -> 1. cam = the group to scale. */
  MK.zoomThrough = function (tl, cam, target, next, t, o = {}) {
    const dur = o.dur || 0.7;
    // NEVER tl.seek() here to measure "where the target is at t": a forward/back seek after kit fromTo tweens exist made
    // earlier words invisible in the REAL render while snapshots looked fine (Bio Pages v2, 2026-11-26). Measure the
    // build-time layout, or pass o.rect = {x, y, w, h} in cam coordinates if the target has moved by time t.
    const c = $(cam);
    const r = o.rect || rectIn($(target), c);
    const s = Math.max(MK.W / r.w, MK.H / r.h) * 1.04;
    const x = MK.W / 2 - (r.x + r.w / 2) * s, y = MK.H / 2 - (r.y + r.h / 2) * s;
    tl.set(c, { transformOrigin: "0 0" }, 0);
    tl.to(c, { x, y, scale: s, duration: dur, ease: "power3.in" }, t);
    MK.blur(tl, c, t + dur * 0.4, dur * 0.6, { axis: "y", max: 10 });
    tl.set(c, { autoAlpha: 0 }, t + dur);
    tl.set(next, { autoAlpha: 1 }, t + dur);
    tl.fromTo(next, { scale: 1.12 }, { scale: 1, duration: 0.45, ease: "power3.out", ...NI }, t + dur);
    note("transition", "screen-becomes-world", t);
  };

  /** flyIntoLens: an object rushes at the camera and its body wipes to the next scene. */
  MK.flyIntoLens = function (tl, obj, next, t, o = {}) {
    const dur = o.dur || 0.55;
    tl.set(next, { autoAlpha: 1 }, t + dur * 0.55);
    tl.fromTo(next, { scale: 1.25 }, { scale: 1, duration: 0.5, ease: "power3.out", ...NI }, t + dur * 0.55);
    tl.to(obj, { scale: o.scale || 9, rotation: o.rot == null ? -12 : o.rot, duration: dur, ease: "power3.in", zIndex: 50 }, t);
    MK.blur(tl, obj, t + dur * 0.3, dur * 0.7, { axis: "y", max: 14 });
    tl.set(obj, { autoAlpha: 0 }, t + dur);
    if (o.out) tl.set(o.out, { autoAlpha: 0 }, t + dur); // the scene the object belonged to
    note("transition", "fly-into-lens", t);
  };

  /** matchCut: shapes line up across the cut; outgoing pushes 1 -> 1.05, incoming lands 0.95 -> 1 on the same frame. */
  MK.matchCut = function (tl, outEl, inEl, t, o = {}) {
    tl.to(outEl, { scale: 1.05, duration: 0.22, ease: "power2.in" }, t - 0.22);
    tl.set(outEl, { autoAlpha: 0 }, t);
    tl.set(inEl, { autoAlpha: 1 }, t);
    tl.fromTo(inEl, { scale: 0.95 }, { scale: 1, duration: 0.35, ease: "power3.out", ...NI }, t);
    note("transition", "match-cut", t);
  };

  /** cardFlip: a card turns over and its back IS the next scene (front/back = two stacked elements). */
  MK.cardFlip = function (tl, front, back, t, o = {}) {
    const dur = o.dur || 0.55, ax = o.axis === "x" ? "rotationX" : "rotationY";
    tl.set([front, back], { transformPerspective: 1600 }, 0);
    tl.to(front, { [ax]: 90, duration: dur * 0.45, ease: "power2.in" }, t);
    tl.set(front, { autoAlpha: 0 }, t + dur * 0.45);
    tl.set(back, { autoAlpha: 1 }, t + dur * 0.45);
    tl.fromTo(back, { [ax]: -90 }, { [ax]: 0, duration: dur * 0.55, ease: "back.out(1.6)", ...NI }, t + dur * 0.45);
    note("transition", "card-flip", t);
  };

  /** NOTE shatter/foldInto clone the element's BUILD-TIME DOM: text typed later (typeOn) won't be in the shards.
   *  Pre-fill such text, or shatter a layer that is complete at build time. */
  /** shatter: the element breaks into 3D tiles that explode toward the lens; one centre tile flies into the camera.
   *  Pass `next` to reveal the following scene behind the debris. Tiles are DOM clones (ids kept so id-based CSS still applies). */
  MK.shatter = function (tl, target, t, o = {}) {
    const src = $(target), host = src.parentNode;
    const cols = o.cols || 6, rows = o.rows || 9, dur = o.dur || 0.9;
    const r = rectIn(src, host);
    const box = el("div", null, `position:absolute;left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;perspective:1400px;pointer-events:none;z-index:40;`);
    host.appendChild(box);
    const tw = r.w / cols, th = r.h / rows, tiles = [];
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
      const tile = el("div", null, `position:absolute;left:${j * tw}px;top:${i * th}px;width:${tw + 0.5}px;height:${th + 0.5}px;overflow:hidden;`);
      const c = src.cloneNode(true);
      // keep ids: id-based CSS (#scene { background } ...) must style the clone too. Duplicates come AFTER the
      // originals in the DOM, so later "#id" selectors still resolve to the original element.
      c.style.cssText += `;position:absolute;left:${-j * tw}px;top:${-i * th}px;width:${r.w}px;height:${r.h}px;margin:0;transform:none;opacity:1;visibility:visible;filter:none;`;
      tile.appendChild(c); box.appendChild(tile); tiles.push({ tile, i, j });
    }
    tl.set(box, { autoAlpha: 0 }, 0);
    tl.set(box, { autoAlpha: 1 }, t);
    tl.set(src, { autoAlpha: 0 }, t);
    if (o.next) { tl.set(o.next, { autoAlpha: 1 }, t); tl.fromTo(o.next, { scale: 1.15 }, { scale: 1, duration: dur, ease: "power3.out", ...NI }, t); }
    const ci = Math.floor(rows / 2), cj = Math.floor(cols / 2);
    tiles.forEach(({ tile, i, j }) => {
      const dx = (j + 0.5) / cols - 0.5, dy = (i + 0.5) / rows - 0.5;
      const hero = i === ci && j === cj;
      tl.to(tile, {
        x: hero ? 0 : dx * R(900, 1700), y: hero ? 0 : dy * R(900, 1700) + R(100, 500),
        z: hero ? 2400 : R(200, 1300),
        rotationX: R(-160, 160), rotationY: R(-160, 160), rotationZ: R(-60, 60),
        autoAlpha: 0, duration: dur * R(0.75, 1), ease: "power3.out",
      }, t + R(0, 0.06));
    });
    note("transition", "shatter", t);
    return box;
  };

  /** foldInto: the element folds up like paper (3 strips, accordion) and `next` (e.g. a QR) flips out of the fold. */
  MK.foldInto = function (tl, target, next, t, o = {}) {
    const src = $(target), host = src.parentNode, n = o.strips || 3, dur = o.dur || 0.6;
    const r = rectIn(src, host), sh = r.h / n;
    const box = el("div", null, `position:absolute;left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;perspective:1600px;pointer-events:none;z-index:40;`);
    host.appendChild(box);
    const strips = [];
    for (let i = 0; i < n; i++) {
      const s = el("div", null, `position:absolute;left:0;top:${i * sh}px;width:${r.w}px;height:${sh + 0.5}px;overflow:hidden;backface-visibility:hidden;`);
      const c = src.cloneNode(true);
      c.style.cssText += `;position:absolute;left:0;top:${-i * sh}px;width:${r.w}px;height:${r.h}px;margin:0;transform:none;opacity:1;visibility:visible;`;
      s.appendChild(c); box.appendChild(s); strips.push(s);
    }
    tl.set(box, { autoAlpha: 0 }, 0);
    tl.set(next, { autoAlpha: 0 }, 0); // the reveal must not show through the fold
    tl.set(box, { autoAlpha: 1 }, t);
    tl.set(src, { autoAlpha: 0 }, t);
    const step = (dur * 0.6) / n;
    strips.slice().reverse().forEach((s, k) => {
      const i = n - 1 - k;
      tl.to(s, { rotationX: i === 0 ? -90 : 90, transformOrigin: i === 0 ? "50% 100%" : "50% 0%", y: -i * sh * 0.5, duration: step * 1.3, ease: "power2.in" }, t + k * step);
    });
    tl.to(box, { scale: 0.6, duration: dur * 0.6, ease: "power2.in" }, t);
    tl.set(box, { autoAlpha: 0 }, t + dur * 0.65);
    tl.set(next, { autoAlpha: 1, transformPerspective: 1400 }, t + dur * 0.6);
    tl.fromTo(next, { rotationY: -100, scale: 0.6 }, { rotationY: 0, scale: 1, duration: dur * 0.6, ease: "back.out(1.7)", ...NI }, t + dur * 0.6);
    note("transition", "fold", t);
  };

  // ---------- ENTRANCES (physical) ----------
  MK.springIn = function (tl, targets, t, o = {}) {
    const from = o.from || "bottom", d = o.dist || 220;
    const v = { bottom: { y: d }, top: { y: -d }, left: { x: -d }, right: { x: d } }[from];
    tl.fromTo(targets, { ...v, autoAlpha: 0, scale: 0.92 },
      { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: o.dur || 0.42, ease: `back.out(${o.overshoot || 1.8})`, stagger: o.stagger == null ? 0.06 : o.stagger, ...NI }, t);
    note("entrance", "spring-in", t);
  };
  /** drop: gravity fall, lands with squash & stretch (+ optional contact shadow element that tightens on impact). */
  MK.drop = function (tl, targets, t, o = {}) {
    const h = o.height || 1100, fall = o.dur || 0.36, sq = o.squash || 0.06, st = o.stagger || 0.08;
    $$(targets).forEach((e, k) => {
      const tt = t + k * st;
      tl.fromTo(e, { y: -h, autoAlpha: 1, scaleX: 0.96, scaleY: 1.06 }, { y: 0, scaleX: 1, scaleY: 1, duration: fall, ease: "power2.in", ...NI }, tt);
      tl.to(e, { scaleY: 1 - sq, scaleX: 1 + sq * 0.7, transformOrigin: "50% 100%", duration: F(3), ease: "power1.out" }, tt + fall);
      tl.to(e, { scaleY: 1, scaleX: 1, duration: 0.4, ease: "elastic.out(1, 0.45)" }, tt + fall + F(3));
    });
    if (o.shadow) tl.fromTo(o.shadow, { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: fall, ease: "power2.in", ...NI }, t);
    note("entrance", "drop", t);
  };
  /** stickers: things slap onto the frame with rotation (comments, labels) + a little stack shake at the end. */
  MK.stickers = function (tl, targets, t, o = {}) {
    const els = $$(targets), st = o.stagger || 0.06;
    els.forEach((e, k) => tl.fromTo(e, { scale: 0, rotation: R(-14, 14), autoAlpha: 1 },
      { scale: 1, rotation: R(-5, 5), duration: 0.28, ease: "back.out(2.4)", ...NI }, t + k * st));
    MK.shake(tl, els, t + els.length * st, { amp: 6, dur: 0.18, note: false });
    note("entrance", "stickers", t);
  };
  MK.flipIn = function (tl, targets, t, o = {}) {
    const ax = o.axis === "x" ? "rotationX" : "rotationY";
    tl.set(targets, { transformPerspective: 1400 }, 0);
    tl.fromTo(targets, { [ax]: -100, autoAlpha: 0 }, { [ax]: 0, autoAlpha: 1, duration: o.dur || 0.5, ease: "back.out(1.5)", stagger: o.stagger || 0.05, ...NI }, t);
    note("entrance", "flip-in", t);
  };
  /** dealCards: tiles fly in on arcs from a source point (gallery/grid fill), like cards being dealt. */
  MK.dealCards = function (tl, targets, t, o = {}) {
    const els = $$(targets), st = o.stagger || 0.05, fx = o.fromX || 0, fy = o.fromY || 600;
    els.forEach((e, k) => tl.fromTo(e, { x: fx + R(-60, 60), y: fy, rotation: R(-30, 30), scale: 0.5, autoAlpha: 0 },
      { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: 0.42, ease: "back.out(1.6)", ...NI }, t + k * st));
    note("entrance", "deal-cards", t);
  };

  // ---------- SECONDARY MOTION (put on wrappers / rigs) ----------
  MK.idle = function (tl, rig, t, dur, o = {}) {
    const period = o.period || 2.4, half = period / 2, reps = Math.max(0, Math.floor(dur / half) - 1);
    tl.fromTo(rig, { rotation: -(o.rot || 1.2), y: 0 }, { rotation: o.rot || 1.2, y: -(o.y == null ? 10 : o.y), duration: half, ease: "sine.inOut", repeat: reps, yoyo: true, ...NI }, t);
    note("secondary", "idle", t);
  };
  MK.push = function (tl, rig, t, dur, o = {}) {
    tl.fromTo(rig, { scale: o.from || 1 }, { scale: o.to || 1.05, duration: dur, ease: "sine.inOut", ...NI }, t);
    note("secondary", "push", t);
  };
  /** parallax: layers = [{el, depth}] (depth 0 = far/static .. 1 = near/fast). */
  MK.parallax = function (tl, layers, t, dur, o = {}) {
    const dx = o.dx == null ? 80 : o.dx, dy = o.dy || 0;
    layers.forEach(({ el: e, depth }) => tl.fromTo(e, { x: dx * depth * 0.5, y: dy * depth * 0.5 },
      { x: -dx * depth * 0.5, y: -dy * depth * 0.5, duration: dur, ease: "none", ...NI }, t));
    note("secondary", "parallax", t);
  };
  /** glare: a light sweep across glass (element = an overlay with a diagonal white gradient, mix-blend screen). */
  MK.glare = function (tl, sweep, t, o = {}) {
    tl.fromTo(sweep, { xPercent: -130, autoAlpha: 1 }, { xPercent: 130, duration: o.dur || 0.9, ease: "power2.inOut", ...NI }, t);
    note("secondary", "glare", t);
  };

  // ---------- TEXT ----------
  function splitChars(e, text) {
    e.innerHTML = "";
    return Array.from(text).map((ch) => {
      const s = document.createElement("span");
      s.textContent = ch === " " ? " " : ch;
      s.style.display = "inline-block";
      e.appendChild(s);
      return s;
    });
  }
  /** typeOn: characters appear at `cps` chars/s (a pill URL, a handle, a search box). */
  MK.typeOn = function (tl, target, text, t, o = {}) {
    const chars = splitChars($(target), text), cps = o.cps || 30;
    tl.set(chars, { autoAlpha: 0 }, 0);
    chars.forEach((c, i) => tl.set(c, { autoAlpha: 1 }, t + i / cps));
    note("entrance", "type-on", t);
    return t + chars.length / cps;
  };
  /** rewrite: the old word's letters exit right->left, the new word's letters land ~1 f/char.
   *  BOTH sets of spans are built up front (a span injected later by tl.set never animates). */
  MK.rewrite = function (tl, target, oldText, newText, t, o = {}) {
    const e = $(target);
    e.style.position = e.style.position || "relative";
    e.innerHTML = "";
    const a = document.createElement("span"), b = document.createElement("span");
    a.style.display = b.style.display = "inline-block";
    b.style.position = "absolute"; b.style.left = "0"; b.style.top = "0"; b.style.whiteSpace = "nowrap";
    e.appendChild(a); e.appendChild(b);
    const oc = splitChars(a, oldText), nc = splitChars(b, newText), per = o.per || F(1);
    tl.set(nc, { autoAlpha: 0, yPercent: 60 }, 0);
    oc.slice().reverse().forEach((c, i) => tl.to(c, { yPercent: -70, autoAlpha: 0, duration: F(4), ease: "power2.in" }, t + i * per));
    const t2 = t + oc.length * per * 0.6;
    nc.forEach((c, i) => tl.to(c, { yPercent: 0, autoAlpha: 1, duration: F(5), ease: "back.out(2)" }, t2 + i * per));
    note("entrance", "text-rewrite", t);
  };
  /** crunch: a word slams in (scale 1.45 -> 1 in 5 frames) with a 2-frame shake. */
  MK.crunch = function (tl, target, t, o = {}) {
    tl.fromTo(target, { scale: o.from || 1.45, autoAlpha: 1 }, { scale: 1, duration: F(5), ease: "power4.out", ...NI }, t);
    MK.shake(tl, o.shakeTarget || target, t + F(4), { amp: o.amp || 10, dur: F(5), note: false });
    note("entrance", "crunch", t);
  };
  /** count: rolling number from -> to (deterministic, seek-safe) with a pop on landing. */
  MK.count = function (tl, target, from, to, t, dur, o = {}) {
    const e = $(target), p = { v: from }, fmt = o.fmt || ((v) => Math.round(v).toLocaleString("en-US"));
    tl.fromTo(p, { v: from }, { v: to, duration: dur, ease: o.ease || "power2.out", onUpdate: () => (e.textContent = fmt(p.v)), ...NI }, t);
    tl.fromTo(e, { scale: 1 }, { scale: 1.18, duration: F(4), ease: "power2.out", yoyo: true, repeat: 1, ...NI }, t + dur - F(2));
    note("entrance", "count-up", t);
  };

  // ---------- FX ----------
  MK.shake = function (tl, target, t, o = {}) {
    const amp = o.amp || 16, n = Math.max(2, Math.round((o.dur || 0.3) * FPS));
    for (let k = 0; k < n; k++) {
      const fall = 1 - k / n;
      tl.to(target, { x: R(-amp, amp) * fall, y: R(-amp, amp) * fall, duration: F(1), ease: "none" }, t + k * F(1));
    }
    tl.to(target, { x: 0, y: 0, duration: F(1) }, t + n * F(1));
    if (o.note !== false) note("fx", "shake", t);
  };
  /** impact: white flash (3 f) + shockwave ring from a point + RGB split on `target` + camera shake on `cam`. */
  MK.impact = function (tl, t, o = {}) {
    const cx = o.x == null ? MK.W / 2 : o.x, cy = o.y == null ? MK.H / 2 : o.y;
    tl.fromTo("#mk-flash", { opacity: 0 }, { opacity: o.flash == null ? 0.85 : o.flash, duration: F(1), ...NI }, t);
    tl.to("#mk-flash", { opacity: 0, duration: F(4), ease: "power2.out" }, t + F(1));
    tl.set("#mk-shock", { x: cx, y: cy, scale: 0.2, opacity: 1 }, t);
    tl.to("#mk-shock", { scale: o.ring || 9, opacity: 0, duration: 0.55, ease: "power3.out" }, t);
    if (o.target) {
      tl.fromTo(o.target, { filter: "drop-shadow(14px 0 0 rgba(255,30,60,.75)) drop-shadow(-14px 0 0 rgba(0,170,255,.75))" },
        { filter: "drop-shadow(0px 0 0 rgba(255,30,60,0)) drop-shadow(0px 0 0 rgba(0,170,255,0))", duration: 0.3, ease: "power2.out", ...NI }, t);
      tl.set(o.target, { filter: "none" }, t + 0.31);
    }
    if (o.cam) MK.shake(tl, o.cam, t, { amp: o.amp || 22, dur: 0.3, note: false });
    note("fx", "impact", t);
  };

  window.MK = MK;
})();
