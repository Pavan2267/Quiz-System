"use client"

import { Trophy, Medal } from "lucide-react"
import type { QuizAttempt } from "@/lib/quiz-types"
import { getGrade, getGradeColor } from "@/lib/results-utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface QuizLeaderboardProps {
  attempts: QuizAttempt[]
  showTop?: number
  compact?: boolean
}

export function QuizLeaderboard({ 
  attempts, 
  showTop = 10,
  compact = false
}: QuizLeaderboardProps) {
  if (attempts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Trophy className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No attempts yet</p>
        </CardContent>
      </Card>
    )
  }

  const topAttempts = attempts.slice(0, showTop)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          Leaderboard
        </CardTitle>
        <CardDescription>Top performers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {topAttempts.map((attempt, index) => {
            const percentage = (attempt.score / attempt.totalMarks) * 100
            const grade = getGrade(percentage)
            const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`

            if (compact) {
              return (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-3 hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-foreground w-6">{medal}</span>
                    <div>
                      <p className="font-medium text-foreground text-sm">{attempt.studentName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      {attempt.score}/{attempt.totalMarks}
                    </p>
                    <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              )
            }

            return (
              <div
                key={attempt.id}
                className={`rounded-lg border border-border p-4 transition-colors ${
                  index === 0
                    ? "bg-yellow-50/50 dark:bg-yellow-950/10"
                    : index === 1
                      ? "bg-gray-50/50 dark:bg-gray-900/10"
                      : index === 2
                        ? "bg-orange-50/50 dark:bg-orange-950/10"
                        : ""
                } hover:bg-muted/50`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl font-bold text-foreground">{medal}</span>
                    <div>
                      <p className="font-semibold text-foreground">{attempt.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(attempt.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-lg font-bold text-foreground">
                          {attempt.score}/{attempt.totalMarks}
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground">
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                      <span className={`text-xl font-bold ${getGradeColor(grade)}`}>
                        {grade}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
