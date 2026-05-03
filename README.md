# app-design-development-with-stitch

Skill for a Superpowers + Stitch/Stitch Kit application workflow with strict design approval gates and visual QA.

This repository is runtime-neutral in spirit: the coding agent can be Claude Code, OpenCode, OpenClaw, Codex, or another environment. The common target setup is a text-only coding model paired with Playwright screenshots and a separate visual model for screenshot review.

Helper scripts are workflow tooling, not project application code.

## Install

Example Claude-style install:

```bash
mkdir -p ~/.claude/skills/app-design-development-with-stitch
cp -R ./* ~/.claude/skills/app-design-development-with-stitch/
```

You may also keep the skill in another directory, as long as you can point commands at the skill folder explicitly.

Expected structure:

```text
<skill-directory>/
  SKILL.md
  scripts/
    visual-review.mjs
  README.md
```

## Requirements

Preferred visual-review setup:

```bash
ollama pull qwen3-vl:30b
```

For implementation screenshot capture, prefer the target project's existing Playwright/browser test flow or another project-native screenshot command. This skill does not require a bundled capture helper.

## Check environment

```bash
SKILL_DIR=/absolute/path/to/app-design-development-with-stitch
node "$SKILL_DIR/scripts/check-env.mjs" "$SKILL_DIR"
```

This reports whether the skill scripts are present and whether common dependencies such as Node, Ollama, and the preferred visual model appear available.

## Use bundled script

```bash
SKILL_DIR=/absolute/path/to/app-design-development-with-stitch
node "$SKILL_DIR/scripts/visual-review.mjs" \
  docs/design/visual/reference-calendar-mobile.png \
  docs/design/visual/implementation-calendar-mobile.png \
  docs/design/visual/calendar-gap-report.md
```

## References

- `references/runtime-compatibility.md`
- `references/workflow-artifacts.md`
- `references/visual-review-policy.md`

## Notes

- Preferred visual review path: Ollama + `qwen3-vl:30b`
- Acceptable fallback: another user-approved VLM with equivalent review documented in the gap report
- Last resort: structured manual visual review using the same severity model
- Do not copy helper scripts into the target project unless explicitly requested
