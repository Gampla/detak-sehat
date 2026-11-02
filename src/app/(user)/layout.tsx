import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import UserNav from "@/components/UserNav";

// Kerangka semua halaman user. Lapisan keamanan kedua setelah middleware.
export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");
  return (
    <>
      <UserNav name={user.name} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </>
  );
}
