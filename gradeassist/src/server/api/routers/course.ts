import { CourseType } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "@/server/api/trpc";
import { canCreateCourse } from "@/lib/plan-limits";
import { TRPCError } from "@trpc/server";

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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get user's organizationId and id from database
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId! },
        select: { id: true, organizationId: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found in database. Please sign out and sign in again.",
        });
      }

      // Check plan limits
      const canCreate = await canCreateCourse(user.id);
      if (!canCreate.allowed) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: canCreate.reason || "Plan limit reached",
        });
      }

      return ctx.db.course.create({
        data: {
          name: input.name,
          code: input.code,
          description: input.description,
          semester: input.semester,
          year: input.year,
          courseType: input.courseType,
          organizationId: user.organizationId,
          createdById: user.id,
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
