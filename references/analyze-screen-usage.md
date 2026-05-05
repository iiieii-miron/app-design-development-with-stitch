# analyze-screen.mjs usage

## Purpose

Use `analyze-screen.mjs` to validate a single design screenshot against a textual specification before implementation exists.

This is for:
- checking a Stitch screen against a screen spec
- checking whether a generated design appears to follow the intended design/system context
- surfacing missing, extra, or inconsistent elements before coding begins

Do not use this script for reference-vs-implementation comparison. Use `visual-review.mjs` for that.

## Invocation pattern

Run the script from the **project working directory**, not from the skill directory.

Use an absolute path to the script itself:

```bash
node "/absolute/path/to/app-design-development-with-stitch/scripts/analyze-screen.mjs" \
  docs/design/visual/reference-calendar-mobile.png \
  docs/design/SCREEN_SPEC.md \
  docs/design/SCREEN-analysis.md \
  --context docs/design/DESIGN_SYSTEM.md \
  --context docs/design/DESIGN_TOKENS.md
```

Why this pattern:
- relative paths in arguments should resolve against the project
- output files should land in the project, not inside the skill folder
- avoid `cd` into the skill directory before running the script

## Arguments

```text
node analyze-screen.mjs <screenshot.png> <spec-text-or-file> [output.md] [--context <file> ...]
```

- `<screenshot.png>`: path to the screenshot to analyze
- `<spec-text-or-file>`: either inline text or a path to a spec file
- `[output.md]`: optional output path, default `docs/design/SCREEN-analysis.md`
- `--context <file>`: optional supporting design docs; may be repeated

## Recommended context files

When available, pass supporting context such as:
- `docs/design/DESIGN_SYSTEM.md`
- `docs/design/DESIGN_TOKENS.md`
- `docs/design/APP_SHELL.md`
- `docs/design/SHARED_COMPONENTS.md`
- `docs/design/SCREEN_CONTRACTS.md`

## Output

The script:
- writes a Markdown report to the output path
- prints a short stdout summary like:

```text
blocking=1 major=2 minor=4 status=warning_or_ok
```

## Notes

- The script reuses `OLLAMA_URL`, `OLLAMA_VISION_MODEL`, `MIN_REFERENCE_WIDTH_BLOCK`, and `MIN_REFERENCE_WIDTH_WARN`.
- Keep the current working directory in the project so relative input/output paths behave correctly.
