import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import * as XLSX from "xlsx";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { assignmentId } = await params;
    const searchParams = req.nextUrl.searchParams;
    const format = searchParams.get("format") || "xlsx"; // xlsx or csv

    // Fetch assignment details
    const assignment = await db.assignment.findUnique({
      where: { id: assignmentId },
      select: {
        title: true,
        maxScore: true,
        course: {
          select: {
            name: true,
            code: true,
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Fetch all submissions with grades
    const submissions = await db.submission.findMany({
      where: { assignmentId },
      include: {
        grade: true,
      },
      orderBy: [
        { extractedStudentId: "asc" },
        { studentIdentifier: "asc" },
      ],
    });

    // Prepare data for export
    const exportData = submissions.map((submission, index) => {
      const finalScore = submission.grade?.finalScore ?? submission.grade?.aiScore;
      const percentage = finalScore != null ? ((finalScore / assignment.maxScore) * 100).toFixed(2) : "";

      return {
        "#": index + 1,
        "Student Name": submission.extractedStudentName || "Not extracted",
        "Student ID": submission.extractedStudentId || submission.studentIdentifier,
        "Filename": submission.originalFilename,
        "Status": submission.status,
        "Score": finalScore != null ? finalScore.toFixed(1) : "N/A",
        "Max Score": assignment.maxScore,
        "Percentage": percentage ? `${percentage}%` : "N/A",
        "AI Confidence": submission.grade?.aiConfidence != null
          ? `${(submission.grade.aiConfidence * 100).toFixed(0)}%`
          : "N/A",
        "Grade Status": submission.grade?.status || "Not graded",
        "Feedback Summary": submission.grade?.aiFeedback
          ? submission.grade.aiFeedback.substring(0, 200) + "..."
          : "No feedback",
        "Submitted At": new Date(submission.createdAt).toLocaleString(),
        "Pages": submission.pageCount || 0,
      };
    });

    // Calculate statistics
    const gradedSubmissions = submissions.filter((s) => s.grade);
    const scores = gradedSubmissions
      .map((s) => s.grade!.finalScore ?? s.grade!.aiScore)
      .filter((s): s is number => s != null);

    const stats = {
      "Total Submissions": submissions.length,
      "Graded": gradedSubmissions.length,
      "Average Score": scores.length > 0
        ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
        : "N/A",
      "Highest Score": scores.length > 0 ? Math.max(...scores).toFixed(2) : "N/A",
      "Lowest Score": scores.length > 0 ? Math.min(...scores).toFixed(2) : "N/A",
      "Pass Rate (>=60%)": scores.length > 0
        ? `${((scores.filter((s) => s >= 60).length / scores.length) * 100).toFixed(1)}%`
        : "N/A",
    };

    if (format === "csv") {
      // Generate CSV
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${assignment.course.code}_${assignment.title.replace(/\s+/g, "_")}_grades.csv"`,
        },
      });
    } else {
      // Generate Excel with multiple sheets
      const workbook = XLSX.utils.book_new();

      // Grades sheet
      const gradesSheet = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(workbook, gradesSheet, "Grades");

      // Statistics sheet
      const statsData = Object.entries(stats).map(([key, value]) => ({
        Metric: key,
        Value: value,
      }));
      const statsSheet = XLSX.utils.json_to_sheet(statsData);
      XLSX.utils.book_append_sheet(workbook, statsSheet, "Statistics");

      // Assignment info sheet
      const infoData = [
        { Field: "Course", Value: `${assignment.course.code} - ${assignment.course.name}` },
        { Field: "Assignment", Value: assignment.title },
        { Field: "Max Score", Value: assignment.maxScore },
        { Field: "Export Date", Value: new Date().toLocaleString() },
      ];
      const infoSheet = XLSX.utils.json_to_sheet(infoData);
      XLSX.utils.book_append_sheet(workbook, infoSheet, "Info");

      // Generate Excel buffer
      const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

      return new NextResponse(excelBuffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${assignment.course.code}_${assignment.title.replace(/\s+/g, "_")}_grades.xlsx"`,
        },
      });
    }
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export grades" },
      { status: 500 }
    );
  }
}
