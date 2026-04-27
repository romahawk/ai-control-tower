# [Phase 3] Add editable prompt management

GitHub Issue: `#6`  
Status: `Open`

## Goal
Allow users to create, edit, duplicate, and save prompts without mutating built-in templates.

## Why
Users need to adapt prompts to their real workflows and scenarios while preserving a stable seeded base.

## Scope
- Add create/edit/duplicate/delete for prompts
- Separate built-in prompts from user prompts
- Link user prompts to scenarios, workflows, and tools
- Persist user prompt data locally

## Out of Scope
- Prompt sharing
- Prompt version history
- AI prompt generation
- Backend storage

## Acceptance Criteria
- [ ] User can create and edit a prompt
- [ ] Built-in prompts remain unchanged
- [ ] User prompts can link to a scenario, workflow, and tool
- [ ] Build/lint passes where relevant

## User / Output Value
User can tailor prompts to their own workflows instead of staying locked to seeded examples.

## Related Docs
- /docs/ROADMAP.md
- /docs/DATA_MODEL.md
- /docs/PRD.md
