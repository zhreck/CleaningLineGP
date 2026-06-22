/**
 * API de Productos - Integración completa con backend
 */

import { catalogo } from '@/mockdata/mockCatalogo';
import { api } from './apiClient';
import type { Product, PaginatedResponse, ProductFilters } from './types';

export type CreateProductDto = {
    name: string;
    description: string;
    price: number;
    slug?: string; // Optional - will be auto-generated from name if not provided
    stock: number;
    imageUrl?: string; // Backend expects single URL string (optional)
    categoryId: number;
    isFeatured?: boolean;
    isOnSale?: boolean;
    discountPercent?: number | null;
};

export type UpdateProductDto = {
    name?: string;
    description?: string;
    price?: number;
    slug?: string;
    stock?: number;
    imageUrl?: string;
    categoryId?: number;
    isFeatured?: boolean;
    isOnSale?: boolean;
    discountPercent?: number | null;
};

export type GetProductsParams = {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
};

/**
 * Fetch paginated products with optional filtering and search.
 * 
 * This function provides server-side pagination for products with support for
 * search queries and category filtering. It includes performance monitoring
 * and error handling for production use.
 * 
 * @param page - Page number to fetch (1-based, default: 1)
 * @param limit - Number of items per page (default: 20, max: 100)
 * @param filters - Optional filters to apply
 * @param filters.search - Search term to filter products by name
 * @param filters.categoryId - Category ID to filter products
 * @returns Promise resolving to paginated response with products
 * 
 * @throws {Error} When the API request fails or returns an error
 * 
 * @example
 * ```typescript
 * // Basic pagination
 * const firstPage = await fetchPaginatedProducts(1, 20);
 * console.log(`Loaded ${firstPage.items.length} of ${firstPage.total} products`);
 * 
 * // With search filter
 * const searchResults = await fetchPaginatedProducts(1, 20, {
 *   search: 'laptop'
 * });
 * 
 * // With category filter
 * const categoryProducts = await fetchPaginatedProducts(1, 20, {
 *   categoryId: 3
 * });
 * 
 * // Combined filters
 * const filteredProducts = await fetchPaginatedProducts(1, 20, {
 *   search: 'gaming',
 *   categoryId: 1
 * });
 * ```
 * 
 * @example
 * ```typescript
 * // Usage with pagination hook
 * const { items, loadMore, hasMore } = usePagination(fetchPaginatedProducts, 20);
 * 
 * // Usage with error handling
 * try {
 *   const response = await fetchPaginatedProducts(2, 20, { search: 'phone' });
 *   setProducts(response.items);
 *   setHasMore(response.hasMore);
 * } catch (error) {
 *   console.error('Failed to fetch products:', error.message);
 *   setError(error.message);
 * }
 * ```
 * 
 * @see {@link usePagination} - React hook for managing pagination state
 * @see {@link PaginatedResponse} - Response type definition
 * @see {@link ProductFilters} - Filter options type definition
 * 
 * API Endpoint: GET /products/paginated
 * Requirements: 2.1, 2.4, 2.5, 2.6
 * 
 * @since 1.0.0
 */
// export async function fetchPaginatedProducts(
//     page: number = 1,
//     limit: number = 20,
//     filters?: ProductFilters
// ): Promise<PaginatedResponse<Product>> {
//     // Performance monitoring: Start timing
//     const startTime = performance.now();

//     try {
//         // const params = new URLSearchParams();
//         // params.append('page', page.toString());
//         // params.append('limit', limit.toString());

//         // if (filters?.search) {
//         //     params.append('search', filters.search);
//         // }
//         // if (filters?.categoryId) {
//         //     params.append('categoryId', filters.categoryId.toString());
//         // }

//         // const response = await api.get<PaginatedResponse<Product>>(`/products/paginated?${params.toString()}`);

//         // // Performance monitoring: Log timing
//         // const endTime = performance.now();
//         // const duration = endTime - startTime;

//         // // Log performance metrics (only in development)
//         // if (process.env.NODE_ENV === 'development') {
//         //     console.log(`[Performance] fetchPaginatedProducts - Page ${page}: ${duration.toFixed(2)}ms`);

//         //     // Warn if request is slow
//         //     if (duration > 2000) {
//         //         console.warn(`[Performance Warning] Slow API request: ${duration.toFixed(2)}ms`);
//         //     }
//         // }

//         // // Store performance metrics for monitoring
//         // if (typeof window !== 'undefined' && (window as any).performanceMetrics) {
//         //     (window as any).performanceMetrics.push({
//         //         operation: 'fetchPaginatedProducts',
//         //         page,
//         //         limit,
//         //         duration,
//         //         timestamp: Date.now(),
//         //         itemsReturned: response.items.length
//         //     });
//         // }

//         return catalogo;
//     } catch (error: any) {
//         // Performance monitoring: Log error timing
//         const endTime = performance.now();
//         const duration = endTime - startTime;

//         if (process.env.NODE_ENV === 'development') {
//             console.error(`[Performance] fetchPaginatedProducts ERROR - Page ${page}: ${duration.toFixed(2)}ms`, error);
//         }

//         console.error('Error fetching paginated products:', error);
//         throw new Error(error.message || 'Error al obtener productos paginados');
//     }
// }

export async function fetchPaginatedProducts(
    page: number = 1,
    limit: number = 20,
    filters?: ProductFilters
): Promise<PaginatedResponse<Product>> {
    // Tomamos el tiempo de inicio para tus métricas locales
    const startTime = performance.now();

    try {
        // 1. Cargamos el catálogo local en memoria (sin tocar internet)
        let productosFiltrados = [...catalogo] as unknown as Product[];

        // 2. Buscador local simulado (si escribes algo en la barra de búsqueda)
        if (filters?.search) {
            const busqueda = filters.search.toLowerCase();
            productosFiltrados = productosFiltrados.filter(p =>
                (p as any).cat?.toLowerCase().includes(busqueda) ||
                (p as any).feature?.toLowerCase().includes(busqueda)
            );
        }

        // 3. Cálculos matemáticos de la paginación local
        const total = productosFiltrados.length;
        const lastPage = Math.max(1, Math.ceil(total / limit));

        // Cortamos el arreglo según la página solicitada (ej: del 0 al 20)
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const items = productosFiltrados.slice(startIndex, endIndex);

        const hasMore = page < lastPage;

        // 4. Guardamos las métricas de rendimiento en la consola de desarrollo
        const endTime = performance.now();
        const duration = endTime - startTime;

        if (process.env.NODE_ENV === 'development') {
            console.log(`[Mock Performance] fetchPaginatedProducts - Page ${page}: ${duration.toFixed(2)}ms`);
        }

        if (typeof window !== 'undefined' && (window as any).performanceMetrics) {
            (window as any).performanceMetrics.push({
                operation: 'fetchPaginatedProducts',
                page,
                limit,
                duration,
                timestamp: Date.now(),
                itemsReturned: items.length
            });
        }

        // 5. Devolvemos la respuesta formateada para tu frontend
        return {
            items,
            total,
            page,
            lastPage,
            hasMore
        };

    } catch (error: any) {
        const endTime = performance.now();
        const duration = endTime - startTime;

        if (process.env.NODE_ENV === 'development') {
            console.error(`[Mock Performance] Error local - Page ${page}: ${duration.toFixed(2)}ms`, error);
        }

        throw new Error(error.message || 'Error al procesar productos locales');
    }
}

/**
 * Obtener lista de productos con paginación y filtros
 * GET /products
 * 
 * @deprecated Use fetchPaginatedProducts for better performance with large datasets.
 * This function loads all products and filters client-side, which may cause performance issues.
 * Consider migrating to fetchPaginatedProducts for server-side pagination.
 */
export async function getProducts(params?: GetProductsParams): Promise<Product[]> {
    try {
        // Por ahora el backend no soporta paginación en el endpoint,
        // así que obtenemos todos y filtramos en el cliente
        const response = await api.get<Product[]>('/products');

        let filtered = response;

        // Filtrar por búsqueda
        if (params?.search) {
            const searchLower = params.search.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(searchLower) ||
                    p.slug.toLowerCase().includes(searchLower) ||
                    (p.category?.name || '').toLowerCase().includes(searchLower)
            );
        }

        // Filtrar por categoría
        if (params?.category && params.category !== 'all') {
            filtered = filtered.filter((p) => p.category?.slug === params.category);
        }

        return filtered;
    } catch (error: any) {
        console.error('Error fetching products:', error);
        throw new Error(error.message || 'Error al obtener productos');
    }
}

/**
 * Obtener un producto por ID
 * GET /products/:id
 */
export async function getProduct(id: number): Promise<Product> {
    try {
        const response = await api.get<Product>(`/products/${id}`);
        return response;
    } catch (error: any) {
        console.error(`Error fetching product ${id}:`, error);
        throw new Error(error.message || 'Error al obtener producto');
    }
}

/**
 * Crear un nuevo producto (solo admin)
 * POST /products
 */
export async function createProduct(data: CreateProductDto): Promise<Product> {
    try {
        const response = await api.post<Product>('/products', data);
        return response;
    } catch (error: any) {
        console.error('Error creating product:', error);
        throw new Error(error.message || 'Error al crear producto');
    }
}

/**
 * Actualizar un producto (solo admin)
 * PUT /products/:id
 */
export async function updateProduct(
    id: number,
    data: UpdateProductDto
): Promise<Product> {
    try {
        const response = await api.put<Product>(`/products/${id}`, data);
        return response;
    } catch (error: any) {
        console.error(`Error updating product ${id}:`, error);
        throw new Error(error.message || 'Error al actualizar producto');
    }
}

/**
 * Eliminar un producto (solo admin)
 * DELETE /products/:id
 */
export async function deleteProduct(id: number): Promise<void> {
    try {
        await api.delete(`/products/${id}`);
    } catch (error: any) {
        console.error(`Error deleting product ${id}:`, error);
        throw new Error(error.message || 'Error al eliminar producto');
    }
}
