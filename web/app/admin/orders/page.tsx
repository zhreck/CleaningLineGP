// web/app/admin/orders/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllOrders } from "../../../lib/ordersApi";
import { formatCLP } from "../../../lib/price";

// Tipo de orden del backend
type BackendOrder = {
    id: number;
    user?: {
        id: number;
        email: string;
    } | null;
    items: Array<{
        id: number;
        product: {
            id: number;
            name: string;
        };
        quantity: number;
        price: number;
    }>;
    status: string;
    total: number;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    deliveryType?: string;
    customerAddress?: string;
    createdAt: string;
    updatedAt: string;
};

type OrderStatus = "pending" | "completed" | "cancelled";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<BackendOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
    const [selectedOrder, setSelectedOrder] = useState<BackendOrder | null>(null);

    // Cargar órdenes desde el backend
    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getAllOrders();
            setOrders(data as any);
        } catch (err: any) {
            console.error("Error cargando órdenes:", err);
            setError(err.message || "Error al cargar las órdenes");
        } finally {
            setLoading(false);
        }
    };

    // Filtros
    const filteredOrders = useMemo(() => {
        const text = search.trim().toLowerCase();

        return orders
            .slice()
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .filter((order) => {
                const matchesStatus =
                    statusFilter === "all" || order.status === statusFilter;

                const matchesText =
                    !text ||
                    order.id.toString().includes(text) ||
                    order.customerName.toLowerCase().includes(text) ||
                    order.customerEmail.toLowerCase().includes(text);

                return matchesStatus && matchesText;
            });
    }, [orders, search, statusFilter]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return {
                    label: "Pendiente",
                    className: "bg-amber-100 text-amber-800",
                };
            case "completed":
                return {
                    label: "Completada",
                    className: "bg-emerald-100 text-emerald-800",
                };
            case "cancelled":
                return {
                    label: "Cancelada",
                    className: "bg-neutral-200 text-neutral-800",
                };
            default:
                return {
                    label: status,
                    className: "bg-gray-100 text-gray-800",
                };
        }
    };

    if (loading) {
        return (
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Órdenes</h2>
                <p className="text-base text-muted-foreground">Cargando órdenes...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Órdenes</h2>
                <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
                <button
                    onClick={loadOrders}
                    className="rounded-2xl bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-emerald-500"
                >
                    Reintentar
                </button>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            {/* Encabezado */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Órdenes</h2>
                    <p className="text-base text-foreground">
                        Total: {orders.length} órdenes
                    </p>
                </div>
                <button
                    onClick={loadOrders}
                    className="rounded-2xl border border-border px-4 py-2 text-sm hover:bg-muted"
                >
                    Actualizar
                </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-3 text-base">
                <input
                    placeholder="Buscar por N° de orden, nombre o correo…"
                    className="min-w-[260px] flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-base outline-none focus:border-emerald-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value as typeof statusFilter)
                    }
                    className="rounded-full border border-border bg-background px-4 py-2.5 text-base outline-none focus:border-emerald-500"
                >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendiente</option>
                    <option value="completed">Completada</option>
                    <option value="cancelled">Cancelada</option>
                </select>
            </div>

            {/* Tabla */}
            {filteredOrders.length === 0 ? (
                <p className="text-base text-muted-foreground">
                    No hay órdenes que coincidan con el filtro.
                </p>
            ) : (
                <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-sm">
                    <table className="min-w-full text-left text-base">
                        <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-5 py-3">N° Orden</th>
                                <th className="px-5 py-3">Cliente</th>
                                <th className="px-5 py-3 hidden md:table-cell">Tipo</th>
                                <th className="px-5 py-3">Total</th>
                                <th className="px-5 py-3">Estado</th>
                                <th className="px-5 py-3 hidden md:table-cell">Fecha</th>
                                <th className="px-5 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => {
                                const badge = getStatusBadge(order.status);
                                const isGuest = !order.user;

                                return (
                                    <tr
                                        key={order.id}
                                        className="border-t border-border/70 hover:bg-muted/60"
                                    >
                                        <td className="px-5 py-3 font-semibold">#{order.id}</td>

                                        <td className="px-5 py-3">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">
                                                    {order.customerName}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {order.customerEmail}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-3 hidden md:table-cell">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isGuest
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-emerald-100 text-emerald-800"
                                                    }`}
                                            >
                                                {isGuest ? "Invitado" : "Usuario"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3 font-semibold">
                                            {formatCLP(order.total)}
                                        </td>

                                        <td className="px-5 py-3">
                                            <span
                                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
                                            >
                                                {badge.label}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3 hidden md:table-cell text-sm text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleString("es-CL", {
                                                dateStyle: "short",
                                                timeStyle: "short",
                                            })}
                                        </td>

                                        <td className="px-5 py-3 text-right">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="rounded-full border border-border px-4 py-1.5 text-sm hover:border-emerald-500 hover:text-emerald-700"
                                            >
                                                Ver detalle
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal detalle de orden */}
            {selectedOrder && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-3xl rounded-3xl border border-border bg-background p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold">
                                Detalle orden #{selectedOrder.id}
                            </h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="rounded-full border border-border px-3 py-1 text-sm hover:bg-muted"
                            >
                                Cerrar
                            </button>
                        </div>

                        <div className="mb-4 space-y-1 text-base">
                            <p>
                                <span className="font-medium">Cliente:</span>{" "}
                                {selectedOrder.customerName}
                            </p>
                            <p>
                                <span className="font-medium">Correo:</span>{" "}
                                {selectedOrder.customerEmail}
                            </p>
                            <p>
                                <span className="font-medium">Teléfono:</span>{" "}
                                {selectedOrder.customerPhone || "Sin teléfono"}
                            </p>
                            <p>
                                <span className="font-medium">Tipo:</span>{" "}
                                {selectedOrder.user ? "Usuario registrado" : "Invitado"}
                            </p>
                            {selectedOrder.deliveryType && (
                                <p>
                                    <span className="font-medium">Entrega:</span>{" "}
                                    {selectedOrder.deliveryType === "delivery"
                                        ? "A domicilio"
                                        : "Retiro en tienda"}
                                </p>
                            )}
                            {selectedOrder.customerAddress && (
                                <p>
                                    <span className="font-medium">Dirección:</span>{" "}
                                    {selectedOrder.customerAddress}
                                </p>
                            )}
                            <p>
                                <span className="font-medium">Fecha:</span>{" "}
                                {new Date(selectedOrder.createdAt).toLocaleString("es-CL", {
                                    dateStyle: "full",
                                    timeStyle: "short",
                                })}
                            </p>
                        </div>

                        <div className="mb-4 rounded-2xl border border-border bg-card">
                            <table className="min-w-full text-left text-base">
                                <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-2">Producto</th>
                                        <th className="px-4 py-2 text-center">Cantidad</th>
                                        <th className="px-4 py-2 text-right">Precio</th>
                                        <th className="px-4 py-2 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-t border-border/70"
                                        >
                                            <td className="px-4 py-2">{item.product.name}</td>
                                            <td className="px-4 py-2 text-center">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                {formatCLP(item.price)}
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                {formatCLP(item.price * item.quantity)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-end gap-4 text-lg font-semibold">
                            <span>Total:</span>
                            <span>{formatCLP(selectedOrder.total)}</span>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
