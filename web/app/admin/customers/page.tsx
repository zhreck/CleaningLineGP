// web/app/admin/customers/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllUsers } from "../../../lib/usersApi";
import { getAllOrders } from "../../../lib/ordersApi";

const currencyCLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
});

type CustomerData = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    createdAt: string;
    ordersCount: number;
    totalSpent: number;
    type: "user" | "guest";
};

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    // ──────────────── CARGA INICIAL ────────────────
    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            setError("");

            // Obtener usuarios registrados y órdenes
            const [users, orders] = await Promise.all([
                getAllUsers(),
                getAllOrders(),
            ]);

            // Crear mapa de clientes con sus estadísticas
            const customerMap = new Map<string, CustomerData>();

            // Agregar usuarios registrados
            users.forEach((user) => {
                customerMap.set(user.email, {
                    id: `USER-${user.id}`,
                    name: user.email.split("@")[0], // Usar parte del email como nombre
                    email: user.email,
                    phone: undefined,
                    createdAt: new Date().toISOString(), // Fecha actual por defecto
                    ordersCount: 0,
                    totalSpent: 0,
                    type: "user",
                });
            });

            // Procesar órdenes para calcular estadísticas
            orders.forEach((order: any) => {
                const email = order.user?.email || order.customerEmail;

                if (!email) return;

                const existing = customerMap.get(email);

                if (existing) {
                    // Cliente ya existe (usuario registrado o invitado)
                    existing.ordersCount += 1;
                    existing.totalSpent += Number(order.total);

                    // Actualizar fecha con la orden más antigua
                    if (order.createdAt && new Date(order.createdAt) < new Date(existing.createdAt)) {
                        existing.createdAt = order.createdAt;
                    }

                    // Actualizar nombre y teléfono si no existen
                    if (!existing.name || existing.name === email.split("@")[0]) {
                        existing.name = order.customerName || existing.name;
                    }
                    if (!existing.phone && order.customerPhone) {
                        existing.phone = order.customerPhone;
                    }
                } else {
                    // Cliente invitado (no tiene cuenta)
                    customerMap.set(email, {
                        id: `GUEST-${email}`,
                        name: order.customerName || email.split("@")[0],
                        email: email,
                        phone: order.customerPhone,
                        createdAt: order.createdAt,
                        ordersCount: 1,
                        totalSpent: Number(order.total),
                        type: "guest" as const,
                    });
                }
            });

            const customersArray = Array.from(customerMap.values());
            setCustomers(customersArray);
        } catch (err: any) {
            console.error("Error cargando clientes:", err);
            setError(err.message || "Error al cargar clientes");
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = useMemo(() => {
        const text = search.trim().toLowerCase();

        return customers
            .slice()
            .sort(
                (a, b) =>
                    new Date(b.createdAt || "").getTime() -
                    new Date(a.createdAt || "").getTime()
            )
            .filter((c) => {
                if (!text) return true;
                return (
                    c.name.toLowerCase().includes(text) ||
                    c.email.toLowerCase().includes(text) ||
                    (c.phone ?? "").toLowerCase().includes(text)
                );
            });
    }, [customers, search]);

    const totalCustomers = customers.length;
    const totalOrders = customers.reduce(
        (acc, c) => acc + (c.ordersCount ?? 0),
        0
    );
    const totalRevenue = customers.reduce(
        (acc, c) => acc + (c.totalSpent ?? 0),
        0
    );

    if (loading) {
        return (
            <p className="text-base text-muted-foreground">
                Cargando clientes…
            </p>
        );
    }

    if (error) {
        return (
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Clientes</h2>
                <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
                <button
                    onClick={loadCustomers}
                    className="rounded-2xl bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-emerald-500"
                >
                    Reintentar
                </button>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            {/* Encabezado con métricas */}
            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Clientes
                        </h2>
                        <p className="text-base text-foreground">
                            Registro de clientes que han comprado o creado cuenta.
                        </p>
                    </div>
                    <button
                        onClick={loadCustomers}
                        className="rounded-2xl border border-border px-4 py-2 text-sm hover:bg-muted"
                    >
                        Actualizar
                    </button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-3xl border border-border bg-card px-5 py-4 text-card-foreground shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">
                            Clientes registrados
                        </p>
                        <p className="mt-2 text-3xl font-semibold">
                            {totalCustomers}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-border bg-card px-5 py-4 text-card-foreground shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">
                            Órdenes asociadas
                        </p>
                        <p className="mt-2 text-3xl font-semibold">
                            {totalOrders}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-border bg-card px-5 py-4 text-card-foreground shadow-sm">
                        <p className="text-sm font-medium text-muted-foreground">
                            Total en compras
                        </p>
                        <p className="mt-2 text-3xl font-semibold">
                            {currencyCLP.format(totalRevenue)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filtro de búsqueda */}
            <div className="flex flex-wrap gap-3 text-base">
                <input
                    placeholder="Buscar por nombre, correo o teléfono…"
                    className="min-w-[260px] flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-base outline-none focus:border-emerald-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Tabla de clientes */}
            {filteredCustomers.length === 0 ? (
                <p className="text-base text-muted-foreground">
                    No hay clientes que coincidan con la búsqueda.
                </p>
            ) : (
                <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-sm">
                    <table className="min-w-full text-left text-base">
                        <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-5 py-3">Nombre</th>
                                <th className="px-5 py-3">Contacto</th>
                                <th className="px-5 py-3 hidden md:table-cell">Tipo</th>
                                <th className="px-5 py-3 hidden md:table-cell">
                                    Registrado
                                </th>
                                <th className="px-5 py-3">Órdenes</th>
                                <th className="px-5 py-3">Total gastado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((c) => (
                                <tr
                                    key={c.id}
                                    className="border-t border-border/70 hover:bg-muted/60"
                                >
                                    <td className="px-5 py-3">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground">
                                                {c.name}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                ID: {c.id}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-5 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-foreground">
                                                {c.email}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {c.phone || "Sin teléfono"}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-5 py-3 hidden md:table-cell">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.type === "user"
                                                ? "bg-emerald-100 text-emerald-800"
                                                : "bg-blue-100 text-blue-800"
                                                }`}
                                        >
                                            {c.type === "user" ? "Usuario" : "Invitado"}
                                        </span>
                                    </td>

                                    <td className="px-5 py-3 hidden md:table-cell text-sm text-muted-foreground">
                                        {c.createdAt
                                            ? new Date(c.createdAt).toLocaleDateString(
                                                "es-CL"
                                            )
                                            : "Sin fecha"}
                                    </td>

                                    <td className="px-5 py-3">
                                        <span className="text-base font-semibold">
                                            {c.ordersCount ?? 0}
                                        </span>
                                    </td>

                                    <td className="px-5 py-3">
                                        <span className="text-base font-semibold">
                                            {currencyCLP.format(c.totalSpent ?? 0)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
