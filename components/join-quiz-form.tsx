"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, CheckCircle } from "lucide-react"
import {
  validateQuizCode,
  getQuizByCode,
  saveJoinSession,
  initializeSampleQuizzes,
} from "@/lib/join-quiz-store"

export function JoinQuizForm() {
  const router = useRouter()
  const [quizCode, setQuizCode] = useState("")
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Initialize sample quizzes on mount
  useEffect(() => {
    initializeSampleQuizzes()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Validation
    if (!quizCode.trim()) {
      setError("Quiz code is required")
      return
    }
    if (!userName.trim()) {
      setError("User name is required")
      return
    }

    if (userName.trim().length < 2) {
      setError("User name must be at least 2 characters")
      return
    }

    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Validate quiz code
    if (!validateQuizCode(quizCode)) {
      setIsLoading(false)
      setError("Invalid Quiz Code")
      return
    }

    // Get quiz details
    const quiz = getQuizByCode(quizCode)
    if (!quiz) {
      setIsLoading(false)
      setError("Invalid Quiz Code")
      return
    }

    // Save session and redirect
    saveJoinSession({
      quizCode: quizCode.toUpperCase(),
      userName: userName.trim(),
      quizId: quiz.id,
    })

    setSuccess(true)

    // Redirect to quiz page after brief delay
    setTimeout(() => {
      router.push(`/quiz/${quiz.id}`)
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
            Enter the quiz code and your name to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Code Input */}
          <div className="space-y-2">
            <Label htmlFor="quiz-code">Quiz Code</Label>
            <Input
              id="quiz-code"
              placeholder="e.g., QUIZ001"
              value={quizCode}
              onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
              disabled={isLoading || success}
              className="placeholder:text-muted-foreground"
            />
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
                Quiz code validated! Redirecting...
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
              "Join Now"
            )}
          </Button>
        </form>

        {/* Demo Info */}
        <div className="mt-8 space-y-2 rounded-lg bg-muted p-4">
          <p className="text-xs font-semibold text-muted-foreground">
            Demo Quiz Codes:
          </p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>• QUIZ001 - General Knowledge</p>
            <p>• QUIZ002 - Mathematics</p>
            <p>• DEMO1234 - Sample Quiz</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
