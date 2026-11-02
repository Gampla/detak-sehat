"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Fakta bersumber dari materi Postest Hari 1
const FAKTA = [
  { e: "🩺", t: "Batas hipertensi", d: "Tekanan darah 140/90 mmHg atau lebih disebut hipertensi." },
  { e: "🤫", t: "Si pembunuh senyap", d: "Hipertensi sering tidak bergejala, jadi tekanan darah perlu diukur secara rutin." },
  { e: "🧂", t: "Batas garam harian", d: "Garam dibatasi kurang dari 5 gram atau sekitar 1 sendok teh per hari." },
  { e: "🏃", t: "Bergeraklah", d: "Aktivitas fisik minimal 30 menit setiap hari atau 150 menit per minggu." },
  { e: "🥦", t: "Lima porsi sehari", d: "Makan sayur dan buah 5 porsi (400 sampai 500 gram) setiap hari." },
  { e: "😴", t: "Tidur cukup", d: "Remaja dianjurkan tidur 8 sampai 10 jam setiap hari." },
];

const CX = 140, CY = 118, R = 60, MIN = 40, MAX = 200;
const th = (v: number) => Math.PI + ((v - MIN) / (MAX - MIN)) * Math.PI;
const pt = (v: number) => `${CX + R * Math.cos(th(v))} ${CY + R * Math.sin(th(v))}`;
const arc = (a: number, b: number) => `M ${pt(a)} A ${R} ${R} 0 0 1 ${pt(b)}`;

/** Tensimeter animasi: manset mengembang, jarum naik, lalu hasil 118/78 tampil sebentar. */
function Tensimeter() {
  const diam = useReducedMotion();
  const [v, setV] = useState(diam ? 118 : MIN);
  const [hasil, setHasil] = useState(!!diam);

  useEffect(() => {
    if (diam) return;
    let val = MIN, naik = true, tahan = 0;
    const id = setInterval(() => {
      if (tahan > 0) { if (--tahan === 0) { val = MIN; naik = true; setHasil(false); } return; }
      if (naik) { val += 3; if (val >= 150) naik = false; }
      else { val -= 1.5; if (val <= 118) { val = 118; tahan = 60; setHasil(true); } }
      setV(Math.round(val));
    }, 40);
    return () => clearInterval(id);
  }, [diam]);

  const deg = ((v - MIN) / (MAX - MIN)) * 180 - 90;
  const cuffH = 34 + ((v - MIN) / (MAX - MIN)) * 34;
  return (
    <svg viewBox="0 0 280 250" className="mx-auto w-full max-w-sm" role="img" aria-label="Animasi alat ukur tekanan darah (tensimeter)">
      <path d="M25 150 Q25 100 50 108" stroke="#FF5C7C" strokeWidth="5" fill="none" strokeLinecap="round" />
      <rect x="6" y={150 - (cuffH - 34) / 2} width="38" height={cuffH} rx="12" fill="#FF5C7C" />
      <rect x="50" y="10" width="190" height="232" rx="30" fill="#FFFFFF" />
      <motion.path d="M72 38 H96 L102 38 L108 24 L116 52 L122 38 H146 L152 38 L158 24 L166 52 L172 38 H208"
        stroke="#FF5C7C" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"
        animate={diam ? undefined : { pathLength: [0, 1], opacity: [1, 1, 0.2] }} transition={{ duration: 2.2, repeat: Infinity }} />
      <path d={arc(40, 120)} stroke="#7FE0BC" strokeWidth="12" fill="none" />
      <path d={arc(120, 140)} stroke="#FFD04D" strokeWidth="12" fill="none" />
      <path d={arc(140, 200)} stroke="#FF5C7C" strokeWidth="12" fill="none" />
      <g style={{ transform: `rotate(${deg}deg)`, transformOrigin: `${CX}px ${CY}px` }}>
        <line x1={CX} y1={CY} x2={CX} y2={CY - 50} stroke="#3A2D4F" strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx={CX} cy={CY} r="8" fill="#3A2D4F" />
      <rect x="72" y="158" width="136" height="64" rx="14" fill="#3A2D4F" />
      <text x={CX} y="192" textAnchor="middle" fontSize="30" fontWeight="800" fill="#fff" fontFamily="var(--font-baloo), sans-serif">{hasil ? "118/78" : v}</text>
      <text x={CX} y="211" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7FE0BC" fontFamily="var(--font-nunito), sans-serif">{hasil ? "mmHg · Normal ✔" : "Mengukur..."}</text>
    </svg>
  );
}

export default function BannerHipertensi() {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI((x) => (x + 1) % FAKTA.length), 5000); return () => clearInterval(id); }, []);
  const f = FAKTA[i];

  return (
    <section aria-label="Informasi hipertensi" className="overflow-hidden rounded-besar bg-tinta p-6 text-white md:p-10">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <p className="inline-block rounded-full bg-white/15 px-4 py-1 font-bold">Kenali tekanan darahmu</p>
          <h2 className="mt-3 text-3xl md:text-5xl">Tahukah kamu tentang hipertensi?</h2>

          <div className="mt-5 min-h-[9.5rem] rounded-besar bg-white p-5 text-tinta" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }}>
                <div className="flex items-center gap-3"><span className="text-4xl" aria-hidden>{f.e}</span><h3 className="text-2xl">{f.t}</h3></div>
                <p className="mt-2">{f.d}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-4 flex items-center gap-2" role="group" aria-label="Pilih informasi">
            {FAKTA.map((x, k) => (
              <button key={x.t} onClick={() => setI(k)} aria-label={`Informasi ${k + 1}: ${x.t}`} aria-current={k === i}
                className={`h-4 rounded-full transition-all ${k === i ? "w-10 bg-mentari" : "w-4 bg-white/40 hover:bg-white/70"}`} />
            ))}
          </div>
        </div>

        <div className="rounded-besar bg-white/10 p-4"><Tensimeter /></div>
      </div>
    </section>
  );
}
