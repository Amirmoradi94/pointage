import { AssignmentStatus } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "@/server/api/trpc";
import { canCreateAssignment } from "@/lib/plan-limits";
import { TRPCError } from "@trpc/server";

const assignmentBaseInput = z.object({
  courseId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  maxScore: z.number().optional().default(100),
  rubricId: z.string().optional(),
  gradingSettings: z.record(z.any()).optional(),
});

export const assignmentRouter = router({
  listByCourse: protectedProcedure
    .input(z.object({ courseId: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.assignment.findMany({
        where: { courseId: input.courseId },
        orderBy: { createdAt: "desc" },
        include: {
          rubric: true,
          solution: true,
          _count: { select: { submissions: true, batches: true } },
        },
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.assignment.findUnique({
        where: { id: input.id },
        include: {
          rubric: true,
          solution: true,
          _count: { select: { submissions: true, batches: true } },
        },
      });
    }),

  create: protectedProcedure
    .input(assignmentBaseInput)
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
      const canCreate = await canCreateAssignment(user.id, input.courseId);
      if (!canCreate.allowed) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: canCreate.reason || "Plan limit reached",
        });
      }

      return ctx.db.assignment.create({
        data: {
          courseId: input.courseId,
          title: input.title,
          description: input.description,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
          maxScore: input.maxScore ?? 100,
          rubricId: input.rubricId,
          gradingSettings: input.gradingSettings ?? {},
          createdById: user.id,
        },
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        status: z.nativeEnum(AssignmentStatus),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.assignment.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  statistics: protectedProcedure
    .input(z.object({ assignmentId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      // Get all submissions with grades
      const submissions = await ctx.db.submission.findMany({
        where: { assignmentId: input.assignmentId },
        include: { grade: true },
      });

      const totalSubmissions = submissions.length;
      const gradedSubmissions = submissions.filter((s) => s.grade).length;
      const pendingSubmissions = submissions.filter(
        (s) => !s.grade && s.status !== "FAILED"
      ).length;
      const failedSubmissions = submissions.filter(
        (s) => s.status === "FAILED"
      ).length;

      // Calculate score statistics (use finalScore if available, otherwise aiScore)
      const gradedScores = submissions
        .filter((s) => s.grade && (s.grade.finalScore != null || s.grade.aiScore != null))
        .map((s) => s.grade!.finalScore ?? s.grade!.aiScore!);

      const averageScore =
        gradedScores.length > 0
          ? gradedScores.reduce((a, b) => a + b, 0) / gradedScores.length
          : 0;

      const minScore =
        gradedScores.length > 0 ? Math.min(...gradedScores) : 0;
      const maxScore =
        gradedScores.length > 0 ? Math.max(...gradedScores) : 0;

      // Calculate confidence statistics
      const confidences = submissions
        .filter((s) => s.grade?.aiConfidence)
        .map((s) => s.grade!.aiConfidence!);

      const averageConfidence =
        confidences.length > 0
          ? confidences.reduce((a, b) => a + b, 0) / confidences.length
          : 0;

      // Score distribution (buckets: 0-20, 21-40, 41-60, 61-80, 81-100)
      const scoreDistribution = {
        "0-20": gradedScores.filter((s) => s <= 20).length,
        "21-40": gradedScores.filter((s) => s > 20 && s <= 40).length,
        "41-60": gradedScores.filter((s) => s > 40 && s <= 60).length,
        "61-80": gradedScores.filter((s) => s > 60 && s <= 80).length,
        "81-100": gradedScores.filter((s) => s > 80 && s <= 100).length,
      };

      return {
        totalSubmissions,
        gradedSubmissions,
        pendingSubmissions,
        failedSubmissions,
        averageScore: Math.round(averageScore * 10) / 10,
        minScore,
        maxScore,
        averageConfidence: Math.round(averageConfidence * 100) / 100,
        scoreDistribution,
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.assignment.delete({
        where: { id: input.id },
      });
    }),

  // Add or update solution for an assignment
  setSolution: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string().min(1),
        fileUrl: z.string().url(),
        filename: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get user's database ID
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId! },
        select: { id: true },
      });

      if (!user) {
        throw new Error("User not found in database.");
      }

      // Check if solution already exists for this assignment
      const existingSolution = await ctx.db.solution.findUnique({
        where: { assignmentId: input.assignmentId },
      });

      if (existingSolution) {
        // Update existing solution
        return ctx.db.solution.update({
          where: { id: existingSolution.id },
          data: {
            notes: input.notes,
            uploadedById: user.id,
            // Create a single page for the solution file
            pages: {
              deleteMany: {}, // Remove old pages
              create: {
                pageNumber: 1,
                imageUrl: input.fileUrl,
              },
            },
          },
          include: { pages: true },
        });
      }

      // Create new solution
      return ctx.db.solution.create({
        data: {
          assignmentId: input.assignmentId,
          uploadedById: user.id,
          notes: input.notes,
          pages: {
            create: {
              pageNumber: 1,
              imageUrl: input.fileUrl,
            },
          },
        },
        include: { pages: true },
      });
    }),

  // Update grading settings for an assignment
  updateGradingSettings: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        gradingSettings: z.record(z.any()),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.assignment.update({
        where: { id: input.id },
        data: { gradingSettings: input.gradingSettings },
      });
    }),
});
