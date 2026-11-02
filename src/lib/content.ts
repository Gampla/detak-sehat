// Memecah isi materi menjadi bagian-bagian. Format: setiap bagian diawali baris "## Judul Bagian".
export function parseSections(content: string) {
  return content
    .split(/^## /m)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [title, ...body] = s.split("\n");
      return { title: title.trim(), body: body.join("\n").trim() };
    });
}

// Warna kartu bergantian agar tampil ceria
export const CARD_COLORS = ["bg-jantung-soft", "bg-mint-soft", "bg-mentari-soft", "bg-white"];
