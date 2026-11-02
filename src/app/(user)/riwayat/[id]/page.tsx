import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, formatDuration, motivation, GOOD_SCORE } from "@/lib/format";
import ConfettiBurst from "@/components/ConfettiBurst";

export default async function HasilPage({ params, searchParams }: { params: { id: string }; searchParams: { baru?: string } }) {
  const user = (await getCurrentUser())!;
  // Hanya pemilik tes yang boleh melihat hasilnya
  const a = await prisma.testAttempt.findFirst({
    where: { id: params.id, userId: user.id, finishedAt: { not: null } },
    include: { answers: { include: { question: true } } },
  });
  if (!a) notFound();
  const score = a.score ?? 0;
  const m = motivation(score);

  return (
    <div className="space-y-6">
      {searchParams.baru && score >= GOOD_SCORE && <ConfettiBurst />}
      <Link href="/riwayat" className="font-bold underline">‹ Kembali ke riwayat</Link>
      <section className="rounded-besar bg-white p-8 text-center">
        <div className="text-6xl" aria-hidden>{m.e}</div>
        <p className="mt-2 font-display text-7xl font-extrabold text-jantung-dark">{score}</p>
        <h1 className="mt-2 text-2xl md:text-3xl">{m.t}</h1>
        <dl className="mt-5 grid grid-cols-3 gap-3 text-base">
          <div className="rounded-2xl bg-mint-soft p-3"><dd className="font-display text-2xl font-bold">{a.correctCount}</dd><dt>Benar</dt></div>
          <div className="rounded-2xl bg-jantung-soft p-3"><dd className="font-display text-2xl font-bold">{a.totalQuestions - a.correctCount}</dd><dt>Salah</dt></div>
          <div className="rounded-2xl bg-mentari-soft p-3"><dd className="font-display text-2xl font-bold">{formatDuration(a.durationSeconds)}</dd><dt>Waktu</dt></div>
        </dl>
        <p className="mt-4 text-base opacity-70">{formatDate(a.startedAt)} sampai {formatDate(a.finishedAt)}</p>
        <Link href="/tes" className="btn-merah mt-5">Coba lagi</Link>
      </section>

      <h2 className="text-2xl">Pembahasan</h2>
      {a.answers.map((x, i) => {
        const q = x.question;
        const opt = { A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD } as Record<string, string>;
        return (
          <article key={x.id} className={`rounded-besar p-6 ${x.isCorrect ? "bg-mint-soft" : "bg-jantung-soft"}`}>
            <p className="font-bold">{x.isCorrect ? "✅ Benar" : "❌ Belum tepat"} · Soal {i + 1}</p>
            <h3 className="mt-1 text-xl">{q.questionText}</h3>
            <p className="mt-2">Jawabanmu: <b>{x.selectedAnswer ? `${x.selectedAnswer}. ${opt[x.selectedAnswer]}` : "belum dijawab"}</b></p>
            {!x.isCorrect && <p>Jawaban benar: <b>{q.correctAnswer}. {opt[q.correctAnswer]}</b></p>}
            <p className="mt-3 rounded-2xl bg-white p-4">💡 {q.explanation}</p>
          </article>
        );
      })}
    </div>
  );
}
