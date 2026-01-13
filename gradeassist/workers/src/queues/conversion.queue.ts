import { Queue } from "bullmq";
import Redis from "ioredis";

export interface ConversionJob {
  submissionId: string;
  assignmentId: string;
  fileUrl: string;
  mimeType?: string;
  batchId?: string;
}

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
export const connection = new Redis(redisUrl);

export const conversionQueue = new Queue<ConversionJob>("conversion", {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
  },
});
