"use client";
import { motion, useReducedMotion } from "framer-motion";

/** Maskot "Si Detak": jantung lucu yang berdetak. `size` dalam piksel. */
export default function Mascot({ size = 220 }: { size?: number }) {
  const diam = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 200 190" width={size} height={size * 0.95} role="img" aria-label="Si Detak, maskot jantung"
      animate={diam ? undefined : { scale: [1, 1.1, 1, 1.06, 1] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M100 178C40 128 8 98 8 58 8 30 30 10 56 10c19 0 35 10 44 26C109 20 125 10 144 10c26 0 48 20 48 48 0 40-32 70-92 120z" fill="#FF5C7C" />
      <path d="M40 40c6-10 18-14 28-10" stroke="#fff" strokeOpacity=".6" strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="72" cy="78" r="11" fill="#3A2D4F" /><circle cx="128" cy="78" r="11" fill="#3A2D4F" />
      <circle cx="76" cy="74" r="4" fill="#fff" /><circle cx="132" cy="74" r="4" fill="#fff" />
      <circle cx="52" cy="102" r="10" fill="#FFB3C4" /><circle cx="148" cy="102" r="10" fill="#FFB3C4" />
      <path d="M84 104c8 12 24 12 32 0" stroke="#3A2D4F" strokeWidth="6" strokeLinecap="round" fill="none" />
    </motion.svg>
  );
}
