import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/schemas";
import { COOKIE_NAME, cookieOptions, signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message, fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const { name, email, password, age, school } = parsed.data;

  if (await prisma.user.findUnique({ where: { email } })) {
    return NextResponse.json({ error: "Email ini sudah terdaftar. Coba masuk saja ya 😊" }, { status: 409 });
  }

  // Role SELALU "USER": role tidak pernah diambil dari input pengguna
  const user = await prisma.user.create({
    data: { name, email, password: await bcrypt.hash(password, 10), role: "USER", age, school: school || null },
  });

  const res = NextResponse.json({ ok: true, redirectTo: "/dashboard" }, { status: 201 });
  res.cookies.set(COOKIE_NAME, await signToken({ sub: user.id, name: user.name, role: "USER" }), cookieOptions);
  return res;
}
