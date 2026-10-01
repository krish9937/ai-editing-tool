#!/usr/bin/env node
// eleven-vo-ts.mjs — generate per-line VO WITH word-level timestamps.
// Usage: node scripts/eleven-vo-ts.mjs <voice_id> <lines.json> <out_dir>
// Writes <id>.mp3 and <id>.words.json ([{word,start,end}]) per line.
import fs from "fs";
import path from "path";

const [, , voiceId, linesPath, outDir] = process.argv;
const env = fs.readFileSync(new URL("../.env", import.meta.url), "utf8");
const KEY = (env.match(/^ELEVENLABS_API_KEY=(.+)$/m) || [])[1]?.trim();
if (!KEY) { console.error("no key"); process.exit(1); }

const lines = JSON.parse(fs.readFileSync(linesPath, "utf8"));
fs.mkdirSync(outDir, { recursive: true });
const MODEL = "eleven_multilingual_v2";
const settings = { stability: 0.45, similarity_boost: 0.8, style: 0.15, use_speaker_boost: true };

// aggregate per-character alignment into words
function toWords(chars, starts, ends) {
  const words = [];
  let cur = null;
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === " " || ch === "\n") { if (cur) { words.push(cur); cur = null; } continue; }
    if (!cur) cur = { word: "", start: starts[i], end: ends[i] };
    cur.word += ch;
    cur.end = ends[i];
  }
  if (cur) words.push(cur);
  return words;
}

for (const ln of lines) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ text: ln.text, model_id: MODEL, voice_settings: settings }),
  });
  if (!res.ok) { console.error(`FAIL ${ln.id}: ${res.status} ${(await res.text()).slice(0,200)}`); process.exit(1); }
  const j = await res.json();
  fs.writeFileSync(path.join(outDir, `${ln.id}.mp3`), Buffer.from(j.audio_base64, "base64"));
  const al = j.normalized_alignment || j.alignment;
  const words = toWords(al.characters, al.character_start_times_seconds, al.character_end_times_seconds);
  fs.writeFileSync(path.join(outDir, `${ln.id}.words.json`), JSON.stringify(words));
  console.log(`ok ${ln.id}  ${words.length} words  end=${words.length?words[words.length-1].end.toFixed(2):0}s`);
}
console.log("done");
