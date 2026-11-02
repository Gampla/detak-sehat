"use client";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

// Konfeti sekali jalan untuk skor bagus (dilewati kalau perangkat meminta animasi dikurangi)
export default function ConfettiBurst() {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setSize({ w: window.innerWidth, h: window.innerHeight });
  }, []);
  if (!size) return null;
  return <Confetti width={size.w} height={size.h} recycle={false} numberOfPieces={350} style={{ position: "fixed", pointerEvents: "none" }} />;
}
