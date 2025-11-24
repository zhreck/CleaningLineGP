// web/components/cart/cartContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "../../lib/types";
import {
  getCart,
  addToCart as addToCartLib,
  updateQuantity as updateQuantityLib,
  removeFromCart as removeFromCartLib,
  clearCart as clearCartLib,
  getCartTotals,
} from "../../lib/cart";

type NotificationType = "success" | "info" | "error";

type CartNotification = {
  message: string;
  type: NotificationType;
} | null;

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  addItem: (product: Product, quantity?: number) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<CartNotification>(null);

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    setItems(getCart());
  }, []);

  const { totalQuantity, totalAmount } = getCartTotals(items);

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type });
    // Ocultar después de 1.5s
    setTimeout(() => {
      setNotification((current) =>
        current?.message === message ? null : current
      );
    }, 1500);
  };

  const addItem = (product: Product, quantity = 1) => {
    const updated = addToCartLib(product, quantity);
    setItems(updated);
    showNotification("Producto agregado al carrito", "success");
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    const updated = updateQuantityLib(productId, quantity);
    setItems(updated);
    showNotification("Cantidad actualizada", "info");
  };

  const removeItem = (productId: string) => {
    const updated = removeFromCartLib(productId);
    setItems(updated);
    showNotification("Producto eliminado del carrito", "info");
  };

  const clear = () => {
    clearCartLib();
    setItems([]);
    showNotification("Carrito vaciado", "info");
  };

  const value: CartContextValue = {
    items,
    totalQuantity,
    totalAmount,
    addItem,
    updateItemQuantity,
    removeItem,
    clear,
  };

  const bgColor =
    notification?.type === "success"
      ? "bg-emerald-600"
      : notification?.type === "error"
      ? "bg-rose-600"
      : "bg-slate-800";

  return (
    <CartContext.Provider value={value}>
      {children}

      {/* Toast de notificación del carrito */}
      {notification && (
        <div className="pointer-events-none fixed top-20 right-4 z-[9999] flex max-w-xs animate-fade-slide">
          <div
            className={`
              pointer-events-auto rounded-xl border backdrop-blur-md px-4 py-3 shadow-xl
              flex items-center gap-3 text-sm font-medium text-white
              transition-all duration-300
              ${
                notification.type === "success" &&
                "bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 border-emerald-400/40"
              }
              ${
                notification.type === "info" &&
                "bg-gradient-to-r from-sky-600/90 to-sky-500/90 border-sky-400/40"
              }
              ${
                notification.type === "error" &&
                "bg-gradient-to-r from-rose-600/90 to-rose-500/90 border-rose-400/40"
              }
            `}
          >
            {/* Icono según tipo */}
            <span className="text-xl">
              {notification.type === "success" && "✔"}
              {notification.type === "info" && "ℹ"}
              {notification.type === "error" && "✖"}
            </span>

            <span>{notification.message}</span>
          </div>
        </div>
      )}


    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return ctx;
}
