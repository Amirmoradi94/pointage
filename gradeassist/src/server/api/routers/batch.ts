import { BatchStatus, SubmissionStatus } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "@/server/api/trpc";

export const batchRouter = router({
  list: protectedProcedure
    .input(z.object({ assignmentId: z.string().optional() }).optional())
    .query(({ ctx, input }) => {
      return ctx.db.batch.findMany({
        where: input?.assignmentId
          ? { assignmentId: input.assignmentId }
          : undefined,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { submissions: true } } },
        take: 50,
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.batch.findUnique({
        where: { id: input.id },
        include: {
          submissions: {
            orderBy: { createdAt: "desc" },
            include: { grade: true },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string().min(1),
        totalSubmissions: z.number().int().default(0),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.batch.create({
        data: {
          assignmentId: input.assignmentId,
          uploadedById: ctx.userId!,
          totalSubmissions: input.totalSubmissions,
          status: BatchStatus.UPLOADING,
        },
      });
    }),

  progress: protectedProcedure
    .input(z.object({ batchId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const submissions = await ctx.db.submission.findMany({
        where: { batchId: input.batchId },
        select: { status: true },
      });

      const counters = submissions.reduce(
        (acc, item) => {
          acc[item.status] = (acc[item.status] ?? 0) + 1;
          return acc;
        },
        {} as Record<SubmissionStatus, number>,
      );

      return {
        pending: counters[SubmissionStatus.PENDING_CONVERSION] ?? 0,
        converting: counters[SubmissionStatus.CONVERTING] ?? 0,
        grading: counters[SubmissionStatus.GRADING] ?? 0,
        graded: counters[SubmissionStatus.GRADED] ?? 0,
        failed: counters[SubmissionStatus.FAILED] ?? 0,
      };
    }),
});
