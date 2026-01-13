"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationWorker = void 0;
const bullmq_1 = require("bullmq");
const notification_queue_1 = require("../queues/notification.queue");
const pusher_1 = require("../lib/pusher");
const processNotification = async (job) => {
    await pusher_1.pusherServer.trigger(job.data.channel, "event", job.data.payload);
    return { delivered: true };
};
exports.notificationWorker = new bullmq_1.Worker(notification_queue_1.notificationQueue.name, processNotification, { connection: notification_queue_1.notificationQueue.opts.connection });
exports.notificationWorker.on("failed", (job, err) => {
    console.error("[notification] failed", job?.data?.channel, err);
});
