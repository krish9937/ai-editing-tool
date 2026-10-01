#!/usr/bin/env node
// eleven-vo.mjs — generate per-line VO from ElevenLabs TTS.
// Usage: node scripts/eleven-vo.mjs <voice_id> <lines.json> <out_dir>
// lines.json = [{ id, text }]. Reads ELEVENLABS_API_KEY from .env.
import fs from "fs";
import path from "path";

const [, , voiceId, linesPath, outDir] = process.argv;
if (!voiceId || !linesPath || !outDir) {
  console.error("usage: node scripts/eleven-vo.mjs <voice_id> <lines.json> <out_dir>");
  process.exit(1);
}

// read key from .env
const env = fs.readFileSync(new URL("../.env", import.meta.url), "utf8");
const KEY = (env.match(/^ELEVENLABS_API_KEY=(.+)$/m) || [])[1]?.trim();
if (!KEY) { console.error("ELEVENLABS_API_KEY not found in .env"); process.exit(1); }

const lines = JSON.parse(fs.readFileSync(linesPath, "utf8"));
fs.mkdirSync(outDir, { recursive: true });

const MODEL = "eleven_multilingual_v2";
const settings = { stability: 0.45, similarity_boost: 0.8, style: 0.15, use_speaker_boost: true };

for (const ln of lines) {
  const out = path.join(outDir, `${ln.id}.mp3`);
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ text: ln.text, model_id: MODEL, voice_settings: settings }),
  });
  if (!res.ok) {
    console.error(`FAIL ${ln.id}: ${res.status} ${(await res.text()).slice(0, 200)}`);
    process.exit(1);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(out, buf);
  console.log(`ok ${ln.id}  ${(buf.length / 1024).toFixed(0)}KB`);
}
console.log("done");
