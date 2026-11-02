import Link from "next/link";
import Mascot from "@/components/Mascot";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <Mascot size={160} />
      <h1 className="text-4xl">Ups, halaman tidak ditemukan</h1>
      <p className="max-w-md">Si Detak sudah mencari ke mana-mana, tapi halaman ini tidak ada. Yuk kembali ke beranda!</p>
      <Link href="/dashboard" className="btn-merah">Kembali ke beranda</Link>
    </main>
  );
}
