# QuizGuard - Features Guide

## Overview
QuizGuard is a secure quiz platform designed for educational institutions. It includes anti-cheat features and comprehensive results tracking.

---

## New Features: Results & Analytics

### 1. Quiz Results Dashboard
View detailed results for each quiz with analytics and student performance data.

**Access:** Click the "Results" button on any quiz card in the dashboard

**Features:**
- **Leaderboard Tab**
  - Ranked list of all students by score
  - Displays student name, score, percentage, grade, and time taken
  - Medal badges (🥇🥈🥉) for top 3 performers
  - Color-coded performance indicators
  - Shows pass/fail status for each student

- **Analytics Tab**
  - Total attempts count
  - Average score across all attempts
  - Highest and lowest scores
  - Pass rate percentage (50% threshold)
  - Student performance summary

### 2. Excel Export Feature
Download quiz results as an Excel file for further analysis.

**How to Use:**
1. Go to any quiz's Results page
2. Click "Download Excel" button at the top right
3. File will contain:
   - Summary sheet with quiz metadata and statistics
   - Results sheet with detailed student data
   - Formatted columns for easy reading

**File Format:**
- Two worksheets: "Summary" and "Results"
- Includes: Student names, scores, percentages, grades, time taken, submission dates
- Professional formatting with adjusted column widths

### 3. Leaderboard Component
Display student rankings and competition metrics.

**Features:**
- Top 10 performers displayed by default
- Ranking with medals for top 3 (🥇🥈🥉)
- Percentage scores and grades
- Compact and full view modes
- Color-coded performance bands:
  - A+ / A: Green (90-100%)
  - B: Blue (80-89%)
  - C: Yellow (70-79%)
  - D: Orange (60-69%)
  - F: Red (Below 60%)

### 4. Quiz Statistics Widgets
Quick overview of quiz performance on the dashboard.

**Displays:**
- Number of attempts
- Average score
- Pass rate (percentage)
- Highest score achieved

---

## How to Use the Results System

### For Instructors (Quiz Creators)

1. **Create a Quiz**
   - Use the "Create Quiz" button on the home page
   - Add questions, set time limits, and configure settings

2. **Share the Quiz**
   - Click "Copy Link" on the quiz card
   - Share the link with students
   - Students paste it into "Join Quiz"

3. **View Results**
   - Click "Results" button on any quiz card
   - View leaderboard or analytics
   - Download as Excel for record keeping

4. **Export Data**
   - Click "Download Excel" to export all results
   - Includes summary statistics
   - Perfect for grade entry systems

### For Students

1. **Join a Quiz**
   - Click "Join Quiz" button
   - Paste the quiz link from your instructor
   - Enter your name
   - Take the quiz

2. **Submit Quiz**
   - Click "Submit" when done
   - See your score immediately
   - Your result is recorded in the leaderboard

---

## Demo Data

To test the results and leaderboard features:

1. Click the "Demo Data" button on the home page
2. A sample "College Physics Midterm" quiz will be created
3. Sample student results will be populated
4. View the "Results" page to see the leaderboard and analytics

**Demo Quiz Details:**
- Quiz: College Physics Midterm
- Questions: 3 (single choice, multiple choice, fill-in-blank)
- Total Marks: 4
- Sample Students: 8
- Score Range: 1-4 marks

---

## Grading System

QuizGuard uses a standard grading scale:

| Grade | Percentage | Status |
|-------|-----------|--------|
| A+    | 90-100%   | Excellent |
| A     | 80-89%    | Very Good |
| B     | 70-79%    | Good |
| C     | 60-69%    | Satisfactory |
| D     | 50-59%    | Pass |
| F     | 0-49%     | Fail |

**Passing Threshold:** 50% (customizable in settings)

---

## Technical Details

### Data Storage
- Quiz data stored in browser's localStorage
- Attempt records include:
  - Student name
  - Answers submitted
  - Score achieved
  - Time taken
  - Submission timestamp
  - Auto-submit status

### Export Format
- Excel format (.xlsx) using XLSX library
- Two worksheets for organization
- Fallback to CSV if browser doesn't support xlsx

### Performance Tracking
- Real-time score calculation
- Automatic grading based on correct answers
- Time tracking per question
- Anti-cheat warning system integration

---

## Features Summary

✅ **Leaderboard** - Ranked student performance display
✅ **Analytics Dashboard** - Statistical overview of quiz results
✅ **Excel Export** - Download results for external processing
✅ **Grade Calculation** - Automatic A-F grading
✅ **Pass/Fail Tracking** - Monitor student performance against threshold
✅ **Time Tracking** - Record time taken per student
✅ **Demo Data** - Sample data for testing features
✅ **Real-time Updates** - Results update immediately after submission

---

## Future Enhancements

Potential features for future releases:
- CSV import for bulk student accounts
- Custom grading scales
- Detailed question-wise analytics
- Class-level performance reports
- Attendance tracking
- Student feedback integration
- Certificate generation
- Advanced filtering and sorting options

---

## Support

For issues or feature requests, please refer to the main README.md file or contact support.
