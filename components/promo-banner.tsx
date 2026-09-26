"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

const PROMO_DURATION = 7 * 24 * 60 * 60 * 1000;

export function PromoBanner() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const registeredAt = useStore((state) => state.registeredAt);
  const dismissed = useStore((state) => state.promoBannerDismissed);
  const dismissPromoBanner = useStore((state) => state.dismissPromoBanner);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const isActive = now > 0 && registeredAt !== null && now - new Date(registeredAt).getTime() < PROMO_DURATION;

  if (!isAuthenticated || !isActive || dismissed) return null;

  return (
    <div className="flex w-full items-center justify-between gap-4 bg-orange-500 px-4 py-2 text-center text-sm font-medium text-white sm:px-8 lg:px-14">
      <p className="flex-1">Tenés 20% OFF en tu primera compra.</p>
      <div className="flex items-center gap-3">
        <Link href="/promociones" className="rounded-md bg-white px-4 py-2 font-semibold text-[#17221c] hover:bg-orange-50">Reclamar oferta</Link>
        <Button type="button" variant="ghost" size="icon-sm" onPress={dismissPromoBanner} className="rounded-md p-2 text-white hover:bg-orange-600" aria-label="Cerrar oferta"><X className="size-4" /></Button>
      </div>
    </div>
  );
}