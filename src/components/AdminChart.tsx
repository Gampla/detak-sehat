"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AdminChart({ data }: { data: { nama: string; selesai: number }[] }) {
  return (
    <div className="h-72 w-full" role="img" aria-label="Grafik jumlah peserta yang menyelesaikan tiap aktivitas">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="nama" tick={{ fontSize: 14 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 14 }} />
          <Tooltip formatter={(v) => [`${v} peserta`, "Selesai"]} />
          <Bar dataKey="selesai" fill="#FF5C7C" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
