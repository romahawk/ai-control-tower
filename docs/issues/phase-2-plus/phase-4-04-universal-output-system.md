# [Phase 4] Add universal output system across scenarios

GitHub Issue: `#20`  
Status: `Open`

## Goal
Replace income-specific output assumptions with a universal output system that works across scenarios.

## Why
The product is no longer only an income engine system, so outputs must support admin, health, family, strategy, and custom workflows too.

## Scope
- Normalize output language and UI away from income-only assumptions
- Add output typing that supports many scenario domains
- Update dashboard and workflow summaries to use universal output terms

## Out of Scope
- Advanced analytics
- Public publishing
- Backend reporting
- Review system logic itself

## Acceptance Criteria
- [ ] Output model works across all seeded scenario categories
- [ ] UI copy no longer assumes income-only outputs
- [ ] Workflows can define outputs in generic terms
- [ ] Build/lint passes where relevant

## User / Output Value
User can capture value from any life domain, not just work or revenue workflows.

## Related Docs
- /docs/PRD.md
- /docs/DATA_MODEL.md
- /docs/WORKFLOWS.md
