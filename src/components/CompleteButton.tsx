"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

// Menandai satu aktivitas selesai, lalu kembali ke dashboard.
export default function CompleteButton({ activityKey, label, redirectTo = "/dashboard", disabled = false }: { activityKey: string; label: string; redirectTo?: string; disabled?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function done() {
    setLoading(true);
    const res = await fetch(`/api/user/aktivitas/${activityKey}/complete`, { method: "POST" });
    setLoading(false);
    if (!res.ok) return toast.error((await res.json()).error ?? "Ups, belum berhasil. Coba lagi ya!");
    toast.success("Hebat! Aktivitas selesai 🌟");
    router.push(redirectTo);
    router.refresh();
  }
  return <button onClick={done} disabled={loading || disabled} className="btn-merah">{loading ? "Sebentar ya..." : label}</button>;
}
