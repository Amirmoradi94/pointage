import { Queue } from "bullmq";
import { connection } from "./conversion.queue";

export interface GradingJob {
  submissionId: string;
  assignmentId: string;
  batchId?: string;
}

export const gradingQueue = new Queue<GradingJob>("grading", {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
  },
});
