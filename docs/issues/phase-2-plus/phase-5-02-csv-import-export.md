# [Phase 5] Add CSV import/export for scenarios, workflows, outputs, and context

GitHub Issue: `#10`  
Status: `Open`

## Goal
Allow lightweight import/export of scenario-system records before any backend exists.

## Why
Portable data reduces lock-in, supports backup, and makes the system easier to audit or process externally.

## Scope
- Export supported records to CSV
- Import supported CSV back into the local system
- Validate headers and handle invalid data safely

## Out of Scope
- Cloud sync
- Binary asset transfer
- Database migration tooling
- External sheet sync

## Acceptance Criteria
- [ ] User can export supported records to CSV
- [ ] User can import valid CSV safely
- [ ] Invalid CSV is rejected with a clear error
- [ ] Build/lint passes where relevant

## User / Output Value
User can back up and move scenario-system data without waiting for a backend.

## Related Docs
- /docs/ROADMAP.md
- /docs/DATA_MODEL.md
- /docs/SYSTEM_SCHEMA.md
