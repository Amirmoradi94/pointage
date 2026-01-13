import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;
  let size = bytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function generateStudentId(filename: string, index: number): string {
  const patterns = [
    /(\d{6,10})/,
    /([A-Z]{2,3}\d{4,8})/i,
    /student[_-]?(\w+)/i,
  ];

  for (const pattern of patterns) {
    const match = filename.match(pattern);
    if (match) return match[1];
  }

  const nameWithoutExt = filename.replace(/\.[^.]+$/, "");
  if (nameWithoutExt.length > 0 && nameWithoutExt.length <= 50) {
    return nameWithoutExt;
  }

  return `submission-${index + 1}`;
}

export function getConfidenceLevel(confidence: number): {
  label: string;
  color: string;
} {
  if (confidence >= 0.85) return { label: "High", color: "text-green-600" };
  if (confidence >= 0.7) return { label: "Medium", color: "text-amber-600" };
  return { label: "Low", color: "text-red-600" };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
