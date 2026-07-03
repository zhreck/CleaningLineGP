// web/lib/paymentsApi.ts
import { api } from "./apiClient";

/**
 * Crea una transacción de pago en Webpay Plus (soporta invitados)
 */
export async function createWebpayTransaction(orderId: number): Promise<{
    url: string;
    token: string;
}> {
    const result = await api.post<
        | { success: true; data: { url: string; token: string } }
        | { url: string; token: string }
    >(
        '/payments/webpay/create',
        { orderId }
    );

    if ('data' in result && result.data) {
        return result.data;
    }

    return result;
}

/**
 * Confirma una transacción de Webpay Plus
 */
export async function commitWebpayPayment(token_ws: string): Promise<{
    status: string;
    orderId: number;
    amount: number;
    authorizationCode?: string;
    paymentTypeCode?: string;
}> {
    const result = await api.post<
        | {
            success: true;
            data: {
                status: string;
                orderId: number;
                amount: number;
                authorizationCode?: string;
                paymentTypeCode?: string;
            };
        }
        | {
            status: string;
            orderId: number;
            amount: number;
            authorizationCode?: string;
            paymentTypeCode?: string;
        }
    >(
        '/payments/webpay/commit',
        { token_ws }
    );

    if ('data' in result && result.data) {
        return result.data;
    }

    return result;
}
