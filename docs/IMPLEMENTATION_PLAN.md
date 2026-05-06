# AI Control Tower Implementation Plan

This document explains how execution should be managed in GitHub without creating a bloated backlog of future implementation issues.

## Source of Truth

- GitHub Project is the source of truth for live execution state.
- Milestones map 1:1 to roadmap phases.
- Phase epic issues preserve the intent, scope, and acceptance criteria for each phase.
- Detailed issues represent implementation units for active work.
- `docs/ROADMAP.md` remains the durable memory of the full 12-phase strategy.

## Tracking All Phases Without Backlog Overload

Track all phases through the roadmap document, milestones, and epic issues, but only expand detailed implementation tickets when execution is near. This keeps the planning model complete while preventing a large speculative backlog from becoming stale.

Detailed issues should only be created when:
- the phase is current
- the phase is next
- a dependency must be clarified early

Avoid creating all detailed future issues upfront. Future phases should still be represented by:
- roadmap entries in `docs/ROADMAP.md`
- one GitHub milestone per phase
- one phase epic issue per phase

## Execution Rhythm

Weekly:
- Review current phase epic
- Select 3-5 detailed issues
- Move selected issues to Ready
- Run Codex one issue at a time
- Test and commit
- Move completed issues to Done
- Update phase epic checklist

## Operating Rules

- Milestones = phases
- Epic issues = phase summaries
- Detailed issues = current work only
- Project board = execution
- Docs = memory

## Recommended Workflow

1. Confirm the current phase milestone and current phase epic.
2. Keep only a small working set of detailed issues active.
3. Use the GitHub Project board to manage status changes in real time.
4. Close the loop by updating the epic issue checklist as child issues land.
5. When the current phase is nearly complete, prepare detailed issues for the next phase only.
