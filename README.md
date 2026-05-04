# AI Control Tower

AI Control Tower is a local-first Personal Execution OS for running AI-supported work without drowning in tabs, prompts, or half-finished systems.

The operating model is:

`Scenario -> Workflow -> Step -> Tool / Prompt / Context -> Execution -> Output -> Review`

Income Engine is still supported, but it is now one scenario inside a broader system rather than the identity of the whole app.

## What The App Does

- Organizes work by scenario instead of one income-only dashboard
- Lets you start, pause, block, resume, and finish workflow sessions
- Keeps the current step, prompts, tools, context, and expected output together
- Persists sessions, outputs, contexts, and reviews in `localStorage`
- Adds a Product Development scenario for solo-founder idea validation
- Generates deterministic reviews and next actions from local data
- Supports export, import, reset, and demo workspace flows

## Static Library vs Execution System

Static library:
- Workflows, prompts, and tools exist as reference templates
- Useful for browsing, but weak for compounding execution

Execution system:
- A workflow becomes a live session
- Steps can be completed, paused, blocked, resumed, and finished
- Outputs are logged and survive refresh
- Reviews turn execution history into the next decision

## Current Repo Status

- Frontend-only Next.js app
- Seed templates live in `data/`
- User-generated workspace data lives in browser `localStorage`
- No backend, auth, database, or multi-user model in the runtime path
- Existing Income Engine content is preserved under the `income-engine` scenario

## Roadmap Snapshot

1. Static Control Tower foundation: Complete
2. Personal Execution OS: Complete
3. Scenario refactor: Complete
4. Context + Prompt Governance: Complete
5. Product Development scenario: Complete
6. Review / Decision Intelligence: Partial
7. Productization readiness: Partial

See [docs/ROADMAP.md](/d:/MazurykOS/01_Projects/IT-Projects-dev/ai-control-tower/docs/ROADMAP.md) for the detailed phase plan.

## Local-First MVP Strategy

- Keep seed templates separate from user data
- Persist user data locally first
- Prove the execution loop before introducing backend complexity
- Isolate future productization behind import/export and repository boundaries

## Non-Goals Right Now

- Full SaaS backend
- Auth and user accounts
- Real AI API orchestration inside the app
- Multi-user collaboration
- Premature automation or workflow agents

## Run The App

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.
