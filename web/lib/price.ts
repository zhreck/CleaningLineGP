import type { Product } from "./types";

export function toNumber(price: string | number): number {
    if (typeof price === "number") {
        // Si ya es número, verificar que no sea NaN
        return isNaN(price) ? 0 : price;
    }

    if (typeof price === "string") {
        // Limpiar string: remover $, puntos, comas y espacios
        const cleaned = price.replace(/[$\.\s,]/g, "");
        const parsed = Number(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    }

    // Fallback seguro
    return 0;
}

export function getFinalPrice(product: Product): number {
    const basePrice = toNumber(product.price);

    if (product.isOnSale && product.discountPercent && product.discountPercent > 0) {
        const discount = product.discountPercent / 100;
        const finalPrice = basePrice * (1 - discount);
        return Math.round(finalPrice);
    }

    return basePrice;
}

export function formatCLP(amount: number): string {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatPriceInput(value: string): string {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";

    // Format with thousands separator
    const number = parseInt(digits);
    return `$${number.toLocaleString("es-CL")}`;
}

export function parsePriceInput(formattedValue: string): number {
    // Remove $ and dots, convert to number
    const digits = formattedValue.replace(/\D/g, "");
    return digits ? parseInt(digits) : 0;
}