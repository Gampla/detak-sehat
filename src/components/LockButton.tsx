"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

// Tombol buka/kunci. Tanpa `aktivitasKey` = berlaku untuk SEMUA aktivitas.
export default function LockButton({ aktivitasKey, buka, label }: { aktivitasKey?: string; buka: boolean; label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function go() {
    if (!buka && !aktivitasKey && !confirm("Kunci SEMUA aktivitas? Peserta tidak bisa membuka aktivitas apa pun sampai dibuka lagi.")) return;
    setBusy(true);
    const res = await fetch("/api/admin/aktivitas", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: aktivitasKey, isOpen: buka }) });
    setBusy(false);
    if (!res.ok) return toast.error((await res.json()).error ?? "Gagal, coba lagi.");
    toast.success(buka ? "Aktivitas dibuka 🔓" : "Aktivitas dikunci 🔒");
    router.refresh();
  }
  return <button onClick={go} disabled={busy} className={`min-h-[3rem] rounded-full px-5 font-display text-lg font-bold disabled:opacity-60 ${buka ? "bg-mint hover:brightness-95" : "bg-jantung text-white hover:bg-jantung-dark"}`}>{busy ? "..." : label}</button>;
}
