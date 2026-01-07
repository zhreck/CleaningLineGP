/**
 * API de Carrito - Integración con backend
 * 
 * El backend maneja automáticamente:
 * - Usuarios autenticados: carrito persistente en PostgreSQL
 * - Invitados: carrito temporal en Redis con cookies de sesión
 */

import { api } from './apiClient';
import type { CartResponse } from './types';

/**
 * Agregar un producto al carrito
 * POST /cart
 */
export async function addToCart(
    productId: number,
    quantity: number = 1
): Promise<CartResponse> {
    try {
        const response = await api.post<CartResponse>('/cart', {
            productId,
            quantity,
        });
        return response;
    } catch (error: any) {
        console.error('Error adding to cart:', error);
        throw new Error(error.message || 'Error al agregar producto al carrito');
    }
}

/**
 * Obtener el carrito actual
 * GET /cart
 */
export async function getCart(): Promise<CartResponse> {
    try {
        const response = await api.get<CartResponse>('/cart');
        return response;
    } catch (error: any) {
        console.error('Error fetching cart:', error);
        // Si hay error, devolver carrito vacío
        return {
            items: [],
            subtotal: 0,
            taxes: 0,
            total: 0,
        };
    }
}

/**
 * Eliminar un producto del carrito
 * DELETE /cart/:productId
 */
export async function removeFromCart(productId: number): Promise<CartResponse> {
    try {
        const response = await api.delete<CartResponse>(`/cart/${productId}`);
        return response;
    } catch (error: any) {
        console.error('Error removing from cart:', error);
        throw new Error(error.message || 'Error al eliminar producto del carrito');
    }
}

/**
 * Vaciar el carrito completamente
 * DELETE /cart
 */
export async function clearCart(): Promise<void> {
    try {
        await api.delete('/cart');
    } catch (error: any) {
        console.error('Error clearing cart:', error);
        throw new Error(error.message || 'Error al vaciar el carrito');
    }
}

/**
 * Actualizar la cantidad de un producto en el carrito
 * Nota: El backend no tiene endpoint específico para actualizar cantidad,
 * así que eliminamos y volvemos a agregar con la nueva cantidad
 */
export async function updateCartItemQuantity(
    productId: number,
    newQuantity: number
): Promise<CartResponse> {
    try {
        // Primero eliminamos el producto
        await removeFromCart(productId);

        // Luego lo agregamos con la nueva cantidad
        if (newQuantity > 0) {
            return await addToCart(productId, newQuantity);
        }

        // Si la cantidad es 0, solo devolvemos el carrito actual
        return await getCart();
    } catch (error: any) {
        console.error('Error updating cart item quantity:', error);
        throw new Error(error.message || 'Error al actualizar cantidad');
    }
}
