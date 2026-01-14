import { GradeHistoryAction, GradeStatus } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "@/server/api/trpc";

const actionFromStatus = (status: GradeStatus): GradeHistoryAction => {
  switch (status) {
    case GradeStatus.APPROVED:
      return GradeHistoryAction.APPROVED;
    case GradeStatus.MODIFIED:
      return GradeHistoryAction.MODIFIED;
    case GradeStatus.REJECTED:
      return GradeHistoryAction.REJECTED;
    default:
      return GradeHistoryAction.REVIEWED;
  }
};

export const gradeRouter = router({
  listByAssignment: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string().min(1),
        statuses: z.array(z.nativeEnum(GradeStatus)).optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.grade.findMany({
        where: {
          submission: { assignmentId: input.assignmentId },
          status: input.statuses ? { in: input.statuses } : undefined,
        },
        include: {
          submission: { include: { pages: true } },
          reviewedBy: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  review: protectedProcedure
    .input(
      z.object({
        gradeId: z.string().min(1),
        finalScore: z.number().optional(),
        finalFeedback: z.string().optional(),
        status: z.nativeEnum(GradeStatus),
        reviewNotes: z.string().optional(),
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

      return ctx.db.grade.update({
        where: { id: input.gradeId },
        data: {
          finalScore: input.finalScore,
          finalFeedback: input.finalFeedback,
          status: input.status,
          reviewNotes: input.reviewNotes,
          reviewedById: user.id,
          reviewedAt: new Date(),
          history: {
            create: {
              action: actionFromStatus(input.status),
              newValues: {
                finalScore: input.finalScore,
                finalFeedback: input.finalFeedback,
                status: input.status,
              },
              userId: user.id,
            },
          },
        },
      });
    }),
});
