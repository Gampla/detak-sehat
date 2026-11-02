import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ACTIVITIES } from "@/lib/activities";
import { isLocked } from "@/lib/activity-lock";

// Kunci "xxx-materi" = selesai membaca Kartu Materi milik aktivitas "xxx".
export async function POST(_req: Request, { params }: { params: { key: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Silakan masuk dulu ya." }, { status: 401 });

  const key = params.key;
  const isMateri = key.endsWith("-materi");
  const base = isMateri ? key.slice(0, -"-materi".length) : key;
  const idx = ACTIVITIES.findIndex((a) => a.key === base);
  if (idx < 0 || !ACTIVITIES[idx].available || (isMateri && idx === 0)) return NextResponse.json({ error: "Aktivitas tidak ditemukan." }, { status: 404 });

  if (await isLocked(base)) return NextResponse.json({ error: "Aktivitas ini sedang dikunci oleh admin." }, { status: 403 });

  // Syarat: aktivitas sebelumnya selesai; formulir juga mensyaratkan materinya sudah dibaca
  const needs: string[] = [];
  if (idx > 0) needs.push(ACTIVITIES[idx - 1].key);
  if (!isMateri && idx > 0) needs.push(`${base}-materi`);
  if (needs.length) {
    const have = await prisma.activityProgress.count({ where: { userId: user.id, activityKey: { in: needs } } });
    if (have < needs.length) return NextResponse.json({ error: "Selesaikan langkah sebelumnya dulu ya." }, { status: 403 });
  }
  await prisma.activityProgress.upsert({
    where: { userId_activityKey: { userId: user.id, activityKey: key } },
    update: {},
    create: { userId: user.id, activityKey: key },
  });
  return NextResponse.json({ ok: true });
}
