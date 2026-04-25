"use client"

import { useState } from "react"
import {
  Search, Star, StarOff, Zap, Copy, Edit3, Trash2, Plus,
  Hash, Tag, ChevronRight, X, Check, Filter, Clock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PROMPTS, CATEGORY_COLORS, type Prompt } from "@/lib/mock-data"

const CATEGORIES = ["All", "Code", "Product", "Business", "Marketing", "Creative", "Research", "General"]

export function PromptLibrary() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(PROMPTS[0])
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(PROMPTS.filter((p) => p.isFavorite).map((p) => p.id))
  )
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState("")

  const filteredPrompts = PROMPTS.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const categoryCounts = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = cat === "All" ? PROMPTS.length : PROMPTS.filter((p) => p.category === cat).length
      return acc
    },
    {} as Record<string, number>
  )

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const startEdit = (prompt: Prompt) => {
    setEditContent(prompt.content)
    setIsEditing(true)
  }

  return (
    <div className="flex h-full">
      {/* Category sidebar */}
      <aside className="w-48 flex-shrink-0 border-r border-border bg-card/30 flex flex-col">
        <div className="px-3 pt-4 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2 mb-2">
            Categories
          </p>
          <div className="space-y-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                  selectedCategory === cat
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                <span className="truncate">{cat}</span>
                {categoryCounts[cat] > 0 && (
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-1.5 py-0.5 rounded-full tabular-nums flex-shrink-0",
                      selectedCategory === cat
                        ? "bg-primary/20 text-primary"
                        : "bg-surface-raised text-muted-foreground"
                    )}
                  >
                    {categoryCounts[cat]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t border-border p-3">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-primary hover:bg-primary/10 transition-colors font-medium">
            <Plus className="w-4 h-4" />
            New Prompt
          </button>
        </div>
      </aside>

      {/* Prompt list */}
      <div className="w-80 flex-shrink-0 border-r border-border flex flex-col">
        {/* Search */}
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts..."
              className="w-full bg-secondary/50 border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/40 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
          <button className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Filter className="w-3 h-3" />
            Filter
          </button>
          <button className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Star className="w-3 h-3" />
            Favorites
          </button>
          <button className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors ml-auto">
            <Clock className="w-3 h-3" />
            Recent
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filteredPrompts.length === 0 ? (
            <div className="p-6 text-center">
              <Hash className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No prompts found</p>
            </div>
          ) : (
            filteredPrompts.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => {
                  setSelectedPrompt(prompt)
                  setIsEditing(false)
                }}
                className={cn(
                  "w-full text-left px-4 py-3.5 border-b border-border transition-all group",
                  selectedPrompt?.id === prompt.id
                    ? "bg-primary/8 border-l-2 border-l-primary"
                    : "hover:bg-secondary/40"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">{prompt.title}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(prompt.id)
                    }}
                    className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {favorites.has(prompt.id) ? (
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    ) : (
                      <StarOff className="w-3.5 h-3.5 text-muted-foreground hover:text-yellow-400 transition-colors" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-1 mb-2">{prompt.description}</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", CATEGORY_COLORS[prompt.category])}>
                    {prompt.category}
                  </span>
                  {prompt.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] text-muted-foreground/70">
                      #{tag}
                    </span>
                  ))}
                  <span className="text-[10px] text-muted-foreground/50 ml-auto">{prompt.useCount}×</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border">
          <p className="text-[11px] text-muted-foreground">
            {filteredPrompts.length} of {PROMPTS.length} prompts
          </p>
        </div>
      </div>

      {/* Prompt detail panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedPrompt ? (
          <>
            {/* Detail header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-border gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-medium", CATEGORY_COLORS[selectedPrompt.category])}>
                    {selectedPrompt.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {selectedPrompt.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-0.5 text-[11px] text-muted-foreground bg-secondary/60 px-1.5 py-0.5 rounded">
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h2 className="text-base font-semibold text-foreground leading-snug text-balance">
                  {selectedPrompt.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{selectedPrompt.description}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleFavorite(selectedPrompt.id)}
                  className={cn(
                    "p-2 rounded-lg border transition-all",
                    favorites.has(selectedPrompt.id)
                      ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                      : "border-border text-muted-foreground hover:text-yellow-400 hover:border-yellow-500/30"
                  )}
                >
                  <Star className={cn("w-4 h-4", favorites.has(selectedPrompt.id) && "fill-yellow-400")} />
                </button>
                <button
                  onClick={() => handleCopy(selectedPrompt.id, selectedPrompt.content)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-border/80 text-sm transition-all"
                >
                  {copiedId === selectedPrompt.id ? (
                    <><Check className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400">Copied!</span></>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" />Copy</>
                  )}
                </button>
                <button
                  onClick={() => startEdit(selectedPrompt)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground text-sm transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-all glow-blue-sm">
                  <Zap className="w-3.5 h-3.5" />
                  Execute
                </button>
              </div>
            </div>

            {/* Prompt content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-5">
              {/* Variables */}
              {selectedPrompt.variables && selectedPrompt.variables.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                    Variables
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPrompt.variables.map((v) => (
                      <div
                        key={v}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/8 border border-primary/20 rounded-lg text-sm"
                      >
                        <span className="text-primary font-mono text-xs">[</span>
                        <span className="text-foreground font-medium">{v}</span>
                        <span className="text-primary font-mono text-xs">]</span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                        <input
                          placeholder={`Enter ${v}...`}
                          className="bg-transparent outline-none text-xs text-muted-foreground placeholder:text-muted-foreground/40 w-24 focus:text-foreground"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompt text */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Prompt Content
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{selectedPrompt.content.split(" ").length} words</span>
                    <span>·</span>
                    <span>{selectedPrompt.useCount} uses</span>
                    <span>·</span>
                    <span>Last used {selectedPrompt.lastUsed}</span>
                  </div>
                </div>

                {isEditing ? (
                  <div className="relative">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-64 bg-secondary/40 border border-primary/40 rounded-xl p-4 text-sm text-foreground font-mono leading-relaxed outline-none resize-none scrollbar-thin focus:border-primary/60 transition-colors"
                    />
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-lg border border-border text-muted-foreground text-sm hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <pre className="bg-secondary/40 border border-border rounded-xl p-4 text-sm text-foreground font-mono leading-relaxed whitespace-pre-wrap scrollbar-thin overflow-auto max-h-72">
                    {selectedPrompt.content}
                  </pre>
                )}
              </div>

              {/* Meta info */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Category", value: selectedPrompt.category },
                  { label: "Last Used", value: selectedPrompt.lastUsed },
                  { label: "Total Uses", value: `${selectedPrompt.useCount}×` },
                ].map((item) => (
                  <div key={item.label} className="bg-secondary/30 border border-border rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Danger zone */}
              <div className="border border-destructive/20 rounded-xl p-4 bg-destructive/5">
                <h4 className="text-xs font-semibold text-destructive mb-2">Danger Zone</h4>
                <button className="flex items-center gap-2 text-xs text-destructive hover:text-destructive/80 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete this prompt
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <Hash className="w-12 h-12 text-muted-foreground/20 mb-4" />
            <h3 className="text-base font-semibold text-foreground mb-1">Select a prompt</h3>
            <p className="text-sm text-muted-foreground">Choose a prompt from the list to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}
