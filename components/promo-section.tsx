"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };
const PROMO_DURATION = 7 * 24 * 60 * 60 * 1000;
const initialTime: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export function PromoSection() {
  const registeredAt = useStore((state) => state.registeredAt);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!registeredAt) {
        setTimeLeft(initialTime);
        setIsReady(true);
        return;
      }
      const difference = new Date(registeredAt).getTime() + PROMO_DURATION - Date.now();
      if (difference <= 0) {
        setTimeLeft(initialTime);
        setIsReady(true);
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
      setIsReady(true);
    };
    calculateTimeLeft();
    const timer = window.setInterval(calculateTimeLeft, 1000);
    return () => window.clearInterval(timer);
  }, [registeredAt]);

  const formatNumber = (value: number) => String(value).padStart(2, "0");
  const units = [["Días", timeLeft.days], ["Horas", timeLeft.hours], ["Min", timeLeft.minutes], ["Seg", timeLeft.seconds]] as const;

  return (
    <section className="min-h-[65vh] bg-[#fff8f0] px-4 py-12 text-[#17221c] lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Promoción de bienvenida</p><h1 className="mt-3 text-5xl font-bold">20% OFF en tu primera compra</h1><p className="mt-4 text-lg text-[#17221c]/65">Tu beneficio está disponible durante los primeros 7 días desde tu registro.</p></div>
          <div className="flex flex-wrap gap-3">{isReady ? units.map(([label, value]) => <div key={label} className="flex size-20 flex-col items-center justify-center rounded-md bg-white shadow-sm"><span className="text-3xl font-bold">{formatNumber(value)}</span><span className="text-xs text-[#17221c]/55">{label}</span></div>) : units.map(([label]) => <Skeleton key={label} className="size-20" />)}</div>
          <Link href="/productos" className="inline-block rounded-md bg-[#17221c] px-5 py-3 font-semibold text-white hover:bg-[#26382c]">Usar en el menú</Link>
        </div>
        <div className="hidden h-[26rem] grid-cols-2 gap-4 lg:grid"><ImageWithSkeleton src="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=700&auto=format&fit=crop" alt="Bocaditos Wuff" containerClassName="mt-10 h-64 w-full rotate-3 rounded-md" /><ImageWithSkeleton src="https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?q=80&w=700&auto=format&fit=crop" alt="Premios Wuff" containerClassName="h-64 w-full -rotate-3 rounded-md" /></div>
      </div>
    </section>
  );
}