# [Phase 4] Add scenario-based review system

GitHub Issue: `#21`  
Status: `Open`

## Goal
Add a review layer that summarizes outputs, blockers, and next actions per scenario.

## Why
Without review, outputs do not reliably turn into better decisions or compounding execution.

## Scope
- Add review records to the frontend model
- Build scenario-based review view
- Show outputs, blockers, and next action summaries
- Support weekly review as the first review pattern

## Out of Scope
- Analytics backend
- Long-term charts
- Collaboration
- Notifications

## Acceptance Criteria
- [ ] User can open a review view for a scenario
- [ ] Review shows outputs, blockers, and next actions
- [ ] Weekly review is supported as the first implementation
- [ ] Build/lint passes where relevant

## User / Output Value
User can turn execution into feedback and better prioritization instead of only collecting activity.

## Related Docs
- /docs/ROADMAP.md
- /docs/SYSTEM_SCHEMA.md
- /docs/PRD.md
