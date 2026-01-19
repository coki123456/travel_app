-- Migración de reparación: Marca la migración fallida como completada y arregla el estado
-- Esta migración es segura de ejecutar múltiples veces (idempotente)

-- Primero, marcar la migración fallida como completada
UPDATE "_prisma_migrations"
SET finished_at = started_at + interval '1 second',
    logs = 'Marcada como completada por migración de reparación',
    rolled_back_at = NULL
WHERE migration_name = '20260119_add_users_and_sharing'
  AND finished_at IS NULL;

-- Verificar y crear objetos que podrían no existir por la migración fallida

-- Crear enum TripRole si no existe
DO $$ BEGIN
    CREATE TYPE "TripRole" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Crear tabla User si no existe
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Crear índice único en email si no existe
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Crear tabla TripShare si no existe
CREATE TABLE IF NOT EXISTS "TripShare" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "TripRole" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TripShare_pkey" PRIMARY KEY ("id")
);

-- Crear índice único si no existe
CREATE UNIQUE INDEX IF NOT EXISTS "TripShare_tripId_userId_key" ON "TripShare"("tripId", "userId");

-- Crear usuario temporal si no existe (con hash válido de bcrypt para password "admin123")
INSERT INTO "User" ("id", "email", "name", "password", "createdAt", "updatedAt")
VALUES (
  'temp-admin-user-id',
  'admin@temp.com',
  'Admin Temporal',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("email") DO NOTHING;

-- Agregar columna ownerId a Trip si no existe
DO $$ BEGIN
    ALTER TABLE "Trip" ADD COLUMN "ownerId" TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Asignar propietario temporal a viajes existentes que no tienen owner
UPDATE "Trip" SET "ownerId" = 'temp-admin-user-id' WHERE "ownerId" IS NULL;

-- Hacer ownerId NOT NULL si aún no lo es
DO $$ BEGIN
    ALTER TABLE "Trip" ALTER COLUMN "ownerId" SET NOT NULL;
EXCEPTION
    WHEN others THEN null;
END $$;

-- Agregar foreign keys si no existen
DO $$ BEGIN
    ALTER TABLE "Trip" ADD CONSTRAINT "Trip_ownerId_fkey"
        FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "TripShare" ADD CONSTRAINT "TripShare_tripId_fkey"
        FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "TripShare" ADD CONSTRAINT "TripShare_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
