import Link from "next/link";
import { isLocked } from "@/lib/activity-lock";
import LockedNotice from "@/components/LockedNotice";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PRETEST_URL } from "@/lib/activities";
import Mascot from "@/components/Mascot";
import CompleteButton from "@/components/CompleteButton";

const steps = [
  { e: "🔗", t: "Buka pre-test", d: "Tekan tombol besar di bawah. Formulir akan terbuka di tab baru.", c: "bg-mentari-soft" },
  { e: "✍️", t: "Isi semua soal", d: "Jawab sesuai pengetahuanmu saat ini. Tidak ada jawaban salah untuk rasa ingin tahu!", c: "bg-mint-soft" },
  { e: "✅", t: "Kembali ke sini", d: "Setelah selesai, tekan tombol \"Saya sudah selesai\" agar aktivitas berikutnya terbuka.", c: "bg-jantung-soft" },
];

export default async function PretestPage() {
  if (await isLocked("pretest")) return <LockedNotice title="Pre-Test" />;
  const user = (await getCurrentUser())!;
  const done = await prisma.activityProgress.findUnique({ where: { userId_activityKey: { userId: user.id, activityKey: "pretest" } } });

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="font-bold underline">‹ Kembali ke beranda</Link>
      <section className="flex flex-col items-center gap-4 rounded-besar bg-langit p-8 text-center md:flex-row md:text-left">
        <Mascot size={140} />
        <div>
          <p className="inline-block rounded-full bg-white px-4 py-1 font-bold">Aktivitas 1</p>
          <h1 className="mt-2 text-4xl md:text-5xl">Pre-Test Pencegahan Hipertensi</h1>
          <p className="mt-2 max-w-xl">Sebelum belajar, yuk cek dulu apa yang sudah kamu tahu. Hasilnya membantu kita melihat seberapa banyak kamu belajar nanti!</p>
        </div>
      </section>

      <ol className="grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.t} className={`${s.c} rounded-besar p-6`}>
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-display text-xl font-bold">{i + 1}</span><span className="text-4xl" aria-hidden>{s.e}</span></div>
            <h2 className="mt-3 text-2xl">{s.t}</h2>
            <p className="mt-1">{s.d}</p>
          </li>
        ))}
      </ol>

      <section className="space-y-5 rounded-besar bg-white p-8 text-center">
        <a href={PRETEST_URL} target="_blank" rel="noopener noreferrer" className="btn-merah !min-h-[4.5rem] !px-12 !text-2xl">Buka Pre-Test ↗</a>
        <p className="text-base opacity-70">Link terbuka di tab baru. Siapkan waktu sekitar 10 menit.</p>
        {done ? (
          <div className="rounded-2xl bg-mint-soft p-4"><p className="font-display text-xl font-bold">Pre-test sudah selesai ✔</p><Link href="/dashboard" className="btn-putih mt-3">Ke beranda</Link></div>
        ) : (
          <div className="border-t-4 border-dotted border-langit pt-5"><CompleteButton activityKey="pretest" label="Saya sudah selesai mengerjakan ✔" /></div>
        )}
      </section>
    </div>
  );
}
