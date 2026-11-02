import Link from "next/link";
import { isLocked } from "@/lib/activity-lock";
import LockedNotice from "@/components/LockedNotice";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { CARD_COLORS, parseSections } from "@/lib/content";
import { VIDEO_ID, bySlug, prevOf } from "@/lib/activities";
import { MATERI_POSTEST_1 } from "@/lib/materi-postest1";
import Rich from "@/components/Rich";
import MateriScene from "@/components/MateriScene";
import CompleteButton from "@/components/CompleteButton";

const sections = parseSections(MATERI_POSTEST_1);
const TOTAL = sections.length + 1; // halaman 1 = video

export default async function MateriStepPage({ params }: { params: { slug: string; step: string } }) {
  const a = bySlug(params.slug);
  const step = Number(params.step);
  if (!a || !Number.isInteger(step) || step < 1 || step > TOTAL) notFound();
  if (await isLocked(a.key)) return <LockedNotice title={a.title} />;
  const user = (await getCurrentUser())!;
  const prev = await prisma.activityProgress.findUnique({ where: { userId_activityKey: { userId: user.id, activityKey: prevOf(a.no)!.key } } });
  if (!prev) redirect("/dashboard");

  const base = `/aktivitas/${a.slug}/materi`;
  const section = step > 1 ? sections[step - 2] : null;
  const percent = Math.round((step / TOTAL) * 100);

  return (
    <div className="space-y-5">
      <Link href={`/aktivitas/${a.slug}`} className="font-bold underline">‹ Kembali ke Aktivitas {a.no}</Link>
      <div role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Kemajuan membaca materi">
        <p className="mb-1 font-bold">Bagian {step} dari {TOTAL}</p>
        <div className="h-5 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-mint transition-all" style={{ width: `${percent}%` }} /></div>
      </div>

      {section ? (
        <section className={`${CARD_COLORS[(step - 2) % 3]} overflow-hidden rounded-besar shadow-[0_8px_0_#3A2D4F18]`}>
          <MateriScene index={step - 2} />
          <div className="p-6 md:p-8">
            <span className="rounded-full bg-tinta px-4 py-1 text-base font-bold text-white">Materi {step - 1} dari {sections.length}</span>
            <h1 className="mt-3 text-3xl md:text-4xl">{section.title}</h1>
            <Rich text={section.body} />
          </div>
        </section>
      ) : (
        <section className="rounded-besar bg-mentari-soft p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl">🎬 Tonton videonya dulu, yuk!</h1>
          <p className="mt-2">Tekan tombol play, lalu lanjut setelah selesai menonton.</p>
          <iframe className="mt-4 aspect-video w-full rounded-2xl bg-tinta" src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`} title="Video materi pencegahan hipertensi"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen />
        </section>
      )}

      <nav className="flex flex-wrap items-center justify-between gap-3">
        {step > 1 ? <Link href={`${base}/${step - 1}`} className="btn-putih">‹ Sebelumnya</Link> : <span />}
        {step < TOTAL
          ? <Link href={`${base}/${step + 1}`} className="btn-merah">Lanjut ›</Link>
          : <CompleteButton activityKey={`${a.key}-materi`} label="Saya sudah selesai membaca ✔" redirectTo={`/aktivitas/${a.slug}/form`} />}
      </nav>
    </div>
  );
}
