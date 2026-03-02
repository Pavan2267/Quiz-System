import type { QuizAttempt, Quiz } from "./quiz-types"

export interface ResultsStats {
  totalAttempts: number
  averageScore: number
  highestScore: number
  lowestScore: number
  passingAttempts: number
  passingPercentage: number
}

export function calculateResultsStats(
  attempts: QuizAttempt[],
  passingPercentage: number = 50
): ResultsStats {
  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      passingAttempts: 0,
      passingPercentage: 0,
    }
  }

  const scores = attempts.map((a) => a.score)
  const totalMarks = attempts[0].totalMarks
  const passingMarks = (totalMarks * passingPercentage) / 100

  return {
    totalAttempts: attempts.length,
    averageScore: Math.round((scores.reduce((a, b) => a + b) / scores.length) * 100) / 100,
    highestScore: Math.max(...scores),
    lowestScore: Math.min(...scores),
    passingAttempts: attempts.filter((a) => a.score >= passingMarks).length,
    passingPercentage: Math.round((attempts.filter((a) => a.score >= passingMarks).length / attempts.length) * 100),
  }
}

export function exportToExcel(
  quiz: Quiz,
  attempts: QuizAttempt[],
  filename: string = "quiz-results.xlsx"
): void {
  try {
    // Dynamic import of xlsx to avoid server-side issues
    import("xlsx").then((XLSX) => {
      const totalMarks = attempts[0]?.totalMarks || 0
      
      // Prepare data for Excel
      const data = attempts.map((attempt, index) => {
        const percentage = ((attempt.score / totalMarks) * 100).toFixed(2)
        const status = parseFloat(percentage) >= 50 ? "PASSED" : "FAILED"
        const submitDate = new Date(attempt.completedAt).toLocaleString()
        
        return {
          Rank: index + 1,
          "Student Name": attempt.studentName,
          Score: attempt.score,
          "Total Marks": totalMarks,
          Percentage: percentage + "%",
          Status,
          "Time Taken": attempt.timeTaken,
          "Submitted At": submitDate,
        }
      })

      // Create workbook and add data
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Results")

      // Add summary sheet
      const summaryStats = calculateResultsStats(attempts)
      const summaryData = [
        { Metric: "Quiz Title", Value: quiz.title },
        { Metric: "Total Questions", Value: quiz.questions.length },
        { Metric: "Total Marks", Value: totalMarks },
        { Metric: "Export Date", Value: new Date().toLocaleString() },
        { Metric: "", Value: "" },
        { Metric: "Statistics", Value: "" },
        { Metric: "Total Attempts", Value: summaryStats.totalAttempts },
        { Metric: "Average Score", Value: summaryStats.averageScore },
        { Metric: "Highest Score", Value: summaryStats.highestScore },
        { Metric: "Lowest Score", Value: summaryStats.lowestScore },
        { Metric: "Passing Rate", Value: summaryStats.passingPercentage + "%" },
        { Metric: "Passed Students", Value: summaryStats.passingAttempts },
      ]

      const wsSummary = XLSX.utils.json_to_sheet(summaryData)
      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary")

      // Adjust column widths
      ws["!cols"] = [
        { wch: 6 },   // Rank
        { wch: 25 },  // Student Name
        { wch: 10 },  // Score
        { wch: 12 },  // Total Marks
        { wch: 12 },  // Percentage
        { wch: 10 },  // Status
        { wch: 12 },  // Time Taken
        { wch: 20 },  // Submitted At
      ]

      // Write file
      XLSX.writeFile(wb, filename)
    })
  } catch (error) {
    console.error("Failed to export to Excel:", error)
    // Fallback to CSV
    exportToCSV(quiz, attempts, filename)
  }
}

export function exportToCSV(
  quiz: Quiz,
  attempts: QuizAttempt[],
  filename: string = "quiz-results.csv"
): void {
  // Create CSV format (compatible with Excel)
  let csvContent = "data:text/csv;charset=utf-8,"
  
  // Header information
  csvContent += `Quiz Results - ${quiz.title}\n`
  csvContent += `Total Questions: ${quiz.questions.length}\n`
  csvContent += `Total Marks: ${quiz.questions.reduce((s, q) => s + q.marks, 0)}\n`
  csvContent += `Export Date: ${new Date().toLocaleString()}\n\n`

  // Column headers
  csvContent += "Rank,Student Name,Score,Total Marks,Percentage,Status,Time Taken,Submitted At\n"

  // Data rows
  const totalMarks = attempts[0]?.totalMarks || 0
  attempts.forEach((attempt, index) => {
    const percentage = ((attempt.score / totalMarks) * 100).toFixed(2)
    const status = parseFloat(percentage) >= 50 ? "PASSED" : "FAILED"
    const submitDate = new Date(attempt.completedAt).toLocaleString()
    
    csvContent += `${index + 1},"${attempt.studentName}",${attempt.score},${totalMarks},${percentage}%,${status},"${attempt.timeTaken}","${submitDate}"\n`
  })

  // Create download link
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", filename.replace(".xlsx", ".csv"))
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function getGrade(percentage: number): string {
  if (percentage >= 90) return "A+"
  if (percentage >= 80) return "A"
  if (percentage >= 70) return "B"
  if (percentage >= 60) return "C"
  if (percentage >= 50) return "D"
  return "F"
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case "A+":
    case "A":
      return "text-green-600"
    case "B":
      return "text-blue-600"
    case "C":
      return "text-yellow-600"
    case "D":
      return "text-orange-600"
    case "F":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}
