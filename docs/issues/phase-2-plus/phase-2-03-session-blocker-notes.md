# [Phase 2] Add blocker and resume notes to workflow sessions

GitHub Issue: `#3`  
Status: `Open`

## Goal
Let users mark a session as blocked and record the next action needed to resume.

## Why
Execution often stalls on missing information or external dependencies. Without a blocker note, the user loses momentum and context.

## Scope
- Add blocked state to workflow session
- Add short blocker note field
- Add short resume / next-action field
- Surface blocker state in the workflow session UI

## Out of Scope
- Notifications
- Collaboration
- Persistence
- Review dashboard

## Acceptance Criteria
- [ ] User can mark a session as blocked
- [ ] User can enter a blocker note and a resume action
- [ ] Blocked state is visible without leaving the workflow
- [ ] Build/lint passes where relevant

## User / Output Value
User can pause without losing context and restart execution quickly later.

## Related Docs
- /docs/ROADMAP.md
- /docs/PRD.md
- /docs/DATA_MODEL.md
