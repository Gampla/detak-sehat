"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

// Tombol aktifkan/nonaktifkan dan hapus peserta
export default function UserActions({ id, name, isActive }: { id: string; name: string; isActive: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function call(method: "PATCH" | "DELETE", body?: object, ok = "Berhasil") {
    setBusy(true);
    const res = await fetch(`/api/admin/peserta/${id}`, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    setBusy(false);
    if (!res.ok) return toast.error((await res.json()).error ?? "Gagal, coba lagi.");
    toast.success(ok);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button disabled={busy} onClick={() => call("PATCH", { isActive: !isActive }, isActive ? "Peserta dinonaktifkan" : "Peserta diaktifkan")}
        className="min-h-[2.5rem] rounded-full bg-mentari-soft px-4 text-base font-bold hover:bg-mentari disabled:opacity-60">{isActive ? "Nonaktifkan" : "Aktifkan"}</button>
      <button disabled={busy} onClick={() => confirm(`Hapus peserta "${name}" beserta seluruh progresnya? Tindakan ini tidak bisa dibatalkan.`) && call("DELETE", undefined, "Peserta dihapus")}
        className="min-h-[2.5rem] rounded-full bg-jantung-soft px-4 text-base font-bold text-jantung-dark hover:bg-jantung hover:text-white disabled:opacity-60">Hapus</button>
    </div>
  );
}
