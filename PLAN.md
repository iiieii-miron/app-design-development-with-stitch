# Improvement Plan for `app-design-development-with-stitch`

## Context preserved
- Keep the core intent: design-driven implementation with strict approval gates and mandatory visual QA.
- Preserve the use case where the primary coding model is text-only and image understanding is delegated to Playwright + local VLM review.
- Add flexibility only where it improves portability and operational reliability without diluting the workflow contract.

## Prioritized backlog

### P0 — Highest priority
1. **Portability and runtime-neutral wording**
   - Reduce hard dependency on Claude Code phrasing in the workflow body.
   - Keep examples, but phrase the method as runtime-agnostic.
   - Clarify that the core workflow is independent from the coding agent and model.

2. **Skill directory / script path resolution**
   - Replace assumptions around `~/.claude/skills/...` with explicit `SKILL_DIR` guidance.
   - Keep examples for Claude-style installs, but make path resolution a first-class instruction.

3. **Visual verification fallback policy**
   - Preserve strictness: visual review remains mandatory.
   - Add an approved fallback ladder when the preferred VLM/model is unavailable.
   - Distinguish between preferred, acceptable fallback, and manual review modes.

4. **Complexity scaling / workflow modes**
   - Add `light`, `standard`, `strict` modes.
   - Preserve the full workflow as default for non-trivial app work while allowing leaner runs for small projects.

### P1 — Important
5. **Accessibility gate**
   - Add explicit accessibility acceptance requirements.
   - Cover focus states, keyboard navigation, semantics, contrast, touch target size.

6. **Responsive contract**
   - Add a dedicated responsive behavior artifact/ruleset.
   - Clarify blocking responsive mismatches.

7. **Interactive state coverage**
   - Require explicit states for forms, loading, empty, error, open overlays, selected/active states.

### P2 — Useful but secondary
8. **Richer install / compatibility documentation**
   - README improvements for environments, dependencies, and examples.

9. **Design artifact adaptation policy**
   - Clarify when extracted Stitch HTML/code/tokens may be adapted instead of used literally.

## Scope for this PR
Implement the highest-value changes first:
- P0.1 portability/runtime-neutral wording
- P0.2 script path resolution
- P0.3 visual verification fallback policy
- P0.4 workflow modes
- P1.5 accessibility gate
- P1.6/P1.7 lightweight additions for responsive + state coverage where they fit cleanly

## Follow-up PR ideas
- Split large sections into `references/` files to reduce SKILL.md size.
- Add a small helper for environment checks (`scripts/check-env.mjs`).
- Package an OpenClaw-specific variant or adapter guidance.
