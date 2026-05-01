# Artifact guidance by workflow mode

## Goal

Scale documentation effort to project size without weakening the design contract.

## Light mode

Use for small prototypes, one-screen tools, or narrow feature work.

Minimum expected artifacts:
- `docs/product/PRODUCT_BRIEF.md` or a short equivalent section in a project plan
- approved design reference for the relevant screen or flow
- short implementation plan
- implementation screenshots
- visual gap report

Recommended but optional in very small work:
- a short design-token note
- a short interaction-state note if forms or overlays exist

## Standard mode

Use by default for most feature work and small-to-medium projects.

Expected artifacts:
- `PRODUCT_BRIEF.md`
- `DESIGN_SPEC.md`
- `DESIGN_SYSTEM.md`
- `DESIGN_TOKENS.md`
- `APP_SHELL.md`
- `SHARED_COMPONENTS.md`
- `SCREEN_CONTRACTS.md`
- `COMPONENT_MAP.md`
- `DESIGN_HANDOFF.md`
- `ACCESSIBILITY_CHECKLIST.md`
- `RESPONSIVE_CONTRACT.md`
- `INTERACTION_STATES.md`
- implementation plan
- screenshots and gap reports

These files may be concise. The goal is explicit decisions, not paperwork theater.

## Strict mode

Use for larger redesigns, production-critical UI, or multi-screen products with heavier coordination needs.

Expected artifacts:
- full standard artifact set
- explicit breakpoint behavior per key screen
- explicit interaction-state coverage for important flows
- explicit accessibility acceptance notes
- explicit known-deviation tracking if any gaps are accepted

## Practical guidance

If the project already has a better documentation structure, map the same concepts into that structure instead of duplicating files mechanically.

Do not create verbose artifacts with no decision-making value. A short, precise file is better than a long ceremonial one.
