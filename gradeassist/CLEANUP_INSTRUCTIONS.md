# Database Cleanup Instructions

## Problem
The 500 errors occur because there are old records in the database with invalid foreign keys (created with Clerk user IDs instead of database User IDs).

## Solution
Run these SQL commands to clean up invalid records.

### Option 1: Using Prisma Studio (Easiest)

1. Open Prisma Studio:
   ```bash
   cd gradeassist
   npx prisma studio
   ```

2. Go to each table and manually delete records with invalid foreign keys (or use Option 2)

### Option 2: Using SQL (Recommended)

Run these SQL commands in your database client (Supabase SQL Editor, pgAdmin, etc.):

```sql
-- Check what will be deleted first (OPTIONAL)
SELECT 'Assignments to delete:' as info, COUNT(*) as count
FROM "Assignment" a
LEFT JOIN "User" u ON a."createdById" = u.id
WHERE u.id IS NULL;

SELECT 'Batches to delete:' as info, COUNT(*) as count
FROM "Batch" b
LEFT JOIN "User" u ON b."uploadedById" = u.id
WHERE u.id IS NULL;

-- Now delete the invalid records
DELETE FROM "Assignment"
WHERE id IN (
  SELECT a.id
  FROM "Assignment" a
  LEFT JOIN "User" u ON a."createdById" = u.id
  WHERE u.id IS NULL
);

DELETE FROM "Batch"
WHERE id IN (
  SELECT b.id
  FROM "Batch" b
  LEFT JOIN "User" u ON b."uploadedById" = u.id
  WHERE u.id IS NULL
);

-- Fix grades (don't delete, just set reviewedById to NULL)
UPDATE "Grade"
SET "reviewedById" = NULL, "reviewedAt" = NULL
WHERE "reviewedById" IS NOT NULL
  AND "reviewedById" NOT IN (SELECT id FROM "User");
```

### Option 3: Quick Reset (If you don't need existing data)

If you're in development and don't need to keep existing data:

```bash
cd gradeassist
npx prisma migrate reset
npm run db:seed  # If you have a seed file
```

## After Cleanup

1. Refresh your browser
2. The 500 errors should be gone
3. Try creating a new assignment - it should work without errors now

## Prevention

The foreign key issue has been fixed in the code. All new records will be created correctly.
