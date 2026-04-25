"use client"

import { useState } from "react"
import {
  Zap, ChevronDown, Copy, Check, ExternalLink, RefreshCw,
  Layers, BookOpen, Play, History, Plus, X, Send
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PROMPTS, CONTEXTS, TOOLS, CATEGORY_COLORS } from "@/lib/mock-data"

const MOCK_OUTPUT = `## PRD: AI-Powered Prompt Management System

### Problem Statement
Power users of AI tools waste significant time managing and re-creating prompts across sessions. There is no centralized system for storing, versioning, and reusing high-quality prompts with appropriate context injection.

### Goals & Success Metrics
- **Primary:** Reduce average prompt creation time from 8 min → 45 seconds
- **Secondary:** Increase prompt reuse rate to >60%
- **Metric:** Measure via in-app execution tracking

### User Stories

1. **As a** Technical PM, **I want to** store categorized prompts with tags, **so that** I can find and reuse them without rewriting.

2. **As a** developer, **I want to** inject project context into any prompt automatically, **so that** I don't repeat boilerplate in every session.

3. **As a** solo founder, **I want to** see my most-used prompts on a dashboard, **so that** I can access them in one click.

4. **As a** power user, **I want to** execute prompts directly to Claude or GPT via the interface, **so that** I don't need to copy-paste between tabs.

5. **As a** team lead, **I want to** share prompt libraries with my team, **so that** we maintain consistent AI outputs.

### Acceptance Criteria
- Prompt search returns results in <200ms
- Context injection is automatic and overridable
- One-click execute opens the target AI tool with prompt pre-filled
- All prompts are persisted and version-controlled

### Out of Scope (v1)
- Team collaboration features
- AI-generated prompt suggestions
- Native API integrations (phase 2)

### Risks
- User adoption if friction is too high
- Context management complexity for non-technical users`

const HISTORY = [
  { id: "h1", prompt: "Write a PRD for [feature]", tool: "Claude", time: "2 hours ago", status: "success" },
  { id: "h2", prompt: "Debug edge cases in [code]", tool: "ChatGPT", time: "5 hours ago", status: "success" },
  { id: "h3", prompt: "Market positioning analysis", tool: "Perplexity", time: "1 day ago", status: "success" },
]

export function ExecutionPanel() {
  const [selectedPromptId, setSelectedPromptId] = useState(PROMPTS[0].id)
  const [activeContextIds, setActiveContextIds] = useState<Set<string>>(
    new Set(CONTEXTS.filter((c) => c.isActive).map((c) => c.id))
  )
  const [selectedTool, setSelectedTool] = useState(TOOLS[0])
  const [promptOverride, setPromptOverride] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string | null>(null)
  const [copiedOutput, setCopiedOutput] = useState(false)
  const [showPromptPicker, setShowPromptPicker] = useState(false)
  const [showToolPicker, setShowToolPicker] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const selectedPrompt = PROMPTS.find((p) => p.id === selectedPromptId) || PROMPTS[0]
  const activeContexts = CONTEXTS.filter((c) => activeContextIds.has(c.id))

  const toggleContext = (id: string) => {
    setActiveContextIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleExecute = () => {
    setIsRunning(true)
    setOutput(null)
    setTimeout(() => {
      setIsRunning(false)
      setOutput(MOCK_OUTPUT)
    }, 2200)
  }

  const handleCopyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output)
      setCopiedOutput(true)
      setTimeout(() => setCopiedOutput(false), 1500)
    }
  }

  return (
    <div className="flex h-full">
      {/* Left panel — Setup */}
      <div className="w-96 flex-shrink-0 border-r border-border flex flex-col bg-card/30">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Execution Setup</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Configure prompt, context, and target tool</p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5">
          {/* Prompt selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
              Prompt
            </label>
            <button
              onClick={() => setShowPromptPicker((v) => !v)}
              className="w-full flex items-start gap-3 px-4 py-3 bg-secondary/50 border border-border hover:border-primary/40 rounded-xl text-left transition-all"
            >
              <BookOpen className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-1">{selectedPrompt.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{selectedPrompt.category} · {selectedPrompt.tags[0]}</p>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 mt-0.5", showPromptPicker && "rotate-180")} />
            </button>

            {showPromptPicker && (
              <div className="mt-1.5 bg-card border border-border rounded-xl overflow-hidden shadow-lg">
                <div className="max-h-48 overflow-y-auto scrollbar-thin">
                  {PROMPTS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPromptId(p.id)
                        setShowPromptPicker(false)
                        setPromptOverride("")
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-secondary/60 transition-colors",
                        p.id === selectedPromptId && "bg-primary/10 text-primary"
                      )}
                    >
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0", CATEGORY_COLORS[p.category])}>
                        {p.category}
                      </span>
                      <span className="truncate text-foreground">{p.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prompt editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Prompt Editor
              </label>
              <button
                onClick={() => setPromptOverride(selectedPrompt.content)}
                className="text-[11px] text-primary hover:text-primary/80 transition-colors"
              >
                Load prompt
              </button>
            </div>
            <textarea
              value={promptOverride || selectedPrompt.content}
              onChange={(e) => setPromptOverride(e.target.value)}
              className="w-full h-40 bg-secondary/40 border border-border hover:border-border/80 focus:border-primary/40 rounded-xl p-3.5 text-sm text-foreground font-mono leading-relaxed outline-none resize-none scrollbar-thin transition-colors"
              placeholder="Edit or override the prompt here..."
            />
          </div>

          {/* Context injection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Inject Contexts
              </label>
              <span className="text-[11px] text-muted-foreground">{activeContextIds.size} active</span>
            </div>
            <div className="space-y-1.5">
              {CONTEXTS.map((ctx) => (
                <button
                  key={ctx.id}
                  onClick={() => toggleContext(ctx.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm transition-all text-left",
                    activeContextIds.has(ctx.id)
                      ? "border-primary/30 bg-primary/8 text-foreground"
                      : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground hover:border-border/80"
                  )}
                >
                  <Layers className={cn("w-3.5 h-3.5 flex-shrink-0", activeContextIds.has(ctx.id) ? "text-primary" : "text-muted-foreground")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{ctx.title}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full capitalize flex-shrink-0",
                    activeContextIds.has(ctx.id)
                      ? "bg-primary/15 text-primary"
                      : "bg-surface-raised text-muted-foreground"
                  )}>
                    {ctx.type}
                  </span>
                  {activeContextIds.has(ctx.id) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Target tool */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
              Target Tool
            </label>
            <button
              onClick={() => setShowToolPicker((v) => !v)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-secondary/50 border border-border hover:border-primary/40 rounded-xl text-left transition-all"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: selectedTool.color }}
              >
                {selectedTool.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{selectedTool.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{selectedTool.description}</p>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform flex-shrink-0", showToolPicker && "rotate-180")} />
            </button>

            {showToolPicker && (
              <div className="mt-1.5 bg-card border border-border rounded-xl overflow-hidden shadow-lg">
                <div className="max-h-44 overflow-y-auto scrollbar-thin">
                  {TOOLS.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setSelectedTool(tool)
                        setShowToolPicker(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary/60 transition-colors text-left",
                        tool.id === selectedTool.id && "bg-primary/10"
                      )}
                    >
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: tool.color }}
                      >
                        {tool.name[0]}
                      </div>
                      <span className="text-foreground truncate">{tool.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Execute button */}
        <div className="p-5 border-t border-border space-y-2.5">
          <button
            onClick={handleExecute}
            disabled={isRunning}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold disabled:opacity-60 transition-all glow-blue"
          >
            {isRunning ? (
              <><RefreshCw className="w-4 h-4 animate-spin" />Executing...</>
            ) : (
              <><Play className="w-4 h-4" />Execute Prompt</>
            )}
          </button>
          <a
            href={selectedTool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground text-sm transition-all hover:border-border/80"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open {selectedTool.name} directly
          </a>
        </div>
      </div>

      {/* Right panel — Output */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Output header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-foreground">Output Preview</h2>
            {output && (
              <span className="flex items-center gap-1.5 text-[11px] text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Completed
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory((v) => !v)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all",
                showHistory ? "border-primary/30 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              <History className="w-3.5 h-3.5" />
              History
            </button>
            {output && (
              <>
                <button
                  onClick={handleCopyOutput}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground text-xs transition-all"
                >
                  {copiedOutput ? <><Check className="w-3.5 h-3.5 text-green-400" />Copied</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
                </button>
                <button
                  onClick={() => window.open(selectedTool.url, "_blank")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground text-xs transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send to {selectedTool.name}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Active context pills */}
        {activeContexts.length > 0 && (
          <div className="flex items-center gap-2 px-6 py-2.5 border-b border-border bg-card/20 flex-wrap">
            <span className="text-[11px] text-muted-foreground">Injected:</span>
            {activeContexts.map((ctx) => (
              <span
                key={ctx.id}
                className="flex items-center gap-1.5 text-[11px] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full"
              >
                <Layers className="w-2.5 h-2.5" />
                {ctx.title}
                <button onClick={() => toggleContext(ctx.id)} className="ml-0.5 hover:text-red-400 transition-colors">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Output area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {showHistory ? (
            <div className="p-6 space-y-3">
              <h3 className="text-sm font-semibold text-foreground mb-4">Execution History</h3>
              {HISTORY.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-border/80 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.prompt}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">via {item.tool} · {item.time}</p>
                  </div>
                  <button className="text-xs text-primary hover:text-primary/80 transition-colors">
                    Rerun
                  </button>
                </div>
              ))}
            </div>
          ) : isRunning ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <Zap className="absolute inset-0 m-auto w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Executing prompt</p>
                <p className="text-xs text-muted-foreground mt-1">Injecting {activeContexts.length} context{activeContexts.length !== 1 ? "s" : ""} via {selectedTool.name}</p>
              </div>
            </div>
          ) : output ? (
            <div className="p-6">
              <div className="bg-secondary/30 border border-border rounded-xl p-5">
                <pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                  {output}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary/50" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">Ready to execute</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Configure your prompt and contexts, then hit Execute to generate output.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                {[
                  { icon: BookOpen, label: selectedPrompt.title.slice(0, 24) + "..." },
                  { icon: Layers, label: `${activeContextIds.size} contexts` },
                  { icon: Zap, label: selectedTool.name },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 rounded-lg border border-border">
                      <Icon className="w-3 h-3 text-primary" />
                      <span className="truncate max-w-24">{item.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
