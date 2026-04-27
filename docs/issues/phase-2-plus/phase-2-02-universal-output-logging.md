# [Phase 2] Add universal output logging to workflow sessions

GitHub Issue: `#2`  
Status: `Open`

## Goal
Let users log outputs from any scenario while executing a workflow session.

## Why
The control tower only compounds value if execution turns into visible outputs, not just prompt copies and tool launches.

## Scope
- Add lightweight output capture to workflow sessions
- Support title, type, value, and optional note
- Link each output to scenario and workflow
- Show logged outputs in-session

## Out of Scope
- Persistence
- File uploads
- Rich text editors
- Analytics backend

## Acceptance Criteria
- [ ] User can create an output while running a workflow
- [ ] Output is linked to the current scenario and workflow
- [ ] Logged outputs are visible in the session without leaving the page
- [ ] Build/lint passes where relevant

## User / Output Value
User can keep the result of a workflow instead of losing it in external tools or notes.

## Related Docs
- /docs/PRD.md
- /docs/DATA_MODEL.md
- /docs/SYSTEM_SCHEMA.md
