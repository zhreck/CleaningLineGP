/**
 * Unit Tests for MediaUpload Component
 * Tests file validation, upload button disabled state, and error display
 * Requirements: 1.2, 1.4, 1.5
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import MediaUpload from './MediaUpload';
import * as mediaApi from '@/lib/mediaApi';

// Mock the mediaApi module
vi.mock('@/lib/mediaApi', () => ({
    uploadImage: vi.fn(),
}));

describe('MediaUpload - Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    describe('File Validation - Requirements 1.5', () => {
        it('should reject files with invalid type', async () => {
            const mockOnUploaded = vi.fn();
            const { container } = render(<MediaUpload onUploaded={mockOnUploaded} />);

            // Create an invalid file (PDF)
            const invalidFile = new File(['content'], 'document.pdf', { type: 'application/pdf' });

            // Get file input
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
            expect(fileInput).toBeTruthy();

            // Simulate file selection
            Object.defineProperty(fileInput, 'files', {
                value: [invalidFile],
                writable: false,
            });
            fireEvent.change(fileInput);

            // Wait for error message
            await waitFor(() => {
                const errorMessage = screen.getByText(/invalid file type/i);
                expect(errorMessage).toBeTruthy();
            });

            // Verify no preview is shown
            const preview = container.querySelector('img[alt*="Preview"]');
            expect(preview).toBeFalsy();
        });

        it('should accept valid image types (JPEG, PNG, WebP, GIF)', async () => {
            const validTypes = [
                { type: 'image/jpeg', name: 'test.jpg' },
                { type: 'image/png', name: 'test.png' },
                { type: 'image/webp', name: 'test.webp' },
                { type: 'image/gif', name: 'test.gif' },
            ];

            for (const fileType of validTypes) {
                const mockOnUploaded = vi.fn();
                const { container, unmount } = render(<MediaUpload onUploaded={mockOnUploaded} />);

                // Create a valid file
                const validFile = new File(['content'], fileType.name, { type: fileType.type });

                // Get file input
                const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

                // Simulate file selection
                Object.defineProperty(fileInput, 'files', {
                    value: [validFile],
                    writable: false,
                });
                fireEvent.change(fileInput);

                // Wait for preview to appear
                await waitFor(() => {
                    const preview = container.querySelector(`img[alt*="Preview of ${fileType.name}"]`);
                    expect(preview).toBeTruthy();
                }, { timeout: 1000 });

                // Verify no error message
                const errorMessage = screen.queryByText(/invalid file type/i);
                expect(errorMessage).toBeFalsy();

                unmount();
            }
        });

        it('should reject files larger than 5MB', async () => {
            const mockOnUploaded = vi.fn();
            const { container } = render(<MediaUpload onUploaded={mockOnUploaded} />);

            // Create a file larger than 5MB
            const largeContent = new Array(6 * 1024 * 1024).fill('a').join('');
            const largeFile = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });

            // Override size property
            Object.defineProperty(largeFile, 'size', {
                value: 6 * 1024 * 1024,
                writable: false,
            });

            // Get file input
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

            // Simulate file selection
            Object.defineProperty(fileInput, 'files', {
                value: [largeFile],
                writable: false,
            });
            fireEvent.change(fileInput);

            // Wait for error message
            await waitFor(() => {
                const errorMessage = screen.getByText(/file size exceeds 5mb/i);
                expect(errorMessage).toBeTruthy();
            });

            // Verify no preview is shown
            const preview = container.querySelector('img[alt*="Preview"]');
            expect(preview).toBeFalsy();
        });

        it('should accept files smaller than 5MB', async () => {
            const mockOnUploaded = vi.fn();
            const { container } = render(<MediaUpload onUploaded={mockOnUploaded} />);

            // Create a file smaller than 5MB
            const smallFile = new File(['content'], 'small.jpg', { type: 'image/jpeg' });

            // Override size property
            Object.defineProperty(smallFile, 'size', {
                value: 1024 * 1024, // 1MB
                writable: false,
            });

            // Get file input
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

            // Simulate file selection
            Object.defineProperty(fileInput, 'files', {
                value: [smallFile],
                writable: false,
            });
            fireEvent.change(fileInput);

            // Wait for preview to appear
            await waitFor(() => {
                const preview = container.querySelector('img[alt*="Preview of small.jpg"]');
                expect(preview).toBeTruthy();
            }, { timeout: 1000 });

            // Verify no error message
            const errorMessage = screen.queryByText(/file size exceeds/i);
            expect(errorMessage).toBeFalsy();
        });
    });

    describe('Upload Button Disabled State - Requirements 1.2', () => {
        it('should disable upload button when no file is selected', () => {
            const mockOnUploaded = vi.fn();
            render(<MediaUpload onUploaded={mockOnUploaded} />);

            // Get upload button by text
            const uploadButton = screen.getByText(/upload image/i);

            // Verify button is disabled
            expect(uploadButton).toBeDisabled();
        });

        it('should enable upload button when valid file is selected', async () => {
            const mockOnUploaded = vi.fn();
            const { container } = render(<MediaUpload onUploaded={mockOnUploaded} />);

            // Create a valid file
            const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

            // Get file input
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

            // Simulate file selection
            Object.defineProperty(fileInput, 'files', {
                value: [validFile],
                writable: false,
            });
            fireEvent.change(fileInput);

            // Wait for preview and button to be enabled
            await waitFor(() => {
                const preview = container.querySelector('img[alt*="Preview of test.jpg"]');
                expect(preview).toBeTruthy();
            }, { timeout: 1000 });

            // Get upload button by text
            const uploadButton = screen.getByText(/upload image/i);

            // Verify button is enabled
            expect(uploadButton).not.toBeDisabled();
        });

        it('should disable upload button during upload', async () => {
            const mockOnUploaded = vi.fn();
            const { container } = render(<MediaUpload onUploaded={mockOnUploaded} />);

            // Mock uploadImage with longer delay to ensure we can check the loading state
            vi.mocked(mediaApi.uploadImage).mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 500));
                return { url: 'https://example.com/test.jpg' };
            });

            // Create a valid file
            const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

            // Get file input
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

            // Simulate file selection
            Object.defineProperty(fileInput, 'files', {
                value: [validFile],
                writable: false,
            });
            fireEvent.change(fileInput);

            // Wait for preview
            await waitFor(() => {
                const preview = container.querySelector('img[alt*="Preview of test.jpg"]');
                expect(preview).toBeTruthy();
            }, { timeout: 1000 });

            // Click upload button
            const uploadButton = screen.getByText(/upload image/i);
            fireEvent.click(uploadButton);

            // Verify button shows loading state and is disabled
            await waitFor(() => {
                // Check for the loading text (contains "Uploading")
                const buttons = container.querySelectorAll('button');
                const loadingButton = Array.from(buttons).find(btn =>
                    btn.textContent?.includes('Uploading')
                );
                expect(loadingButton).toBeTruthy();
                expect(loadingButton).toBeDisabled();
            }, { timeout: 200 });
        });

        it('should disable file input during upload', async () => {
            const mockOnUploaded = vi.fn();
            const { container } = render(<MediaUpload onUploaded={mockOnUploaded} />);

            // Mock uploadImage with delay
            vi.mocked(mediaApi.uploadImage).mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
                return { url: 'https://example.com/test.jpg' };
            });

            // Create a valid file
            const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

            // Get file input
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

            // Simulate file selection
            Object.defineProperty(fileInput, 'files', {
                value: [validFile],
                writable: false,
            });
            fireEvent.change(fileInput);

            // Wait for preview
            await waitFor(() => {
                const preview = container.querySelector('img[alt*="Preview of test.jpg"]');
                expect(preview).toBeTruthy();
            }, { timeout: 1000 });

            // Click upload button
            const uploadButton = screen.getByText(/upload image/i);
            fireEvent.click(uploadButton);

            // Verify file input is disabled during upload
            await waitFor(() => {
                expect(fileInput).toBeDisabled();
            });
        });
    });

    describe('Error Display - Requirements 1.4', () => {
        it('should display error message when upload fails', async () => {
            const mockOnUploaded = vi.fn();
            const { container } = render(<MediaUpload onUploaded={mockOnUploaded} />);

            // Mock uploadImage to fail
            vi.mocked(mediaApi.uploadImage).mockRejectedValue(
                new Error('Network error')
            );

            // Create a valid file
            const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

            // Get file input
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

            // Simulate file selection
            Object.defineProperty(fileInput, 'files', {
                value: [validFile],
                writable: false,
            });
            fireEvent.change(fileInput);

            // Wait for preview
            await waitFor(() => {
                const preview = container.querySelector('img[alt*="Preview of test.jpg"]');
                expect(preview).toBeTruthy();
            }, { timeout: 1000 });

            // Click upload button
            const uploadButton = screen.getByText(/upload image/i);
            fireEvent.click(uploadButton);

            // Wait for error message
            await waitFor(() => {
                const errorMessage = screen.getByText(/network error/i);
                expect(errorMessage).toBeTruthy();
            });

            // Verify onUploaded was not called
            expect(mockOnUploaded).not.toHaveBeenCalled();
        });

        it('should display generic error message when error has no message', async () => {
            const mockOnUploaded = vi.fn();
            const { container } = render(<MediaUpload onUploaded={mockOnUploaded} />);

            // Mock uploadImage to fail without message
            vi.mocked(mediaApi.uploadImage).mockRejectedValue({});

            // Create a valid file
            const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

            // Get file input
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

            // Simulate file selection
            Object.defineProperty(fileInput, 'files', {
                value: [validFile],
                writable: false,
            });
            fireEvent.change(fileInput);

            // Wait for preview
            await waitFor(() => {
                const preview = container.querySelector('img[alt*="Preview of test.jpg"]');
                expect(preview).toBeTruthy();
            }, { timeout: 1000 });

            // Click upload button
            const uploadButton = screen.getByText(/upload image/i);
            fireEvent.click(uploadButton);

            // Wait for generic error message
            await waitFor(() => {
                const errorMessage = screen.getByText(/failed to upload image/i);
                expect(errorMessage).toBeTruthy();
            });
        });

        it('should clear previous error when new file is selected', async () => {
            const mockOnUploaded = vi.fn();
            const { container, unmount } = render(<MediaUpload onUploaded={mockOnUploaded} />);

            // Create an invalid file first
            const invalidFile = new File(['content'], 'document.pdf', { type: 'application/pdf' });

            // Get file input
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

            // Simulate invalid file selection
            Object.defineProperty(fileInput, 'files', {
                value: [invalidFile],
                writable: false,
                configurable: true,
            });
            fireEvent.change(fileInput);

            // Wait for error message
            await waitFor(() => {
                const errorMessage = screen.getByText(/invalid file type/i);
                expect(errorMessage).toBeTruthy();
            });

            // Now select a valid file - need to redefine with configurable
            const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
            Object.defineProperty(fileInput, 'files', {
                value: [validFile],
                writable: false,
                configurable: true,
            });
            fireEvent.change(fileInput);

            // Wait for preview and verify error is cleared
            await waitFor(() => {
                const preview = container.querySelector('img[alt*="Preview of test.jpg"]');
                expect(preview).toBeTruthy();
            }, { timeout: 1000 });

            // Verify error message is gone
            const errorMessage = screen.queryByText(/invalid file type/i);
            expect(errorMessage).toBeFalsy();

            unmount();
        });

        it('should display validation error in styled error container', async () => {
            const mockOnUploaded = vi.fn();
            const { container } = render(<MediaUpload onUploaded={mockOnUploaded} />);

            // Create an invalid file
            const invalidFile = new File(['content'], 'document.pdf', { type: 'application/pdf' });

            // Get file input
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

            // Simulate file selection
            Object.defineProperty(fileInput, 'files', {
                value: [invalidFile],
                writable: false,
            });
            fireEvent.change(fileInput);

            // Wait for error message
            await waitFor(() => {
                const errorMessage = screen.getByText(/invalid file type/i);
                expect(errorMessage).toBeTruthy();

                // Verify error container has proper styling classes
                const errorContainer = errorMessage.closest('div');
                expect(errorContainer?.className).toMatch(/bg-red/);
                expect(errorContainer?.className).toMatch(/border-red/);
                expect(errorContainer?.className).toMatch(/text-red/);
            });
        });
    });

    describe('Upload Success Flow', () => {
        it('should call onUploaded callback with URL on successful upload', async () => {
            const mockOnUploaded = vi.fn();
            const { container } = render(<MediaUpload onUploaded={mockOnUploaded} />);

            const testUrl = 'https://example.com/uploaded-image.jpg';

            // Mock uploadImage to succeed
            vi.mocked(mediaApi.uploadImage).mockResolvedValue({ url: testUrl });

            // Create a valid file
            const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

            // Get file input
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

            // Simulate file selection
            Object.defineProperty(fileInput, 'files', {
                value: [validFile],
                writable: false,
            });
            fireEvent.change(fileInput);

            // Wait for preview
            await waitFor(() => {
                const preview = container.querySelector('img[alt*="Preview of test.jpg"]');
                expect(preview).toBeTruthy();
            }, { timeout: 1000 });

            // Click upload button
            const uploadButton = screen.getByText(/upload image/i);
            fireEvent.click(uploadButton);

            // Wait for callback to be called
            await waitFor(() => {
                expect(mockOnUploaded).toHaveBeenCalledWith(testUrl);
            });
        });

        it('should reset component state after successful upload', async () => {
            const mockOnUploaded = vi.fn();
            const { container } = render(<MediaUpload onUploaded={mockOnUploaded} />);

            // Mock uploadImage to succeed
            vi.mocked(mediaApi.uploadImage).mockResolvedValue({
                url: 'https://example.com/test.jpg',
            });

            // Create a valid file
            const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

            // Get file input
            const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

            // Simulate file selection
            Object.defineProperty(fileInput, 'files', {
                value: [validFile],
                writable: false,
            });
            fireEvent.change(fileInput);

            // Wait for preview
            await waitFor(() => {
                const preview = container.querySelector('img[alt*="Preview of test.jpg"]');
                expect(preview).toBeTruthy();
            }, { timeout: 1000 });

            // Click upload button
            const uploadButton = screen.getByText(/upload image/i);
            fireEvent.click(uploadButton);

            // Wait for upload to complete
            await waitFor(() => {
                expect(mockOnUploaded).toHaveBeenCalled();
            });

            // Verify preview is cleared
            await waitFor(() => {
                const preview = container.querySelector('img[alt*="Preview"]');
                expect(preview).toBeFalsy();
            });

            // Verify upload button is disabled (no file selected)
            await waitFor(() => {
                const finalUploadButton = screen.getByText(/upload image/i);
                expect(finalUploadButton).toBeDisabled();
            });
        });
    });
})