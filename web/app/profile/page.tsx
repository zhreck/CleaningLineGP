// web/app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ⚠️ Tu proyecto usa ESTA ruta para AuthContext (HEAD)
import { useAuth } from "../../contexts/AuthContext";

// Enmascara el correo para mayor privacidad
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;

  if (local.length <= 2) {
    return `${"*".repeat(local.length)}@${domain}`;
  }

  const visible = local.slice(0, 2);
  const masked = "*".repeat(Math.max(local.length - 2, 2));
  return `${visible}${masked}@${domain}`;
}

// Tipo simple para los pedidos recientes (resumen)
type LocalOrderSummary = {
  id: string;
  date: string;
  totalAmount: number;
  status: string;
};

// formato CLP
const currencyCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default function ProfilePage() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  // Estados de dirección
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  // Pedidos recientes
  const [recentOrders, setRecentOrders] = useState<LocalOrderSummary[]>([]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage("Dirección guardada para futuros envíos.");
    setTimeout(() => setSavedMessage(""), 2500);
  };

  // Cargar pedidos desde el backend API
  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      try {
        const { getMyOrders } = await import("../../lib/ordersApi");
        const orders = await getMyOrders();

        const mapped: LocalOrderSummary[] = orders
          .sort((a, b) => {
            const da = new Date(a.createdAt).getTime();
            const db = new Date(b.createdAt).getTime();
            return db - da;
          })
          .slice(0, 3)
          .map((o) => ({
            id: o.id.toString(),
            date: o.createdAt,
            totalAmount: Number(o.total),
            status: o.status,
          }));

        setRecentOrders(mapped);
      } catch (error) {
        console.error("Error cargando órdenes:", error);
        setRecentOrders([]);
      }
    };

    loadOrders();
  }, [user]);

  // Si no hay usuario → página protegida
  if (!user) {
    return (
      <section className="mx-auto flex max-w-md flex-col gap-4 rounded-3xl border border-border bg-card px-6 py-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">
          Debes iniciar sesión
        </h1>
        <p className="text-base text-muted-foreground">
          Para ver tu perfil y el estado de tus pedidos, inicia sesión en tu cuenta.
        </p>

        <Link
          href="/auth/login"
          className="mt-2 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-emerald-500"
        >
          Ir a iniciar sesión
        </Link>
      </section>
    );
  }

  const maskedEmail = maskEmail(user.email ?? "");

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      {/* Encabezado */}
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold text-foreground">Mi cuenta</h1>
        <p className="text-base text-muted-foreground">
          Revisa tus datos personales, tu dirección de envío y tus pedidos recientes.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
        {/* IZQUIERDA: Perfil + dirección */}
        <div className="space-y-4">
          {/* Card usuario */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Bienvenido(a)
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {user.email.split('@')[0] ?? "Usuario"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Correo electrónico
              </p>
              <p className="text-base text-foreground tracking-wide">{maskedEmail}</p>
            </div>

            {/* Roles (viene de tu versión HEAD y se mantiene) */}
            {user.roles && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Roles</p>

                <div className="flex gap-2 mt-1">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${role === "admin"
                        ? "bg-emerald-900/50 text-emerald-300 border border-emerald-700"
                        : "bg-neutral-800 text-neutral-300 border border-neutral-700"
                        }`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-2xl border border-rose-300 bg-rose-50 px-5 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
            >
              Cerrar sesión
            </button>
          </div>

          {/* Dirección de envío */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Dirección de envío
            </h2>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-base">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-foreground">
                  Dirección
                </label>
                <input
                  className="w-full rounded-2xl border border-border bg-white px-3 py-2.5 text-base"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-sm font-medium">Ciudad</label>
                  <input
                    className="w-full rounded-2xl border border-border bg-white px-3 py-2.5 text-base"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium">Región</label>
                  <input
                    className="w-full rounded-2xl border border-border bg-white px-3 py-2.5 text-base"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-emerald-500"
              >
                Guardar dirección
              </button>

              {savedMessage && (
                <p className="text-sm text-emerald-700 pt-1">{savedMessage}</p>
              )}
            </form>
          </div>

          {/* Panel admin (tu versión HEAD lo traía) */}
          {isAdmin && (
            <div className="rounded-lg border border-emerald-800 bg-emerald-950/30 p-4">
              <p className="text-sm font-medium text-emerald-300 mb-2">
                Panel de administración
              </p>
              <button
                onClick={() => router.push("/admin")}
                className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Ir al panel de admin
              </button>
            </div>
          )}
        </div>

        {/* DERECHA: Pedidos recientes */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Pedidos recientes
          </h2>

          {recentOrders.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Aún no tienes pedidos registrados.
              </p>
              <Link
                href="/catalogo"
                className="inline-flex rounded-2xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            <ul className="space-y-3 text-sm">
              {recentOrders.map((order: LocalOrderSummary) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between rounded-2xl border border-border px-4 py-2.5"
                >
                  <div>
                    <p className="font-medium">Pedido #{order.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.date).toLocaleDateString("es-CL")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-emerald-700">
                      {currencyCLP.format(order.totalAmount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Estado: {order.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
