import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ACTIVITIES } from "@/lib/activities";
import { isLocked } from "@/lib/activity-lock";

// Kunci yang diterima untuk aktivitas "xxx":
//   "xxx"         = aktivitas selesai
//   "xxx-materi"  = Kartu Materi selesai dibaca
//   "xxx-dibuka"  = formulir sudah dibuka
export async function POST(_req: Request, { params }: { params: { key: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Silakan masuk dulu ya." }, { status: 401 });

  const key = params.key;
  const m = key.match(/^(.*)-(materi|dibuka)$/);
  const base = m ? m[1] : key;
  const type = m ? m[2] : "utama";
  const idx = ACTIVITIES.findIndex((a) => a.key === base);
  if (idx < 0 || !ACTIVITIES[idx].available || (type === "materi" && idx === 0)) return NextResponse.json({ error: "Aktivitas tidak ditemukan." }, { status: 404 });
  if (await isLocked(base)) return NextResponse.json({ error: "Aktivitas ini sedang dikunci oleh admin." }, { status: 403 });

  // Syarat berurutan: aktivitas sebelumnya, materi (kecuali Pre-Test), dan untuk "selesai": formulir sudah dibuka
  const needs: string[] = [];
  if (idx > 0) needs.push(ACTIVITIES[idx - 1].key);                    // aktivitas sebelumnya selesai
  if (idx > 0 && type !== "materi") needs.push(`${base}-materi`);       // materi sudah dibaca
  if (type === "utama") needs.push(`${base}-dibuka`);                   // formulir sudah dibuka
  if (needs.length) {
    const have = await prisma.activityProgress.findMany({ where: { userId: user.id, activityKey: { in: needs } }, select: { activityKey: true } });
    if (have.length < new Set(needs).size) {
      const buka = type === "utama" && !have.some((h) => h.activityKey === `${base}-dibuka`);
      return NextResponse.json({ error: buka ? "Buka formulirnya dulu ya, baru tandai selesai." : "Selesaikan langkah sebelumnya dulu ya." }, { status: 403 });
    }
  }
  await prisma.activityProgress.upsert({
    where: { userId_activityKey: { userId: user.id, activityKey: key } },
    update: {},
    create: { userId: user.id, activityKey: key },
  });
  return NextResponse.json({ ok: true });
}
