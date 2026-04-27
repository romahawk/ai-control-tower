# [Phase 3] Add editable workflows and custom workflow variants

GitHub Issue: `#7`  
Status: `Open`

## Goal
Allow users to create or duplicate workflows into their own editable variants.

## Why
The seeded workflows are useful, but real execution systems need adaptation by scenario and personal style.

## Scope
- Add duplicate workflow action
- Add edit flow for workflow metadata and steps
- Keep user variants separate from seeded templates
- Persist workflow variants locally

## Out of Scope
- Visual workflow builder
- Multi-user sharing
- Backend workflow storage
- Automation execution

## Acceptance Criteria
- [ ] User can duplicate a built-in workflow
- [ ] User can edit a duplicated workflow variant
- [ ] Seeded workflow definitions remain unchanged
- [ ] Build/lint passes where relevant

## User / Output Value
User can adapt the control tower to their own execution system without losing the default templates.

## Related Docs
- /docs/ROADMAP.md
- /docs/DATA_MODEL.md
- /docs/WORKFLOWS.md
