# [Phase 5] Normalize scenario/workflow schema for automation readiness

GitHub Issue: `#9`  
Status: `Open`

## Goal
Create a canonical scenario/workflow schema that is portable and stable enough for export and future automation.

## Why
Automation readiness depends on clean template definitions that are separate from session state and UI-specific shortcuts.

## Scope
- Define canonical schema for scenarios, workflows, steps, tools, prompts, context, outputs, and reviews
- Separate template definitions from runtime session data
- Align current seeded records with the canonical schema

## Out of Scope
- Running automations
- Backend APIs
- Import/export UI
- External runtime integration

## Acceptance Criteria
- [ ] Canonical schema is documented and implemented in the frontend model
- [ ] Session data is clearly separated from template definitions
- [ ] Existing seeded records map without loss into the canonical structure
- [ ] Build/lint passes where relevant

## User / Output Value
The system can evolve safely toward export and automation without breaking the manual execution experience.

## Related Docs
- /docs/DATA_MODEL.md
- /docs/SYSTEM_SCHEMA.md
- /docs/ROADMAP.md
