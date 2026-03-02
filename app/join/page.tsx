import { JoinQuizForm } from "@/components/join-quiz-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Join Quiz - QuizGuard",
  description: "Join a quiz by pasting the shareable link from your instructor.",
}

export default function JoinPage() {
  return <JoinQuizForm />
}
