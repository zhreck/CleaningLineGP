/**
 * Unit tests for Media API Client
 * Tests FormData construction, error handling, and URL parsing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { uploadImage, listImages, deleteImage } from './mediaApi';
import * as apiClient from './apiClient';

// Mock the apiClient module
vi.mock('./apiClient', () => ({
    getAccessToken: vi.fn(),
}));

// Mock global fetch
global.fetch = vi.fn();

describe('mediaApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('uploadImage', () => {
        it('should create FormData with file and upload successfully', async () => {
            // Arrange
            const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
            const mockUrl = 'http://localhost:9000/products/test-image.jpg';
            const mockToken = 'test-token';

            vi.mocked(apiClient.getAccessToken).mockReturnValue(mockToken);
            vi.mocked(global.fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ url: mockUrl }),
            } as Response);

            // Act
            const result = await uploadImage(mockFile);

            // Assert
            expect(result).toEqual({ url: mockUrl });
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3001/media/upload',
                expect.objectContaining({
                    method: 'POST',
                    credentials: 'include',
                    headers: expect.objectContaining({
                        Authorization: `Bearer ${mockToken}`,
                    }),
                    body: expect.any(FormData),
                })
            );

            // Verify FormData contains the file
            const callArgs = vi.mocked(global.fetch).mock.calls[0];
            const formData = callArgs[1]?.body as FormData;
            expect(formData.get('file')).toBe(mockFile);
        });

        it('should handle upload errors', async () => {
            // Arrange
            const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
            const errorMessage = 'File too large';

            vi.mocked(apiClient.getAccessToken).mockReturnValue('test-token');
            vi.mocked(global.fetch).mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({ message: errorMessage }),
            } as Response);

            // Act & Assert
            await expect(uploadImage(mockFile)).rejects.toThrow(errorMessage);
        });

        it('should work without access token', async () => {
            // Arrange
            const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
            const mockUrl = 'http://localhost:9000/products/test-image.jpg';

            vi.mocked(apiClient.getAccessToken).mockReturnValue(null);
            vi.mocked(global.fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ url: mockUrl }),
            } as Response);

            // Act
            const result = await uploadImage(mockFile);

            // Assert
            expect(result).toEqual({ url: mockUrl });
            const callArgs = vi.mocked(global.fetch).mock.calls[0];
            expect(callArgs[1]?.headers).not.toHaveProperty('Authorization');
        });
    });

    describe('listImages', () => {
        it('should fetch and return array of URLs', async () => {
            // Arrange
            const mockUrls = [
                'http://localhost:9000/products/image1.jpg',
                'http://localhost:9000/products/image2.jpg',
                'http://localhost:9000/products/image3.jpg',
            ];
            const mockToken = 'test-token';

            vi.mocked(apiClient.getAccessToken).mockReturnValue(mockToken);
            vi.mocked(global.fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => mockUrls,
            } as Response);

            // Act
            const result = await listImages();

            // Assert
            expect(result).toEqual(mockUrls);
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3001/media/list',
                expect.objectContaining({
                    method: 'GET',
                    credentials: 'include',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${mockToken}`,
                    }),
                })
            );
        });

        it('should handle network errors', async () => {
            // Arrange
            const errorMessage = 'Network error';

            vi.mocked(apiClient.getAccessToken).mockReturnValue('test-token');
            vi.mocked(global.fetch).mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: async () => ({ message: errorMessage }),
            } as Response);

            // Act & Assert
            await expect(listImages()).rejects.toThrow(errorMessage);
        });

        it('should return empty array when no images exist', async () => {
            // Arrange
            vi.mocked(apiClient.getAccessToken).mockReturnValue('test-token');
            vi.mocked(global.fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            } as Response);

            // Act
            const result = await listImages();

            // Assert
            expect(result).toEqual([]);
        });
    });

    describe('deleteImage', () => {
        it('should extract filename from URL and delete successfully', async () => {
            // Arrange
            const mockUrl = 'http://localhost:9000/products/test-image-123.jpg';
            const mockToken = 'test-token';

            vi.mocked(apiClient.getAccessToken).mockReturnValue(mockToken);
            vi.mocked(global.fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true }),
            } as Response);

            // Act
            const result = await deleteImage(mockUrl);

            // Assert
            expect(result).toBe(true);
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3001/media?file=test-image-123.jpg',
                expect.objectContaining({
                    method: 'DELETE',
                    credentials: 'include',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${mockToken}`,
                    }),
                })
            );
        });

        it('should handle URL with query parameters', async () => {
            // Arrange
            const mockUrl = 'http://localhost:9000/products/test-image.jpg?v=123';
            const mockToken = 'test-token';

            vi.mocked(apiClient.getAccessToken).mockReturnValue(mockToken);
            vi.mocked(global.fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true }),
            } as Response);

            // Act
            await deleteImage(mockUrl);

            // Assert
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3001/media?file=test-image.jpg',
                expect.any(Object)
            );
        });

        it('should handle delete errors', async () => {
            // Arrange
            const mockUrl = 'http://localhost:9000/products/test-image.jpg';
            const errorMessage = 'File not found';

            vi.mocked(apiClient.getAccessToken).mockReturnValue('test-token');
            vi.mocked(global.fetch).mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: async () => ({ message: errorMessage }),
            } as Response);

            // Act & Assert
            await expect(deleteImage(mockUrl)).rejects.toThrow(errorMessage);
        });

        it('should encode filename with special characters', async () => {
            // Arrange
            const mockUrl = 'http://localhost:9000/products/test image with spaces.jpg';
            const mockToken = 'test-token';

            vi.mocked(apiClient.getAccessToken).mockReturnValue(mockToken);
            vi.mocked(global.fetch).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true }),
            } as Response);

            // Act
            await deleteImage(mockUrl);

            // Assert
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:3001/media?file=test%20image%20with%20spaces.jpg',
                expect.any(Object)
            );
        });
    });
});
