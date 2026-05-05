# visual-review.mjs usage

## Purpose

Use `visual-review.mjs` to compare an approved reference screenshot against an implementation screenshot.

This is for:
- validating implementation fidelity
- generating a gap report
- driving the fix loop after code changes

Do not use this script for spec-only design validation before implementation exists. Use `analyze-screen.mjs` for that.

## Invocation pattern

Run the script from the **project working directory**, not from the skill directory.

Use an absolute path to the script itself:

```bash
node "/absolute/path/to/app-design-development-with-stitch/scripts/visual-review.mjs" \
  docs/design/visual/reference-calendar-mobile.png \
  docs/design/visual/implementation-calendar-mobile.png \
  docs/design/visual/calendar-gap-report.md
```

Why this pattern:
- relative file arguments should resolve against the project
- output files should land in the project, not inside the skill folder
- avoid `cd` into the skill directory before running the script

## Arguments

```text
node visual-review.mjs <reference.png> <implementation.png> [output.md]
```

- `<reference.png>`: approved reference screenshot
- `<implementation.png>`: implementation screenshot
- `[output.md]`: optional output path, default `docs/design/VISUAL_GAP_REPORT.md`

## Output

The script writes a Markdown gap report. If the reference is too small, it writes a blocked report instead of proceeding with unreliable review.

## Notes

- The script reuses `OLLAMA_URL`, `OLLAMA_VISION_MODEL`, `MIN_REFERENCE_WIDTH_BLOCK`, and `MIN_REFERENCE_WIDTH_WARN`.
- Keep the current working directory in the project so relative input/output paths behave correctly.
