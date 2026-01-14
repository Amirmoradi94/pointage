# Pointage Workers

Background workers for document conversion and AI grading using BullMQ.

## Services

### Document Converter (`src/services/document-converter.ts`)

Converts various document formats to optimized PNG images:

- **PDF → Images**: Uses `pdf2pic` and `sharp` for high-quality conversion (200 DPI)
- **DOCX → Images**: LibreOffice converts to PDF, then to images
- **Images (JPG/PNG/WebP)**: Optimized and standardized to PNG format

**Features:**
- Automatic download from Supabase Storage
- Image optimization (max 1200x1600px, 90% quality)
- Upload to `converted-images` bucket
- Metadata capture (width, height, page count)

### Gemini Grader (`src/services/gemini-grader.ts`)

AI-powered grading using Google Gemini 2.0 Flash Vision API:

**Input:**
- Student submission images
- Solution/answer key images
- Rubric criteria (optional)
- Grading settings (strictness, partial credit, custom instructions)
- Course type for context

**Output:**
- Score and confidence (0.0-1.0)
- Detailed feedback
- Criteria breakdown
- Page-by-page annotations
- Flags for human review

**Key Features:**
- Round-robin API key rotation for load balancing
- Context-aware prompts based on grading settings
- JSON-structured responses
- Automatic low-confidence flagging (< 0.75)
- Error handling with fallback results

## Processors

### Conversion Processor (`src/processors/conversion.processor.ts`)

1. Updates submission status to `CONVERTING`
2. Downloads file from Supabase
3. Converts to images using document-converter
4. Saves pages to database
5. Updates status to `PENDING_GRADING`
6. Queues for grading
7. Sends real-time notifications

**Error Handling:** Sets status to `FAILED` and notifies on errors.

### Grading Processor (`src/processors/grading.processor.ts`)

1. Fetches submission with pages
2. Fetches assignment with solution and rubric
3. Prepares grading input with all context
4. Calls Gemini grading service
5. Saves grade with criteria breakdown
6. Creates grade history entry
7. Updates submission status to `GRADED`
8. Determines review status based on confidence
9. Sends real-time notifications

**Status Logic:**
- `NEEDS_ATTENTION`: confidence < 0.75 or has review flags
- `READY_FOR_REVIEW`: otherwise

**Error Handling:** Sets status to `FAILED`, creates no-grade record, notifies.

## Queues

### Conversion Queue

```typescript
{
  submissionId: string;
  assignmentId: string;
  fileUrl: string;
  mimeType: string;
  batchId?: string;
}
```

### Grading Queue

```typescript
{
  submissionId: string;
  assignmentId: string;
  batchId?: string;
}
```

### Notification Queue

Publishes events to Pusher channels for real-time UI updates.

## Environment Variables

```env
# Redis
REDIS_URL=redis://localhost:6379

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Gemini AI (multiple keys for load balancing)
GEMINI_API_KEY_1=xxx
GEMINI_API_KEY_2=xxx
GEMINI_API_KEY_3=xxx

# Pusher
PUSHER_APP_ID=xxx
PUSHER_SECRET=xxx
NEXT_PUBLIC_PUSHER_KEY=xxx
NEXT_PUBLIC_PUSHER_CLUSTER=us2
```

## Running Workers

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Docker
```bash
docker-compose up worker
```

## Dependencies

- **BullMQ**: Job queue management
- **Prisma**: Database ORM
- **pdf2pic**: PDF to image conversion
- **sharp**: Image processing and optimization
- **libreoffice-convert**: DOCX to PDF conversion
- **@google/generative-ai**: Gemini API client
- **@supabase/supabase-js**: Supabase client
- **pusher**: Real-time notifications

## Architecture

```
Upload → Conversion Queue → Conversion Processor
                                ↓
                         Document Converter
                                ↓
                         Save Pages to DB
                                ↓
                         Grading Queue → Grading Processor
                                              ↓
                                        Gemini Grader
                                              ↓
                                        Save Grade to DB
                                              ↓
                                      Notification Queue
```

## Error Handling

All processors implement:
- Automatic retries (3 attempts with exponential backoff)
- Status updates to database
- Error message capture
- Real-time failure notifications
- Graceful degradation (fallback results for grading failures)

## Performance

- **Conversion**: ~2-5 seconds per document (varies by page count)
- **Grading**: ~5-15 seconds per submission (depends on page count and complexity)
- **Concurrency**: 2 concurrent grading jobs per worker
- **Rate Limiting**: Round-robin API key rotation

## Monitoring

Workers log to console with prefixes:
- `[conversion]` - Conversion processor
- `[grading]` - Grading processor
- `[converter]` - Document converter service
- `[grader]` - Gemini grader service
- `[worker]` - General worker lifecycle

Check logs for processing times, errors, and status updates.
