import { PlanType } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getUserPlanLimits } from "@/lib/plan-limits";

export const subscriptionRouter = router({
  // Get current subscription
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.userId! },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    if (!user.subscription) {
      // Return default free limits
      return {
        planType: PlanType.FREE,
        status: "ACTIVE" as const,
        limits: await getUserPlanLimits(user.id),
        currentPeriodEnd: new Date("2099-12-31"), // Forever
      };
    }

    const limits = await getUserPlanLimits(user.id);
    return {
      planType: user.subscription.planType,
      status: user.subscription.status,
      limits,
      currentPeriodStart: user.subscription.currentPeriodStart,
      currentPeriodEnd: user.subscription.currentPeriodEnd,
      cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
    };
  }),

  // Get plan limits
  getLimits: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.userId! },
      select: { id: true },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return getUserPlanLimits(user.id);
  }),

  // Update subscription (for admin/internal use or after payment)
  update: protectedProcedure
    .input(
      z.object({
        planType: z.nativeEnum(PlanType),
        pricePerSemester: z.number(),
        maxCourses: z.number().nullable().optional(),
        maxStudentsPerCourse: z.number().nullable().optional(),
        maxAssignmentsPerCourse: z.number().nullable().optional(),
        maxTeamMembers: z.number().optional(),
        hasPrioritySupport: z.boolean().optional(),
        currentPeriodEnd: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { clerkId: ctx.userId! },
        select: { id: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return ctx.db.subscription.upsert({
        where: { userId: user.id },
        update: {
          planType: input.planType,
          status: "ACTIVE",
          pricePerSemester: input.pricePerSemester,
          maxCourses: input.maxCourses,
          maxStudentsPerCourse: input.maxStudentsPerCourse,
          maxAssignmentsPerCourse: input.maxAssignmentsPerCourse,
          maxTeamMembers: input.maxTeamMembers,
          hasPrioritySupport: input.hasPrioritySupport ?? false,
          currentPeriodStart: new Date(),
          currentPeriodEnd: input.currentPeriodEnd,
          cancelAtPeriodEnd: false,
        },
        create: {
          userId: user.id,
          planType: input.planType,
          status: "ACTIVE",
          pricePerSemester: input.pricePerSemester,
          maxCourses: input.maxCourses,
          maxStudentsPerCourse: input.maxStudentsPerCourse,
          maxAssignmentsPerCourse: input.maxAssignmentsPerCourse,
          maxTeamMembers: input.maxTeamMembers ?? 1,
          hasPrioritySupport: input.hasPrioritySupport ?? false,
          currentPeriodStart: new Date(),
          currentPeriodEnd: input.currentPeriodEnd,
        },
      });
    }),

  // Cancel subscription
  cancel: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.userId! },
      select: { id: true },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return ctx.db.subscription.update({
      where: { userId: user.id },
      data: {
        cancelAtPeriodEnd: true,
      },
    });
  }),

  // List all available plans
  listPlans: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.plan.findMany({
      where: { isActive: true },
      orderBy: { pricePerSemester: "asc" },
    });
  }),
});
