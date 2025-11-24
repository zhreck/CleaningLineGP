// web/app/cart/page.tsx
"use client";

import Link from "next/link";
import { useCart } from "../../components/cart/cartContext";

export default function CartPage() {
  const { items, totalQuantity, totalAmount, updateItemQuantity, removeItem, clear } =
    useCart();

  const cartItems = items;

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    updateItemQuantity(productId, quantity);
  };

  const handleRemove = (productId: string) => {
    removeItem(productId);
  };

  const handleClear = () => {
    clear();
  };

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Carrito</h1>

      {!cartItems.length ? (
        <p>
          Tu carrito está vacío.{" "}
          <Link href="/catalog" className="text-emerald-700 underline">
            Ver catálogo
          </Link>
        </p>
      ) : (
        <>
          <ul className="space-y-3">
            {cartItems.map((item) => (
              <li
                key={item.productId}
                className="flex items-center justify-between rounded-lg border border-emerald-100 bg-white/90 p-3 shadow-sm"
              >
                <div>
                  <p className="font-medium text-slate-800">{item.name}</p>
                  <p className="text-sm text-neutral-500">
                    ${item.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Subtotal:{" "}
                    <span className="font-semibold">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) =>
                      handleQuantityChange(
                        item.productId,
                        Number(event.target.value)
                      )
                    }
                    className="
                      w-16 rounded-md border border-emerald-200 bg-white
                      px-2 py-1 text-sm text-slate-800
                      outline-none focus:border-emerald-500
                    "
                  />

                  <button
                    type="button"
                    onClick={() => handleRemove(item.productId)}
                    className="
                      rounded-md px-2 py-1 text-xs font-medium text-rose-500
                      hover:bg-rose-50 hover:text-rose-700
                      transition
                    "
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-emerald-100 pt-4">
            <div>
              <p className="text-lg text-slate-800">
                Subtotal: <b>${totalAmount.toLocaleString()}</b>
              </p>
              <p className="text-sm text-neutral-500">
                {totalQuantity} ítem{totalQuantity !== 1 && "s"}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="
                  rounded-full border border-rose-300
                  px-4 py-2 text-sm font-medium text-rose-600
                  hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700
                  transition
                "
              >
                Vaciar carrito
              </button>

              <Link
                href="/checkout"
                className="
                  rounded-full bg-emerald-600
                  px-5 py-2 text-sm font-semibold text-white
                  hover:bg-emerald-500 hover:shadow-md
                  transition
                "
              >
                Ir al pago
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
