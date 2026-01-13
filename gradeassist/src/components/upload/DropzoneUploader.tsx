"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ACCEPTED_FILE_TYPES } from "@/lib/constants";
import {
  getSignedUploadUrl,
  uploadFileViaSignedUrl,
  validateFile,
} from "@/lib/storage/upload";
import { BatchUploadProgress } from "@/components/upload/BatchUploadProgress";
import { FilePreview } from "@/components/upload/FilePreview";

type UploadStatus = "pending" | "uploading" | "done" | "error";

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  error?: string;
}

export function DropzoneUploader() {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setUploads((prev) => [...items, ...prev]);
    setIsSubmitting(true);

    for (const item of items) {
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
        });

        setUploads((prev) =>
          prev.map((u) =>
            u.id === item.id
              ? { ...u, progress: 100, status: "done", error: undefined }
              : u,
          ),
        );

        // Placeholder: Later we will persist submission metadata via tRPC.
        console.log("Uploaded to path:", path);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setUploads((prev) =>
          prev.map((u) =>
            u.id === item.id
              ? { ...u, status: "error", error: message }
              : u,
          ),
        );
        setError(message);
      }
    }

    setIsSubmitting(false);
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
          isDragActive ? "bg-blue-50" : ""
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
          className="mt-3 inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900"
        >
          Browse files
        </button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <BatchUploadProgress uploads={uploads} />

      <div className="space-y-2">
        {uploads.map((upload) => (
          <FilePreview
            key={upload.id}
            name={upload.file.name}
            size={upload.file.size}
            progress={upload.progress}
            status={upload.status}
            error={upload.error}
          />
        ))}
      </div>

      {isSubmitting ? (
        <p className="text-xs text-gray-500">Uploading files…</p>
      ) : null}
    </div>
  );
}
