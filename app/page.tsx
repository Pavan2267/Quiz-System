import { QuizDashboard } from "@/components/quiz-dashboard"
import { HomeContent } from "@/components/home-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "QuizGuard - Secure Quiz Platform",
  description:
    "Create and share quizzes with built-in anti-cheat protection. Block tab switching, right-click, and more.",
}

export default function HomePage() {
  return (
    <HomeContent />
  )
}
