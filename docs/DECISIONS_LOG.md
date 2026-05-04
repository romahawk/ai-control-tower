# Decisions Log

| Date | Decision | Reason | Status |
| --- | --- | --- | --- |
| 2026-04-25 | Use the current repository as the implementation base instead of rewriting | The existing Next.js shell already provided a usable dashboard, library views, and static data structure. | Accepted |
| 2026-04-27 | Shift the product model from Income Engine-first to Scenario-first | The app needs to support multiple domains and reduce cognitive overload across more than revenue work. | Accepted |
| 2026-05-04 | Keep Income Engine content as a seeded scenario rather than deleting it | Existing content still provides value and should be migrated, not discarded. | Accepted |
| 2026-05-04 | Separate seed templates from user-generated local data | This keeps the MVP stable now and creates a clean migration path to future backend repositories. | Accepted |
| 2026-05-04 | Use `localStorage` for workflow sessions, outputs, contexts, and reviews | The MVP priority is proving the execution loop without introducing backend or auth complexity. | Accepted |
| 2026-05-04 | Prefer deterministic review logic over AI review generation | Review is useful now with local data and simple rules; AI integration can wait. | Accepted |
| 2026-05-04 | Add Product Development as a first-class seeded scenario | This validates the universal model against a high-value solo-founder use case. | Accepted |
| 2026-05-04 | Keep legacy `INCOME_ENGINES` only as a compatibility adapter | This reduces breakage while the canonical model fully moves to `Scenario`. | Accepted |
| 2026-05-04 | Add import/export/reset/demo controls before backend work | These controls create workspace portability and reduce lock-in while staying local-first. | Accepted |
