"use client";

import { useMemo, useState } from "react";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

export interface BatchProgressState {
  pending: number;
  converting: number;
  grading: number;
  graded: number;
  failed: number;
}

const emptyState: BatchProgressState = {
  pending: 0,
  converting: 0,
  grading: 0,
  graded: 0,
  failed: 0,
};

export function useBatchProgress(batchId: string | null) {
  const [progress, setProgress] = useState<BatchProgressState>(emptyState);
  const channel = useMemo(() => (batchId ? `batch-${batchId}` : null), [batchId]);

  useRealtimeUpdates(channel, (payload) => {
    if (payload.type === "conversion_complete") {
      setProgress((prev) => ({ ...prev, converting: prev.converting - 1, graded: prev.graded, pending: Math.max(prev.pending - 1, 0) }));
    }

    if (payload.type === "grading_complete") {
      setProgress((prev) => ({
        ...prev,
        grading: Math.max(prev.grading - 1, 0),
        graded: prev.graded + 1,
      }));
    }
  });

  return progress;
}
