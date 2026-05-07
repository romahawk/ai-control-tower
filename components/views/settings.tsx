"use client"

import { useRef, useState } from "react"
import { Download, Palette, RotateCcw, Settings2, Upload } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/ui/page-header"
import { SegmentedTabs } from "@/components/ui/segmented-tabs"
import { Tabs, TabsContent } from "@/components/ui/tabs"

interface SettingsProps {
  onExport: () => void
  onImport: (rawValue: string) => void
  onReset: () => void
  onLoadDemo: () => void
}

type SettingsTab = "workspace" | "appearance" | "scenarios" | "data" | "integrations" | "shortcuts"

const settingsTabs: Array<{ value: SettingsTab; label: string }> = [
  { value: "workspace", label: "Workspace" },
  { value: "appearance", label: "Appearance" },
  { value: "scenarios", label: "Scenarios" },
  { value: "data", label: "Data" },
  { value: "integrations", label: "Integrations" },
  { value: "shortcuts", label: "Shortcuts" },
]

export function Settings({ onExport, onImport, onReset, onLoadDemo }: SettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState<SettingsTab>("workspace")
  const [statusMessage, setStatusMessage] = useState("Local-first workspace controls are ready.")

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const rawValue = await file.text()
    onImport(rawValue)
    setStatusMessage(`Imported workspace from ${file.name}.`)
    event.target.value = ""
  }

  return (
    <div className="h-full overflow-auto px-4 py-4 md:px-6">
      <div className="mx-auto max-w-[1360px] space-y-4">
        <PageHeader
          title="Settings"
          description="Configure your workspace, scenarios, and preferences."
          icon={Settings2}
        />

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SettingsTab)} className="space-y-4">
          <SegmentedTabs tabs={settingsTabs} />

          <TabsContent value={activeTab} className="outline-none">
            <div className="grid gap-4 xl:grid-cols-2">
              {activeTab === "workspace" ? (
                <>
                  <div className="rounded-3xl border border-border/60 bg-card/70 p-5">
                    <p className="text-sm font-semibold text-foreground">Workspace</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Default mode is local-first. Export, import, reset, and demo controls live here.
                    </p>
                    <div className="mt-4 space-y-3">
                      <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4 text-sm text-muted-foreground">
                        {statusMessage}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={onExport}
                          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                        >
                          <Download className="h-4 w-4" />
                          Export Control Tower Data
                        </button>
                        <button
                          onClick={handleImportClick}
                          className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/25 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/45"
                        >
                          <Upload className="h-4 w-4" />
                          Import Control Tower Data
                        </button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/json"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border/60 bg-card/70 p-5">
                    <p className="text-sm font-semibold text-foreground">System boundaries</p>
                    <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                      <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                        Seed templates live in <code>data/</code> and stay separate from user-generated workspace state.
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                        Sessions, outputs, contexts, reviews, and quick captures persist in <code>localStorage</code>.
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                        Backend migration can replace the storage layer later without changing the execution model.
                      </div>
                    </div>
                  </div>
                </>
              ) : null}

              {activeTab === "appearance" ? (
                <>
                  <div className="rounded-3xl border border-border/60 bg-card/70 p-5">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-foreground">Appearance</p>
                    </div>
                    <div className="mt-4 grid gap-3">
                      <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Theme</p>
                        <p className="mt-2 text-sm text-foreground">Dark workspace is currently the reference theme.</p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Density</p>
                        <p className="mt-2 text-sm text-foreground">Compact by default, with comfortable spacing reserved for detail views.</p>
                      </div>
                    </div>
                  </div>
                  <EmptyState
                    icon={Palette}
                    title="Appearance controls are intentionally light"
                    description="Keep the shell calm and execution-focused. Add theme switches later only if they protect clarity."
                  />
                </>
              ) : null}

              {activeTab === "scenarios" ? (
                <>
                  <div className="rounded-3xl border border-border/60 bg-card/70 p-5">
                    <p className="text-sm font-semibold text-foreground">Scenario defaults</p>
                    <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                      <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                        The active scenario in the top bar influences dashboard focus, workflow suggestions, and prompt relevance.
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                        Keep one scenario active when overloaded to reduce context switching.
                      </div>
                    </div>
                  </div>
                  <EmptyState
                    icon={Settings2}
                    title="Scenario preference controls can stay simple"
                    description="When editing grows beyond local-first defaults, scenario management belongs on the Scenarios page."
                  />
                </>
              ) : null}

              {activeTab === "data" ? (
                <>
                  <div className="rounded-3xl border border-border/60 bg-card/70 p-5">
                    <p className="text-sm font-semibold text-foreground">Data operations</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={onLoadDemo}
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                      >
                        Load demo data
                      </button>
                      <button
                        onClick={onReset}
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/25 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/45"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset local workspace
                      </button>
                    </div>
                    <div className="mt-4 rounded-2xl border border-border/60 bg-secondary/15 p-4 text-sm text-muted-foreground">
                      These controls affect only local workspace data. Seed templates remain intact.
                    </div>
                  </div>
                  <EmptyState
                    icon={Download}
                    title="Data stays local-first"
                    description="Import and export are the current migration bridge until a backend exists."
                  />
                </>
              ) : null}

              {activeTab === "integrations" ? (
                <>
                  <div className="rounded-3xl border border-border/60 bg-card/70 p-5">
                    <p className="text-sm font-semibold text-foreground">Registry model</p>
                    <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                      <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                        External systems can now be logged as structured references tied to scenarios, projects, or workflows.
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4">
                        AI conversation threads can now be registered so off-platform execution context stays traceable.
                      </div>
                    </div>
                  </div>
                  <EmptyState
                    icon={Settings2}
                    title="Deep integrations are still intentionally light"
                    description="The registry now captures systems and AI threads first. Full API integrations can come later without losing traceability."
                  />
                </>
              ) : null}

              {activeTab === "shortcuts" ? (
                <EmptyState
                  icon={Settings2}
                  title="Keyboard shortcuts"
                  description="Use Ctrl/Cmd + K for the command palette. Shortcut customization can come later without changing the shell."
                />
              ) : null}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
