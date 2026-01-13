"use client";

import { useState } from "react";

export interface GradeEditorProps {
  initialScore?: number;
  maxScore?: number;
  initialFeedback?: string;
  onSave?: (payload: { score: number; feedback: string }) => void;
}

export function GradeEditor({
  initialScore = 0,
  maxScore = 100,
  initialFeedback = "",
  onSave,
}: GradeEditorProps) {
  const [score, setScore] = useState(initialScore);
  const [feedback, setFeedback] = useState(initialFeedback);

  return (
    <div className="space-y-3 rounded-md border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <label className="text-sm font-medium text-gray-900">Score</label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="number"
            className="w-24 rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            min={0}
            max={maxScore}
          />
          <span className="text-sm text-gray-500">/ {maxScore}</span>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-900">Feedback</label>
        <textarea
          className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Add reviewer notes"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700"
          onClick={() => {
            setScore(initialScore);
            setFeedback(initialFeedback);
          }}
        >
          Reset
        </button>
        <button
          type="button"
          className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white"
          onClick={() => onSave?.({ score, feedback })}
        >
          Save
        </button>
      </div>
    </div>
  );
}
