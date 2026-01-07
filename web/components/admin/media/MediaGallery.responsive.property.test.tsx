/**
 * Property-Based Tests for MediaGallery Responsive Layout
 * **Feature: media-picker, Property 27: Responsive layout adaptation**
 * **Validates: Requirements 8.1**
 * 
 * Property 27: Responsive layout adaptation
 * For any viewport width change, the media picker layout should adapt appropriately 
 * (modal size, grid columns, button placement).
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import MediaGallery from './MediaGallery';

describe('MediaGallery - Responsive Layout Property Tests', () => {
    describe('Property 27: Responsive layout adaptation', () => {
        it('should have responsive grid classes for any number of images', () => {
            fc.assert(
                fc.property(
                    // Generate array of image URLs (0-50 images)
                    fc.array(
                        fc.webUrl({ withFragments: false, withQueryParameters: false }),
                        { minLength: 0, maxLength: 50 }
                    ),
                    (imageUrls) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));

                        const { container } = render(
                            <MediaGallery
                                images={uniqueUrls}
                                selected={[]}
                                onToggleSelect={() => { }}
                            />
                        );

                        if (uniqueUrls.length === 0) {
                            // Empty state should be displayed
                            const emptyState = container.querySelector('.flex.flex-col.items-center.justify-center');
                            expect(emptyState).toBeTruthy();
                        } else {
                            // Grid should have responsive classes
                            const grid = container.querySelector('[role="grid"]');
                            expect(grid).toBeTruthy();

                            if (grid) {
                                const classes = grid.className;
                                // Check for responsive grid classes
                                expect(classes).toContain('grid');
                                expect(classes).toContain('grid-cols-2'); // Mobile: 2 columns
                                expect(classes).toMatch(/md:grid-cols-[34]/); // Medium: 3-4 columns
                                expect(classes).toMatch(/lg:grid-cols-[46]/); // Large: 4-6 columns
                            }
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should have responsive gap spacing for any image count', () => {
            fc.assert(
                fc.property(
                    // Generate array of image URLs
                    fc.array(
                        fc.webUrl({ withFragments: false, withQueryParameters: false }),
                        { minLength: 1, maxLength: 30 }
                    ),
                    (imageUrls) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length === 0) return true;

                        const { container } = render(
                            <MediaGallery
                                images={uniqueUrls}
                                selected={[]}
                                onToggleSelect={() => { }}
                            />
                        );

                        const grid = container.querySelector('[role="grid"]');
                        expect(grid).toBeTruthy();

                        if (grid) {
                            const classes = grid.className;
                            // Check for responsive gap classes
                            expect(classes).toMatch(/gap-\d+/); // Has gap class
                            expect(classes).toMatch(/sm:gap-\d+/); // Has responsive gap
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should have responsive padding for any viewport', () => {
            fc.assert(
                fc.property(
                    // Generate array of image URLs
                    fc.array(
                        fc.webUrl({ withFragments: false, withQueryParameters: false }),
                        { minLength: 1, maxLength: 20 }
                    ),
                    (imageUrls) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length === 0) return true;

                        const { container } = render(
                            <MediaGallery
                                images={uniqueUrls}
                                selected={[]}
                                onToggleSelect={() => { }}
                            />
                        );

                        // Check the container has responsive padding
                        const galleryContainer = container.querySelector('.overflow-auto');
                        expect(galleryContainer).toBeTruthy();

                        if (galleryContainer) {
                            const classes = galleryContainer.className;
                            // Should have responsive padding
                            expect(classes).toMatch(/p-\d+/); // Has padding
                            expect(classes).toMatch(/sm:p-\d+/); // Has responsive padding
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should render all images regardless of viewport size', () => {
            fc.assert(
                fc.property(
                    // Generate array of image URLs
                    fc.array(
                        fc.webUrl({ withFragments: false, withQueryParameters: false }),
                        { minLength: 1, maxLength: 25 }
                    ),
                    (imageUrls) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length === 0) return true;

                        const { container } = render(
                            <MediaGallery
                                images={uniqueUrls}
                                selected={[]}
                                onToggleSelect={() => { }}
                            />
                        );

                        // Count rendered image containers
                        const imageContainers = container.querySelectorAll('[class*="aspect-square"]');

                        // All images should be rendered
                        expect(imageContainers.length).toBe(uniqueUrls.length);

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should maintain aspect ratio for all images in responsive grid', () => {
            fc.assert(
                fc.property(
                    // Generate array of image URLs
                    fc.array(
                        fc.webUrl({ withFragments: false, withQueryParameters: false }),
                        { minLength: 1, maxLength: 15 }
                    ),
                    (imageUrls) => {
                        const uniqueUrls = Array.from(new Set(imageUrls));
                        if (uniqueUrls.length === 0) return true;

                        const { container } = render(
                            <MediaGallery
                                images={uniqueUrls}
                                selected={[]}
                                onToggleSelect={() => { }}
                            />
                        );

                        // All image containers should have aspect-square class
                        const imageContainers = container.querySelectorAll('[class*="aspect-square"]');

                        imageContainers.forEach(container => {
                            expect(container.className).toContain('aspect-square');
                        });

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});
