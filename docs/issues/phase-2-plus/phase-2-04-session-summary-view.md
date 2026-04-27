# [Phase 2] Add workflow session summary and wrap-up view

GitHub Issue: `#4`  
Status: `Open`

## Goal
Provide a short end-of-session summary that shows progress, outputs, blockers, and next steps.

## Why
Run mode exists, but there is no clean wrap-up point that converts activity into a usable summary for the next session.

## Scope
- Add session summary view at the end of a run or on demand
- Show completed steps, logged outputs, and blocker notes
- Surface the next recommended action

## Out of Scope
- Cross-scenario weekly review
- Persistence
- Analytics dashboards
- Team reporting

## Acceptance Criteria
- [ ] User can open a session summary without leaving the workflow flow
- [ ] Summary includes progress, outputs, and blockers
- [ ] Summary surfaces one clear next action
- [ ] Build/lint passes where relevant

## User / Output Value
User can close a session with a clear record of what happened and what to do next.

## Related Docs
- /docs/ROADMAP.md
- /docs/SYSTEM_SCHEMA.md
- /docs/ARCHITECTURE.md
