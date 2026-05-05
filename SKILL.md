---
name: app-design-development-with-stitch
description: Superpowers-style app development workflow with Stitch/Stitch Kit design gates and bundled qwen3-vl visual verification helpers. Use for building or redesigning web/mobile app UIs where implementation must match approved Stitch designs.
---

# App Design Development with Stitch

This skill combines Superpowers-style engineering, Stitch/Stitch Kit design generation, explicit human approval gates, and bundled helper scripts for Playwright screenshots plus local visual review through Ollama.

Keep the core contract strict even when tools vary:
- use approved Stitch designs as the implementation contract
- implement from extracted design artifacts, not memory or vibes
- preserve explicit human approval gates
- require visual verification before declaring UI work complete

This workflow is runtime-neutral. It works whether the coding agent runs in Claude Code, OpenCode, OpenClaw, Codex, or another environment. The common pattern is a text-only coding model paired with browser automation for screenshots and a separate visual model for image comparison.

## Workflow modes

Choose the lightest mode that still preserves the contract.

- **light** — Use for small prototypes, one-screen tools, or narrow feature work.
- **standard** — Default for most app features and small-to-medium projects.
- **strict** — Use for larger redesigns, production-critical UI, multi-screen products, handoff-heavy collaboration, or when accessibility/responsive/state coverage must be formally tracked.

If the user does not choose, use `standard` by default. Do not weaken approval gates or visual QA in any mode.

For detailed mode guidance and artifact expectations, read:
- `references/runtime-compatibility.md`
- `references/workflow-artifacts.md`

## Architecture rule

This skill and its helper scripts are workflow tooling, not project application code.

Do not copy bundled helper scripts into the target project unless the user explicitly asks. Run them from the skill directory instead. The project should contain only product/design artifacts, screenshots, reports, tests, and application code.

This skill expects bundled analysis helpers next to `SKILL.md`:

```text
<skill-directory>/scripts/visual-review.mjs
<skill-directory>/scripts/analyze-screen.mjs
```

Resolve the skill directory explicitly before running helper scripts. Prefer a variable such as `SKILL_DIR` over hard-coded install assumptions.

Possible locations include:
- `~/.claude/skills/app-design-development-with-stitch/`
- `.claude/skills/app-design-development-with-stitch/`
- an OpenClaw local-skills directory
- a plugin-managed skill directory
- a checked-out repository copy of this skill

Preferred pattern:

```bash
SKILL_DIR=/absolute/path/to/app-design-development-with-stitch
node "$SKILL_DIR/scripts/analyze-screen.mjs" ...
node "$SKILL_DIR/scripts/visual-review.mjs" ...
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

Visual verification is mandatory. The task is not complete until reference screenshots are valid, implementation screenshots are captured at the same viewport, a visual review report exists, and the user explicitly accepts the visual state. Do not treat the agent's own judgment as final approval.

Do not directly inspect reference or implementation images with the main coding model. Do not use `read` on PNG/JPG/WebP files as a substitute for the visual-review path. If visual verification cannot proceed, repair the reference/review pipeline instead of attempting manual image comparison with the main coding model.

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
    ACCESSIBILITY_CHECKLIST.md
    RESPONSIVE_CONTRACT.md
    INTERACTION_STATES.md
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

For detailed artifact guidance by mode, read `references/workflow-artifacts.md`.

Do not add workflow helper scripts to the project by default.

## Bundled helper scripts

Use the bundled analysis helpers from the skill directory:

```bash
SKILL_DIR=/absolute/path/to/app-design-development-with-stitch
node "$SKILL_DIR/scripts/analyze-screen.mjs" \
  docs/design/visual/reference-calendar-mobile.png \
  docs/design/SCREEN_SPEC.md \
  docs/design/SCREEN-analysis.md \
  --context docs/design/DESIGN_SYSTEM.md \
  --context docs/design/DESIGN_TOKENS.md
```

```bash
SKILL_DIR=/absolute/path/to/app-design-development-with-stitch
node "$SKILL_DIR/scripts/visual-review.mjs" \
  docs/design/visual/reference-calendar-mobile.png \
  docs/design/visual/implementation-calendar-mobile.png \
  docs/design/visual/calendar-gap-report.md
```

Do not assume project-local `scripts/visual-review.mjs` or `scripts/analyze-screen.mjs` exists.

## Phase 0 — Workflow activation

When this skill activates, briefly state that Superpowers is the engineering workflow and Stitch/Stitch Kit handles design stages. Mention the selected workflow mode (`light`, `standard`, or `strict`) when relevant. The flow is: product brief, design-system variants, design-system approval, app shell/shared components approval, full screen set generation, screen approval, handoff extraction, component-based implementation, Playwright screenshots, visual verification, and the fix loop. Do not write production UI code in this phase.

## Phase 1 — Product discovery

Use normal Superpowers discovery. Clarify or infer target users, primary journeys, core entities, required screens, target platforms/viewports, stack/constraints, non-goals, and acceptance criteria. Create `docs/product/PRODUCT_BRIEF.md`. For non-trivial applications, ask the user to approve the brief before design generation.

## Phase 2 — Design-system exploration gate

Do not generate all screens immediately. First choose one representative key screen: dashboard, home screen, primary workflow screen, or most complex page. Generate 2–3 Stitch variants for this single screen using Stitch Kit skills/tools where available: `stitch-orchestrator`, `stitch-ideate`, `stitch-ui-design-spec-generator`, `stitch-ui-prompt-architect`, `stitch-mcp-generate-screen-from-text`.

Each variant must explore visual style, palette, typography, spacing density, cards, buttons, inputs, navigation tone, and mobile/desktop treatment. Save `docs/design/DESIGN_SPEC.md` and `docs/design/stitch/style-reference/variants.md`. Ask the user to choose or combine variants. Do not proceed until the user approves a design-system direction.

## Phase 3 — Design-system extraction

After approval, extract `docs/design/DESIGN_SYSTEM.md` and `docs/design/DESIGN_TOKENS.md`. Cover visual direction, color palette, typography scale, spacing scale, radius scale, shadows/elevation, icon style, image/media style, button styles, input styles, card styles, accessibility notes, and do/don't examples. `DESIGN_TOKENS.md` must contain concrete values where possible. From this point onward, all Stitch prompts and implementation code must reference the approved design system.

For `standard` and `strict` modes, also begin `docs/design/ACCESSIBILITY_CHECKLIST.md` and `docs/design/RESPONSIVE_CONTRACT.md` here so accessibility and responsive behavior are designed intentionally instead of patched later.

## Phase 4 — App shell and shared components approval gate

Before generating all screens, define and approve shared UI: app shell, header/topbar, bottom nav or side nav, footer if applicable, page background, main content container, shared cards, buttons, inputs, empty states, loading states, and any important interaction states. Create `docs/design/APP_SHELL.md`, `docs/design/SHARED_COMPONENTS.md`, `docs/design/INTERACTION_STATES.md`, and `docs/design/stitch/app-shell/README.md`. Ask the user to approve the app shell and shared components.

If Stitch supports reusable components/templates, use them. If not, emulate templates process-wise by creating an approved app-shell reference, storing shell screenshot/HTML/details, including shell requirements in every subsequent screen prompt, and auditing consistency after generation.

## Phase 5 — Full screen set generation

Generate the full set only after product brief, design system, and app shell/shared components are approved. Every screen prompt must reference `DESIGN_SYSTEM.md`, `APP_SHELL.md`, and `SHARED_COMPONENTS.md`, preserve shared navigation/header/footer, and vary only page-specific content. Save metadata in `docs/design/stitch/screens.md`.

After generating screens, run a consistency audit and create/update `docs/design/SCREEN_CONTRACTS.md`. Check same nav labels, shell geometry, header/topbar positioning, component styles, token usage, viewport assumptions, responsive behavior assumptions, interaction-state coverage, and no accidental style drift. Ask the user to approve the screen set. Do not implement UI before screen approval.

## Phase 6 — Stitch timeout policy

If a Stitch generation tool times out, do not immediately retry. Treat generation status as unknown. List/inspect recent Stitch screens/projects. Check whether the requested screen was created. If it exists, continue. If it does not, retry at most once. Never create duplicate screens for the same prompt.

## Phase 7 — Design handoff extraction

After screen approval, extract a formal handoff. Use Stitch Kit skills where available: `stitch-design-md`, `stitch-design-system`, `stitch-loop`, `stitch-react-components`, `stitch-nextjs-components`, `stitch-html-components`. For each approved screen, retrieve Stitch screen details, screenshot/preview if available, and HTML/code artifact if available. Save original artifacts under `docs/design/stitch/screens/`.

When Stitch returns a `screenshot.downloadUrl`, do not blindly download the default URL because it may resolve to a low-resolution thumbnail. Use the screen `width` field from the same response and request the full-width image as:

```text
${screenshot.downloadUrl}=w${width}
```

Use that higher-resolution image as the reference candidate before deciding whether a reference is too small.

Create `docs/design/DESIGN_HANDOFF.md` and `docs/design/COMPONENT_MAP.md`. `COMPONENT_MAP.md` should map design elements to implementation components and list what must be preserved. If extracted Stitch HTML/tokens exist, start from them when practical. If they cannot be used literally, document why and explain how the implementation still preserves the approved behavior, layout, tokens, and interaction contract.

Before implementation exists, you may analyze a Stitch screen directly against its textual spec using `analyze-screen.mjs`. Provide the primary screen spec as inline text or file, and optionally pass supporting context such as `docs/design/DESIGN_SYSTEM.md`, `docs/design/DESIGN_TOKENS.md`, `docs/design/APP_SHELL.md`, or `docs/design/SHARED_COMPONENTS.md` via repeated `--context` flags.

## Phase 8 — Implementation planning

Use Superpowers planning. Create `docs/plans/IMPLEMENTATION_PLAN.md`. The plan must be component-first: design tokens, app shell, shared components, page components, routes/state/data, tests, accessibility checks, responsive checks, interaction-state coverage, and visual verification plan. Implement design tokens first, then app shell/shared components, visually verify shell/shared components, then implement screens inside the shell. If a design element is hard to implement, stop and ask before changing it.

## Phase 9 — Implementation

Implement from approved artifacts in this priority order: extracted Stitch HTML/code artifacts, `DESIGN_HANDOFF.md`, `COMPONENT_MAP.md`, `DESIGN_SYSTEM.md`, `DESIGN_TOKENS.md`, user-approved notes. Do not implement from memory, a loose verbal summary, or screenshots as the only source. Do not replace layout with a simpler generic layout. Do not claim match without visual review.

During implementation, preserve accessibility, responsive structure, and interaction states as first-class requirements, not polish tasks.

`docs/design/*` guides implementation intent, but it is not permission to dismiss a clear visual mismatch found in approved references or visual review. Do not silently downgrade or dismiss BLOCKING/MAJOR findings based only on your own interpretation of design documents. If you believe a finding is invalid, cite the exact artifact and ask the user to approve the dismissal.

## Phase 10 — Screenshot capture

Capture implementation screenshots with the most direct project-native method available: Playwright in the target project, an existing screenshot/test command, or browser tooling that can render the implementation at the required viewport. Do not depend on a bundled capture helper script as the primary workflow.

Target viewports: mobile 390x844, desktop 1440x900, tablet 768x1024 if relevant. Reference screenshots must be valid quality: mobile 390px wide is preferred, not a universal hard cutoff; desktop should ideally match the target viewport width. If a Stitch-provided image is clearly too small or unreadable, do not use it as reference. Treat that as a blocked verification state, not as permission to weaken the review path. Borderline references may still be used for structural comparison with an explicit warning and reduced confidence for fine-grained spacing/typography claims. Recapture/export at higher resolution, open Stitch/HTML reference in browser and screenshot the target frame, or ask the user for a higher-resolution export.

## Phase 11 — Visual verification through Ollama or an equivalent visual-review path

For visual verification, do not rely on the main coding model to inspect images. Do not treat a blocked or failed visual-review run as permission to read the screenshots directly with the main coding model. Use bundled visual review script by default:

```bash
SKILL_DIR=/absolute/path/to/app-design-development-with-stitch
node "$SKILL_DIR/scripts/visual-review.mjs" \
  docs/design/visual/reference-calendar-mobile.png \
  docs/design/visual/implementation-calendar-mobile.png \
  docs/design/visual/calendar-gap-report.md
```

The script validates reference dimensions, calls Ollama at `http://localhost:11434/api/chat`, uses `qwen3-vl:30b` by default, sends both images as base64, and writes Markdown.

For the full fallback ladder, severity model, and review rules, read `references/visual-review-policy.md`.

## Phase 12 — Fix loop

After each implementation round: capture implementation screenshot, run visual review, read the gap report, fix BLOCKING issues first, then MAJOR issues, repeat until the user explicitly accepts the visual result. Do not waste time on minor colors/polish while structural gaps remain. If the visual review report says everything is minor but the screenshot visibly shows structural mismatch, treat this as failed visual review and escalate to the user.

Do not exit the visual-review loop on your own just because you believe the result is now good enough. The loop ends only when:
1. the latest report has no remaining BLOCKING issues and no unaccepted MAJOR issues, and
2. the user explicitly approves the visual state or explicitly accepts the remaining deviations.

When the user asks to address a specific review finding, do not re-litigate the entire report by default. Treat the finding as actionable, modify the implementation toward the approved reference, rerun visual review, and report what changed.

## Phase 13 — Functional tests

Use normal Superpowers test discipline: unit tests where appropriate, component tests, integration tests, and Playwright/e2e tests for critical flows. Functional tests do not replace visual verification.

For `standard` and `strict` modes, include checks for keyboard navigation, visible focus, critical responsive breakpoints, and important interaction states in the test and review plan.

## Phase 14 — Human implementation review gate

Before finalizing, show implemented screens, screenshots, test results, visual gap reports, known deviations, and unresolved issues. Ask for review whenever visible deviations remain or when the latest visual-review pass still contains any findings the user has not explicitly accepted.

## Phase 15 — Completion criteria

Only mark complete when the artifacts required by the chosen workflow mode exist, design system was approved when applicable, app shell/shared components were approved when applicable, full screen set was approved when applicable, handoff and component map exist when applicable, implementation references approved artifacts, tests pass, screenshots exist, visual reports exist, no BLOCKING gaps remain, no unaccepted MAJOR gaps remain, and the user has explicitly approved the current visual state or explicitly accepted the remaining deviations.

For `standard` and `strict` modes, completion also requires explicit accessibility, responsive, and interaction-state review coverage.

Final response must include screens implemented, tests run, visual verification status, remaining accepted deviations, user approval status, and files changed.

## If tools are missing

If a Stitch/Stitch Kit tool is unavailable, state exactly which tool is unavailable, use the closest available alternative, do not pretend the artifact was retrieved, and ask whether to continue manually. If TaskList is unavailable, create markdown plans with checkboxes in the repository, for example `docs/plans/<task-name>.md`.

Before starting a substantial run, check the environment with the bundled helper when practical:

```bash
SKILL_DIR=/absolute/path/to/app-design-development-with-stitch
node "$SKILL_DIR/scripts/check-env.mjs" "$SKILL_DIR"
```

Treat warnings as operational risks to manage, not automatic blockers. Treat failed checks as blockers unless the user explicitly accepts a fallback path.

Keep the workflow strict. If tools change, adapt the adapter layer, not the design contract.
