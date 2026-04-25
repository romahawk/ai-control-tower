"use client"

import { useState } from "react"
import AppShell from "@/components/app-shell"
import type { ViewType } from "@/types/navigation"

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")

  return (
    <AppShell currentView={currentView} onNavigate={setCurrentView} />
  )
}

