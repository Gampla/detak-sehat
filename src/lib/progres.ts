// Data progres aktivitas peserta (dipakai halaman admin dan ekspor CSV).
import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export const AKTIVITAS = [
  { key: "pretest", nama: "Pre-Test" },
  { key: "postest-1", nama: "Postest H1" },
  { key: "aktivitas-3", nama: "Kuesioner H7" },
  { key: "aktivitas-4", nama: "Kuesioner H14" },
] as const;

export type Filter = { q?: string; dari?: string; sampai?: string; urut?: string };

// Tanggal "YYYY-MM-DD" dibaca sebagai waktu WIB (UTC+7)
function parseDate(d: string | undefined, akhirHari: boolean) {
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return undefined;
  const x = new Date(`${d}T${akhirHari ? "23:59:59.999" : "00:00:00"}+07:00`);
  return isNaN(x.getTime()) ? undefined : x;
}

export const tglPendek = (d: Date | null) =>
  d ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeZone: "Asia/Jakarta" }).format(d) : "-";

export async function getProgres(f: Filter) {
  const q = (f.q ?? "").trim();
  const from = parseDate(f.dari, false), to = parseDate(f.sampai, true);
  const keys = AKTIVITAS.map((a) => a.key);

  const where: Prisma.UserWhereInput = {
    role: "USER",
    ...(q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }, { school: { contains: q } }] } : {}),
    // Filter tanggal: peserta yang menyelesaikan minimal satu aktivitas pada rentang tersebut
    ...(from || to ? { activities: { some: { activityKey: { in: [...keys] }, completedAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } } } : {}),
  };
  const users = await prisma.user.findMany({
    where, take: 2000,
    include: { activities: { where: { activityKey: { in: [...keys] } }, select: { activityKey: true, completedAt: true } } },
  });

  const rows = users.map((u) => {
    const m = new Map(u.activities.map((a) => [a.activityKey, a.completedAt]));
    const tgl = AKTIVITAS.map((a) => m.get(a.key) ?? null);
    const done = tgl.filter((x): x is Date => !!x);
    return { id: u.id, name: u.name, email: u.email, school: u.school, daftar: u.createdAt, tgl, n: done.length,
      terakhir: done.length ? new Date(Math.max(...done.map((d) => d.getTime()))) : null };
  });

  const urut = f.urut ?? "terbaru";
  rows.sort((a, b) =>
    urut === "progres-tinggi" ? b.n - a.n || a.name.localeCompare(b.name)
    : urut === "progres-rendah" ? a.n - b.n || a.name.localeCompare(b.name)
    : urut === "nama" ? a.name.localeCompare(b.name)
    : b.daftar.getTime() - a.daftar.getTime());
  return rows;
}
