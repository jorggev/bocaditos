import { ArrowRightIcon } from "lucide-react";
import { MarqueeEffect } from "@/components/marquee-effect";
import { LinkButton } from "@/components/ui/button";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";

const snackImages = [
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=700&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558788353-f76d92427f16?q=80&w=700&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=700&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=700&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=700&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=700&auto=format&fit=crop",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff8f0] text-[#17221c]">
      <section className="py-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 lg:grid-cols-2 lg:px-12">
          <header className="relative z-10 mx-auto mb-8 max-w-xl text-center lg:mb-10 lg:text-left">
            <span className="inline-flex items-center gap-1 rounded-md border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
              Saciá tus antojos diarios
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </span>
            <h1 className="my-5 text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">Te salvamos el hambre entre cada comida.</h1>
            <p className="mb-8 text-balance text-lg leading-8 text-[#17221c]/65">Bocaditos deliciosos para todos los gustos y momentos del día: post gym, entre comidas o cuando tengas hambre.</p>
            <LinkButton href="/productos" size="lg" className="rounded-md bg-[#17221c] px-6 text-white hover:bg-[#26382c]">Ver menú</LinkButton>
          </header>

          <div className="relative grid h-96 grid-cols-2 gap-3 overflow-hidden mask-t-from-80% mask-r-from-10% mask-b-from-80% mask-l-from-10% lg:h-[37.5rem] lg:mask-r-from-70% lg:mask-l-from-70%">
            {[false, true].map((reverse, columnIndex) => (
              <MarqueeEffect key={String(reverse)} gap={12} direction="vertical" reverse={reverse} speed={30} speedOnHover={1}>
                {snackImages.slice(columnIndex * 3, columnIndex * 3 + 3).map((image) => (
                  <figure key={image} className="relative aspect-square w-full overflow-hidden rounded-md bg-orange-100">
                    <ImageWithSkeleton src={image} alt="Perro disfrutando un snack Wuff" containerClassName="absolute inset-0" />
                  </figure>
                ))}
              </MarqueeEffect>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}