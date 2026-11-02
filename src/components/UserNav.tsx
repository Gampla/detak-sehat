"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const links = [{ href: "/dashboard", label: "Beranda" }];

export default function UserNav({ name }: { name: string }) {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Sampai jumpa, " + name.split(" ")[0] + "! 👋");
    router.push("/");
    router.refresh();
  }
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/dashboard" className="font-display text-2xl font-extrabold text-jantung-dark">DetakSehat</Link>
        <nav className="flex flex-wrap items-center gap-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-full px-4 py-2 font-bold hover:bg-langit-soft">{l.label}</Link>
          ))}
          <button onClick={logout} className="rounded-full bg-jantung-soft px-4 py-2 font-bold text-jantung-dark hover:bg-jantung hover:text-white">Keluar</button>
        </nav>
      </div>
    </header>
  );
}
