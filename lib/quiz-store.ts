import type { Quiz, QuizAttempt } from "./quiz-types"

function generateId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let result = "quiz_"
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result + "_" + Date.now().toString(36)
}

export function saveQuiz(quiz: Omit<Quiz, "id" | "createdAt">): Quiz {
  const id = generateId()
  const fullQuiz: Quiz = {
    ...quiz,
    id,
    createdAt: new Date().toISOString(),
  }
  if (typeof window !== "undefined") {
    localStorage.setItem(`quiz_${id}`, JSON.stringify(fullQuiz))
    const listRaw = localStorage.getItem("quiz_list")
    const list: string[] = listRaw ? JSON.parse(listRaw) : []
    list.push(id)
    localStorage.setItem("quiz_list", JSON.stringify(list))
  }
  return fullQuiz
}

export function getQuiz(quizId: string): Quiz | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(`quiz_${quizId}`)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Quiz
  } catch {
    return null
  }
}

export function getAllQuizzes(): Quiz[] {
  if (typeof window === "undefined") return []
  const listRaw = localStorage.getItem("quiz_list")
  if (!listRaw) return []
  try {
    const list: string[] = JSON.parse(listRaw)
    return list
      .map((id) => getQuiz(id))
      .filter((q): q is Quiz => q !== null)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  } catch {
    return []
  }
}

export function deleteQuiz(quizId: string): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(`quiz_${quizId}`)

  // Also remove all attempts for this quiz
  const keys = Object.keys(localStorage)
  keys.forEach((key) => {
    if (key.startsWith(`attempt_${quizId}_`)) {
      localStorage.removeItem(key)
    }
  })

  const listRaw = localStorage.getItem("quiz_list")
  if (listRaw) {
    try {
      const list: string[] = JSON.parse(listRaw)
      const filtered = list.filter((id) => id !== quizId)
      localStorage.setItem("quiz_list", JSON.stringify(filtered))
    } catch {
      // ignore
    }
  }
}

export function saveAttempt(attempt: QuizAttempt): void {
  if (typeof window === "undefined") return
  const key = `attempt_${attempt.quizId}_${attempt.id}`
  localStorage.setItem(key, JSON.stringify(attempt))
}

export function getAttemptsByQuiz(quizId: string): QuizAttempt[] {
  if (typeof window === "undefined") return []
  const attempts: QuizAttempt[] = []
  const keys = Object.keys(localStorage)
  keys.forEach((key) => {
    if (key.startsWith(`attempt_${quizId}_`)) {
      try {
        const raw = localStorage.getItem(key)
        if (raw) {
          attempts.push(JSON.parse(raw) as QuizAttempt)
        }
      } catch {
        // ignore
      }
    }
  })
  // Sort by score descending
  return attempts.sort((a, b) => b.score - a.score)
}

export function getShareableLink(quizId: string): string {
  // Use NEXT_PUBLIC_SITE_URL for production, fallback to window.location in development
  const baseUrl = 
    (typeof window !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) ||
    (typeof window !== "undefined" && window.location.origin) ||
    "http://localhost:3000"
  
  return `${baseUrl}/quiz/${quizId}`
}
