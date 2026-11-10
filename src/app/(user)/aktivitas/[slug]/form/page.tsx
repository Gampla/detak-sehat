import Link from "next/link";
import { isLocked } from "@/lib/activity-lock";
import LockedNotice from "@/components/LockedNotice";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { bySlug } from "@/lib/activities";
import Mascot from "@/components/Mascot";
import FormStep from "@/components/FormStep";

export default async function FormPage({ params }: { params: { slug: string } }) {
  const a = bySlug(params.slug);
  if (!a) notFound();
  if (await isLocked(a.key)) return <LockedNotice title={a.title} />;
  const user = (await getCurrentUser())!;
  const rows = await prisma.activityProgress.findMany({ where: { userId: user.id, activityKey: { in: [`${a.key}-materi`, `${a.key}-dibuka`, a.key] } } });
  if (!rows.some((r) => r.activityKey === `${a.key}-materi`)) redirect(`/aktivitas/${a.slug}/materi/1`); // materi wajib dulu
  const done = rows.some((r) => r.activityKey === a.key);
  const opened = rows.some((r) => r.activityKey === `${a.key}-dibuka`);

  return (
    <div className="space-y-6">
      <Link href={`/aktivitas/${a.slug}`} className="font-bold underline">‹ Kembali ke Aktivitas {a.no}</Link>
      <section className="flex flex-col items-center gap-4 rounded-besar bg-jantung-soft p-8 text-center md:flex-row md:text-left">
        <Mascot size={130} />
        <div>
          <p className="inline-block rounded-full bg-white px-4 py-1 font-bold">Aktivitas {a.no}</p>
          <h1 className="mt-2 text-3xl md:text-5xl">{a.title}</h1>
          <p className="mt-2 max-w-xl">Kamu sudah selesai membaca materi. Sekarang isi formulirnya dengan jujur ya.</p>
        </div>
      </section>
      <section className="space-y-5 rounded-besar bg-white p-8 text-center">
        {done ? (
          <div className="rounded-2xl bg-mint-soft p-4"><p className="font-display text-xl font-bold">{a.title} sudah selesai ✔</p><Link href="/dashboard" className="btn-putih mt-3">Ke beranda</Link></div>
        ) : (
          <FormStep activityKey={a.key} url={a.formUrl} openLabel="Buka Formulir ↗" doneLabel="Saya sudah selesai mengisi ✔" note="Link terbuka di tab baru." initiallyOpened={opened} />
        )}
      </section>
    </div>
  );
}
