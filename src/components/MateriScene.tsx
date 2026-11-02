"use client";
import { motion, useReducedMotion } from "framer-motion";

// Ilustrasi bergerak untuk tiap bagian materi (dibuat dari emoji + bentuk, bukan foto).
const SCENES = [
  { label: "Jantung dan alat ukur tekanan darah", bg: "bg-langit", center: "🫀", items: ["🩺", "📈", "💧", "🩸"] },
  { label: "Faktor risiko hipertensi", bg: "bg-mentari", center: "⚠️", items: ["🚬", "🍟", "🛋️", "😰", "⚖️", "🧂"] },
  { label: "Gejala hipertensi", bg: "bg-jantung-soft", center: "🤕", items: ["😵‍💫", "👂", "😮‍💨", "💤", "🥱"] },
  { label: "Komplikasi hipertensi", bg: "bg-jantung", center: "🏥", items: ["🧠", "🫀", "🚑", "⚠️"] },
  { label: "Pencegahan dengan CERDIK", bg: "bg-mint", center: "🛡️", items: ["🩺", "🚭", "🏃", "🥗", "😴", "🧘"] },
  { label: "Gaya hidup sehat", bg: "bg-langit", center: "🏃", items: ["🥦", "🍎", "💧", "🏊", "🚴", "🌙"] },
];

export default function MateriScene({ index }: { index: number }) {
  const diam = useReducedMotion();
  const sc = SCENES[index % SCENES.length];
  return (
    <div role="img" aria-label={`Ilustrasi: ${sc.label}`} className={`${sc.bg} relative h-56 overflow-hidden md:h-72`}>
      {/* lingkaran dekorasi yang bernapas pelan */}
      {[["-left-10 -top-10 h-40 w-40", 0], ["-right-8 bottom-0 h-48 w-48", 1.2], ["left-1/3 -bottom-16 h-36 w-36", 2.1]].map(([cls, d], i) => (
        <motion.div key={i} className={`absolute ${cls} rounded-full bg-white/30`} animate={diam ? undefined : { scale: [1, 1.15, 1] }} transition={{ duration: 5, repeat: Infinity, delay: d as number }} />
      ))}
      <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl md:text-9xl" animate={diam ? undefined : { scale: [1, 1.12, 1, 1.07, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
        {sc.center}
      </motion.div>
      {sc.items.map((e, i) => {
        const a = (i / sc.items.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <motion.span key={i} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-3xl shadow-md md:text-4xl"
            style={{ left: `${50 + 40 * Math.cos(a)}%`, top: `${50 + 36 * Math.sin(a)}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={diam ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, y: [0, -10, 0], rotate: [-6, 6, -6] }}
            transition={{ opacity: { delay: i * 0.12 }, scale: { delay: i * 0.12, type: "spring" }, y: { duration: 3 + i * 0.4, repeat: Infinity }, rotate: { duration: 4 + i * 0.3, repeat: Infinity } }}>
            {e}
          </motion.span>
        );
      })}
    </div>
  );
}
