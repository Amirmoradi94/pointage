"use client";

import { DropzoneUploader } from "@/components/upload/DropzoneUploader";

export default function UploadSubmissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">Submissions</p>
        <h1 className="text-2xl font-semibold text-gray-900">
          Upload student submissions
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Files are uploaded to Supabase storage and processed by the worker
          pipeline.
        </p>
      </div>
      <DropzoneUploader />
    </div>
  );
}
