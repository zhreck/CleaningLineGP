// web/lib/cart.ts
import type { Product, CartItem } from "./types";

const CART_KEY = "cart_v1";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getCart(): CartItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product: Product, quantity = 1): CartItem[] {
  const cart = getCart();
  const index = cart.findIndex((item) => item.productId === product.id);

  if (index >= 0) {
    cart[index].quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
    });
  }

  saveCart(cart);
  return cart;
}

export function updateQuantity(
  productId: string,
  quantity: number
): CartItem[] {
  const cart = getCart().map((item) =>
    item.productId === productId ? { ...item, quantity } : item
  );
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart().filter((item) => item.productId !== productId);
  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartTotals(cart: CartItem[]) {
  return cart.reduce(
    (totals, item) => {
      totals.totalQuantity += item.quantity;
      totals.totalAmount += item.quantity * item.price;
      return totals;
    },
    { totalQuantity: 0, totalAmount: 0 }
  );
}
