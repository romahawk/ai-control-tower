# [Phase 4] Add scenario layer and scenario dashboard

GitHub Issue: `#17`  
Status: `Open`

## Goal
Promote `Scenario` to a first-class entity and add a dedicated scenario dashboard.

## Why
The product direction has shifted from income-engine-only to universal scenario-based execution. The app needs that layer explicitly in the UI and data model.

## Scope
- Add scenario entity to the frontend model
- Add scenario dashboard view
- Show active workflow, next action, and recent outputs by scenario
- Seed core scenario categories

## Out of Scope
- Persistence
- Review system
- Custom scenario editing
- Backend data model

## Acceptance Criteria
- [ ] App has an explicit scenario layer in the UI
- [ ] User can see scenario-specific workflows and next actions
- [ ] Seeded scenarios include income, life strategy, family/home, admin, sport/health, and custom
- [ ] Build/lint passes where relevant

## User / Output Value
User can organize execution across multiple life domains instead of only income work.

## Related Docs
- /docs/PRD.md
- /docs/ARCHITECTURE.md
- /docs/SYSTEM_SCHEMA.md
