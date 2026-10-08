// Contact-sheet stills for many comps in one bundle; forwards browser console lines starting with LMV- (anchor misses, scene/click events).
// usage: node remotion_stills.mjs <outdir> <compIds,comma> <fractions,comma>  (run from the Remotion project root)
import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import path from "path";
const [out, ids, fr] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
for (const id of ids.split(",")) {
  const comp = await selectComposition({ serveUrl, id });
  for (const f of fr.split(",").map(Number)) {
    const frame = Math.min(comp.durationInFrames - 1, Math.round(comp.durationInFrames * f));
    await renderStill({ serveUrl, composition: comp, frame, output: `${out}/${id}_${String(Math.round(f * 100)).padStart(2, "0")}.jpeg`, imageFormat: "jpeg", scale: 0.4, chromiumOptions: { gl: "angle" }, onBrowserLog: (l) => { if (l.text.startsWith("LMV-")) console.log(id, l.text); } });
  }
  console.log(id, comp.durationInFrames / 30);
}
