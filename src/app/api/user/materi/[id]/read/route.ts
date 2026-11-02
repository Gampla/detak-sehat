import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Silakan masuk dulu ya." }, { status: 401 });

  // Hanya materi yang sudah dipublikasikan yang boleh ditandai
  const material = await prisma.material.findFirst({ where: { id: params.id, isPublished: true }, select: { id: true } });
  if (!material) return NextResponse.json({ error: "Materi tidak ditemukan." }, { status: 404 });

  await prisma.materialProgress.upsert({
    where: { userId_materialId: { userId: user.id, materialId: material.id } },
    update: { isRead: true, readAt: new Date() },
    create: { userId: user.id, materialId: material.id, isRead: true, readAt: new Date() },
  });
  return NextResponse.json({ ok: true });
}
