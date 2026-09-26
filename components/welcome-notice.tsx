"use client";

import { useEffect } from "react";
import { Check, X } from "lucide-react";
import { useStore } from "@/lib/store";

export function WelcomeNotice() {
  const name = useStore((state) => state.welcomeName);
  const clearWelcome = useStore((state) => state.clearWelcome);

  useEffect(() => {
    if (!name) return;
    const timer = window.setTimeout(clearWelcome, 5000);
    return () => window.clearTimeout(timer);
  }, [name, clearWelcome]);

  if (!name) return null;

  return (
    <div className="fixed left-1/2 top-24 z-[60] w-[min(92vw,28rem)] -translate-x-1/2 rounded-md border border-[#17221c]/10 bg-white p-4 text-[#17221c] shadow-xl" role="dialog" aria-label="Bienvenida">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600"><Check className="size-5" /></span>
        <p className="flex-1 font-semibold">¡Bienvenido, {name}!</p>
        <button type="button" onClick={clearWelcome} className="rounded-md p-2 text-[#17221c]/55 hover:bg-[#17221c]/5" aria-label="Cerrar mensaje"><X className="size-4" /></button>
      </div>
    </div>
  );
}