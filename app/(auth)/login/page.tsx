"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const login = useStore((state) => state.login);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const emailName = String(formData.get("email")).split("@")[0];
    const displayName = emailName.replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
    login(displayName);
    router.push("/productos");
  };

  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-[#fff8f0] px-4 py-16 text-[#17221c]">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-md border border-[#17221c]/10 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Bienvenido a Wuff</p>
        <h1 className="mt-2 text-3xl font-bold">Iniciar sesión</h1>
        <p className="mt-2 text-sm text-[#17221c]/60">Esta demo inicia la sesión al enviar el formulario.</p>
        <label className="mt-6 block text-sm font-semibold" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required className="mt-2 h-11 w-full rounded-md border border-[#17221c]/20 px-3 outline-none focus:border-orange-500" placeholder="hola@ejemplo.com" />
        <label className="mt-4 block text-sm font-semibold" htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" required className="mt-2 h-11 w-full rounded-md border border-[#17221c]/20 px-3 outline-none focus:border-orange-500" placeholder="••••••••" />
        <button type="submit" className="mt-6 h-11 w-full rounded-md bg-[#17221c] font-semibold text-white hover:bg-[#26382c]">Iniciar sesión</button>
      </form>
    </main>
  );
}