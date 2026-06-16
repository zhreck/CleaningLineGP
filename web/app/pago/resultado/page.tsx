"use client";
export const dynamic = 'force-dynamic';

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { commitWebpayPayment } from "../../../lib/paymentsApi";
import { formatCLP } from "../../../lib/price";

type PaymentResult = {
    status: string;
    orderId: number;
    amount: number;
    authorizationCode?: string;
    paymentTypeCode?: string;
};

function PaymentResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [result, setResult] = useState<PaymentResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const processPayment = async () => {
            const token_ws = searchParams?.get("token_ws");

            if (!token_ws) {
                setError("No se recibió el token de pago. Por favor intenta nuevamente.");
                setLoading(false);
                return;
            }

            try {
                const paymentResult = await commitWebpayPayment(token_ws);
                setResult(paymentResult);
            } catch (err: any) {
                console.error("Error al confirmar el pago:", err);
                setError(err.message || "Ocurrió un error al confirmar el pago.");
            } finally {
                setLoading(false);
            }
        };

        processPayment();
    }, [searchParams]);

    // Estado de carga
    if (loading) {
        return (
            <section className="mx-auto max-w-3xl px-4 py-12 text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold text-foreground">
                        Procesando pago...
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Por favor espera mientras confirmamos tu pago.
                    </p>
                </div>

                <div className="flex justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
                </div>
            </section>
        );
    }

    // Error
    if (error || !result) {
        return (
            <section className="mx-auto max-w-3xl px-4 py-12 text-center space-y-6">
                <div className="space-y-2">
                    <span className="text-6xl">❌</span>
                    <h1 className="text-3xl font-semibold text-foreground">
                        Error en el pago
                    </h1>
                    <p className="text-base text-muted-foreground">
                        {error || "No se pudo procesar el pago."}
                    </p>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <Link
                        href="/cart"
                        className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-emerald-500"
                    >
                        Volver al carrito
                    </Link>
                    <Link
                        href="/catalogo"
                        className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                    >
                        Ir al catálogo
                    </Link>
                </div>
            </section>
        );
    }

    // Pago exitoso
    if (result.status === "paid") {
        return (
            <section className="mx-auto max-w-3xl px-4 py-12 text-center space-y-6">
                <div className="space-y-2">
                    <span className="text-6xl">✅</span>
                    <h1 className="text-3xl font-semibold text-emerald-900">
                        ¡Pago exitoso!
                    </h1>
                    <p className="text-base text-muted-foreground">
                        Tu pago ha sido procesado correctamente.
                    </p>
                </div>

                <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 px-6 py-6 space-y-4">
                    <h2 className="text-lg font-semibold text-emerald-900">
                        Detalles del pago
                    </h2>

                    <div className="space-y-2 text-sm text-emerald-900">
                        <div className="flex justify-between">
                            <span className="font-medium">Número de orden:</span>
                            <span className="font-semibold">#{result.orderId}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="font-medium">Monto pagado:</span>
                            <span className="font-semibold">{formatCLP(result.amount)}</span>
                        </div>

                        {result.authorizationCode && (
                            <div className="flex justify-between">
                                <span className="font-medium">Código de autorización:</span>
                                <span className="font-semibold">{result.authorizationCode}</span>
                            </div>
                        )}

                        {result.paymentTypeCode && (
                            <div className="flex justify-between">
                                <span className="font-medium">Tipo de pago:</span>
                                <span className="font-semibold">
                                    {result.paymentTypeCode === "VD" ? "Débito" :
                                        result.paymentTypeCode === "VN" ? "Crédito" :
                                            result.paymentTypeCode}
                                </span>
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-emerald-900/80 pt-2">
                        Recibirás un correo de confirmación con los detalles de tu pedido.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-3 pt-4">
                    <Link
                        href="/profile"
                        className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-emerald-500"
                    >
                        Ver mis pedidos
                    </Link>
                    <Link
                        href="/catalogo"
                        className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                    >
                        Seguir comprando
                    </Link>
                </div>
            </section>
        );
    }

    // Pago rechazado
    return (
        <section className="mx-auto max-w-3xl px-4 py-12 text-center space-y-6">
            <div className="space-y-2">
                <span className="text-6xl">⚠️</span>
                <h1 className="text-3xl font-semibold text-amber-900">
                    Pago rechazado
                </h1>
                <p className="text-base text-muted-foreground">
                    Tu pago no pudo ser procesado.
                </p>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50/60 px-6 py-6 space-y-4">
                <h2 className="text-lg font-semibold text-amber-900">
                    Información del intento
                </h2>

                <div className="space-y-2 text-sm text-amber-900">
                    <div className="flex justify-between">
                        <span className="font-medium">Número de orden:</span>
                        <span className="font-semibold">#{result.orderId}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-medium">Monto:</span>
                        <span className="font-semibold">{formatCLP(result.amount)}</span>
                    </div>
                </div>

                <p className="text-xs text-amber-900/80 pt-2">
                    Por favor verifica los datos de tu tarjeta e intenta nuevamente.
                </p>
            </div>

            <div className="flex flex-col items-center gap-3 pt-4">
                <Link
                    href="/cart"
                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-emerald-500"
                >
                    Intentar nuevamente
                </Link>
                <Link
                    href="/catalogo"
                    className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
                    Volver al catálogo
                </Link>
            </div>
        </section>
    );
}

export default function PaymentResultPage() {
    return (
        <Suspense fallback={<div className="mx-auto max-w-3xl py-12 text-center">Cargando...</div>}>
            <PaymentResultContent />
        </Suspense>
    );
}
