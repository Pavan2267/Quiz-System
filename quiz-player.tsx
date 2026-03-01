"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  User,
  Lock,
  ChevronLeft,
  ChevronRight,
  TextCursorInput,
  CircleDot,
  CheckSquare,
  Star,
} from "lucide-react"
import type { Quiz, QuizAttempt, QuizQuestion } from "@/lib/quiz-types"
import { saveAttempt } from "@/lib/quiz-store"
import { useAntiCheat } from "@/hooks/use-anti-cheat"
import { WarningModal } from "@/components/warning-modal"

type Phase = "intro" | "password" | "quiz" | "result"

interface QuizPlayerProps {
  quiz: Quiz
}

function isCorrectForQuestion(
  q: QuizQuestion,
  answer: number[] | string | undefined
): boolean {
  if (answer === undefined) return false
  if (q.type === "fill") {
    if (typeof answer !== "string") return false
    const accepted = q.correctText
      .split("|")
      .map((s) => s.trim().toLowerCase())
    return accepted.includes(answer.trim().toLowerCase())
  }
  // single or multiple
  if (!Array.isArray(answer)) return false
  if (answer.length !== q.correctAnswers.length) return false
  const sortedA = [...answer].sort()
  const sortedC = [...q.correctAnswers].sort()
  return sortedA.every((v, i) => v === sortedC[i])
}

function calculateScore(
  questions: QuizQuestion[],
  answers: Record<string, number[] | string>
): number {
  let score = 0
  questions.forEach((q) => {
    if (isCorrectForQuestion(q, answers[q.id])) {
      score += q.marks
    }
  })
  return score
}

export function QuizPlayer({ quiz }: QuizPlayerProps) {
  const [phase, setPhase] = useState<Phase>("intro")
  const [studentName, setStudentName] = useState("")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number[] | string>>({})
  const [totalTimeLeft, setTotalTimeLeft] = useState(quiz.settings.totalTime)
  const [questionTimeLeft, setQuestionTimeLeft] = useState(
    quiz.questions[0]?.timeLimit || 60
  )
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const startTimeRef = useRef<Date | null>(null)

  // Warning modal state
  const [warningOpen, setWarningOpen] = useState(false)
  const [warningReason, setWarningReason] = useState("")
  const [warningCount, setWarningCount] = useState(0)
  const [autoSubmitted, setAutoSubmitted] = useState(false)

  const totalMarks = quiz.questions.reduce((sum, q) => sum + q.marks, 0)

  function getTimeTaken(): string {
    if (!startTimeRef.current) return "00:00"
    const diff = Math.floor(
      (Date.now() - startTimeRef.current.getTime()) / 1000
    )
    const m = Math.floor(diff / 60)
    const s = diff % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const handleSubmit = useCallback(() => {
    const score = calculateScore(quiz.questions, answers)
    const result: QuizAttempt = {
      id: crypto.randomUUID(),
      quizId: quiz.id,
      studentName,
      answers,
      startedAt: startTimeRef.current?.toISOString() || new Date().toISOString(),
      completedAt: new Date().toISOString(),
      warnings: warningCount,
      autoSubmitted: false,
      score,
      totalMarks,
      timeTaken: getTimeTaken(),
    }
    saveAttempt(result)
    setAttempt(result)
    setPhase("result")
  }, [quiz, answers, studentName, warningCount, totalMarks])

  const handleAutoSubmit = useCallback(() => {
    setAutoSubmitted(true)
    setWarningOpen(true)

    const score = calculateScore(quiz.questions, answers)
    const result: QuizAttempt = {
      id: crypto.randomUUID(),
      quizId: quiz.id,
      studentName,
      answers,
      startedAt: startTimeRef.current?.toISOString() || new Date().toISOString(),
      completedAt: new Date().toISOString(),
      warnings: quiz.settings.maxWarnings,
      autoSubmitted: true,
      score,
      totalMarks,
      timeTaken: getTimeTaken(),
    }
    saveAttempt(result)
    setAttempt(result)
  }, [quiz, answers, studentName, totalMarks])

  const handleWarning = useCallback(
    (count: number, reason: string) => {
      setWarningCount(count)
      setWarningReason(reason)
      setWarningOpen(true)
    },
    []
  )

  const { warnings } = useAntiCheat({
    enabled: phase === "quiz" && quiz.settings.antiCheat,
    maxWarnings: quiz.settings.maxWarnings,
    onWarning: handleWarning,
    onMaxWarnings: handleAutoSubmit,
  })

  // Total timer
  useEffect(() => {
    if (phase !== "quiz") return
    if (totalTimeLeft <= 0) {
      handleSubmit()
      return
    }
    const interval = setInterval(() => {
      setTotalTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [phase, totalTimeLeft, handleSubmit])

  // Per-question timer
  useEffect(() => {
    if (phase !== "quiz") return
    setQuestionTimeLeft(quiz.questions[currentQuestion]?.timeLimit || 60)
  }, [currentQuestion, phase, quiz.questions])

  useEffect(() => {
    if (phase !== "quiz") return
    if (questionTimeLeft <= 0) {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
      }
      return
    }
    const interval = setInterval(() => {
      setQuestionTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [phase, questionTimeLeft, currentQuestion, quiz.questions.length])

  function handleStart() {
    if (!studentName.trim()) return
    startTimeRef.current = new Date()
    if (quiz.settings.requirePassword) {
      setPhase("password")
    } else {
      setPhase("quiz")
    }
  }

  function handlePasswordSubmit() {
    if (password === quiz.settings.password) {
      setPasswordError("")
      setPhase("quiz")
    } else {
      setPasswordError("Incorrect password")
    }
  }

  function selectSingleAnswer(questionId: string, optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: [optionIndex] }))
  }

  function toggleMultipleAnswer(questionId: string, optionIndex: number) {
    setAnswers((prev) => {
      const current = prev[questionId]
      const arr = Array.isArray(current) ? [...current] : []
      const idx = arr.indexOf(optionIndex)
      if (idx >= 0) {
        arr.splice(idx, 1)
      } else {
        arr.push(optionIndex)
      }
      return { ...prev, [questionId]: arr }
    })
  }

  function setTextAnswer(questionId: string, text: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: text }))
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const typeIcons: Record<string, typeof CircleDot> = {
    single: CircleDot,
    multiple: CheckSquare,
    fill: TextCursorInput,
  }
  const typeLabels: Record<string, string> = {
    single: "Single Choice",
    multiple: "Multiple Choice",
    fill: "Fill in the Blank",
  }

  // === INTRO PHASE ===
  if (phase === "intro") {
    const singleCount = quiz.questions.filter((q) => q.type === "single").length
    const multiCount = quiz.questions.filter((q) => q.type === "multiple").length
    const fillCount = quiz.questions.filter((q) => q.type === "fill").length

    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
            {quiz.description && (
              <p className="mt-2 text-muted-foreground">{quiz.description}</p>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-secondary/50 p-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Time: {formatTime(quiz.settings.totalTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>{quiz.questions.length} questions</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <span>Total marks: {totalMarks}</span>
              </div>
              {(singleCount > 0 || multiCount > 0 || fillCount > 0) && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {singleCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      <CircleDot className="h-3 w-3" />
                      {singleCount} Single
                    </span>
                  )}
                  {multiCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-chart-4/10 px-2 py-0.5 text-xs text-chart-4">
                      <CheckSquare className="h-3 w-3" />
                      {multiCount} Multiple
                    </span>
                  )}
                  {fillCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                      <TextCursorInput className="h-3 w-3" />
                      {fillCount} Fill
                    </span>
                  )}
                </div>
              )}
              {quiz.settings.antiCheat && (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>
                    Anti-cheat enabled ({quiz.settings.maxWarnings} warnings
                    max)
                  </span>
                </div>
              )}
              {quiz.settings.requirePassword && (
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span>Password protected</span>
                </div>
              )}
            </div>

            {quiz.settings.antiCheat && (
              <div className="rounded-lg border border-warning/50 bg-warning/10 p-3 text-sm">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-warning-foreground">
                      Anti-Cheat Notice
                    </span>
                    <span className="text-muted-foreground">
                      Tab switching, right-click, and window changes are
                      blocked. You will receive {quiz.settings.maxWarnings}{" "}
                      warnings before auto-submission.
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Your Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name..."
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
              />
            </div>

            <Button
              onClick={handleStart}
              size="lg"
              disabled={!studentName.trim()}
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // === PASSWORD PHASE ===
  if (phase === "password") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="mx-auto h-10 w-10 text-primary" />
            <CardTitle className="mt-2 text-xl">Password Required</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="quizPassword">Quiz Password</Label>
              <Input
                id="quizPassword"
                type="password"
                placeholder="Enter quiz password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
              />
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
            </div>
            <Button onClick={handlePasswordSubmit}>Enter Quiz</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // === RESULT PHASE ===
  if (phase === "result" && attempt) {
    const percentage = Math.round(
      (attempt.score / attempt.totalMarks) * 100
    )
    const correctCount = quiz.questions.filter((q) =>
      isCorrectForQuestion(q, attempt.answers[q.id])
    ).length
    const wrongCount = quiz.questions.length - correctCount

    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${percentage >= 50 ? "bg-accent/20" : "bg-destructive/20"}`}
            >
              {percentage >= 50 ? (
                <CheckCircle2 className="h-8 w-8 text-accent" />
              ) : (
                <XCircle className="h-8 w-8 text-destructive" />
              )}
            </div>
            <CardTitle className="mt-3 text-2xl">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground">
                {attempt.score}/{attempt.totalMarks}
              </p>
              <p className="text-lg text-muted-foreground">{percentage}%</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center rounded-lg border border-border p-3">
                <span className="text-2xl font-bold text-accent">
                  {correctCount}
                </span>
                <span className="text-xs text-muted-foreground">Correct</span>
              </div>
              <div className="flex flex-col items-center rounded-lg border border-border p-3">
                <span className="text-2xl font-bold text-destructive">
                  {wrongCount}
                </span>
                <span className="text-xs text-muted-foreground">Wrong</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-lg border border-border p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Student</span>
                <span className="font-medium text-foreground">
                  {attempt.studentName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Taken</span>
                <span className="font-mono font-medium text-foreground">
                  {attempt.timeTaken}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Warnings</span>
                <span
                  className={`font-medium ${attempt.warnings > 0 ? "text-destructive" : "text-foreground"}`}
                >
                  {attempt.warnings}/{quiz.settings.maxWarnings}
                </span>
              </div>
              {attempt.autoSubmitted && (
                <div className="mt-2 rounded bg-destructive/10 p-2 text-center text-destructive">
                  Auto-submitted due to excessive warnings
                </div>
              )}
            </div>

            {/* Question Review */}
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-foreground">Review</h3>
              {quiz.questions.map((q, i) => {
                const selected = attempt.answers[q.id]
                const correct = isCorrectForQuestion(q, selected)
                const QIcon = typeIcons[q.type] || CircleDot
                return (
                  <div
                    key={q.id}
                    className={`rounded-lg border p-3 ${correct ? "border-accent/50 bg-accent/5" : "border-destructive/50 bg-destructive/5"}`}
                  >
                    <div className="flex items-start gap-2">
                      {correct ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      ) : (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                      )}
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {i + 1}. {q.question}
                          </p>
                          <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            <QIcon className="h-2.5 w-2.5" />
                            {typeLabels[q.type]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">
                            {correct ? `+${q.marks}` : "0"}/{q.marks} marks
                          </span>
                        </div>
                        {q.type === "fill" ? (
                          <>
                            <p className="text-xs text-muted-foreground">
                              Your answer:{" "}
                              {typeof selected === "string" && selected.trim()
                                ? selected
                                : "Not answered"}
                            </p>
                            {!correct && (
                              <p className="text-xs font-medium text-accent">
                                Correct: {q.correctText}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-muted-foreground">
                              Your answer:{" "}
                              {Array.isArray(selected) && selected.length > 0
                                ? selected
                                    .map(
                                      (idx) =>
                                        q.options[idx] || "?"
                                    )
                                    .join(", ")
                                : "Not answered"}
                            </p>
                            {!correct && (
                              <p className="text-xs font-medium text-accent">
                                Correct:{" "}
                                {q.correctAnswers
                                  .map((idx) => q.options[idx])
                                  .join(", ")}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // === QUIZ PHASE ===
  const question = quiz.questions[currentQuestion]
  if (!question) return null

  const progressPercent =
    ((currentQuestion + 1) / quiz.questions.length) * 100
  const timePercent = (totalTimeLeft / quiz.settings.totalTime) * 100
  const qTimePercent =
    (questionTimeLeft / (question.timeLimit || 60)) * 100

  const currentAnswer = answers[question.id]
  const QTypeIcon = typeIcons[question.type] || CircleDot

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              {currentQuestion + 1}/{quiz.questions.length}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">
              <Star className="h-3 w-3" />
              {question.marks} {question.marks === 1 ? "mark" : "marks"}
            </span>
            {quiz.settings.antiCheat && (
              <div className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs">
                <Shield className="h-3 w-3 text-primary" />
                <span className="text-foreground">
                  {warnings}/{quiz.settings.maxWarnings}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span
                className={`font-mono text-sm font-bold ${totalTimeLeft < 60 ? "text-destructive" : "text-foreground"}`}
              >
                {formatTime(totalTimeLeft)}
              </span>
            </div>
          </div>
        </div>
        <Progress value={progressPercent} className="h-1 rounded-none" />
      </header>

      {/* Question content */}
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6">
        {/* Question timer */}
        <div className="mb-4 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                qTimePercent < 30 ? "bg-destructive" : "bg-primary"
              }`}
              style={{ width: `${qTimePercent}%` }}
            />
          </div>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {questionTimeLeft}s
          </span>
        </div>

        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl leading-relaxed">
                {question.question}
              </CardTitle>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <QTypeIcon className="h-3 w-3" />
                {typeLabels[question.type]}
              </span>
            </div>
            {question.type === "multiple" && (
              <p className="text-sm text-muted-foreground">
                Select all correct answers
              </p>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {/* Single Choice */}
            {question.type === "single" &&
              question.options.map((opt, oIndex) => {
                const isSelected =
                  Array.isArray(currentAnswer) &&
                  currentAnswer.includes(oIndex)
                return (
                  <button
                    key={oIndex}
                    type="button"
                    onClick={() =>
                      selectSingleAnswer(question.id, oIndex)
                    }
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground text-muted-foreground"
                      }`}
                    >
                      {String.fromCharCode(65 + oIndex)}
                    </span>
                    <span className="text-sm">{opt}</span>
                  </button>
                )
              })}

            {/* Multiple Choice */}
            {question.type === "multiple" &&
              question.options.map((opt, oIndex) => {
                const isSelected =
                  Array.isArray(currentAnswer) &&
                  currentAnswer.includes(oIndex)
                return (
                  <button
                    key={oIndex}
                    type="button"
                    onClick={() =>
                      toggleMultipleAnswer(question.id, oIndex)
                    }
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                      isSelected
                        ? "border-chart-4 bg-[oklch(0.6_0.2_310/0.1)] text-foreground"
                        : "border-border bg-card text-foreground hover:border-chart-4/50 hover:bg-secondary"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border-2 text-sm font-semibold ${
                        isSelected
                          ? "border-chart-4 bg-chart-4 text-primary-foreground"
                          : "border-muted-foreground text-muted-foreground"
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        String.fromCharCode(65 + oIndex)
                      )}
                    </span>
                    <span className="text-sm">{opt}</span>
                  </button>
                )
              })}

            {/* Fill in the Blank */}
            {question.type === "fill" && (
              <div className="flex flex-col gap-4">
                <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                  <p className="text-sm text-muted-foreground">
                    Type your answer below:
                  </p>
                </div>
                <Input
                  placeholder="Type your answer here..."
                  value={
                    typeof currentAnswer === "string" ? currentAnswer : ""
                  }
                  onChange={(e) =>
                    setTextAnswer(question.id, e.target.value)
                  }
                  className="border-accent/50 text-lg"
                  autoFocus
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <Button onClick={handleSubmit} className="flex items-center gap-2">
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Question dots navigation */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {quiz.questions.map((q, i) => {
            const ans = answers[q.id]
            const isAnswered =
              ans !== undefined &&
              ((Array.isArray(ans) && ans.length > 0) ||
                (typeof ans === "string" && ans.trim() !== ""))
            const isCurrent = i === currentQuestion
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(i)}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : isAnswered
                      ? "bg-accent/20 text-accent"
                      : "bg-secondary text-muted-foreground"
                }`}
                aria-label={`Go to question ${i + 1}`}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* Warning Modal */}
      <WarningModal
        open={warningOpen}
        onClose={() => {
          setWarningOpen(false)
          if (autoSubmitted && attempt) {
            setPhase("result")
          }
        }}
        warningCount={warningCount}
        maxWarnings={quiz.settings.maxWarnings}
        reason={warningReason}
        autoSubmitted={autoSubmitted}
      />
    </div>
  )
}
