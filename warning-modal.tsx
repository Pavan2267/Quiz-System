"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle, ShieldAlert } from "lucide-react"

interface WarningModalProps {
  open: boolean
  onClose: () => void
  warningCount: number
  maxWarnings: number
  reason: string
  autoSubmitted?: boolean
}

export function WarningModal({
  open,
  onClose,
  warningCount,
  maxWarnings,
  reason,
  autoSubmitted = false,
}: WarningModalProps) {
  const remaining = maxWarnings - warningCount

  if (autoSubmitted) {
    return (
      <AlertDialog open={open}>
        <AlertDialogContent className="border-destructive">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              Quiz Auto-Submitted
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Your quiz has been automatically submitted because you exceeded
              the maximum number of warnings ({maxWarnings}). This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onClose}>
              View Results
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent className="border-warning">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Warning {warningCount} of {maxWarnings}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-col gap-3">
              <p className="text-base">{reason}</p>
              <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
                <div className="flex gap-1">
                  {Array.from({ length: maxWarnings }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-3 w-8 rounded-full transition-colors ${
                        i < warningCount
                          ? "bg-destructive"
                          : "bg-muted-foreground/20"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium text-foreground">
                  {remaining > 0
                    ? `${remaining} warning${remaining === 1 ? "" : "s"} remaining`
                    : "Final warning reached"}
                </span>
              </div>
              {remaining <= 1 && remaining > 0 && (
                <p className="text-sm font-semibold text-destructive">
                  This is your last warning! One more violation and your quiz
                  will be auto-submitted.
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>I Understand</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
