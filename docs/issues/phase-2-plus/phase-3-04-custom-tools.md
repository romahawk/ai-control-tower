# [Phase 3] Add editable tool registry and custom tools

GitHub Issue: `#8`  
Status: `Open`

## Goal
Allow users to add and edit their own tools inside the registry.

## Why
Universal scenario support requires more than the seeded tool list. Users need to fit the system to their actual stack.

## Scope
- Add create/edit/delete for tool records
- Support tool role, best-for, avoid-when, and link metadata
- Link custom tools to workflows
- Persist custom tools locally

## Out of Scope
- API integrations
- Tool health monitoring
- Marketplace features
- Backend storage

## Acceptance Criteria
- [ ] User can add and edit a custom tool
- [ ] Custom tools can be linked to workflows
- [ ] Seeded tools remain unchanged
- [ ] Build/lint passes where relevant

## User / Output Value
User can align the registry with the tools they actually use.

## Related Docs
- /docs/ROADMAP.md
- /docs/DATA_MODEL.md
- /docs/ARCHITECTURE.md
