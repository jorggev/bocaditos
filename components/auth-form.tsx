"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import { useStore } from "@/lib/store";

const formSchema = z.object({
  name: z.string().optional(),
  email: z.email("Ingresá un email válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

type FormValues = z.infer<typeof formSchema>;
type AuthFormProps = { mode: "login" | "register" };

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="size-5">
      <path fill="#FFC107" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z" />
      <path fill="#FF3D00" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z" />
      <path fill="#4CAF50" d="M12.6 27.7a12 12 0 0 1 0-7.4V15H5.8a20 20 0 0 0 0 18l6.8-5.3Z" />
      <path fill="#1976D2" d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8A19.4 19.4 0 0 0 24 4 20 20 0 0 0 5.8 15l6.8 5.3c1.6-4.8 6.1-8.4 11.4-8.4Z" />
    </svg>
  );
}

function displayNameFromEmail(email: string) {
  return email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === "register";
  const router = useRouter();
  const login = useStore((state) => state.login);
  const register = useStore((state) => state.register);
  const showFeedback = useStore((state) => state.showFeedback);
  const [isPending, setIsPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const submit = async (values: FormValues) => {
    if (isPending) return;
    if (isRegister && (values.name?.trim().length ?? 0) < 2) {
      form.setError("name", { type: "manual", message: "Ingresá tu nombre." });
      return;
    }

    setIsPending(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 350));
      if (isRegister) {
        const name = values.name!.trim();
        register(name);
        showFeedback({ type: "success", title: "Cuenta creada", description: `Bienvenido a Wuff, ${name}.`, autoDismiss: 4000 });
      } else {
        const name = displayNameFromEmail(values.email);
        login(name);
        showFeedback({ type: "success", title: "Sesión iniciada", description: `Bienvenido, ${name}.`, autoDismiss: 4000 });
      }
      router.push("/productos");
    } catch {
      showFeedback({ type: "error", title: isRegister ? "No se pudo crear la cuenta" : "No se pudo iniciar sesión", description: "Revisá los datos e intentá nuevamente." });
      setIsPending(false);
    }
  };

  const continueWithGoogle = async () => {
    setGooglePending(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    showFeedback({ type: "info", title: "Google todavía no está conectado", description: "El acceso social estará disponible cuando configuremos OAuth." });
    setGooglePending(false);
  };

  const errors = form.formState.errors;

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[#142019] px-4 py-12 text-[#17221c] sm:px-6">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551717743-49959800b1f6?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" aria-hidden="true" />
      <div className="absolute inset-0 bg-[#101a14]/55" aria-hidden="true" />
      <section className="relative z-10 w-full max-w-md rounded-md border border-white/60 bg-white/95 p-6 shadow-2xl backdrop-blur-sm sm:p-9">
        <header className="mb-7 text-center">
          <Link href="/" className="mx-auto mb-5 flex size-11 items-center justify-center rounded-md bg-[#eaf4ef] text-xl font-black text-[#167a63]" aria-label="Wuff, ir al inicio">w.</Link>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#167a63]">Wuff · bocaditos para tu mejor amigo</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{isRegister ? "Creá tu cuenta" : "Ingresá a tu cuenta"}</h1>
          <p className="mt-2 text-sm text-[#17221c]/60">{isRegister ? "Guardá tus datos y disfrutá beneficios para clientes." : "Nos alegra tenerte de vuelta."}</p>
        </header>

        <Button type="button" variant="outline" onPress={continueWithGoogle} isDisabled={googlePending || isPending} className="h-11 w-full gap-3 rounded-md border-[#17221c]/15 bg-white font-semibold text-[#17221c] hover:bg-[#f8faf8]">
          {googlePending ? <span className="size-4 animate-spin rounded-full border-2 border-[#167a63] border-t-transparent" aria-hidden="true" /> : <GoogleMark />}
          {googlePending ? "Conectando..." : "Continuar con Google"}
        </Button>

        <div className="my-5 flex items-center gap-3" aria-hidden="true"><span className="h-px flex-1 bg-[#17221c]/10" /><span className="text-xs text-[#17221c]/45">o con tu email</span><span className="h-px flex-1 bg-[#17221c]/10" /></div>

        <form onSubmit={form.handleSubmit(submit)} className="space-y-4" noValidate>
          {isRegister && <div><label htmlFor="name" className="mb-1.5 block text-sm font-semibold">Nombre</label><input id="name" autoComplete="name" {...form.register("name")} className="h-11 w-full rounded-md border border-[#17221c]/15 bg-white px-3 text-sm outline-none transition focus:border-[#167a63] focus:ring-2 focus:ring-[#167a63]/15" placeholder="Tu nombre" aria-invalid={Boolean(errors.name)} />{errors.name && <p className="mt-1 text-xs text-red-700">{errors.name.message}</p>}</div>}
          <div><label htmlFor="email" className="mb-1.5 block text-sm font-semibold">Email</label><input id="email" type="email" autoComplete="email" {...form.register("email")} className="h-11 w-full rounded-md border border-[#17221c]/15 bg-white px-3 text-sm outline-none transition focus:border-[#167a63] focus:ring-2 focus:ring-[#167a63]/15" placeholder="nombre@correo.com" aria-invalid={Boolean(errors.email)} />{errors.email && <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>}</div>
          <div><div className="mb-1.5 flex items-center justify-between"><label htmlFor="password" className="block text-sm font-semibold">Contraseña</label>{!isRegister && <Link href="/recuperar" className="text-xs font-medium text-[#167a63] hover:underline">¿La olvidaste?</Link>}</div><input id="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} {...form.register("password")} className="h-11 w-full rounded-md border border-[#17221c]/15 bg-white px-3 text-sm outline-none transition focus:border-[#167a63] focus:ring-2 focus:ring-[#167a63]/15" placeholder="Al menos 8 caracteres" aria-invalid={Boolean(errors.password)} />{errors.password && <p className="mt-1 text-xs text-red-700">{errors.password.message}</p>}</div>
          {isPending ? <ButtonLoading label={isRegister ? "Creando cuenta..." : "Ingresando..."} className="h-11 w-full rounded-md bg-[#17221c] font-semibold text-white" /> : <Button type="submit" className="h-11 w-full rounded-md bg-[#17221c] font-semibold text-white hover:bg-[#26382c]">{isRegister ? "Crear cuenta" : "Iniciar sesión"}</Button>}
        </form>

        <p className="mt-6 text-center text-sm text-[#17221c]/60">{isRegister ? "¿Ya tenés cuenta?" : "¿Todavía no tenés cuenta?"}{" "}<Link href={isRegister ? "/login" : "/registro"} className="font-semibold text-[#167a63] hover:underline">{isRegister ? "Iniciá sesión" : "Crear cuenta"}</Link></p>
      </section>
    </main>
  );
}
