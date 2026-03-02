# QuizGuard Results & Analytics System - Complete Guide

## What's New?

QuizGuard now includes a comprehensive results tracking and analytics system perfect for college quizzes. Instructors can now see who took their quiz, how many people attempted it, their scores, and download everything as Excel files.

---

## Quick Start

### Step 1: Create a Quiz
```
Home Page → Click "Create Quiz" → Add questions and settings → Save
```

### Step 2: Share with Students
```
Dashboard → Click "Copy Link" on your quiz → Share with students
```

### Step 3: Students Take Quiz
```
Students → Click "Join Quiz" → Paste your link → Take test → Submit
```

### Step 4: View Results
```
Dashboard → Click "Results" on your quiz → View leaderboard and stats
```

### Step 5: Download Results
```
Results Page → Click "Download Excel" → Import into your system
```

---

## Features Explained

### 1. Attempt Tracking
Every time a student submits a quiz, it's recorded with:
- Student name
- Score achieved
- Total marks possible
- Percentage score
- Time taken
- Submission date and time
- Pass/Fail status

### 2. Leaderboard View
**Location:** Results Page → Leaderboard Tab

Shows all students ranked by score with:
- **Rank** - Position in leaderboard (1st, 2nd, 3rd, etc.)
- **Student Name** - Who took the quiz
- **Score** - Points earned (e.g., 4/4)
- **Percentage** - Percentage correct (e.g., 100%)
- **Grade** - Letter grade (A+, A, B, C, D, F)
- **Time Taken** - How long quiz took
- **Status** - PASSED or FAILED

**Medal System:**
- 🥇 1st Place - Gold background
- 🥈 2nd Place - Silver background
- 🥉 3rd Place - Bronze background
- Others - Numbered ranking

### 3. Analytics Tab
**Location:** Results Page → Analytics Tab

Shows 5 key statistics:
1. **Total Attempts** - How many students took the quiz
2. **Average Score** - Mean score across all students
3. **Highest Score** - Best performance
4. **Lowest Score** - Worst performance
5. **Passing Rate** - Percentage of students who passed (50%+ threshold)

Plus a performance summary showing:
- Total students who passed
- Total students who failed
- Detailed pass/fail breakdown

### 4. Excel Export
**Location:** Results Page → Download Excel button (top right)

Creates an Excel file with 2 sheets:

**Sheet 1: Summary**
- Quiz title
- Number of questions
- Total marks
- Export date
- Class statistics (attempts, averages, pass rates)

**Sheet 2: Results**
- All student data in spreadsheet format
- Ready to import into Google Classroom, Blackboard, etc.
- Professional formatting
- Sortable and filterable columns

### 5. Dashboard Statistics
**Location:** Home Page Dashboard

Each quiz card now shows:
- Number of attempts (blue badge)
- Quick stats when hovering

Example: "8 attempts" means 8 students have taken this quiz.

---

## Grading Scale

QuizGuard automatically assigns grades:

| Grade | Score Range | Status |
|-------|------------|--------|
| A+ | 90-100% | Outstanding |
| A | 80-89% | Excellent |
| B | 70-79% | Good |
| C | 60-69% | Satisfactory |
| D | 50-59% | Passing |
| F | 0-49% | Failing |

**Passing Threshold:** 50% (can be changed in quiz settings)

---

## Using Demo Data to Test

### How to Load Demo Data:
1. Go to Home Page
2. Click "Demo Data" button (top right of dashboard)
3. Wait for page to reload
4. A sample "College Physics Midterm" quiz will appear

### What's in Demo Data:
- **Quiz:** College Physics Midterm (3 questions, 4 marks total)
- **Students:** 8 sample student results
- **Scores:** Range from 1-4 marks showing different grades
- **Purpose:** See how the results and leaderboard look with data

### Viewing Demo Results:
1. Find "College Physics Midterm" in your dashboard
2. Click "Results" button
3. View the leaderboard with all 8 students
4. Check analytics tab for statistics
5. Download the Excel file to see export format

---

## Understanding the Results Page

### Layout:

```
┌─────────────────────────────────────┐
│ ← Back to Dashboard                 │
│ Quiz Title: College Physics Midterm │
│ Results & Analytics                 │  [Download Excel]
├─────────────────────────────────────┤
│ [Leaderboard] [Analytics]           │
├─────────────────────────────────────┤
│                                     │
│  (Leaderboard Table or Stats)      │
│                                     │
└─────────────────────────────────────┘
```

### Leaderboard Table Columns:
- **Rank** - 1, 2, 3, etc.
- **Student Name** - Full name entered during quiz
- **Score** - Points earned / Total points
- **Percentage** - % correct
- **Grade** - A+, A, B, C, D, F
- **Time Taken** - MM:SS format
- **Status** - PASSED/FAILED badge

### Analytics Cards:
5 cards showing key metrics in large numbers for quick overview.

Plus detailed performance summary below.

---

## Excel File Format

### What You Get:

**Summary Sheet:**
```
Metric                      Value
Quiz Title                  College Physics Midterm
Total Questions            3
Total Marks                4
Export Date                3/2/2026 2:30 PM
(blank row)
Statistics
Total Attempts             8
Average Score              3.125
Highest Score              4
Lowest Score               1
Passing Rate               75%
Passed Students            6
```

**Results Sheet:**
```
Rank | Student Name      | Score | Total | Percentage | Status | Time Taken | Submitted
1    | Alice Johnson     | 4     | 4     | 100%       | PASSED | 08:32      | 3/1/2026...
2    | Bob Smith         | 3     | 4     | 75%        | PASSED | 10:15      | 3/1/2026...
...
```

### Importing to Your System:
1. Download the Excel file from QuizGuard
2. Open in Excel or Google Sheets
3. Copy the Results sheet
4. Paste into your gradebook (Blackboard, Canvas, Google Classroom, etc.)
5. Adjust as needed for your grading system

---

## Common Tasks

### View Top 3 Students
1. Go to Results page
2. Look at Leaderboard tab
3. First 3 rows have medals (🥇🥈🥉)

### Check Class Average
1. Go to Results page
2. Click Analytics tab
3. See "Average Score" card

### Find Students Who Failed
1. Go to Results page
2. Leaderboard tab
3. Look for "FAILED" status (red badge)

### Export for Records
1. Go to Results page
2. Click "Download Excel"
3. File saves to your Downloads folder
4. Name format: "Quiz_Title_results_YYYY-MM-DD.xlsx"

### See Time Performance
1. Leaderboard tab
2. Check "Time Taken" column
3. Identify who took longest/shortest

### Check Pass Rate
1. Analytics tab
2. See "Passing Rate" card
3. Also shown in summary section

---

## Data Management

### What's Recorded:
- Student name (entered during quiz)
- All answers submitted
- Score and percentage
- Exact time taken
- When quiz was submitted
- Whether auto-submitted (timed out)

### Data Storage:
- Stored locally in browser
- Persists when closing tab
- Deleted only when quiz is deleted

### Privacy:
- No data sent to external servers
- All data stays on your computer
- Download Excel files for backup

### Deleting Results:
When you delete a quiz:
1. Click trash icon on quiz card
2. Confirm deletion
3. ALL student results for that quiz are permanently deleted
4. Cannot be recovered

---

## Tips & Best Practices

### For Instructors:
1. **Download regularly** - Keep backup Excel files of results
2. **Share links early** - Give students link before quiz day
3. **Check analytics** - Review average scores to assess difficulty
4. **Monitor pass rate** - If too low, quiz may need revision
5. **Export before deleting** - Always download results before deleting quiz

### For Students:
1. **Note your rank** - Leaderboard shows your position
2. **Check your grade** - See letter grade after submission
3. **Review time taken** - Learn if you're rushing or over-thinking
4. **Accept results immediately** - Scores display right after submit

### Grading Tips:
1. **50% threshold** - Standard passing score is 50%
2. **Curve scores** - Use the raw scores to curve if needed
3. **Compare averages** - 60% average is reasonable for college
4. **Watch extremes** - Very high/low scores might indicate issues

---

## Troubleshooting

### No Results Showing
**Problem:** Results page is empty
**Solution:** Students haven't taken the quiz yet. Share the link and wait for submissions.

### Excel File Won't Open
**Problem:** Downloaded file shows error
**Solution:** Try opening with Google Sheets, or use fallback CSV version

### Wrong Student Count
**Problem:** Showing 10 attempts but expecting 8
**Solution:** Some students may have retaken the quiz. Each attempt is counted.

### Can't Find Leaderboard
**Problem:** Only seeing blank screen
**Solution:** Make sure students have submitted at least one attempt.

### Score Calculation Wrong
**Problem:** Math doesn't add up
**Solution:** Check question marks - higher mark questions worth more points

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Go back to dashboard | Click "Back to Dashboard" link |
| Download Excel | Click "Download Excel" button |
| Switch to Leaderboard | Click "Leaderboard" tab |
| Switch to Analytics | Click "Analytics" tab |
| View full results | Click "Results" from any quiz card |

---

## FAQs

**Q: Can students see the leaderboard?**
A: No, leaderboard is instructor-only on Results page.

**Q: Can I edit scores after submission?**
A: No, scores are auto-calculated and locked.

**Q: How long are results stored?**
A: Until you delete the quiz. They're not automatically deleted.

**Q: Can I change the passing percentage?**
A: Currently set to 50%. Can be changed in future updates.

**Q: What if a student retakes the quiz?**
A: Both attempts are recorded and ranked separately.

**Q: Can I reorder the leaderboard?**
A: Currently sorted by score. Manual sorting coming soon.

**Q: Are results backed up?**
A: Use "Download Excel" to create backups.

**Q: How do I share results with students?**
A: Screenshot leaderboard or share specific data manually.

---

## Next Steps

1. **Create a test quiz** - Use demo data as reference
2. **Test with friends** - Have them take your quiz
3. **View the results** - See leaderboard and analytics
4. **Download Excel** - Practice exporting data
5. **Start real quizzes** - Use with your class

---

For more help, see FEATURES.md or README.md
