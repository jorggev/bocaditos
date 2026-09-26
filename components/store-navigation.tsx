"use client";

import { LogOut, Menu, Settings, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

const navigationLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/categorias", label: "Categorías" },
  { href: "/productos", label: "Ofertas" },
];

export function StoreNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const itemCount = useStore((state) => state.items.length);
  const logout = useStore((state) => state.logout);
  const setCartOpen = useStore((state) => state.setCartOpen);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="border-b border-[#17221c]/10 bg-[#fffdf9] px-4 py-4 text-[#17221c] sm:px-8 lg:px-12">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          wuff<span className="text-orange-500">.</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
          {navigationLinks.map((link) => (
            <Link key={link.label} href={link.href} className="text-sm font-semibold text-[#17221c]/65 transition-colors hover:text-[#17221c]">
              {link.label}
            </Link>
          ))}
          {isAuthenticated && <Link href="/promociones" className="text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700">Promociones</Link>}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button type="button" variant="ghost" size="icon" onPress={() => setCartOpen(true)} className="relative rounded-md p-2 text-[#17221c]/70 hover:bg-[#17221c]/5" aria-label={`Abrir carrito, ${itemCount} productos diferentes`}>
            <ShoppingCart className="size-5" />
            {itemCount > 0 && <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">{itemCount}</span>}
          </Button>
          {isAuthenticated ? (
            <>
              <Link href="/perfil" className="rounded-md p-2 text-[#17221c]/70 hover:bg-[#17221c]/5" aria-label="Ajustes de perfil"><Settings className="size-5" /></Link>
              <Button type="button" variant="ghost" onPress={handleLogout} className="rounded-md px-3 py-2 text-sm font-semibold text-[#17221c]/70 hover:bg-[#17221c]/5">Cerrar sesión</Button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-md px-3 py-2 text-sm font-semibold text-[#17221c]/70 hover:bg-[#17221c]/5 hover:text-[#17221c]">Iniciar sesión</Link>
              <Link href="/registro" className="rounded-md bg-[#17221c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#26382c]">Crear cuenta</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Button type="button" variant="ghost" size="icon" onPress={() => setCartOpen(true)} className="relative rounded-md p-2" aria-label={`Abrir carrito, ${itemCount} productos diferentes`}>
            <ShoppingCart className="size-5" />
            {itemCount > 0 && <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">{itemCount}</span>}
          </Button>
          <Button type="button" variant="ghost" size="icon" className="rounded-md p-2 md:hidden" onPress={() => setMobileMenuOpen((open) => !open)} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}>
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav id="mobile-navigation" className="mx-auto flex max-w-7xl flex-col gap-1 border-t border-[#17221c]/10 pt-3 md:hidden" aria-label="Navegación móvil">
          {navigationLinks.map((link) => (
            <Link key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-3 text-sm font-semibold hover:bg-[#17221c]/5">{link.label}</Link>
          ))}
          {isAuthenticated && <Link href="/promociones" onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-3 text-sm font-semibold text-orange-600 hover:bg-[#17221c]/5">Promociones</Link>}
          {isAuthenticated ? (
            <>
              <Link href="/perfil" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-3 text-sm font-semibold hover:bg-[#17221c]/5"><Settings className="size-4" />Ajustes</Link>
              <Button type="button" variant="ghost" onPress={() => { setMobileMenuOpen(false); setCartOpen(true); }} className="flex w-full justify-start gap-2 rounded-md px-3 py-3 text-left text-sm font-semibold hover:bg-[#17221c]/5"><ShoppingCart className="size-4" />Carrito</Button>
              <Button type="button" variant="ghost" onPress={handleLogout} className="flex w-full justify-start gap-2 rounded-md px-3 py-3 text-left text-sm font-semibold hover:bg-[#17221c]/5"><LogOut className="size-4" />Cerrar sesión</Button>
            </>
          ) : <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-3 text-sm font-semibold hover:bg-[#17221c]/5">Iniciar sesión</Link>}
        </nav>
      )}
    </header>
  );
}