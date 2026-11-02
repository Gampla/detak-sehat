import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { AKTIVITAS, getProgres } from "@/lib/progres";

const fmt = (d: Date | null) => (d ? new Intl.DateTimeFormat("sv-SE", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(d) : "");

// Escape sel CSV; awalan = + - @ diberi tanda ' agar tidak dibaca sebagai rumus di Excel
function cell(v: string | number | null) {
  let s = String(v ?? "");
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: Request) {
  const me = await getCurrentUser();
  if (!me || me.role !== "ADMIN") return NextResponse.json({ error: "Khusus admin." }, { status: 403 });

  const sp = new URL(req.url).searchParams;
  const rows = await getProgres({ q: sp.get("q") ?? "", dari: sp.get("dari") ?? "", sampai: sp.get("sampai") ?? "", urut: sp.get("urut") ?? "" });

  const header = ["Nama", "Email", "Sekolah", ...AKTIVITAS.map((a) => a.nama), "Jumlah Selesai", "Selesai Terakhir", "Tanggal Daftar"];
  const lines = rows.map((r) => [r.name, r.email, r.school ?? "", ...r.tgl.map(fmt), `${r.n}/${AKTIVITAS.length}`, fmt(r.terakhir), fmt(r.daftar)].map(cell).join(";"));
  // BOM + pemisah titik koma: terbaca benar di Excel (pengaturan regional Indonesia)
  const csv = "\uFEFF" + [header.map(cell).join(";"), ...lines].join("\r\n");
  const nama = `progres-peserta-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${nama}"` } });
}
