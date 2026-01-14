/**
 * Script to fix invalid foreign keys in the database
 * Run with: npx tsx scripts/fix-foreign-keys.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking for records with invalid foreign keys...\n");

  // Check assignments with invalid createdById
  const assignments = await prisma.assignment.findMany({
    select: { id: true, title: true, createdById: true },
  });

  console.log(`Found ${assignments.length} assignments`);
  
  let invalidAssignments = 0;
  for (const assignment of assignments) {
    const user = await prisma.user.findUnique({
      where: { id: assignment.createdById },
    });
    
    if (!user) {
      console.log(`❌ Assignment "${assignment.title}" has invalid createdById: ${assignment.createdById}`);
      invalidAssignments++;
    }
  }

  // Check batches with invalid uploadedById
  const batches = await prisma.batch.findMany({
    select: { id: true, uploadedById: true },
  });

  console.log(`Found ${batches.length} batches`);
  
  let invalidBatches = 0;
  for (const batch of batches) {
    const user = await prisma.user.findUnique({
      where: { id: batch.uploadedById },
    });
    
    if (!user) {
      console.log(`❌ Batch ${batch.id} has invalid uploadedById: ${batch.uploadedById}`);
      invalidBatches++;
    }
  }

  // Check grades with invalid reviewedById
  const grades = await prisma.grade.findMany({
    where: { reviewedById: { not: null } },
    select: { id: true, reviewedById: true },
  });

  console.log(`Found ${grades.length} grades with reviewedById`);
  
  let invalidGrades = 0;
  for (const grade of grades) {
    if (grade.reviewedById) {
      const user = await prisma.user.findUnique({
        where: { id: grade.reviewedById },
      });
      
      if (!user) {
        console.log(`❌ Grade ${grade.id} has invalid reviewedById: ${grade.reviewedById}`);
        invalidGrades++;
      }
    }
  }

  console.log("\n📊 Summary:");
  console.log(`   Invalid assignments: ${invalidAssignments}`);
  console.log(`   Invalid batches: ${invalidBatches}`);
  console.log(`   Invalid grades: ${invalidGrades}`);

  if (invalidAssignments > 0 || invalidBatches > 0 || invalidGrades > 0) {
    console.log("\n⚠️  Found records with invalid foreign keys!");
    console.log("   These need to be either deleted or updated with valid user IDs.");
    console.log("\n💡 Quick fix: Delete all invalid records? (This will remove the data)");
    console.log("   Run the following commands:");
    
    if (invalidAssignments > 0) {
      console.log("\n   Delete invalid assignments:");
      for (const assignment of assignments) {
        const user = await prisma.user.findUnique({
          where: { id: assignment.createdById },
        });
        if (!user) {
          console.log(`   npx prisma db execute --stdin <<< "DELETE FROM \\"Assignment\\" WHERE id = '${assignment.id}';"`);
        }
      }
    }
    
    if (invalidBatches > 0) {
      console.log("\n   Delete invalid batches:");
      for (const batch of batches) {
        const user = await prisma.user.findUnique({
          where: { id: batch.uploadedById },
        });
        if (!user) {
          console.log(`   npx prisma db execute --stdin <<< "DELETE FROM \\"Batch\\" WHERE id = '${batch.id}';"`);
        }
      }
    }
  } else {
    console.log("\n✅ No invalid foreign keys found!");
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
