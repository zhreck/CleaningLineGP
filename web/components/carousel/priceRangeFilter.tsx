// web/components/carousel/priceRangeFilter.tsx
"use client";

import { useEffect, useState } from "react";

type PriceRangeFilterProps = {
  maxLimit: number;
  initialMaxPrice?: number;
};

const currencyCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default function PriceRangeFilter({
  maxLimit,
  initialMaxPrice,
}: PriceRangeFilterProps) {
  const [value, setValue] = useState(
    initialMaxPrice && !Number.isNaN(initialMaxPrice)
      ? initialMaxPrice
      : maxLimit
  );

  // Si cambian los props (por navegación con filtros) actualizamos el slider
  useEffect(() => {
    setValue(
      initialMaxPrice && !Number.isNaN(initialMaxPrice)
        ? initialMaxPrice
        : maxLimit
    );
  }, [initialMaxPrice, maxLimit]);

  return (
    <div className="space-y-3 rounded-2xl border border-emerald-200 bg-white/70 px-3 py-3 text-sm">
      <p className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">
        Filtrar por precio
      </p>

      {/* Valor actual */}
      <div className="flex items-baseline justify-between">
        <span className="text-emerald-700 font-medium">
          Hasta:{" "}
          <span className="text-base font-semibold">
            {currencyCLP.format(value)}
          </span>
        </span>
        <span className="text-xs text-emerald-800">
          Mín: {currencyCLP.format(0)}
        </span>
      </div>

      {/* Slider */}
      <input
        type="range"
        name="maxPrice"
        min={0}
        max={maxLimit}
        step={1000}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full cursor-pointer accent-emerald-600"
      />

      {/* Límites visuales */}
      <div className="flex justify-between text-xs text-emerald-800">
        <span>{currencyCLP.format(0)}</span>
        <span>{currencyCLP.format(maxLimit)}</span>
      </div>
    </div>
  );
}
