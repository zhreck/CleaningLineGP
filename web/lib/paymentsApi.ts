// web/lib/paymentsApi.ts
import { api } from "./apiClient";

/**
 * Crea una transacción de pago en Webpay Plus (soporta invitados)
 */
export async function createWebpayTransaction(orderId: number): Promise<{
    url: string;
    token: string;
}> {
    const result = await api.post<{ data: { url: string; token: string } }>(
        '/payments/webpay/create',
        { orderId }
    );
    return result.data;
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
    const result = await api.post<{
        data: {
            status: string;
            orderId: number;
            amount: number;
            authorizationCode?: string;
            paymentTypeCode?: string;
        }
    }>(
        '/payments/webpay/commit',
        { token_ws }
    );
    return result.data;
}
