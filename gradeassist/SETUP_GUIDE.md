# GradeAssist AI - Complete Setup Guide

This guide will walk you through setting up GradeAssist AI from scratch.

## ✅ Completed Setup

The following have already been configured:
- ✅ Next.js 15 project with TypeScript
- ✅ Prisma schema with all models
- ✅ Database migrated to Supabase
- ✅ All page routes created
- ✅ shadcn/ui components installed
- ✅ Worker infrastructure set up
- ✅ API credentials configured in `.env.local`

## 🔧 Remaining Setup Steps

### 1. Configure Redis URL (Upstash)

Your current Redis URL is set to `redis://redis:6379` which is for local Docker. To use Upstash:

1. Go to your Upstash dashboard: https://artistic-wildcat-15783.upstash.io
2. Click on your Redis database
3. Copy the **Redis URL** (should look like: `redis://default:xxxxx@artistic-wildcat-15783.upstash.io:6379`)
4. Update `.env.local`:
   ```bash
   REDIS_URL="your-upstash-redis-url-here"
   ```

### 2. Create Supabase Storage Buckets

You need to create three storage buckets in Supabase:

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/ghjxgfqfintxkdiiaepp
2. Navigate to **Storage** in the left sidebar
3. Create the following buckets:

   **Bucket 1: `submissions`**
   - Name: `submissions`
   - Public: ❌ No (keep private)
   - File size limit: 50MB
   - Allowed MIME types: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `image/jpeg`, `image/png`

   **Bucket 2: `solutions`**
   - Name: `solutions`
   - Public: ❌ No (keep private)
   - File size limit: 50MB
   - Allowed MIME types: Same as submissions

   **Bucket 3: `converted-images`**
   - Name: `converted-images`
   - Public: ❌ No (keep private)
   - File size limit: 50MB
   - Allowed MIME types: `image/png`, `image/jpeg`

4. Set up RLS (Row Level Security) policies:
   - For authenticated users: Allow all operations
   - Service role: Full access (already configured via SERVICE_ROLE_KEY)

### 3. Configure Clerk Webhook (Optional but Recommended)

To automatically sync users from Clerk to your database:

1. Go to Clerk dashboard: https://dashboard.clerk.com
2. Select your application
3. Go to **Webhooks** in the left sidebar
4. Click **Add Endpoint**
5. Enter your webhook URL: `https://your-domain.com/api/webhooks/clerk`
   - For local development: Use ngrok or similar tunnel service
6. Subscribe to these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
7. Copy the **Signing Secret**
8. Add to `.env.local`:
   ```bash
   CLERK_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"
   ```

### 4. Install Worker Dependencies

The workers run as a separate process for document processing:

```bash
cd workers
npm install
```

### 5. Build Workers

```bash
cd workers
npm run build
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Main Application:**
```bash
npm run dev
```
The app will be available at http://localhost:3000

**Terminal 2 - Worker Process:**
```bash
cd workers
npm run dev
```

**Terminal 3 - Redis (if running locally with Docker):**
```bash
docker run -d -p 6379:6379 redis:alpine
```
*Skip this if using Upstash*

### Production Build

```bash
# Build main app
npm run build
npm start

# Build and run workers
cd workers
npm run build
npm run worker
```

## 📊 Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes (without migrations)
npm run db:push

# Create a new migration
npm run db:migrate

# Open Prisma Studio (GUI for database)
npm run db:studio
```

## 🔍 Verify Setup

### 1. Check Database Connection
```bash
npm run db:studio
```
Should open Prisma Studio at http://localhost:5555

### 2. Test Authentication
1. Go to http://localhost:3000
2. You should be redirected to sign-in
3. Create a new account
4. Check Prisma Studio - you should see the user in the `User` table

### 3. Test File Upload
1. Go to Courses → Create a new course
2. Create an assignment
3. Go to the assignment → Upload tab
4. Try uploading a PDF file
5. File should upload to Supabase storage

### 4. Test Worker Connection
Check worker logs for:
```
✓ Connected to Redis
✓ Listening for conversion jobs
✓ Listening for grading jobs
```

## 📁 Project Structure

```
gradeassist/
├── src/
│   ├── app/                    # Next.js pages (App Router)
│   │   ├── (auth)/            # Auth pages (sign-in/sign-up)
│   │   ├── (dashboard)/       # Main app pages
│   │   │   ├── courses/       # Course management
│   │   │   ├── batches/       # Batch progress
│   │   │   └── settings/      # Settings
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   ├── upload/           # File upload components
│   │   └── grading/          # Grade review components
│   ├── server/               # Server-side code
│   │   └── api/             # tRPC routers
│   ├── lib/                 # Utilities
│   └── types/               # TypeScript types
├── workers/                 # Background workers
│   └── src/
│       ├── processors/      # Job processors
│       ├── queues/         # BullMQ queues
│       └── services/       # AI & conversion services
└── prisma/                 # Database schema
```

## 🎯 Next Steps

1. **Create your first course:**
   - Navigate to http://localhost:3000/courses
   - Click "Create Course"
   - Fill in course details

2. **Create an assignment:**
   - Open the course
   - Click "New Assignment"
   - Upload a solution PDF

3. **Upload student submissions:**
   - Go to the assignment
   - Click "Upload" tab
   - Upload student PDF/DOCX files

4. **Review AI grades:**
   - Go to "Review" tab
   - See AI-generated grades
   - Approve, modify, or reject grades

## 🐛 Troubleshooting

### Database Connection Issues
- Check `DATABASE_URL` in `.env.local`
- Verify Supabase project is active
- Run `npm run db:push` to sync schema

### Redis Connection Issues
- Verify Upstash Redis URL is correct
- Check if Redis is accessible (firewall/network)
- Test connection: `redis-cli -u your-redis-url ping`

### Worker Not Processing Jobs
- Check Redis connection in worker logs
- Verify worker is running (`cd workers && npm run dev`)
- Check job queue in Redis using RedisInsight

### File Upload Failing
- Verify Supabase storage buckets exist
- Check `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check browser console for errors

### Clerk Auth Issues
- Verify Clerk keys in `.env.local`
- Check Clerk dashboard for application status
- Clear browser cookies and try again

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Supabase Postgres connection (pooled) | ✅ |
| `DIRECT_URL` | Supabase Postgres connection (direct) | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook secret | ⚠️ Optional |
| `REDIS_URL` | Redis/Upstash connection URL | ✅ |
| `PUSHER_APP_ID` | Pusher app ID | ✅ |
| `NEXT_PUBLIC_PUSHER_KEY` | Pusher public key | ✅ |
| `PUSHER_SECRET` | Pusher secret | ✅ |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | Pusher cluster (e.g., us2) | ✅ |
| `GEMINI_API_KEY_1` | Google Gemini API key #1 | ✅ |
| `GEMINI_API_KEY_2` | Google Gemini API key #2 | ⚠️ Optional |
| `GEMINI_API_KEY_3` | Google Gemini API key #3 | ⚠️ Optional |

## 🎉 You're All Set!

Your GradeAssist AI application is now ready to use. Visit http://localhost:3000 to get started!

For questions or issues, check the main README.md or create an issue on GitHub.
