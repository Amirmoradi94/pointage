"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { ACCEPTED_FILE_TYPES } from "@/lib/constants";
import {
  getSignedUploadUrl,
  uploadFileViaSignedUrl,
  validateFile,
} from "@/lib/storage/upload";
import { Progress } from "@/components/ui/progress";
import { generateStudentId } from "@/lib/utils";
import { addActiveBatch } from "@/components/notifications/BatchNotificationListener";
import { api } from "@/lib/trpc/client";

type UploadStatus = "pending" | "uploading" | "done" | "error";

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  error?: string;
}

export function DropzoneUploader({
  assignmentId,
  courseId
}: {
  assignmentId: string;
  courseId: string;
}) {
  const router = useRouter();
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);

  const createBatchMutation = api.submission.createWithBatch.useMutation();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    const items: UploadItem[] = [];

    for (const file of acceptedFiles) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.reason ?? "Invalid file");
        continue;
      }

      const generatedId =
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      items.push({
        id: generatedId,
        file,
        progress: 0,
        status: "pending",
      });
    }

    if (items.length === 0) return;
    setUploads(items);
    setIsSubmitting(true);

    const totalFiles = items.length;
    let completedFiles = 0;
    const uploadedSubmissions: Array<{
      studentIdentifier: string;
      originalFilename: string;
      originalFileUrl: string;
      mimeType: string;
    }> = [];

    try {
      // Upload all files to Supabase
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        setUploads((prev) =>
          prev.map((u) => (u.id === item.id ? { ...u, status: "uploading" } : u)),
        );

        try {
          const { signedUrl, path } = await getSignedUploadUrl({
            filename: item.file.name,
            contentType: item.file.type,
            size: item.file.size,
            bucket: "submissions",
          });

          await uploadFileViaSignedUrl(item.file, signedUrl, (percent) => {
            setUploads((prev) =>
              prev.map((u) =>
                u.id === item.id ? { ...u, progress: percent } : u,
              ),
            );

            const filesProgress = completedFiles + (percent / 100);
            const overall = Math.round((filesProgress / totalFiles) * 100);
            setOverallProgress(overall);
          });

          setUploads((prev) =>
            prev.map((u) =>
              u.id === item.id
                ? { ...u, progress: 100, status: "done", error: undefined }
                : u,
            ),
          );

          completedFiles++;
          setOverallProgress(Math.round((completedFiles / totalFiles) * 100));

          // Add to submissions array
          const studentId = generateStudentId(item.file.name, i);
          uploadedSubmissions.push({
            studentIdentifier: studentId,
            originalFilename: item.file.name,
            originalFileUrl: path,
            mimeType: item.file.type,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Upload failed";
          setUploads((prev) =>
            prev.map((u) =>
              u.id === item.id
                ? { ...u, status: "error", error: message }
                : u,
            ),
          );
          throw err;
        }
      }

      // Create batch and submissions in database
      const result = await createBatchMutation.mutateAsync({
        assignmentId,
        submissions: uploadedSubmissions,
      });

      // Add to active batches for notifications
      addActiveBatch(result.batchId);

      setIsSubmitting(false);
      setOverallProgress(100);

      // Redirect to batch progress page
      setTimeout(() => {
        router.push(`/batches/${result.batchId}`);
      }, 1000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      setIsSubmitting(false);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileDialog,
  } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 50 * 1024 * 1024,
    accept: ACCEPTED_FILE_TYPES,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition hover:border-gray-400 ${
          isDragActive ? "bg-blue-50 border-blue-400" : ""
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm font-medium text-gray-900">
          Drag and drop submissions here
        </p>
        <p className="mt-1 text-xs text-gray-500">
          PDF, DOCX, JPG, PNG up to 50MB each
        </p>
        <button
          type="button"
          onClick={openFileDialog}
          disabled={isSubmitting}
          className="mt-3 inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Browse files
        </button>
      </div>

      {error ? (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : null}

      {uploads.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-900">
              {isSubmitting ? "Uploading submissions..." : "Upload complete"}
            </p>
            <p className="text-sm text-gray-600">
              {uploads.filter(u => u.status === "done").length} / {uploads.length} files
            </p>
          </div>

          <Progress value={overallProgress} className="h-2 mb-2" />

          <p className="text-xs text-gray-500 text-center">
            {overallProgress}% complete
          </p>

          {overallProgress === 100 && !isSubmitting && (
            <p className="mt-3 text-xs text-green-600 text-center">
              ✓ All files uploaded successfully! Redirecting to batch processing...
            </p>
          )}
        </div>
      )}

      {uploads.length > 0 && !isSubmitting && overallProgress < 100 && (
        <div className="text-xs text-gray-500">
          <p className="font-medium mb-2">Selected files ({uploads.length}):</p>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {uploads.map((upload) => (
              <div key={upload.id} className="flex items-center justify-between py-1">
                <span className="truncate flex-1">{upload.file.name}</span>
                <span className="ml-2 text-gray-400">
                  {upload.status === "done" ? "✓" : upload.status === "error" ? "✗" : "⏳"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
