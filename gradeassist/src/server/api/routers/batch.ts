import { BatchStatus, SubmissionStatus } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "@/server/api/trpc";
import { canUploadSubmissions } from "@/lib/plan-limits";
import { TRPCError } from "@trpc/server";

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
    .mutation(async ({ ctx, input }) => {
      // Get user's database ID from clerkId
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId! },
        select: { id: true },
      });

      if (!user) {
        throw new Error("User not found in database. Please sign out and sign in again.");
      }

      // Check if user can upload these submissions
      const canUpload = await canUploadSubmissions(
        user.id,
        input.assignmentId,
        input.totalSubmissions
      );

      if (!canUpload.allowed) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: canUpload.reason ?? "You have reached your submission limit.",
        });
      }

      return ctx.db.batch.create({
        data: {
          assignmentId: input.assignmentId,
          uploadedById: user.id,
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
