// Dummy quiz codes for validation (in a real app, these would come from a backend)
const AVAILABLE_QUIZ_CODES: Record<string, { quizId: string; title: string }> = {
  "QUIZ001": { quizId: "quiz_abc123", title: "General Knowledge" },
  "QUIZ002": { quizId: "quiz_def456", title: "Mathematics" },
  "QUIZ003": { quizId: "quiz_ghi789", title: "Science Basics" },
  "DEMO1234": { quizId: "quiz_demo001", title: "Sample Quiz" },
}

export interface JoinQuizData {
  quizCode: string
  userName: string
}

export function validateQuizCode(code: string): boolean {
  return code.toUpperCase() in AVAILABLE_QUIZ_CODES
}

export function getQuizByCode(code: string): { quizId: string; title: string } | null {
  const quiz = AVAILABLE_QUIZ_CODES[code.toUpperCase()]
  return quiz || null
}

export function saveJoinSession(data: JoinQuizData & { quizId: string }): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("joinQuizSession", JSON.stringify(data))
  }
}

export function getJoinSession(): (JoinQuizData & { quizId: string }) | null {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem("joinQuizSession")
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearJoinSession(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("joinQuizSession")
  }
}

export function getAvailableQuizCodes(): string[] {
  return Object.keys(AVAILABLE_QUIZ_CODES)
}
