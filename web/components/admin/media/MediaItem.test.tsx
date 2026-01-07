/**
 * Unit tests for MediaItem Component
 * Tests click handler invocation, visual indicator display, and error placeholder
 * Requirements: 3.1, 3.2, 2.5
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MediaItem from './MediaItem';

describe('MediaItem', () => {
    const mockUrl = 'http://localhost:9000/products/test-image.jpg';
    const mockOnClick = vi.fn();
    const mockOnDelete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Click handler invocation', () => {
        it('should call onClick when the component is clicked', () => {
            // Arrange
            render(
                <MediaItem
                    url={mockUrl}
                    selected={false}
                    onClick={mockOnClick}
                />
            );

            // Act
            const mediaItem = screen.getByRole('img').parentElement;
            if (mediaItem) {
                fireEvent.click(mediaItem);
            }

            // Assert
            expect(mockOnClick).toHaveBeenCalledTimes(1);
        });

        it('should call onClick when selected state is true', () => {
            // Arrange
            render(
                <MediaItem
                    url={mockUrl}
                    selected={true}
                    onClick={mockOnClick}
                />
            );

            // Act
            const mediaItem = screen.getByRole('img').parentElement;
            if (mediaItem) {
                fireEvent.click(mediaItem);
            }

            // Assert
            expect(mockOnClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('Visual indicator display', () => {
        it('should display checkmark icon when selected is true', () => {
            // Arrange & Act
            const { container } = render(
                <MediaItem
                    url={mockUrl}
                    selected={true}
                    onClick={mockOnClick}
                />
            );

            // Assert - Check for checkmark SVG path
            const checkmark = container.querySelector('path[d*="M5 13l4 4L19 7"]');
            expect(checkmark).toBeTruthy();
        });

        it('should not display checkmark icon when selected is false', () => {
            // Arrange & Act
            const { container } = render(
                <MediaItem
                    url={mockUrl}
                    selected={false}
                    onClick={mockOnClick}
                />
            );

            // Assert - Check for absence of checkmark SVG path
            const checkmark = container.querySelector('path[d*="M5 13l4 4L19 7"]');
            expect(checkmark).toBeFalsy();
        });

        it('should apply blue ring styling when selected', () => {
            // Arrange & Act
            const { container } = render(
                <MediaItem
                    url={mockUrl}
                    selected={true}
                    onClick={mockOnClick}
                />
            );

            // Assert - Check for ring-blue-500 class
            const mediaItemDiv = container.firstChild as HTMLElement;
            expect(mediaItemDiv.className).toContain('ring-blue-500');
        });

        it('should apply default ring styling when not selected', () => {
            // Arrange & Act
            const { container } = render(
                <MediaItem
                    url={mockUrl}
                    selected={false}
                    onClick={mockOnClick}
                />
            );

            // Assert - Check for ring-slate-200 class
            const mediaItemDiv = container.firstChild as HTMLElement;
            expect(mediaItemDiv.className).toContain('ring-slate-200');
        });
    });

    describe('Error placeholder', () => {
        it('should display error placeholder when image fails to load', () => {
            // Arrange
            render(
                <MediaItem
                    url={mockUrl}
                    selected={false}
                    onClick={mockOnClick}
                />
            );

            // Act - Trigger image error
            const img = screen.getByRole('img');
            fireEvent.error(img);

            // Assert - Check for error text
            expect(screen.getByText('Failed to load')).toBeTruthy();
        });

        it('should display placeholder icon when image fails to load', () => {
            // Arrange
            const { container } = render(
                <MediaItem
                    url={mockUrl}
                    selected={false}
                    onClick={mockOnClick}
                />
            );

            // Act - Trigger image error
            const img = screen.getByRole('img');
            fireEvent.error(img);

            // Assert - Check for placeholder SVG
            const placeholderIcon = container.querySelector('svg');
            expect(placeholderIcon).toBeTruthy();
        });

        it('should not display image when error occurs', () => {
            // Arrange
            render(
                <MediaItem
                    url={mockUrl}
                    selected={false}
                    onClick={mockOnClick}
                />
            );

            // Act - Trigger image error
            const img = screen.getByRole('img');
            fireEvent.error(img);

            // Assert - Image should not be visible (replaced by placeholder)
            expect(screen.queryByRole('img')).toBeFalsy();
        });
    });

    describe('Delete button', () => {
        it('should display delete button when onDelete prop is provided', () => {
            // Arrange & Act
            const { container } = render(
                <MediaItem
                    url={mockUrl}
                    selected={false}
                    onClick={mockOnClick}
                    onDelete={mockOnDelete}
                />
            );

            // Assert
            const deleteButton = screen.getByLabelText('Delete image');
            expect(deleteButton).toBeTruthy();
        });

        it('should not display delete button when onDelete prop is not provided', () => {
            // Arrange & Act
            render(
                <MediaItem
                    url={mockUrl}
                    selected={false}
                    onClick={mockOnClick}
                />
            );

            // Assert
            const deleteButton = screen.queryByLabelText('Delete image');
            expect(deleteButton).toBeFalsy();
        });

        it('should call onDelete with url when delete button is clicked', () => {
            // Arrange
            render(
                <MediaItem
                    url={mockUrl}
                    selected={false}
                    onClick={mockOnClick}
                    onDelete={mockOnDelete}
                />
            );

            // Act
            const deleteButton = screen.getByLabelText('Delete image');
            fireEvent.click(deleteButton);

            // Assert
            expect(mockOnDelete).toHaveBeenCalledWith(mockUrl);
            expect(mockOnDelete).toHaveBeenCalledTimes(1);
        });

        it('should not trigger onClick when delete button is clicked', () => {
            // Arrange
            render(
                <MediaItem
                    url={mockUrl}
                    selected={false}
                    onClick={mockOnClick}
                    onDelete={mockOnDelete}
                />
            );

            // Act
            const deleteButton = screen.getByLabelText('Delete image');
            fireEvent.click(deleteButton);

            // Assert
            expect(mockOnClick).not.toHaveBeenCalled();
        });
    });
});
