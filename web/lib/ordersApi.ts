// web/lib/ordersApi.ts
import { api, getAccessToken } from "./apiClient";

export interface OrderItemDto {
    productId: number;
    quantity: number;
    price: number;
}

export interface CreateCheckoutOrderDto {
    deliveryType: 'pickup' | 'delivery';
    notes?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerRut?: string;
    customerAddress?: string;
    customerRegion?: string;
    customerCommune?: string;
    items?: OrderItemDto[]; // Para checkout invitado
}

export interface Order {
    id: number;
    userId: number;
    total: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    items: {
        id: number;
        productId: number;
        quantity: number;
        price: number;
    }[];
}

/**
 * Crea una nueva orden desde el checkout (soporta invitados)
 */
export async function createCheckoutOrder(orderData: CreateCheckoutOrderDto, cartItems?: any[]): Promise<Order> {
    const token = getAccessToken();

    // Si no hay token (invitado), agregar items del carrito
    const payload = { ...orderData };
    if (!token && cartItems && cartItems.length > 0) {
        payload.items = cartItems.map(item => ({
            productId: Number(item.productId),
            quantity: Number(item.quantity),
            price: Number(item.price),
        }));
    }

    return api.post<Order>('/orders/checkout', payload);
}

/**
 * Obtiene las órdenes del usuario autenticado
 */
export async function getMyOrders(): Promise<Order[]> {
    const token = getAccessToken();

    if (!token) {
        throw new Error("No estás autenticado. Por favor inicia sesión.");
    }

    return api.get<Order[]>('/orders/mine');
}

/**
 * Obtiene todas las órdenes (solo admin)
 */
export async function getAllOrders(): Promise<Order[]> {
    const token = getAccessToken();

    if (!token) {
        throw new Error("No estás autenticado. Por favor inicia sesión.");
    }

    return api.get<Order[]>('/orders');
}

/**
 * Obtiene una orden específica por ID
 */
export async function getOrderById(orderId: number): Promise<Order> {
    const token = getAccessToken();

    if (!token) {
        throw new Error("No estás autenticado. Por favor inicia sesión.");
    }

    return api.get<Order>(`/orders/${orderId}`);
}

/**
 * Obtiene estadísticas del dashboard (solo admin)
 */
export async function getOrderStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    activeOrders: number;
    topProducts: Array<{ name: string; quantity: number }>;
}> {
    const token = getAccessToken();

    if (!token) {
        throw new Error("No estás autenticado. Por favor inicia sesión.");
    }

    return api.get('/orders/stats');
}
