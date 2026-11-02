// Menampilkan teks materi: sub judul (###), daftar (-), tabel (|), dan paragraf.
export default function Rich({ text }: { text: string }) {
  const lines = text.split("\n").map((l) => l.trimEnd());
  const out: React.ReactNode[] = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (!l.trim()) continue;
    if (l.startsWith("### ")) {
      out.push(<h3 key={i} className="mt-5 text-xl font-bold">{l.slice(4)}</h3>);
    } else if (l.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) { rows.push(lines[i].split("|").slice(1, -1).map((c) => c.trim())); i++; }
      i--;
      out.push(
        <div key={i} className="mt-3 overflow-x-auto rounded-2xl bg-white">
          <table className="w-full min-w-[32rem] text-base">
            <thead><tr>{rows[0].map((c, k) => <th key={k} className="bg-langit px-3 py-2 text-left font-display">{c}</th>)}</tr></thead>
            <tbody>{rows.slice(1).map((r, a) => <tr key={a} className="border-t border-langit-soft">{r.map((c, k) => <td key={k} className="px-3 py-2">{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    } else if (l.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) { items.push(lines[i].slice(2)); i++; }
      i--;
      out.push(<ul key={i} className="mt-2 space-y-1">{items.map((t, k) => <li key={k} className="rounded-xl bg-white/70 px-3 py-1.5">{t}</li>)}</ul>);
    } else {
      out.push(<p key={i} className="mt-3 max-w-prose leading-relaxed">{l}</p>);
    }
  }
  return <>{out.map((n, idx) => <div key={idx} className="reveal" style={{ animationDelay: `${idx * 90}ms` }}>{n}</div>)}</>;
}
