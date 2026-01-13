"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradingWorker = void 0;
const bullmq_1 = require("bullmq");
const client_1 = require("@prisma/client");
const grading_queue_1 = require("../queues/grading.queue");
const notification_queue_1 = require("../queues/notification.queue");
const gemini_grader_1 = require("../services/gemini-grader");
const prisma = new client_1.PrismaClient();
const processGrading = async (job) => {
    const { submissionId, assignmentId, batchId } = job.data;
    console.log(`[grading] Processing submission ${submissionId}`);
    try {
        // Update submission status
        await prisma.submission.update({
            where: { id: submissionId },
            data: { status: "GRADING" },
        });
        // Notify grading started
        await notification_queue_1.notificationQueue.add("grading-started", {
            channel: batchId ? `batch-${batchId}` : `submission-${submissionId}`,
            payload: {
                type: "grading_started",
                submissionId,
            },
        });
        // Fetch submission with pages
        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
            include: {
                pages: {
                    orderBy: { pageNumber: "asc" },
                },
            },
        });
        if (!submission) {
            throw new Error(`Submission ${submissionId} not found`);
        }
        if (!submission.pages || submission.pages.length === 0) {
            throw new Error(`No pages found for submission ${submissionId}`);
        }
        // Fetch assignment with solution and rubric
        const assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            include: {
                solution: {
                    include: {
                        pages: {
                            orderBy: { pageNumber: "asc" },
                        },
                    },
                },
                rubric: true,
            },
        });
        if (!assignment) {
            throw new Error(`Assignment ${assignmentId} not found`);
        }
        if (!assignment.solution || !assignment.solution.pages.length) {
            throw new Error(`No solution found for assignment ${assignmentId}`);
        }
        // Fetch course for courseType
        const course = await prisma.course.findUnique({
            where: { id: assignment.courseId },
            select: { courseType: true },
        });
        // Parse grading settings
        const gradingSettings = typeof assignment.gradingSettings === "object"
            ? assignment.gradingSettings
            : {};
        // Prepare grading input
        const gradingInput = {
            submissionId,
            assignmentId,
            submissionPages: submission.pages.map((p) => ({
                pageNumber: p.pageNumber,
                imageUrl: p.imageUrl,
            })),
            solutionPages: assignment.solution.pages.map((p) => ({
                pageNumber: p.pageNumber,
                imageUrl: p.imageUrl,
            })),
            rubric: assignment.rubric
                ? {
                    criteria: typeof assignment.rubric.criteria === "object" &&
                        Array.isArray(assignment.rubric.criteria)
                        ? assignment.rubric.criteria
                        : [],
                    totalPoints: assignment.rubric.totalPoints,
                }
                : undefined,
            maxScore: assignment.maxScore,
            gradingSettings: {
                strictness: gradingSettings.strictness || "moderate",
                allowAlternativeMethods: gradingSettings.allowAlternativeMethods ?? true,
                partialCreditEnabled: gradingSettings.partialCreditEnabled ?? true,
                customInstructions: gradingSettings.customInstructions,
            },
            courseType: course?.courseType,
        };
        // Call Gemini grading service
        console.log(`[grading] Calling Gemini for ${submissionId}`);
        const result = await (0, gemini_grader_1.gradeWithGemini)(gradingInput);
        // Determine grade status based on confidence and flags
        let gradeStatus = "READY_FOR_REVIEW";
        if (result.confidence < 0.75 || result.flagsForReview.length > 0) {
            gradeStatus = "NEEDS_ATTENTION";
        }
        // Save grade to database
        await prisma.grade.create({
            data: {
                submissionId,
                aiScore: result.score,
                aiMaxScore: result.maxScore,
                aiFeedback: result.feedback,
                aiConfidence: result.confidence,
                criteriaBreakdown: result.criteriaBreakdown,
                pageAnnotations: result.pageAnnotations,
                flagsForReview: result.flagsForReview,
                status: gradeStatus,
                processingTime: result.processingTime,
                modelUsed: result.modelUsed,
                workerId: `worker-${process.pid}`,
                history: {
                    create: {
                        action: "AI_GRADED",
                        newValues: {
                            score: result.score,
                            confidence: result.confidence,
                            modelUsed: result.modelUsed,
                        },
                    },
                },
            },
        });
        // Update submission status
        await prisma.submission.update({
            where: { id: submissionId },
            data: { status: "GRADED" },
        });
        console.log(`[grading] Completed ${submissionId}: ${result.score}/${result.maxScore} (confidence: ${result.confidence.toFixed(2)})`);
        // Notify grading complete
        await notification_queue_1.notificationQueue.add("grading-complete", {
            channel: batchId ? `batch-${batchId}` : `submission-${submissionId}`,
            payload: {
                type: "grading_complete",
                submissionId,
                result: {
                    score: result.score,
                    maxScore: result.maxScore,
                    confidence: result.confidence,
                    feedback: result.feedback.substring(0, 200), // Truncate for notification
                    flagsForReview: result.flagsForReview,
                },
            },
        });
        return result;
    }
    catch (error) {
        console.error(`[grading] Failed ${submissionId}:`, error);
        // Update submission status
        await prisma.submission.update({
            where: { id: submissionId },
            data: {
                status: "FAILED",
                errorMessage: `Grading failed: ${error}`,
            },
        });
        // Notify failure
        await notification_queue_1.notificationQueue.add("grading-failed", {
            channel: batchId ? `batch-${batchId}` : `submission-${submissionId}`,
            payload: {
                type: "submission_failed",
                submissionId,
                error: `Grading failed: ${error}`,
            },
        });
        throw error;
    }
};
exports.gradingWorker = new bullmq_1.Worker(grading_queue_1.gradingQueue.name, processGrading, {
    connection: grading_queue_1.gradingQueue.opts.connection,
    concurrency: 2, // Limit concurrent grading jobs
});
exports.gradingWorker.on("completed", (job) => {
    console.log(`[grading] Completed grading for submission ${job.data.submissionId}`);
});
exports.gradingWorker.on("failed", (job, err) => {
    console.error("[grading] Failed:", job?.data?.submissionId, err);
});
