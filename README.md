# DetakSehat

Platform belajar pencegahan hipertensi untuk remaja dan anak, dengan maskot Si Detak.
Seluruh antarmuka berbahasa Indonesia.

**Teknologi:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma + SQLite · JWT (cookie httpOnly) · bcrypt · Framer Motion · Recharts

## Cara menjalankan

Syarat: [Node.js](https://nodejs.org) versi LTS (18 atau lebih baru).

1. Pasang pustaka: `npm install`
2. Salin pengaturan: `cp .env.example .env` (Windows: `copy .env.example .env`)
3. Buka `.env`, isi `JWT_SECRET` dengan teks acak minimal 32 karakter
4. Buat database dan data awal: `npm run setup`
5. Jalankan: `npm run dev`, lalu buka http://localhost:3000

## Akun admin bawaan

Untuk penggunaan sebenarnya, ganti kata sandi ini: isi `ADMIN_PASSWORD` di `.env` sebelum menjalankan `npm run setup` pada database baru.

## Alur peserta

Setelah masuk, peserta membuka 4 aktivitas **berurutan** di dashboard:

1. **Pre-Test** (formulir luar)
2. **Postest Hari 1**: Kartu Materi (video + 6 bagian) lalu formulir
3. **Kuesioner Hari ke-7**: Kartu Materi lalu formulir
4. **Kuesioner Hari ke-14**: Kartu Materi lalu formulir

Formulir dikerjakan di tautan luar. Aktivitas ditandai selesai saat peserta menekan tombol konfirmasi, karena website tidak bisa melihat isi formulir luar.

## Panel admin (`/admin`)

- **Dashboard**: statistik dan grafik penyelesaian aktivitas
- **Data Peserta**: cari, pagination, nonaktifkan/aktifkan, hapus
- **Progres Aktivitas**: tanggal selesai tiap aktivitas, filter tanggal, urutkan, ekspor CSV (pemisah titik koma, cocok untuk Excel Indonesia)
- **Kelola Aktivitas**: buka atau kunci aktivitas untuk semua peserta (per aktivitas atau sekaligus)

## Mengubah isi

| Yang ingin diubah | File |
| --- | --- |
| Tautan formulir, judul, urutan aktivitas | `src/lib/activities.ts` |
| Video YouTube | `VIDEO_ID` di `src/lib/activities.ts` |
| Teks materi | `src/lib/materi-postest1.ts` (`## ` bagian, `### ` sub judul, `- ` daftar, `\|` tabel) |
| Warna dan font | `tailwind.config.ts`, `src/app/layout.tsx` |

## Struktur folder

```
prisma/            skema database dan seed
src/app/           halaman (landing, login, daftar, (user), admin) dan API
src/components/    komponen (maskot, banner, media edukasi, tombol, dll.)
src/lib/           helper (JWT, auth, validasi, aktivitas, progres)
src/middleware.ts  proteksi route berdasarkan login dan role
```

Catatan: halaman lama `materi`, `tes`, `riwayat` (kuis di dalam website) masih ada di kode tetapi tidak ada di menu. Alur sekarang memakai formulir luar. Aman dihapus kalau tidak dipakai.

## Keamanan

- Kata sandi di-hash dengan bcrypt; role pendaftar selalu USER
- Sesi JWT di cookie httpOnly (otomatis `secure` saat produksi)
- Semua input divalidasi di server dengan Zod
- Route `/admin` dan `/api/admin` hanya untuk ADMIN, dicek di middleware dan di server
- Akun yang dinonaktifkan langsung tidak bisa masuk

**Sebelum dipakai publik:** ganti `JWT_SECRET` dan kata sandi admin, jalankan lewat HTTPS, dan pertimbangkan pembatasan percobaan login (belum ada).

## Pindah ke PostgreSQL / MySQL

Di `prisma/schema.prisma` ganti `provider = "sqlite"` menjadi `postgresql` atau `mysql`, ubah `DATABASE_URL` di `.env`, lalu jalankan `npx prisma db push`.

## Daftar uji manual

1. Daftar akun anak: validasi menolak data salah, lalu masuk ke dashboard
2. Aktivitas 2 dan seterusnya terkunci sebelum aktivitas sebelumnya selesai
3. Pre-Test: tombol membuka tautan, tombol konfirmasi membuka Aktivitas 2
4. Kartu Materi: video, tombol Lanjut/Sebelumnya, 6 bagian, lalu formulir terbuka
5. Login sebagai admin diarahkan ke `/admin`; anak yang membuka `/admin` dikembalikan ke `/dashboard`
6. Admin mengunci satu aktivitas: peserta melihat "Dikunci oleh admin"
7. Admin menonaktifkan peserta: peserta tidak bisa masuk lagi
8. Ekspor CSV terbuka dengan benar di Excel

## Masalah umum

- **Halaman 404 setelah login**: periksa letak dan nama folder (huruf kecil, tanda kurung `(user)` dan `[slug]` ditulis persis)
- **Dialihkan ke admin saat ingin masuk sebagai anak**: sesi admin masih aktif; pakai jendela Incognito atau tekan Keluar
- **Error `JWT_SECRET`**: isi minimal 32 karakter di `.env`, lalu mulai ulang `npm run dev`
- **Setelah mengubah `schema.prisma`**: jalankan `npx prisma db push`
