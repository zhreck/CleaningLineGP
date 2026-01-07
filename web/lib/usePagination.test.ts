/**
 * Unit tests for usePagination hook
 * Tests state management, loading behavior, and filter reset functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';
import type { PaginatedResponse, Product } from './types';

// Mock fetch function for testing
const createMockFetchFunction = (responses: PaginatedResponse<Product>[]) => {
    let callCount = 0;
    return vi.fn(async (page: number, limit: number) => {
        const response = responses[callCount] || responses[responses.length - 1];
        callCount++;
        return response;
    });
};

describe('usePagination', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with correct default state', () => {
        const mockFetch = createMockFetchFunction([]);

        const { result } = renderHook(() => usePagination(mockFetch, 20));

        expect(result.current.items).toEqual([]);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isLoadingMore).toBe(false);
        expect(result.current.error).toBe(null);
        expect(result.current.hasMore).toBe(false);
        expect(result.current.totalCount).toBe(0);
        expect(result.current.currentPage).toBe(1);
    });

    it('should load first page correctly', async () => {
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

        const mockFetch = createMockFetchFunction([mockResponse]);
        const { result } = renderHook(() => usePagination(mockFetch, 20));

        await act(async () => {
            await result.current.loadMore();
        });

        expect(result.current.items).toEqual(mockProducts);
        expect(result.current.totalCount).toBe(50);
        expect(result.current.currentPage).toBe(1);
        expect(result.current.hasMore).toBe(true);
        expect(result.current.isLoading).toBe(false);
        expect(mockFetch).toHaveBeenCalledWith(1, 20, {});
    });

    it('should append items when loading more pages', async () => {
        const firstPageProducts: Product[] = [
            { id: 1, name: 'Product 1', slug: 'product-1', price: 100 },
            { id: 2, name: 'Product 2', slug: 'product-2', price: 200 },
        ];

        const secondPageProducts: Product[] = [
            { id: 3, name: 'Product 3', slug: 'product-3', price: 300 },
            { id: 4, name: 'Product 4', slug: 'product-4', price: 400 },
        ];

        const responses: PaginatedResponse<Product>[] = [
            {
                items: firstPageProducts,
                total: 50,
                page: 1,
                lastPage: 3,
                hasMore: true,
            },
            {
                items: secondPageProducts,
                total: 50,
                page: 2,
                lastPage: 3,
                hasMore: true,
            },
        ];

        const mockFetch = createMockFetchFunction(responses);
        const { result } = renderHook(() => usePagination(mockFetch, 20));

        // Load first page
        await act(async () => {
            await result.current.loadMore();
        });

        // Load second page
        await act(async () => {
            await result.current.loadMore();
        });

        expect(result.current.items).toEqual([...firstPageProducts, ...secondPageProducts]);
        expect(result.current.currentPage).toBe(2);
        expect(result.current.hasMore).toBe(true);
        expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should reset state when filters change', async () => {
        const mockProducts: Product[] = [
            { id: 1, name: 'Product 1', slug: 'product-1', price: 100 },
        ];

        const mockResponse: PaginatedResponse<Product> = {
            items: mockProducts,
            total: 1,
            page: 1,
            lastPage: 1,
            hasMore: false,
        };

        const mockFetch = createMockFetchFunction([mockResponse]);
        const { result } = renderHook(() => usePagination(mockFetch, 20));

        // Load some data first
        await act(async () => {
            await result.current.loadMore();
        });

        expect(result.current.items.length).toBe(1);

        // Reset with new filters
        act(() => {
            result.current.reset({ search: 'new search' });
        });

        expect(result.current.items).toEqual([]);
        expect(result.current.currentPage).toBe(1);
        expect(result.current.totalCount).toBe(0);
        expect(result.current.error).toBe(null);
    });

    it('should handle errors correctly', async () => {
        const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
        const { result } = renderHook(() => usePagination(mockFetch, 20));

        await act(async () => {
            await result.current.loadMore();
        });

        expect(result.current.error).toBe('Network error');
        expect(result.current.isLoading).toBe(false);
        expect(result.current.items).toEqual([]);
    });

    it('should prevent duplicate requests when already loading', async () => {
        const mockResponse: PaginatedResponse<Product> = {
            items: [{ id: 1, name: 'Product 1', slug: 'product-1', price: 100 }],
            total: 1,
            page: 1,
            lastPage: 1,
            hasMore: false,
        };

        // Create a slow mock function
        const mockFetch = vi.fn().mockImplementation(() =>
            new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
        );

        const { result } = renderHook(() => usePagination(mockFetch, 20));

        // Start two loadMore calls simultaneously
        const promise1 = act(async () => {
            await result.current.loadMore();
        });

        const promise2 = act(async () => {
            await result.current.loadMore();
        });

        await Promise.all([promise1, promise2]);

        // Should only call fetch once due to duplicate request prevention
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should not load more when hasMore is false', async () => {
        const mockResponse: PaginatedResponse<Product> = {
            items: [{ id: 1, name: 'Product 1', slug: 'product-1', price: 100 }],
            total: 1,
            page: 1,
            lastPage: 1,
            hasMore: false,
        };

        const mockFetch = createMockFetchFunction([mockResponse]);
        const { result } = renderHook(() => usePagination(mockFetch, 20));

        // Load first page
        await act(async () => {
            await result.current.loadMore();
        });

        expect(result.current.hasMore).toBe(false);

        // Try to load more - should not make another request
        await act(async () => {
            await result.current.loadMore();
        });

        expect(mockFetch).toHaveBeenCalledTimes(1);
    });
});