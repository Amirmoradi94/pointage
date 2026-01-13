import { connection as redisConnection } from "./queues/conversion.queue";
import { conversionWorker } from "./processors/conversion.processor";
import { gradingWorker } from "./processors/grading.processor";
import { notificationWorker } from "./processors/notification.processor";

redisConnection.on("connect", () => {
  console.log("[worker] Connected to Redis");
});

redisConnection.on("error", (err) => {
  console.error("[worker] Redis error", err);
});

const shutdown = async () => {
  console.log("[worker] Shutting down workers");
  await Promise.all([
    conversionWorker.close(),
    gradingWorker.close(),
    notificationWorker.close(),
    redisConnection.quit(),
  ]);
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
