import Link from "next/link";

// Ditampilkan ke peserta saat aktivitas dikunci admin
export default function LockedNotice({ title }: { title: string }) {
  return (
    <div className="rounded-besar bg-white p-10 text-center">
      <div className="text-7xl" aria-hidden>🔒</div>
      <h1 className="mt-3 text-3xl">{title} sedang dikunci</h1>
      <p className="mx-auto mt-2 max-w-md">Aktivitas ini belum dibuka oleh admin. Tunggu sampai dibuka, ya!</p>
      <Link href="/dashboard" className="btn-merah mt-6">Kembali ke beranda</Link>
    </div>
  );
}
