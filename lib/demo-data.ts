import type { Quiz, QuizAttempt } from "./quiz-types"

/**
 * Creates sample quiz data for demonstration purposes
 * This helps users see how the results and leaderboard features work
 */
export function createDemoQuiz(): Quiz {
  return {
    id: "demo_quiz_001",
    title: "College Physics Midterm",
    description: "Sample physics quiz showing how results and leaderboard work",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    settings: {
      totalTime: 1800, // 30 minutes
      perQuestionTime: 60,
      requirePassword: false,
      password: "",
      expiryDate: "2025-12-31",
      antiCheat: true,
      maxWarnings: 3,
    },
    questions: [
      {
        id: "q1",
        type: "single",
        question: "What is the SI unit of force?",
        options: ["Newton", "Joule", "Watt", "Pascal"],
        correctAnswers: [0],
        correctText: "Newton",
        marks: 1,
        timeLimit: 60,
      },
      {
        id: "q2",
        type: "multiple",
        question: "Which of the following are vector quantities?",
        options: ["Velocity", "Speed", "Acceleration", "Distance"],
        correctAnswers: [0, 2],
        correctText: "Velocity and Acceleration",
        marks: 2,
        timeLimit: 60,
      },
      {
        id: "q3",
        type: "fill",
        question: "The gravitational acceleration on Earth is approximately __ m/s²",
        options: [],
        correctAnswers: [],
        correctText: "9.8|10|9.81",
        marks: 1,
        timeLimit: 60,
      },
    ],
  }
}

/**
 * Creates sample student attempts for the demo quiz
 * Shows various score ranges to demonstrate leaderboard
 */
export function createDemoAttempts(): QuizAttempt[] {
  const baseTime = Date.now() - 5 * 24 * 60 * 60 * 1000 // 5 days ago
  const students = [
    { name: "Alice Johnson", score: 4, time: "08:32" },
    { name: "Bob Smith", score: 3, time: "10:15" },
    { name: "Charlie Brown", score: 4, time: "07:45" },
    { name: "Diana Prince", score: 2, time: "15:20" },
    { name: "Evan Davis", score: 3, time: "09:08" },
    { name: "Fiona Green", score: 1, time: "18:30" },
    { name: "George Wilson", score: 4, time: "08:00" },
    { name: "Hannah Lee", score: 3, time: "11:22" },
  ]

  return students.map((student, index) => ({
    id: `attempt_demo_${index}`,
    quizId: "demo_quiz_001",
    studentName: student.name,
    answers: {
      q1: [0],
      q2: [0, 2],
      q3: "9.8",
    },
    startedAt: new Date(baseTime + index * 3600000).toISOString(),
    completedAt: new Date(baseTime + index * 3600000 + 30 * 60000).toISOString(),
    warnings: 0,
    autoSubmitted: false,
    score: student.score,
    totalMarks: 4,
    timeTaken: student.time,
  }))
}

/**
 * Initializes demo data in localStorage for testing
 * Only runs if demo data doesn't already exist
 */
export function initializeDemoData(): void {
  if (typeof window === "undefined") return

  const demoQuizKey = "quiz_demo_quiz_001"
  
  // Check if demo data already exists
  if (localStorage.getItem(demoQuizKey)) {
    return // Demo data already initialized
  }

  // Create and save demo quiz
  const demoQuiz = createDemoQuiz()
  localStorage.setItem(demoQuizKey, JSON.stringify(demoQuiz))

  // Add to quiz list
  const listRaw = localStorage.getItem("quiz_list")
  const list: string[] = listRaw ? JSON.parse(listRaw) : []
  if (!list.includes("demo_quiz_001")) {
    list.push("demo_quiz_001")
    localStorage.setItem("quiz_list", JSON.stringify(list))
  }

  // Create and save demo attempts
  const demoAttempts = createDemoAttempts()
  demoAttempts.forEach((attempt) => {
    const key = `attempt_${attempt.quizId}_${attempt.id}`
    localStorage.setItem(key, JSON.stringify(attempt))
  })
}
