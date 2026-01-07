/**
 * Integration tests for pagination hooks
 * Tests that usePagination and useInfiniteScroll work together
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';
import { useInfiniteScroll } from './useInfiniteScroll';
import type { PaginatedResponse, Product } from './types';

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
}));

describe('Pagination Integration', () => {
    it('should integrate usePagination with useInfiniteScroll', async () => {
        // Mock fetch function
        const mockProducts: Product[] = [
            { id: 1, name: 'Product 1', slug: 'product-1', price: 100 },
            { id: 2, name: 'Product 2', slug: 'product-2', price: 200 },
        ];

        const mockResponse: PaginatedResponse<Product> = {
            items: mockProducts,
            total: 50,
            page: 1,
            lastPage: 3,
            hasMore: true,
        };

        const mockFetch = vi.fn().mockResolvedValue(mockResponse);

        // Test usePagination hook
        const { result: paginationResult } = renderHook(() =>
            usePagination(mockFetch, 20)
        );

        // Test useInfiniteScroll hook
        const { result: scrollResult } = renderHook(() =>
            useInfiniteScroll(
                paginationResult.current.loadMore,
                paginationResult.current.hasMore,
                paginationResult.current.isLoading
            )
        );

        // Verify initial state
        expect(paginationResult.current.items).toEqual([]);
        expect(paginationResult.current.hasMore).toBe(false);
        expect(scrollResult.current).toHaveProperty('current');

        // Load first page
        await act(async () => {
            await paginationResult.current.loadMore();
        });

        // Verify data was loaded
        expect(paginationResult.current.items).toEqual(mockProducts);
        expect(paginationResult.current.hasMore).toBe(true);
        expect(paginationResult.current.totalCount).toBe(50);
        expect(mockFetch).toHaveBeenCalledWith(1, 20, {});
    });

    it('should handle filter reset correctly', () => {
        const mockFetch = vi.fn();

        const { result } = renderHook(() => usePagination(mockFetch, 20));

        // Reset with new filters
        act(() => {
            result.current.reset({ search: 'test' });
        });

        // Verify state was reset
        expect(result.current.items).toEqual([]);
        expect(result.current.currentPage).toBe(1);
        expect(result.current.totalCount).toBe(0);
        expect(result.current.hasMore).toBe(false);
    });

    it('should work with multiple pages', async () => {
        const firstPageResponse: PaginatedResponse<Product> = {
            items: [{ id: 1, name: 'Product 1', slug: 'product-1', price: 100 }],
            total: 25,
            page: 1,
            lastPage: 2,
            hasMore: true,
        };

        const secondPageResponse: PaginatedResponse<Product> = {
            items: [{ id: 2, name: 'Product 2', slug: 'product-2', price: 200 }],
            total: 25,
            page: 2,
            lastPage: 2,
            hasMore: false,
        };

        const mockFetch = vi.fn()
            .mockResolvedValueOnce(firstPageResponse)
            .mockResolvedValueOnce(secondPageResponse);

        const { result } = renderHook(() => usePagination(mockFetch, 20));

        // Load first page
        await act(async () => {
            await result.current.loadMore();
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.hasMore).toBe(true);

        // Load second page
        await act(async () => {
            await result.current.loadMore();
        });

        expect(result.current.items).toHaveLength(2);
        expect(result.current.hasMore).toBe(false);
        expect(mockFetch).toHaveBeenCalledTimes(2);

        // Try to load more - should not call fetch again
        await act(async () => {
            await result.current.loadMore();
        });

        expect(mockFetch).toHaveBeenCalledTimes(2); // Still only called twice
    });
});