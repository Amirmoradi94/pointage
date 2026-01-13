import type {
  Assignment,
  Batch,
  Grade,
  Rubric,
  Submission,
  User,
  Course,
} from "@prisma/client";

export type CourseWithRelations = Course & {
  assignments: Assignment[];
  _count: { assignments: number };
};

export type AssignmentWithRelations = Assignment & {
  course: Course;
  rubric: Rubric | null;
  solution: SolutionWithPages | null;
  _count: { submissions: number; batches: number };
};

export type SolutionWithPages = {
  id: string;
  assignmentId: string;
  notes: string | null;
  pages: SolutionPage[];
};

export type SolutionPage = {
  id: string;
  pageNumber: number;
  imageUrl: string;
  width: number | null;
  height: number | null;
};

export type SubmissionWithRelations = Submission & {
  pages: SubmissionPage[];
  grade: Grade | null;
};

export type SubmissionPage = {
  id: string;
  pageNumber: number;
  imageUrl: string;
  width: number | null;
  height: number | null;
};

export type GradeWithRelations = Grade & {
  submission: SubmissionWithRelations;
  reviewedBy: User | null;
};

export type BatchWithProgress = Batch & {
  _count: { submissions: number };
  progress: {
    pending: number;
    converting: number;
    grading: number;
    graded: number;
    failed: number;
  };
};

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  order: number;
  levels?: RubricLevel[];
}

export interface RubricLevel {
  label: string;
  points: number;
  description: string;
}

export interface GradingSettings {
  strictness: "lenient" | "moderate" | "strict";
  allowAlternativeMethods: boolean;
  partialCreditEnabled: boolean;
  customInstructions?: string;
}

export interface CriterionScore {
  criterionId: string;
  criterionName: string;
  score: number;
  maxScore: number;
  comment: string;
}

export interface PageAnnotation {
  pageNumber: number;
  annotations: Annotation[];
}

export interface Annotation {
  type: "correct" | "incorrect" | "partial" | "unclear";
  location: string;
  comment: string;
}

export interface GradingResult {
  submissionId: string;
  score: number;
  maxScore: number;
  confidence: number;
  feedback: string;
  criteriaBreakdown: CriterionScore[];
  pageAnnotations: PageAnnotation[];
  flagsForReview: string[];
  processingTime: number;
}

export type BatchProgressEvent =
  | { type: "upload_progress"; submissionId: string; progress: number }
  | { type: "conversion_started"; submissionId: string }
  | { type: "conversion_complete"; submissionId: string; pageCount: number }
  | { type: "grading_started"; submissionId: string }
  | { type: "grading_progress"; submissionId: string; stage: string; percent: number }
  | { type: "grading_complete"; submissionId: string; result: Partial<GradingResult> }
  | { type: "submission_failed"; submissionId: string; error: string }
  | { type: "batch_complete"; summary: BatchSummary };

export interface BatchSummary {
  batchId: string;
  totalSubmissions: number;
  graded: number;
  failed: number;
  averageScore: number;
  averageConfidence: number;
  processingTimeMs: number;
}

export interface UploadFile {
  id: string;
  file: File;
  studentId: string;
  progress: number;
  status: "pending" | "uploading" | "uploaded" | "error";
  error?: string;
}

export interface ReviewFilters {
  status: string[];
  confidenceMin: number;
  confidenceMax: number;
  sortBy: "studentId" | "score" | "confidence" | "createdAt";
  sortOrder: "asc" | "desc";
}
