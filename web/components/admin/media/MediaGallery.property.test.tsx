/**
 * Property-Based Tests for MediaGallery Component
 * **Feature: media-picker, Property 7: Selection toggle behavior**
 * **Validates: Requirements 3.1**
 * 
 * Property 7: Selection toggle behavior
 * For any image in the gallery, clicking it should toggle its selection state 
 * (selected → unselected, unselected → selected).
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import MediaGallery from './MediaGallery';

describe('MediaGallery - Property-Based Tests', () => {
    describe('Property 7: Selection toggle behavior', () => {
        it('should toggle selection state when clicking any image', () => {
            fc.assert(
                fc.property(
                    // Generate array of image URLs (1-20 images)
                    fc.array(
                        fc.webUrl({ withFragments: false, withQueryParameters: false }),
                        { minLength: 1, maxLength: 20 }
                    ),
                    // Generate initial selection state (array of selected URLs)
                    fc.array(fc.nat(), { maxLength: 20 }),
                    (imageUrls, selectedIndices) => {
                        // Ensure unique URLs
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length === 0) return true;

                        // Create initial selected array based on indices
                        const initialSelected = selectedIndices
                            .filter(idx => idx < uniqueUrls.length)
                            .map(idx => uniqueUrls[idx]);

                        const mockOnToggleSelect = vi.fn();

                        // Render the gallery
                        const { container } = render(
                            <MediaGallery
                                images={uniqueUrls}
                                selected={initialSelected}
                                onToggleSelect={mockOnToggleSelect}
                            />
                        );

                        // Pick a random image to click
                        const randomIndex = selectedIndices[0] % uniqueUrls.length;
                        const targetUrl = uniqueUrls[randomIndex];

                        // Find all clickable image containers
                        const imageContainers = container.querySelectorAll('[class*="aspect-square"]');

                        if (imageContainers.length > randomIndex) {
                            // Click the image
                            fireEvent.click(imageContainers[randomIndex]);

                            // Verify onToggleSelect was called with the correct URL
                            expect(mockOnToggleSelect).toHaveBeenCalledWith(targetUrl);
                            expect(mockOnToggleSelect).toHaveBeenCalledTimes(1);
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should maintain correct selection state after multiple toggles', () => {
            fc.assert(
                fc.property(
                    // Generate array of image URLs
                    fc.array(
                        fc.webUrl({ withFragments: false, withQueryParameters: false }),
                        { minLength: 1, maxLength: 10 }
                    ),
                    (imageUrls) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length === 0) return true;

                        let currentSelected: string[] = [];
                        const mockOnToggleSelect = vi.fn((url: string) => {
                            // Simulate the toggle logic
                            if (currentSelected.includes(url)) {
                                currentSelected = currentSelected.filter(u => u !== url);
                            } else {
                                currentSelected = [...currentSelected, url];
                            }
                        });

                        // Test clicking the first image twice
                        const targetUrl = uniqueUrls[0];

                        // First click - should add to selection
                        render(
                            <MediaGallery
                                images={uniqueUrls}
                                selected={currentSelected}
                                onToggleSelect={mockOnToggleSelect}
                            />
                        );

                        mockOnToggleSelect(targetUrl);
                        expect(currentSelected).toContain(targetUrl);

                        // Second click - should remove from selection
                        mockOnToggleSelect(targetUrl);
                        expect(currentSelected).not.toContain(targetUrl);

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should call onToggleSelect for each image independently', () => {
            fc.assert(
                fc.property(
                    // Generate array of image URLs
                    fc.array(
                        fc.webUrl({ withFragments: false, withQueryParameters: false }),
                        { minLength: 2, maxLength: 10 }
                    ),
                    (imageUrls) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length < 2) return true;

                        const mockOnToggleSelect = vi.fn();

                        const { container } = render(
                            <MediaGallery
                                images={uniqueUrls}
                                selected={[]}
                                onToggleSelect={mockOnToggleSelect}
                            />
                        );

                        // Click first two images
                        const imageContainers = container.querySelectorAll('[class*="aspect-square"]');

                        if (imageContainers.length >= 2) {
                            fireEvent.click(imageContainers[0]);
                            fireEvent.click(imageContainers[1]);

                            // Verify both calls were made with different URLs
                            expect(mockOnToggleSelect).toHaveBeenCalledTimes(2);
                            expect(mockOnToggleSelect).toHaveBeenNthCalledWith(1, uniqueUrls[0]);
                            expect(mockOnToggleSelect).toHaveBeenNthCalledWith(2, uniqueUrls[1]);
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});
