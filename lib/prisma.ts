import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Configuración de Prisma con logs para producción
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "production"
        ? ["error", "warn"]
        : ["query", "error", "warn"],
    errorFormat: "minimal",
  });

// En desarrollo, reutilizar la misma instancia para evitar
// múltiples conexiones durante hot-reload
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Manejo graceful de desconexión
if (process.env.NODE_ENV === "production") {
  process.on("SIGTERM", async () => {
    console.log("SIGTERM received, closing Prisma connection...");
    await prisma.$disconnect();
  });

  process.on("SIGINT", async () => {
    console.log("SIGINT received, closing Prisma connection...");
    await prisma.$disconnect();
  });
}

// Verificar conexión al iniciar en producción
if (process.env.NODE_ENV === "production") {
  prisma
    .$connect()
    .then(() => {
      console.log("✅ Database connected successfully");
    })
    .catch((error) => {
      console.error("❌ Database connection failed:", error);
      process.exit(1);
    });
}

export default prisma;
