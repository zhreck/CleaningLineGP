"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product } from "../../../lib/types";
import { fetchProducts } from "../../../lib/api";
import Link from "next/link";
import { useCart } from "../../../components/cart/cartContext";
import { getFinalPrice, formatCLP, toNumber } from "../../../lib/price";

export default function ProductPage() {
  const { slug } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const products = await fetchProducts();
        const found = products.find((p) => p.slug === slug) ?? null;
        setProduct(found);
      } catch (err) {
        console.error("Error cargando producto:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  // 🌀 Cargando
  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-base text-muted-foreground">Cargando producto…</p>
      </section>
    );
  }

  // ❌ Producto no encontrado
  if (!product) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8 space-y-4">
        <p className="text-base text-muted-foreground">
          Producto no encontrado.
        </p>

        <Link
          href="/catalogo"
          className="inline-block text-base text-emerald-600 hover:text-emerald-700"
        >
          ← Volver al catálogo
        </Link>
      </section>
    );
  }

  const stock = product.stock ?? 0;
  const categoryName = product.category?.name ?? "Sin categoría";

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Breadcrumbs */}
      <nav className="text-sm text-muted-foreground">
        <Link href="/catalogo" className="hover:underline">
          Catálogo
        </Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* Layout principal */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Imagen */}
          <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
            <div className="h-[260px] md:h-[320px] w-full overflow-hidden rounded-2xl bg-muted flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  Sin imagen disponible
                </div>
              )}
            </div>
          </div>

          {/* Info despacho */}
          <section className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 space-y-1">
            <p className="font-semibold">
              🚚 Despacho disponible.
              <span className="font-normal">
                {" "}
                Sobre $50.000 en productos, el envío es gratis.
              </span>
            </p>
            <p>📍 Retiro en tienda de lunes a domingo.</p>
            <p className="text-xs">
              Los tiempos de despacho y el costo final se confirman al coordinar
              el pedido.
            </p>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm flex flex-col gap-4">
          {/* Nombre + categoría */}
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold text-foreground">
              {product.name}
            </h1>
            <p className="text-base text-muted-foreground">
              Categoría: {categoryName}
            </p>
          </header>

          {/* Precio + stock */}
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-foreground">
              {formatCLP(getFinalPrice(product))}
            </p>
            {product.isOnSale && product.discountPercent && (
              <p className="text-sm text-muted-foreground line-through">
                Antes: {formatCLP(toNumber(product.price))}
              </p>
            )}
            <p className="text-base text-muted-foreground">
              Stock disponible: {stock} unidades
            </p>
          </div>

          {/* Descripción */}
          <section className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">
              Descripción
            </h2>
            <p className="text-base text-foreground leading-relaxed">
              {product.description ||
                "Producto de limpieza para uso doméstico y/o industrial."}
            </p>
          </section>

          {/* Fichas técnicas */}
          <section className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              Fichas técnicas y seguridad
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              Si el producto lo requiere, se pueden adjuntar fichas técnicas u
              hojas de seguridad (PDF).
            </p>
          </section>

          {/* Botón agregar */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => addItem(product)}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
