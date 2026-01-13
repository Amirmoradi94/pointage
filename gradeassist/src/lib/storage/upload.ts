"use client";

import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants";

export const STORAGE_BUCKETS = ["submissions", "solutions", "converted-images"] as const;
export type StorageBucket = (typeof STORAGE_BUCKETS)[number];

export interface SignedUploadRequest {
  filename: string;
  contentType: string;
  size: number;
  bucket: StorageBucket;
}

export interface SignedUploadResponse {
  signedUrl: string;
  path: string;
}

export function validateFile(file: File): { valid: boolean; reason?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, reason: `File exceeds ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB limit` };
  }

  if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
    return { valid: false, reason: "Unsupported file type" };
  }

  return { valid: true };
}

export async function getSignedUploadUrl(
  payload: SignedUploadRequest,
): Promise<SignedUploadResponse> {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message ?? "Unable to create upload URL");
  }

  return res.json();
}

export async function uploadFileViaSignedUrl(
  file: File,
  signedUrl: string,
  onProgress?: (percent: number) => void,
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signedUrl, true);
    xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable) return;
      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress(percent);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });
}
