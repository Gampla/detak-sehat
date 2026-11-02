"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import AuthShell from "@/components/AuthShell";
import { loginSchema } from "@/lib/schemas";

type Form = { email: string; password: string };

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: Form) {
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error ?? "Ups, ada masalah. Coba lagi ya!");
    toast.success("Yeay, berhasil masuk! 🎉");
    router.push(data.redirectTo); // admin ke /admin, user ke /dashboard
    router.refresh();
  }

  return (
    <AuthShell title="Masuk dulu, yuk!" hint="Si Detak kangen! Masukkan emailmu untuk lanjut belajar.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="mb-1 block font-bold">Email</label>
          <input id="email" type="email" autoComplete="email" placeholder="budi@email.com" className="input" {...register("email")} />
          {errors.email && <p className="mt-1 font-semibold text-jantung-dark">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block font-bold">Kata sandi</label>
          <input id="password" type="password" autoComplete="current-password" className="input" {...register("password")} />
          {errors.password && <p className="mt-1 font-semibold text-jantung-dark">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-merah w-full">{isSubmitting ? "Sebentar ya..." : "Masuk"}</button>
      </form>
      <p className="mt-5 text-center">Belum punya akun? <Link href="/daftar" className="font-extrabold text-jantung-dark underline">Daftar di sini</Link></p>
    </AuthShell>
  );
}
