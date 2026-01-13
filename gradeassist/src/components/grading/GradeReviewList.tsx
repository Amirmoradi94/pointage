"use client";

import { GradeReviewCard } from "@/components/grading/GradeReviewCard";

export interface GradeReviewItem {
  id: string;
  studentId: string;
  aiScore?: number;
  aiFeedback?: string;
  aiConfidence?: number;
  status?: string;
}

export function GradeReviewList({ items }: { items: GradeReviewItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
        No grades to review.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <GradeReviewCard
          key={item.id}
          studentId={item.studentId}
          aiScore={item.aiScore}
          aiFeedback={item.aiFeedback}
          aiConfidence={item.aiConfidence}
          status={item.status}
          onApprove={() => console.log("Approve", item.id)}
          onModify={() => console.log("Modify", item.id)}
          onReject={() => console.log("Reject", item.id)}
        />
      ))}
    </div>
  );
}
