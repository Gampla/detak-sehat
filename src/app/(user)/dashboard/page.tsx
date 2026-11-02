import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ACTIVITIES } from "@/lib/activities";
import Mascot from "@/components/Mascot";
import { lockedKeys } from "@/lib/activity-lock";
import BannerHipertensi from "@/components/BannerHipertensi";
import Edukasi from "@/components/edukasi/Edukasi";

export default async function DashboardPage() {
  const user = (await getCurrentUser())!;
  const rows = await prisma.activityProgress.findMany({ where: { userId: user.id } });
  const doneKeys = new Set(rows.map((r) => r.activityKey));
  const locked = await lockedKeys();
  const doneCount = ACTIVITIES.filter((a) => doneKeys.has(a.key)).length;
  const percent = Math.round((doneCount / ACTIVITIES.length) * 100);

  return (
    <div className="space-y-8">
      <BannerHipertensi />

      <section className="flex flex-col items-center gap-4 rounded-besar bg-white p-6 text-center md:flex-row md:text-left">
        <Mascot size={110} />
        <div>
          <h1 className="text-3xl md:text-4xl">Halo, {user.name}! 👋 Siap belajar hidup sehat hari ini?</h1>
          <p className="mt-1">Selesaikan 4 aktivitas ini satu per satu, ya.</p>
        </div>
      </section>

      <section className="rounded-besar bg-white p-6">
        <div className="flex justify-between font-bold"><span>Kemajuanmu</span><span>{doneCount} dari {ACTIVITIES.length} aktivitas</span></div>
        <div className="mt-3 h-5 overflow-hidden rounded-full bg-langit-soft" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Aktivitas selesai">
          <div className="h-full rounded-full bg-mint transition-all" style={{ width: `${percent}%` }} />
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {ACTIVITIES.map((a, i) => {
          const done = doneKeys.has(a.key);
          const kunci = locked.has(a.key);
          const unlocked = a.available && !kunci && (i === 0 || doneKeys.has(ACTIVITIES[i - 1].key));
          const status = done ? "✔ Selesai" : unlocked ? "Mulai sekarang" : kunci ? "🔒 Dikunci oleh admin" : a.available ? "🔒 Selesaikan aktivitas sebelumnya" : "🔒 Segera hadir";
          const body = (
            <>
              <div className="flex items-center justify-between"><span className="rounded-full bg-white px-4 py-1 font-bold">Aktivitas {a.no}</span><span className="text-5xl" aria-hidden>{a.emoji}</span></div>
              <h2 className="mt-3 text-2xl">{a.title}</h2>
              <p className="mt-1">{a.desc}</p>
              <p className={`mt-4 inline-block rounded-full px-4 py-2 font-display font-bold ${done ? "bg-mint" : unlocked ? "bg-jantung text-white" : "bg-white/70"}`}>{status}</p>
            </>
          );
          return unlocked || done
            ? <Link key={a.key} href={a.href} className={`${a.color} rounded-besar p-6 transition-transform hover:-translate-y-1 hover:scale-[1.02]`}>{body}</Link>
            : <div key={a.key} className={`${a.color} rounded-besar p-6 opacity-60`} aria-disabled="true">{body}</div>;
        })}
      </section>

      <section>
        <h2 className="mb-4 text-3xl">Media edukasi 🎬</h2>
        <Edukasi />
      </section>
    </div>
  );
}
