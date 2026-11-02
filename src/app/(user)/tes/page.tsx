import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import TestRunner from "@/components/TestRunner";

export default async function TesPage() {
  const user = (await getCurrentUser())!;
  // Tes terbuka hanya jika sudah ada materi yang dibaca
  const count = await prisma.question.count({
    where: { material: { isPublished: true, progress: { some: { userId: user.id, isRead: true } } } },
  });
  if (count === 0) {
    return (
      <div className="rounded-besar bg-white p-10 text-center">
        <div className="text-6xl">🔒</div>
        <h1 className="mt-2 text-3xl">Tesnya masih terkunci</h1>
        <p className="mt-2">Baca satu materi dulu dan tekan &quot;Saya sudah membaca&quot;, ya!</p>
        <Link href="/materi" className="btn-merah mt-6">Ke daftar materi</Link>
      </div>
    );
  }
  return <TestRunner questionCount={Math.min(count, 10)} />;
}
