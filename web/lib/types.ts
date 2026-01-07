// Tipo de categoría del backend
export type Category = {
  id: number;
  name: string;
  slug: string;
};

// Tipo de producto que devuelve el backend
export type Product = {
  id: number; // Backend devuelve number
  slug: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  stock?: number;

  // Relación con categoría (puede ser null)
  category?: Category | null;

  // Campos para ofertas y destacados
  isFeatured?: boolean;
  isOnSale?: boolean;
  discountPercent?: number | null;
};

// Tipo de item del carrito (respuesta del backend)
export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  total: number; // Total del item (price * quantity)
  imageUrl?: string;
};

// Respuesta completa del carrito desde el backend
export type CartResponse = {
  id?: number | null; // ID del carrito (null para invitados)
  items: CartItem[];
  subtotal: number;
  taxes: number;
  total: number;
};

// -------------------------
// 🟩 TIPOS DE ÓRDENES (main)
// -------------------------

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number; // precio unitario en CLP
}

export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  total: number;
  status: OrderStatus;
  createdAt: string; // ISO string

  items: OrderItem[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;

  // datos agregados para mostrar en el admin
  ordersCount?: number;
  totalSpent?: number;
}

// -------------------------
// 🟩 TIPOS DE PAGINACIÓN
// -------------------------

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  lastPage: number;
  hasMore: boolean;
}

export interface ProductFilters {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isOnSale?: boolean;
}

export interface PaginationState<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  lastPage: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  filters: Record<string, any>;
}

export interface PaginationHookReturn<T> {
  items: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
  loadMore: () => Promise<void>;
  reset: (newFilters?: Record<string, any>) => void;
  retry: () => Promise<void>;
}
