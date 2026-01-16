# Dockerfile simplificado para Next.js + Prisma + Easypanel
FROM node:20.11.1-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar TODAS las dependencias (incluyendo devDependencies para Prisma CLI)
RUN npm ci --include=dev

# Generar cliente de Prisma
RUN npx prisma generate

# Copiar código fuente
COPY . .

# Variables de entorno para build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"

# Build de Next.js
RUN npm run build

# Crear directorio para uploads
RUN mkdir -p /app/public/uploads

# Puerto
EXPOSE 3000

# Script de inicio: ejecutar migraciones y luego iniciar Next.js
CMD npx prisma migrate deploy && npm start
