# [Phase 4] Add scenario switching and scenario-based filtering

GitHub Issue: `#18`  
Status: `Open`

## Goal
Allow users to switch scenarios and filter workflows, prompts, tools, outputs, and reviews accordingly.

## Why
Scenario support is incomplete unless the user can narrow attention to the current life domain.

## Scope
- Add scenario switching controls
- Add scenario-based filtering in workflow, prompt, and tool views
- Update dashboard summaries to respect active scenario

## Out of Scope
- Multi-select cross-scenario analytics
- Persistence
- Review aggregation logic
- Backend query layer

## Acceptance Criteria
- [ ] User can switch active scenario from the app
- [ ] Workflow, prompt, and tool views filter by active scenario
- [ ] Dashboard reflects the selected scenario
- [ ] Build/lint passes where relevant

## User / Output Value
User can reduce noise and focus only on the workflows relevant to the current scenario.

## Related Docs
- /docs/ROADMAP.md
- /docs/ARCHITECTURE.md
- /docs/PRD.md
