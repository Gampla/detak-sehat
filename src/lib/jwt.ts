// Helper JWT. Hanya memakai `jose` sehingga aman dipakai di middleware (Edge runtime).
import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "detaksehat_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

export type SessionPayload = { sub: string; name: string; role: "USER" | "ADMIN" };

const secret = () => {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new Error("JWT_SECRET harus diisi minimal 32 karakter di file .env");
  return new TextEncoder().encode(s);
};

export async function signToken(p: SessionPayload) {
  return new SignJWT({ name: p.name, role: p.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(p.sub)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export async function verifyToken(token?: string): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { sub: payload.sub!, name: payload.name as string, role: payload.role as "USER" | "ADMIN" };
  } catch {
    return null; // token rusak / kedaluwarsa
  }
}

// Opsi cookie: httpOnly agar tidak bisa dibaca JavaScript di browser
export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};
