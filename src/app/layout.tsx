import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";
 
const baloo = Baloo_2({ subsets: ["latin"], variable: "--font-baloo", weight: ["600", "700", "800"] });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
 
export const metadata: Metadata = {
  title: "DetakSehat - Belajar Hipertensi Bersama Si Detak",
  description: "Platform belajar kesehatan jantung dan tekanan darah untuk remaja.",
};
 
// Semua halaman dibuat saat dibuka pengunjung (bukan saat build), karena membaca database & sesi login.
// Ini mencegah build di Vercel gagal walau ada halaman lain yang lupa diberi pengaturan ini.
export const dynamic = "force-dynamic";
 
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${baloo.variable} ${nunito.variable}`}>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}