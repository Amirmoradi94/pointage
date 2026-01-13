"use client";

import { formatDateTime } from "@/lib/utils";

export interface SubmissionListItem {
  id: string;
  studentIdentifier: string;
  filename: string;
  status: string;
  createdAt: Date | string;
}

export function SubmissionList({ items }: { items: SubmissionListItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
        No submissions yet.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 rounded-md border border-gray-200 bg-white shadow-sm">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {item.studentIdentifier}
            </p>
            <p className="text-xs text-gray-500">{item.filename}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">{item.status}</p>
            <p className="text-xs text-gray-400">
              {formatDateTime(item.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
