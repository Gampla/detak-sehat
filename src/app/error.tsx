"use client";
import Mascot from "@/components/Mascot";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <Mascot size={140} />
      <h1 className="text-4xl">Aduh, ada yang salah</h1>
      <p className="max-w-md">Jangan khawatir, ini bukan salahmu. Coba lagi sebentar ya!</p>
      <button onClick={reset} className="btn-merah">Coba lagi</button>
    </main>
  );
}
