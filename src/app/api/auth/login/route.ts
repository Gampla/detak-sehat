import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/schemas";
import { COOKIE_NAME, cookieOptions, signToken } from "@/lib/jwt";
import { homePathFor } from "@/lib/auth";

export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  // Pesan sama untuk email salah / sandi salah, agar tidak membocorkan email mana yang terdaftar
  const valid = user && (await bcrypt.compare(password, user.password));
  if (!user || !valid) {
    return NextResponse.json({ error: "Email atau kata sandi belum cocok. Coba lagi ya 🙂" }, { status: 401 });
  }
  if (!user.isActive) {
    return NextResponse.json({ error: "Akunmu sedang dinonaktifkan. Tanyakan ke gurumu ya." }, { status: 403 });
  }

  const role = user.role === "ADMIN" ? "ADMIN" : "USER";
  const res = NextResponse.json({ ok: true, role, redirectTo: homePathFor(role) });
  res.cookies.set(COOKIE_NAME, await signToken({ sub: user.id, name: user.name, role }), cookieOptions);
  return res;
}
