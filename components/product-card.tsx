"use client";

import { useState } from "react";
import { ProductQuickview, type FoodProduct } from "@/components/product-quickview";
import { useStore } from "@/lib/store";

export function ProductCard({ product }: { product: FoodProduct }) {
  const [open, setOpen] = useState(false);
  const setItemQuantity = useStore((state) => state.setItemQuantity);

  const addOneToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    const current = useStore.getState().items.find((item) => item.id === product.id)?.quantity ?? 0;
    setItemQuantity(product.id, current + 1);
  };

  return (
    <>
      <article className="group cursor-pointer" onClick={() => setOpen(true)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setOpen(true); }} role="button" tabIndex={0}>
        <figure className="relative aspect-square w-full overflow-hidden rounded-md bg-orange-100">
          <img src={product.image} alt={product.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </figure>
        <div className="mt-3 space-y-3">
          <div className="flex items-start justify-between gap-3"><p className="font-semibold">{product.title}</p><p className="text-[#17221c]/60">{product.price}</p></div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={(event) => { event.stopPropagation(); setOpen(true); }} className="h-10 rounded-md border border-[#17221c]/20 bg-white px-3 text-sm font-semibold transition-colors hover:bg-[#17221c]/5">Detalles</button>
            <button type="button" onClick={addOneToCart} className="h-10 rounded-md bg-[#17221c] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#26382c]">Agregar al carrito</button>
          </div>
        </div>
      </article>
      <ProductQuickview key={`${product.id}-${open}`} product={product} open={open} onOpenChange={setOpen} />
    </>
  );
}