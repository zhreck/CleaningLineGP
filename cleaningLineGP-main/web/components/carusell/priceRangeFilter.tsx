"use client";

import { useState } from "react";

type PriceRangeFilterProps = {
  maxLimit: number;
  initialMaxPrice?: number;
};

function formatCLP(value: number) {
  return value.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
}

export default function PriceRangeFilter({
  maxLimit,
  initialMaxPrice,
}: PriceRangeFilterProps) {
  const [value, setValue] = useState(
    initialMaxPrice && initialMaxPrice > 0 ? initialMaxPrice : maxLimit,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  return (
    <div className="space-y-3">
      {/* Título con líneas a los lados */}
      <div className="flex items-center gap-2">
        <span className="h-px flex-1 bg-slate-700" />
        <span className="text-[11px] font-semibold text-slate-300">
          Filtrar por precio
        </span>
        <span className="h-px flex-1 bg-slate-700" />
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <input
          type="range"
          min={0}
          max={maxLimit}
          value={value}
          onChange={handleChange}
          className="w-full accent-emerald-500"
        />

        <p className="text-xs text-slate-300">
          Precio:{" "}
          <span className="font-semibold">{formatCLP(0)}</span> —{" "}
          <span className="font-semibold">
            {formatCLP(value)}
          </span>
        </p>
      </div>

      {/* Valor enviado en el formulario */}
      <input type="hidden" name="maxPrice" value={value} />
    </div>
  );
}
