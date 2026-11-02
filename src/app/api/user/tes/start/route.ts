import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const MAX_QUESTIONS = 10;

// Memulai tes: soal diambil dari materi yang SUDAH dibaca user. Waktu mulai dicatat server.
export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Silakan masuk dulu ya." }, { status: 401 });

  const all = await prisma.question.findMany({
    where: { material: { isPublished: true, progress: { some: { userId: user.id, isRead: true } } } },
  });
  if (all.length === 0) return NextResponse.json({ error: "Baca materi dulu ya, baru tesnya terbuka!" }, { status: 403 });

  const picked = all.sort(() => Math.random() - 0.5).slice(0, MAX_QUESTIONS);
  // Soal disimpan sebagai baris jawaban kosong agar daftar soal tes ini tetap dan tidak bisa diubah klien
  const attempt = await prisma.testAttempt.create({
    data: {
      userId: user.id,
      totalQuestions: picked.length,
      answers: { create: picked.map((q) => ({ questionId: q.id, selectedAnswer: "", isCorrect: false })) },
    },
  });

  // Kunci jawaban & pembahasan TIDAK dikirim ke browser
  return NextResponse.json({
    attemptId: attempt.id,
    questions: picked.map((q) => ({ id: q.id, text: q.questionText, options: { A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD } })),
  });
}
