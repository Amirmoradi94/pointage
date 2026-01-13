import { AssignmentStatus } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "@/server/api/trpc";

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
    .mutation(({ ctx, input }) => {
      return ctx.db.assignment.create({
        data: {
          courseId: input.courseId,
          title: input.title,
          description: input.description,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
          maxScore: input.maxScore ?? 100,
          rubricId: input.rubricId,
          gradingSettings: input.gradingSettings ?? {},
          createdById: ctx.userId!,
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
});
