/**
 * Property-Based Tests for MediaItem Keyboard Navigation
 * **Feature: media-picker, Property 28: Keyboard navigation support**
 * **Validates: Requirements 8.2**
 * 
 * Property 28: Keyboard navigation support
 * For any keyboard navigation action (Tab, Enter), the media picker should allow 
 * full functionality without requiring a mouse.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import MediaItem from './MediaItem';

describe('MediaItem - Keyboard Navigation Property Tests', () => {
    describe('Property 28: Keyboard navigation support', () => {
        it('should respond to Enter key for any image URL', () => {
            fc.assert(
                fc.property(
                    // Generate random image URLs
                    fc.webUrl({ withFragments: false, withQueryParameters: false }),
                    fc.boolean(), // selected state
                    (url, selected) => {
                        const mockOnClick = vi.fn();

                        const { container } = render(
                            <MediaItem
                                url={url}
                                selected={selected}
                                onClick={mockOnClick}
                            />
                        );

                        // Find the clickable element
                        const mediaItem = container.querySelector('[role="button"]');
                        expect(mediaItem).toBeTruthy();

                        if (mediaItem) {
                            // Simulate Enter key press
                            fireEvent.keyDown(mediaItem, { key: 'Enter', code: 'Enter' });

                            // Verify onClick was called
                            expect(mockOnClick).toHaveBeenCalledTimes(1);
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should respond to Space key for any image URL', () => {
            fc.assert(
                fc.property(
                    // Generate random image URLs
                    fc.webUrl({ withFragments: false, withQueryParameters: false }),
                    fc.boolean(), // selected state
                    (url, selected) => {
                        const mockOnClick = vi.fn();

                        const { container } = render(
                            <MediaItem
                                url={url}
                                selected={selected}
                                onClick={mockOnClick}
                            />
                        );

                        // Find the clickable element
                        const mediaItem = container.querySelector('[role="button"]');
                        expect(mediaItem).toBeTruthy();

                        if (mediaItem) {
                            // Simulate Space key press
                            fireEvent.keyDown(mediaItem, { key: ' ', code: 'Space' });

                            // Verify onClick was called
                            expect(mockOnClick).toHaveBeenCalledTimes(1);
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should be keyboard focusable with tabIndex for any image', () => {
            fc.assert(
                fc.property(
                    // Generate random image URLs
                    fc.webUrl({ withFragments: false, withQueryParameters: false }),
                    fc.boolean(), // selected state
                    (url, selected) => {
                        const mockOnClick = vi.fn();

                        const { container } = render(
                            <MediaItem
                                url={url}
                                selected={selected}
                                onClick={mockOnClick}
                            />
                        );

                        // Find the clickable element
                        const mediaItem = container.querySelector('[role="button"]');
                        expect(mediaItem).toBeTruthy();

                        if (mediaItem) {
                            // Check that element has tabIndex attribute
                            const tabIndex = mediaItem.getAttribute('tabindex');
                            expect(tabIndex).toBe('0');
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should have proper ARIA attributes for keyboard users', () => {
            fc.assert(
                fc.property(
                    // Generate random image URLs
                    fc.webUrl({ withFragments: false, withQueryParameters: false }),
                    fc.boolean(), // selected state
                    (url, selected) => {
                        const mockOnClick = vi.fn();

                        const { container } = render(
                            <MediaItem
                                url={url}
                                selected={selected}
                                onClick={mockOnClick}
                            />
                        );

                        // Find the clickable element
                        const mediaItem = container.querySelector('[role="button"]');
                        expect(mediaItem).toBeTruthy();

                        if (mediaItem) {
                            // Check ARIA attributes
                            expect(mediaItem.getAttribute('role')).toBe('button');
                            expect(mediaItem.getAttribute('aria-pressed')).toBe(String(selected));
                            expect(mediaItem.getAttribute('aria-label')).toBeTruthy();
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should not respond to other keys', () => {
            fc.assert(
                fc.property(
                    // Generate random image URLs
                    fc.webUrl({ withFragments: false, withQueryParameters: false }),
                    fc.boolean(), // selected state
                    fc.constantFrom('a', 'b', 'Escape', 'Tab', 'ArrowUp', 'ArrowDown'), // other keys
                    (url, selected, key) => {
                        const mockOnClick = vi.fn();

                        const { container } = render(
                            <MediaItem
                                url={url}
                                selected={selected}
                                onClick={mockOnClick}
                            />
                        );

                        // Find the clickable element
                        const mediaItem = container.querySelector('[role="button"]');
                        expect(mediaItem).toBeTruthy();

                        if (mediaItem) {
                            // Simulate other key press
                            fireEvent.keyDown(mediaItem, { key, code: key });

                            // Verify onClick was NOT called
                            expect(mockOnClick).not.toHaveBeenCalled();
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should work with both mouse and keyboard for any image', () => {
            fc.assert(
                fc.property(
                    // Generate random image URLs
                    fc.webUrl({ withFragments: false, withQueryParameters: false }),
                    fc.boolean(), // selected state
                    (url, selected) => {
                        const mockOnClick = vi.fn();

                        const { container } = render(
                            <MediaItem
                                url={url}
                                selected={selected}
                                onClick={mockOnClick}
                            />
                        );

                        // Find the clickable element
                        const mediaItem = container.querySelector('[role="button"]');
                        expect(mediaItem).toBeTruthy();

                        if (mediaItem) {
                            // Test mouse click
                            fireEvent.click(mediaItem);
                            expect(mockOnClick).toHaveBeenCalledTimes(1);

                            // Reset mock
                            mockOnClick.mockClear();

                            // Test keyboard Enter
                            fireEvent.keyDown(mediaItem, { key: 'Enter', code: 'Enter' });
                            expect(mockOnClick).toHaveBeenCalledTimes(1);
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});
