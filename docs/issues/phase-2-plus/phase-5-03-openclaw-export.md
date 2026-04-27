# [Phase 5] Create OpenClaw-compatible export adapter

GitHub Issue: `#11`  
Status: `Open`

## Goal
Add an export adapter that maps internal workflow definitions into an OpenClaw-compatible format.

## Why
This creates a concrete path from manual execution system to automation-ready workflow definitions without automating in-product yet.

## Scope
- Map canonical schema to OpenClaw-compatible export
- Preserve step order, prompt references, tool references, and context references where supported
- Document unsupported structures clearly

## Out of Scope
- Running OpenClaw in-app
- Two-way sync
- Monitoring automation runs
- Backend execution infrastructure

## Acceptance Criteria
- [ ] Supported workflows export in an OpenClaw-compatible format
- [ ] Export preserves key workflow structure and references
- [ ] Unsupported cases are documented clearly
- [ ] Build/lint passes where relevant

## User / Output Value
User can take proven workflows and prepare them for external automation later.

## Related Docs
- /docs/ROADMAP.md
- /docs/DATA_MODEL.md
- /docs/SYSTEM_SCHEMA.md
