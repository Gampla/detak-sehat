import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ACTIVITIES } from "@/lib/activities";

// Buka/kunci satu aktivitas (ada `key`) atau semuanya (tanpa `key`). Khusus ADMIN.
export async function PATCH(req: Request) {
  const me = await getCurrentUser();
  if (!me || me.role !== "ADMIN") return NextResponse.json({ error: "Khusus admin." }, { status: 403 });
  const parsed = z.object({ key: z.string().optional(), isOpen: z.boolean() }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });

  const all = ACTIVITIES.map((a) => a.key as string);
  const keys = parsed.data.key ? [parsed.data.key] : all;
  if (!keys.every((k) => all.includes(k))) return NextResponse.json({ error: "Aktivitas tidak ditemukan." }, { status: 404 });

  await prisma.$transaction(keys.map((key) => prisma.activitySetting.upsert({ where: { key }, update: { isOpen: parsed.data.isOpen }, create: { key, isOpen: parsed.data.isOpen } })));
  return NextResponse.json({ ok: true });
}
