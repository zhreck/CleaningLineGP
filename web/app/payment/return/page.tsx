"use client";
export const dynamic = 'force-dynamic';

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { commitWebpayPayment } from "../../../lib/paymentsApi";

function PaymentReturnContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [paymentData, setPaymentData] = useState<any>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const token_ws = searchParams.get("token_ws");

        if (!token_ws) {
            setStatus("error");
            setError("Token de pago no encontrado");
            return;
        }

        const processPayment = async () => {
            try {
                const result = await commitWebpayPayment(token_ws);
                setPaymentData(result);

                if (result.status === "AUTHORIZED") {
                    setStatus("success");
                } else {
                    setStatus("error");
                    setError("El pago no fue autorizado");
                }
            } catch (err: any) {
                console.error("Error processing payment:", err);
                setStatus("error");
                setError(err.message || "Error al procesar el pago");
            }
        };

        processPayment();
    }, [searchParams]);

    if (status === "loading") {
        return (
            <section className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                <h1 className="text-2xl font-semibold text-foreground">
                    Procesando pago...
                </h1>
                <p className="text-muted-foreground">
                    Por favor espera mientras confirmamos tu transacción.
                </p>
            </section>
        );
    }

    if (status === "success") {
        return (
            <section className="mx-auto max-w-2xl px-4 py-16 text-center space-y-6">
                <div className="rounded-full bg-emerald-100 w-16 h-16 flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold text-foreground">
                        ¡Pago exitoso!
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Tu pedido ha sido confirmado y procesado correctamente.
                    </p>
                </div>

                {paymentData && (
                    <div className="bg-card border border-border rounded-2xl p-6 text-left space-y-3">
                        <h2 className="text-lg font-semibold text-foreground">Detalles del pago</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Código de autorización:</span>
                                <span className="font-medium">{paymentData.authorizationCode}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Monto:</span>
                                <span className="font-medium">${paymentData.amount?.toLocaleString('es-CL')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Orden:</span>
                                <span className="font-medium">{paymentData.buyOrder}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Recibirás un email de confirmación con los detalles de tu pedido.
                    </p>

                    <div className="flex gap-3 justify-center">
                        <Link
                            href="/catalogo"
                            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-emerald-500"
                        >
                            Seguir comprando
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-2xl border border-border bg-card px-6 py-2.5 text-base font-semibold text-foreground hover:bg-muted"
                        >
                            Ir al inicio
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-2xl px-4 py-16 text-center space-y-6">
            <div className="rounded-full bg-rose-100 w-16 h-16 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-foreground">
                    Error en el pago
                </h1>
                <p className="text-lg text-muted-foreground">
                    {error || "Hubo un problema al procesar tu pago."}
                </p>
            </div>

            <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                    Puedes intentar nuevamente o contactar con soporte si el problema persiste.
                </p>

                <div className="flex gap-3 justify-center">
                    <Link
                        href="/cart"
                        className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-emerald-500"
                    >
                        Volver al carrito
                    </Link>
                    <Link
                        href="/catalogo"
                        className="inline-flex items-center justify-center rounded-2xl border border-border bg-card px-6 py-2.5 text-base font-semibold text-foreground hover:bg-muted"
                    >
                        Seguir comprando
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default function PaymentReturnPage() {
    return (
        <Suspense fallback={<div className="mx-auto max-w-2xl py-16 text-center">Cargando...</div>}>
            <PaymentReturnContent />
        </Suspense>
    );
}