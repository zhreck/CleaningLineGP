/**
 * Media API Client
 * Handles image upload, list, and delete operations with MinIO storage
 */

import { getAccessToken } from './apiClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Response type for image upload
 */
export type UploadResponse = {
    url: string;
};

/**
 * Response type for image list
 */
export type ListResponse = string[];

/**
 * Response type for image deletion
 */
export type DeleteResponse = {
    success: boolean;
};

/**
 * Upload an image file to MinIO storage
 * POST /media/upload
 * 
 * @param file - The image file to upload
 * @returns Promise with the uploaded image URL
 * @throws Error if upload fails
 */
export async function uploadImage(file: File): Promise<{ url: string }> {
    try {
        // Create FormData with the file
        const formData = new FormData();
        formData.append('file', file);

        // Get access token for authentication
        const accessToken = getAccessToken();

        // Prepare headers (don't set Content-Type for FormData - browser will set it with boundary)
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        // Make POST request to upload endpoint
        const response = await fetch(`${API_BASE_URL}/media/upload`, {
            method: 'POST',
            headers,
            body: formData,
            credentials: 'include',
        });

        // Handle upload errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Upload failed with status ${response.status}`);
        }

        // Parse and return the response with URL
        const data: UploadResponse = await response.json();
        return { url: data.url };
    } catch (error: any) {
        console.error('Error uploading image:', error);
        throw new Error(error.message || 'Failed to upload image');
    }
}

/**
 * Upload multiple image files to MinIO storage
 * POST /media/upload-multiple
 * 
 * @param files - Array of image files to upload
 * @returns Promise with array of uploaded image URLs
 * @throws Error if upload fails
 */
export async function uploadImages(files: File[]): Promise<{ urls: string[] }> {
    try {
        // Create FormData with all files
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        // Get access token for authentication
        const accessToken = getAccessToken();

        // Prepare headers (don't set Content-Type for FormData - browser will set it with boundary)
        const headers: Record<string, string> = {};
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        // Make POST request to upload-multiple endpoint
        const response = await fetch(`${API_BASE_URL}/media/upload-multiple`, {
            method: 'POST',
            headers,
            body: formData,
            credentials: 'include',
        });

        // Handle upload errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Upload failed with status ${response.status}`);
        }

        // Parse and return the response with URLs
        const data: { urls: string[] } = await response.json();
        return { urls: data.urls };
    } catch (error: any) {
        console.error('Error uploading images:', error);
        throw new Error(error.message || 'Failed to upload images');
    }
}
/**
 * Get list of all uploaded images
 * GET /media/list
 * 
 * @returns Promise with array of image URLs
 * @throws Error if fetching fails
 */
export async function listImages(): Promise<string[]> {
    try {
        // Get access token for authentication
        const accessToken = getAccessToken();

        // Prepare headers
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        // Make GET request to list endpoint
        const response = await fetch(`${API_BASE_URL}/media/list`, {
            method: 'GET',
            headers,
            credentials: 'include',
        });

        // Handle network errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to fetch images with status ${response.status}`);
        }

        // Parse and return array of URLs
        const data: ListResponse = await response.json();
        return data;
    } catch (error: any) {
        console.error('Error fetching image list:', error);
        throw new Error(error.message || 'Failed to fetch image list');
    }
}

/**
 * Extract filename from full URL
 * Helper function for delete operation
 * 
 * @param url - Full URL of the image
 * @returns Filename extracted from URL
 */
function extractFilename(url: string): string {
    try {
        // Extract filename from URL (last segment after /)
        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1];

        // Remove query parameters if present
        return filename.split('?')[0];
    } catch (error) {
        console.error('Error extracting filename from URL:', error);
        throw new Error('Invalid URL format');
    }
}

/**
 * Delete an image from storage
 * DELETE /media?file=<filename>
 * 
 * @param url - Full URL of the image to delete
 * @returns Promise with success boolean
 * @throws Error if deletion fails
 */
export async function deleteImage(url: string): Promise<boolean> {
    try {
        // Extract filename from URL
        const filename = extractFilename(url);

        // Get access token for authentication
        const accessToken = getAccessToken();

        // Prepare headers
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        // Make DELETE request to delete endpoint
        const response = await fetch(`${API_BASE_URL}/media?file=${encodeURIComponent(filename)}`, {
            method: 'DELETE',
            headers,
            credentials: 'include',
        });

        // Handle delete errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to delete image with status ${response.status}`);
        }

        // Parse and return success status
        const data: DeleteResponse = await response.json();
        return data.success;
    } catch (error: any) {
        console.error('Error deleting image:', error);
        throw new Error(error.message || 'Failed to delete image');
    }
}
