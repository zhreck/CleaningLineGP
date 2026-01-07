"use client";

import { useEffect, useState } from "react";
import { getOrderStats } from "../../lib/ordersApi";

const currencyCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    activeOrders: 0,
    topProducts: [] as Array<{ name: string; quantity: number }>,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getOrderStats();
      setStats(data);
    } catch (err: any) {
      console.error("Error cargando estadísticas:", err);
      setError(err.message || "Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Resumen</h1>
          <p className="text-sm text-muted-foreground">
            Cargando estadísticas...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Resumen</h1>
          <p className="text-sm text-rose-600">{error}</p>
        </div>
        <button
          onClick={loadStats}
          className="rounded-2xl bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-emerald-500"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Resumen</h1>
        <p className="text-sm text-muted-foreground">
          Visión general de ventas, clientes y actividad reciente.
        </p>
      </div>

      {/* Tarjetas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-card text-card-foreground border border-border shadow-sm px-4 py-3">
          <p className="text-xs text-muted-foreground">Ingresos totales</p>
          <p className="mt-2 text-2xl font-semibold">
            {currencyCLP.format(stats.totalRevenue)}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Total acumulado
          </p>
        </div>

        <div className="rounded-3xl bg-card text-card-foreground border border-border shadow-sm px-4 py-3">
          <p className="text-xs text-muted-foreground">Total clientes</p>
          <p className="mt-2 text-2xl font-semibold">{stats.totalCustomers}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Usuarios + invitados
          </p>
        </div>

        <div className="rounded-3xl bg-card text-card-foreground border border-border shadow-sm px-4 py-3">
          <p className="text-xs text-muted-foreground">Órdenes activas</p>
          <p className="mt-2 text-2xl font-semibold">{stats.activeOrders}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Estado pendiente
          </p>
        </div>

        <div className="rounded-3xl bg-card text-card-foreground border border-border shadow-sm px-4 py-3">
          <p className="text-xs text-muted-foreground">Total órdenes</p>
          <p className="mt-2 text-2xl font-semibold">{stats.totalOrders}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Todas las órdenes
          </p>
        </div>
      </div>

      {/* Zona con "gráfico" y detalle lateral (estático por ahora) */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Gráfico fake */}
        <div className="rounded-3xl bg-card border border-border px-4 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total visitors</p>
              <p className="text-xs text-muted-foreground">
                Últimos 7 días (mock)
              </p>
            </div>
            <div className="inline-flex rounded-full border border-border bg-background text-[11px]">
              <button className="px-3 py-1 text-muted-foreground">
                30 días
              </button>
              <button className="px-3 py-1 rounded-full bg-primary text-primary-foreground">
                7 días
              </button>
            </div>
          </div>

          {/* "gráfico" con degradados similares */}
          <div className="mt-2 h-40 rounded-2xl bg-gradient-to-br from-primary/40 via-primary/10 to-emerald-400/40 relative overflow-hidden">
            <div className="absolute inset-x-0 inset-y-1/2 border-t border-white/10" />
            {/* puedes reemplazar esto por un chart real después */}
          </div>
        </div>

        {/* Panel lateral */}
        <div className="rounded-3xl bg-card border border-border px-4 py-4 flex flex-col gap-3">
          <p className="text-sm font-medium">Top productos</p>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay datos de productos
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {stats.topProducts.map((product, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{product.name}</span>
                  <span className="font-medium">+{product.quantity}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
