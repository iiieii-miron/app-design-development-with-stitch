# Runtime compatibility and operating modes

## Goal

Keep the workflow strict while allowing different coding runtimes and model stacks.

The core contract does not change:
- approved Stitch designs remain the source of truth
- implementation follows extracted artifacts, not memory or vibes
- human approval gates remain explicit
- visual verification remains mandatory before UI work is considered done

## Supported operating pattern

This skill is designed for the common pattern:
1. a primary coding agent/model performs planning and implementation
2. browser automation captures implementation screenshots
3. a separate visual-review model compares reference vs implementation

This is especially useful when the primary coding model is text-only or weak at image analysis.

## Runtime-neutral principle

The coding runtime may be Claude Code, OpenCode, OpenClaw, Codex, or another agent environment.

Treat runtime choice as an adapter layer, not as a reason to change the workflow contract.

## Preferred setup

- Design source: Stitch / Stitch Kit
- Coding runtime: any capable implementation agent
- Screenshot capture: Playwright
- Visual review: Ollama + `qwen3-vl:30b`

## Acceptable substitutions

### Coding runtime

You may substitute the coding runtime freely if it can:
- read the workflow artifacts
- edit code reliably
- run project commands/tests
- capture screenshots directly or invoke helper tooling

### Coding model

You may substitute the primary coding model freely. The skill does not depend on the coding model being multimodal.

### Visual review model

Preferred path:
- `qwen3-vl:30b` via Ollama using the bundled script

Acceptable fallback path:
- another user-approved local or remote VLM with similar capability

Last resort:
- structured manual review using the same severity system

Do not silently switch visual-review models.

## What must not change when tools change

Do not relax these requirements when swapping runtimes, models, or tools:
- no implementation from memory when approved artifacts exist
- no skipping approval gates for non-trivial work
- no claiming visual fidelity without screenshots and review
- no replacing card-based/mobile patterns with easier generic layouts
- no silent reduction in QA rigor because one preferred tool is unavailable

## Recommended mode selection

- Use **light** for one-screen prototypes, narrow feature work, or small internal tools.
- Use **standard** by default for most feature work and small-to-medium app projects.
- Use **strict** for large redesigns, production-critical UI, shared handoff-heavy work, or when accessibility/responsiveness/state coverage must be explicit and auditable.

## Common pitfalls

- Treating a runtime swap as permission to simplify the workflow
- Letting a text-only coding model improvise structure from screenshots
- Replacing proper visual review with vague human eyeballing too early
- Switching VLMs without documenting the fallback
- Using project-local helper scripts that diverge from the skill versions
