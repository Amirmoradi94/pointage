import { PrismaClient, PlanType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed plan data
  console.log("Seeding plans...");

  const plans = [
    {
      planType: PlanType.FREE,
      name: "Free",
      description: "Free forever - try Pointage",
      maxCourses: 1,
      maxStudentsPerCourse: 40,
      maxAssignmentsPerCourse: 1,
      maxTeamMembers: 1,
      hasPrioritySupport: false,
      hasAdvancedGrading: false,
      hasRubricCustomization: false,
      pricePerSemester: 0,
      pricePerMonth: 0,
      isActive: true,
    },
    {
      planType: PlanType.STARTER,
      name: "Starter",
      description: "Perfect for small tutorials",
      maxCourses: 1,
      maxStudentsPerCourse: 30,
      maxAssignmentsPerCourse: 8,
      maxTeamMembers: 1,
      hasPrioritySupport: false,
      hasAdvancedGrading: false,
      hasRubricCustomization: false,
      pricePerSemester: 29,
      pricePerMonth: 9,
      isActive: true,
    },
    {
      planType: PlanType.STANDARD,
      name: "Standard",
      description: "Most popular for TAs",
      maxCourses: 1,
      maxStudentsPerCourse: 100,
      maxAssignmentsPerCourse: 15,
      maxTeamMembers: 1,
      hasPrioritySupport: true,
      hasAdvancedGrading: true,
      hasRubricCustomization: true,
      pricePerSemester: 49,
      pricePerMonth: 15,
      isActive: true,
    },
    {
      planType: PlanType.PRO,
      name: "Pro",
      description: "For full-time TAs & instructors",
      maxCourses: null, // unlimited
      maxStudentsPerCourse: null, // unlimited
      maxAssignmentsPerCourse: null, // unlimited
      maxTeamMembers: 3,
      hasPrioritySupport: true,
      hasAdvancedGrading: true,
      hasRubricCustomization: true,
      pricePerSemester: 79,
      pricePerMonth: 25,
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { planType: plan.planType },
      update: plan,
      create: plan,
    });
    console.log(`✓ Seeded ${plan.name} plan`);
  }

  console.log("Plans seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
