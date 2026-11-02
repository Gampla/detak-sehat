import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import UserActions from "@/components/UserActions";

const PAGE_SIZE = 10;
const KEYS = ["pretest", "postest-1", "aktivitas-3", "aktivitas-4"];

export default async function PesertaPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const q = (searchParams.q ?? "").trim();
  const page = Math.max(1, Number(searchParams.page) || 1);
  const where: Prisma.UserWhereInput = { role: "USER", ...(q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }, { school: { contains: q } }] } : {}) };
  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, include: { activities: { select: { activityKey: true } } } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const href = (n: number) => `/admin/peserta?q=${encodeURIComponent(q)}&page=${n}`;

  return (
    <div className="space-y-5">
      <h1 className="text-3xl md:text-4xl">Data Peserta</h1>
      <form className="flex flex-wrap gap-3" role="search">
        <input name="q" defaultValue={q} placeholder="Cari nama, email, atau sekolah..." aria-label="Cari peserta" className="input max-w-md !bg-white" />
        <button className="btn-merah !min-h-[3.5rem] !px-6 !text-lg">Cari</button>
        {q && <Link href="/admin/peserta" className="btn-putih !min-h-[3.5rem] !px-6 !text-lg">Reset</Link>}
      </form>

      {users.length === 0 ? (
        <div className="rounded-besar bg-white p-10 text-center"><div className="text-5xl">🔎</div><p className="mt-2 font-bold">{q ? "Tidak ada peserta yang cocok dengan pencarianmu." : "Belum ada peserta yang mendaftar."}</p></div>
      ) : (
        <div className="overflow-x-auto rounded-besar bg-white">
          <table className="w-full min-w-[56rem] text-base">
            <thead className="bg-langit-soft text-left font-display"><tr>{["Nama", "Email", "Usia / Sekolah", "Terdaftar", "Progres", "Status", "Aksi"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {users.map((u) => {
                const done = new Set(u.activities.map((a) => a.activityKey));
                const n = KEYS.filter((k) => done.has(k)).length;
                return (
                  <tr key={u.id} className="border-t border-langit-soft align-middle">
                    <td className="px-4 py-3 font-bold">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{[u.age && `${u.age} th`, u.school].filter(Boolean).join(" · ") || "-"}</td>
                    <td className="px-4 py-3">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">{n}/{KEYS.length}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-3 py-1 font-bold ${u.isActive ? "bg-mint-soft" : "bg-jantung-soft"}`}>{u.isActive ? "Aktif" : "Nonaktif"}</span></td>
                    <td className="px-4 py-3"><UserActions id={u.id} name={u.name} isActive={u.isActive} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <nav className="flex flex-wrap items-center justify-between gap-3" aria-label="Halaman">
        <p>{total} peserta · halaman {page} dari {pages}</p>
        <div className="flex gap-2">
          {page > 1 && <Link href={href(page - 1)} className="btn-putih !min-h-[3rem] !px-5 !text-lg">‹ Sebelumnya</Link>}
          {page < pages && <Link href={href(page + 1)} className="btn-merah !min-h-[3rem] !px-5 !text-lg">Berikutnya ›</Link>}
        </div>
      </nav>
    </div>
  );
}
