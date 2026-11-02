import Link from "next/link";
import Mascot from "@/components/Mascot";
import Edukasi from "@/components/edukasi/Edukasi";

const fitur = [
  { e: "📖", t: "Baca materi seru", d: "Belajar tentang jantung dan tekanan darah dengan cerita pendek yang mudah dipahami.", c: "bg-mint-soft" },
  { e: "✅", t: "Kerjakan tes", d: "Jawab soal pilihan ganda, lihat skormu, dan dapatkan konfeti kalau nilainya bagus!", c: "bg-mentari-soft" },
  { e: "📈", t: "Pantau kemajuanmu", d: "Lihat riwayat tesmu dan lihat betapa kamu makin pintar menjaga jantung.", c: "bg-jantung-soft" },
];

const kebiasaan = ["🥦 Makan buah dan sayur", "🏃 Bergerak 60 menit sehari", "🧂 Kurangi garam", "😴 Tidur cukup", "💧 Minum air putih"];

export default function Landing() {
  return (
    <main>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <span className="font-display text-2xl font-extrabold text-jantung-dark">DetakSehat</span>
        <nav className="flex gap-2">
          <Link href="/login" className="btn-putih !min-h-[3rem] !px-5 !text-lg">Masuk</Link>
          <Link href="/daftar" className="btn-merah !min-h-[3rem] !px-5 !text-lg">Daftar</Link>
        </nav>
      </header>

      <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-10 md:flex-row md:py-16">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl">Halo! Aku Si Detak, jantungmu yang tak pernah istirahat.</h1>
          <p className="mx-auto mt-5 max-w-xl md:mx-0">Yuk belajar cara menjaga jantung dan tekanan darah tetap sehat. Cocok untuk kamu yang berusia 8 sampai 12 tahun!</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
            <Link href="/daftar" className="btn-merah">Daftar gratis</Link>
            <Link href="/login" className="btn-putih">Aku sudah punya akun</Link>
          </div>
        </div>
        <div className="flex flex-1 justify-center"><Mascot size={320} /></div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl md:text-4xl">Apa itu hipertensi?</h2>
          <p className="mt-4 max-w-2xl">Darah mengalir di dalam tubuhmu dan mendorong dinding pembuluh darah, seperti air di dalam selang. Kalau dorongannya terlalu kuat, itu namanya <b>hipertensi</b> atau tekanan darah tinggi, dan jantung jadi cepat lelah.</p>
          <p className="mt-4 max-w-2xl">Kabar baiknya, hipertensi bisa dicegah dengan kebiasaan sehat yang mulai dari sekarang:</p>
          <ul className="mt-5 flex flex-wrap gap-3">
            {kebiasaan.map((k) => <li key={k} className="rounded-full bg-mint-soft px-5 py-2 font-bold">{k}</li>)}
          </ul>
        </div>
      </section>

      <section id="edukasi" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl md:text-4xl">Media edukasi: penyebab dan pencegahan</h2>
        <p className="mb-6 mt-2 max-w-2xl">Lihat animasi, poster, dan leaflet tentang hipertensi.</p>
        <Edukasi />
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-3">
        {fitur.map((f) => (
          <article key={f.t} className={`${f.c} rounded-besar p-7`}>
            <div className="text-5xl" aria-hidden>{f.e}</div>
            <h3 className="mt-3 text-2xl">{f.t}</h3>
            <p className="mt-2">{f.d}</p>
          </article>
        ))}
      </section>

      <footer className="pb-12 text-center">
        <Link href="/daftar" className="btn-merah">Mulai petualangan sehat</Link>
        <p className="mt-6 text-base opacity-70">DetakSehat · Belajar sehat itu menyenangkan</p>
      </footer>
    </main>
  );
}
