"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/cart/cartContext";
import { toNumber, formatCLP } from "../../lib/price";

// Formato CLP
const currencyCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    totalAmount,
    totalQuantity,
    updateItemQuantity,
    removeItem,
    clear,
    isLoading,
  } = useCart();

  const goToCheckout = () => {
    router.push("/checkout");
  };

  // 🧺 CARRITO VACÍO
  if (!items || items.length === 0) {
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-12 text-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">Carrito</h1>
        </div>

        <div className="w-full max-w-md rounded-3xl border border-emerald-200 bg-emerald-50/60 px-6 py-8 shadow-sm space-y-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl">🧺</span>
            <h2 className="text-xl font-semibold text-emerald-900">
              Tu carrito está vacío
            </h2>
          </div>

          <p className="text-base text-emerald-900">
            Aún no has agregado productos. Explora nuestro catálogo y selecciona los artículos que necesitas para tu hogar o empresa.
          </p>

          <div className="flex flex-col items-center gap-3 pt-2">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-emerald-500"
            >
              Ver catálogo
            </Link>
            <p className="text-xs text-emerald-900/80">
              Tip: puedes volver a esta página en cualquier momento desde el botón <strong>Carrito</strong> del menú superior.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // 🧼 CARRITO CON PRODUCTOS
  return (
    <section className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold text-foreground">Carrito</h1>
        <p className="text-base text-muted-foreground">
          Revisa tus productos antes de continuar con el pago.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
        {/* Lista de productos */}
        <div className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Productos en el carrito</h2>

          <ul className="space-y-3 text-sm">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-white px-4 py-3 md:flex-row md:items-center md:justify-between"
              >
                {/* Información del producto */}
                <div className="space-y-1">
                  <p className="text-base font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Precio unitario:{" "}
                    <span className="font-semibold">{formatCLP(toNumber(item.price))}</span>
                  </p>
                </div>

                {/* Cantidad + total + eliminar */}
                <div className="flex flex-col items-end gap-2 md:flex-row md:items-center">
                  {/* Cantidad */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateItemQuantity(item.productId, Math.max(1, item.quantity - 1))
                      }
                      disabled={isLoading}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-lg leading-none hover:bg-emerald-50 disabled:opacity-40"
                    >
                      –
                    </button>

                    <span className="min-w-[2rem] text-center text-base font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateItemQuantity(item.productId, item.quantity + 1)
                      }
                      disabled={isLoading}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-lg leading-none hover:bg-emerald-50 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  {/* Total + eliminar */}
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-base font-semibold text-emerald-700">
                      {currencyCLP.format(toNumber(item.price) * item.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      disabled={isLoading}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700 disabled:opacity-40"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Acciones del carrito */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            <button
              type="button"
              onClick={clear}
              disabled={isLoading}
              className="text-sm font-medium text-rose-600 hover:text-rose-700 disabled:opacity-40"
            >
              Vaciar carrito
            </button>

            <Link
              href="/catalogo"
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              ← Seguir comprando
            </Link>
          </div>
        </div>

        {/* Resumen */}
        <aside className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Resumen</h2>

          <div className="space-y-1 text-base">
            <p className="flex items-center justify-between">
              <span>Productos</span>
              <span className="font-semibold">{totalQuantity}</span>
            </p>

            <p className="flex items-center justify-between">
              <span>Total</span>
              <span className="text-xl font-semibold text-emerald-700">
                {currencyCLP.format(totalAmount)}
              </span>
            </p>

            <p className="text-xs text-muted-foreground">
              El costo de despacho se coordina y confirma posteriormente.
            </p>
          </div>

          <button
            type="button"
            onClick={goToCheckout}
            className="mt-2 w-full rounded-2xl bg-emerald-600 py-2.5 text-base font-semibold text-white hover:bg-emerald-500"
          >
            Continuar al pago
          </button>
        </aside>
      </div>
    </section>
  );
}
