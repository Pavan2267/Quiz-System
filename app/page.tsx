import { QuizDashboard } from "@/components/quiz-dashboard"
import Link from "next/link"
import { Plus, Shield, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "QuizGuard - Secure Quiz Platform",
  description:
    "Create and share quizzes with built-in anti-cheat protection. Block tab switching, right-click, and more.",
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">QuizGuard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/join">
              <Button variant="outline" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Join Quiz
              </Button>
            </Link>
            <Link href="/create">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Quiz
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h2 className="text-balance text-2xl font-bold text-foreground">
            Your Quizzes
          </h2>
          <p className="mt-1 text-muted-foreground">
            Create, manage, and share quizzes with anti-cheat protection.
          </p>
        </div>
        <QuizDashboard />
      </div>
    </main>
  )
}
