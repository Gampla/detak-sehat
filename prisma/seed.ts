import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const materials = [
  {
    title: "Kenalan dengan Jantung & Tekanan Darah",
    description: "Yuk kenalan sama Si Detak, jantung yang tak pernah istirahat!",
    coverImage: "❤️",
    order: 1,
    content: `## Halo, aku Si Detak!
Jantung adalah otot kuat seukuran kepalan tanganmu. Tugasnya memompa darah ke seluruh tubuh, siang dan malam, bahkan saat kamu tidur!

## Darah dan pembuluh darah
Darah mengalir lewat pipa-pipa kecil bernama pembuluh darah. Darah membawa oksigen dan makanan agar tubuhmu kuat dan bertenaga.

## Apa itu tekanan darah?
Saat mengalir, darah mendorong dinding pembuluh darah. Dorongan itu disebut tekanan darah. Bayangkan air di dalam selang: kalau dorongannya terlalu kuat, selang jadi capek.

## Tekanan darah yang sehat
Tekanan darah yang pas membuat tubuh bekerja dengan baik. Dokter mengukurnya dengan alat khusus bernama tensimeter.`,
  },
  {
    title: "Apa Itu Hipertensi?",
    description: "Hipertensi itu saat dorongan darah terlalu kuat. Yuk cari tahu!",
    coverImage: "💪",
    order: 2,
    content: `## Hipertensi itu apa?
Hipertensi artinya tekanan darah tinggi. Dorongan darah ke dinding pembuluh darah terlalu kuat, sehingga jantung bekerja lebih keras dari biasanya.

## Kenapa perlu dicegah?
Kalau dibiarkan bertahun-tahun, hipertensi bisa membuat jantung, otak, dan ginjal sakit. Kabar baiknya, hipertensi bisa dicegah dengan kebiasaan sehat!

## Apakah anak-anak bisa kena?
Bisa, walau lebih jarang. Anak yang kurang bergerak, sering makan makanan asin, atau kelebihan berat badan lebih berisiko.

## Gejalanya
Sering kali hipertensi tidak terasa sama sekali. Karena itu, kebiasaan sehat sejak kecil sangat penting.`,
  },
  {
    title: "Penyebab Hipertensi",
    description: "Garam, malas gerak, dan makanan kurang sehat: kenali si pembuat jantung capek!",
    coverImage: "🧂",
    order: 3,
    content: `## Garam berlebihan
Terlalu banyak garam membuat tubuh menahan air, sehingga tekanan darah naik. Garam tersembunyi di mi instan, keripik, sosis, dan makanan kemasan.

## Kurang bergerak
Kalau seharian hanya duduk atau main gawai, jantung dan pembuluh darah jadi kurang terlatih.

## Makanan tidak sehat
Makanan terlalu berminyak, terlalu manis, dan minim sayur-buah bisa membuat berat badan berlebih. Berat badan berlebih membuat jantung bekerja ekstra.

## Kurang tidur
Tidur yang kurang juga bisa memengaruhi tekanan darah. Tubuh butuh istirahat untuk memperbaiki diri.`,
  },
  {
    title: "Cara Mencegah Hipertensi",
    description: "Jurus-jurus sehat supaya jantungmu selalu riang!",
    coverImage: "🥦",
    order: 4,
    content: `## Makan buah dan sayur
Buah dan sayur kaya vitamin, mineral, dan serat. Biasakan makan sayur dan buah setiap hari ya!

## Kurangi garam dan makanan instan
Pilih jajanan segar daripada keripik dan mi instan. Cukup makan makanan asin sesekali saja.

## Aktif bergerak
Bermain bola, bersepeda, berenang, atau menari minimal 60 menit sehari membuat jantungmu kuat.

## Tidur cukup dan minum air putih
Anak usia sekolah butuh tidur sekitar 9 sampai 11 jam. Jangan lupa minum air putih yang cukup!`,
  },
];

// [indeks materi, soal, A, B, C, D, kunci, penjelasan]
const questions: [number, string, string, string, string, string, string, string][] = [
  [0, "Apa tugas utama jantung?", "Mencerna makanan", "Memompa darah ke seluruh tubuh", "Membantu kita berpikir", "Menyaring udara", "B", "Jantung memompa darah agar oksigen dan makanan sampai ke seluruh tubuh."],
  [0, "Apa yang dimaksud dengan tekanan darah?", "Dorongan darah ke dinding pembuluh darah", "Banyaknya darah di tubuh", "Suhu tubuh", "Kecepatan berlari", "A", "Tekanan darah adalah dorongan darah yang mengalir terhadap dinding pembuluh darah."],
  [0, "Alat apa yang dipakai untuk mengukur tekanan darah?", "Termometer", "Timbangan", "Tensimeter", "Penggaris", "C", "Tensimeter adalah alat untuk mengukur tekanan darah."],
  [1, "Hipertensi adalah...", "Tekanan darah rendah", "Tekanan darah tinggi", "Demam tinggi", "Batuk lama", "B", "Hipertensi berarti tekanan darah tinggi."],
  [1, "Apa yang terjadi pada jantung saat hipertensi?", "Bekerja lebih ringan", "Berhenti berdetak", "Bekerja lebih keras", "Menjadi lebih kecil", "C", "Dorongan darah yang kuat membuat jantung bekerja lebih keras."],
  [2, "Makanan mana yang biasanya banyak garamnya?", "Apel", "Mi instan", "Pisang", "Wortel", "B", "Mi instan dan makanan kemasan biasanya tinggi garam."],
  [2, "Kebiasaan mana yang bisa menyebabkan hipertensi?", "Bermain bola", "Minum air putih", "Seharian duduk dan jarang bergerak", "Makan sayur", "C", "Kurang bergerak membuat jantung dan pembuluh darah kurang terlatih."],
  [3, "Berapa lama sebaiknya anak aktif bergerak setiap hari?", "Sekitar 5 menit", "Sekitar 10 menit", "Sekitar 60 menit", "Tidak perlu", "C", "Anak dianjurkan aktif bergerak sekitar 60 menit setiap hari."],
  [3, "Mana pilihan jajanan yang lebih sehat?", "Keripik asin", "Sosis goreng", "Buah potong segar", "Mi instan", "C", "Buah segar kaya vitamin dan serat, serta rendah garam."],
  [3, "Mengapa tidur cukup itu penting?", "Supaya tubuh bisa beristirahat dan memperbaiki diri", "Supaya cepat tinggi saja", "Supaya tidak perlu makan", "Tidak ada gunanya", "A", "Tidur cukup membantu tubuh, termasuk jantung, beristirahat dan pulih."],
];

async function main() {
  // Admin default
  await prisma.user.upsert({
    where: { email: "admin@sehathati.com" },
    update: {},
    create: {
      name: "Admin DetakSehat",
      email: "admin@sehathati.com",
      password: await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "Admin123!", 10),
      role: "ADMIN",
    },
  });

  // Hapus data konten lama agar seed bisa diulang
  await prisma.question.deleteMany();
  await prisma.material.deleteMany();

  const created = [];
  for (const m of materials) {
    created.push(await prisma.material.create({ data: { ...m, isPublished: true } }));
  }
  for (const [i, q, a, b, c, d, key, exp] of questions) {
    await prisma.question.create({
      data: { materialId: created[i].id, questionText: q, optionA: a, optionB: b, optionC: c, optionD: d, correctAnswer: key, explanation: exp },
    });
  }
  console.log("✅ Seed selesai: 1 admin, 4 materi, 10 soal");
}

main().finally(() => prisma.$disconnect());
