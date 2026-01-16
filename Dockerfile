# Dockerfile multi-stage optimizado para Next.js 16 + Prisma
# Basado en las mejores prácticas de Next.js y producción

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20.11.1-alpine AS deps

# Instalar dependencias del sistema necesarias para Prisma
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Instalar dependencias de producción y desarrollo
RUN npm ci

# Generar el cliente de Prisma
RUN npx prisma generate

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20.11.1-alpine AS builder

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copiar dependencias desde la etapa anterior
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copiar código fuente
COPY . .

# Variables de entorno necesarias para el build
# NOTA: DATABASE_URL solo se necesita en runtime, no en build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build de Next.js
RUN npm run build

# ============================================
# Stage 3: Runner (Producción)
# ============================================
FROM node:20.11.1-alpine AS runner

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Variables de entorno de producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos públicos
COPY --from=builder /app/public ./public

# Copiar output de Next.js build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar Prisma schema y cliente generado
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Crear directorio para uploads (montado como volumen en producción)
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

USER nextjs

EXPOSE 3000

# Script de inicio que ejecuta migraciones antes de iniciar el servidor
CMD ["node", "server.js"]
