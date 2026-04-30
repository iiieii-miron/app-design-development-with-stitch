# app-design-development-with-stitch

Claude Code skill for a Superpowers + Stitch/Stitch Kit application workflow.

This package follows Claude Code skills conventions: `SKILL.md` is the entry point and helper files live next to the skill. Helper scripts are workflow tooling, not project application code.

## Install

```bash
mkdir -p ~/.claude/skills/app-design-development-with-stitch
cp -R ./* ~/.claude/skills/app-design-development-with-stitch/
```

Expected structure:

```text
~/.claude/skills/app-design-development-with-stitch/
  SKILL.md
  scripts/
    visual-review.mjs
    capture-screenshot.mjs
  README.md
```

## Requirements

```bash
ollama pull qwen3-vl:30b
```

For screenshot capture, the target project needs Playwright available:

```bash
npm i -D playwright
npx playwright install chromium
```

## Use bundled scripts

```bash
node ~/.claude/skills/app-design-development-with-stitch/scripts/capture-screenshot.mjs \
  http://localhost:5173/calendar \
  docs/design/visual/implementation-calendar-mobile.png \
  390 844
```

```bash
node ~/.claude/skills/app-design-development-with-stitch/scripts/visual-review.mjs \
  docs/design/visual/reference-calendar-mobile.png \
  docs/design/visual/implementation-calendar-mobile.png \
  docs/design/visual/calendar-gap-report.md
```
