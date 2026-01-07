"use client";

import { useRef } from "react";
import PriceRangeFilter from "../../components/carousel/priceRangeFilter";
import type { Category } from "../../lib/categoriesApi";

type Props = {
  categories: Category[];
  initialSearch: string;
  categorySlug: string;
  onlyFeatured: boolean;
  onlyOnSale: boolean;
  maxPrice: number | undefined;
  globalMaxPrice: number;
};

export default function CatalogFilters({
  categories,
  initialSearch,
  categorySlug,
  onlyFeatured,
  onlyOnSale,
  maxPrice,
  globalMaxPrice,
}: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);

  // 💡 Cada vez que cambia cualquier input del formulario,
  //    auto-enviamos el form (GET /catalogo?...)
  const handleChange = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <form
      action="/catalogo"
      ref={formRef}
      className="space-y-5"
      onChange={handleChange}
    >
      {/* BUSCAR */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-emerald-800">Buscar</p>
        <input
          type="text"
          name="q"
          defaultValue={initialSearch}
          placeholder="Ej: cloro..."
          className="
            w-full rounded-full border border-emerald-200 bg-white 
            px-3 py-2 text-sm 
            placeholder:text-emerald-600
            outline-none focus:border-emerald-500
          "
        />
      </div>

      <hr className="border-emerald-200" />

      {/* CATEGORÍAS DINÁMICAS */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-emerald-800">Categoría</p>

        <div className="flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="cat"
              value=""
              defaultChecked={!categorySlug}
              className="h-4 w-4 text-emerald-600"
            />
            Todos
          </label>

          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="cat"
                value={cat.slug}
                defaultChecked={categorySlug === cat.slug}
                className="h-4 w-4 text-emerald-600"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <hr className="border-emerald-200" />

      {/* TIPO */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-emerald-800">
          Tipo de producto
        </p>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            value="1"
            defaultChecked={onlyFeatured}
            className="h-4 w-4 text-emerald-600"
          />
          Solo destacados
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="onSale"
            value="1"
            defaultChecked={onlyOnSale}
            className="h-4 w-4 text-emerald-600"
          />
          Solo en oferta
        </label>
      </div>

      <hr className="border-emerald-200" />

      {/* PRECIO (mantengo tu componente tal cual) */}
      <PriceRangeFilter maxLimit={globalMaxPrice} initialMaxPrice={maxPrice} />

      {/* Link para limpiar filtros */}
      <div className="flex items-center justify-end pt-2">
        <a
          href="/catalogo"
          className="text-xs text-emerald-700 hover:text-emerald-900"
        >
          Limpiar filtros
        </a>
      </div>
    </form>
  );
}
