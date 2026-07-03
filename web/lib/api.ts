import type { Product } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
const API_BASE = API_BASE_URL.replace(/\/$/, "");

async function fetchJsonWithFallback<T>(path: string): Promise<T> {
  const urls = [`${API_BASE}${path}`, `${API_BASE}/api${path}`];

  let lastError: unknown;

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        return (await res.json()) as T;
      }

      if (res.status !== 404) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Unable to fetch data from ${urls.join(" or ")}`);
}

/**
 * Obtiene todos los productos desde el backend
 * GET /products
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    return await fetchJsonWithFallback<Product[]>("/products");
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
    const product = await fetchJsonWithFallback<Product>(`/products/${id}`);
    return product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}
