# Visual review policy

## Goal

Preserve strict visual QA even when the main coding model cannot inspect images.

## Default path

Use the bundled `visual-review.mjs` script with Ollama and `qwen3-vl:30b`.

## Fallback ladder

1. Preferred: `qwen3-vl:30b` via Ollama
2. Acceptable fallback: another user-approved local or remote VLM with similar capability
3. Last resort: structured manual review using the same severity system

Do not silently switch models.

## Required documentation when using a fallback

When not using the preferred path, note in the gap report:
- what was unavailable
- what fallback was used
- any reduced confidence or caveats

## Severity system

- **BLOCKING** — structural or contract-breaking mismatch
- **MAJOR** — important visual or interaction gap that should be fixed before completion
- **MINOR** — polish-level issue that does not change the core contract

## Typical BLOCKING issues

- browser-default or obviously unstyled UI
- missing app shell
- missing or replaced navigation
- card/feed layout replaced with table/grid
- wrong responsive structure
- inaccessible keyboard/focus behavior on critical paths
- missing required interaction states
- reference screenshot too small to verify

## Invalid reference handling

If the reference screenshot is too small, too compressed, blurry, or otherwise not fit for comparison, visual verification is blocked until the reference is repaired.

Use a three-level interpretation instead of one hard global cutoff:
- **normal** — reference is comfortably readable for both structural and finer visual claims
- **warning** — reference is usable for structural review, but confidence is reduced for fine-grained spacing, typography, and polish claims
- **blocked** — reference is too small or degraded for reliable comparison

As a rule of thumb for mobile references:
- around **390px wide or higher** is preferred
- somewhat smaller images may still be usable with warning if the structure is clearly readable
- very small previews should be blocked

Acceptable remediation paths:
1. recapture a higher-resolution export from Stitch
2. open the approved Stitch/HTML reference in a browser and capture it at the correct viewport
3. ask the user for a valid replacement reference

A bad reference is not permission to lower verification standards.

## Forbidden fallback paths

- reading PNG/JPG/WebP files with the main coding model as a substitute for visual review
- manually comparing screenshots with the main coding model after the visual-review path is blocked or fails
- treating a blocked review as permission to improvise a weaker image-analysis path

## Review principles

- Treat screenshot comparison as QA, not the primary implementation source.
- Do not trust a VLM report blindly if the screenshot visibly disagrees.
- Fix structural gaps before polish.
- Functional tests do not replace visual review.
- Do not dismiss BLOCKING or MAJOR findings based only on your own reading of design documents.
- The agent does not have authority to declare visual review finished on its own; user approval is required.

## Conflict resolution

When `docs/design/*` and visual review appear to disagree:
1. treat the discrepancy as real by default
2. use design documents to guide the fix, not to erase the finding
3. if you believe the finding should be dismissed, cite the exact artifact and ask the user to approve that dismissal

## Fix-from-report mode

When the user asks to address a specific review finding:
1. treat that finding as actionable by default
2. do not re-litigate the whole report unless the user asks
3. modify implementation toward the approved reference
4. rerun visual review
5. continue the loop until the user explicitly accepts the result
