"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Mascot from "@/components/Mascot";

// Isi bersumber dari materi Postest Hari 1 (Kemenkes RI, PERHI, Lukitaningtyas & Cahyono, 2023)
const PENYEBAB = [
  { e: "🧂", t: "Garam berlebihan", d: "Makanan kemasan, keripik, dan makanan instan" },
  { e: "🍟", t: "Makanan tinggi lemak", d: "Gorengan, daging berlemak, lemak susu" },
  { e: "🛋️", t: "Kurang aktivitas fisik", d: "Terlalu lama duduk dan jarang bergerak" },
  { e: "🚬", t: "Merokok", d: "Termasuk terpapar asap rokok" },
  { e: "😰", t: "Stres berkepanjangan", d: "Pikiran tegang yang tidak dikelola" },
  { e: "⚖️", t: "Berat badan berlebih", d: "Overweight membuat jantung bekerja ekstra" },
];
const CERDIK = [
  { k: "C", t: "Cek kesehatan rutin", d: "Ukur tekanan darah secara berkala", c: "bg-langit" },
  { k: "E", t: "Enyahkan asap rokok", d: "Jauhi rokok dan asapnya", c: "bg-jantung" },
  { k: "R", t: "Rajin aktivitas fisik", d: "Minimal 30 menit setiap hari", c: "bg-mint" },
  { k: "D", t: "Diet seimbang", d: "5 porsi buah dan sayur, batasi gula-garam-lemak", c: "bg-mentari" },
  { k: "I", t: "Istirahat cukup", d: "Remaja tidur 8 sampai 10 jam", c: "bg-langit" },
  { k: "K", t: "Kelola stres", d: "Relaksasi, hobi, dan olahraga", c: "bg-jantung" },
];

/* ---------- Animasi: alat ukur tekanan darah + aliran darah ---------- */
const CX = 110, CY = 110, R = 90;
const theta = (v: number) => Math.PI + ((v - 90) / 110) * Math.PI; // 90 s/d 200 mmHg
const pt = (v: number, r = R) => `${CX + r * Math.cos(theta(v))} ${CY + r * Math.sin(theta(v))}`;
const arc = (a: number, b: number) => `M ${pt(a)} A ${R} ${R} 0 0 1 ${pt(b)}`;

function Animasi() {
  const [tinggi, setTinggi] = useState(true);
  const diam = useReducedMotion();
  const sis = tinggi ? 152 : 116, dia = tinggi ? 96 : 76;
  const deg = ((sis - 90) / 110) * 180 - 90;
  const items = tinggi ? PENYEBAB.map((p) => ({ e: p.e, t: p.t })) : CERDIK.map((p) => ({ e: p.k, t: p.t }));

  return (
    <div className="rounded-besar bg-white p-5 md:p-8">
      <div role="group" aria-label="Pilih animasi" className="mx-auto flex w-fit gap-2 rounded-full bg-langit-soft p-1.5">
        {[{ v: true, l: "Penyebab" }, { v: false, l: "Pencegahan" }].map((o) => (
          <button key={o.l} aria-pressed={tinggi === o.v} onClick={() => setTinggi(o.v)}
            className={`min-h-[3rem] rounded-full px-6 font-display text-lg font-bold transition-colors ${tinggi === o.v ? "bg-jantung text-white" : "text-tinta"}`}>{o.l}</button>
        ))}
      </div>

      <div className="mt-6 grid items-center gap-6 md:grid-cols-2">
        <div>
          <svg viewBox="0 0 220 130" className="mx-auto w-full max-w-xs" role="img" aria-label={`Alat ukur tekanan darah menunjukkan ${sis} per ${dia} mmHg`}>
            <path d={arc(90, 120)} stroke="#7FE0BC" strokeWidth="16" fill="none" />
            <path d={arc(120, 140)} stroke="#FFD04D" strokeWidth="16" fill="none" />
            <path d={arc(140, 200)} stroke="#FF5C7C" strokeWidth="16" fill="none" />
            <motion.g animate={{ rotate: deg }} transition={{ type: "spring", stiffness: 60, damping: 10 }} style={{ transformOrigin: `${CX}px ${CY}px` }}>
              <line x1={CX} y1={CY} x2={CX} y2={CY - 72} stroke="#3A2D4F" strokeWidth="5" strokeLinecap="round" />
            </motion.g>
            <circle cx={CX} cy={CY} r="9" fill="#3A2D4F" />
          </svg>
          <p className="text-center font-display text-4xl font-extrabold">{sis}/{dia} <span className="text-lg font-semibold">mmHg</span></p>
          <p className="text-center font-bold">{tinggi ? "Hipertensi: 140/90 mmHg atau lebih" : "Normal: di bawah 130/85 mmHg"}</p>

          {/* Aliran darah: sempit & deras saat tinggi, lapang & tenang saat sehat */}
          <svg viewBox="0 0 400 80" className="mt-4 w-full" aria-hidden>
            <motion.rect x="0" rx="26" width="400" fill="#FFE3EA" animate={{ y: tinggi ? 22 : 8, height: tinggi ? 36 : 64 }} transition={{ duration: 0.6 }} />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.circle key={`${tinggi}-${i}`} cy="40" r="7" fill="#FF5C7C"
                initial={{ cx: -10 }} animate={diam ? { cx: 60 + i * 60 } : { cx: [-10, 410] }}
                transition={{ duration: tinggi ? 1.4 : 3.6, repeat: Infinity, ease: "linear", delay: i * (tinggi ? 0.22 : 0.6) }} />
            ))}
          </svg>
        </div>

        <div>
          <h3 className="text-2xl">{tinggi ? "Yang membuat tekanan darah naik" : "Cara menjaganya tetap normal: CERDIK"}</h3>
          <AnimatePresence mode="wait">
            <motion.ul key={String(tinggi)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mt-3 grid grid-cols-2 gap-2">
              {items.map((x) => (
                <li key={x.t} className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-base font-bold ${tinggi ? "bg-jantung-soft" : "bg-mint-soft"}`}>
                  <span className="text-2xl" aria-hidden>{x.e}</span>{x.t}
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ---------- Poster ---------- */
function Poster() {
  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-besar bg-white shadow-[0_10px_0_#6EC6F5]">
      <div className="bg-jantung p-6 text-center text-white">
        <p className="font-bold">Poster edukasi kesehatan</p>
        <h3 className="mt-1 text-4xl leading-none">Cegah Hipertensi Sejak Dini!</h3>
        <div className="mt-2 flex justify-center"><Mascot size={110} /></div>
        <p className="rounded-full bg-white px-4 py-1 font-bold text-jantung-dark">Tekanan darah 140/90 mmHg atau lebih = hipertensi</p>
      </div>
      <div className="grid grid-cols-2 gap-3 p-5">
        <div className="rounded-2xl bg-jantung-soft p-3">
          <h4 className="font-display text-lg font-bold">Waspadai</h4>
          <ul className="mt-1 space-y-1 text-base">{PENYEBAB.map((p) => <li key={p.t}>{p.e} {p.t}</li>)}</ul>
        </div>
        <div className="rounded-2xl bg-mint-soft p-3">
          <h4 className="font-display text-lg font-bold">Lakukan CERDIK</h4>
          <ul className="mt-1 space-y-1 text-base">{CERDIK.map((c) => <li key={c.k}><b>{c.k}</b> {c.t}</li>)}</ul>
        </div>
      </div>
      <p className="bg-tinta p-3 text-center text-base font-bold text-white">Sering tanpa gejala. Ukur tekanan darahmu secara rutin!</p>
    </div>
  );
}

/* ---------- Leaflet (3 panel) ---------- */
function Leaflet() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <section className="rounded-besar bg-langit-soft p-6">
        <span className="rounded-full bg-white px-3 py-1 text-base font-bold">Panel 1</span>
        <h3 className="mt-2 text-2xl">Apa itu hipertensi?</h3>
        <p className="mt-2 text-base">Tekanan darah tinggi, yaitu lebih tinggi dari batas normal. Disebut <i>silent killer</i> karena sering tidak bergejala, tetapi bisa menyebabkan stroke, penyakit jantung, dan gangguan ginjal.</p>
        <h4 className="mt-4 font-display font-bold">Klasifikasi (mmHg)</h4>
        <ul className="mt-1 space-y-1 text-base">
          {[["Optimal", "<120 dan <80", "bg-mint"], ["Normal tinggi", "130-139 / 85-89", "bg-mentari"], ["Derajat 1", "140-159 / 90-99", "bg-jantung-soft"], ["Derajat 3", "≥180 / ≥110", "bg-jantung"]].map(([a, b, c]) => <li key={a} className={`flex justify-between rounded-xl px-3 py-1 ${c}`}><b>{a}</b><span>{b}</span></li>)}
        </ul>
      </section>
      <section className="rounded-besar bg-jantung-soft p-6">
        <span className="rounded-full bg-white px-3 py-1 text-base font-bold">Panel 2</span>
        <h3 className="mt-2 text-2xl">Apa penyebabnya?</h3>
        <ul className="mt-3 space-y-2">{PENYEBAB.map((p) => <li key={p.t} className="rounded-2xl bg-white p-2 px-3 text-base"><b>{p.e} {p.t}</b><br />{p.d}</li>)}</ul>
        <p className="mt-3 text-base"><b>Tidak dapat diubah:</b> usia, jenis kelamin, genetik.</p>
      </section>
      <section className="rounded-besar bg-mint-soft p-6">
        <span className="rounded-full bg-white px-3 py-1 text-base font-bold">Panel 3</span>
        <h3 className="mt-2 text-2xl">Cara mencegah: CERDIK</h3>
        <ul className="mt-3 space-y-2">{CERDIK.map((c) => <li key={c.k} className="flex items-center gap-3 rounded-2xl bg-white p-2"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-xl font-bold ${c.c}`}>{c.k}</span><span className="text-base"><b>{c.t}</b><br />{c.d}</span></li>)}</ul>
        <p className="mt-3 rounded-2xl bg-mentari-soft p-3 text-base"><b>Batas harian:</b> gula 4 sendok makan, garam 1 sendok teh, minyak 5 sendok makan.</p>
      </section>
    </div>
  );
}

const TABS = [{ id: "animasi", l: "🎬 Animasi" }, { id: "poster", l: "🖼️ Poster" }, { id: "leaflet", l: "📄 Leaflet" }] as const;

export default function Edukasi() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("animasi");
  return (
    <div>
      <div role="tablist" aria-label="Media edukasi" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={`min-h-[3rem] rounded-full px-5 font-display text-lg font-bold transition-transform hover:-translate-y-0.5 ${tab === t.id ? "bg-tinta text-white" : "bg-white"}`}>{t.l}</button>
        ))}
      </div>
      <div role="tabpanel" className="mt-5">
        {tab === "animasi" && <Animasi />}
        {tab === "poster" && <Poster />}
        {tab === "leaflet" && <Leaflet />}
      </div>
    </div>
  );
}
