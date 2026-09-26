"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ChevronRight, CreditCard, MapPin, Truck } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";

const catalog = [
  { id: "pollo", title: "Bocaditos de pollo", price: 8900, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=500&auto=format&fit=crop" },
  { id: "crujiente", title: "Mix crujiente", price: 7500, image: "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?q=80&w=500&auto=format&fit=crop" },
  { id: "galletas", title: "Galletas caseras", price: 6900, image: "https://images.unsplash.com/photo-1582798358481-d199fb734b79?q=80&w=500&auto=format&fit=crop" },
  { id: "salmon", title: "Premios de salmón", price: 9900, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=500&auto=format&fit=crop" },
];

const formatPrice = (price: number) => `$${price.toLocaleString("es-AR")}`;

export default function CheckoutPage() {
  const [now, setNow] = useState(0);
  const [isPreparingPayment, setIsPreparingPayment] = useState(false);
  const items = useStore((state) => state.items);
  const registeredAt = useStore((state) => state.registeredAt);
  const showFeedback = useStore((state) => state.showFeedback);
  useEffect(() => {
    const timer = window.setTimeout(() => setNow(Date.now()), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const products = items.map((item) => ({ ...item, product: catalog.find((product) => product.id === item.id) })).filter((item) => item.product);
  const subtotal = products.reduce((total, item) => total + (item.product?.price ?? 0) * item.quantity, 0);
  const hasWelcomeDiscount = now > 0 && registeredAt !== null && now - new Date(registeredAt).getTime() < 7 * 24 * 60 * 60 * 1000;
  const discount = hasWelcomeDiscount ? Math.round(subtotal * 0.2) : 0;
  const total = subtotal - discount;

  const preparePayment = async () => {
    if (isPreparingPayment) return;
    setIsPreparingPayment(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 400));
      showFeedback({
        type: "info",
        title: "Pago todavía no disponible",
        description: "La pasarela de pago aún no está conectada. No se realizó ningún cobro.",
      });
    } catch {
      showFeedback({ type: "error", title: "No se pudo iniciar el pago", description: "Intentá nuevamente más tarde." });
    } finally {
      setIsPreparingPayment(false);
    }
  };

  const showEditNotice = () => showFeedback({
    type: "info",
    title: "Edición no disponible",
    description: "La selección de entrega y los datos de pago todavía no están conectados.",
  });

  if (products.length === 0) {
    return (
      <main className="flex min-h-[65vh] flex-col items-center justify-center bg-[#fff8f0] px-4 text-center text-[#17221c]">
        <h1 className="text-3xl font-bold">No hay productos para pagar</h1>
        <p className="mt-2 text-[#17221c]/60">Agregá tus favoritos al carrito y volvé a este paso.</p>
        <Link href="/productos" className="mt-6 rounded-md bg-[#17221c] px-5 py-3 font-semibold text-white">Ver menú</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdf9] px-4 py-10 text-[#17221c] lg:py-16">
      <div className="mx-auto max-w-7xl">
        <nav className="mx-auto mb-14 flex max-w-3xl items-center justify-between" aria-label="Progreso del checkout">
          {["Carrito", "Entrega", "Pago", "Confirmación"].map((step, index) => (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2"><span className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${index < 2 ? "bg-[#17221c] text-white" : "bg-[#17221c]/10 text-[#17221c]/50"}`}>{index < 1 ? <Check className="size-4" /> : index + 1}</span><span className="hidden text-xs font-medium sm:block">{step}</span></div>
              {index < 3 && <ChevronRight className="mx-2 size-4 flex-1 text-[#17221c]/20 sm:mx-4" />}
            </div>
          ))}
        </nav>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_25rem]">
          <div className="space-y-12">
            <section>
              <div className="mb-5 flex items-center justify-between"><h1 className="text-2xl font-bold">Detalle del pedido</h1><Link href="/productos" className="text-sm font-semibold text-orange-600 hover:text-orange-700">Seguir comprando</Link></div>
              <div className="space-y-3">{products.map(({ id, quantity, product }) => product && <article key={id} className="flex items-center gap-4 rounded-md bg-[#f7f7f5] p-3 sm:p-4"><ImageWithSkeleton src={product.image} alt={product.title} containerClassName="size-20 shrink-0 rounded-md" /><div className="min-w-0 flex-1"><h2 className="truncate font-semibold">{product.title}</h2><p className="mt-1 text-sm text-[#17221c]/55">{quantity} {quantity === 1 ? "unidad" : "unidades"}</p></div><p className="font-semibold">{formatPrice(product.price * quantity)}</p></article>)}</div>
            </section>

            <section>
              <div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-bold">Entrega</h2><Button type="button" variant="secondary" size="sm" onPress={showEditNotice}>Editar</Button></div>
              <div className="grid gap-4 md:grid-cols-2"><article className="flex gap-4 rounded-md border border-[#17221c]/10 p-5"><span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-[#17221c]/5"><MapPin className="size-5 text-[#17221c]/55" /></span><div><h3 className="font-semibold">Retiro en tienda</h3><p className="mt-2 text-sm leading-6 text-[#17221c]/60">Wuff Store<br />Coordinamos el horario luego del pago.</p></div></article><article className="flex gap-4 rounded-md border border-[#17221c]/10 p-5"><span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-[#17221c]/5"><Truck className="size-5 text-[#17221c]/55" /></span><div><h3 className="font-semibold">Envío a domicilio</h3><p className="mt-2 text-sm leading-6 text-[#17221c]/60">Entrega de 2 a 5 días hábiles<br />Costo calculado al confirmar.</p></div></article></div>
            </section>

            <section>
              <div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-bold">Método de pago</h2><Button type="button" variant="secondary" size="sm" onPress={showEditNotice}>Editar</Button></div>
              <article className="flex gap-4 rounded-md border border-[#17221c]/10 p-5"><span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-[#17221c]/5"><CreditCard className="size-5 text-[#17221c]/55" /></span><div><h3 className="font-semibold">Pago online</h3><p className="mt-2 text-sm text-[#17221c]/60">Podrás elegir el medio de pago al confirmar tu pedido.</p></div></article>
            </section>
          </div>

          <aside className="rounded-md border border-[#17221c]/10 bg-white p-6 shadow-sm lg:sticky lg:top-6"><div className="flex items-center justify-between text-2xl font-bold"><span>Total</span><span>{formatPrice(total)}</span></div><div className="mt-5 space-y-3 border-t border-[#17221c]/10 pt-5 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>{discount > 0 && <div className="flex justify-between text-orange-600"><span>Descuento de bienvenida</span><span>-{formatPrice(discount)}</span></div>}<div className="flex justify-between"><span>Entrega</span><span className="font-medium">A calcular</span></div></div>{isPreparingPayment ? <ButtonLoading label="Preparando pago..." className="mt-6 h-12 w-full rounded-md bg-[#17221c] text-white" /> : <Button type="button" onPress={preparePayment} className="mt-6 h-12 w-full rounded-md bg-[#17221c] font-semibold text-white hover:bg-[#26382c]">Pagar {formatPrice(total)}</Button>}<p className="mt-4 text-xs leading-5 text-[#17221c]/50">Al realizar el pedido aceptás nuestras políticas de privacidad, términos y condiciones.</p></aside>
        </div>
      </div>
    </main>
  );
}