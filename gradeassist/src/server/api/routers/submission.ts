import { SubmissionStatus } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "@/server/api/trpc";

export const submissionRouter = router({
  listByAssignment: protectedProcedure
    .input(z.object({ assignmentId: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.submission.findMany({
        where: { assignmentId: input.assignmentId },
        include: { pages: true, grade: true },
        orderBy: { createdAt: "desc" },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string().min(1),
        batchId: z.string().optional(),
        studentIdentifier: z.string().min(1),
        originalFilename: z.string().min(1),
        originalFileUrl: z.string().url(),
        mimeType: z.string().optional(),
        pageCount: z.number().int().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.submission.create({
        data: {
          assignmentId: input.assignmentId,
          batchId: input.batchId,
          studentIdentifier: input.studentIdentifier,
          originalFilename: input.originalFilename,
          originalFileUrl: input.originalFileUrl,
          mimeType: input.mimeType,
          pageCount: input.pageCount,
          status: SubmissionStatus.PENDING_CONVERSION,
        },
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        status: z.nativeEnum(SubmissionStatus),
        errorMessage: z.string().optional(),
        pageCount: z.number().int().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.submission.update({
        where: { id: input.id },
        data: {
          status: input.status,
          errorMessage: input.errorMessage,
          pageCount: input.pageCount,
        },
      });
    }),
});
