import { ProductCard } from "@/components/product-card";

const products = [
  { id: "pollo", title: "Bocaditos de pollo", image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=900&auto=format&fit=crop", price: "$8.900", description: "Premios tiernos y sabrosos para recompensar cada momento.", ingredients: ["Pollo", "Arroz", "Zanahoria", "Aceite de oliva"], nutrition: [{ label: "Proteínas", value: "24 g" }, { label: "Grasas", value: "8 g" }, { label: "Energía", value: "180 kcal" }, { label: "Porción", value: "50 g" }] },
  { id: "crujiente", title: "Mix crujiente", image: "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?q=80&w=900&auto=format&fit=crop", price: "$7.500", description: "Una mezcla crocante para sumar textura y diversión.", ingredients: ["Avena", "Manzana", "Pollo", "Semillas"], nutrition: [{ label: "Proteínas", value: "18 g" }, { label: "Grasas", value: "6 g" }, { label: "Energía", value: "160 kcal" }, { label: "Porción", value: "50 g" }] },
  { id: "galletas", title: "Galletas caseras", image: "https://images.unsplash.com/photo-1582798358481-d199fb734b79?q=80&w=900&auto=format&fit=crop", price: "$6.900", description: "Galletas horneadas con ingredientes simples y reconocibles.", ingredients: ["Harina de arroz", "Banana", "Avena", "Canela"], nutrition: [{ label: "Proteínas", value: "12 g" }, { label: "Grasas", value: "5 g" }, { label: "Energía", value: "140 kcal" }, { label: "Porción", value: "40 g" }] },
  { id: "salmon", title: "Premios de salmón", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=900&auto=format&fit=crop", price: "$9.900", description: "Bocados de sabor intenso para ocasiones especiales.", ingredients: ["Salmón", "Papa", "Perejil", "Aceite de coco"], nutrition: [{ label: "Proteínas", value: "26 g" }, { label: "Grasas", value: "10 g" }, { label: "Energía", value: "190 kcal" }, { label: "Porción", value: "50 g" }] },
];

export type Product = (typeof products)[number];

export default function ProductosPage() {
  return (
    <main className="min-h-screen bg-[#fff8f0] px-4 py-10 text-[#17221c] lg:py-20">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto mb-10 max-w-2xl space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">El menú Wuff</p>
          <h1 className="text-4xl font-bold sm:text-5xl">Elegí tu próximo premio</h1>
          <p className="text-balance text-lg text-[#17221c]/65">Bocaditos ricos para acompañar cada momento del día.</p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </main>
  );
}