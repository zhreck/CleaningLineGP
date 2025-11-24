import Link from "next/link";
import type { Product } from "../../lib/types";
import AddToCartButton from "./addToCartButton";

// Formateo CLP
function formatPriceCLP(value: number) {
  if (Number.isNaN(value)) return "$0";
  return value.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
}

export default function ProductCard({ p }: { p: Product }) {
  const isOnSale = p.isOnSale || (p.discountPercent && p.discountPercent > 0);
  const discountPercent = p.discountPercent ?? 0;

  // Calcular precio final con descuento
  const discountedPrice = isOnSale
    ? Math.round(p.price * (1 - discountPercent / 100))
    : p.price;

  const shortDescription = p.description
    ? p.description.length > 80
      ? p.description.slice(0, 77) + "..."
      : p.description
    : "Producto de limpieza.";

  return (
    <article className="flex flex-col w-full h-full rounded-xl border border-emerald-100 bg-white shadow-sm hover:shadow-md hover:border-emerald-300 transition">

      
      {/* Imagen */}
      <Link href={`/product/${p.slug}`} className="block overflow-hidden rounded-t-xl relative">
        
        {/* Badge de Oferta */}
        {isOnSale && (
          <span className="absolute left-2 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white shadow">
            {discountPercent ? `-${discountPercent}%` : "Oferta"}
          </span>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.imageUrl || "/placeholder.png"}
          alt={p.name}
          className="h-48 w-full object-cover transition-transform duration-200 hover:scale-[1.03]"
        />
      </Link>

      {/* Contenido */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        
        {/* Nombre */}
        <Link href={`/product/${p.slug}`} className="block hover:underline">
          <h3 className="font-medium text-sm md:text-base text-slate-800">
            {p.name}
          </h3>
        </Link>

        {/* Descripción */}
        <p className="text-xs text-slate-500">{shortDescription}</p>

        {/* Precio */}
        <div className="mt-auto space-y-1">
          {/* Precio si NO hay oferta */}
          {!isOnSale && (
            <p className="text-sm font-semibold text-slate-900">
              {formatPriceCLP(p.price)}
            </p>
          )}

          {/* Precio si hay oferta */}
          {isOnSale && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-emerald-700">
                {formatPriceCLP(discountedPrice)}
              </span>
              <span className="text-xs line-through text-slate-400">
                {formatPriceCLP(p.price)}
              </span>
            </div>
          )}

          <p className="text-[11px] text-slate-500">
            Despacho disponible. Sobre $50.000, envío gratis.
          </p>
        </div>

        {/* Botón agregar */}
        <div className="pt-1">
          <AddToCartButton product={p} />
        </div>
      </div>
    </article>
  );
}
