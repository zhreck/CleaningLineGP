// web/components/products/addToCartButton.tsx
"use client";

import { useState } from "react";
import type { Product } from "../../lib/types";
import { useCart } from "../cart/cartContext";

type AddToCartButtonProps = {
  product: Product;
};

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const handleClick = () => {
    setIsAdding(true);
    addItem(product, 1);
    setTimeout(() => setIsAdding(false), 400);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isAdding}
      className="
        rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white
        disabled:cursor-not-allowed disabled:opacity-60
        hover:bg-emerald-700
        transition
      "
    >
      {isAdding ? "Agregando..." : "Agregar al carrito"}
    </button>
  );
}
