export const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/msword": [".doc"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_FILES_PER_BATCH = 200;
export const MAX_PAGES_PER_DOCUMENT = 50;

export const COURSE_TYPES = [
  { value: "MATH", label: "Mathematics" },
  { value: "PHYSICS", label: "Physics" },
  { value: "CHEMISTRY", label: "Chemistry" },
  { value: "BIOLOGY", label: "Biology" },
  { value: "COMPUTER_SCIENCE", label: "Computer Science" },
  { value: "ENGINEERING", label: "Engineering" },
  { value: "HUMANITIES", label: "Humanities" },
  { value: "ESSAY", label: "Essay/Writing" },
  { value: "GENERAL", label: "General" },
] as const;

export const STRICTNESS_LEVELS = [
  { value: "lenient", label: "Lenient", description: "Accept alternative methods, give benefit of doubt" },
  { value: "moderate", label: "Moderate", description: "Balanced approach, reasonable partial credit" },
  { value: "strict", label: "Strict", description: "Exact answers expected, minimal partial credit" },
] as const;

export const GRADE_STATUSES = {
  PENDING_AI: { label: "Pending", color: "bg-gray-100 text-gray-700" },
  PROCESSING: { label: "Processing", color: "bg-blue-100 text-blue-700" },
  NEEDS_ATTENTION: { label: "Needs Attention", color: "bg-amber-100 text-amber-700" },
  READY_FOR_REVIEW: { label: "Ready for Review", color: "bg-purple-100 text-purple-700" },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-700" },
  MODIFIED: { label: "Modified", color: "bg-indigo-100 text-indigo-700" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-700" },
} as const;
