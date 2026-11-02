// Helper tampilan: durasi, tanggal, dan pesan motivasi sesuai skor.
export function formatDuration(sec?: number | null) {
  if (sec == null) return "-";
  const m = Math.floor(sec / 60), s = sec % 60;
  return m ? `${m} menit ${s} detik` : `${s} detik`;
}

export function formatDate(d?: Date | null) {
  if (!d) return "-";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(d);
}

export function motivation(score: number) {
  if (score >= 90) return { e: "🏆", t: "Luar biasa! Kamu jagoan jantung sehat!" };
  if (score >= 70) return { e: "🎉", t: "Hebat! Kamu sudah paham banyak hal!" };
  if (score >= 50) return { e: "💪", t: "Bagus! Baca materinya lagi, nilaimu pasti naik!" };
  return { e: "🌱", t: "Jangan menyerah! Yuk baca materi lagi dan coba lagi." };
}

export const GOOD_SCORE = 70; // skor minimal untuk konfeti
