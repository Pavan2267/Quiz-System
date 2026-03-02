import { JoinQuizForm } from "@/components/join-quiz-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Join Quiz - QuizGuard",
  description: "Join a quiz by entering the quiz code and your name.",
}

export default function JoinPage() {
  return <JoinQuizForm />
}
