// Penjaga pintu: memeriksa login & role sebelum halaman/API dibuka.
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/jwt";

const USER_PAGES = ["/dashboard", "/materi", "/tes", "/riwayat", "/aktivitas"];
const starts = (path: string, bases: string[]) => bases.some((b) => path === b || path.startsWith(b + "/"));

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await verifyToken(req.cookies.get(COOKIE_NAME)?.value);
  const isApi = pathname.startsWith("/api/");
  const deny = (status: number, msg: string, redirect: string) =>
    isApi ? NextResponse.json({ error: msg }, { status }) : NextResponse.redirect(new URL(redirect, req.url));

  // Halaman login/daftar: kalau sudah masuk, arahkan ke dashboard sesuai role
  if (pathname === "/login" || pathname === "/daftar") {
    if (session) return NextResponse.redirect(new URL(session.role === "ADMIN" ? "/admin" : "/dashboard", req.url));
    return NextResponse.next();
  }

  // Area admin: harus login DAN role ADMIN
  if (starts(pathname, ["/admin", "/api/admin"])) {
    if (!session) return deny(401, "Silakan masuk dulu ya.", "/login");
    if (session.role !== "ADMIN") return deny(403, "Halaman ini khusus admin.", "/dashboard");
  }

  // Area user: harus login. Admin diarahkan ke dashboard admin.
  if (starts(pathname, [...USER_PAGES, "/api/user"])) {
    if (!session) return deny(401, "Silakan masuk dulu ya.", "/login");
    if (session.role === "ADMIN" && !isApi) return NextResponse.redirect(new URL("/admin", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/daftar", "/dashboard/:path*", "/materi/:path*", "/tes/:path*", "/riwayat/:path*", "/aktivitas/:path*", "/admin/:path*", "/api/admin/:path*", "/api/user/:path*"],
};
