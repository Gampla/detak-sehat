"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import AuthShell from "@/components/AuthShell";
import { registerSchema } from "@/lib/schemas";

type Form = { name: string; email: string; password: string; confirmPassword: string; age?: string; school?: string };

const fields: { name: keyof Form; label: string; type: string; placeholder?: string; auto?: string }[] = [
  { name: "name", label: "Nama lengkap", type: "text", placeholder: "Budi Santoso", auto: "name" },
  { name: "email", label: "Email", type: "email", placeholder: "budi@email.com", auto: "email" },
  { name: "password", label: "Kata sandi (8 karakter+, ada huruf & angka)", type: "password", auto: "new-password" },
  { name: "confirmPassword", label: "Ulangi kata sandi", type: "password", auto: "new-password" },
  { name: "age", label: "Usia (boleh dikosongkan)", type: "number", placeholder: "10" },
  { name: "school", label: "Sekolah (boleh dikosongkan)", type: "text", placeholder: "SD Negeri 1" },
];

export default function DaftarPage() {
  const router = useRouter();
  // `as never`: tipe input zod (coerce) sedikit berbeda dari tipe form; server tetap memvalidasi ulang.
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(registerSchema) as never });

  async function onSubmit(values: Form) {
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error ?? "Ups, ada masalah. Coba lagi ya!");
    toast.success("Selamat datang di DetakSehat! 🎉");
    router.push(data.redirectTo);
    router.refresh();
  }

  return (
    <AuthShell title="Ayo bergabung!" hint="Halo, teman baru! Isi data singkat ini, lalu kita mulai petualangan sehat.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-1 block font-bold">{f.label}</label>
            <input id={f.name} type={f.type} placeholder={f.placeholder} autoComplete={f.auto} className="input" {...register(f.name)} />
            {errors[f.name] && <p className="mt-1 font-semibold text-jantung-dark">{errors[f.name]?.message as string}</p>}
          </div>
        ))}
        <button type="submit" disabled={isSubmitting} className="btn-merah w-full">{isSubmitting ? "Sebentar ya..." : "Daftar sekarang"}</button>
      </form>
      <p className="mt-5 text-center">Sudah punya akun? <Link href="/login" className="font-extrabold text-jantung-dark underline">Masuk</Link></p>
    </AuthShell>
  );
}
