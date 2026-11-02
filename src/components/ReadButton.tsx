"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

// Tombol "Saya Sudah Membaca": menandai materi selesai dibaca.
export default function ReadButton({ materialId }: { materialId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function mark() {
    setLoading(true);
    const res = await fetch(`/api/user/materi/${materialId}/read`, { method: "POST" });
    setLoading(false);
    if (!res.ok) return toast.error("Ups, belum berhasil. Coba lagi ya!");
    toast.success("Hebat! Materi selesai dibaca 🌟");
    router.refresh();
  }
  return <button onClick={mark} disabled={loading} className="btn-merah">{loading ? "Sebentar ya..." : "Saya sudah membaca ✔"}</button>;
}
