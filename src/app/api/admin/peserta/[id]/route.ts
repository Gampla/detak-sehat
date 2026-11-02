import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// Hanya ADMIN, dan hanya boleh mengubah akun ber-role USER (admin tidak bisa dihapus lewat sini)
async function guard(id: string) {
  const me = await getCurrentUser();
  if (!me || me.role !== "ADMIN") return { error: NextResponse.json({ error: "Khusus admin." }, { status: 403 }) };
  const target = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
  if (!target || target.role !== "USER") return { error: NextResponse.json({ error: "Peserta tidak ditemukan." }, { status: 404 }) };
  return { target };
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const g = await guard(params.id);
  if (g.error) return g.error;
  const parsed = z.object({ isActive: z.boolean() }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  await prisma.user.update({ where: { id: params.id }, data: { isActive: parsed.data.isActive } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const g = await guard(params.id);
  if (g.error) return g.error;
  await prisma.user.delete({ where: { id: params.id } }); // progres ikut terhapus (onDelete: Cascade)
  return NextResponse.json({ ok: true });
}
