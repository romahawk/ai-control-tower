"use client"

import { useRef, useState } from "react"
import { Download, RotateCcw, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SettingsProps {
  onExport: () => void
  onImport: (rawValue: string) => void
  onReset: () => void
  onLoadDemo: () => void
}

export function Settings({ onExport, onImport, onReset, onLoadDemo }: SettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [statusMessage, setStatusMessage] = useState("Local-first workspace controls are ready.")

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const rawValue = await file.text()
    onImport(rawValue)
    setStatusMessage(`Imported workspace from ${file.name}.`)
    event.target.value = ""
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Productization readiness stays isolated here: export, import, reset, and demo controls for the local-first workspace.
        </p>
      </div>

      <Card className="border-border bg-card/70">
        <CardHeader>
          <CardTitle>Workspace Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{statusMessage}</p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={onExport}>
              <Download className="h-4 w-4" />
              Export Control Tower Data
            </Button>
            <Button variant="outline" onClick={handleImportClick}>
              <Upload className="h-4 w-4" />
              Import Control Tower Data
            </Button>
            <Button variant="outline" onClick={onLoadDemo}>
              Load demo data
            </Button>
            <Button variant="outline" onClick={onReset}>
              <RotateCcw className="h-4 w-4" />
              Reset local workspace
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleFileChange}
          />
        </CardContent>
      </Card>

      <Card className="border-border bg-card/70">
        <CardHeader>
          <CardTitle>Local-First Boundaries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Seed templates live in `data/` and remain separate from user-generated local workspace data.</p>
          <p>User sessions, outputs, contexts, and reviews persist in `localStorage` for the MVP.</p>
          <p>Future backend migration can replace the local repository layer without rewriting the scenario, workflow, or review model.</p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/70">
        <CardHeader>
          <CardTitle>Future Productization Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Auth, database, workspaces, and sharing stay out of the current runtime path until the execution loop is proven.</p>
          <p>Import/export gives a migration bridge without coupling the MVP to backend infrastructure.</p>
          <p>Template packs and repository abstractions are intentionally simple so they can evolve into multi-user services later.</p>
        </CardContent>
      </Card>
    </div>
  )
}
