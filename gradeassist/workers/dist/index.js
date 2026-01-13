"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conversion_queue_1 = require("./queues/conversion.queue");
const conversion_processor_1 = require("./processors/conversion.processor");
const grading_processor_1 = require("./processors/grading.processor");
const notification_processor_1 = require("./processors/notification.processor");
conversion_queue_1.connection.on("connect", () => {
    console.log("[worker] Connected to Redis");
});
conversion_queue_1.connection.on("error", (err) => {
    console.error("[worker] Redis error", err);
});
const shutdown = async () => {
    console.log("[worker] Shutting down workers");
    await Promise.all([
        conversion_processor_1.conversionWorker.close(),
        grading_processor_1.gradingWorker.close(),
        notification_processor_1.notificationWorker.close(),
        conversion_queue_1.connection.quit(),
    ]);
    process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
