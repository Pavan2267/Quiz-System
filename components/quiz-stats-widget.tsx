"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, Award, Clock } from "lucide-react"
import type { Quiz, QuizAttempt } from "@/lib/quiz-types"
import { getAttemptsByQuiz } from "@/lib/quiz-store"
import { calculateResultsStats } from "@/lib/results-utils"

interface QuizStatsWidgetProps {
  quiz: Quiz
}

export function QuizStatsWidget({ quiz }: QuizStatsWidgetProps) {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [stats, setStats] = useState<ReturnType<typeof calculateResultsStats> | null>(null)

  useEffect(() => {
    const quizAttempts = getAttemptsByQuiz(quiz.id)
    setAttempts(quizAttempts)
    if (quizAttempts.length > 0) {
      setStats(calculateResultsStats(quizAttempts))
    }
  }, [quiz.id])

  if (!stats || attempts.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-4">
          <p className="text-xs text-muted-foreground">No attempts yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Attempts</p>
              <p className="text-xl font-bold text-foreground">{stats.totalAttempts}</p>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Avg Score</p>
              <p className="text-xl font-bold text-foreground">{stats.averageScore}</p>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pass Rate</p>
              <p className="text-xl font-bold text-green-600">{stats.passingPercentage}%</p>
            </div>
            <Award className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Highest</p>
              <p className="text-xl font-bold text-foreground">{stats.highestScore}</p>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
