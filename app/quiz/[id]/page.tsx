"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { QuizPlayer } from "@/components/quiz-player"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getQuiz } from "@/lib/quiz-store"
import type { Quiz } from "@/lib/quiz-types"

interface Props {
  params: Promise<{ id: string }>
}

export default function QuizPage({ params }: Props) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    // Handle params promise
    params.then(({ id: quizId }) => {
      setId(quizId)
      const loadedQuiz = getQuiz(quizId)
      if (!loadedQuiz) {
        setError("Quiz not found. Please check the quiz code and try again.")
      } else {
        setQuiz(loadedQuiz)
      }
      setIsLoading(false)
    }).catch(() => {
      setError("Error loading quiz")
      setIsLoading(false)
    })
  }, [params])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Quiz not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return <QuizPlayer quiz={quiz} />
}
