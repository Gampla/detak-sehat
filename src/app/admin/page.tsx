import { prisma } from "@/lib/prisma";
import AdminChart from "@/components/AdminChart";

const AKTIVITAS = [
  { key: "pretest", nama: "Pre-Test" },
  { key: "postest-1", nama: "Postest H1" },
  { key: "aktivitas-3", nama: "Kuesioner H7" },
  { key: "aktivitas-4", nama: "Kuesioner H14" },
];

// Halaman ini membaca database & sesi login, jadi harus dibuat saat diakses (bukan saat build)
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [total, aktif, baru, grouped] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.user.count({ where: { role: "USER", isActive: true } }),
    prisma.user.count({ where: { role: "USER", createdAt: { gte: new Date(Date.now() - 7 * 86400000) } } }),
    prisma.activityProgress.groupBy({ by: ["activityKey"], where: { user: { role: "USER" } }, _count: { _all: true } }),
  ]);
  const data = AKTIVITAS.map((a) => ({ nama: a.nama, selesai: grouped.find((g) => g.activityKey === a.key)?._count._all ?? 0 }));
  const selesaiSemua = data[3].selesai; // aktivitas berurutan: selesai ke-4 berarti semua selesai
  const rata = total ? Math.round((data.reduce((s, d) => s + d.selesai, 0) / (total * AKTIVITAS.length)) * 100) : 0;

  const stats = [
    { l: "Total peserta", v: total, e: "👥", c: "bg-langit-soft" },
    { l: "Peserta aktif", v: aktif, e: "✅", c: "bg-mint-soft" },
    { l: "Daftar 7 hari terakhir", v: baru, e: "🆕", c: "bg-mentari-soft" },
    { l: "Selesai semua aktivitas", v: selesaiSemua, e: "🏅", c: "bg-jantung-soft" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl">Dashboard Admin</h1>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className={`${s.c} rounded-besar p-5`}>
            <div className="text-3xl" aria-hidden>{s.e}</div>
            <p className="mt-1 font-display text-4xl font-extrabold">{s.v}</p>
            <p className="text-base">{s.l}</p>
          </div>
        ))}
      </section>
      <section className="rounded-besar bg-white p-5 md:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl">Peserta yang menyelesaikan tiap aktivitas</h2>
          <p className="font-bold">Rata-rata progres: {rata}%</p>
        </div>
        <div className="mt-4"><AdminChart data={data} /></div>
      </section>
    </div>
  );
}
