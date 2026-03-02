// Dummy quiz codes for validation (in a real app, these would come from a backend)
const AVAILABLE_QUIZ_CODES: Record<string, { id: string; title: string }> = {
  "QUIZ001": { id: "quiz_abc123_1", title: "General Knowledge" },
  "QUIZ002": { id: "quiz_def456_1", title: "Mathematics" },
  "QUIZ003": { id: "quiz_ghi789_1", title: "Science Basics" },
  "DEMO1234": { id: "quiz_demo001_1", title: "Sample Quiz" },
}

export interface JoinQuizData {
  quizCode: string
  userName: string
}

export function validateQuizCode(code: string): boolean {
  return code.toUpperCase() in AVAILABLE_QUIZ_CODES
}

export function getQuizByCode(code: string): { id: string; title: string } | null {
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

// Initialize sample quizzes in localStorage (for demo purposes)
export function initializeSampleQuizzes(): void {
  if (typeof window === "undefined") return
  const listRaw = localStorage.getItem("quiz_list")
  const list: string[] = listRaw ? JSON.parse(listRaw) : []
  
  // Only initialize if no quizzes exist
  if (list.length === 0) {
    const sampleQuizzes = [
      {
        id: "quiz_abc123_1",
        title: "General Knowledge",
        description: "Test your general knowledge",
        createdAt: new Date().toISOString(),
        settings: {
          totalTime: 600,
          perQuestionTime: 30,
          requirePassword: false,
          password: "",
          expiryDate: "2025-12-31",
          antiCheat: true,
          maxWarnings: 3,
        },
        questions: [],
      },
      {
        id: "quiz_def456_1",
        title: "Mathematics",
        description: "Math quiz for all levels",
        createdAt: new Date().toISOString(),
        settings: {
          totalTime: 600,
          perQuestionTime: 30,
          requirePassword: false,
          password: "",
          expiryDate: "2025-12-31",
          antiCheat: true,
          maxWarnings: 3,
        },
        questions: [],
      },
    ]
    
    sampleQuizzes.forEach((quiz) => {
      localStorage.setItem(`quiz_${quiz.id}`, JSON.stringify(quiz))
      list.push(quiz.id)
    })
    
    localStorage.setItem("quiz_list", JSON.stringify(list))
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
