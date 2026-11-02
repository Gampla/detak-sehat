import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const bodySchema = z.object({ answers: z.record(z.enum(["A", "B", "C", "D"])) });

// Mengumpulkan jawaban: nilai & durasi dihitung di server, jadi tidak bisa dicurangi dari browser.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Silakan masuk dulu ya." }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Jawabanmu belum lengkap." }, { status: 400 });

  const attempt = await prisma.testAttempt.findFirst({
    where: { id: params.id, userId: user.id },
    include: { answers: { include: { question: true } } },
  });
  if (!attempt) return NextResponse.json({ error: "Tes tidak ditemukan." }, { status: 404 });
  if (attempt.finishedAt) return NextResponse.json({ error: "Tes ini sudah dikumpulkan." }, { status: 409 });

  const finishedAt = new Date();
  let correctCount = 0;
  const updates = attempt.answers.map((a) => {
    const selected = parsed.data.answers[a.questionId] ?? "";
    const isCorrect = selected === a.question.correctAnswer;
    if (isCorrect) correctCount++;
    return prisma.testAnswer.update({ where: { id: a.id }, data: { selectedAnswer: selected, isCorrect } });
  });
  const total = attempt.totalQuestions || 1;

  await prisma.$transaction([
    ...updates,
    prisma.testAttempt.update({
      where: { id: attempt.id },
      data: {
        finishedAt, correctCount,
        score: Math.round((correctCount / total) * 100),
        durationSeconds: Math.max(1, Math.round((finishedAt.getTime() - attempt.startedAt.getTime()) / 1000)),
      },
    }),
  ]);
  return NextResponse.json({ ok: true, redirectTo: `/riwayat/${attempt.id}?baru=1` });
}
