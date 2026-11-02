"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Q = { id: string; text: string; options: Record<"A" | "B" | "C" | "D", string> };

export default function TestRunner({ questionCount }: { questionCount: number }) {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "loading" | "run" | "sending">("intro");
  const [attemptId, setAttemptId] = useState("");
  const [qs, setQs] = useState<Q[]>([]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  async function start() {
    setPhase("loading");
    const res = await fetch("/api/user/tes/start", { method: "POST" });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error ?? "Ups, tes belum bisa dimulai."); return setPhase("intro"); }
    setAttemptId(data.attemptId); setQs(data.questions); setPhase("run");
  }

  async function finish() {
    setPhase("sending");
    const res = await fetch(`/api/user/tes/${attemptId}/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }) });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error ?? "Jawabanmu belum terkirim. Coba lagi ya!"); return setPhase("run"); }
    router.push(data.redirectTo);
  }

  if (phase === "intro" || phase === "loading") {
    return (
      <div className="rounded-besar bg-white p-8 text-center">
        <div className="text-6xl" aria-hidden>✏️</div>
        <h1 className="mt-2 text-3xl">Siap mengerjakan tes?</h1>
        <p className="mx-auto mt-3 max-w-md">Ada {questionCount} soal pilihan ganda dari materi yang sudah kamu baca. Waktu mulai dicatat saat kamu menekan tombol di bawah. Tenang saja, tidak perlu buru-buru!</p>
        <button onClick={start} disabled={phase === "loading"} className="btn-merah mt-6">{phase === "loading" ? "Menyiapkan soal..." : "Mulai tes"}</button>
      </div>
    );
  }

  const q = qs[i];
  const last = i === qs.length - 1;
  const percent = Math.round((i / qs.length) * 100);
  return (
    <div className="space-y-5">
      <div role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Kemajuan tes">
        <p className="mb-1 font-bold">Soal {i + 1} dari {qs.length}</p>
        <div className="h-5 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-mint transition-all" style={{ width: `${percent}%` }} /></div>
      </div>
      <section className="rounded-besar bg-mentari-soft p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl">{q.text}</h2>
        <div className="mt-5 space-y-3" role="radiogroup" aria-label="Pilihan jawaban">
          {(["A", "B", "C", "D"] as const).map((k) => {
            const on = answers[q.id] === k;
            return (
              <button key={k} role="radio" aria-checked={on} onClick={() => setAnswers({ ...answers, [q.id]: k })}
                className={`flex min-h-[3.5rem] w-full items-center gap-3 rounded-2xl border-4 px-4 py-3 text-left font-bold transition-transform hover:scale-[1.02] ${on ? "border-jantung bg-jantung-soft" : "border-white bg-white"}`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display ${on ? "bg-jantung text-white" : "bg-langit-soft"}`}>{k}</span>
                {q.options[k]}
              </button>
            );
          })}
        </div>
      </section>
      <div className="flex justify-end">
        {last
          ? <button onClick={finish} disabled={!answers[q.id] || phase === "sending"} className="btn-merah">{phase === "sending" ? "Mengirim..." : "Selesai 🎉"}</button>
          : <button onClick={() => setI(i + 1)} disabled={!answers[q.id]} className="btn-merah">Lanjut</button>}
      </div>
    </div>
  );
}
