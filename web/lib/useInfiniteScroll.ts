'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for infinite scroll using IntersectionObserver API.
 * 
 * This hook provides automatic loading of more content when the user scrolls
 * near the bottom of a list. It uses the modern IntersectionObserver API for
 * efficient scroll detection and includes proper cleanup to prevent memory leaks.
 * 
 * The hook creates a "sentinel" element that should be placed at the bottom of
 * your content list. When this element becomes visible (intersects with the
 * viewport), the callback function is triggered to load more content.
 * 
 * @param callback - Function to call when more content should be loaded
 * @param hasMore - Whether there are more items available to load
 * @param isLoading - Whether a request is currently in progress (prevents duplicate requests)
 * @param threshold - Intersection threshold (0.0 to 1.0, default: 0.1)
 * @returns React ref to attach to the sentinel element
 * 
 * @example
 * ```typescript
 * // Basic usage with pagination hook
 * function ProductList() {
 *   const { items, loadMore, hasMore, isLoading } = usePagination(fetchProducts);
 *   const sentinelRef = useInfiniteScroll(loadMore, hasMore, isLoading);
 * 
 *   return (
 *     <div>
 *       {items.map(item => (
 *         <ProductCard key={item.id} product={item} />
 *       ))}
 *       
 *       {hasMore && (
 *         <div ref={sentinelRef} className="loading-sentinel">
 *           {isLoading ? <LoadingSpinner /> : <div>Scroll for more...</div>}
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Advanced usage with custom threshold and loading states
 * function InfiniteList() {
 *   const [items, setItems] = useState([]);
 *   const [hasMore, setHasMore] = useState(true);
 *   const [isLoading, setIsLoading] = useState(false);
 * 
 *   const loadMore = useCallback(async () => {
 *     if (isLoading) return;
 *     
 *     setIsLoading(true);
 *     try {
 *       const newItems = await fetchMoreItems();
 *       setItems(prev => [...prev, ...newItems]);
 *       setHasMore(newItems.length > 0);
 *     } finally {
 *       setIsLoading(false);
 *     }
 *   }, [isLoading]);
 * 
 *   // Trigger earlier with higher threshold
 *   const sentinelRef = useInfiniteScroll(loadMore, hasMore, isLoading, 0.5);
 * 
 *   return (
 *     <div>
 *       {items.map(item => <Item key={item.id} {...item} />)}
 *       <div ref={sentinelRef} style={{ height: '20px' }} />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Usage with error handling
 * function RobustInfiniteList() {
 *   const { items, loadMore, hasMore, isLoading, error } = usePagination(fetchItems);
 *   
 *   const handleLoadMore = useCallback(() => {
 *     if (!error) {
 *       loadMore();
 *     }
 *   }, [loadMore, error]);
 * 
 *   const sentinelRef = useInfiniteScroll(handleLoadMore, hasMore && !error, isLoading);
 * 
 *   return (
 *     <div>
 *       {items.map(item => <Item key={item.id} {...item} />)}
 *       
 *       {error ? (
 *         <ErrorMessage error={error} />
 *       ) : hasMore ? (
 *         <div ref={sentinelRef}>
 *           {isLoading ? <LoadingSpinner /> : <div>Loading more...</div>}
 *         </div>
 *       ) : (
 *         <div>No more items to load</div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @see {@link usePagination} - For complete pagination state management
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API} - IntersectionObserver API documentation
 * 
 * @since 1.0.0
 */
export function useInfiniteScroll(
    callback: () => void,
    hasMore: boolean,
    isLoading: boolean,
    threshold: number = 0.1
): React.RefObject<HTMLDivElement | null> {
    const sentinelRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Memoized callback to prevent unnecessary observer recreations
    // Using useCallback with stable dependencies for performance
    const memoizedCallback = useCallback(callback, [callback]);

    useEffect(() => {
        const sentinel = sentinelRef.current;

        // Don't set up observer if no sentinel element
        if (!sentinel) {
            return;
        }

        // Clean up existing observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Create new IntersectionObserver
        // Requirements: 4.1 - trigger before reaching absolute bottom
        observerRef.current = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;

                // Requirements: 4.2 - don't trigger if already loading
                // Requirements: 3.4 - don't trigger if no more items
                if (entry.isIntersecting && hasMore && !isLoading) {
                    memoizedCallback();
                }
            },
            {
                // Requirements: 4.1 - threshold-based triggering
                threshold,
                // Add some margin to trigger before reaching the bottom
                rootMargin: '100px',
            }
        );

        // Start observing the sentinel element
        observerRef.current.observe(sentinel);

        // Cleanup function
        // Requirements: 4.5 - prevent memory leaks
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        };
    }, [hasMore, isLoading, threshold, memoizedCallback]);

    // Additional cleanup on unmount
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        };
    }, []);

    return sentinelRef;
}