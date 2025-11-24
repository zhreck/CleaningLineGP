export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  // Opcionales, por si el backend los expone:
  stock?: number;
  categoryName?: string;

  categoryKey?: "cloro" | "hogar" | "personal";


  isFeatured?: boolean;        // para el carrusel
  isOnSale?: boolean;          // para marcar que está en oferta
  discountPercent?: number;    // % de descuento (ej: 10, 15, 20)
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};
