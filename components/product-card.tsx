"use client";

import { useState } from "react";
import { ProductQuickview, type FoodProduct } from "@/components/product-quickview";
import { useStore } from "@/lib/store";
import { RippleEffect } from "@/components/ripple-effect";
import { ButtonLoading } from "@/components/ui/button-loading";
import { Button } from "@/components/ui/button";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";

export function ProductCard({ product }: { product: FoodProduct }) {
  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const setItemQuantity = useStore((state) => state.setItemQuantity);
  const showFeedback = useStore((state) => state.showFeedback);

  const addOneToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);
    const current = useStore.getState().items.find((item) => item.id === product.id)?.quantity ?? 0;
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 200));
      setItemQuantity(product.id, current + 1);
      showFeedback({ type: "success", title: "Agregado al carrito", description: `${product.title} ahora tiene ${current + 1} unidades.` });
    } catch {
      showFeedback({ type: "error", title: "No se pudo agregar el producto", description: "Intentá nuevamente." });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <RippleEffect className="w-full rounded-md">
      <article className="group w-full cursor-pointer" data-clickable onClick={(event) => { if (event.target instanceof Element && event.target.closest("button")) return; setOpen(true); }} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) setOpen(true); }} role="button" tabIndex={0}>
        <figure className="relative aspect-square w-full overflow-hidden rounded-md bg-orange-100">
          <ImageWithSkeleton src={product.image} alt={product.title} containerClassName="absolute inset-0" imageClassName="transition-transform group-hover:scale-105" />
        </figure>
        <div className="mt-3 space-y-3">
          <div className="flex items-start justify-between gap-3"><p className="font-semibold">{product.title}</p><p className="text-[#17221c]/60">{product.price}</p></div>
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" onPress={() => setOpen(true)} className="h-10 rounded-md border-[#17221c]/20 bg-white px-3 text-sm font-semibold hover:bg-[#17221c]/5">Detalles</Button>
            {isAdding ? <ButtonLoading label="Agregando..." size="sm" className="h-10 rounded-md bg-[#17221c] px-3 text-white" /> : <Button type="button" onPress={() => { void addOneToCart(); }} className="h-10 rounded-md bg-[#17221c] px-3 text-sm font-semibold text-white hover:bg-[#26382c]">Agregar al carrito</Button>}
          </div>
        </div>
      </article>
      </RippleEffect>
      <ProductQuickview key={`${product.id}-${open}`} product={product} open={open} onOpenChange={setOpen} />
    </>
  );
}