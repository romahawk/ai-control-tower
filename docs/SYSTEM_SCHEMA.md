# System Schema

## Core Flow
```text
Scenario
  -> Workflow
    -> Step
      -> Tool / Prompt / Context
        -> Execution
          -> Output
            -> Review
```

## Entity Definitions
- `Scenario`: top-level life or work domain that holds related workflows
- `Workflow`: repeatable process used to create a specific output
- `Step`: one unit of action inside a workflow
- `Tool`: external app used during a step
- `Prompt`: reusable instruction used during a step
- `Context`: note, link, file, or doc supporting a step or workflow
- `Execution`: the act of running the current step
- `Output`: artifact created by execution
- `Review`: summary of what was produced and what should happen next

## Relationship Model
- One `Scenario` links to many `Workflow` records
- One `Workflow` contains many ordered `Step` records
- One `Step` may use many `Tool` and `Prompt` records
- `Context` can attach to a `Workflow` or a `Step`
- One `WorkflowSession` runs one `Workflow` inside one `Scenario`
- One session can create many `Output` records
- One `Review` summarizes outputs and execution signals for a scenario or workflow

## Value Flow
The system only creates value if execution turns into visible outputs.

That value flow is:

`Scenario choice -> Workflow execution -> Output creation -> Review -> Better next action`

Without the output and review layers, the app stays a reference system.

With them, it becomes a compounding operating system.
