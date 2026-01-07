/**
 * Optimized Product Grid for handling large lists efficiently
 * This component implements performance optimizations for large datasets
 * Requirements: 4.4 - Virtual scrolling for large lists (simplified implementation)
 */

'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import type { Product } from '../../lib/types';
import ProductCard from '../products/productCard';

interface OptimizedProductGridProps {
    products: Product[];
    itemsPerPage?: number;
    enableVirtualization?: boolean;
}

export default function OptimizedProductGrid({
    products,
    itemsPerPage = 50,
    enableVirtualization = true
}: OptimizedProductGridProps) {
    const [visibleItems, setVisibleItems] = useState(itemsPerPage);

    // For very large lists (>100 items), implement simple pagination-based virtualization
    const shouldVirtualize = enableVirtualization && products.length > 100;

    // Memoize visible products to prevent unnecessary re-renders
    const displayedProducts = useMemo(() => {
        if (!shouldVirtualize) {
            return products;
        }
        return products.slice(0, visibleItems);
    }, [products, visibleItems, shouldVirtualize]);

    // Load more items when scrolling (simple virtualization)
    const loadMoreItems = useCallback(() => {
        if (visibleItems < products.length) {
            setVisibleItems(prev => Math.min(prev + itemsPerPage, products.length));
        }
    }, [visibleItems, products.length, itemsPerPage]);

    // Reset visible items when products change
    useEffect(() => {
        setVisibleItems(itemsPerPage);
    }, [products, itemsPerPage]);

    // Intersection observer for loading more items
    useEffect(() => {
        if (!shouldVirtualize || visibleItems >= products.length) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreItems();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        const sentinel = document.getElementById('load-more-sentinel');
        if (sentinel) {
            observer.observe(sentinel);
        }

        return () => {
            if (sentinel) {
                observer.unobserve(sentinel);
            }
        };
    }, [shouldVirtualize, visibleItems, products.length, loadMoreItems]);

    if (products.length === 0) {
        return (
            <p className="text-base text-muted-foreground">
                No hay productos.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {/* Performance info for development */}
            {process.env.NODE_ENV === 'development' && shouldVirtualize && (
                <div className="text-xs text-muted-foreground bg-yellow-50 p-2 rounded">
                    Performance Mode: Showing {displayedProducts.length} of {products.length} products
                </div>
            )}

            {/* Product grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {displayedProducts.map((product) => (
                    <ProductCard key={product.id} p={product} />
                ))}
            </div>

            {/* Load more sentinel for virtualization */}
            {shouldVirtualize && visibleItems < products.length && (
                <div
                    id="load-more-sentinel"
                    className="flex justify-center py-4"
                >
                    <div className="text-sm text-muted-foreground">
                        Cargando más productos...
                    </div>
                </div>
            )}

            {/* Performance stats for development */}
            {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-muted-foreground">
                    Rendered {displayedProducts.length} product cards
                    {shouldVirtualize && ` (virtualized from ${products.length} total)`}
                </div>
            )}
        </div>
    );
}