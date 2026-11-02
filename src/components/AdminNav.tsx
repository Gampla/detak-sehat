"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const links = [
  { href: "/admin", label: "Dashboard", e: "📊" },
  { href: "/admin/peserta", label: "Data Peserta", e: "👥" },
  { href: "/admin/progres", label: "Progres Aktivitas", e: "📈" },
  { href: "/admin/aktivitas", label: "Kelola Aktivitas", e: "🔓" },
];

// Sidebar admin (menjadi bar horizontal di layar kecil)
export default function AdminNav({ name }: { name: string }) {
  const path = usePathname();
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Anda sudah keluar.");
    router.push("/login");
    router.refresh();
  }
  return (
    <aside className="bg-tinta text-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0">
      <div className="flex flex-col gap-3 p-4 md:h-full md:p-6">
        <div>
          <p className="font-display text-2xl font-extrabold">DetakSehat</p>
          <p className="text-base opacity-70">Panel Admin · {name}</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto md:mt-4 md:flex-col" aria-label="Menu admin">
          {links.map((l) => {
            const on = path === l.href || (l.href !== "/admin" && path.startsWith(l.href));
            return (
              <Link key={l.href} href={l.href} aria-current={on ? "page" : undefined}
                className={`flex min-h-[3rem] shrink-0 items-center gap-2 rounded-2xl px-4 font-bold ${on ? "bg-white text-tinta" : "hover:bg-white/15"}`}>
                <span aria-hidden>{l.e}</span>{l.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={logout} className="mt-auto min-h-[3rem] rounded-2xl bg-jantung px-4 font-bold hover:bg-jantung-dark">Keluar</button>
      </div>
    </aside>
  );
}
