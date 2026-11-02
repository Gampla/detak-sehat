import { prisma } from "@/lib/prisma";
import { ACTIVITIES } from "@/lib/activities";
import { lockedKeys } from "@/lib/activity-lock";
import LockButton from "@/components/LockButton";

export default async function KelolaAktivitas() {
  const [locked, grouped] = await Promise.all([
    lockedKeys(),
    prisma.activityProgress.groupBy({ by: ["activityKey"], where: { user: { role: "USER" } }, _count: { _all: true } }),
  ]);
  const jumlah = (k: string) => grouped.find((g) => g.activityKey === k)?._count._all ?? 0;

  return (
    <div className="space-y-5">
      <h1 className="text-3xl md:text-4xl">Kelola Aktivitas</h1>
      <p className="max-w-2xl">Buka atau kunci aktivitas untuk <b>semua peserta</b>. Aktivitas yang dikunci tidak bisa dibuka atau diselesaikan peserta. Aktivitas yang dibuka tetap mengikuti urutan (peserta harus menyelesaikan aktivitas sebelumnya).</p>

      <div className="flex flex-wrap gap-3 rounded-besar bg-white p-4">
        <LockButton buka label="🔓 Buka semua aktivitas" />
        <LockButton buka={false} label="🔒 Kunci semua aktivitas" />
      </div>

      <ul className="space-y-4">
        {ACTIVITIES.map((a) => {
          const kunci = locked.has(a.key);
          return (
            <li key={a.key} className={`${a.color} flex flex-wrap items-center justify-between gap-4 rounded-besar p-5`}>
              <div className="flex items-center gap-4">
                <span className="text-5xl" aria-hidden>{a.emoji}</span>
                <div>
                  <p className="font-bold">Aktivitas {a.no}</p>
                  <h2 className="text-2xl">{a.title}</h2>
                  <p className="text-base">{jumlah(a.key)} peserta sudah menyelesaikan</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-4 py-2 font-bold ${kunci ? "bg-jantung text-white" : "bg-white"}`}>{kunci ? "🔒 Dikunci" : "🔓 Terbuka"}</span>
                <LockButton aktivitasKey={a.key} buka={kunci} label={kunci ? "Buka" : "Kunci"} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
