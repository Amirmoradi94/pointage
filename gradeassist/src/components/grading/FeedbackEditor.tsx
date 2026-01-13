"use client";

import { useState } from "react";

export interface FeedbackEditorProps {
  initialFeedback?: string;
  onChange?: (feedback: string) => void;
}

export function FeedbackEditor({
  initialFeedback = "",
  onChange,
}: FeedbackEditorProps) {
  const [feedback, setFeedback] = useState(initialFeedback);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-900">Reviewer notes</label>
      <textarea
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
        rows={5}
        value={feedback}
        onChange={(e) => {
          setFeedback(e.target.value);
          onChange?.(e.target.value);
        }}
        placeholder="Clarify adjustments or rationale for the final grade"
      />
    </div>
  );
}
