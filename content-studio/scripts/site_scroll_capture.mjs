// Scroll-capture any website via raw Chrome DevTools Protocol (no puppeteer).
// usage: node site_scroll_capture.mjs <url> <outdir>  -> s000.jpg... (stitch shot0 + rows 300-900 of each next shot)
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
const url = process.argv[2], out = process.argv[3];
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--remote-debugging-port=9333", `--user-data-dir=${process.env.TEMP || "/tmp"}/scroll-capture-profile`, "--window-size=1440,900", "about:blank"]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(2500);
const tabs = await (await fetch("http://127.0.0.1:9333/json")).json();
const ws = new WebSocket(tabs.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = {};
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d.result); delete pend[d.id]; } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1.5, mobile: false });
await send("Page.enable");
await send("Page.navigate", { url });
await sleep(7000);
const h = (await send("Runtime.evaluate", { expression: "document.documentElement.scrollHeight", returnByValue: true })).result.value;
console.log("height", h);
let n = 0;
for (let y = 0; y < h; y += 600) {
  await send("Runtime.evaluate", { expression: `window.scrollTo(0,${y})` });
  await sleep(900);
  const s = await send("Page.captureScreenshot", { format: "jpeg", quality: 90 });
  writeFileSync(`${out}/s${String(n++).padStart(3, "0")}.jpg`, Buffer.from(s.data, "base64"));
}
console.log("shots", n);
ws.close(); chrome.kill();
process.exit(0);
