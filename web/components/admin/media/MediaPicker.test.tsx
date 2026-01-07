/**
 * Unit Tests for MediaPicker Component
 * Tests modal open/close, tab switching, and selection state management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import MediaPicker from './MediaPicker';
import * as mediaApi from '@/lib/mediaApi';

// Mock the mediaApi module
vi.mock('@/lib/mediaApi', () => ({
    uploadImage: vi.fn(),
    listImages: vi.fn(),
}));

describe('MediaPicker - Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock listImages to return empty array by default
        vi.mocked(mediaApi.listImages).mockResolvedValue([]);
    });

    afterEach(() => {
        cleanup();
    });

    describe('Modal open/close', () => {
        it('should not render when open=false', () => {
            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            const { container } = render(
                <MediaPicker
                    open={false}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Modal should not be in the DOM
            const modal = container.querySelector('[role="dialog"]');
            expect(modal).toBeNull();
        });

        it('should render when open=true', async () => {
            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            render(
                <MediaPicker
                    open={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Modal should be in the DOM
            await waitFor(() => {
                const modal = screen.getByRole('dialog');
                expect(modal).toBeTruthy();
            });
        });

        it('should call onClose when close button is clicked', async () => {
            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            render(
                <MediaPicker
                    open={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for modal to render
            await waitFor(() => {
                const modal = screen.getByRole('dialog');
                expect(modal).toBeTruthy();
            });

            // Click close button (X button in header)
            const closeButton = screen.getByLabelText('Close modal');
            fireEvent.click(closeButton);

            // Verify onClose was called
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('should call onClose when Close button in footer is clicked', async () => {
            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            render(
                <MediaPicker
                    open={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for modal to render
            await waitFor(() => {
                const modal = screen.getByRole('dialog');
                expect(modal).toBeTruthy();
            });

            // Click Close button in footer (get all buttons and find the one with text "Close")
            const closeButtons = screen.getAllByRole('button', { name: /close/i });
            const footerCloseButton = closeButtons.find(btn => btn.textContent === 'Close');
            expect(footerCloseButton).toBeTruthy();
            fireEvent.click(footerCloseButton!);

            // Verify onClose was called
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('should call onClose when Escape key is pressed', async () => {
            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            render(
                <MediaPicker
                    open={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for modal to render
            await waitFor(() => {
                const modal = screen.getByRole('dialog');
                expect(modal).toBeTruthy();
            });

            // Press Escape key
            fireEvent.keyDown(document, { key: 'Escape' });

            // Verify onClose was called
            await waitFor(() => {
                expect(mockOnClose).toHaveBeenCalledTimes(1);
            });
        });

        it('should call onClose when clicking backdrop', async () => {
            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            const { container } = render(
                <MediaPicker
                    open={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for modal to render
            await waitFor(() => {
                const modal = screen.getByRole('dialog');
                expect(modal).toBeTruthy();
            });

            // Click backdrop (the outer div with bg-black/50)
            const backdrop = container.querySelector('.bg-black\\/50');
            expect(backdrop).toBeTruthy();
            fireEvent.click(backdrop!);

            // Verify onClose was called
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('should not call onClose when clicking modal content', async () => {
            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            const { container } = render(
                <MediaPicker
                    open={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for modal to render
            await waitFor(() => {
                const modal = screen.getByRole('dialog');
                expect(modal).toBeTruthy();
            });

            // Click modal content (the white/gray box)
            const modalContent = container.querySelector('.bg-white');
            expect(modalContent).toBeTruthy();
            fireEvent.click(modalContent!);

            // Verify onClose was NOT called
            expect(mockOnClose).not.toHaveBeenCalled();
        });

        it('should prevent background scrolling when open', async () => {
            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            // Store initial overflow value
            const initialOverflow = document.body.style.overflow;

            const { unmount } = render(
                <MediaPicker
                    open={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for modal to render
            await waitFor(() => {
                const modal = screen.getByRole('dialog');
                expect(modal).toBeTruthy();
            });

            // Body overflow should be hidden
            expect(document.body.style.overflow).toBe('hidden');

            // Unmount component
            unmount();

            // Body overflow should be restored to unset
            expect(document.body.style.overflow).toBe('unset');
        });
    });

    describe('Tab switching', () => {
        it('should default to library tab', async () => {
            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            render(
                <MediaPicker
                    open={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for modal to render
            await waitFor(() => {
                const modal = screen.getByRole('dialog');
                expect(modal).toBeTruthy();
            });

            // Library tab should be active (has blue border)
            const libraryTab = screen.getByRole('button', { name: /media library/i });
            expect(libraryTab.className).toContain('text-blue-600');
            expect(libraryTab.className).toContain('border-blue-600');
        });

        it('should switch to upload tab when clicked', async () => {
            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            const { container } = render(
                <MediaPicker
                    open={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for modal to render
            await waitFor(() => {
                const modal = screen.getByRole('dialog');
                expect(modal).toBeTruthy();
            });

            // Click Upload tab
            const uploadTab = screen.getByRole('button', { name: /upload file/i });
            fireEvent.click(uploadTab);

            // Upload tab should now be active
            await waitFor(() => {
                expect(uploadTab.className).toContain('text-blue-600');
                expect(uploadTab.className).toContain('border-blue-600');
            });

            // Upload interface should be visible
            const fileInput = container.querySelector('input[type="file"]');
            expect(fileInput).toBeTruthy();
        });

        it('should switch back to library tab when clicked', async () => {
            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            const { container } = render(
                <MediaPicker
                    open={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for modal to render
            await waitFor(() => {
                const modal = screen.getByRole('dialog');
                expect(modal).toBeTruthy();
            });

            // Switch to Upload tab
            const uploadTab = screen.getByRole('button', { name: /upload file/i });
            fireEvent.click(uploadTab);

            await waitFor(() => {
                const fileInput = container.querySelector('input[type="file"]');
                expect(fileInput).toBeTruthy();
            });

            // Switch back to Library tab
            const libraryTab = screen.getByRole('button', { name: /media library/i });
            fireEvent.click(libraryTab);

            // Library tab should be active
            await waitFor(() => {
                expect(libraryTab.className).toContain('text-blue-600');
            });

            // Upload interface should not be visible
            const fileInput = container.querySelector('input[type="file"]');
            expect(fileInput).toBeNull();
        });

        it('should display correct content for each tab', async () => {
            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            const { container } = render(
                <MediaPicker
                    open={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for modal to render
            await waitFor(() => {
                const modal = screen.getByRole('dialog');
                expect(modal).toBeTruthy();
            });

            // Library tab should show gallery (or empty state)
            await waitFor(() => {
                const emptyMessage = screen.queryByText(/no images available/i);
                expect(emptyMessage).toBeTruthy();
            });

            // Switch to Upload tab
            const uploadTab = screen.getByRole('button', { name: /upload file/i });
            fireEvent.click(uploadTab);

            // Upload tab should show file input
            await waitFor(() => {
                const fileInput = container.querySelector('input[type="file"]');
                expect(fileInput).toBeTruthy();
            });
        });
    });

    describe('Selection state management', () => {
        it('should start with no images selected', async () => {
            const mockImages = [
                'https://example.com/image1.jpg',
                'https://example.com/image2.jpg',
            ];
            vi.mocked(mediaApi.listImages).mockResolvedValue(mockImages);

            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            render(
                <MediaPicker
                    open={true}
                    multiple={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for images to load
            await waitFor(() => {
                const modal = screen.getByRole('dialog');
                expect(modal).toBeTruthy();
            });

            // Select button should be disabled (no selection)
            const selectButton = screen.getByRole('button', { name: /select/i });
            expect(selectButton).toBeDisabled();
        });

        it('should enable Select button when images are selected', async () => {
            const mockImages = [
                'https://example.com/image1.jpg',
                'https://example.com/image2.jpg',
            ];
            vi.mocked(mediaApi.listImages).mockResolvedValue(mockImages);

            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            const { container } = render(
                <MediaPicker
                    open={true}
                    multiple={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for images to load
            await waitFor(() => {
                const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                expect(imageContainers.length).toBe(2);
            });

            // Select first image
            const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
            fireEvent.click(imageContainers[0]);

            // Select button should be enabled
            await waitFor(() => {
                const selectButton = screen.getByRole('button', { name: /select \(1\)/i });
                expect(selectButton).not.toBeDisabled();
            });
        });

        it('should show selection count in Select button', async () => {
            const mockImages = [
                'https://example.com/image1.jpg',
                'https://example.com/image2.jpg',
                'https://example.com/image3.jpg',
            ];
            vi.mocked(mediaApi.listImages).mockResolvedValue(mockImages);

            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            const { container } = render(
                <MediaPicker
                    open={true}
                    multiple={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for images to load
            await waitFor(() => {
                const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                expect(imageContainers.length).toBe(3);
            });

            const imageContainers = container.querySelectorAll('[class*="aspect-square"]');

            // Select first image
            fireEvent.click(imageContainers[0]);
            await waitFor(() => {
                const selectButton = screen.getByRole('button', { name: /select \(1\)/i });
                expect(selectButton).toBeTruthy();
            });

            // Select second image
            fireEvent.click(imageContainers[1]);
            await waitFor(() => {
                const selectButton = screen.getByRole('button', { name: /select \(2\)/i });
                expect(selectButton).toBeTruthy();
            });

            // Select third image
            fireEvent.click(imageContainers[2]);
            await waitFor(() => {
                const selectButton = screen.getByRole('button', { name: /select \(3\)/i });
                expect(selectButton).toBeTruthy();
            });
        });

        it('should reset selection state when modal closes', async () => {
            const mockImages = ['https://example.com/image1.jpg'];
            vi.mocked(mediaApi.listImages).mockResolvedValue(mockImages);

            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            const { container, rerender } = render(
                <MediaPicker
                    open={true}
                    multiple={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for images to load
            await waitFor(() => {
                const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
                expect(imageContainers.length).toBe(1);
            });

            // Select image
            const imageContainers = container.querySelectorAll('[class*="aspect-square"]');
            fireEvent.click(imageContainers[0]);

            await waitFor(() => {
                const selectButton = screen.getByRole('button', { name: /select \(1\)/i });
                expect(selectButton).toBeTruthy();
            });

            // Close modal (get the footer Close button)
            const closeButtons = screen.getAllByRole('button', { name: /close/i });
            const footerCloseButton = closeButtons.find(btn => btn.textContent === 'Close');
            expect(footerCloseButton).toBeTruthy();
            fireEvent.click(footerCloseButton!);

            // Reopen modal
            rerender(
                <MediaPicker
                    open={true}
                    multiple={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for modal to reopen
            await waitFor(() => {
                const modal = screen.getByRole('dialog');
                expect(modal).toBeTruthy();
            });

            // Selection should be reset (button disabled)
            const selectButton = screen.getByRole('button', { name: /select/i });
            expect(selectButton).toBeDisabled();
        });
    });

    describe('Image loading', () => {
        it('should fetch images when modal opens', async () => {
            const mockImages = ['https://example.com/image1.jpg'];
            vi.mocked(mediaApi.listImages).mockResolvedValue(mockImages);

            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            render(
                <MediaPicker
                    open={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for modal to render
            await waitFor(() => {
                const modal = screen.getByRole('dialog');
                expect(modal).toBeTruthy();
            });

            // Verify listImages was called
            expect(mediaApi.listImages).toHaveBeenCalledTimes(1);
        });

        it('should display loading state while fetching images', async () => {
            // Mock listImages with a delay
            vi.mocked(mediaApi.listImages).mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
                return [];
            });

            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            const { container } = render(
                <MediaPicker
                    open={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for modal to render
            await waitFor(() => {
                const modal = screen.getByRole('dialog');
                expect(modal).toBeTruthy();
            });

            // Should show loading skeletons
            const skeletons = container.querySelectorAll('.animate-pulse');
            expect(skeletons.length).toBeGreaterThan(0);
        });

        it('should display error message when image loading fails', async () => {
            vi.mocked(mediaApi.listImages).mockRejectedValue(new Error('Failed to load'));

            const mockOnSelect = vi.fn();
            const mockOnClose = vi.fn();

            render(
                <MediaPicker
                    open={true}
                    onSelect={mockOnSelect}
                    onClose={mockOnClose}
                />
            );

            // Wait for error to appear
            await waitFor(() => {
                const errorMessage = screen.queryByText(/failed to load/i);
                expect(errorMessage).toBeTruthy();
            }, { timeout: 1000 });
        });
    });
});
