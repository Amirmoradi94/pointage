# AI Grading Assistant - Complete Implementation Plan

## Project Overview

**Application Name:** Pointage  
**Purpose:** An AI-powered grading assistant for university markers that processes student assignments (PDF, DOCX, images), grades them against provided solutions using Gemini 2.5 vision models, and allows supervisors to review and approve grades.

**Core Principles:**
- Vision-first document processing (all documents converted to images)
- Parallel AI grading with multiple workers
- Real-time progress updates with non-blocking UI
- Human-in-the-loop review process

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Phase 1: Project Setup & Foundation](#phase-1-project-setup--foundation)
4. [Phase 2: Authentication & Layout](#phase-2-authentication--layout)
5. [Phase 3: tRPC Setup & API Routes](#phase-3-trpc-setup--api-routes)
6. [Phase 4: File Storage & Upload](#phase-4-file-storage--upload)
7. [Phase 5: Document Processing Workers](#phase-5-document-processing-workers)
8. [Phase 6: AI Grading Engine](#phase-6-ai-grading-engine)
9. [Phase 7: Real-time Progress System](#phase-7-real-time-progress-system)
10. [Phase 8: Review Interface](#phase-8-review-interface)
11. [Phase 9: Dashboard & Analytics](#phase-9-dashboard--analytics)
12. [Phase 10: Testing & Deployment](#phase-10-testing--deployment)

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS + shadcn/ui | Latest |
| State Management | Zustand + TanStack Query | Latest |
| Backend | Next.js API Routes + tRPC | Latest |
| Database | PostgreSQL via Supabase | Latest |
| ORM | Prisma | 5.x |
| File Storage | Supabase Storage (S3-compatible) | Latest |
| Queue System | BullMQ + Redis (Upstash) | Latest |
| Real-time | Pusher or Supabase Realtime | Latest |
| AI Model | Google Gemini 2.5 Flash/Pro | Latest |
| Auth | Clerk | Latest |
| Deployment | Vercel + Railway (workers) | Latest |
| PDF Processing | pdf2pic, sharp | Latest |
| DOCX Processing | libreoffice-convert | Latest |

---

## Project Structure

```
gradeassist/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   └── sign-up/[[...sign-up]]/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx          # Course list
│   │   │   │   ├── [courseId]/
│   │   │   │   │   ├── page.tsx      # Course detail
│   │   │   │   │   └── assignments/
│   │   │   │   │       ├── [assignmentId]/
│   │   │   │   │       │   ├── page.tsx           # Assignment detail
│   │   │   │   │       │   ├── upload/page.tsx    # Upload submissions
│   │   │   │   │       │   ├── review/page.tsx    # Review grades
│   │   │   │   │       │   └── settings/page.tsx  # Grading settings
│   │   │   │   │       └── new/page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   ├── batches/
│   │   │   │   └── [batchId]/page.tsx  # Batch progress
│   │   │   └── settings/page.tsx
│   │   ├── api/
│   │   │   ├── trpc/[trpc]/route.ts
│   │   │   ├── webhooks/
│   │   │   │   ├── clerk/route.ts
│   │   │   │   └── pusher/route.ts
│   │   │   └── upload/route.ts         # File upload endpoint
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── BreadcrumbNav.tsx
│   │   ├── courses/
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseForm.tsx
│   │   │   └── CourseList.tsx
│   │   ├── assignments/
│   │   │   ├── AssignmentCard.tsx
│   │   │   ├── AssignmentForm.tsx
│   │   │   ├── RubricBuilder.tsx
│   │   │   └── SolutionUpload.tsx
│   │   ├── upload/
│   │   │   ├── DropzoneUploader.tsx
│   │   │   ├── FilePreview.tsx
│   │   │   ├── BatchUploadProgress.tsx
│   │   │   └── SubmissionList.tsx
│   │   ├── grading/
│   │   │   ├── GradeReviewCard.tsx
│   │   │   ├── GradeReviewList.tsx
│   │   │   ├── GradeEditor.tsx
│   │   │   ├── FeedbackEditor.tsx
│   │   │   ├── ConfidenceBadge.tsx
│   │   │   └── SideBySideViewer.tsx
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── EmptyState.tsx
│   │       └── ConfirmDialog.tsx
│   │
│   ├── server/
│   │   ├── api/
│   │   │   ├── root.ts               # tRPC root router
│   │   │   ├── trpc.ts               # tRPC setup
│   │   │   └── routers/
│   │   │       ├── course.ts
│   │   │       ├── assignment.ts
│   │   │       ├── submission.ts
│   │   │       ├── grade.ts
│   │   │       ├── batch.ts
│   │   │       └── rubric.ts
│   │   └── db.ts                     # Prisma client
│   │
│   ├── lib/
│   │   ├── utils.ts                  # Utility functions
│   │   ├── constants.ts              # App constants
│   │   ├── validations/
│   │   │   ├── course.ts
│   │   │   ├── assignment.ts
│   │   │   └── rubric.ts
│   │   ├── storage/
│   │   │   ├── supabase.ts           # Storage client
│   │   │   └── upload.ts             # Upload utilities
│   │   ├── realtime/
│   │   │   ├── pusher-server.ts
│   │   │   └── pusher-client.ts
│   │   └── ai/
│   │       ├── gemini-client.ts      # Gemini API wrapper
│   │       └── prompts/
│   │           ├── grading.ts
│   │           ├── feedback.ts
│   │           └── templates.ts
│   │
│   ├── hooks/
│   │   ├── useBatchProgress.ts
│   │   ├── useSubmissions.ts
│   │   ├── useGrades.ts
│   │   └── useRealtimeUpdates.ts
│   │
│   ├── stores/
│   │   ├── upload-store.ts           # Upload state
│   │   └── review-store.ts           # Review UI state
│   │
│   └── types/
│       ├── index.ts
│       ├── database.ts
│       ├── api.ts
│       └── grading.ts
│
├── workers/                           # Separate worker process
│   ├── src/
│   │   ├── index.ts                  # Worker entry point
│   │   ├── queues/
│   │   │   ├── conversion.queue.ts
│   │   │   ├── grading.queue.ts
│   │   │   └── notification.queue.ts
│   │   ├── processors/
│   │   │   ├── conversion.processor.ts
│   │   │   ├── grading.processor.ts
│   │   │   └── notification.processor.ts
│   │   ├── services/
│   │   │   ├── document-converter.ts
│   │   │   ├── gemini-grader.ts
│   │   │   └── worker-pool.ts
│   │   └── utils/
│   │       ├── image-processing.ts
│   │       └── rate-limiter.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── public/
│   └── images/
│
├── .env.example
├── .env.local
├── docker-compose.yml                 # Local dev with Redis
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## Phase 1: Project Setup & Foundation

### Step 1.1: Initialize Next.js Project

```bash
npx create-next-app@latest gradeassist --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd gradeassist
```

### Step 1.2: Package.json Dependencies

```json
{
  "name": "gradeassist",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.6.0",
    "@clerk/nextjs": "^5.7.0",
    "@tanstack/react-query": "^5.59.0",
    "@trpc/client": "^11.0.0",
    "@trpc/next": "^11.0.0",
    "@trpc/react-query": "^11.0.0",
    "@trpc/server": "^11.0.0",
    "@prisma/client": "^5.20.0",
    "@supabase/supabase-js": "^2.45.0",
    "bullmq": "^5.16.0",
    "ioredis": "^5.4.0",
    "pusher": "^5.2.0",
    "pusher-js": "^8.4.0",
    "@google/generative-ai": "^0.21.0",
    "pdf2pic": "^3.1.0",
    "sharp": "^0.33.0",
    "pdf-parse": "^1.1.1",
    "libreoffice-convert": "^1.6.0",
    "zod": "^3.23.0",
    "zustand": "^5.0.0",
    "date-fns": "^4.1.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "lucide-react": "^0.451.0",
    "react-dropzone": "^14.2.0",
    "react-pdf": "^9.1.0",
    "@tanstack/react-virtual": "^3.10.0",
    "class-variance-authority": "^0.7.0",
    "@radix-ui/react-alert-dialog": "^1.1.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.0",
    "@radix-ui/react-tooltip": "^1.1.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "prisma": "^5.20.0",
    "tsx": "^4.19.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0"
  }
}
```

### Step 1.3: Environment Variables

Create `.env.example`:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# Redis (Upstash)
REDIS_URL="redis://default:xxx@xxx.upstash.io:6379"

# Pusher (Real-time)
PUSHER_APP_ID="your-app-id"
NEXT_PUBLIC_PUSHER_KEY="your-key"
PUSHER_SECRET="your-secret"
NEXT_PUBLIC_PUSHER_CLUSTER="us2"

# Gemini AI (Multiple keys for worker pool)
GEMINI_API_KEY_1="your-api-key-1"
GEMINI_API_KEY_2="your-api-key-2"
GEMINI_API_KEY_3="your-api-key-3"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 1.4: Prisma Schema

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ==================== USER & ORGANIZATION ====================

model Organization {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  users   User[]
  courses Course[]
}

model User {
  id             String   @id @default(cuid())
  clerkId        String   @unique
  email          String   @unique
  firstName      String?
  lastName       String?
  imageUrl       String?
  role           UserRole @default(MARKER)
  organizationId String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization         Organization          @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdCourses       Course[]              @relation("CourseCreator")
  createdAssignments   Assignment[]          @relation("AssignmentCreator")
  uploadedBatches      Batch[]               @relation("BatchUploader")
  reviewedGrades       Grade[]               @relation("GradeReviewer")
  uploadedSolutions    Solution[]            @relation("SolutionUploader")
  gradeHistory         GradeHistory[]
}

enum UserRole {
  ADMIN
  SUPERVISOR
  MARKER
}

// ==================== COURSE & ASSIGNMENT ====================

model Course {
  id             String       @id @default(cuid())
  name           String
  code           String
  description    String?
  semester       String?
  year           Int?
  courseType     CourseType   @default(GENERAL)
  organizationId String
  createdById    String
  isArchived     Boolean      @default(false)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdBy    User         @relation("CourseCreator", fields: [createdById], references: [id])
  assignments  Assignment[]
  rubrics      Rubric[]

  @@unique([organizationId, code, year, semester])
}

enum CourseType {
  MATH
  PHYSICS
  CHEMISTRY
  BIOLOGY
  COMPUTER_SCIENCE
  ENGINEERING
  HUMANITIES
  ESSAY
  GENERAL
}

model Assignment {
  id              String           @id @default(cuid())
  title           String
  description     String?
  dueDate         DateTime?
  maxScore        Float            @default(100)
  courseId        String
  rubricId        String?
  createdById     String
  gradingSettings Json             @default("{}")
  status          AssignmentStatus @default(DRAFT)
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  course      Course       @relation(fields: [courseId], references: [id], onDelete: Cascade)
  rubric      Rubric?      @relation(fields: [rubricId], references: [id])
  createdBy   User         @relation("AssignmentCreator", fields: [createdById], references: [id])
  solution    Solution?
  batches     Batch[]
  submissions Submission[]
}

enum AssignmentStatus {
  DRAFT
  ACTIVE
  GRADING
  REVIEW
  COMPLETED
  ARCHIVED
}

// ==================== RUBRIC ====================

model Rubric {
  id          String   @id @default(cuid())
  name        String
  description String?
  courseId    String?
  isTemplate  Boolean  @default(false)
  criteria    Json     // Array of RubricCriterion
  totalPoints Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  course      Course?      @relation(fields: [courseId], references: [id], onDelete: SetNull)
  assignments Assignment[]
}

// ==================== SOLUTION ====================

model Solution {
  id           String   @id @default(cuid())
  assignmentId String   @unique
  uploadedById String
  notes        String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  assignment Assignment     @relation(fields: [assignmentId], references: [id], onDelete: Cascade)
  uploadedBy User           @relation("SolutionUploader", fields: [uploadedById], references: [id])
  pages      SolutionPage[]
}

model SolutionPage {
  id         String @id @default(cuid())
  solutionId String
  pageNumber Int
  imageUrl   String
  width      Int?
  height     Int?

  solution Solution @relation(fields: [solutionId], references: [id], onDelete: Cascade)

  @@unique([solutionId, pageNumber])
  @@index([solutionId])
}

// ==================== BATCH & SUBMISSION ====================

model Batch {
  id               String      @id @default(cuid())
  assignmentId     String
  uploadedById     String
  totalSubmissions Int         @default(0)
  status           BatchStatus @default(UPLOADING)
  errorMessage     String?
  createdAt        DateTime    @default(now())
  completedAt      DateTime?

  assignment  Assignment   @relation(fields: [assignmentId], references: [id], onDelete: Cascade)
  uploadedBy  User         @relation("BatchUploader", fields: [uploadedById], references: [id])
  submissions Submission[]

  @@index([assignmentId])
  @@index([status])
}

enum BatchStatus {
  UPLOADING
  CONVERTING
  GRADING
  COMPLETED
  FAILED
}

model Submission {
  id                String           @id @default(cuid())
  batchId           String?
  assignmentId      String
  studentIdentifier String
  originalFilename  String
  originalFileUrl   String
  mimeType          String?
  pageCount         Int?
  status            SubmissionStatus @default(PENDING_UPLOAD)
  errorMessage      String?
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt

  batch      Batch?           @relation(fields: [batchId], references: [id], onDelete: SetNull)
  assignment Assignment       @relation(fields: [assignmentId], references: [id], onDelete: Cascade)
  pages      SubmissionPage[]
  grade      Grade?

  @@index([batchId])
  @@index([assignmentId])
  @@index([status])
}

enum SubmissionStatus {
  PENDING_UPLOAD
  UPLOADING
  PENDING_CONVERSION
  CONVERTING
  PENDING_GRADING
  GRADING
  GRADED
  FAILED
}

model SubmissionPage {
  id           String @id @default(cuid())
  submissionId String
  pageNumber   Int
  imageUrl     String
  width        Int?
  height       Int?

  submission Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)

  @@unique([submissionId, pageNumber])
  @@index([submissionId])
}

// ==================== GRADING ====================

model Grade {
  id                String      @id @default(cuid())
  submissionId      String      @unique
  
  // AI-generated values
  aiScore           Float?
  aiMaxScore        Float?
  aiFeedback        String?
  aiConfidence      Float?
  criteriaBreakdown Json?
  pageAnnotations   Json?
  flagsForReview    String[]
  
  // Final values (after review)
  finalScore        Float?
  finalFeedback     String?
  
  // Review metadata
  status            GradeStatus @default(PENDING_AI)
  reviewedById      String?
  reviewedAt        DateTime?
  reviewNotes       String?
  
  // Processing metadata
  processingTime    Int?
  workerId          String?
  modelUsed         String?
  
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  submission Submission     @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  reviewedBy User?          @relation("GradeReviewer", fields: [reviewedById], references: [id])
  history    GradeHistory[]

  @@index([status])
  @@index([aiConfidence])
}

enum GradeStatus {
  PENDING_AI
  PROCESSING
  NEEDS_ATTENTION
  READY_FOR_REVIEW
  APPROVED
  MODIFIED
  REJECTED
}

model GradeHistory {
  id        String             @id @default(cuid())
  gradeId   String
  action    GradeHistoryAction
  oldValues Json?
  newValues Json?
  userId    String?
  createdAt DateTime           @default(now())

  grade Grade @relation(fields: [gradeId], references: [id], onDelete: Cascade)
  user  User? @relation(fields: [userId], references: [id])

  @@index([gradeId])
}

enum GradeHistoryAction {
  AI_GRADED
  REVIEWED
  APPROVED
  MODIFIED
  REJECTED
  REGRADED
}
```

### Step 1.5: Utility Functions

Create `src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
```

### Step 1.6: Constants

Create `src/lib/constants.ts`:

```typescript
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
```

### Step 1.7: Type Definitions

Create `src/types/index.ts`:

```typescript
import type { Course, Assignment, Submission, Grade, Batch, Rubric, User } from "@prisma/client";

// Extended Types
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

// Rubric Types
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

// Grading Types
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

// Real-time Event Types
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

// UI State Types
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
```

### Step 1.8: Database Client

Create `src/server/db.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

---

## Phase 2: Authentication & Layout

### Step 2.1: Root Layout with Clerk

Create `src/app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pointage",
  description: "AI-powered grading assistant for university markers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### Step 2.2: Middleware

Create `src/middleware.ts`:

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

### Step 2.3: Dashboard Layout

Create `src/app/(dashboard)/layout.tsx`:

```typescript
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { TRPCProvider } from "@/components/providers/TRPCProvider";
import { Toaster } from "@/components/ui/toaster";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <TRPCProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:pl-72">
          <Header />
          <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
      <Toaster />
    </TRPCProvider>
  );
}
```

---

## Phase 3-10: Detailed Implementation

Due to the extensive nature of the remaining phases, here is a summary of what each phase covers:

### Phase 3: tRPC Setup & API Routes
- tRPC configuration with Clerk authentication
- Course, Assignment, Grade, Batch, and Submission routers
- Protected procedures with organization scoping

### Phase 4: File Storage & Upload
- Supabase storage configuration
- Upload utilities with signed URLs
- Dropzone uploader component
- File upload API route

### Phase 5: Document Processing Workers
- Worker pool with multiple Gemini API keys
- PDF to image conversion using pdf2pic
- DOCX to PDF to image conversion using LibreOffice
- BullMQ job queues for async processing

### Phase 6: AI Grading Engine
- Gemini 2.5 Vision API integration
- Grading prompt templates
- Confidence scoring
- Multi-page document handling

### Phase 7: Real-time Progress System
- Pusher integration for WebSocket updates
- useBatchProgress hook for UI state
- Progress broadcasting from workers

### Phase 8: Review Interface
- Grade review list with filtering
- Grade review card with approve/modify actions
- Side-by-side submission/solution viewer
- Batch approve functionality

### Phase 9: Dashboard & Analytics
- Dashboard page with stats
- Recent batches list
- Quick action cards
- Grade statistics

### Phase 10: Testing & Deployment
- Docker Compose for local development
- Worker Dockerfile with LibreOffice
- Vercel configuration
- Setup scripts

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Initialize Next.js project
- [ ] Install all dependencies
- [ ] Configure environment variables
- [ ] Set up Prisma schema
- [ ] Create utility functions
- [ ] Define TypeScript types

### Phase 2: Authentication
- [ ] Configure Clerk
- [ ] Create auth pages
- [ ] Set up middleware
- [ ] Create dashboard layout

### Phase 3: API Layer
- [ ] Set up tRPC
- [ ] Create all routers
- [ ] Implement protected procedures

### Phase 4: File Storage
- [ ] Configure Supabase storage
- [ ] Create upload utilities
- [ ] Build upload components

### Phase 5: Document Processing
- [ ] Set up worker project
- [ ] Implement document conversion
- [ ] Create worker pool

### Phase 6: AI Grading
- [ ] Configure Gemini client
- [ ] Create grading prompts
- [ ] Implement grading service

### Phase 7: Real-time Updates
- [ ] Set up Pusher
- [ ] Create progress hooks
- [ ] Implement broadcasting

### Phase 8: Review Interface
- [ ] Build review components
- [ ] Implement approve/modify
- [ ] Create side-by-side viewer

### Phase 9: Dashboard
- [ ] Build dashboard page
- [ ] Create stats components
- [ ] Add analytics

### Phase 10: Deployment
- [ ] Configure Docker
- [ ] Set up Vercel
- [ ] Deploy workers

---

## Estimated Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1 | 2-3 days | None |
| Phase 2 | 1-2 days | Phase 1 |
| Phase 3 | 3-4 days | Phase 2 |
| Phase 4 | 2-3 days | Phase 3 |
| Phase 5 | 3-4 days | Phase 4 |
| Phase 6 | 2-3 days | Phase 5 |
| Phase 7 | 2-3 days | Phase 6 |
| Phase 8 | 3-4 days | Phase 7 |
| Phase 9 | 2-3 days | Phase 8 |
| Phase 10 | 2-3 days | Phase 9 |

**Total Estimated Time: 6-8 weeks**

---

## Key Architecture Decisions

### Vision-First Processing
All documents (PDF, DOCX, images) are converted to images before AI processing. This ensures consistent handling across formats and leverages Gemini's vision capabilities.

### Parallel Worker Architecture
Multiple Gemini API keys enable parallel grading. Each worker has its own rate limiter and concurrency settings to maximize throughput while respecting API limits.

### Real-time Progress Updates
Pusher WebSockets provide instant feedback on batch processing. Users see live progress without polling.

### Human-in-the-Loop
AI grades are never final without human review. The system flags low-confidence grades and provides tools for easy approval or modification.

---

## Support

For questions or issues, please open a GitHub issue or contact the development team.
