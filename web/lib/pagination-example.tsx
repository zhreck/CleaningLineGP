/**
 * Example usage of pagination hooks
 * This demonstrates how to use usePagination and useInfiniteScroll together
 */

'use client';

import React from 'react';
import { usePagination } from './usePagination';
import { useInfiniteScroll } from './useInfiniteScroll';
import { fetchPaginatedProducts } from './productsApi';
import type { Product } from './types';

export function PaginationExample() {
    // Initialize pagination hook
    const {
        items: products,
        isLoading,
        isLoadingMore,
        error,
        hasMore,
        totalCount,
        loadMore,
        reset,
        retry,
    } = usePagination(fetchPaginatedProducts, 20);

    // Initialize infinite scroll hook
    const sentinelRef = useInfiniteScroll(loadMore, hasMore, isLoading || isLoadingMore);

    // Load initial data on mount
    React.useEffect(() => {
        loadMore();
    }, []);

    // Handle filter changes
    const handleSearch = (searchTerm: string) => {
        reset({ search: searchTerm });
        // After reset, load the first page with new filters
        setTimeout(() => loadMore(), 0);
    };

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <button
                    onClick={retry}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Product Catalog with Infinite Scroll</h1>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-4 py-2 border rounded-lg"
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            {/* Total count */}
            <p className="text-gray-600 mb-4">
                {totalCount > 0 ? `Showing ${products.length} of ${totalCount} products` : 'No products found'}
            </p>

            {/* Initial loading */}
            {isLoading && products.length === 0 && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading products...</p>
                </div>
            )}

            {/* Product grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: Product) => (
                    <div key={product.id} className="border rounded-lg p-4 shadow-sm">
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-2">{product.description}</p>
                        <p className="text-xl font-bold text-green-600">${product.price}</p>
                        {product.category && (
                            <p className="text-sm text-gray-500 mt-2">Category: {product.category.name}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Loading more indicator */}
            {isLoadingMore && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading more products...</p>
                </div>
            )}

            {/* End of results */}
            {!hasMore && products.length > 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-600">You've reached the end of the catalog!</p>
                </div>
            )}

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="h-4" />
        </div>
    );
}