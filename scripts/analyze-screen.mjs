#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/chat";
const OLLAMA_MODEL = process.env.OLLAMA_VISION_MODEL || "qwen3-vl:30b";
const MIN_REFERENCE_WIDTH_BLOCK = Number(process.env.MIN_REFERENCE_WIDTH_BLOCK || "280");
const MIN_REFERENCE_WIDTH_WARN = Number(process.env.MIN_REFERENCE_WIDTH_WARN || "390");
const DEFAULT_OUTPUT = "docs/design/SCREEN-analysis.md";

function usage() {
  console.error("Usage: node analyze-screen.mjs <screenshot.png> <spec-text-or-file> [output.md] [--context <file> ...]");
  process.exit(2);
}

if (args.length < 2) usage();

const positional = [];
const contextFiles = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--context") {
    const next = args[++i];
    if (!next) usage();
    contextFiles.push(next);
    continue;
  }
  positional.push(a);
}

const [screenshotPath, specInput, outputPath = DEFAULT_OUTPUT] = positional;
if (!screenshotPath || !specInput) usage();

async function fileExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}
async function imageToBase64(p) { return (await fs.readFile(p)).toString("base64"); }
function readPngDimensions(b) {
  if (b.length >= 24 && b.slice(1,4).toString("ascii") === "PNG") {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), format: "png" };
  }
  return null;
}
async function getImageDimensions(p) {
  const b = await fs.readFile(p);
  return readPngDimensions(b) ?? { width: null, height: null, format: "unknown" };
}
async function resolveSpec(input) {
  if (await fileExists(input)) {
    return { kind: "file", source: input, text: await fs.readFile(input, "utf8") };
  }
  return { kind: "inline", source: "inline", text: input };
}
async function readContexts(files) {
  const out = [];
  for (const f of files) {
    if (!(await fileExists(f))) throw new Error(`Context file not found: ${f}`);
    out.push({ path: f, text: await fs.readFile(f, "utf8") });
  }
  return out;
}
function buildPrompt(dim, spec, contexts) {
  const contextSection = contexts.length
    ? contexts.map((c, i) => `### Context ${i + 1}: ${c.path}\n\n${c.text}`).join("\n\n")
    : "No additional context documents were provided.";

  return `/no_think\nAnalyze this mobile app design screenshot against the provided textual specification and optional supporting design context.\n\nScreenshot dimensions: ${dim.width ?? "unknown"}x${dim.height ?? "unknown"}.\nSpec source: ${spec.kind} (${spec.source}).\n\n## Primary specification\n\n${spec.text}\n\n## Supporting context documents\n\n${contextSection}\n\nEvaluate:\n- what matches the specification\n- what does not match the specification\n- what appears to be missing\n- what appears to be extra\n- any design-system inconsistencies relative to the provided context documents\n- whether the interface language appears to be Russian when the spec/context implies a Russian UI\n\nReturn Markdown with these sections exactly:\n1. Executive Summary\n2. Analysis Metadata\n3. Spec Compliance Table\n4. Issues\n5. Suggestions\n\nRules:\n- In Analysis Metadata, include: status, screenshot_width, screenshot_height, spec_source, context_files_used, model.\n- In Spec Compliance Table, use columns: Spec item | Status | Comment.\n- Status values must be: MATCHES, PARTIAL, MISSING, EXTRA, UNCLEAR.\n- In Issues, group findings under BLOCKING, MAJOR, MINOR.\n- Only call something BLOCKING when it meaningfully breaks structure, core requirements, or makes the screen inconsistent with the stated design intent.\n- Be concrete and avoid hand-wavy praise.\n- If supporting context is absent, do not invent a design system; say what is observable and what is unclear.`;
}
function countSeverity(report, severity) {
  const m = report.match(new RegExp(`\\b${severity}\\b`, "g"));
  return m ? m.length : 0;
}

async function main() {
  if (!(await fileExists(screenshotPath))) throw new Error(`Screenshot image not found: ${screenshotPath}`);
  const dim = await getImageDimensions(screenshotPath);
  const spec = await resolveSpec(specInput);
  const contexts = await readContexts(contextFiles);

  if (dim.width && dim.width < MIN_REFERENCE_WIDTH_BLOCK) {
    const report = `# Screen Analysis\n\n## Executive Summary\n\nBLOCKED: Screenshot is too small for reliable analysis against the specification.\n\n## Analysis Metadata\n\n- status: blocked\n- screenshot_width: ${dim.width}\n- screenshot_height: ${dim.height ?? "unknown"}\n- spec_source: ${spec.kind} (${spec.source})\n- context_files_used: ${contexts.length ? contexts.map(c => c.path).join(", ") : "none"}\n- model: ${OLLAMA_MODEL}\n\n## Spec Compliance Table\n\n| Spec item | Status | Comment |\n|---|---|---|\n| Screenshot readability | UNCLEAR | Width ${dim.width}px is below hard block threshold ${MIN_REFERENCE_WIDTH_BLOCK}px |\n\n## Issues\n\n### BLOCKING\n- Screenshot resolution is too low for reliable screen analysis.\n\n### MAJOR\n- None.\n\n### MINOR\n- None.\n\n## Suggestions\n\n- Re-export or recapture the screenshot at a higher resolution.\n- Re-run analyze-screen.mjs with the corrected screenshot.\n`;
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, report, "utf8");
    console.log("blocking=1 major=0 minor=0 status=blocked");
    process.exit(1);
  }

  let warningPrefix = "";
  if (dim.width && dim.width < MIN_REFERENCE_WIDTH_WARN) {
    warningPrefix = `## Reference quality warning\n\nWARNING: Screenshot width ${dim.width}px is below the preferred width ${MIN_REFERENCE_WIDTH_WARN}px. Structural/spec analysis is allowed, but confidence is reduced for fine-grained typography, spacing, and polish claims.\n\n`;
  }

  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      messages: [{
        role: "user",
        content: buildPrompt(dim, spec, contexts),
        images: [await imageToBase64(screenshotPath)]
      }]
    })
  });

  if (!res.ok) throw new Error(`Ollama error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const baseReport = data.message?.content ?? JSON.stringify(data, null, 2);
  const report = warningPrefix ? `${warningPrefix}${baseReport}` : baseReport;
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, report, "utf8");

  const blocking = countSeverity(report, "BLOCKING");
  const major = countSeverity(report, "MAJOR");
  const minor = countSeverity(report, "MINOR");
  console.log(`blocking=${blocking} major=${major} minor=${minor} status=${warningPrefix ? "warning_or_ok" : "ok"}`);
}

main().catch(e => { console.error(e.stack || e.message || String(e)); process.exit(1); });
