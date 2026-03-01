export type QuestionType = "single" | "multiple" | "fill"

export interface QuizQuestion {
  id: string
  type: QuestionType
  question: string
  options: string[]
  correctAnswers: number[] // indices for single/multiple choice
  correctText: string // for fill-in-the-blank (pipe-separated for multiple accepted answers)
  marks: number
  timeLimit: number // seconds per question
}

export interface QuizSettings {
  totalTime: number // seconds
  perQuestionTime: number // seconds
  requirePassword: boolean
  password: string
  expiryDate: string
  antiCheat: boolean
  maxWarnings: number
}

export interface Quiz {
  id: string
  title: string
  description: string
  createdAt: string
  settings: QuizSettings
  questions: QuizQuestion[]
}

export interface QuizAttempt {
  id: string
  quizId: string
  studentName: string
  answers: Record<string, number[] | string> // number[] for single/multiple, string for fill
  startedAt: string
  completedAt: string
  warnings: number
  autoSubmitted: boolean
  score: number
  totalMarks: number
  timeTaken: string // "MM:SS" format
}

export const DEFAULT_SETTINGS: QuizSettings = {
  totalTime: 600,
  perQuestionTime: 60,
  requirePassword: false,
  password: "",
  expiryDate: "",
  antiCheat: true,
  maxWarnings: 3,
}
