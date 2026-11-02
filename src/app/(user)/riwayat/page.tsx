import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, formatDuration } from "@/lib/format";

export default async function RiwayatPage() {
  const user = (await getCurrentUser())!;
  const attempts = await prisma.testAttempt.findMany({ where: { userId: user.id, finishedAt: { not: null } }, orderBy: { finishedAt: "desc" } });

  return (
    <div>
      <h1 className="text-4xl">Riwayat tesmu 🏆</h1>
      {attempts.length === 0 ? (
        <div className="mt-8 rounded-besar bg-white p-10 text-center">
          <div className="text-6xl">📭</div>
          <p className="mt-2 font-bold">Kamu belum mengerjakan tes. Yuk coba yang pertama!</p>
          <Link href="/tes" className="btn-merah mt-5">Mulai tes</Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {attempts.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-4 rounded-besar bg-white p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mentari font-display text-2xl font-extrabold">{a.score}</div>
                <div>
                  <p className="font-bold">{formatDate(a.finishedAt)}</p>
                  <p className="text-base">Durasi {formatDuration(a.durationSeconds)} · Benar {a.correctCount}/{a.totalQuestions}</p>
                </div>
              </div>
              <Link href={`/riwayat/${a.id}`} className="btn-putih !min-h-[3rem] !px-5 !text-lg">Lihat detail</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
