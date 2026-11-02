import type { Config } from "tailwindcss";

// Palet DetakSehat: merah muda jantung, biru langit, kuning, hijau mint, ungu tua lembut untuk teks
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        jantung: { DEFAULT: "#FF5C7C", soft: "#FFE3EA", dark: "#D93A5E" },
        langit: { DEFAULT: "#6EC6F5", soft: "#E3F4FF" },
        mentari: { DEFAULT: "#FFD04D", soft: "#FFF3C9" },
        mint: { DEFAULT: "#7FE0BC", soft: "#DDF8EC" },
        tinta: "#3A2D4F",
      },
      fontFamily: {
        display: ["var(--font-baloo)", "system-ui", "sans-serif"],
        body: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      borderRadius: { besar: "2rem" },
    },
  },
  plugins: [],
};
export default config;
