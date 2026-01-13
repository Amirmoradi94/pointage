import { Job, Worker } from "bullmq";
import { conversionQueue, type ConversionJob } from "../queues/conversion.queue";
import { gradingQueue } from "../queues/grading.queue";
import { notificationQueue } from "../queues/notification.queue";
import { convertDocument } from "../services/document-converter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const processConversion = async (job: Job<ConversionJob>) => {
  const { submissionId, fileUrl, mimeType, batchId } = job.data;

  console.log(`[conversion] Processing ${submissionId}, type: ${mimeType}`);

  try {
    // Update submission status to CONVERTING
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: "CONVERTING" },
    });

    // Notify conversion started
    await notificationQueue.add("conversion-started", {
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
    const conversionResult = await convertDocument(fileUrl, mimeType, submissionId);

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
    await notificationQueue.add("conversion-complete", {
      channel: batchId ? `batch-${batchId}` : `submission-${submissionId}`,
      payload: {
        type: "conversion_complete",
        submissionId,
        pageCount: conversionResult.pageCount,
      },
    });

    // Queue for grading
    await gradingQueue.add("grade-submission", {
      submissionId,
      assignmentId: job.data.assignmentId,
      batchId,
    });

    return {
      submissionId,
      pageCount: conversionResult.pageCount,
      pages: conversionResult.pages,
    };
  } catch (error) {
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
    await notificationQueue.add("conversion-failed", {
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

export const conversionWorker = new Worker<ConversionJob>(
  conversionQueue.name,
  processConversion,
  { connection: conversionQueue.opts.connection },
);

conversionWorker.on("completed", (job) => {
  console.log(`[conversion] completed for submission ${job.data.submissionId}`);
});

conversionWorker.on("failed", (job, err) => {
  console.error("[conversion] failed", job?.data?.submissionId, err);
});
