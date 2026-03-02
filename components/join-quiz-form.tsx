"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, CheckCircle } from "lucide-react"
import { getQuiz } from "@/lib/quiz-store"
import { saveJoinSession } from "@/lib/join-quiz-store"

export function JoinQuizForm() {
  const router = useRouter()
  const [quizLink, setQuizLink] = useState("")
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Extract quiz ID from a link
  const extractQuizIdFromLink = (link: string): string | null => {
    try {
      // Handle full URLs like https://example.com/quiz/quiz_abc123
      const urlPattern = /\/quiz\/([a-z0-9_]+)/i
      const match = link.match(urlPattern)
      if (match && match[1]) {
        return match[1]
      }

      // Handle just the quiz ID
      if (/^[a-z0-9_]+$/i.test(link.trim())) {
        return link.trim()
      }

      return null
    } catch {
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Validation
    if (!quizLink.trim()) {
      setError("Please paste the quiz link or ID")
      return
    }
    if (!userName.trim()) {
      setError("Your name is required")
      return
    }

    if (userName.trim().length < 2) {
      setError("Name must be at least 2 characters")
      return
    }

    setIsLoading(true)

    // Extract quiz ID from link
    const quizId = extractQuizIdFromLink(quizLink)
    if (!quizId) {
      setIsLoading(false)
      setError("Invalid quiz link format. Please check and try again.")
      return
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Check if quiz exists
    const quiz = getQuiz(quizId)
    if (!quiz) {
      setIsLoading(false)
      setError("Quiz not found. Please check the link and try again.")
      return
    }

    // Save session and redirect
    saveJoinSession({
      quizCode: quizId,
      userName: userName.trim(),
      quizId: quizId,
    })

    setSuccess(true)

    // Redirect to quiz page after brief delay
    setTimeout(() => {
      router.push(`/quiz/${quizId}`)
    }, 500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border border-border p-8">
        <div className="mb-8">
          <h1 className="text-balance text-2xl font-bold text-foreground">
            Join a Quiz
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Paste the quiz link shared by your instructor to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Link Input */}
          <div className="space-y-2">
            <Label htmlFor="quiz-link">Quiz Link</Label>
            <Input
              id="quiz-link"
              placeholder="Paste quiz link here"
              value={quizLink}
              onChange={(e) => setQuizLink(e.target.value)}
              disabled={isLoading || success}
              className="placeholder:text-muted-foreground font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Paste the full link from your instructor (e.g., localhost:3000/quiz/quiz_abc123...)
            </p>
          </div>

          {/* User Name Input */}
          <div className="space-y-2">
            <Label htmlFor="user-name">Your Name</Label>
            <Input
              id="user-name"
              placeholder="Enter your full name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={isLoading || success}
              className="placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              This will be recorded with your quiz submission
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Welcome, {userName}! Loading quiz...
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || success}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                <span>Validating...</span>
              </div>
            ) : success ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Joined Successfully!</span>
              </div>
            ) : (
              "Join Quiz"
            )}
          </Button>
        </form>

        {/* How it Works Section */}
        <div className="mt-8 space-y-3 rounded-lg bg-muted p-4">
          <p className="text-xs font-semibold text-muted-foreground">
            How to get a quiz link:
          </p>
          <ol className="space-y-2 text-xs text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">1.</span>
              <span>Your instructor creates a quiz</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">2.</span>
              <span>They copy the shareable link</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-foreground">3.</span>
              <span>You paste it here to join</span>
            </li>
          </ol>
        </div>
      </Card>
    </div>
  )
}
