"use client";

type UploadStatus = "pending" | "uploading" | "done" | "error";

export interface BatchUploadProgressProps {
  uploads: Array<{ status: UploadStatus }>;
}

export function BatchUploadProgress({ uploads }: BatchUploadProgressProps) {
  const total = uploads.length;
  const done = uploads.filter((u) => u.status === "done").length;
  const uploading = uploads.filter((u) => u.status === "uploading").length;
  const errors = uploads.filter((u) => u.status === "error").length;

  if (total === 0) return null;

  return (
    <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
      <p className="text-sm font-medium text-gray-900">Batch progress</p>
      <p className="text-xs text-gray-500">
        {done} done · {uploading} uploading · {errors} errors · {total} total
      </p>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${Math.round((done / total) * 100)}%` }}
        />
      </div>
    </div>
  );
}
