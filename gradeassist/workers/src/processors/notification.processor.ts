import { Job, Worker } from "bullmq";
import { notificationQueue, type NotificationJob } from "../queues/notification.queue";
import { pusherServer } from "../lib/pusher";

const processNotification = async (job: Job<NotificationJob>) => {
  await pusherServer.trigger(job.data.channel, "event", job.data.payload);
  return { delivered: true };
};

export const notificationWorker = new Worker<NotificationJob>(
  notificationQueue.name,
  processNotification,
  { connection: notificationQueue.opts.connection },
);

notificationWorker.on("failed", (job, err) => {
  console.error("[notification] failed", job?.data?.channel, err);
});
