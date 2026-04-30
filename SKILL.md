---
name: app-design-development-with-stitch
description: Superpowers-style app development workflow with Stitch/Stitch Kit design gates and bundled qwen3-vl visual verification helpers. Use for building or redesigning web/mobile app UIs where implementation must match approved Stitch designs.
---

# App Design Development with Stitch

This skill combines Superpowers-style engineering, Stitch/Stitch Kit design generation, explicit human approval gates, and bundled helper scripts for Playwright screenshots plus local qwen3-vl visual review through Ollama.

## Architecture rule

This skill and its helper scripts are workflow tooling, not project application code.

Do not copy bundled helper scripts into the target project unless the user explicitly asks. Use helper scripts from this skill directory. The project should contain only product/design artifacts, screenshots, reports, tests, and application code.

Claude Code skills may contain helper files next to `SKILL.md`. This skill expects:

```text
<skill-directory>/scripts/visual-review.mjs
<skill-directory>/scripts/capture-screenshot.mjs
```

If you cannot locate the skill directory or bundled scripts, stop and ask the user instead of creating project-local workflow scripts.

## Core principles

Superpowers remains the main workflow for discovery, brainstorming, planning, worktrees, incremental implementation, tests, reviews, and completion discipline. Stitch/Stitch Kit is inserted at design-specific stages.

Approved Stitch designs are a contract. Do not implement UI from memory, vibes, screenshots alone, or your own imagination.

Forbidden substitutions:
- approved mobile card/feed implemented as table/grid
- approved bottom navigation omitted or replaced
- approved app shell ignored
- approved cards replaced by browser-default controls
- approved mobile-first screen implemented as desktop-first page

Visual verification is mandatory. The task is not complete until reference screenshots are valid resolution, implementation screenshots are captured at the same viewport, qwen3-vl visual review report exists, and all BLOCKING plus unaccepted MAJOR visual gaps are fixed.

Screenshot comparison is QA, not the primary implementation method. The primary path is:

```text
Stitch design -> extracted handoff/tokens/HTML/structure -> implementation from those artifacts -> screenshot visual QA
```

## Required project artifacts

Use this structure unless the project has a better convention:

```text
docs/
  product/
    PRODUCT_BRIEF.md
  design/
    DESIGN_SPEC.md
    DESIGN_SYSTEM.md
    DESIGN_TOKENS.md
    APP_SHELL.md
    SHARED_COMPONENTS.md
    SCREEN_CONTRACTS.md
    COMPONENT_MAP.md
    DESIGN_HANDOFF.md
    VISUAL_GAP_REPORT.md
    stitch/
      screens.md
      style-reference/
      app-shell/
      screens/
    visual/
      reference-*.png
      implementation-*.png
      diff-*.png
      *-gap-report.md
  plans/
    IMPLEMENTATION_PLAN.md
```

Do not add workflow helper scripts to the project by default.

## Bundled helper scripts

Use the bundled helper scripts from the skill directory:

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

If installed elsewhere, locate the skill before running scripts. Possible locations: `~/.claude/skills/app-design-development-with-stitch/`, `.claude/skills/app-design-development-with-stitch/`, or a plugin skill directory. Prefer explicit paths. Do not assume project-local `scripts/visual-review.mjs` exists.

## Phase 0 — Workflow activation

When this skill activates, briefly state that Superpowers is the engineering workflow and Stitch/Stitch Kit handles design stages. The flow is: product brief, design-system variants, design-system approval, app shell/shared components approval, full screen set generation, screen approval, handoff extraction, component-based implementation, Playwright screenshots, qwen3-vl visual verification using bundled skill scripts, and fix loop. Do not write production UI code in this phase.

## Phase 1 — Product discovery

Use normal Superpowers discovery. Clarify or infer target users, primary journeys, core entities, required screens, target platforms/viewports, stack/constraints, non-goals, and acceptance criteria. Create `docs/product/PRODUCT_BRIEF.md`. For non-trivial applications, ask the user to approve the brief before design generation.

## Phase 2 — Design-system exploration gate

Do not generate all screens immediately. First choose one representative key screen: dashboard, home screen, primary workflow screen, or most complex page. Generate 2–3 Stitch variants for this single screen using Stitch Kit skills/tools where available: `stitch-orchestrator`, `stitch-ideate`, `stitch-ui-design-spec-generator`, `stitch-ui-prompt-architect`, `stitch-mcp-generate-screen-from-text`.

Each variant must explore visual style, palette, typography, spacing density, cards/buttons/inputs, navigation tone, and mobile/desktop treatment. Save `docs/design/DESIGN_SPEC.md` and `docs/design/stitch/style-reference/variants.md`. Ask the user to choose or combine variants. Do not proceed until the user approves a design-system direction.

## Phase 3 — Design-system extraction

After approval, extract `docs/design/DESIGN_SYSTEM.md` and `docs/design/DESIGN_TOKENS.md`. Cover visual direction, color palette, typography scale, spacing scale, radius scale, shadows/elevation, icon style, image/media style, button styles, input styles, card styles, accessibility notes, and do/don't examples. `DESIGN_TOKENS.md` must contain concrete values where possible. From this point onward, all Stitch prompts and implementation code must reference the approved design system.

## Phase 4 — App shell and shared components approval gate

Before generating all screens, define and approve shared UI: app shell, header/topbar, bottom nav or side nav, footer if applicable, page background, main content container, shared cards, buttons, inputs, empty states, and loading states if important. Create `docs/design/APP_SHELL.md`, `docs/design/SHARED_COMPONENTS.md`, and `docs/design/stitch/app-shell/README.md`. Ask the user to approve the app shell and shared components.

If Stitch supports reusable components/templates, use them. If not, emulate templates process-wise by creating an approved app-shell reference, storing shell screenshot/HTML/details, including shell requirements in every subsequent screen prompt, and auditing consistency after generation.

## Phase 5 — Full screen set generation

Generate the full set only after product brief, design system, and app shell/shared components are approved. Every screen prompt must reference `DESIGN_SYSTEM.md`, `APP_SHELL.md`, and `SHARED_COMPONENTS.md`, preserve shared navigation/header/footer, and vary only page-specific content. Save metadata in `docs/design/stitch/screens.md`.

After generating screens, run a consistency audit and create/update `docs/design/SCREEN_CONTRACTS.md`. Check same nav labels, shell geometry, header/topbar positioning, component styles, token usage, viewport assumptions, and no accidental style drift. Ask the user to approve the screen set. Do not implement UI before screen approval.

## Phase 6 — Stitch timeout policy

If a Stitch generation tool times out, do not immediately retry. Treat generation status as unknown. List/inspect recent Stitch screens/projects. Check whether the requested screen was created. If it exists, continue. If it does not, retry at most once. Never create duplicate screens for the same prompt.

## Phase 7 — Design handoff extraction

After screen approval, extract a formal handoff. Use Stitch Kit skills where available: `stitch-design-md`, `stitch-design-system`, `stitch-loop`, `stitch-react-components`, `stitch-nextjs-components`, `stitch-html-components`. For each approved screen, retrieve Stitch screen details, screenshot/preview if available, and HTML/code artifact if available. Save original artifacts under `docs/design/stitch/screens/`.

Create `docs/design/DESIGN_HANDOFF.md` and `docs/design/COMPONENT_MAP.md`. `COMPONENT_MAP.md` should map design elements to implementation components and list what must be preserved. If extracted Stitch HTML/tokens exist, implementation must start from them or explicitly explain why they cannot be used.

## Phase 8 — Implementation planning

Use Superpowers planning. Create `docs/plans/IMPLEMENTATION_PLAN.md`. The plan must be component-first: design tokens, app shell, shared components, page components, routes/state/data, tests, visual verification plan. Implement design tokens first, then app shell/shared components, visually verify shell/shared components, then implement screens inside the shell. If a design element is hard to implement, stop and ask before changing it.

## Phase 9 — Implementation

Implement from approved artifacts in this priority order: extracted Stitch HTML/code artifacts, `DESIGN_HANDOFF.md`, `COMPONENT_MAP.md`, `DESIGN_SYSTEM.md`, `DESIGN_TOKENS.md`, user-approved notes. Do not implement from memory, a loose verbal summary, or screenshots as the only source. Do not replace layout with a simpler generic layout. Do not claim match without qwen3-vl visual review.

## Phase 10 — Screenshot capture

Use bundled Playwright helper script or an equivalent project command. Preferred:

```bash
node ~/.claude/skills/app-design-development-with-stitch/scripts/capture-screenshot.mjs \
  http://localhost:5173/calendar \
  docs/design/visual/implementation-calendar-mobile.png \
  390 844
```

Target viewports: mobile 390x844, desktop 1440x900, tablet 768x1024 if relevant. Reference screenshots must be valid quality: mobile at least 390px wide, preferred 780x1688; desktop at least target viewport width. If a Stitch-provided image is too small, do not use it as reference. Recapture/export at higher resolution, open Stitch/HTML reference in browser and screenshot the target frame, or ask the user for a higher-resolution export.

## Phase 11 — qwen3-vl visual verification through Ollama

For visual verification, do not ask Claude Code to directly inspect images. Use bundled visual review script:

```bash
node ~/.claude/skills/app-design-development-with-stitch/scripts/visual-review.mjs \
  docs/design/visual/reference-calendar-mobile.png \
  docs/design/visual/implementation-calendar-mobile.png \
  docs/design/visual/calendar-gap-report.md
```

The script validates reference dimensions, calls Ollama at `http://localhost:11434/api/chat`, uses `qwen3-vl:30b` by default, sends both images as base64, and writes Markdown. If `qwen3-vl:30b` is unavailable, stop and ask before using another model.

Severity values: BLOCKING, MAJOR, MINOR. Blocking examples: unstyled/browser-default UI, app shell missing, card/feed layout implemented as table/grid, missing navigation, missing bottom navigation when present in reference, missing primary content sections, wrong responsive structure, or reference image too small to verify. The task is not complete while BLOCKING gaps remain. MAJOR gaps must be fixed unless the user explicitly accepts them.

## Phase 12 — Fix loop

After each implementation round: capture implementation screenshot, run qwen3-vl visual review, read the gap report, fix BLOCKING issues first, then MAJOR issues, repeat until accepted. Do not waste time on minor colors/polish while structural gaps remain. If qwen3-vl report says everything is minor but screenshot visibly shows structural mismatch, treat this as failed visual review and escalate to the user.

## Phase 13 — Functional tests

Use normal Superpowers test discipline: unit tests where appropriate, component tests, integration tests, and Playwright/e2e tests for critical flows. Functional tests do not replace visual verification.

## Phase 14 — Human implementation review gate

Before finalizing, show implemented screens, screenshots, test results, qwen3-vl visual gap reports, known deviations, and unresolved MINOR issues. Ask for review if visible deviations remain.

## Phase 15 — Completion criteria

Only mark complete when product brief exists, design system was approved, app shell/shared components were approved, full screen set was approved, handoff and component map exist, implementation references approved artifacts, tests pass, screenshots exist, qwen3-vl visual reports exist, no BLOCKING gaps remain, and no unaccepted MAJOR gaps remain.

Final response must include screens implemented, tests run, visual verification status, remaining accepted deviations, and files changed.

## If tools are missing

If a Stitch/Stitch Kit tool is unavailable, state exactly which tool is unavailable, use the closest available alternative, do not pretend the artifact was retrieved, and ask whether to continue manually. If TaskList is unavailable, create markdown plans with checkboxes in the repository, e.g. `docs/plans/<task-name>.md`.
