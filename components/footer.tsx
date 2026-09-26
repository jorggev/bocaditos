"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-[#17221c]/10 bg-[#fffdf9] py-12 text-[#17221c]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-8 md:grid-cols-4 lg:px-12">
        <div className="space-y-4 md:col-span-2">
          <Link href="/" className="text-2xl font-bold tracking-tight">wuff<span className="text-orange-500">.</span></Link>
          <p className="max-w-sm text-sm leading-6 text-[#17221c]/60">Bocaditos ricos para acompañar cada paseo, siesta y momento compartido.</p>
        </div>
        <div className="space-y-3">
          <h2 className="font-semibold">Tienda</h2>
          <Link href="/productos" className="block text-sm text-[#17221c]/60 hover:text-[#17221c]">Productos</Link>
          <Link href="/categorias" className="block text-sm text-[#17221c]/60 hover:text-[#17221c]">Categorías</Link>
          <Link href="/checkout" className="block text-sm text-[#17221c]/60 hover:text-[#17221c]">Checkout</Link>
        </div>
        <div className="space-y-3">
          <h2 className="font-semibold">Ayuda</h2>
          <Link href="/login" className="block text-sm text-[#17221c]/60 hover:text-[#17221c]">Iniciar sesión</Link>
          <Link href="/registro" className="block text-sm text-[#17221c]/60 hover:text-[#17221c]">Crear cuenta</Link>
          <p className="text-sm text-[#17221c]/60">hola@wuff.com</p>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-[#17221c]/10 px-4 pt-5 text-xs text-[#17221c]/50 sm:px-8 lg:px-12">© {new Date().getFullYear()} Wuff. Todos los derechos reservados.</div>
    </footer>
  );
}