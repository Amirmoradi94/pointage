import { Queue } from "bullmq";
import { connection } from "./conversion.queue";

export interface NotificationJob {
  channel: string;
  payload: Record<string, unknown>;
}

export const notificationQueue = new Queue<NotificationJob>("notification", {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    attempts: 2,
  },
});
