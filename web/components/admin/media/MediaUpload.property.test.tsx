/**
 * Property-Based Tests for MediaUpload Component
 * **Feature: media-picker, Property 2: Upload button state during upload**
 * **Validates: Requirements 1.2**
 * 
 * Property 2: Upload button state during upload
 * For any upload operation in progress, the upload button should be disabled 
 * and a loading indicator should be visible.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import MediaUpload from './MediaUpload';
import * as mediaApi from '@/lib/mediaApi';

// Mock the mediaApi module
vi.mock('@/lib/mediaApi', () => ({
    uploadImage: vi.fn(),
}));

describe('MediaUpload - Property-Based Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    describe('Property 2: Upload button state during upload', () => {
        it('should disable upload button and show loading indicator during upload', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate random file type
                    fc.constantFrom('image/jpeg', 'image/png', 'image/webp', 'image/gif'),
                    async (fileType) => {
                        // Create a mock file
                        const mockFile = new File(
                            ['mock content'],
                            'test.jpg',
                            { type: fileType }
                        );

                        // Mock uploadImage to resolve after a short delay
                        vi.mocked(mediaApi.uploadImage).mockImplementation(async () => {
                            await new Promise(resolve => setTimeout(resolve, 50));
                            return { url: 'https://example.com/uploaded-image.jpg' };
                        });

                        const mockOnUploaded = vi.fn();

                        // Render component
                        const { container, unmount } = render(<MediaUpload onUploaded={mockOnUploaded} />);

                        try {
                            // Find file input and simulate file selection
                            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
                            expect(fileInput).toBeTruthy();

                            // Create a mock FileList
                            Object.defineProperty(fileInput, 'files', {
                                value: [mockFile],
                                writable: false,
                            });

                            // Trigger change event
                            fireEvent.change(fileInput);

                            // Wait for preview to be generated and button to be enabled
                            await waitFor(() => {
                                const preview = container.querySelector('img[alt*="Preview of test.jpg"]');
                                expect(preview).toBeTruthy();
                            }, { timeout: 500 });

                            // Get upload button by text
                            const uploadButton = screen.getByText(/upload image/i);
                            expect(uploadButton).toBeTruthy();

                            // Click upload button
                            fireEvent.click(uploadButton!);

                            // Check that button is disabled and shows loading state with spinner
                            await waitFor(() => {
                                const buttons = container.querySelectorAll('button');
                                const loadingButton = Array.from(buttons).find(btn =>
                                    btn.textContent?.includes('Uploading')
                                );
                                expect(loadingButton).toBeTruthy();
                                expect(loadingButton).toBeDisabled();

                                // Verify loading indicator is visible (spinner SVG)
                                const spinner = container.querySelector('.animate-spin');
                                expect(spinner).toBeTruthy();
                            }, { timeout: 300 });

                            // Wait for upload to complete
                            await waitFor(() => {
                                expect(mockOnUploaded).toHaveBeenCalled();
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

        it('should keep button disabled throughout entire upload process', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate random valid file type
                    fc.constantFrom('image/jpeg', 'image/png', 'image/webp', 'image/gif'),
                    async (fileType) => {
                        // Create a mock file
                        const mockFile = new File(['mock content'], 'test.jpg', { type: fileType });

                        // Track button state changes
                        const buttonStates: boolean[] = [];

                        // Mock uploadImage with delay
                        vi.mocked(mediaApi.uploadImage).mockImplementation(async () => {
                            // Simulate upload delay
                            await new Promise(resolve => setTimeout(resolve, 100));
                            return { url: 'https://example.com/test.jpg' };
                        });

                        const mockOnUploaded = vi.fn();

                        // Render component
                        const { container, unmount } = render(<MediaUpload onUploaded={mockOnUploaded} />);

                        try {
                            // Select file
                            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
                            Object.defineProperty(fileInput, 'files', {
                                value: [mockFile],
                                writable: false,
                            });
                            fireEvent.change(fileInput);

                            // Wait for preview
                            await waitFor(() => {
                                const preview = container.querySelector('img[alt*="Preview of test.jpg"]');
                                expect(preview).toBeTruthy();
                            }, { timeout: 500 });

                            // Click upload
                            const uploadButton = screen.getByText(/upload image/i);
                            fireEvent.click(uploadButton!);

                            // Sample button state multiple times during upload
                            for (let i = 0; i < 3; i++) {
                                await new Promise(resolve => setTimeout(resolve, 30));
                                const button = container.querySelector('button[disabled]');
                                buttonStates.push(button !== null);
                            }

                            // Wait for completion
                            await waitFor(() => {
                                expect(mockOnUploaded).toHaveBeenCalled();
                            }, { timeout: 500 });

                            // Verify button was disabled during all samples
                            expect(buttonStates.every(state => state === true)).toBe(true);
                        } finally {
                            unmount();
                        }

                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        }, 30000);

        it('should re-enable button after upload completes or fails', async () => {
            await fc.assert(
                fc.asyncProperty(
                    // Generate random outcome (success or failure)
                    fc.boolean(),
                    async (shouldSucceed) => {
                        const mockFile = new File(['mock content'], 'test.jpg', { type: 'image/jpeg' });

                        // Mock uploadImage to succeed or fail
                        if (shouldSucceed) {
                            vi.mocked(mediaApi.uploadImage).mockResolvedValue({
                                url: 'https://example.com/test.jpg',
                            });
                        } else {
                            vi.mocked(mediaApi.uploadImage).mockRejectedValue(
                                new Error('Upload failed')
                            );
                        }

                        const mockOnUploaded = vi.fn();

                        // Render component
                        const { container, unmount } = render(<MediaUpload onUploaded={mockOnUploaded} />);

                        try {
                            // Select file
                            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
                            Object.defineProperty(fileInput, 'files', {
                                value: [mockFile],
                                writable: false,
                            });
                            fireEvent.change(fileInput);

                            // Wait for preview
                            await waitFor(() => {
                                const preview = container.querySelector('img[alt*="Preview of test.jpg"]');
                                expect(preview).toBeTruthy();
                            }, { timeout: 500 });

                            // Click upload
                            const uploadButton = screen.getByText(/upload image/i);
                            fireEvent.click(uploadButton!);

                            // Wait for upload to complete or fail
                            if (shouldSucceed) {
                                await waitFor(() => {
                                    expect(mockOnUploaded).toHaveBeenCalled();
                                }, { timeout: 500 });

                                // On success, file is cleared, so button should be disabled (no file selected)
                                await waitFor(() => {
                                    const finalButton = screen.getByText(/upload image/i);
                                    expect(finalButton).toBeDisabled();
                                }, { timeout: 300 });
                            } else {
                                // Wait for error message to appear
                                await waitFor(() => {
                                    const errorMessage = screen.queryByText(/upload failed/i);
                                    expect(errorMessage).toBeTruthy();
                                }, { timeout: 500 });

                                // On failure, file remains selected, so button should be enabled
                                const finalButton = screen.getByText(/upload image/i);
                                expect(finalButton).not.toBeDisabled();
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
});
