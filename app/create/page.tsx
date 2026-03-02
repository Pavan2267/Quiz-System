import { CreateQuizForm } from "@/components/create-quiz-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Quiz - QuizGuard",
  description: "Create a new quiz with custom questions and settings.",
}

export default function CreatePage() {
  return <CreateQuizForm />
}
