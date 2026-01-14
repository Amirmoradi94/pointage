#!/usr/bin/env node
/**
 * Clean up database records with invalid foreign keys
 * Run with: npx tsx scripts/cleanup-invalid-fks.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Cleaning up records with invalid foreign keys...\n");

  try {
    // Get all valid user IDs
    const validUsers = await prisma.user.findMany({ select: { id: true } });
    const validUserIds = validUsers.map(u => u.id);
    console.log(`Found ${validUserIds.length} valid users\n`);

    // Find and delete assignments with invalid createdById
    const invalidAssignments = await prisma.assignment.findMany({
      where: { createdById: { notIn: validUserIds } },
      select: { id: true, title: true, createdById: true },
    });
    
    if (invalidAssignments.length > 0) {
      console.log(`Found ${invalidAssignments.length} assignments with invalid createdById:`);
      for (const assignment of invalidAssignments) {
        console.log(`  - ${assignment.title} (createdById: ${assignment.createdById})`);
      }
      
      const deleteResult = await prisma.assignment.deleteMany({
        where: { id: { in: invalidAssignments.map(a => a.id) } },
      });
      console.log(`✅ Deleted ${deleteResult.count} assignments\n`);
    } else {
      console.log("✅ No invalid assignments found\n");
    }

    // Find and delete batches with invalid uploadedById
    const invalidBatches = await prisma.batch.findMany({
      where: { uploadedById: { notIn: validUserIds } },
      select: { id: true, uploadedById: true },
    });
    
    if (invalidBatches.length > 0) {
      console.log(`Found ${invalidBatches.length} batches with invalid uploadedById`);
      const deleteResult = await prisma.batch.deleteMany({
        where: { id: { in: invalidBatches.map(b => b.id) } },
      });
      console.log(`✅ Deleted ${deleteResult.count} batches\n`);
    } else {
      console.log("✅ No invalid batches found\n");
    }

    // Fix grades with invalid reviewedById (set to NULL)
    const invalidGrades = await prisma.grade.findMany({
      where: {
        reviewedById: { not: null, notIn: validUserIds },
      },
      select: { id: true, reviewedById: true },
    });
    
    if (invalidGrades.length > 0) {
      console.log(`Found ${invalidGrades.length} grades with invalid reviewedById`);
      const updateResult = await prisma.grade.updateMany({
        where: { id: { in: invalidGrades.map(g => g.id) } },
        data: { reviewedById: null, reviewedAt: null },
      });
      console.log(`✅ Fixed ${updateResult.count} grades\n`);
    } else {
      console.log("✅ No invalid grades found\n");
    }

    console.log("✨ Cleanup completed successfully!");
    console.log("   You can now refresh your browser and the 500 errors should be gone.");
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
