import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { CARD_COLORS } from "@/lib/content";

export default async function MateriListPage() {
  const user = (await getCurrentUser())!;
  const materials = await prisma.material.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: { progress: { where: { userId: user.id, isRead: true }, select: { id: true } } },
  });

  return (
    <div>
      <h1 className="text-4xl">Pilih materi belajarmu 📚</h1>
      {materials.length === 0 ? (
        <div className="mt-8 rounded-besar bg-white p-10 text-center">
          <div className="text-6xl">🌱</div>
          <p className="mt-3 font-bold">Materi belum tersedia. Si Detak sedang menyiapkannya, tunggu sebentar ya!</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {materials.map((m, i) => (
            <Link key={m.id} href={`/materi/${m.id}`} className={`${CARD_COLORS[i % 3]} relative rounded-besar p-6 transition-transform hover:-translate-y-1 hover:scale-[1.02]`}>
              {m.progress.length > 0 && <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-base font-bold text-tinta">✔ Sudah dibaca</span>}
              <div className="text-6xl" aria-hidden>{m.coverImage ?? "📖"}</div>
              <h2 className="mt-3 text-2xl">{m.title}</h2>
              <p className="mt-1">{m.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
