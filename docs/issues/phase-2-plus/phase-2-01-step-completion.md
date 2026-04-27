# [Phase 2] Add step completion state to workflow sessions

GitHub Issue: `#1`  
Status: `Open`

## Goal
Add explicit completion state for steps inside an active workflow session.

## Why
Run mode exists, but users still cannot mark what is done. That keeps execution fragile and increases re-orientation cost.

## Scope
- Add step states such as not started, in progress, complete, and skipped
- Show progress summary inside the session UI
- Update run mode navigation to reflect completed steps

## Out of Scope
- Persistence
- Output logging
- Review system
- Team activity

## Acceptance Criteria
- [ ] User can mark a step as complete, skipped, or in progress
- [ ] Session UI shows visible progress across all steps
- [ ] Completed state is reflected in the step navigator
- [ ] Build/lint passes where relevant

## User / Output Value
User can see exactly what has been finished and what remains inside the current workflow session.

## Related Docs
- /docs/ROADMAP.md
- /docs/ARCHITECTURE.md
- /docs/DATA_MODEL.md
