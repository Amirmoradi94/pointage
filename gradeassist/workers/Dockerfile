FROM node:20-bookworm-slim AS base
WORKDIR /app

# Base OS deps for document conversion
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      libreoffice \
      ghostscript \
      fonts-dejavu-core \
      ca-certificates \
      curl \
      && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV LIBREOFFICE_HOME=/usr/lib/libreoffice

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS dev
ENV NODE_ENV=development
COPY . .
CMD ["npm", "run", "dev"]

FROM deps AS builder
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
RUN npm prune --omit=dev
CMD ["npm", "run", "start"]
