import Link from "next/link";
import { AKTIVITAS, getProgres, tglPendek } from "@/lib/progres";

const PAGE_SIZE = 15;
type SP = { q?: string; dari?: string; sampai?: string; urut?: string; page?: string };

export default async function ProgresPage({ searchParams }: { searchParams: SP }) {
  const { q = "", dari = "", sampai = "", urut = "terbaru" } = searchParams;
  const rows = await getProgres({ q, dari, sampai, urut });
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const page = Math.min(pages, Math.max(1, Number(searchParams.page) || 1));
  const view = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const qs = (extra: Record<string, string | number> = {}) => new URLSearchParams({ q, dari, sampai, urut, ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])) }).toString();
  const filtered = q || dari || sampai;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl md:text-4xl">Progres Aktivitas Peserta</h1>
        <a href={`/api/admin/progres/export?${qs()}`} className="btn-merah !min-h-[3rem] !px-6 !text-lg">⬇ Ekspor CSV / Excel</a>
      </div>

      <form className="grid gap-3 rounded-besar bg-white p-4 md:grid-cols-5" role="search">
        <label className="md:col-span-2"><span className="mb-1 block font-bold">Cari</span><input name="q" defaultValue={q} placeholder="Nama, email, atau sekolah" className="input !min-h-[3rem]" /></label>
        <label><span className="mb-1 block font-bold">Selesai dari</span><input type="date" name="dari" defaultValue={dari} className="input !min-h-[3rem]" /></label>
        <label><span className="mb-1 block font-bold">Sampai</span><input type="date" name="sampai" defaultValue={sampai} className="input !min-h-[3rem]" /></label>
        <label><span className="mb-1 block font-bold">Urutkan</span>
          <select name="urut" defaultValue={urut} className="input !min-h-[3rem]">
            <option value="terbaru">Pendaftar terbaru</option>
            <option value="progres-tinggi">Progres tertinggi</option>
            <option value="progres-rendah">Progres terendah</option>
            <option value="nama">Nama A-Z</option>
          </select>
        </label>
        <div className="flex gap-2 md:col-span-5">
          <button className="btn-merah !min-h-[3rem] !px-6 !text-lg">Terapkan</button>
          {filtered && <Link href="/admin/progres" className="btn-putih !min-h-[3rem] !px-6 !text-lg">Reset</Link>}
          <p className="self-center text-base opacity-70">Filter tanggal berdasarkan tanggal aktivitas diselesaikan.</p>
        </div>
      </form>

      {rows.length === 0 ? (
        <div className="rounded-besar bg-white p-10 text-center"><div className="text-5xl">📭</div><p className="mt-2 font-bold">{filtered ? "Tidak ada data yang cocok dengan filter." : "Belum ada peserta."}</p></div>
      ) : (
        <div className="overflow-x-auto rounded-besar bg-white">
          <table className="w-full min-w-[60rem] text-base">
            <thead className="bg-langit-soft text-left font-display">
              <tr><th className="px-4 py-3">Nama</th>{AKTIVITAS.map((a) => <th key={a.key} className="px-4 py-3">{a.nama}</th>)}<th className="px-4 py-3">Progres</th><th className="px-4 py-3">Selesai terakhir</th></tr>
            </thead>
            <tbody>
              {view.map((r) => (
                <tr key={r.id} className="border-t border-langit-soft">
                  <td className="px-4 py-3"><b>{r.name}</b><br /><span className="text-sm opacity-70">{r.email}</span></td>
                  {r.tgl.map((t, i) => <td key={i} className="px-4 py-3">{t ? <span className="rounded-full bg-mint-soft px-3 py-1 font-bold">✔ {tglPendek(t)}</span> : <span className="opacity-40">belum</span>}</td>)}
                  <td className="px-4 py-3 font-bold">{r.n}/{AKTIVITAS.length}</td>
                  <td className="px-4 py-3">{tglPendek(r.terakhir)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <nav className="flex flex-wrap items-center justify-between gap-3" aria-label="Halaman">
        <p>{rows.length} peserta · halaman {page} dari {pages}</p>
        <div className="flex gap-2">
          {page > 1 && <Link href={`/admin/progres?${qs({ page: page - 1 })}`} className="btn-putih !min-h-[3rem] !px-5 !text-lg">‹ Sebelumnya</Link>}
          {page < pages && <Link href={`/admin/progres?${qs({ page: page + 1 })}`} className="btn-merah !min-h-[3rem] !px-5 !text-lg">Berikutnya ›</Link>}
        </div>
      </nav>
    </div>
  );
}
