FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# ── Dependencies ──────────────────────────────────────────────
FROM base AS deps
COPY package.json turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/shared/package.json ./packages/shared/
RUN npm install --frozen-lockfile

# ── Builder ───────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx turbo build --filter=@sportpulse/api

# ── Runner ────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./package.json

RUN npx prisma generate

EXPOSE 3001
CMD ["node", "dist/main"]
