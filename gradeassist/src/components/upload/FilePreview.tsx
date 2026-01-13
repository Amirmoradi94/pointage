"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

type UploadStatus = "pending" | "uploading" | "done" | "error";

export interface FilePreviewProps {
  name: string;
  size: number;
  progress: number;
  status: UploadStatus;
  error?: string;
}

export function FilePreview({ name, size, progress, status, error }: FilePreviewProps) {
  const statusIcon = {
    pending: <Loader2 className="h-4 w-4 animate-spin text-gray-500" />,
    uploading: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
    done: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    error: <XCircle className="h-4 w-4 text-red-600" />,
  }[status];

  return (
    <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm">
      <div className="flex items-center gap-3">
        {statusIcon}
        <div>
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{formatFileSize(size)}</p>
          {error ? (
            <p className="text-xs text-red-600">{error}</p>
          ) : (
            <p className="text-xs text-gray-500">Progress: {progress}%</p>
          )}
        </div>
      </div>
    </div>
  );
}
