"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Clock,
  Lock,
  GripVertical,
  CircleDot,
  CheckSquare,
  TextCursorInput,
  Star,
} from "lucide-react"
import type { QuizQuestion, QuizSettings, QuestionType } from "@/lib/quiz-types"
import { DEFAULT_SETTINGS } from "@/lib/quiz-types"
import { saveQuiz, getShareableLink } from "@/lib/quiz-store"
import Link from "next/link"

function createEmptyQuestion(type: QuestionType = "single"): QuizQuestion {
  return {
    id: crypto.randomUUID(),
    type,
    question: "",
    options: type === "fill" ? [] : ["", "", "", ""],
    correctAnswers: type === "fill" ? [] : [0],
    correctText: "",
    marks: 1,
    timeLimit: 60,
  }
}

export function CreateQuizForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    createEmptyQuestion(),
  ])
  const [settings, setSettings] = useState<QuizSettings>({
    ...DEFAULT_SETTINGS,
  })
  const [publishedQuizId, setPublishedQuizId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  function addQuestion(type: QuestionType = "single") {
    setQuestions((prev) => [...prev, createEmptyQuestion(type)])
  }

  function removeQuestion(index: number) {
    if (questions.length <= 1) return
    setQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  function updateQuestion(index: number, updates: Partial<QuizQuestion>) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...updates } : q))
    )
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q
        const options = [...q.options]
        options[oIndex] = value
        return { ...q, options }
      })
    )
  }

  function toggleCorrectAnswer(qIndex: number, oIndex: number) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q
        if (q.type === "single") {
          return { ...q, correctAnswers: [oIndex] }
        }
        // multiple choice - toggle
        const exists = q.correctAnswers.includes(oIndex)
        const newAnswers = exists
          ? q.correctAnswers.filter((a) => a !== oIndex)
          : [...q.correctAnswers, oIndex]
        return { ...q, correctAnswers: newAnswers }
      })
    )
  }

  function validate(): string[] {
    const errs: string[] = []
    if (!title.trim()) errs.push("Quiz title is required")
    if (questions.length === 0) errs.push("At least one question is required")

    questions.forEach((q, i) => {
      if (!q.question.trim())
        errs.push(`Question ${i + 1}: Question text is required`)
      if (q.marks < 1) errs.push(`Question ${i + 1}: Marks must be at least 1`)

      if (q.type === "single" || q.type === "multiple") {
        const filledOptions = q.options.filter((o) => o.trim())
        if (filledOptions.length < 2)
          errs.push(`Question ${i + 1}: At least 2 options are required`)
        if (q.correctAnswers.length === 0)
          errs.push(`Question ${i + 1}: Select at least one correct answer`)
        q.correctAnswers.forEach((idx) => {
          if (!q.options[idx]?.trim())
            errs.push(
              `Question ${i + 1}: Correct answer option must not be empty`
            )
        })
      } else if (q.type === "fill") {
        if (!q.correctText.trim())
          errs.push(`Question ${i + 1}: The correct answer text is required`)
      }
    })

    if (settings.requirePassword && !settings.password.trim())
      errs.push("Password is required when password protection is enabled")

    return errs
  }

  function handlePublish() {
    const errs = validate()
    if (errs.length > 0) {
      setErrors(errs)
      return
    }
    setErrors([])

    const quiz = saveQuiz({
      title: title.trim(),
      description: description.trim(),
      settings,
      questions: questions.map((q) => ({
        ...q,
        options: q.type !== "fill" ? q.options.filter((o) => o.trim()) : [],
      })),
    })
    setPublishedQuizId(quiz.id)
  }

  function handleCopyLink() {
    if (!publishedQuizId) return
    const link = getShareableLink(publishedQuizId)
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0)

  const typeConfig: Record<
    QuestionType,
    { label: string; shortLabel: string; icon: typeof CircleDot; colorClass: string; activeClass: string }
  > = {
    single: {
      label: "Single Choice",
      shortLabel: "Single",
      icon: CircleDot,
      colorClass: "text-primary",
      activeClass: "border-primary bg-primary/10 text-primary",
    },
    multiple: {
      label: "Multiple Choice",
      shortLabel: "Multiple",
      icon: CheckSquare,
      colorClass: "text-chart-4",
      activeClass: "border-chart-4 bg-[oklch(0.6_0.2_310/0.1)] text-chart-4",
    },
    fill: {
      label: "Fill in the Blank",
      shortLabel: "Fill",
      icon: TextCursorInput,
      colorClass: "text-accent",
      activeClass: "border-accent bg-accent/15 text-accent",
    },
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Quiz Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Quiz Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              placeholder="Enter quiz title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="desc">Description (optional)</Label>
            <Textarea
              id="desc"
              placeholder="Describe the quiz..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-primary" />
            Quiz Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Total Time (minutes)
              </Label>
              <Input
                type="number"
                min={1}
                value={settings.totalTime / 60}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    totalTime: Number(e.target.value) * 60,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Per Question Time (seconds)
              </Label>
              <Input
                type="number"
                min={10}
                value={settings.perQuestionTime}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    perQuestionTime: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-2 font-medium">
                <Lock className="h-4 w-4 text-primary" />
                Password Protection
              </Label>
              <p className="text-sm text-muted-foreground">
                Require a password to take this quiz
              </p>
            </div>
            <Switch
              checked={settings.requirePassword}
              onCheckedChange={(checked) =>
                setSettings((s) => ({ ...s, requirePassword: checked }))
              }
            />
          </div>

          {settings.requirePassword && (
            <Input
              type="password"
              placeholder="Enter quiz password..."
              value={settings.password}
              onChange={(e) =>
                setSettings((s) => ({ ...s, password: e.target.value }))
              }
            />
          )}

          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
            <div className="flex flex-col gap-1">
              <Label className="flex items-center gap-2 font-medium">
                <Shield className="h-4 w-4 text-primary" />
                Anti-Cheat Protection
              </Label>
              <p className="text-sm text-muted-foreground">
                Block tab switching, right-click, and window changes. 3
                warnings, then auto-submit.
              </p>
            </div>
            <Switch
              checked={settings.antiCheat}
              onCheckedChange={(checked) =>
                setSettings((s) => ({ ...s, antiCheat: checked }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Expiry Date (optional)</Label>
            <Input
              type="datetime-local"
              value={settings.expiryDate}
              onChange={(e) =>
                setSettings((s) => ({ ...s, expiryDate: e.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Questions</h2>
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Star className="h-3.5 w-3.5" />
            Total: {totalMarks} marks
          </span>
        </div>

        {questions.map((q, qIndex) => {
          const cfg = typeConfig[q.type]
          const TypeIcon = cfg.icon
          return (
            <Card key={q.id} className="relative">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">
                    Question {qIndex + 1}
                  </CardTitle>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.activeClass}`}
                  >
                    <TypeIcon className="h-3 w-3" />
                    {cfg.shortLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                    <Star className="h-3 w-3" />
                    {q.marks} {q.marks === 1 ? "mark" : "marks"}
                  </span>
                </div>
                {questions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove question</span>
                  </Button>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Question Type Switcher */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm text-muted-foreground">
                    Question Type
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {(["single", "multiple", "fill"] as QuestionType[]).map(
                      (type) => {
                        const tc = typeConfig[type]
                        const Icon = tc.icon
                        const isActive = q.type === type
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              const updates: Partial<QuizQuestion> = { type }
                              if (type === "fill") {
                                updates.options = []
                                updates.correctAnswers = []
                              } else {
                                if (q.options.length === 0)
                                  updates.options = ["", "", "", ""]
                                if (type === "single")
                                  updates.correctAnswers = q.correctAnswers.length > 0 ? [q.correctAnswers[0]] : [0]
                              }
                              updateQuestion(qIndex, updates)
                            }}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                              isActive
                                ? tc.activeClass
                                : "border-border bg-card text-muted-foreground hover:border-muted-foreground/50"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {tc.label}
                          </button>
                        )
                      }
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <Textarea
                  placeholder={
                    q.type === "fill"
                      ? "Enter your question (use ___ to indicate the blank)..."
                      : "Enter your question..."
                  }
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(qIndex, { question: e.target.value })
                  }
                  rows={2}
                />

                {/* Single/Multiple Choice Options */}
                {(q.type === "single" || q.type === "multiple") && (
                  <div className="flex flex-col gap-3">
                    <Label className="text-sm text-muted-foreground">
                      {q.type === "single"
                        ? "Options (click radio to set the correct answer)"
                        : "Options (click checkboxes to set correct answers)"}
                    </Label>
                    {q.options.map((opt, oIndex) => {
                      const isCorrect = q.correctAnswers.includes(oIndex)
                      return (
                        <div key={oIndex} className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              toggleCorrectAnswer(qIndex, oIndex)
                            }
                            className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-colors ${
                              q.type === "single"
                                ? `rounded-full ${
                                    isCorrect
                                      ? "border-primary bg-primary"
                                      : "border-muted-foreground hover:border-primary"
                                  }`
                                : `rounded ${
                                    isCorrect
                                      ? "border-chart-4 bg-chart-4"
                                      : "border-muted-foreground hover:border-chart-4"
                                  }`
                            }`}
                            aria-label={`Mark option ${oIndex + 1} as correct`}
                          >
                            {isCorrect && (
                              <Check className="h-3 w-3 text-primary-foreground" />
                            )}
                          </button>
                          <Input
                            placeholder={`Option ${oIndex + 1}`}
                            value={opt}
                            onChange={(e) =>
                              updateOption(qIndex, oIndex, e.target.value)
                            }
                            className={
                              isCorrect
                                ? q.type === "single"
                                  ? "border-primary/50 bg-primary/5"
                                  : "border-chart-4/50 bg-[oklch(0.6_0.2_310/0.05)]"
                                : ""
                            }
                          />
                          {q.options.length > 2 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                              onClick={() => {
                                const newOptions = q.options.filter(
                                  (_, i) => i !== oIndex
                                )
                                const newCorrect = q.correctAnswers
                                  .filter((a) => a !== oIndex)
                                  .map((a) => (a > oIndex ? a - 1 : a))
                                updateQuestion(qIndex, {
                                  options: newOptions,
                                  correctAnswers:
                                    newCorrect.length > 0
                                      ? newCorrect
                                      : [0],
                                })
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      )
                    })}
                    {q.options.length < 6 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="self-start text-muted-foreground"
                        onClick={() =>
                          updateQuestion(qIndex, {
                            options: [...q.options, ""],
                          })
                        }
                      >
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        Add Option
                      </Button>
                    )}
                  </div>
                )}

                {/* Fill in the Blank Answer */}
                {q.type === "fill" && (
                  <div className="flex flex-col gap-3">
                    <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
                      <p className="text-xs font-medium text-accent">
                        Tip: Use ___ (underscores) in your question to indicate
                        the blank. Separate multiple accepted answers with |
                        (pipe). Example: "red | crimson"
                      </p>
                    </div>
                    <Label className="text-sm text-muted-foreground">
                      Correct Answer(s)
                    </Label>
                    <Input
                      placeholder='Type correct answer(s)... e.g. "Paris" or "red | crimson"'
                      value={q.correctText}
                      onChange={(e) =>
                        updateQuestion(qIndex, {
                          correctText: e.target.value,
                        })
                      }
                      className="border-accent/50 bg-accent/5"
                    />
                    <p className="text-xs text-muted-foreground">
                      Matching is case-insensitive and trims whitespace.
                    </p>
                  </div>
                )}

                {/* Marks & Time */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3.5 w-3.5" />
                      Marks
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      value={q.marks}
                      onChange={(e) =>
                        updateQuestion(qIndex, {
                          marks: Math.max(1, Number(e.target.value)),
                        })
                      }
                      className="w-24"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      Time (seconds)
                    </Label>
                    <Input
                      type="number"
                      min={10}
                      value={q.timeLimit}
                      onChange={(e) =>
                        updateQuestion(qIndex, {
                          timeLimit: Number(e.target.value),
                        })
                      }
                      className="w-24"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => addQuestion("single")}
            className="flex flex-1 items-center gap-2"
          >
            <CircleDot className="h-4 w-4" />
            Single Choice
          </Button>
          <Button
            variant="outline"
            onClick={() => addQuestion("multiple")}
            className="flex flex-1 items-center gap-2"
          >
            <CheckSquare className="h-4 w-4" />
            Multiple Choice
          </Button>
          <Button
            variant="outline"
            onClick={() => addQuestion("fill")}
            className="flex flex-1 items-center gap-2 border-accent/50 text-accent hover:bg-accent/10 hover:text-accent"
          >
            <TextCursorInput className="h-4 w-4" />
            Fill in Blank
          </Button>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <Card className="mb-6 border-destructive bg-destructive/5">
          <CardContent className="flex flex-col gap-1 pt-4">
            {errors.map((err, i) => (
              <p key={i} className="text-sm text-destructive">
                {err}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Publish */}
      <div className="flex items-center gap-4">
        <Button onClick={handlePublish} size="lg" className="flex-1">
          Publish Quiz
        </Button>
        <Link href="/">
          <Button variant="outline" size="lg">
            Cancel
          </Button>
        </Link>
      </div>

      {/* Published Dialog */}
      <Dialog
        open={!!publishedQuizId}
        onOpenChange={(open) => {
          if (!open) setPublishedQuizId(null)
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Quiz Published Successfully!
            </DialogTitle>
            <DialogDescription>
              Share this link with your students to take the quiz.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={
                  publishedQuizId ? getShareableLink(publishedQuizId) : ""
                }
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-accent" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">Copy link</span>
              </Button>
            </div>
            {copied && (
              <p className="text-sm font-medium text-accent">
                Link copied to clipboard!
              </p>
            )}
            <div className="flex items-center gap-3">
              <Link href={`/quiz/${publishedQuizId}`} className="flex-1">
                <Button
                  variant="outline"
                  className="flex w-full items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Quiz
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
