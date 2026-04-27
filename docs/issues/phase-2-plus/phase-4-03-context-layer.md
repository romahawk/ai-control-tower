# [Phase 4] Add context layer for workflows and steps

GitHub Issue: `#19`  
Status: `Open`

## Goal
Turn context from a placeholder screen into a real layer attached to workflows and steps.

## Why
Execution quality depends on having the right notes, links, docs, and files visible at the moment of action.

## Scope
- Add context entity to the data model and UI
- Support note, link, file, and doc types
- Attach context to a workflow or a specific step
- Surface context inside run mode

## Out of Scope
- File upload backend
- Full knowledge base features
- Search index
- Collaboration

## Acceptance Criteria
- [ ] User can attach context to a workflow or step
- [ ] Run mode can show context for the current step
- [ ] Context supports at least note and link types initially
- [ ] Build/lint passes where relevant

## User / Output Value
User can keep relevant reference material attached to the execution step instead of searching external notes.

## Related Docs
- /docs/DATA_MODEL.md
- /docs/ARCHITECTURE.md
- /docs/SYSTEM_SCHEMA.md
