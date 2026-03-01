"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface AntiCheatConfig {
  enabled: boolean
  maxWarnings: number
  onWarning: (warningCount: number, reason: string) => void
  onMaxWarnings: () => void
}

export function useAntiCheat({
  enabled,
  maxWarnings,
  onWarning,
  onMaxWarnings,
}: AntiCheatConfig) {
  const [warnings, setWarnings] = useState(0)
  const warningsRef = useRef(0)

  const triggerWarning = useCallback(
    (reason: string) => {
      if (!enabled) return
      const newCount = warningsRef.current + 1
      warningsRef.current = newCount
      setWarnings(newCount)
      onWarning(newCount, reason)

      if (newCount >= maxWarnings) {
        onMaxWarnings()
      }
    },
    [enabled, maxWarnings, onWarning, onMaxWarnings]
  )

  useEffect(() => {
    if (!enabled) return

    // Disable right-click
    function handleContextMenu(e: MouseEvent) {
      e.preventDefault()
      triggerWarning("Right-click is not allowed during the quiz")
    }

    // Detect tab/window switch
    function handleVisibilityChange() {
      if (document.hidden) {
        triggerWarning("You switched away from the quiz tab")
      }
    }

    // Detect window blur (switching to another window)
    function handleBlur() {
      triggerWarning("You moved away from the quiz window")
    }

    // Disable common keyboard shortcuts
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl+C, Ctrl+V, Ctrl+U, Ctrl+Shift+I, F12, Alt+Tab
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "u" || e.key === "v")) ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        e.key === "F12"
      ) {
        e.preventDefault()
        triggerWarning("Keyboard shortcuts are disabled during the quiz")
      }
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleBlur)
    document.addEventListener("keydown", handleKeyDown)

    // Disable text selection
    document.body.style.userSelect = "none"
    document.body.style.webkitUserSelect = "none"

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleBlur)
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.userSelect = ""
      document.body.style.webkitUserSelect = ""
    }
  }, [enabled, triggerWarning])

  return { warnings }
}
