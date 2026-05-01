#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function ok(label, detail = '') {
  console.log(`OK   ${label}${detail ? ` - ${detail}` : ''}`);
}

function warn(label, detail = '') {
  console.log(`WARN ${label}${detail ? ` - ${detail}` : ''}`);
}

function fail(label, detail = '') {
  console.log(`FAIL ${label}${detail ? ` - ${detail}` : ''}`);
}

function hasCommand(cmd) {
  try {
    execSync(`command -v ${cmd}`, { stdio: 'pipe', shell: '/bin/bash' });
    return true;
  } catch {
    return false;
  }
}

function run(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', shell: '/bin/bash' }).trim();
  } catch (err) {
    return null;
  }
}

const skillDir = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const scriptsDir = path.join(skillDir, 'scripts');
const captureScript = path.join(scriptsDir, 'capture-screenshot.mjs');
const reviewScript = path.join(scriptsDir, 'visual-review.mjs');

let failures = 0;

if (fs.existsSync(path.join(skillDir, 'SKILL.md'))) {
  ok('skill directory', skillDir);
} else {
  fail('skill directory', `SKILL.md not found in ${skillDir}`);
  failures++;
}

if (fs.existsSync(captureScript)) ok('capture script', captureScript);
else {
  fail('capture script', 'scripts/capture-screenshot.mjs not found');
  failures++;
}

if (fs.existsSync(reviewScript)) ok('visual review script', reviewScript);
else {
  fail('visual review script', 'scripts/visual-review.mjs not found');
  failures++;
}

if (hasCommand('node')) ok('node', run('node --version'));
else {
  fail('node', 'required to run helper scripts');
  failures++;
}

if (hasCommand('npm')) ok('npm', run('npm --version'));
else warn('npm', 'not found; Playwright may still be available another way');

if (hasCommand('npx')) ok('npx', run('npx --version'));
else warn('npx', 'not found; ad-hoc Playwright usage may be harder');

if (hasCommand('ollama')) {
  ok('ollama', run('ollama --version') || 'installed');
  const models = run('ollama list');
  if (models && models.includes('qwen3-vl:30b')) ok('preferred visual model', 'qwen3-vl:30b present');
  else warn('preferred visual model', 'qwen3-vl:30b not found; fallback or manual review may be required');
} else {
  warn('ollama', 'not found; visual review fallback will be required');
}

try {
  const playwrightPkg = run("node -e \"require.resolve('playwright') && process.stdout.write('present')\"");
  if (playwrightPkg === 'present') ok('playwright package', 'available to node');
  else warn('playwright package', 'not resolvable from current directory');
} catch {
  warn('playwright package', 'not resolvable from current directory');
}

const summary = failures === 0 ? 'READY_WITH_WARNINGS_ALLOWED' : 'NOT_READY';
console.log(`\nSUMMARY ${summary}`);
process.exit(failures === 0 ? 0 : 1);
