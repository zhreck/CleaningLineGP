// web/app/checkout/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../components/cart/cartContext";
import { useAuth } from "../../contexts/AuthContext";
import { toNumber, formatCLP } from "../../lib/price";
import { createWebpayTransaction } from "../../lib/paymentsApi";
import { createCheckoutOrder } from "../../lib/ordersApi";

type DeliveryType = "pickup" | "delivery";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clear } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Datos del cliente
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerRut, setCustomerRut] = useState("");

  // Datos de entrega
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("pickup");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerRegion, setCustomerRegion] = useState("");
  const [customerCommune, setCustomerCommune] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prellenar datos si el usuario está autenticado
  useEffect(() => {
    if (user) {
      setCustomerEmail(user.email || "");
    }
  }, [user]);

  // Si no hay productos en el carrito
  if (!items || items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          No tienes productos en el carrito
        </h1>
        <p className="text-base text-muted-foreground">
          Agrega algunos productos antes de continuar al pago.
        </p>
        <Link
          href="/catalogo"
          className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-emerald-500"
        >
          Ir al catálogo
        </Link>
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setError("Por favor completa todos los campos requeridos del comprador.");
      return;
    }

    if (deliveryType === "delivery") {
      if (!customerAddress.trim() || !customerRegion.trim() || !customerCommune.trim()) {
        setError("Para envío a domicilio debes completar todos los datos de dirección.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Crear la orden en el backend
      const orderData = {
        deliveryType,
        notes: notes.trim() || undefined,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        customerRut: customerRut.trim() || undefined,
        customerAddress: deliveryType === "delivery" ? customerAddress.trim() : undefined,
        customerRegion: deliveryType === "delivery" ? customerRegion.trim() : undefined,
        customerCommune: deliveryType === "delivery" ? customerCommune.trim() : undefined,
      };

      const order = await createCheckoutOrder(orderData, items);

      // Crear la transacción de Webpay
      const webpayData = await createWebpayTransaction(order.id);

      // Vaciar carrito antes de redirigir
      await clear();

      // Redirigir a Webpay
      window.location.href = `${webpayData.url}?token_ws=${webpayData.token}`;
    } catch (err: any) {
      console.error("Error al procesar el pago:", err);
      setError(err.message || "Ocurrió un error al procesar tu pedido. Intenta nuevamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold text-foreground">
          Confirmar pedido
        </h1>
        <p className="text-base text-muted-foreground">
          Completa tus datos y elige el tipo de entrega para continuar al pago.
        </p>
      </header>

      {/* Aviso para invitados */}
      {!isAuthenticated && (
        <div className="rounded-2xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Puedes comprar como invitado o{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-emerald-700 hover:text-emerald-800"
          >
            iniciar sesión
          </Link>{" "}
          para guardar tu historial de pedidos.
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
        {/* Columna izquierda: formulario */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-sm"
        >
          {/* Datos del comprador */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Datos del comprador
            </h2>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-foreground">
                Nombre completo *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full rounded-2xl border border-border bg-white px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">
                  Email *
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-border bg-white px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-border bg-white px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="+56 9 1234 5678"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-foreground">
                RUT (opcional)
              </label>
              <input
                type="text"
                value={customerRut}
                onChange={(e) => setCustomerRut(e.target.value)}
                className="w-full rounded-2xl border border-border bg-white px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="12.345.678-9"
              />
            </div>
          </div>

          {/* Tipo de entrega */}
          <div className="space-y-3 pt-2">
            <h2 className="text-lg font-semibold text-foreground">
              Tipo de entrega
            </h2>

            <div className="space-y-3">
              <label className="flex items-start gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground cursor-pointer hover:border-emerald-500">
                <input
                  type="radio"
                  name="deliveryType"
                  value="pickup"
                  checked={deliveryType === "pickup"}
                  onChange={() => setDeliveryType("pickup")}
                  className="mt-[2px] h-4 w-4"
                />
                <div>
                  <p className="font-semibold">Retiro en tienda</p>
                  <p className="text-xs text-muted-foreground">
                    Coordinaremos el lugar y horario exacto una vez confirmada la orden.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground cursor-pointer hover:border-emerald-500">
                <input
                  type="radio"
                  name="deliveryType"
                  value="delivery"
                  checked={deliveryType === "delivery"}
                  onChange={() => setDeliveryType("delivery")}
                  className="mt-[2px] h-4 w-4"
                />
                <div>
                  <p className="font-semibold">Envío a domicilio</p>
                  <p className="text-xs text-muted-foreground">
                    Ingresas tu dirección y calculamos el despacho al coordinar el pedido.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Dirección solo si es envío */}
          {deliveryType === "delivery" && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold text-foreground">
                Dirección de envío
              </h3>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">
                  Dirección *
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  required={deliveryType === "delivery"}
                  className="w-full rounded-2xl border border-border bg-white px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Ej: Calle 1234, depto. 201"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-foreground">
                    Comuna *
                  </label>
                  <input
                    type="text"
                    value={customerCommune}
                    onChange={(e) => setCustomerCommune(e.target.value)}
                    required={deliveryType === "delivery"}
                    className="w-full rounded-2xl border border-border bg-white px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Ej: La Florida"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-foreground">
                    Región *
                  </label>
                  <input
                    type="text"
                    value={customerRegion}
                    onChange={(e) => setCustomerRegion(e.target.value)}
                    required={deliveryType === "delivery"}
                    className="w-full rounded-2xl border border-border bg-white px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Ej: Región Metropolitana"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notas opcionales */}
          <div className="space-y-1 pt-2">
            <label className="block text-xs font-medium text-foreground">
              Notas para el pedido (opcional)
            </label>
            <textarea
              className="w-full rounded-2xl border border-border bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Referencias para llegar, horarios preferidos, etc."
            />
          </div>

          {/* Botón confirmar */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-8 py-2.5 text-base font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Redirigiendo a Webpay..." : "Continuar al pago"}
            </button>
          </div>
        </form>

        {/* Columna derecha: resumen del pedido */}
        <aside className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">
            Resumen del pedido
          </h2>

          <ul className="space-y-3 text-sm">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white px-3 py-2"
              >
                <div>
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-emerald-700">
                  {formatCLP(item.total || (toNumber(item.price) * item.quantity))}
                </p>
              </li>
            ))}
          </ul>

          <div className="border-t border-border pt-3 space-y-1">
            <p className="flex items-center justify-between text-base font-semibold text-foreground">
              <span>Total</span>
              <span>{formatCLP(totalAmount)}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              El costo de despacho se coordina y confirma posteriormente.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
