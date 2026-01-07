import type { Product } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Obtiene todos los productos desde el backend
 * GET /products
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`Error fetching products: ${res.status} ${res.statusText}`);
      return [];
    }

    const products: Product[] = await res.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Obtiene un producto por su slug
 * Como el backend no tiene endpoint /products/slug/:slug,
 * obtenemos todos los productos y filtramos por slug
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const products = await fetchProducts();
    const product = products.find((p) => p.slug === slug);

    if (!product) {
      console.warn(`Product with slug "${slug}" not found`);
      return null;
    }

    return product;
  } catch (error) {
    console.error(`Error fetching product by slug "${slug}":`, error);
    return null;
  }
}

/**
 * Obtiene un producto por su ID
 * GET /products/:id
 */
export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`Error fetching product ${id}: ${res.status} ${res.statusText}`);
      return null;
    }

    const product: Product = await res.json();
    return product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}
