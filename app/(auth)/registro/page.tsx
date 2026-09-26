"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function RegistroPage() {
  const router = useRouter();
  const register = useStore((state) => state.register);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    register(String(formData.get("name")));
    router.push("/productos");
  };

  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-[#fff8f0] px-4 py-16 text-[#17221c]">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-md border border-[#17221c]/10 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Unite a Wuff</p>
        <h1 className="mt-2 text-3xl font-bold">Crear cuenta</h1>
        <p className="mt-2 text-sm text-[#17221c]/60">Registrate y obtené 20% OFF en tu primera compra.</p>
        <label className="mt-6 block text-sm font-semibold" htmlFor="register-name">Nombre</label>
        <input id="register-name" name="name" type="text" required autoComplete="name" className="mt-2 h-11 w-full rounded-md border border-[#17221c]/20 px-3 outline-none focus:border-orange-500" placeholder="Tu nombre" />
        <label className="mt-4 block text-sm font-semibold" htmlFor="register-email">Email</label>
        <input id="register-email" name="email" type="email" required className="mt-2 h-11 w-full rounded-md border border-[#17221c]/20 px-3 outline-none focus:border-orange-500" placeholder="hola@ejemplo.com" />
        <label className="mt-4 block text-sm font-semibold" htmlFor="register-password">Contraseña</label>
        <input id="register-password" name="password" type="password" required className="mt-2 h-11 w-full rounded-md border border-[#17221c]/20 px-3 outline-none focus:border-orange-500" placeholder="••••••••" />
        <button type="submit" className="mt-6 h-11 w-full rounded-md bg-[#17221c] font-semibold text-white hover:bg-[#26382c]">Crear cuenta</button>
      </form>
    </main>
  );
}