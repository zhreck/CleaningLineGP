import type { Product } from "../../lib/types";
import ProductCard from "./productCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products?.length) return <p>No hay productos.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}
