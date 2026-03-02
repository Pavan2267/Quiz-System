"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Trophy, Users, TrendingUp, AlertCircle } from "lucide-react"
import type { Quiz, QuizAttempt } from "@/lib/quiz-types"
import { getQuiz, getAttemptsByQuiz } from "@/lib/quiz-store"
import { calculateResultsStats, exportToExcel, getGrade, getGradeColor } from "@/lib/results-utils"

interface Props {
  params: Promise<{ id: string }>
}

export default function ResultsPage({ params }: Props) {
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    params.then(({ id: quizId }) => {
      setId(quizId)
      const loadedQuiz = getQuiz(quizId)
      if (loadedQuiz) {
        setQuiz(loadedQuiz)
        const quizAttempts = getAttemptsByQuiz(quizId)
        setAttempts(quizAttempts)
      }
      setIsLoading(false)
    }).catch(() => {
      setIsLoading(false)
    })
  }, [params])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading results...</p>
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

  const stats = calculateResultsStats(attempts)

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-foreground">{quiz.title}</h1>
            <p className="text-sm text-muted-foreground">Results & Analytics</p>
          </div>
          {attempts.length > 0 && (
            <Button
              onClick={() => {
                const filename = `${quiz.title.replace(/\s+/g, "_")}_results_${new Date().toISOString().split("T")[0]}.xlsx`
                exportToExcel(quiz, attempts, filename)
              }}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Excel
            </Button>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {attempts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">No Attempts Yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Students haven't attempted this quiz yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="leaderboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leaderboard" className="space-y-4">
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Rank</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Student Name</th>
                      <th className="px-4 py-3 text-center font-semibold text-foreground">Score</th>
                      <th className="px-4 py-3 text-center font-semibold text-foreground">Percentage</th>
                      <th className="px-4 py-3 text-center font-semibold text-foreground">Grade</th>
                      <th className="px-4 py-3 text-center font-semibold text-foreground">Time Taken</th>
                      <th className="px-4 py-3 text-center font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((attempt, index) => {
                      const percentage = (attempt.score / attempt.totalMarks) * 100
                      const grade = getGrade(percentage)
                      const isPassed = percentage >= 50

                      return (
                        <tr
                          key={attempt.id}
                          className={`border-b border-border transition-colors ${
                            index === 0 ? "bg-yellow-50 dark:bg-yellow-950/20" : index === 1 ? "bg-gray-50 dark:bg-gray-900/20" : index === 2 ? "bg-orange-50 dark:bg-orange-950/20" : ""
                          } hover:bg-muted/50`}
                        >
                          <td className="px-4 py-3">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-foreground">{attempt.studentName}</td>
                          <td className="px-4 py-3 text-center text-foreground font-semibold">
                            {attempt.score}/{attempt.totalMarks}
                          </td>
                          <td className="px-4 py-3 text-center text-foreground">
                            {percentage.toFixed(2)}%
                          </td>
                          <td className={`px-4 py-3 text-center font-bold ${getGradeColor(grade)}`}>
                            {grade}
                          </td>
                          <td className="px-4 py-3 text-center text-foreground">{attempt.timeTaken}</td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                isPassed
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                            >
                              {isPassed ? "PASSED" : "FAILED"}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Attempts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-foreground">{stats.totalAttempts}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-foreground">{stats.averageScore}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Highest Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">{stats.highestScore}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Lowest Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-red-600">{stats.lowestScore}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Passing Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">{stats.passingPercentage}%</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>Overview of student performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Total Attempts:</span>
                      <span className="text-sm text-muted-foreground">{stats.totalAttempts} students</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Passed (≥50%):</span>
                      <span className="text-sm text-green-600 font-semibold">{stats.passingAttempts} students ({stats.passingPercentage}%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Failed (&lt;50%):</span>
                      <span className="text-sm text-red-600 font-semibold">{stats.totalAttempts - stats.passingAttempts} students ({100 - stats.passingPercentage}%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  )
}
