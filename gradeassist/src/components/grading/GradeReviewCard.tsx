"use client";

import { ConfidenceBadge } from "@/components/grading/ConfidenceBadge";

export interface GradeReviewCardProps {
  studentId: string;
  aiScore?: number;
  aiFeedback?: string;
  aiConfidence?: number;
  status?: string;
  onApprove?: () => void;
  onModify?: () => void;
  onReject?: () => void;
}

export function GradeReviewCard({
  studentId,
  aiScore,
  aiFeedback,
  aiConfidence,
  status,
  onApprove,
  onModify,
  onReject,
}: GradeReviewCardProps) {
  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm text-gray-500">Student</p>
          <p className="text-base font-semibold text-gray-900">{studentId}</p>
          <p className="text-xs text-gray-500">Status: {status ?? "Pending"}</p>
        </div>
        <ConfidenceBadge confidence={aiConfidence} />
      </div>
      <div className="rounded-md border border-gray-100 bg-gray-50 p-3">
        <p className="text-sm font-medium text-gray-900">
          AI Score: {aiScore ?? "—"}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {aiFeedback ?? "No feedback yet."}
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700"
          onClick={onReject}
        >
          Reject
        </button>
        <button
          type="button"
          className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700"
          onClick={onModify}
        >
          Modify
        </button>
        <button
          type="button"
          className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white"
          onClick={onApprove}
        >
          Approve
        </button>
      </div>
    </div>
  );
}
