# Phase 2+ Issue Backlog

## Current Status
- Phase 1: Done
- Phase 2: Partial
- Phase 3: Not started
- Phase 4: Not started
- Phase 5: Not started
- Phase 6: Not started

## Audit Summary
- Done: static dashboard, workflow library, prompt library, tool registry, active workflow run mode, prompt copy, external tool launch
- Partial: execution layer exists, but step completion, outputs, session summary, and real review are missing
- Missing: persistence, editability, scenario layer, context layer, universal outputs, automation exports, productization

## Implementation Order
1. Finish remaining Phase 2 execution work
2. Add persistence and editability
3. Expand from income-engine framing to full scenario model
4. Add context, outputs, and review across scenarios
5. Prepare automation-ready schema and exports
6. Move into productization

## Recommended Next Sprint
1. `phase-2-01-step-completion.md`
2. `phase-2-02-universal-output-logging.md`
3. `phase-2-03-session-blocker-notes.md`
4. `phase-2-04-session-summary-view.md`
5. `phase-3-01-local-persistence.md`

## Issue Index
| Status | File | GitHub |
| --- | --- | --- |
| Done | `phase-2-00-active-workflow-run-mode.md` | `#16` |
| Open | `phase-2-01-step-completion.md` | `#1` |
| Open | `phase-2-02-universal-output-logging.md` | `#2` |
| Open | `phase-2-03-session-blocker-notes.md` | `#3` |
| Open | `phase-2-04-session-summary-view.md` | `#4` |
| Open | `phase-3-01-local-persistence.md` | `#5` |
| Open | `phase-3-02-editable-prompts.md` | `#6` |
| Open | `phase-3-03-editable-workflow-variants.md` | `#7` |
| Open | `phase-3-04-custom-tools.md` | `#8` |
| Open | `phase-4-01-scenario-dashboard.md` | `#17` |
| Open | `phase-4-02-scenario-switching-filtering.md` | `#18` |
| Open | `phase-4-03-context-layer.md` | `#19` |
| Open | `phase-4-04-universal-output-system.md` | `#20` |
| Open | `phase-4-05-scenario-review-system.md` | `#21` |
| Open | `phase-5-01-canonical-schema.md` | `#9` |
| Open | `phase-5-02-csv-import-export.md` | `#10` |
| Open | `phase-5-03-openclaw-export.md` | `#11` |
| Open | `phase-6-01-workspace-boundaries.md` | `#12` |
| Open | `phase-6-02-template-packs.md` | `#13` |
| Open | `phase-6-03-public-demo-mode.md` | `#14` |
| Open | `phase-6-04-proof-assets.md` | `#15` |

## Dependencies
- `phase-2-00` must be done before the rest of Phase 2
- `phase-2-01` and `phase-2-02` should land before `phase-2-04`
- `phase-3-01` should land before most editability work
- `phase-4-01` should land before `phase-4-02`, `phase-4-04`, and `phase-4-05`
- `phase-5-01` should land before `phase-5-02` and `phase-5-03`
