import Link from "next/link";
import Mascot from "./Mascot";

/** Kerangka bersama halaman masuk & daftar. */
export default function AuthShell({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-8 px-4 py-10 md:flex-row md:gap-14">
      <div className="flex flex-col items-center text-center">
        <Link href="/" className="mb-4 font-display text-2xl font-extrabold text-jantung-dark">DetakSehat</Link>
        <Mascot size={180} />
        <p className="mt-4 max-w-xs rounded-besar bg-white px-5 py-3 font-semibold">{hint}</p>
      </div>
      <section className="w-full max-w-md rounded-besar bg-mentari-soft p-6 shadow-[0_8px_0_#FFD04D] md:p-8">
        <h1 className="mb-5 text-3xl">{title}</h1>
        {children}
      </section>
    </main>
  );
}
