/**
 * Unit tests for MediaGallery Component
 * Tests grid rendering, empty state, and loading state
 * Requirements: 2.2, 2.3, 2.4
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MediaGallery from './MediaGallery';

describe('MediaGallery', () => {
    const mockImages = [
        'http://localhost:9000/products/image1.jpg',
        'http://localhost:9000/products/image2.jpg',
        'http://localhost:9000/products/image3.jpg',
    ];
    const mockOnToggleSelect = vi.fn();
    const mockOnRefresh = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Grid rendering', () => {
        it('should render all images in a grid', () => {
            // Arrange & Act
            const { container } = render(
                <MediaGallery
                    images={mockImages}
                    selected={[]}
                    onToggleSelect={mockOnToggleSelect}
                />
            );

            // Assert - Check for grid container
            const grid = container.querySelector('.grid');
            expect(grid).toBeTruthy();

            // Assert - Check that all images are rendered
            const images = screen.getAllByRole('img');
            expect(images).toHaveLength(mockImages.length);
        });

        it('should apply responsive grid classes', () => {
            // Arrange & Act
            const { container } = render(
                <MediaGallery
                    images={mockImages}
                    selected={[]}
                    onToggleSelect={mockOnToggleSelect}
                />
            );

            // Assert - Check for responsive grid classes
            const grid = container.querySelector('.grid');
            expect(grid?.className).toContain('grid-cols-2');
            expect(grid?.className).toContain('md:grid-cols-4');
            expect(grid?.className).toContain('lg:grid-cols-6');
        });

        it('should render images with correct URLs', () => {
            // Arrange & Act
            render(
                <MediaGallery
                    images={mockImages}
                    selected={[]}
                    onToggleSelect={mockOnToggleSelect}
                />
            );

            // Assert - Check that each image has correct src
            const images = screen.getAllByRole('img');
            images.forEach((img, index) => {
                expect(img.getAttribute('src')).toBe(mockImages[index]);
            });
        });

        it('should pass selection state to MediaItem components', () => {
            // Arrange
            const selectedImages = [mockImages[0], mockImages[2]];

            // Act
            const { container } = render(
                <MediaGallery
                    images={mockImages}
                    selected={selectedImages}
                    onToggleSelect={mockOnToggleSelect}
                />
            );

            // Assert - Check for selected styling (ring-blue-500)
            const selectedElements = container.querySelectorAll('.ring-blue-500');
            expect(selectedElements.length).toBeGreaterThan(0);
        });

        it('should call onToggleSelect when an image is clicked', () => {
            // Arrange
            const { container } = render(
                <MediaGallery
                    images={mockImages}
                    selected={[]}
                    onToggleSelect={mockOnToggleSelect}
                />
            );

            // Act - Click the first image container
            const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
            fireEvent.click(imageContainers[0]);

            // Assert
            expect(mockOnToggleSelect).toHaveBeenCalledWith(mockImages[0]);
            expect(mockOnToggleSelect).toHaveBeenCalledTimes(1);
        });
    });

    describe('Empty state', () => {
        it('should display empty state message when no images', () => {
            // Arrange & Act
            render(
                <MediaGallery
                    images={[]}
                    selected={[]}
                    onToggleSelect={mockOnToggleSelect}
                />
            );

            // Assert
            expect(screen.getByText('No images available')).toBeTruthy();
            expect(screen.getByText('Upload your first image to get started')).toBeTruthy();
        });

        it('should display empty state icon when no images', () => {
            // Arrange & Act
            const { container } = render(
                <MediaGallery
                    images={[]}
                    selected={[]}
                    onToggleSelect={mockOnToggleSelect}
                />
            );

            // Assert - Check for SVG icon
            const icon = container.querySelector('svg');
            expect(icon).toBeTruthy();
        });

        it('should not render grid when empty', () => {
            // Arrange & Act
            const { container } = render(
                <MediaGallery
                    images={[]}
                    selected={[]}
                    onToggleSelect={mockOnToggleSelect}
                />
            );

            // Assert - Grid should not be present
            const grid = container.querySelector('.grid');
            expect(grid).toBeFalsy();
        });

        it('should center empty state content', () => {
            // Arrange & Act
            const { container } = render(
                <MediaGallery
                    images={[]}
                    selected={[]}
                    onToggleSelect={mockOnToggleSelect}
                />
            );

            // Assert - Check for centering classes
            const emptyContainer = container.querySelector('.flex');
            expect(emptyContainer?.className).toContain('items-center');
            expect(emptyContainer?.className).toContain('justify-center');
        });
    });

    describe('Loading state', () => {
        it('should display skeleton placeholders when loading', () => {
            // Arrange & Act
            const { container } = render(
                <MediaGallery
                    images={mockImages}
                    selected={[]}
                    onToggleSelect={mockOnToggleSelect}
                    isLoading={true}
                />
            );

            // Assert - Check for skeleton elements
            const skeletons = container.querySelectorAll('.animate-pulse');
            expect(skeletons.length).toBeGreaterThan(0);
        });

        it('should display 12 skeleton placeholders', () => {
            // Arrange & Act
            const { container } = render(
                <MediaGallery
                    images={mockImages}
                    selected={[]}
                    onToggleSelect={mockOnToggleSelect}
                    isLoading={true}
                />
            );

            // Assert
            const skeletons = container.querySelectorAll('.animate-pulse');
            expect(skeletons).toHaveLength(12);
        });

        it('should not render actual images when loading', () => {
            // Arrange & Act
            render(
                <MediaGallery
                    images={mockImages}
                    selected={[]}
                    onToggleSelect={mockOnToggleSelect}
                    isLoading={true}
                />
            );

            // Assert - No img elements should be present
            const images = screen.queryAllByRole('img');
            expect(images).toHaveLength(0);
        });

        it('should apply responsive grid to skeletons', () => {
            // Arrange & Act
            const { container } = render(
                <MediaGallery
                    images={mockImages}
                    selected={[]}
                    onToggleSelect={mockOnToggleSelect}
                    isLoading={true}
                />
            );

            // Assert - Check for responsive grid classes
            const grid = container.querySelector('.grid');
            expect(grid?.className).toContain('grid-cols-2');
            expect(grid?.className).toContain('md:grid-cols-4');
            expect(grid?.className).toContain('lg:grid-cols-6');
        });

        it('should not display empty state when loading', () => {
            // Arrange & Act
            render(
                <MediaGallery
                    images={[]}
                    selected={[]}
                    onToggleSelect={mockOnToggleSelect}
                    isLoading={true}
                />
            );

            // Assert
            expect(screen.queryByText('No images available')).toBeFalsy();
        });
    });

    describe('Default props', () => {
        it('should not be loading by default', () => {
            // Arrange & Act
            const { container } = render(
                <MediaGallery
                    images={mockImages}
                    selected={[]}
                    onToggleSelect={mockOnToggleSelect}
                />
            );

            // Assert - Should render images, not skeletons
            const images = screen.getAllByRole('img');
            expect(images.length).toBeGreaterThan(0);
        });

        it('should work without onRefresh prop', () => {
            // Arrange & Act
            expect(() => {
                render(
                    <MediaGallery
                        images={mockImages}
                        selected={[]}
                        onToggleSelect={mockOnToggleSelect}
                    />
                );
            }).not.toThrow();
        });
    });

    describe('Scrollable container', () => {
        it('should have overflow-auto class for scrolling', () => {
            // Arrange & Act
            const { container } = render(
                <MediaGallery
                    images={mockImages}
                    selected={[]}
                    onToggleSelect={mockOnToggleSelect}
                />
            );

            // Assert
            const scrollContainer = container.querySelector('.overflow-auto');
            expect(scrollContainer).toBeTruthy();
        });

        it('should have full width and height', () => {
            // Arrange & Act
            const { container } = render(
                <MediaGallery
                    images={mockImages}
                    selected={[]}
                    onToggleSelect={mockOnToggleSelect}
                />
            );

            // Assert
            const scrollContainer = container.querySelector('.w-full.h-full');
            expect(scrollContainer).toBeTruthy();
        });
    });
});
