import { PrismaClient } from "@prisma/client";

// Satu koneksi Prisma saja agar tidak berlebihan saat mode dev (hot reload)
const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.prisma = prisma;
