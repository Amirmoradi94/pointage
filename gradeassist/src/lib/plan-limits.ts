import { db } from "@/server/db";
import { PlanType } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export interface PlanLimits {
  maxCourses: number | null;
  maxStudentsPerCourse: number | null;
  maxAssignmentsPerCourse: number | null;
  maxSubmissionsPerSemester: number | null;
  maxTeamMembers: number;
  hasPrioritySupport: boolean;
  hasAdvancedGrading: boolean;
  hasRubricCustomization: boolean;
}

/**
 * Get plan limits for a user
 */
export async function getUserPlanLimits(userId: string): Promise<PlanLimits> {
  const user = await db.user.findUnique({
    where: { id: userId },
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

  // If user has a subscription, use it (custom plans or overrides)
  if (user.subscription) {
    const sub = user.subscription;
    
    // Check if subscription is active (FREE plan is always active)
    if (sub.status !== "ACTIVE" && sub.planType !== PlanType.FREE) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Subscription is not active. Please upgrade your plan.",
      });
    }

    // Check if paid subscription expired
    if (sub.planType !== PlanType.FREE && sub.currentPeriodEnd < new Date()) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Your subscription has expired. Please renew your plan.",
      });
    }

    // Return subscription limits (custom plans can override defaults)
    return {
      maxCourses: sub.maxCourses,
      maxStudentsPerCourse: sub.maxStudentsPerCourse,
      maxAssignmentsPerCourse: sub.maxAssignmentsPerCourse,
      maxSubmissionsPerSemester: (sub as any).maxSubmissionsPerSemester ?? getPlanSubmissionLimit(sub.planType),
      maxTeamMembers: sub.maxTeamMembers ?? 1,
      hasPrioritySupport: sub.hasPrioritySupport,
      hasAdvancedGrading: sub.planType !== PlanType.STARTER && sub.planType !== PlanType.FREE,
      hasRubricCustomization: sub.planType !== PlanType.STARTER && sub.planType !== PlanType.FREE,
    };
  }

  // No subscription - use default free limits
  return getDefaultFreeLimits();
}

/**
 * Get default free plan limits
 */
export function getDefaultFreeLimits(): PlanLimits {
  return {
    maxCourses: 1,
    maxStudentsPerCourse: 40,
    maxAssignmentsPerCourse: 1,
    maxSubmissionsPerSemester: 50,
    maxTeamMembers: 1,
    hasPrioritySupport: false,
    hasAdvancedGrading: false,
    hasRubricCustomization: false,
  };
}

/**
 * Get submission limit for a plan type
 */
function getPlanSubmissionLimit(planType: PlanType): number | null {
  switch (planType) {
    case PlanType.FREE:
      return 50;
    case PlanType.STARTER:
      return 500;
    case PlanType.STANDARD:
      return 1500;
    case PlanType.PRO:
      return null; // unlimited
    case PlanType.CUSTOM:
      return null; // set by subscription
    default:
      return 50;
  }
}

/**
 * Get plan limits from plan type (for preset plans)
 */
export async function getPlanLimitsByType(planType: PlanType): Promise<PlanLimits> {
  const plan = await db.plan.findUnique({
    where: { planType },
  });

  if (!plan) {
    // Fallback to hardcoded limits if plan not in DB
    return getHardcodedPlanLimits(planType);
  }

  return {
    maxCourses: plan.maxCourses,
    maxStudentsPerCourse: plan.maxStudentsPerCourse,
    maxAssignmentsPerCourse: plan.maxAssignmentsPerCourse,
    maxSubmissionsPerSemester: (plan as any).maxSubmissionsPerSemester ?? getPlanSubmissionLimit(planType),
    maxTeamMembers: plan.maxTeamMembers,
    hasPrioritySupport: plan.hasPrioritySupport,
    hasAdvancedGrading: plan.hasAdvancedGrading,
    hasRubricCustomization: plan.hasRubricCustomization,
  };
}

/**
 * Hardcoded plan limits (fallback if Plan table not populated)
 */
function getHardcodedPlanLimits(planType: PlanType): PlanLimits {
  switch (planType) {
    case PlanType.FREE:
      return getDefaultFreeLimits();
    case PlanType.STARTER:
      return {
        maxCourses: 1,
        maxStudentsPerCourse: 30,
        maxAssignmentsPerCourse: 8,
        maxSubmissionsPerSemester: 500,
        maxTeamMembers: 1,
        hasPrioritySupport: false,
        hasAdvancedGrading: false,
        hasRubricCustomization: false,
      };
    case PlanType.STANDARD:
      return {
        maxCourses: 1,
        maxStudentsPerCourse: 100,
        maxAssignmentsPerCourse: 15,
        maxSubmissionsPerSemester: 1500,
        maxTeamMembers: 1,
        hasPrioritySupport: true,
        hasAdvancedGrading: true,
        hasRubricCustomization: true,
      };
    case PlanType.PRO:
      return {
        maxCourses: null, // unlimited
        maxStudentsPerCourse: null, // unlimited
        maxAssignmentsPerCourse: null, // unlimited
        maxSubmissionsPerSemester: null, // unlimited
        maxTeamMembers: 5,
        hasPrioritySupport: true,
        hasAdvancedGrading: true,
        hasRubricCustomization: true,
      };
    default:
      return getDefaultFreeLimits();
  }
}

/**
 * Check if user can create a course
 */
export async function canCreateCourse(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const limits = await getUserPlanLimits(userId);
  
  if (limits.maxCourses === null) {
    return { allowed: true };
  }

  const courseCount = await db.course.count({
    where: {
      createdById: userId,
      isArchived: false,
    },
  });

  if (courseCount >= limits.maxCourses) {
    return {
      allowed: false,
      reason: `You've reached your plan limit of ${limits.maxCourses} course(s). Upgrade to create more courses.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if user can add students to a course
 */
export async function canAddStudents(
  userId: string,
  courseId: string,
  additionalStudents: number
): Promise<{ allowed: boolean; reason?: string }> {
  const limits = await getUserPlanLimits(userId);
  
  if (limits.maxStudentsPerCourse === null) {
    return { allowed: true };
  }

  // Count unique students across all assignments in this course
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      assignments: {
        include: {
          submissions: {
            select: {
              studentIdentifier: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    return { allowed: false, reason: "Course not found" };
  }

  // Get unique student identifiers
  const uniqueStudents = new Set<string>();
  course.assignments.forEach((assignment) => {
    assignment.submissions.forEach((submission) => {
      uniqueStudents.add(submission.studentIdentifier);
    });
  });

  const currentCount = uniqueStudents.size;
  const newCount = currentCount + additionalStudents;

  if (newCount > limits.maxStudentsPerCourse) {
    return {
      allowed: false,
      reason: `This would exceed your plan limit of ${limits.maxStudentsPerCourse} students per course. Current: ${currentCount}, Adding: ${additionalStudents}.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if user can create an assignment
 */
export async function canCreateAssignment(
  userId: string,
  courseId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const limits = await getUserPlanLimits(userId);
  
  if (limits.maxAssignmentsPerCourse === null) {
    return { allowed: true };
  }

  const assignmentCount = await db.assignment.count({
    where: {
      courseId,
      status: {
        not: "ARCHIVED",
      },
    },
  });

  if (assignmentCount >= limits.maxAssignmentsPerCourse) {
    return {
      allowed: false,
      reason: `You've reached your plan limit of ${limits.maxAssignmentsPerCourse} assignments per course. Upgrade to create more assignments.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if user can upload submissions (check submission limit)
 */
export async function canUploadSubmissions(
  userId: string,
  assignmentId: string,
  submissionCount: number
): Promise<{ allowed: boolean; reason?: string }> {
  const assignment = await db.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      course: true,
    },
  });

  if (!assignment) {
    return { allowed: false, reason: "Assignment not found" };
  }

  // Get user with subscription to check billing period
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
    },
  });

  if (!user) {
    return { allowed: false, reason: "User not found" };
  }

  const limits = await getUserPlanLimits(userId);

  // Check submission limit
  if (limits.maxSubmissionsPerSemester === null) {
    return { allowed: true }; // Unlimited
  }

  // Get current period dates
  const currentPeriodStart = user.subscription?.currentPeriodStart ?? new Date(0);
  const currentPeriodEnd = user.subscription?.currentPeriodEnd ?? new Date("2099-12-31");

  // Count existing submissions in the current billing period
  const existingCount = await db.submission.count({
    where: {
      assignment: {
        createdById: userId,
      },
      createdAt: {
        gte: currentPeriodStart,
        lte: currentPeriodEnd,
      },
      status: {
        in: ["GRADED", "PENDING_GRADING", "GRADING"],
      },
    },
  });

  const totalSubmissions = existingCount + submissionCount;

  if (totalSubmissions > limits.maxSubmissionsPerSemester) {
    return {
      allowed: false,
      reason: `This would exceed your plan limit of ${limits.maxSubmissionsPerSemester} submissions per semester. Current: ${existingCount}, Adding: ${submissionCount}. Upgrade your plan to add more submissions.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if user can grade submissions (check submission limit)
 */
export async function canGradeSubmissions(
  userId: string,
  submissionCount: number = 1
): Promise<{ allowed: boolean; reason?: string }> {
  // Get user with subscription to check billing period
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
    },
  });

  if (!user) {
    return { allowed: false, reason: "User not found" };
  }

  const limits = await getUserPlanLimits(userId);

  // Check submission limit
  if (limits.maxSubmissionsPerSemester === null) {
    return { allowed: true }; // Unlimited
  }

  // Get current period dates
  const currentPeriodStart = user.subscription?.currentPeriodStart ?? new Date(0);
  const currentPeriodEnd = user.subscription?.currentPeriodEnd ?? new Date("2099-12-31");

  // Count existing graded submissions in the current billing period
  const existingCount = await db.submission.count({
    where: {
      assignment: {
        createdById: userId,
      },
      createdAt: {
        gte: currentPeriodStart,
        lte: currentPeriodEnd,
      },
      status: {
        in: ["GRADED", "PENDING_GRADING", "GRADING"],
      },
    },
  });

  const totalSubmissions = existingCount + submissionCount;

  if (totalSubmissions > limits.maxSubmissionsPerSemester) {
    return {
      allowed: false,
      reason: `This would exceed your plan limit of ${limits.maxSubmissionsPerSemester} submissions per semester. Current: ${existingCount}. Upgrade your plan to grade more submissions.`,
    };
  }

  return { allowed: true };
}
