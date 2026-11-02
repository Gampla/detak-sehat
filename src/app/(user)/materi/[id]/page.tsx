import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { CARD_COLORS, parseSections } from "@/lib/content";
import ReadButton from "@/components/ReadButton";

export default async function MateriDetailPage({ params }: { params: { id: string } }) {
  const user = (await getCurrentUser())!;
  const material = await prisma.material.findFirst({
    where: { id: params.id, isPublished: true }, // draft tidak bisa dibuka user
    include: { progress: { where: { userId: user.id, isRead: true }, select: { id: true } } },
  });
  if (!material) notFound();
  const isRead = material.progress.length > 0;
  const sections = parseSections(material.content);

  return (
    <article className="space-y-5">
      <Link href="/materi" className="font-bold underline">‹ Kembali ke daftar materi</Link>
      <header className="rounded-besar bg-white p-8 text-center">
        <div className="text-7xl" aria-hidden>{material.coverImage ?? "📖"}</div>
        <h1 className="mt-3 text-3xl md:text-4xl">{material.title}</h1>
        <p className="mt-2">{material.description}</p>
      </header>

      {sections.map((s, i) => (
        <section key={s.title} className={`${CARD_COLORS[i % 4]} rounded-besar p-6 md:p-8`}>
          <h2 className="text-2xl">{s.title}</h2>
          {s.body.split("\n").filter(Boolean).map((p, j) => <p key={j} className="mt-3 max-w-prose leading-relaxed">{p}</p>)}
        </section>
      ))}

      <footer className="rounded-besar bg-white p-6 text-center">
        {isRead ? (
          <>
            <p className="font-display text-2xl font-bold">Hore, kamu sudah membaca materi ini! 🎉</p>
            <Link href="/tes" className="btn-merah mt-4">Kerjakan tes</Link>
          </>
        ) : (
          <>
            <p className="mb-4 font-bold">Sudah selesai membaca? Tandai dulu supaya tes terbuka.</p>
            <ReadButton materialId={material.id} />
          </>
        )}
      </footer>
    </article>
  );
}
