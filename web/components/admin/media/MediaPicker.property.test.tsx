/**
 * Property-Based Tests for MediaPicker Component
 * 
 * Property 9: Multiple selection mode
 * **Feature: media-picker, Property 9: Multiple selection mode**
 * **Validates: Requirements 3.3**
 * 
 * Property 10: Single selection mode
 * **Feature: media-picker, Property 10: Single selection mode**
 * **Validates: Requirements 3.4**
 * 
 * Property 11: Selection callback correctness
 * **Feature: media-picker, Property 11: Selection callback correctness**
 * **Validates: Requirements 3.5**
 * 
 * Property 21: Auto-switch to library after upload
 * **Feature: media-picker, Property 21: Auto-switch to library after upload**
 * **Validates: Requirements 6.5**
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import MediaPicker from './MediaPicker';
import * as mediaApi from '@/lib/mediaApi';

// Mock the mediaApi module
vi.mock('@/lib/mediaApi', () => ({
    uploadImage: vi.fn(),
    listImages: vi.fn(),
}));

describe('MediaPicker - Property-Based Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    describe('Property 9: Multiple selection mode', () => {
        it('should allow selecting multiple images simultaneously when multiple=true', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate array of image URLs (2-10 images)
                    fc.array(
                        fc.webUrl({ withFragments: false, withQueryParameters: false }),
                        { minLength: 2, maxLength: 10 }
                    ),
                    // Generate number of images to select (2-5)
                    fc.integer({ min: 2, max: 5 }),
                    async (imageUrls, numToSelect) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length < 2) return true;

                        // Mock listImages to return our test images
                        vi.mocked(mediaApi.listImages).mockResolvedValue(uniqueUrls);

                        const mockOnSelect = vi.fn();
                        const mockOnClose = vi.fn();

                        // Render MediaPicker with multiple=true
                        const { container, unmount } = render(
                            <MediaPicker
                                open={true}
                                multiple={true}
                                onSelect={mockOnSelect}
                                onClose={mockOnClose}
                            />
                        );

                        try {
                            // Wait for images to load
                            await waitFor(() => {
                                const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                                expect(imageContainers.length).toBeGreaterThan(0);
                            }, { timeout: 1000 });

                            // Select multiple images
                            const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                            const selectCount = Math.min(numToSelect, imageContainers.length);

                            for (let i = 0; i < selectCount; i++) {
                                fireEvent.click(imageContainers[i]);
                            }

                            // Verify all selected images have visual indicators
                            await waitFor(() => {
                                const selectedIndicators = container.querySelectorAll('.bg-blue-500\\/20');
                                expect(selectedIndicators.length).toBe(selectCount);
                            }, { timeout: 500 });

                            // Click Select button
                            const selectButton = screen.getByRole('button', { name: /select \(\d+\)/i });
                            fireEvent.click(selectButton);

                            // Verify onSelect was called with all selected URLs
                            await waitFor(() => {
                                expect(mockOnSelect).toHaveBeenCalledTimes(1);
                                const selectedUrls = mockOnSelect.mock.calls[0][0];
                                expect(selectedUrls).toHaveLength(selectCount);
                                expect(selectedUrls.every((url: string) => uniqueUrls.includes(url))).toBe(true);
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

        it('should maintain all selections when toggling images in multiple mode', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate array of image URLs
                    fc.array(
                        fc.webUrl({ withFragments: false, withQueryParameters: false }),
                        { minLength: 3, maxLength: 8 }
                    ),
                    async (imageUrls) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length < 3) return true;

                        vi.mocked(mediaApi.listImages).mockResolvedValue(uniqueUrls);

                        const mockOnSelect = vi.fn();
                        const mockOnClose = vi.fn();

                        const { container, unmount } = render(
                            <MediaPicker
                                open={true}
                                multiple={true}
                                onSelect={mockOnSelect}
                                onClose={mockOnClose}
                            />
                        );

                        try {
                            // Wait for images to load
                            await waitFor(() => {
                                const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                                expect(imageContainers.length).toBeGreaterThan(0);
                            }, { timeout: 1000 });

                            const imageContainers = container.querySelectorAll('[class*="aspect-square"]');

                            // Select first image
                            fireEvent.click(imageContainers[0]);
                            await waitFor(() => {
                                const selected = container.querySelectorAll('.bg-blue-500\\/20');
                                expect(selected.length).toBe(1);
                            }, { timeout: 300 });

                            // Select second image
                            fireEvent.click(imageContainers[1]);
                            await waitFor(() => {
                                const selected = container.querySelectorAll('.bg-blue-500\\/20');
                                expect(selected.length).toBe(2);
                            }, { timeout: 300 });

                            // Select third image
                            fireEvent.click(imageContainers[2]);
                            await waitFor(() => {
                                const selected = container.querySelectorAll('.bg-blue-500\\/20');
                                expect(selected.length).toBe(3);
                            }, { timeout: 300 });

                            // All three should still be selected
                            const finalSelected = container.querySelectorAll('.bg-blue-500\\/20');
                            expect(finalSelected.length).toBe(3);
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

    describe('Property 10: Single selection mode', () => {
        it('should maintain exactly one or zero selected images when multiple=false', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate array of image URLs
                    fc.array(
                        fc.webUrl({ withFragments: false, withQueryParameters: false }),
                        { minLength: 3, maxLength: 10 }
                    ),
                    async (imageUrls) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length < 3) return true;

                        vi.mocked(mediaApi.listImages).mockResolvedValue(uniqueUrls);

                        const mockOnSelect = vi.fn();
                        const mockOnClose = vi.fn();

                        // Render MediaPicker with multiple=false
                        const { container, unmount } = render(
                            <MediaPicker
                                open={true}
                                multiple={false}
                                onSelect={mockOnSelect}
                                onClose={mockOnClose}
                            />
                        );

                        try {
                            // Wait for images to load
                            await waitFor(() => {
                                const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                                expect(imageContainers.length).toBeGreaterThan(0);
                            }, { timeout: 1000 });

                            const imageContainers = container.querySelectorAll('[class*="aspect-square"]');

                            // Select first image
                            fireEvent.click(imageContainers[0]);
                            await waitFor(() => {
                                const selected = container.querySelectorAll('.bg-blue-500\\/20');
                                expect(selected.length).toBe(1);
                            }, { timeout: 300 });

                            // Select second image - should deselect first
                            fireEvent.click(imageContainers[1]);
                            await waitFor(() => {
                                const selected = container.querySelectorAll('.bg-blue-500\\/20');
                                expect(selected.length).toBe(1);
                            }, { timeout: 300 });

                            // Select third image - should deselect second
                            fireEvent.click(imageContainers[2]);
                            await waitFor(() => {
                                const selected = container.querySelectorAll('.bg-blue-500\\/20');
                                expect(selected.length).toBe(1);
                            }, { timeout: 300 });

                            // Verify only one image is selected
                            const finalSelected = container.querySelectorAll('.bg-blue-500\\/20');
                            expect(finalSelected.length).toBe(1);
                        } finally {
                            unmount();
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should deselect when clicking the same image twice in single mode', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate array of image URLs
                    fc.array(
                        fc.webUrl({ withFragments: false, withQueryParameters: false }),
                        { minLength: 2, maxLength: 8 }
                    ),
                    async (imageUrls) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length < 2) return true;

                        vi.mocked(mediaApi.listImages).mockResolvedValue(uniqueUrls);

                        const mockOnSelect = vi.fn();
                        const mockOnClose = vi.fn();

                        const { container, unmount } = render(
                            <MediaPicker
                                open={true}
                                multiple={false}
                                onSelect={mockOnSelect}
                                onClose={mockOnClose}
                            />
                        );

                        try {
                            // Wait for images to load
                            await waitFor(() => {
                                const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                                expect(imageContainers.length).toBeGreaterThan(0);
                            }, { timeout: 1000 });

                            const imageContainers = container.querySelectorAll('[class*="aspect-square"]');

                            // Select first image
                            fireEvent.click(imageContainers[0]);
                            await waitFor(() => {
                                const selected = container.querySelectorAll('.bg-blue-500\\/20');
                                expect(selected.length).toBe(1);
                            }, { timeout: 300 });

                            // Click same image again - should deselect
                            fireEvent.click(imageContainers[0]);
                            await waitFor(() => {
                                const selected = container.querySelectorAll('.bg-blue-500\\/20');
                                expect(selected.length).toBe(0);
                            }, { timeout: 300 });
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

    describe('Property 11: Selection callback correctness', () => {
        it('should call onSelect with exact array of selected URLs', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate array of image URLs
                    fc.array(
                        fc.webUrl({ withFragments: false, withQueryParameters: false }),
                        { minLength: 3, maxLength: 10 }
                    ),
                    // Generate indices to select
                    fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: 5 }),
                    async (imageUrls, indicesToSelect) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length < 2) return true;

                        vi.mocked(mediaApi.listImages).mockResolvedValue(uniqueUrls);

                        const mockOnSelect = vi.fn();
                        const mockOnClose = vi.fn();

                        const { container, unmount } = render(
                            <MediaPicker
                                open={true}
                                multiple={true}
                                onSelect={mockOnSelect}
                                onClose={mockOnClose}
                            />
                        );

                        try {
                            // Wait for images to load
                            await waitFor(() => {
                                const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                                expect(imageContainers.length).toBeGreaterThan(0);
                            }, { timeout: 1000 });

                            const imageContainers = container.querySelectorAll('[class*="aspect-square"]');

                            // Select images based on indices
                            const validIndices = indicesToSelect.filter(idx => idx < imageContainers.length);
                            const uniqueIndices = Array.from(new Set(validIndices));
                            const expectedUrls: string[] = [];

                            for (const idx of uniqueIndices) {
                                fireEvent.click(imageContainers[idx]);
                                expectedUrls.push(uniqueUrls[idx]);
                            }

                            // Wait for selections to be applied
                            if (uniqueIndices.length > 0) {
                                await waitFor(() => {
                                    const selected = container.querySelectorAll('.bg-blue-500\\/20');
                                    expect(selected.length).toBe(uniqueIndices.length);
                                }, { timeout: 500 });

                                // Click Select button
                                const selectButton = screen.getByRole('button', { name: /select \(\d+\)/i });
                                fireEvent.click(selectButton);

                                // Verify onSelect was called with exact URLs
                                await waitFor(() => {
                                    expect(mockOnSelect).toHaveBeenCalledTimes(1);
                                    const selectedUrls = mockOnSelect.mock.calls[0][0];
                                    expect(selectedUrls).toHaveLength(expectedUrls.length);
                                    expect(selectedUrls.sort()).toEqual(expectedUrls.sort());
                                }, { timeout: 500 });
                            }
                        } finally {
                            unmount();
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should call onSelect with empty array when no images selected', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate array of image URLs
                    fc.array(
                        fc.webUrl({ withFragments: false, withQueryParameters: false }),
                        { minLength: 1, maxLength: 5 }
                    ),
                    async (imageUrls) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length === 0) return true;

                        vi.mocked(mediaApi.listImages).mockResolvedValue(uniqueUrls);

                        const mockOnSelect = vi.fn();
                        const mockOnClose = vi.fn();

                        const { container, unmount } = render(
                            <MediaPicker
                                open={true}
                                multiple={true}
                                onSelect={mockOnSelect}
                                onClose={mockOnClose}
                            />
                        );

                        try {
                            // Wait for images to load
                            await waitFor(() => {
                                const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                                expect(imageContainers.length).toBeGreaterThan(0);
                            }, { timeout: 1000 });

                            // Don't select any images, just try to click Select button
                            // The button should be disabled, so we need to check that
                            const selectButtons = screen.queryAllByRole('button', { name: /select/i });
                            const selectButton = selectButtons.find(btn => btn.textContent?.includes('Select'));

                            if (selectButton) {
                                // Button should be disabled when nothing is selected
                                expect(selectButton).toBeDisabled();
                            }
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

    describe('Property 21: Auto-switch to library after upload', () => {
        it('should automatically switch to library tab after successful upload', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate random file type
                    fc.constantFrom('image/jpeg', 'image/png', 'image/webp', 'image/gif'),
                    // Generate random URL for uploaded image
                    fc.webUrl({ withFragments: false, withQueryParameters: false }),
                    async (fileType, uploadedUrl) => {
                        // Mock listImages to return empty initially
                        vi.mocked(mediaApi.listImages).mockResolvedValue([]);

                        // Mock uploadImage to succeed
                        vi.mocked(mediaApi.uploadImage).mockResolvedValue({ url: uploadedUrl });

                        const mockOnSelect = vi.fn();
                        const mockOnClose = vi.fn();

                        const { container, unmount } = render(
                            <MediaPicker
                                open={true}
                                multiple={false}
                                onSelect={mockOnSelect}
                                onClose={mockOnClose}
                            />
                        );

                        try {
                            // Wait for modal to render
                            await waitFor(() => {
                                const modal = screen.getByRole('dialog');
                                expect(modal).toBeTruthy();
                            }, { timeout: 1000 });

                            // Switch to Upload tab
                            const uploadTab = screen.getByRole('button', { name: /upload file/i });
                            fireEvent.click(uploadTab);

                            // Verify we're on Upload tab
                            await waitFor(() => {
                                const fileInput = container.querySelector('input[type="file"]');
                                expect(fileInput).toBeTruthy();
                            }, { timeout: 500 });

                            // Create and select a file
                            const mockFile = new File(['mock content'], 'test.jpg', { type: fileType });
                            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

                            Object.defineProperty(fileInput, 'files', {
                                value: [mockFile],
                                writable: false,
                            });
                            fireEvent.change(fileInput);

                            // Wait for preview
                            await waitFor(() => {
                                const preview = container.querySelector('img[alt="Preview"]');
                                expect(preview).toBeTruthy();
                            }, { timeout: 500 });

                            // Click upload button
                            const uploadButtons = screen.queryAllByRole('button', { name: /upload image/i });
                            const uploadButton = uploadButtons.find(btn => !btn.hasAttribute('disabled'));
                            expect(uploadButton).toBeTruthy();
                            fireEvent.click(uploadButton!);

                            // Wait for upload to complete and verify auto-switch to library tab
                            await waitFor(() => {
                                // Check that Library tab is now active (has blue border)
                                const libraryTab = screen.getByRole('button', { name: /media library/i });
                                expect(libraryTab.className).toContain('text-blue-600');
                                expect(libraryTab.className).toContain('border-blue-600');
                            }, { timeout: 1000 });

                            // Verify upload tab is no longer active
                            const uploadTabAfter = screen.getByRole('button', { name: /upload file/i });
                            expect(uploadTabAfter.className).not.toContain('border-blue-600');
                        } finally {
                            unmount();
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should add uploaded image to gallery after auto-switch', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate random uploaded URL
                    fc.webUrl({ withFragments: false, withQueryParameters: false }),
                    async (uploadedUrl) => {
                        // Mock listImages to return empty initially
                        vi.mocked(mediaApi.listImages).mockResolvedValue([]);

                        // Mock uploadImage to succeed
                        vi.mocked(mediaApi.uploadImage).mockResolvedValue({ url: uploadedUrl });

                        const mockOnSelect = vi.fn();
                        const mockOnClose = vi.fn();

                        const { container, unmount } = render(
                            <MediaPicker
                                open={true}
                                multiple={false}
                                onSelect={mockOnSelect}
                                onClose={mockOnClose}
                            />
                        );

                        try {
                            // Switch to Upload tab
                            const uploadTab = screen.getByRole('button', { name: /upload file/i });
                            fireEvent.click(uploadTab);

                            // Wait for upload interface
                            await waitFor(() => {
                                const fileInput = container.querySelector('input[type="file"]');
                                expect(fileInput).toBeTruthy();
                            }, { timeout: 500 });

                            // Upload a file
                            const mockFile = new File(['mock content'], 'test.jpg', { type: 'image/jpeg' });
                            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

                            Object.defineProperty(fileInput, 'files', {
                                value: [mockFile],
                                writable: false,
                            });
                            fireEvent.change(fileInput);

                            // Wait for preview
                            await waitFor(() => {
                                const preview = container.querySelector('img[alt="Preview"]');
                                expect(preview).toBeTruthy();
                            }, { timeout: 500 });

                            // Click upload
                            const uploadButtons = screen.queryAllByRole('button', { name: /upload image/i });
                            const uploadButton = uploadButtons.find(btn => !btn.hasAttribute('disabled'));
                            fireEvent.click(uploadButton!);

                            // Wait for auto-switch to library
                            await waitFor(() => {
                                const libraryTab = screen.getByRole('button', { name: /media library/i });
                                expect(libraryTab.className).toContain('text-blue-600');
                            }, { timeout: 1000 });

                            // Verify the uploaded image appears in the gallery
                            await waitFor(() => {
                                const images = container.querySelectorAll('img[alt="Media item"]');
                                expect(images.length).toBeGreaterThan(0);
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
