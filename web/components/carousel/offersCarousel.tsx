"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "../../lib/types";
import ProductCard from "../products/productCard";

type OffersCarouselProps = {
  products: Product[];
  title?: string;
  subtitle?: string;
  autoPlayIntervalMs?: number;
};

export default function OffersCarousel({
  products,
  title = "Ofertas y productos destacados",
  subtitle = "Selección especial para ti",
  autoPlayIntervalMs = 6000,
}: OffersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const total = products.length;
  if (!total) return null;

  // ───── RESPONSIVE: decidir cuántos ítems mostrar ─────
 // ───── RESPONSIVE: decidir cuántos ítems mostrar ─────
    useEffect(() => {
    const updateItems = () => {
      const w = window.innerWidth;

      if (w < 480) {
        // teléfonos pequeños
        setItemsPerPage(1);
      } else if (w < 768) {
        // teléfonos grandes / phablets
        setItemsPerPage(2);
      } else if (w < 1024) {
        // tablets
        setItemsPerPage(3);
      } else if (w < 1440) {
        // notebooks / monitores estándar
        setItemsPerPage(4);
      } else {
        // pantallas grandes
        setItemsPerPage(6);
      }
    };

    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  const safeItemsPerPage = Math.min(itemsPerPage, total);

  // ───── Navegación ─────
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % total);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + total) % total);

  useEffect(() => {
    const id = setInterval(goNext, autoPlayIntervalMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, autoPlayIntervalMs]);

  // ───── Ventana visible ─────
  const visibleProducts = useMemo(() => {
    const result: Product[] = [];
    for (let i = 0; i < safeItemsPerPage; i++) {
      const idx = (currentIndex + i) % total;
      result.push(products[idx]);
    }
    return result;
  }, [products, currentIndex, safeItemsPerPage, total]);

  return (
    <section className="space-y-3">
      {/* Encabezado */}
      <div className="flex items-center justify-between max-w-6xl mx-auto px-1">
        <div>
          <h2 className="text-lg font-semibold text-emerald-800">{title}</h2>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
        </div>

        {/* Controles desktop/tablet */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition"
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      </div>

      {/* Carrusel */}
      <div className="relative max-w-6xl mx-auto">
        <div className="overflow-hidden">
          <div className="flex gap-4">
            {visibleProducts.map((p) => (
              <div
                key={p.id}
                style={{ flex: `0 0 ${100 / safeItemsPerPage}%` }}
                className="min-w-0"
              >
                {/* IMPORTANTE: ProductCard debe respetar w-full */}
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </div>

        {/* Controles móviles flotantes */}
        <div className="sm:hidden absolute -right-1 -top-9 flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200 bg-white/80 text-emerald-700 hover:bg-emerald-50 transition"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200 bg-white/80 text-emerald-700 hover:bg-emerald-50 transition"
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
