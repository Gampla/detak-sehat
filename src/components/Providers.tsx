"use client";
import { Toaster } from "react-hot-toast";

// Notifikasi (toast) ramah anak untuk seluruh aplikasi
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-center" toastOptions={{ style: { borderRadius: "999px", fontWeight: 700, padding: "12px 20px" } }} />
    </>
  );
}
