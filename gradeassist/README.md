# Pointage

AI-assisted grading with document conversion workers, tRPC API, Clerk auth, Supabase storage, and Pusher realtime updates.

## Prerequisites

- Copy `env.example` to `.env.local` (or point docker-compose to your env file)
- Supabase project (Postgres + Storage)
- Clerk project (publishable + secret keys)
- Upstash/Redis URL (or local Redis from compose)
- Pusher app keys
- Gemini API keys (at least one)

## Local development (docker-compose)

```bash
docker-compose up web worker redis
```

Notes:
- Web service mounts the repo for hot reload (`npm run dev`).
- Worker service runs BullMQ workers (`npm run dev`) and needs Supabase + Pusher env set.
- Redis is local in the compose stack; DB/Storage are Supabase cloud.

## Running without Docker

```bash
npm install
npm run dev
# In another shell (from ./workers):
cd workers && npm install && npm run dev
```

## Production deploy

- **Web**: Vercel, set env vars matching `env.example`, keep `next.config.ts` output standalone.
- **Workers**: Railway/Render using `workers/Dockerfile`; supply Redis, Supabase, Pusher, Gemini keys.
- **Queues**: BullMQ via Redis (`REDIS_URL`), channels `conversion`, `grading`, `notification`.

## Useful scripts

- `npm run lint` — lint app (ignores `workers/dist`)
- `npm run db:push` — push Prisma schema to Supabase
- `docker-compose up` — local stack (web + worker + redis)
