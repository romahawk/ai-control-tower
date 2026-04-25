"use client"

import { useState } from "react"
import {
  Search, Star, Clock, Zap, ArrowRight, TrendingUp, BookOpen,
  Layers, AppWindow, Copy, ExternalLink, Hash, BarChart2,
  ChevronRight, Plus
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PROMPTS, CONTEXTS, TOOLS, CATEGORY_COLORS } from "@/lib/mock-data"
import type { ViewType } from "@/types/navigation"

interface DashboardProps {
  onNavigate: (view: ViewType) => void
  onOpenCommand: () => void
}

const stats = [
  { label: "Total Prompts", value: "124", change: "+8 this week", icon: BookOpen, color: "text-blue-400" },
  { label: "Active Contexts", value: "4", change: "of 8 total", icon: Layers, color: "text-violet-400" },
  { label: "Executions Today", value: "37", change: "+12 vs yesterday", icon: Zap, color: "text-cyan-400" },
  { label: "Saved This Month", value: "14.2h", change: "vs manual work", icon: TrendingUp, color: "text-green-400" },
]

const quickActions = [
  { label: "New Prompt", icon: Plus, view: "prompts" as ViewType, color: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" },
  { label: "Run Execution", icon: Zap, view: "execution" as ViewType, color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20" },
  { label: "Add Context", icon: Layers, view: "contexts" as ViewType, color: "bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20" },
  { label: "Open Tool", icon: AppWindow, view: "tools" as ViewType, color: "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20" },
]

const recentPrompts = PROMPTS.slice(0, 5)
const favoritePrompts = PROMPTS.filter((p) => p.isFavorite)
const activeContexts = CONTEXTS.filter((c) => c.isActive)
const pinnedTools = TOOLS.filter((t) => t.isPinned)

export function Dashboard({ onNavigate, onOpenCommand }: DashboardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Global Command Bar */}
      <div
        className="relative cursor-pointer group"
        onClick={onOpenCommand}
      >
        <div className="flex items-center gap-4 px-5 py-4 bg-card border border-border rounded-xl hover:border-primary/40 transition-all duration-200"
          style={{ boxShadow: "0 0 0 0 oklch(0.587 0.21 258 / 0)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px oklch(0.587 0.21 258 / 0.1)"
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 oklch(0.587 0.21 258 / 0)"
          }}
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
            <Search className="w-4.5 h-4.5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              Find a prompt, context, or tool — or type a command
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="px-1.5 py-0.5 bg-surface-raised rounded border border-border font-mono">⌘</span>
              <span className="px-1.5 py-0.5 bg-surface-raised rounded border border-border font-mono">K</span>
            </div>
            <span className="text-xs text-muted-foreground/50 border-l border-border pl-3">Quick search</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-4 hover:border-border/80 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                <Icon className={cn("w-4 h-4", stat.color)} />
              </div>
              <p className="text-2xl font-bold text-foreground tabular-nums">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </div>
          )
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left column — Prompts */}
        <div className="col-span-7 space-y-4">
          {/* Recent prompts */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Recent Prompts</h3>
              </div>
              <button
                onClick={() => onNavigate("prompts")}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-border">
              {recentPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/40 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                    <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{prompt.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", CATEGORY_COLORS[prompt.category])}>
                        {prompt.category}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{prompt.lastUsed}</span>
                      <span className="text-[11px] text-muted-foreground">{prompt.useCount} uses</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(prompt.id, prompt.content)}
                      className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy prompt"
                    >
                      {copiedId === prompt.id ? (
                        <span className="text-[10px] text-green-400 font-medium px-1">Copied!</span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => onNavigate("execution")}
                      className="p-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                      title="Execute prompt"
                    >
                      <Zap className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Favorite prompts */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-semibold text-foreground">Favorites</h3>
              </div>
              <span className="text-xs text-muted-foreground">{favoritePrompts.length} prompts</span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2.5">
              {favoritePrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="relative p-3.5 bg-secondary/40 hover:bg-secondary/70 border border-border hover:border-primary/30 rounded-lg cursor-pointer group transition-all"
                  onClick={() => onNavigate("prompts")}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-xs font-medium text-foreground leading-snug line-clamp-2">{prompt.title}</p>
                    <Zap className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", CATEGORY_COLORS[prompt.category])}>
                      {prompt.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{prompt.useCount}×</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-5 space-y-4">
          {/* Quick actions */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2.5">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.label}
                    onClick={() => onNavigate(action.view)}
                    className={cn(
                      "flex items-center gap-2.5 px-3.5 py-3 rounded-lg border text-sm font-medium transition-all",
                      action.color
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active contexts */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-foreground">Active Contexts</h3>
              </div>
              <button
                onClick={() => onNavigate("contexts")}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                Manage <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="p-3 space-y-2">
              {activeContexts.map((ctx) => (
                <div
                  key={ctx.id}
                  className="flex items-start gap-3 px-3 py-2.5 bg-secondary/40 rounded-lg border border-border hover:border-violet-500/20 transition-colors group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{ctx.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{ctx.description}</p>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20 capitalize flex-shrink-0">
                    {ctx.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tool launcher */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <div className="flex items-center gap-2">
                <AppWindow className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-semibold text-foreground">Pinned Tools</h3>
              </div>
              <button
                onClick={() => onNavigate("tools")}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                All tools <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {pinnedTools.map((tool) => (
                <a
                  key={tool.id}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2.5 bg-secondary/40 hover:bg-secondary/70 border border-border hover:border-primary/20 rounded-lg transition-all group"
                >
                  <div
                    className="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: tool.color }}
                  >
                    {tool.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{tool.name}</p>
                    <p className="text-[10px] text-muted-foreground">{tool.category}</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Usage insight */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-foreground">Top Category This Week</h3>
            </div>
            {[
              { label: "Code", value: 42, pct: 85 },
              { label: "Product", value: 31, pct: 63 },
              { label: "Business", value: 18, pct: 37 },
            ].map((item) => (
              <div key={item.label} className="mb-2.5">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-foreground font-medium tabular-nums">{item.value} runs</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
