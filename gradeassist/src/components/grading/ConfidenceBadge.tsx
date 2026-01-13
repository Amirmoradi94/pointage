"use client";

interface ConfidenceBadgeProps {
  confidence?: number;
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  if (confidence == null) {
    return (
      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
        Unknown
      </span>
    );
  }

  const color =
    confidence >= 0.85
      ? "bg-green-100 text-green-700"
      : confidence >= 0.7
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700";

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${color}`}>
      Confidence {Math.round(confidence * 100)}%
    </span>
  );
}
