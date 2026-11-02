import Mascot from "@/components/Mascot";

// Tampil otomatis saat halaman sedang dimuat
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-center" role="status" aria-live="polite">
      <Mascot size={120} />
      <p className="font-display text-2xl font-bold">Sebentar ya, Si Detak sedang menyiapkan...</p>
    </div>
  );
}
