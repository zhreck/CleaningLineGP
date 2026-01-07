/**
 * Property-Based Tests for ProductForm Integration with MediaPicker
 * 
 * Property 16: Product form integration data flow
 * **Feature: media-picker, Property 16: Product form integration data flow**
 * **Validates: Requirements 5.2**
 * 
 * Property 17: Product form displays selected images
 * **Feature: media-picker, Property 17: Product form displays selected images**
 * **Validates: Requirements 5.3**
 * 
 * Property 18: Product form submission includes images
 * **Feature: media-picker, Property 18: Product form submission includes images**
 * **Validates: Requirements 5.4**
 * 
 * Property 19: Edit mode pre-population
 * **Feature: media-picker, Property 19: Edit mode pre-population**
 * **Validates: Requirements 5.5**
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import ProductForm from './ProductForm';
import * as mediaApi from '@/lib/mediaApi';
import type { Product } from '@/lib/types';
import type { Category } from '@/lib/categoriesApi';

// Mock the mediaApi module
vi.mock('@/lib/mediaApi', () => ({
    uploadImage: vi.fn(),
    listImages: vi.fn(),
}));

describe('ProductForm - Property-Based Tests', () => {
    const mockCategories: Category[] = [
        { id: 1, name: 'Category 1', slug: 'category-1' },
        { id: 2, name: 'Category 2', slug: 'category-2' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    describe('Property 16: Product form integration data flow', () => {
        /**
         * **Feature: media-picker, Property 16: Product form integration data flow**
         * For any images selected in the media picker, the product form should receive 
         * the exact array of selected URLs when the picker closes.
         */
        it('should receive exact array of selected URLs from MediaPicker', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate array of image URLs (1-5 images)
                    fc.array(
                        fc.webUrl({ withFragments: false, withQueryParameters: false }),
                        { minLength: 1, maxLength: 5 }
                    ),
                    async (imageUrls) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length === 0) return true;

                        // Mock listImages to return our test images
                        vi.mocked(mediaApi.listImages).mockResolvedValue(uniqueUrls);

                        const mockOnSave = vi.fn();
                        const mockOnClose = vi.fn();

                        const { container, unmount } = render(
                            <ProductForm
                                open={true}
                                onClose={mockOnClose}
                                onSave={mockOnSave}
                                categories={mockCategories}
                            />
                        );

                        try {
                            // Wait for form to render
                            await waitFor(() => {
                                const form = container.querySelector('form');
                                expect(form).toBeTruthy();
                            }, { timeout: 1000 });

                            // Click "Select Images" button
                            const selectImagesButton = screen.getByRole('button', { name: /seleccionar imágenes/i });
                            fireEvent.click(selectImagesButton);

                            // Wait for MediaPicker to open
                            await waitFor(() => {
                                const dialog = screen.getByRole('dialog');
                                expect(dialog).toBeTruthy();
                            }, { timeout: 1000 });

                            // Wait for images to load in MediaPicker
                            await waitFor(() => {
                                const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                                expect(imageContainers.length).toBeGreaterThan(0);
                            }, { timeout: 1000 });

                            // Select all images
                            const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                            for (let i = 0; i < imageContainers.length; i++) {
                                fireEvent.click(imageContainers[i]);
                            }

                            // Wait for selections
                            await waitFor(() => {
                                const selected = container.querySelectorAll('.bg-blue-500\\/20');
                                expect(selected.length).toBe(imageContainers.length);
                            }, { timeout: 500 });

                            // Click Select button in MediaPicker
                            const selectButton = screen.getByRole('button', { name: /select \(\d+\)/i });
                            fireEvent.click(selectButton);

                            // Wait for MediaPicker to close and images to appear in form
                            await waitFor(() => {
                                const thumbnails = container.querySelectorAll('img[alt*="Producto imagen"]');
                                expect(thumbnails.length).toBe(uniqueUrls.length);
                            }, { timeout: 1000 });

                            // Verify the form has the correct image URLs
                            const thumbnails = container.querySelectorAll('img[alt*="Producto imagen"]');
                            const displayedUrls = Array.from(thumbnails).map(img => (img as HTMLImageElement).src);

                            // Normalize URLs for comparison (browser may add/remove trailing slashes and dots)
                            const normalizeUrl = (url: string) => {
                                try {
                                    const urlObj = new URL(url);
                                    return urlObj.href.replace(/\/+$/, '').replace(/\.+$/, '');
                                } catch {
                                    return url.replace(/\/+$/, '').replace(/\.+$/, '');
                                }
                            };
                            const normalizedDisplayed = displayedUrls.map(normalizeUrl);
                            const normalizedExpected = uniqueUrls.map(normalizeUrl);

                            // All selected URLs should be displayed
                            expect(displayedUrls.length).toBe(uniqueUrls.length);
                            normalizedExpected.forEach(url => {
                                expect(normalizedDisplayed.some(displayedUrl => displayedUrl === url)).toBe(true);
                            });
                        } finally {
                            unmount();
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);
    });

    describe('Property 17: Product form displays selected images', () => {
        /**
         * **Feature: media-picker, Property 17: Product form displays selected images**
         * For any images selected via the media picker, the product form should display 
         * thumbnails of those images after the picker closes.
         */
        it('should display thumbnails for all selected images', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate array of image URLs (1-6 images)
                    fc.array(
                        fc.webUrl({ withFragments: false, withQueryParameters: false }),
                        { minLength: 1, maxLength: 6 }
                    ),
                    async (imageUrls) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length === 0) return true;

                        vi.mocked(mediaApi.listImages).mockResolvedValue(uniqueUrls);

                        const mockOnSave = vi.fn();
                        const mockOnClose = vi.fn();

                        const { container, unmount } = render(
                            <ProductForm
                                open={true}
                                onClose={mockOnClose}
                                onSave={mockOnSave}
                                categories={mockCategories}
                            />
                        );

                        try {
                            // Open MediaPicker
                            const selectImagesButton = screen.getByRole('button', { name: /seleccionar imágenes/i });
                            fireEvent.click(selectImagesButton);

                            // Wait for MediaPicker
                            await waitFor(() => {
                                const dialog = screen.getByRole('dialog');
                                expect(dialog).toBeTruthy();
                            }, { timeout: 1000 });

                            // Wait for images to load
                            await waitFor(() => {
                                const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                                expect(imageContainers.length).toBeGreaterThan(0);
                            }, { timeout: 1000 });

                            // Select all images
                            const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                            for (let i = 0; i < imageContainers.length; i++) {
                                fireEvent.click(imageContainers[i]);
                            }

                            // Click Select
                            await waitFor(() => {
                                const selectButton = screen.getByRole('button', { name: /select \(\d+\)/i });
                                fireEvent.click(selectButton);
                            }, { timeout: 500 });

                            // Verify thumbnails are displayed
                            await waitFor(() => {
                                const thumbnails = container.querySelectorAll('img[alt*="Producto imagen"]');
                                expect(thumbnails.length).toBe(uniqueUrls.length);

                                // Each thumbnail should have a remove button
                                const removeButtons = container.querySelectorAll('button[aria-label="Eliminar imagen"]');
                                expect(removeButtons.length).toBe(uniqueUrls.length);
                            }, { timeout: 1000 });
                        } finally {
                            unmount();
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should allow removing individual images from thumbnails', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate array of at least 2 images
                    fc.array(
                        fc.webUrl({ withFragments: false, withQueryParameters: false }),
                        { minLength: 2, maxLength: 5 }
                    ),
                    async (imageUrls) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length < 2) return true;

                        vi.mocked(mediaApi.listImages).mockResolvedValue(uniqueUrls);

                        const mockOnSave = vi.fn();
                        const mockOnClose = vi.fn();

                        const { container, unmount } = render(
                            <ProductForm
                                open={true}
                                onClose={mockOnClose}
                                onSave={mockOnSave}
                                categories={mockCategories}
                            />
                        );

                        try {
                            // Select images via MediaPicker
                            const selectImagesButton = screen.getByRole('button', { name: /seleccionar imágenes/i });
                            fireEvent.click(selectImagesButton);

                            await waitFor(() => {
                                const dialog = screen.getByRole('dialog');
                                expect(dialog).toBeTruthy();
                            }, { timeout: 1000 });

                            await waitFor(() => {
                                const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                                expect(imageContainers.length).toBeGreaterThan(0);
                            }, { timeout: 1000 });

                            const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                            for (let i = 0; i < imageContainers.length; i++) {
                                fireEvent.click(imageContainers[i]);
                            }

                            await waitFor(() => {
                                const selectButton = screen.getByRole('button', { name: /select \(\d+\)/i });
                                fireEvent.click(selectButton);
                            }, { timeout: 500 });

                            // Wait for thumbnails
                            await waitFor(() => {
                                const thumbnails = container.querySelectorAll('img[alt*="Producto imagen"]');
                                expect(thumbnails.length).toBe(uniqueUrls.length);
                            }, { timeout: 1000 });

                            // Remove first image
                            const removeButtons = container.querySelectorAll('button[aria-label="Eliminar imagen"]');
                            const firstRemoveButton = removeButtons[0] as HTMLElement;

                            // Hover to make button visible
                            fireEvent.mouseEnter(firstRemoveButton.closest('.group')!);
                            fireEvent.click(firstRemoveButton);

                            // Verify one less thumbnail
                            await waitFor(() => {
                                const thumbnails = container.querySelectorAll('img[alt*="Producto imagen"]');
                                expect(thumbnails.length).toBe(uniqueUrls.length - 1);
                            }, { timeout: 500 });
                        } finally {
                            unmount();
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);
    });

    describe('Property 18: Product form submission includes images', () => {
        /**
         * **Feature: media-picker, Property 18: Product form submission includes images**
         * For any product form submission, the submitted data should include all image URLs 
         * that were selected via the media picker.
         */
        it('should include all selected images in form submission', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate product data
                    fc.record({
                        name: fc.string({ minLength: 1, maxLength: 50 }),
                        price: fc.integer({ min: 1, max: 100000 }),
                        stock: fc.integer({ min: 0, max: 1000 }),
                        imageUrls: fc.array(
                            fc.webUrl({ withFragments: false, withQueryParameters: false }),
                            { minLength: 1, maxLength: 4 }
                        ),
                    }),
                    async ({ name, price, stock, imageUrls }) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length === 0) return true;

                        vi.mocked(mediaApi.listImages).mockResolvedValue(uniqueUrls);

                        const mockOnSave = vi.fn().mockResolvedValue(undefined);
                        const mockOnClose = vi.fn();

                        const { container, unmount } = render(
                            <ProductForm
                                open={true}
                                onClose={mockOnClose}
                                onSave={mockOnSave}
                                categories={mockCategories}
                            />
                        );

                        try {
                            // Fill form fields
                            const nameInput = screen.getByPlaceholderText(/ej: cloro líquido/i);
                            fireEvent.change(nameInput, { target: { value: name } });

                            const priceInput = container.querySelector('input[type="number"][min="0"][step="1"]') as HTMLInputElement;
                            fireEvent.change(priceInput, { target: { value: price.toString() } });

                            const stockInputs = container.querySelectorAll('input[type="number"]');
                            const stockInput = Array.from(stockInputs).find(input =>
                                (input as HTMLInputElement).value === '0' &&
                                input.previousElementSibling?.textContent?.includes('Stock')
                            ) as HTMLInputElement;
                            if (stockInput) {
                                fireEvent.change(stockInput, { target: { value: stock.toString() } });
                            }

                            const categorySelect = container.querySelector('select') as HTMLSelectElement;
                            fireEvent.change(categorySelect, { target: { value: '1' } });

                            // Select images
                            const selectImagesButton = screen.getByRole('button', { name: /seleccionar imágenes/i });
                            fireEvent.click(selectImagesButton);

                            await waitFor(() => {
                                const dialog = screen.getByRole('dialog');
                                expect(dialog).toBeTruthy();
                            }, { timeout: 1000 });

                            await waitFor(() => {
                                const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                                expect(imageContainers.length).toBeGreaterThan(0);
                            }, { timeout: 1000 });

                            const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                            for (let i = 0; i < imageContainers.length; i++) {
                                fireEvent.click(imageContainers[i]);
                            }

                            await waitFor(() => {
                                const selectButton = screen.getByRole('button', { name: /select \(\d+\)/i });
                                fireEvent.click(selectButton);
                            }, { timeout: 500 });

                            // Wait for thumbnails
                            await waitFor(() => {
                                const thumbnails = container.querySelectorAll('img[alt*="Producto imagen"]');
                                expect(thumbnails.length).toBe(uniqueUrls.length);
                            }, { timeout: 1000 });

                            // Submit form
                            const submitButton = screen.getByRole('button', { name: /guardar/i });
                            fireEvent.click(submitButton);

                            // Verify onSave was called with images array
                            await waitFor(() => {
                                expect(mockOnSave).toHaveBeenCalledTimes(1);
                                const submittedData = mockOnSave.mock.calls[0][0];
                                expect(Array.isArray(submittedData.imageUrl)).toBe(true);
                                expect(submittedData.imageUrl.length).toBe(uniqueUrls.length);

                                // Verify all URLs are included
                                uniqueUrls.forEach(url => {
                                    expect(submittedData.imageUrl).toContain(url);
                                });
                            }, { timeout: 1000 });
                        } finally {
                            unmount();
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should validate that at least one image is required', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.string({ minLength: 1, maxLength: 50 }),
                    async (productName) => {
                        vi.mocked(mediaApi.listImages).mockResolvedValue([]);

                        const mockOnSave = vi.fn();
                        const mockOnClose = vi.fn();

                        const { container, unmount } = render(
                            <ProductForm
                                open={true}
                                onClose={mockOnClose}
                                onSave={mockOnSave}
                                categories={mockCategories}
                            />
                        );

                        try {
                            // Fill only required fields except images
                            const nameInput = screen.getByPlaceholderText(/ej: cloro líquido/i);
                            fireEvent.change(nameInput, { target: { value: productName } });

                            const priceInput = container.querySelector('input[type="number"][min="0"][step="1"]') as HTMLInputElement;
                            fireEvent.change(priceInput, { target: { value: '1000' } });

                            const categorySelect = container.querySelector('select') as HTMLSelectElement;
                            fireEvent.change(categorySelect, { target: { value: '1' } });

                            // Try to submit without images
                            const submitButton = screen.getByRole('button', { name: /guardar/i });
                            fireEvent.click(submitButton);

                            // Verify validation error is shown
                            await waitFor(() => {
                                const errorMessage = screen.getByText(/se requiere al menos una imagen/i);
                                expect(errorMessage).toBeTruthy();
                            }, { timeout: 500 });

                            // Verify onSave was NOT called
                            expect(mockOnSave).not.toHaveBeenCalled();
                        } finally {
                            unmount();
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);
    });

    describe('Property 19: Edit mode pre-population', () => {
        /**
         * **Feature: media-picker, Property 19: Edit mode pre-population**
         * For any existing product being edited, opening the media picker should pre-select 
         * the images that are currently associated with that product.
         */
        it('should pre-populate form with existing product images', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate product with images
                    fc.record({
                        id: fc.integer({ min: 1, max: 1000 }),
                        name: fc.string({ minLength: 1, maxLength: 50 }),
                        price: fc.integer({ min: 1, max: 100000 }),
                        stock: fc.integer({ min: 0, max: 1000 }),
                        imageUrls: fc.array(
                            fc.webUrl({ withFragments: false, withQueryParameters: false }),
                            { minLength: 1, maxLength: 4 }
                        ),
                    }),
                    async ({ id, name, price, stock, imageUrls }) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length === 0) return true;

                        // Create mock product with images
                        const mockProduct: Product = {
                            id,
                            name,
                            slug: name.toLowerCase().replace(/\s+/g, '-'),
                            description: 'Test product',
                            price,
                            stock,
                            imageUrl: uniqueUrls[0], // Use first image as string
                            category: mockCategories[0],
                            isFeatured: false,
                            isOnSale: false,
                            discountPercent: null,
                        };

                        vi.mocked(mediaApi.listImages).mockResolvedValue(uniqueUrls);

                        const mockOnSave = vi.fn();
                        const mockOnClose = vi.fn();

                        const { container, unmount } = render(
                            <ProductForm
                                open={true}
                                onClose={mockOnClose}
                                onSave={mockOnSave}
                                product={mockProduct}
                                categories={mockCategories}
                            />
                        );

                        try {
                            // Wait for form to render with product data
                            await waitFor(() => {
                                const form = container.querySelector('form');
                                expect(form).toBeTruthy();
                            }, { timeout: 1000 });

                            // Verify images are displayed as thumbnails
                            await waitFor(() => {
                                const thumbnails = container.querySelectorAll('img[alt*="Producto imagen"]');
                                expect(thumbnails.length).toBe(uniqueUrls.length);
                            }, { timeout: 500 });

                            // Open MediaPicker to verify pre-selection
                            const selectImagesButton = screen.getByRole('button', { name: /seleccionar imágenes/i });
                            fireEvent.click(selectImagesButton);

                            await waitFor(() => {
                                const dialog = screen.getByRole('dialog');
                                expect(dialog).toBeTruthy();
                            }, { timeout: 1000 });

                            // Wait for images to load
                            await waitFor(() => {
                                const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                                expect(imageContainers.length).toBeGreaterThan(0);
                            }, { timeout: 1000 });

                            // Verify that the product's images are pre-selected in MediaPicker
                            await waitFor(() => {
                                const selectedIndicators = container.querySelectorAll('.bg-blue-500\\/20');
                                expect(selectedIndicators.length).toBe(uniqueUrls.length);
                            }, { timeout: 500 });
                        } finally {
                            unmount();
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should handle products with single imageUrl string in edit mode', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.record({
                        id: fc.integer({ min: 1, max: 1000 }),
                        name: fc.string({ minLength: 1, maxLength: 50 }),
                        imageUrl: fc.webUrl({ withFragments: false, withQueryParameters: false }),
                    }),
                    async ({ id, name, imageUrl }) => {
                        // Create mock product with single imageUrl string (backward compatibility)
                        const mockProduct: Product = {
                            id,
                            name,
                            slug: name.toLowerCase().replace(/\s+/g, '-'),
                            description: 'Test product',
                            price: 1000,
                            stock: 10,
                            imageUrl: imageUrl, // Single string, not array
                            category: mockCategories[0],
                            isFeatured: false,
                            isOnSale: false,
                            discountPercent: null,
                        };

                        vi.mocked(mediaApi.listImages).mockResolvedValue([imageUrl]);

                        const mockOnSave = vi.fn();
                        const mockOnClose = vi.fn();

                        const { container, unmount } = render(
                            <ProductForm
                                open={true}
                                onClose={mockOnClose}
                                onSave={mockOnSave}
                                product={mockProduct}
                                categories={mockCategories}
                            />
                        );

                        try {
                            // Wait for form to render
                            await waitFor(() => {
                                const form = container.querySelector('form');
                                expect(form).toBeTruthy();
                            }, { timeout: 1000 });

                            // Verify single image is displayed as thumbnail
                            await waitFor(() => {
                                const thumbnails = container.querySelectorAll('img[alt*="Producto imagen"]');
                                expect(thumbnails.length).toBe(1);
                                // Normalize URLs for comparison (browser may add/remove trailing slashes and dots)
                                const normalizeUrl = (url: string) => {
                                    try {
                                        const urlObj = new URL(url);
                                        return urlObj.href.replace(/\/+$/, '').replace(/\.+$/, '');
                                    } catch {
                                        return url.replace(/\/+$/, '').replace(/\.+$/, '');
                                    }
                                };
                                expect(normalizeUrl((thumbnails[0] as HTMLImageElement).src)).toBe(normalizeUrl(imageUrl));
                            }, { timeout: 500 });
                        } finally {
                            unmount();
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);
    });
});
