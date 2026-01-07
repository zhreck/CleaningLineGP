"use client";

import React from "react";
import Link from "next/link";
import type { Product } from "../../lib/types";
import { useCart } from "../cart/cartContext";
import { getFinalPrice, formatCLP, toNumber } from "../../lib/price";

const currencyCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

type Props = {
  p: Product;
};

function ProductCard({ p }: Props) {
  const { addItem } = useCart();

  const isOnSale = !!p.isOnSale && p.discountPercent && p.discountPercent > 0;

  return (
    <article className="flex flex-col rounded-3xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-all">
      {/* Imagen + badge */}
      <Link
        href={`/product/${p.slug}`}
        className="relative block overflow-hidden rounded-2xl bg-muted"
      >
        <div className="flex h-44 w-full items-center justify-center md:h-52">
          {p.imageUrl ? (
            <img
              src={p.imageUrl}
              alt={p.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <span className="text-sm text-muted-foreground">
              Sin imagen
            </span>
          )}
        </div>

        {isOnSale && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white">
            Oferta {p.discountPercent}%
          </span>
        )}
      </Link>

      {/* Info texto */}
      <div className="mt-4 flex-1 space-y-1">
        <Link
          href={`/product/${p.slug}`}
          className="block text-lg font-semibold leading-tight text-foreground hover:underline"
        >
          {p.name}
        </Link>

        {p.category?.name && (
          <p className="text-sm text-muted-foreground">{p.category.name}</p>
        )}

        <div className="mt-1 space-y-1">
          <p className="text-xl font-semibold text-emerald-700">
            {formatCLP(getFinalPrice(p))}
          </p>
          {isOnSale && (
            <p className="text-sm text-muted-foreground line-through">
              {formatCLP(toNumber(p.price))}
            </p>
          )}
        </div>

        {p.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {p.description}
          </p>
        )}
      </div>

      {/* Botón agregar */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => addItem(p)}
          className="flex-1 rounded-full bg-emerald-600 px-4 py-2.5 text-base font-semibold text-white hover:bg-emerald-500 transition-colors"
        >
          Agregar al carrito
        </button>

        <Link
          href={`/product/${p.slug}`}
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          Ver más
        </Link>
      </div>
    </article>
  );
}

// Memoize ProductCard to prevent unnecessary re-renders when product data hasn't changed
export default React.memo(ProductCard);
