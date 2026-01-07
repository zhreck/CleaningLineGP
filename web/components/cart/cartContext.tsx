// web/components/cart/cartContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product, CartResponse } from "../../lib/types";
import {
  addToCart as addToCartApi,
  getCart as getCartApi,
  removeFromCart as removeFromCartApi,
  clearCart as clearCartApi,
  updateCartItemQuantity as updateCartItemQuantityApi,
} from "../../lib/cartApi";
import { useAuth } from "../../contexts/AuthContext";

type NotificationType = "success" | "info" | "error";

type CartNotification = {
  message: string;
  type: NotificationType;
} | null;

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  taxes: number;
  totalAmount: number;
  isLoading: boolean;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  updateItemQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clear: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartData, setCartData] = useState<CartResponse>({
    items: [],
    subtotal: 0,
    taxes: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<CartNotification>(null);
  const { user } = useAuth();

  // Cargar carrito al montar y cuando cambia el usuario
  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const cart = await getCartApi();
      setCartData(cart);
    } catch (error) {
      console.error("Error loading cart:", error);
      // En caso de error, mantener carrito vacío
      setCartData({
        items: [],
        subtotal: 0,
        taxes: 0,
        total: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type });
    // Ocultar después de 1.5s
    setTimeout(() => {
      setNotification((current) =>
        current?.message === message ? null : current
      );
    }, 1500);
  };

  const addItem = async (product: Product, quantity = 1) => {
    try {
      setIsLoading(true);
      const updatedCart = await addToCartApi(product.id, quantity);
      setCartData(updatedCart);
      showNotification("Producto agregado al carrito", "success");
    } catch (error: any) {
      console.error("Error adding item:", error);
      showNotification(
        error.message || "Error al agregar producto",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (productId: number, quantity: number) => {
    try {
      setIsLoading(true);
      const updatedCart = await updateCartItemQuantityApi(productId, quantity);
      setCartData(updatedCart);
      showNotification("Cantidad actualizada", "info");
    } catch (error: any) {
      console.error("Error updating quantity:", error);
      showNotification(
        error.message || "Error al actualizar cantidad",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      setIsLoading(true);
      const updatedCart = await removeFromCartApi(productId);
      setCartData(updatedCart);
      showNotification("Producto eliminado del carrito", "info");
    } catch (error: any) {
      console.error("Error removing item:", error);
      showNotification(
        error.message || "Error al eliminar producto",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clear = async () => {
    try {
      setIsLoading(true);
      await clearCartApi();
      setCartData({
        items: [],
        subtotal: 0,
        taxes: 0,
        total: 0,
      });
      showNotification("Carrito vaciado", "info");
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      showNotification(
        error.message || "Error al vaciar carrito",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  // Calcular cantidad total de items
  const totalQuantity = cartData.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const value: CartContextValue = {
    items: cartData.items,
    totalQuantity,
    subtotal: cartData.subtotal,
    taxes: cartData.taxes,
    totalAmount: cartData.total,
    isLoading,
    addItem,
    updateItemQuantity,
    removeItem,
    clear,
    refreshCart,
  };

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
              ${notification.type === "success" &&
              "bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 border-emerald-400/40"
              }
              ${notification.type === "info" &&
              "bg-gradient-to-r from-sky-600/90 to-sky-500/90 border-sky-400/40"
              }
              ${notification.type === "error" &&
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
