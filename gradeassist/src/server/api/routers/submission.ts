import { SubmissionStatus, BatchStatus } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "@/server/api/trpc";
import { canUploadSubmissions } from "@/lib/plan-limits";
import { TRPCError } from "@trpc/server";

export const submissionRouter = router({
  listByAssignment: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string().min(1),
        status: z.nativeEnum(SubmissionStatus).optional(),
        sortBy: z.enum(["createdAt", "studentId", "score"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      })
    )
    .query(({ ctx, input }) => {
      const { assignmentId, status, sortBy = "createdAt", sortOrder = "desc" } = input;

      return ctx.db.submission.findMany({
        where: {
          assignmentId,
          ...(status ? { status } : {}),
        },
        include: {
          pages: true,
          grade: true,
          batch: {
            select: {
              id: true,
              status: true,
            },
          },
        },
        orderBy:
          sortBy === "score"
            ? { grade: { aiScore: sortOrder } }
            : { [sortBy]: sortOrder },
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

  createWithBatch: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string().min(1),
        submissions: z.array(
          z.object({
            studentIdentifier: z.string().min(1),
            originalFilename: z.string().min(1),
            originalFileUrl: z.string(),
            mimeType: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get user's database ID from clerkId
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId! },
        select: { id: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found in database. Please sign out and sign in again.",
        });
      }

      // Check plan limits
      const canUpload = await canUploadSubmissions(
        user.id,
        input.assignmentId,
        input.submissions.length
      );
      if (!canUpload.allowed) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: canUpload.reason || "Plan limit reached",
        });
      }

      // Create batch first
      const batch = await ctx.db.batch.create({
        data: {
          assignmentId: input.assignmentId,
          uploadedById: user.id,
          totalSubmissions: input.submissions.length,
          status: BatchStatus.CONVERTING,
        },
      });

      // Create all submissions associated with this batch
      const createdSubmissions = await Promise.all(
        input.submissions.map((sub) =>
          ctx.db.submission.create({
            data: {
              assignmentId: input.assignmentId,
              batchId: batch.id,
              studentIdentifier: sub.studentIdentifier,
              originalFilename: sub.originalFilename,
              originalFileUrl: sub.originalFileUrl,
              mimeType: sub.mimeType,
              status: SubmissionStatus.PENDING_CONVERSION,
            },
          })
        )
      );

      // TODO: Queue conversion jobs for each submission
      // Example: await conversionQueue.addBulk(createdSubmissions.map(sub => ({ submissionId: sub.id })))

      return {
        batchId: batch.id,
        submissionIds: createdSubmissions.map((s) => s.id),
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.submission.delete({
        where: { id: input.id },
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.submission.findUnique({
        where: { id: input.id },
        include: {
          pages: true,
          grade: {
            include: {
              history: true,
            },
          },
          batch: true,
          assignment: {
            include: {
              rubric: true,
              solution: true,
            },
          },
        },
      });
    }),

  updateStudentInfo: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        extractedStudentName: z.string().nullable(),
        extractedStudentId: z.string().nullable(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.submission.update({
        where: { id: input.id },
        data: {
          extractedStudentName: input.extractedStudentName,
          extractedStudentId: input.extractedStudentId,
        },
      });
    }),
});
