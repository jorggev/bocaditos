"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useStore } from "@/lib/store";

const catalog = [
  { id: "pollo", title: "Bocaditos de pollo", price: 8900, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=300&auto=format&fit=crop" },
  { id: "crujiente", title: "Mix crujiente", price: 7500, image: "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?q=80&w=300&auto=format&fit=crop" },
  { id: "galletas", title: "Galletas caseras", price: 6900, image: "https://images.unsplash.com/photo-1582798358481-d199fb734b79?q=80&w=300&auto=format&fit=crop" },
  { id: "salmon", title: "Premios de salmón", price: 9900, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=300&auto=format&fit=crop" },
];

const formatPrice = (price: number) => `$${price.toLocaleString("es-AR")}`;

export function CartSidebar() {
  const open = useStore((state) => state.cartOpen);
  const setOpen = useStore((state) => state.setCartOpen);
  const items = useStore((state) => state.items);
  const setItemQuantity = useStore((state) => state.setItemQuantity);
  const removeItem = useStore((state) => state.removeItem);
  const itemCount = items.length;
  const products = items.map((item) => ({ ...item, product: catalog.find((product) => product.id === item.id) })).filter((item) => item.product);
  const subtotal = products.reduce((total, item) => total + (item.product?.price ?? 0) * item.quantity, 0);

  return (
    <>
      {open && <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)} />}
      <aside className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#fffdf9] text-[#17221c] shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`} aria-label="Carrito lateral" aria-hidden={!open} inert={!open}>
        <header className="flex items-center justify-between border-b border-[#17221c]/10 p-5"><div><h2 className="text-xl font-bold">Tu carrito</h2><p className="text-sm text-[#17221c]/60">{itemCount} productos diferentes</p></div><button type="button" onClick={() => setOpen(false)} className="rounded-md p-2 hover:bg-[#17221c]/5" aria-label="Cerrar carrito"><X className="size-5" /></button></header>
        <div className="flex-1 overflow-y-auto p-5">
          {products.length === 0 ? <div className="flex h-full flex-col items-center justify-center text-center"><ShoppingCart className="size-9 text-orange-500" /><p className="mt-3 font-semibold">Tu carrito está vacío</p><Link href="/productos" onClick={() => setOpen(false)} className="mt-4 rounded-md bg-[#17221c] px-4 py-2 text-sm font-semibold text-white">Ver menú</Link></div> : <div className="divide-y divide-[#17221c]/10">{products.map(({ id, quantity, product }) => product && <article key={id} className="flex gap-3 py-4"><img src={product.image} alt={product.title} className="size-16 rounded-md object-cover" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><h3 className="truncate text-sm font-semibold">{product.title}</h3><button type="button" onClick={() => removeItem(id)} aria-label={`Eliminar ${product.title}`}><Trash2 className="size-4 text-[#17221c]/50" /></button></div><p className="mt-1 text-sm text-[#17221c]/60">{formatPrice(product.price)}</p><div className="mt-3 flex items-center justify-between"><div className="flex h-8 items-center rounded-md border border-[#17221c]/20"><button type="button" onClick={() => setItemQuantity(id, quantity - 1)} disabled={quantity <= 1} className="p-2 disabled:opacity-30" aria-label="Reducir cantidad"><Minus className="size-3" /></button><span className="min-w-6 text-center text-xs">{quantity}</span><button type="button" onClick={() => setItemQuantity(id, quantity + 1)} className="p-2" aria-label="Aumentar cantidad"><Plus className="size-3" /></button></div><span className="text-sm font-semibold">{formatPrice(product.price * quantity)}</span></div></div></article>)}</div>}
        </div>
        <footer className="border-t border-[#17221c]/10 p-5"><div className="mb-4 flex justify-between font-bold"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><Link href="/checkout" onClick={() => setOpen(false)} className="block rounded-md bg-[#17221c] px-4 py-3 text-center font-semibold text-white">Continuar al pago</Link></footer>
      </aside>
    </>
  );
}