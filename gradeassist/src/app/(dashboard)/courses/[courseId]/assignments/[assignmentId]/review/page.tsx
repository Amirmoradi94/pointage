"use client";

import { GradeReviewList } from "@/components/grading/GradeReviewList";
import { SideBySideViewer } from "@/components/grading/SideBySideViewer";

const sampleGrades = [
  {
    id: "g1",
    studentId: "S001",
    aiScore: 84,
    aiFeedback: "Solid approach. Minor arithmetic slip on Q3.",
    aiConfidence: 0.78,
    status: "READY_FOR_REVIEW",
  },
  {
    id: "g2",
    studentId: "S002",
    aiScore: 92,
    aiFeedback: "Excellent and concise. All steps justified.",
    aiConfidence: 0.9,
    status: "READY_FOR_REVIEW",
  },
];

export default function ReviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Review</p>
        <h1 className="text-2xl font-semibold text-gray-900">Grade review</h1>
        <p className="mt-2 text-sm text-gray-600">
          Approve AI-generated grades or make quick adjustments before release.
        </p>
      </div>

      <GradeReviewList items={sampleGrades} />

      <div className="space-y-3 rounded-md border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-medium text-gray-900">Side-by-side viewer</p>
        <SideBySideViewer />
      </div>
    </div>
  );
}
