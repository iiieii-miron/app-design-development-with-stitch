#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
const [referencePath, implementationPath, outputPath = "docs/design/VISUAL_GAP_REPORT.md"] = process.argv.slice(2);
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/chat";
const OLLAMA_MODEL = process.env.OLLAMA_VISION_MODEL || "qwen3-vl:30b";
const MIN_REFERENCE_WIDTH_BLOCK = Number(process.env.MIN_REFERENCE_WIDTH_BLOCK || "280");
const MIN_REFERENCE_WIDTH_WARN = Number(process.env.MIN_REFERENCE_WIDTH_WARN || "390");
if (!referencePath || !implementationPath) { console.error("Usage: node visual-review.mjs <reference.png> <implementation.png> [output.md]"); process.exit(2); }
async function fileExists(p) { try { await fs.access(p); return true; } catch { return false; } }
async function imageToBase64(p) { return (await fs.readFile(p)).toString("base64"); }
function readPngDimensions(b) { if (b.length >= 24 && b.slice(1,4).toString("ascii") === "PNG") return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), format: "png" }; return null; }
async function getImageDimensions(p) { const b = await fs.readFile(p); return readPngDimensions(b) ?? { width: null, height: null, format: "unknown" }; }
function prompt(rd, id) { return `Compare two UI screenshots as a senior product designer and QA reviewer.

Image 1 is the approved reference design. Image 2 is the implementation.

Focus on structural differences first: layout architecture, app shell, navigation, header/footer/bottom nav, missing/extra components, card/feed vs table/grid mismatch, spacing hierarchy, typography hierarchy, responsiveness, and browser-default/unstyled UI.

Reference image dimensions: ${rd.width ?? "unknown"}x${rd.height ?? "unknown"}. Implementation image dimensions: ${id.width ?? "unknown"}x${id.height ?? "unknown"}.

Return Markdown with sections: Executive Summary, Blocking Structural Mismatches, Gap Table, Required Fixes in Priority Order, Notes.

Gap Table columns: Area | Reference | Implementation | Severity | Required fix.
Severity must be BLOCKING, MAJOR, or MINOR. A layout architecture change is BLOCKING.`; }
async function main() {
  if (!(await fileExists(referencePath))) throw new Error(`Reference image not found: ${referencePath}`);
  if (!(await fileExists(implementationPath))) throw new Error(`Implementation image not found: ${implementationPath}`);
  const rd = await getImageDimensions(referencePath), id = await getImageDimensions(implementationPath);
  if (rd.width && rd.width < MIN_REFERENCE_WIDTH_BLOCK) {
    const report = `# Visual Gap Report\n\n## Status\n\nBLOCKED: invalid reference image\n\n## Executive Summary\n\nBLOCKING: Reference image is too small for reliable visual verification. Visual review is blocked until a valid reference is produced.\n\n## Machine-readable outcome\n\n- status: blocked\n- reason: invalid_reference_resolution\n- actual_width: ${rd.width}\n- minimum_width_block: ${MIN_REFERENCE_WIDTH_BLOCK}\n- minimum_width_preferred: ${MIN_REFERENCE_WIDTH_WARN}\n- next_action: recapture_reference\n\n## Required next actions\n\n1. Re-export or recapture the approved reference at the target viewport or 2x resolution.\n2. Re-run the visual review script with the corrected reference.\n3. Do not use the main coding model to inspect the screenshots directly as a fallback.\n\n| Area | Reference | Implementation | Severity | Required fix |\n|---|---|---|---|---|\n| Reference image quality | Expected width >= ${MIN_REFERENCE_WIDTH_BLOCK}px to avoid hard block | Actual width ${rd.width}px | BLOCKING | Recapture/export Stitch reference at target viewport size or 2x resolution |\n`;
    await fs.mkdir(path.dirname(outputPath), { recursive: true }); await fs.writeFile(outputPath, report, "utf8"); console.log(report); process.exit(1);
  }
  let qualityWarning = "";
  if (rd.width && rd.width < MIN_REFERENCE_WIDTH_WARN) {
    qualityWarning = `## Reference quality warning\n\nWARNING: Reference width ${rd.width}px is below the preferred width ${MIN_REFERENCE_WIDTH_WARN}px. Structural comparison is allowed, but confidence is reduced for fine-grained spacing, typography, and polish claims.\n\n`;
  }
  const res = await fetch(OLLAMA_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: OLLAMA_MODEL, stream: false, messages: [{ role: "user", content: prompt(rd,id), images: [await imageToBase64(referencePath), await imageToBase64(implementationPath)] }] }) });
  if (!res.ok) throw new Error(`Ollama error ${res.status}: ${await res.text()}`);
  const data = await res.json(); const baseReport = data.message?.content ?? JSON.stringify(data, null, 2); const report = qualityWarning ? `${qualityWarning}${baseReport}` : baseReport;
  await fs.mkdir(path.dirname(outputPath), { recursive: true }); await fs.writeFile(outputPath, report, "utf8"); console.log(`Visual review written to ${outputPath}\n`); console.log(report);
}
main().catch(e => { console.error(e.stack || e.message || String(e)); process.exit(1); });
