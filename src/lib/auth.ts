// Helper sesi untuk Server Components & API Routes (bukan middleware).
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyToken } from "./jwt";
import { prisma } from "./prisma";

export const homePathFor = (role: string) => (role === "ADMIN" ? "/admin" : "/dashboard");

/** Ambil user yang sedang login (cek ulang ke database agar akun nonaktif langsung ditolak). */
export async function getCurrentUser() {
  const session = await verifyToken(cookies().get(COOKIE_NAME)?.value);
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { id: true, name: true, email: true, role: true, age: true, school: true, isActive: true },
  });
  return user && user.isActive ? user : null;
}
