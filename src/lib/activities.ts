// Daftar 4 aktivitas (berurutan). Aktivitas berikutnya terbuka setelah aktivitas sebelumnya selesai.
export const PRETEST_URL = "https://bit.ly/Pre-TestPencegahanHipertensi";
// Isi dengan link posttest (mis. Google Form) jika sudah ada; kalau kosong, tombolnya tidak tampil.
export const POSTTEST_1_URL = "https://bit.ly/PosttestHariPertamaMAN1Surakarta";
export const VIDEO_ID = "kHY8paJcJo4"; // video YouTube di halaman pertama kartu materi

export const KUESIONER_7_URL = "https://bit.ly/KusionerHariKe-7";
export const KUESIONER_14_URL = "https://bit.ly/KusionerHarike-14";

// Aktivitas berurutan. Aktivitas 2-4 punya Kartu Materi + satu formulir (formUrl).
export const ACTIVITIES = [
  { key: "pretest", slug: "pretest", no: 1, title: "Pre-Test", desc: "Cek dulu pengetahuanmu tentang pencegahan hipertensi.", emoji: "📝", href: "/aktivitas/pretest", color: "bg-langit-soft", available: true, formUrl: PRETEST_URL },
  { key: "postest-1", slug: "postest-1", no: 2, title: "Postest Hari 1", desc: "Pelajari materi hipertensi, lalu kerjakan postest.", emoji: "📖", href: "/aktivitas/postest-1", color: "bg-mint-soft", available: true, formUrl: POSTTEST_1_URL },
  { key: "aktivitas-3", slug: "kuesioner-7", no: 3, title: "Kuesioner Hari ke-7", desc: "Ulangi materi, lalu isi kuesioner hari ke-7.", emoji: "🗓️", href: "/aktivitas/kuesioner-7", color: "bg-mentari-soft", available: true, formUrl: KUESIONER_7_URL },
  { key: "aktivitas-4", slug: "kuesioner-14", no: 4, title: "Kuesioner Hari ke-14", desc: "Ulangi materi, lalu isi kuesioner hari ke-14.", emoji: "🏅", href: "/aktivitas/kuesioner-14", color: "bg-jantung-soft", available: true, formUrl: KUESIONER_14_URL },
] as const;

export const bySlug = (slug: string) => ACTIVITIES.find((a) => a.slug === slug && a.no >= 2);
export const prevOf = (no: number) => ACTIVITIES.find((a) => a.no === no - 1);
