import Link from "next/link";
import { isLocked } from "@/lib/activity-lock";
import LockedNotice from "@/components/LockedNotice";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { bySlug, prevOf } from "@/lib/activities";

export default async function AktivitasHub({ params }: { params: { slug: string } }) {
  const a = bySlug(params.slug);
  if (!a) notFound();
  if (await isLocked(a.key)) return <LockedNotice title={a.title} />;
  const user = (await getCurrentUser())!;
  const keys = [prevOf(a.no)!.key, `${a.key}-materi`, a.key];
  const rows = await prisma.activityProgress.findMany({ where: { userId: user.id, activityKey: { in: keys } } });
  const has = (k: string) => rows.some((r) => r.activityKey === k);
  if (!has(keys[0])) redirect("/dashboard"); // aktivitas sebelumnya harus selesai dulu
  const materiDone = has(keys[1]), formDone = has(keys[2]);

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="font-bold underline">‹ Kembali ke beranda</Link>
      <header className="rounded-besar bg-mint p-8 text-center">
        <p className="inline-block rounded-full bg-white px-4 py-1 font-bold">Aktivitas {a.no}</p>
        <h1 className="mt-3 text-3xl md:text-5xl">{a.title}</h1>
        <p className="mt-2">Pelajari kartu materi dulu, lalu isi formulirnya.</p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        <Link href={`/aktivitas/${a.slug}/materi/1`} className="rounded-besar bg-mentari-soft p-7 transition-transform hover:-translate-y-1 hover:scale-[1.02]">
          <div className="text-6xl" aria-hidden>📚</div>
          <h2 className="mt-3 text-2xl">Kartu Materi</h2>
          <p className="mt-1">Tonton video, lalu baca materi bagian demi bagian.</p>
          <p className={`mt-4 inline-block rounded-full px-4 py-2 font-display font-bold ${materiDone ? "bg-mint" : "bg-jantung text-white"}`}>{materiDone ? "✔ Sudah dibaca (buka lagi)" : "Mulai belajar"}</p>
        </Link>
        {materiDone ? (
          <Link href={`/aktivitas/${a.slug}/form`} className="rounded-besar bg-jantung-soft p-7 transition-transform hover:-translate-y-1 hover:scale-[1.02]">
            <div className="text-6xl" aria-hidden>✏️</div>
            <h2 className="mt-3 text-2xl">{a.title}</h2>
            <p className="mt-1">Isi formulir setelah belajar.</p>
            <p className={`mt-4 inline-block rounded-full px-4 py-2 font-display font-bold ${formDone ? "bg-mint" : "bg-jantung text-white"}`}>{formDone ? "✔ Selesai" : "Isi sekarang"}</p>
          </Link>
        ) : (
          <div className="rounded-besar bg-jantung-soft p-7 opacity-60" aria-disabled="true">
            <div className="text-6xl" aria-hidden>🔒</div>
            <h2 className="mt-3 text-2xl">{a.title}</h2>
            <p className="mt-1">Baca semua kartu materi dulu supaya formulir terbuka.</p>
          </div>
        )}
      </div>
    </div>
  );
}
