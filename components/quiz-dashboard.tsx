"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Clock,
  Shield,
  Lock,
  FileQuestion,
  CircleDot,
  CheckSquare,
  TextCursorInput,
  BarChart3,
  Star,
} from "lucide-react"
import type { Quiz } from "@/lib/quiz-types"
import { getAllQuizzes, deleteQuiz, getShareableLink } from "@/lib/quiz-store"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function QuizDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    setQuizzes(getAllQuizzes())
  }, [])

  function handleDelete(id: string) {
    deleteQuiz(id)
    setQuizzes(getAllQuizzes())
  }

  function handleCopy(id: string) {
    const link = getShareableLink(id)
    navigator.clipboard.writeText(link)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (quizzes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          No quizzes yet
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first quiz to get started.
        </p>
        <Link href="/create" className="mt-4">
          <Button>Create Your First Quiz</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => {
        const totalMarks = quiz.questions.reduce((s, q) => s + q.marks, 0)
        const singleCount = quiz.questions.filter((q) => q.type === "single").length
        const multiCount = quiz.questions.filter((q) => q.type === "multiple").length
        const fillCount = quiz.questions.filter((q) => q.type === "fill").length

        return (
          <Card key={quiz.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-balance text-base leading-relaxed">
                {quiz.title}
              </CardTitle>
              {quiz.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {quiz.description}
                </p>
              )}
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                  <FileQuestion className="h-3 w-3" />
                  {quiz.questions.length} Q
                </span>
                <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                  <Star className="h-3 w-3" />
                  {totalMarks} marks
                </span>
                {singleCount > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                    <CircleDot className="h-3 w-3" />
                    {singleCount} Single
                  </span>
                )}
                {multiCount > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-chart-4/10 px-2 py-1 text-xs text-chart-4">
                    <CheckSquare className="h-3 w-3" />
                    {multiCount} Multi
                  </span>
                )}
                {fillCount > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-1 text-xs text-accent">
                    <TextCursorInput className="h-3 w-3" />
                    {fillCount} Fill
                  </span>
                )}
                <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                  <Clock className="h-3 w-3" />
                  {quiz.settings.totalTime / 60}m
                </span>
                {quiz.settings.antiCheat && (
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                    <Shield className="h-3 w-3" />
                    Anti-cheat
                  </span>
                )}
                {quiz.settings.requirePassword && (
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                    <Lock className="h-3 w-3" />
                    Locked
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Created {formatDate(quiz.createdAt)}
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(quiz.id)}
                  className="flex items-center gap-1"
                >
                  {copiedId === quiz.id ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copiedId === quiz.id ? "Copied" : "Copy Link"}
                </Button>
                <Link href={`/quiz/${quiz.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open
                  </Button>
                </Link>
                <Link href={`/results/${quiz.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <BarChart3 className="h-3 w-3" />
                    Results
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="sr-only">Delete quiz</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &ldquo;{quiz.title}
                        &rdquo;? This will also delete all results and cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(quiz.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
