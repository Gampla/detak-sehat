// Validasi input (dipakai di server, bisa juga dipakai form di browser). Pesan error ramah anak.
import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Namamu kok pendek sekali? Isi minimal 2 huruf ya 😊").max(60, "Namanya terlalu panjang, maksimal 60 huruf ya"),
    email: z.string().trim().toLowerCase().email("Alamat email-nya belum benar. Contoh: budi@email.com 📧"),
    password: z
      .string()
      .min(8, "Kata sandi minimal 8 karakter ya 🔑")
      .regex(/[A-Za-z]/, "Tambahkan minimal 1 huruf ya")
      .regex(/[0-9]/, "Tambahkan minimal 1 angka ya"),
    confirmPassword: z.string(),
    age: z.coerce.number().int().min(5, "Usia minimal 5 tahun").max(18, "Usia maksimal 18 tahun").optional().or(z.literal("").transform(() => undefined)),
    school: z.string().trim().max(100, "Nama sekolah terlalu panjang").optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Kata sandinya belum sama. Coba ketik lagi ya 🙂",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Alamat email-nya belum benar 📧"),
  password: z.string().min(1, "Kata sandi jangan dikosongkan ya 🔑"),
});
