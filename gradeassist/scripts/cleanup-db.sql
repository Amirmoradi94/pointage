-- Script to clean up records with invalid foreign keys
-- This happens when records were created with Clerk IDs instead of database User IDs

-- First, let's see what we have
SELECT 'Assignments with invalid createdById:' as issue, COUNT(*) as count
FROM "Assignment" a
LEFT JOIN "User" u ON a."createdById" = u.id
WHERE u.id IS NULL;

SELECT 'Batches with invalid uploadedById:' as issue, COUNT(*) as count
FROM "Batch" b
LEFT JOIN "User" u ON b."uploadedById" = u.id
WHERE u.id IS NULL;

SELECT 'Grades with invalid reviewedById:' as issue, COUNT(*) as count
FROM "Grade" g
LEFT JOIN "User" u ON g."reviewedById" = u.id
WHERE g."reviewedById" IS NOT NULL AND u.id IS NULL;

-- Delete records with invalid foreign keys
-- Note: This will cascade delete related records (submissions, grades, etc.)

-- Delete assignments with invalid createdById
DELETE FROM "Assignment"
WHERE id IN (
  SELECT a.id
  FROM "Assignment" a
  LEFT JOIN "User" u ON a."createdById" = u.id
  WHERE u.id IS NULL
);

-- Delete batches with invalid uploadedById
DELETE FROM "Batch"
WHERE id IN (
  SELECT b.id
  FROM "Batch" b
  LEFT JOIN "User" u ON b."uploadedById" = u.id
  WHERE u.id IS NULL
);

-- Fix grades with invalid reviewedById (set to NULL instead of deleting)
UPDATE "Grade"
SET "reviewedById" = NULL, "reviewedAt" = NULL
WHERE id IN (
  SELECT g.id
  FROM "Grade" g
  LEFT JOIN "User" u ON g."reviewedById" = u.id
  WHERE g."reviewedById" IS NOT NULL AND u.id IS NULL
);

SELECT 'Cleanup completed!' as status;
