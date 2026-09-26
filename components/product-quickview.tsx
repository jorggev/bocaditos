"use client";

import { useEffect, useState } from "react";
import { Check, Minus, Plus, X } from "lucide-react";
import { useStore } from "@/lib/store";

export type FoodProduct = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  ingredients: string[];
  nutrition: Array<{ label: string; value: string }>;
};

type ProductQuickviewProps = {
  product: FoodProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductQuickview({ product, open, onOpenChange }: ProductQuickviewProps) {
  const [quantity, setQuantity] = useState(() => useStore.getState().items.find((item) => item.id === product.id)?.quantity ?? 0);
  const setItemQuantity = useStore((state) => state.setItemQuantity);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const updateQuantity = (nextQuantity: number) => {
    const safeQuantity = Number.isFinite(nextQuantity) ? Math.max(0, Math.floor(nextQuantity)) : 0;
    setQuantity(safeQuantity);
  };

  const addToCart = () => {
    if (quantity <= 0) {
      onOpenChange(false);
      return;
    }
    setItemQuantity(product.id, quantity);
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4" role="presentation" onMouseDown={() => onOpenChange(false)}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${product.id}-title`}
        className="relative grid max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-md bg-[#fffdf9] text-[#17221c] shadow-2xl md:grid-cols-2"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={() => onOpenChange(false)} className="absolute right-3 top-3 z-10 rounded-md bg-white/90 p-2 text-[#17221c] shadow-sm" aria-label="Cerrar detalles">
          <X className="size-5" />
        </button>
        <img src={product.image} alt={product.title} className="h-72 w-full object-cover md:h-full md:min-h-[34rem]" />
        <div className="flex flex-col p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Información del producto</p>
          <h2 id={`${product.id}-title`} className="mt-2 text-3xl font-bold">{product.title}</h2>
          <p className="mt-3 text-2xl font-semibold">{product.price}</p>
          <p className="mt-4 text-sm leading-6 text-[#17221c]/65">{product.description}</p>

          <div className="mt-6">
            <h3 className="font-semibold">Ingredientes</h3>
            <ul className="mt-2 grid grid-cols-2 gap-2 text-sm text-[#17221c]/70">
              {product.ingredients.map((ingredient) => <li key={ingredient} className="flex items-center gap-2"><Check className="size-4 text-orange-600" />{ingredient}</li>)}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold">Información nutricional</h3>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-sm text-[#17221c]/70">
              {product.nutrition.map((item) => <div key={item.label} className="flex justify-between gap-3 border-b border-[#17221c]/10 py-1"><dt>{item.label}</dt><dd className="font-medium">{item.value}</dd></div>)}
            </dl>
          </div>

          <div className="mt-auto pt-8">
            <label htmlFor={`${product.id}-quantity`} className="text-sm font-semibold">Cantidad</label>
            <div className="mt-2 flex gap-2">
              <div className="flex h-11 items-center rounded-md border border-[#17221c]/20">
                <button type="button" className="p-3 disabled:opacity-40" onClick={() => updateQuantity(quantity - 1)} disabled={quantity === 0} aria-label="Reducir cantidad"><Minus className="size-4" /></button>
                <input id={`${product.id}-quantity`} type="number" min="0" step="1" value={quantity} onChange={(event) => updateQuantity(Number(event.target.value))} className="w-14 border-x border-[#17221c]/20 bg-transparent text-center outline-none" aria-label="Cantidad de productos" />
                <button type="button" className="p-3" onClick={() => updateQuantity(quantity + 1)} aria-label="Aumentar cantidad"><Plus className="size-4" /></button>
              </div>
              <button type="button" onClick={addToCart} className="h-11 flex-1 rounded-md bg-[#17221c] px-4 font-semibold text-white transition-colors hover:bg-[#26382c]">Agregar al carrito</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}