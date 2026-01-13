import { batchRouter } from "@/server/api/routers/batch";
import { courseRouter } from "@/server/api/routers/course";
import { gradeRouter } from "@/server/api/routers/grade";
import { assignmentRouter } from "@/server/api/routers/assignment";
import { submissionRouter } from "@/server/api/routers/submission";
import { router } from "@/server/api/trpc";

export const appRouter = router({
  course: courseRouter,
  assignment: assignmentRouter,
  submission: submissionRouter,
  grade: gradeRouter,
  batch: batchRouter,
});

export type AppRouter = typeof appRouter;
