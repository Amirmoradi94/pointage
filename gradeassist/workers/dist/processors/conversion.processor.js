"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversionWorker = void 0;
const bullmq_1 = require("bullmq");
const conversion_queue_1 = require("../queues/conversion.queue");
const grading_queue_1 = require("../queues/grading.queue");
const notification_queue_1 = require("../queues/notification.queue");
const document_converter_1 = require("../services/document-converter");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const processConversion = async (job) => {
    const { submissionId, fileUrl, mimeType, batchId } = job.data;
    console.log(`[conversion] Processing ${submissionId}, type: ${mimeType}`);
    try {
        // Update submission status to CONVERTING
        await prisma.submission.update({
            where: { id: submissionId },
            data: { status: "CONVERTING" },
        });
        // Notify conversion started
        await notification_queue_1.notificationQueue.add("conversion-started", {
            channel: batchId ? `batch-${batchId}` : `submission-${submissionId}`,
            payload: {
                type: "conversion_started",
                submissionId,
            },
        });
        // Convert document to images
        if (!mimeType) {
            throw new Error("MIME type is required for conversion");
        }
        const conversionResult = await (0, document_converter_1.convertDocument)(fileUrl, mimeType, submissionId);
        // Update submission with page data
        await prisma.submission.update({
            where: { id: submissionId },
            data: {
                status: "PENDING_GRADING",
                pageCount: conversionResult.pageCount,
                pages: {
                    create: conversionResult.pages.map((page) => ({
                        pageNumber: page.pageNumber,
                        imageUrl: page.imageUrl,
                        width: page.width,
                        height: page.height,
                    })),
                },
            },
        });
        console.log(`[conversion] Completed ${submissionId}: ${conversionResult.pageCount} pages`);
        // Notify conversion complete
        await notification_queue_1.notificationQueue.add("conversion-complete", {
            channel: batchId ? `batch-${batchId}` : `submission-${submissionId}`,
            payload: {
                type: "conversion_complete",
                submissionId,
                pageCount: conversionResult.pageCount,
            },
        });
        // Queue for grading
        await grading_queue_1.gradingQueue.add("grade-submission", {
            submissionId,
            assignmentId: job.data.assignmentId,
            batchId,
        });
        return {
            submissionId,
            pageCount: conversionResult.pageCount,
            pages: conversionResult.pages,
        };
    }
    catch (error) {
        console.error(`[conversion] Failed ${submissionId}:`, error);
        // Update submission status to FAILED
        await prisma.submission.update({
            where: { id: submissionId },
            data: {
                status: "FAILED",
                errorMessage: `Conversion failed: ${error}`,
            },
        });
        // Notify failure
        await notification_queue_1.notificationQueue.add("conversion-failed", {
            channel: batchId ? `batch-${batchId}` : `submission-${submissionId}`,
            payload: {
                type: "submission_failed",
                submissionId,
                error: `Conversion failed: ${error}`,
            },
        });
        throw error;
    }
};
exports.conversionWorker = new bullmq_1.Worker(conversion_queue_1.conversionQueue.name, processConversion, { connection: conversion_queue_1.conversionQueue.opts.connection });
exports.conversionWorker.on("completed", (job) => {
    console.log(`[conversion] completed for submission ${job.data.submissionId}`);
});
exports.conversionWorker.on("failed", (job, err) => {
    console.error("[conversion] failed", job?.data?.submissionId, err);
});
