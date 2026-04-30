#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
const [url, outputPath, widthArg = "390", heightArg = "844"] = process.argv.slice(2);
if (!url || !outputPath) { console.error("Usage: node capture-screenshot.mjs <url> <output.png> [width] [height]"); process.exit(2); }
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: Number(widthArg), height: Number(heightArg) }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle" });
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await page.screenshot({ path: outputPath, fullPage: true });
  console.log(`Screenshot saved to ${outputPath} (${widthArg}x${heightArg})`);
} finally { await browser.close(); }
