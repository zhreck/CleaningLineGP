// web/app/checkout/page.tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { getCart, getCartTotals, clearCart } from "../../lib/cart";
import type { CartItem } from "../../lib/types";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const { totalAmount, totalQuantity } = getCartTotals(cartItems);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cartItems.length) return;

    setIsSubmitting(true);

    // Simulación de envío al backend
    setTimeout(() => {
      clearCart();
      setCartItems([]);
      setIsSubmitting(false);
      setSuccessMessage("¡Compra realizada con éxito! 🎉");
    }, 800);
  };

  if (!cartItems.length && !successMessage) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p>Tu carrito está vacío.</p>
        <Link href="/catalog" className="underline">
          Volver al catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Checkout</h1>

        <h2 className="text-lg font-medium">Resumen de compra</h2>
        <ul className="space-y-2">
          {cartItems.map((item) => (
            <li
              key={item.productId}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-neutral-400">
                  {item.quantity} x ${item.price.toLocaleString()}
                </p>
              </div>
              <p className="text-sm">
                ${(item.quantity * item.price).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>

        <div className="border-t pt-3 text-sm text-neutral-300">
          <p>
            Ítems: <b>{totalQuantity}</b>
          </p>
          <p>
            Total a pagar:{" "}
            <b>${totalAmount.toLocaleString()}</b>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Datos de envío y pago</h2>

        {successMessage && (
          <div className="rounded-md border border-green-500 bg-green-900/20 p-3 text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Nombre completo</label>
            <input
              name="fullName"
              required
              className="w-full rounded-md border bg-black px-3 py-2"
              placeholder="Sebastián Herrera"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-md border bg-black px-3 py-2"
              placeholder="correo@example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Dirección</label>
            <input
              name="address"
              required
              className="w-full rounded-md border bg-black px-3 py-2"
              placeholder="Calle Falsa 123, Santiago"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Método de pago</label>
            <select
              name="paymentMethod"
              required
              className="w-full rounded-md border bg-black px-3 py-2"
            >
              <option value="card">Tarjeta de crédito/débito</option>
              <option value="transfer">Transferencia bancaria</option>
              <option value="cash">Efectivo contra entrega</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !cartItems.length}
            className="mt-2 w-full rounded-md border px-4 py-2 bg-white text-black disabled:opacity-60"
          >
            {isSubmitting ? "Procesando..." : "Confirmar compra"}
          </button>
        </form>
      </div>
    </section>
  );
}
