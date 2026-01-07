'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { performanceMonitor } from './performanceMonitor';
import type { PaginatedResponse, PaginationHookReturn } from './types';

/**
 * Custom hook for managing pagination state and infinite scroll behavior.
 * 
 * This hook provides a complete pagination solution with state management,
 * error handling, and performance optimizations. It's designed to work with
 * server-side paginated APIs and supports filtering, loading states, and
 * automatic duplicate prevention.
 * 
 * @template T - The type of items being paginated
 * @param fetchFunction - Function that fetches paginated data. Should return a PaginatedResponse<T>
 * @param limit - Number of items per page (default: 20, max recommended: 50)
 * @param initialFilters - Initial filter values to apply on first load
 * @returns Object containing pagination state and control functions
 * 
 * @example
 * ```typescript
 * // Basic usage with products
 * const {
 *   items: products,
 *   isLoading,
 *   hasMore,
 *   loadMore,
 *   reset,
 *   totalCount
 * } = usePagination(fetchPaginatedProducts, 20);
 * 
 * // Usage with filters
 * const pagination = usePagination(
 *   fetchPaginatedProducts,
 *   20,
 *   { categoryId: 1, search: 'laptop' }
 * );
 * 
 * // Reset with new filters
 * const handleFilterChange = (newFilters) => {
 *   pagination.reset(newFilters);
 *   pagination.loadMore(); // Load first page with new filters
 * };
 * ```
 * 
 * @example
 * ```typescript
 * // Complete catalog page implementation
 * function CatalogPage() {
 *   const {
 *     items: products,
 *     isLoading,
 *     isLoadingMore,
 *     error,
 *     hasMore,
 *     totalCount,
 *     loadMore,
 *     reset,
 *     retry
 *   } = usePagination(fetchPaginatedProducts, 20);
 * 
 *   // Load initial data
 *   useEffect(() => {
 *     loadMore();
 *   }, []);
 * 
 *   // Handle search
 *   const handleSearch = (searchTerm: string) => {
 *     reset({ search: searchTerm });
 *     loadMore();
 *   };
 * 
 *   if (error) {
 *     return <ErrorMessage message={error} onRetry={retry} />;
 *   }
 * 
 *   return (
 *     <div>
 *       <div>Total: {totalCount} products</div>
 *       {products.map(product => (
 *         <ProductCard key={product.id} product={product} />
 *       ))}
 *       {isLoadingMore && <LoadingSpinner />}
 *       {hasMore && <InfiniteScrollTrigger onTrigger={loadMore} />}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @see {@link useInfiniteScroll} - For automatic scroll-based loading
 * @see {@link fetchPaginatedProducts} - Compatible fetch function
 * 
 * @since 1.0.0
 */
export function usePagination<T>(
    fetchFunction: (page: number, limit: number, filters?: any) => Promise<PaginatedResponse<T>>,
    limit: number = 20,
    initialFilters?: Record<string, any>
): PaginationHookReturn<T> {
    // State management
    const [items, setItems] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Record<string, any>>(initialFilters || {});

    // Ref to prevent duplicate requests
    const isLoadingRef = useRef(false);

    // Calculate hasMore based on current page and lastPage (memoized for performance)
    const hasMore = useMemo(() => page < lastPage, [page, lastPage]);

    /**
     * Load more items (for infinite scroll or manual pagination).
     * 
     * This function handles both initial loading (page 1) and subsequent
     * page loads. It includes duplicate prevention, error handling, and
     * performance monitoring.
     * 
     * @returns Promise that resolves when the load operation completes
     * 
     * @example
     * ```typescript
     * // Manual load more
     * const handleLoadMore = async () => {
     *   await loadMore();
     * };
     * 
     * // With error handling
     * const handleLoadMore = async () => {
     *   try {
     *     await loadMore();
     *   } catch (error) {
     *     console.error('Failed to load more items:', error);
     *   }
     * };
     * ```
     * 
     * Requirements: 6.2, 6.3, 4.2
     * - Prevents duplicate requests (Property 9: Request Idempotence)
     * - Increments page number correctly (Property 8: Page Increment Behavior)
     * - Respects hasMore flag (Property 7: Last Page Detection)
     */
    const loadMore = useCallback(async () => {
        // Prevent duplicate requests (Property 9: Request Idempotence)
        if (isLoadingRef.current) {
            return;
        }

        // Don't load if no more items available (except for first load)
        if (items.length > 0 && !hasMore) {
            return;
        }

        try {
            isLoadingRef.current = true;

            // Set appropriate loading state
            if (items.length === 0) {
                setIsLoading(true);
            } else {
                setIsLoadingMore(true);
            }

            setError(null);

            // Determine which page to load
            const nextPage = items.length === 0 ? 1 : page + 1;

            // Performance monitoring: Start timing
            const endTiming = performanceMonitor.startTiming(
                nextPage === 1 ? 'pagination-initial-load' : 'pagination-load-more'
            );

            const response = await fetchFunction(nextPage, limit, filters);

            // Performance monitoring: End timing
            endTiming({
                page: nextPage,
                limit,
                itemsReturned: response.items.length,
                totalItems: response.total
            });

            // Update state based on response
            setItems(prevItems => {
                // For first page, replace items; for subsequent pages, append
                if (nextPage === 1) {
                    return response.items;
                } else {
                    // Property 4: No Duplicate Products - ensure no duplicates
                    const existingIds = new Set(prevItems.map((item: any) => item.id));
                    const newItems = response.items.filter((item: any) => !existingIds.has(item.id));
                    return [...prevItems, ...newItems];
                }
            });

            setTotal(response.total);
            setLastPage(response.lastPage);

            // Property 8: Page Increment Behavior - set page to the loaded page
            setPage(nextPage);

            // Memory monitoring for infinite scroll
            performanceMonitor.recordMemoryUsage('pagination-after-load', items.length + response.items.length);

        } catch (err: any) {
            setError(err.message || 'Error loading products');
            console.error('Error in loadMore:', err);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
            isLoadingRef.current = false;
        }
    }, [fetchFunction, limit, filters, page, hasMore, items.length]);

    /**
     * Reset pagination state to initial values.
     * 
     * This function is typically called when filters change, search terms
     * are updated, or when you need to start fresh. It clears all items,
     * resets the page to 1, and optionally applies new filters.
     * 
     * @param newFilters - Optional new filter values to apply
     * 
     * @example
     * ```typescript
     * // Reset without filters
     * reset();
     * 
     * // Reset with new search filter
     * reset({ search: 'new search term' });
     * 
     * // Reset with multiple filters
     * reset({
     *   search: 'laptop',
     *   categoryId: 2,
     *   minPrice: 100
     * });
     * 
     * // Complete filter change workflow
     * const handleCategoryChange = (categoryId: number) => {
     *   reset({ categoryId });
     *   loadMore(); // Load first page with new filter
     * };
     * ```
     * 
     * Requirements: 6.4, 5.1, 5.2, 5.3
     * - Implements Property 5: Filter Reset Behavior
     * - Resets to page 1 and clears existing products
     * - Maintains filter state for subsequent loads
     */
    const reset = useCallback((newFilters?: Record<string, any>) => {
        // Property 5: Filter Reset Behavior - reset to page 1 and clear products
        setItems([]);
        setPage(1);
        setTotal(0);
        setLastPage(1);
        setError(null);
        setIsLoading(false);
        setIsLoadingMore(false);
        isLoadingRef.current = false;

        if (newFilters !== undefined) {
            setFilters(newFilters);
        }
    }, []);

    /**
     * Retry the current request after an error.
     * 
     * This function clears the current error state and attempts to reload
     * the current page. It's useful for error recovery scenarios where
     * network issues or temporary server problems occur.
     * 
     * @returns Promise that resolves when the retry operation completes
     * 
     * @example
     * ```typescript
     * // Basic retry usage
     * if (error) {
     *   return (
     *     <div>
     *       <p>Error: {error}</p>
     *       <button onClick={retry}>Retry</button>
     *     </div>
     *   );
     * }
     * 
     * // Retry with loading state
     * const handleRetry = async () => {
     *   setRetrying(true);
     *   try {
     *     await retry();
     *   } finally {
     *     setRetrying(false);
     *   }
     * };
     * ```
     * 
     * Requirements: 6.5
     * - Provides error recovery mechanism
     * - Clears error state before retrying
     * - Prevents duplicate retry requests
     */
    const retry = useCallback(async () => {
        if (isLoadingRef.current) {
            return;
        }

        setError(null);
        await loadMore();
    }, [loadMore]);

    return {
        items,
        isLoading,
        isLoadingMore,
        error,
        hasMore,
        totalCount: total,
        currentPage: page,
        loadMore,
        reset,
        retry,
    };
}