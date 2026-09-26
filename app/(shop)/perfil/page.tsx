import Link from "next/link";

export default function PerfilPage() {
  return (
    <main className="min-h-[65vh] bg-[#fff8f0] px-4 py-12 text-[#17221c] lg:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Ajustes</p>
        <h1 className="mt-2 text-4xl font-bold">Mi cuenta</h1>
        <section className="mt-8 rounded-md border border-[#17221c]/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Promociones</h2>
          <p className="mt-2 text-[#17221c]/60">Consultá tu beneficio de bienvenida y el tiempo restante.</p>
          <Link href="/promociones" className="mt-5 inline-block rounded-md bg-[#17221c] px-5 py-3 font-semibold text-white hover:bg-[#26382c]">Ver mi promoción</Link>
        </section>
      </div>
    </main>
  );
}