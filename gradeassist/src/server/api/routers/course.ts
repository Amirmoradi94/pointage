import { CourseType } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "@/server/api/trpc";

export const courseRouter = router({
  list: protectedProcedure
    .input(z.object({ organizationId: z.string().optional() }).optional())
    .query(({ ctx, input }) => {
      return ctx.db.course.findMany({
        where: input?.organizationId
          ? { organizationId: input.organizationId }
          : undefined,
        orderBy: { createdAt: "desc" },
        take: 100,
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.course.findUnique({
        where: { id: input.id },
        include: { assignments: true },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        code: z.string().min(1),
        description: z.string().optional(),
        semester: z.string().optional(),
        year: z.number().int().optional(),
        courseType: z.nativeEnum(CourseType).default(CourseType.GENERAL),
        organizationId: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.course.create({
        data: {
          name: input.name,
          code: input.code,
          description: input.description,
          semester: input.semester,
          year: input.year,
          courseType: input.courseType,
          organizationId: input.organizationId,
          createdById: ctx.userId!,
        },
      });
    }),

  archive: protectedProcedure
    .input(z.object({ id: z.string().min(1), isArchived: z.boolean() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.course.update({
        where: { id: input.id },
        data: { isArchived: input.isArchived },
      });
    }),
});
