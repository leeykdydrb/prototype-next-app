FROM node:24-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Alpine Linux용 libc 호환성 라이브러리 설치
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
# 빌드 시점에 필요한 환경변수 (NEXT_PUBLIC_*는 빌드 시 번들에 포함됨)
ARG NEXT_PUBLIC_KEYCLOAK_ISSUER
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
ENV NEXT_PUBLIC_KEYCLOAK_ISSUER=$NEXT_PUBLIC_KEYCLOAK_ISSUER
ENV NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=$NEXT_PUBLIC_KEYCLOAK_CLIENT_ID

# Prisma Client 생성
RUN npm exec prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
# COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts

# Environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

USER nextjs

EXPOSE 3000

# CMD ["sh", "-c", "npm exec prisma migrate deploy && node server.js"]
CMD ["node", "server.js"]

# ----------------
# migrator (one-off)
# ----------------
FROM base AS migrator
WORKDIR /app
    
# migrator는 prisma CLI + dotenv/config import를 위해 node_modules가 필요함
COPY --from=deps /app/node_modules ./node_modules
COPY . .
    
ENV NODE_ENV=production
    
# ✅ 배포 시 1회 실행할 커맨드
CMD ["sh", "-c", "npm exec prisma migrate deploy"]

# ----------------
# seeder (one-off)
# ----------------
FROM base AS seeder
WORKDIR /app

# seeder는 prisma CLI + tsx를 위해 node_modules가 필요함
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

# ✅ seed 실행 (runtime에 generate)
CMD ["sh", "-c", "npm exec prisma generate && npx tsx prisma/seed.ts"]
# CMD ["npx", "tsx", "prisma/seed.ts"]