# [Phase 2] Build active workflow run mode

GitHub Issue: `#16`  
Status: `Done`

## Goal
Deliver a focused active workflow session that shows one current step at a time.

## Why
This reduces cognitive overload by turning the workflow library into a real execution surface.

## Scope
- Start workflow session
- Current-step focus
- Next / previous step navigation
- Jump to a specific step
- Keep prompt and tool actions visible in run mode

## Out of Scope
- Step completion state
- Output logging
- Persistence
- Review system

## Acceptance Criteria
- [x] User can start a workflow session from the workflow library
- [x] User can move to the next and previous step
- [x] User can jump to another step
- [x] Current-step prompt copy and tool launch remain visible

## User / Output Value
User can execute one workflow step at a time without juggling the full workflow list.

## Related Docs
- /docs/ROADMAP.md
- /docs/ARCHITECTURE.md
- /docs/PRD.md
