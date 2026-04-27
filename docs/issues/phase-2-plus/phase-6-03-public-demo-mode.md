# [Phase 6] Build public demo mode with seeded scenario showcase data

GitHub Issue: `#14`  
Status: `Open`

## Goal
Create a public demo mode that shows the value of the scenario-based control tower without setup.

## Why
The product needs a clean way to communicate the flow from scenario to output without asking the user to configure anything first.

## Scope
- Add demo mode entry path
- Seed demo scenarios, workflows, prompts, tools, and outputs
- Keep demo state isolated from normal user state

## Out of Scope
- Authenticated trial accounts
- Multi-user demo workspaces
- Marketing site rebuild
- Backend demo storage

## Acceptance Criteria
- [ ] User can enter demo mode without setup
- [ ] Demo clearly shows scenario -> workflow -> execution -> output flow
- [ ] Demo state is isolated and resettable
- [ ] Build/lint passes where relevant

## User / Output Value
New users can understand the product quickly and see its execution value without configuration friction.

## Related Docs
- /docs/PRD.md
- /docs/ROADMAP.md
- /docs/SYSTEM_SCHEMA.md
