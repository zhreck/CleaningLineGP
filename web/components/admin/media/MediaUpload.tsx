'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { uploadImages } from '@/lib/mediaApi';

/**
 * Props for MediaUpload component
 */
type MediaUploadProps = {
    onUploaded: (url: string) => void;
};

/**
 * Upload state type
 */
type UploadState = 'idle' | 'uploading' | 'error';

/**
 * MediaUpload Component
 * Handles multiple file selection, validation, and upload to MinIO storage
 */
export default function MediaUpload({ onUploaded }: MediaUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * Handle file selection (multiple files)
     */
    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        if (files.length === 0) {
            return;
        }

        // Reset error state
        setError(null);

        // Validate file types and sizes
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        const validFiles: File[] = [];
        const errors: string[] = [];

        for (const file of files) {
            if (!validTypes.includes(file.type)) {
                errors.push(`${file.name}: Invalid file type`);
                continue;
            }

            if (file.size > maxSize) {
                errors.push(`${file.name}: Exceeds 5MB limit`);
                continue;
            }

            validFiles.push(file);
        }

        if (errors.length > 0) {
            setError(errors.join(', '));
        }

        if (validFiles.length === 0) {
            setSelectedFiles([]);
            setPreviews([]);
            return;
        }

        // Set selected files
        setSelectedFiles(validFiles);

        // Generate previews for all valid files
        const previewPromises = validFiles.map((file) => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(previewPromises).then((previewUrls) => {
            setPreviews(previewUrls);
        });
    };

    /**
     * Handle upload button click
     */
    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            return;
        }

        try {
            setUploadState('uploading');
            setError(null);

            // Call uploadImages API
            const response = await uploadImages(selectedFiles);

            // Reset state
            setUploadState('idle');
            setSelectedFiles([]);
            setPreviews([]);

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Call onUploaded callback for each URL
            response.urls.forEach((url) => {
                onUploaded(url);
            });
        } catch (err: any) {
            setUploadState('error');
            setError(err.message || 'Failed to upload images. Please try again.');
        }
    };

    /**
     * Handle clear selection
     */
    const handleClear = () => {
        setSelectedFiles([]);
        setPreviews([]);
        setError(null);
        setUploadState('idle');

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    /**
     * Handle remove single file
     */
    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const isUploading = uploadState === 'uploading';

    return (
        <div className="space-y-4">
            {/* File Input */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="hidden"
                    id="file-upload"
                    aria-label="Select image files to upload"
                />
                <label
                    htmlFor="file-upload"
                    className={`cursor-pointer inline-flex flex-col items-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <svg
                        className="w-12 h-12 text-gray-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Click to select images (multiple)
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        JPEG, PNG, WebP, or GIF (max 5MB each, up to 10 files)
                    </span>
                </label>
            </div>

            {/* Previews Grid */}
            {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={preview}
                                alt={`Preview of ${selectedFiles[index]?.name || 'selected image'}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                            />
                            {!isUploading && (
                                <button
                                    onClick={() => handleRemoveFile(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label={`Remove ${selectedFiles[index]?.name}`}
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                                {selectedFiles[index]?.name}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* File Count */}
            {selectedFiles.length > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
                {selectedFiles.length > 0 && !isUploading && (
                    <button
                        onClick={handleClear}
                        className="flex-1 py-2 px-4 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Clear All
                    </button>
                )}
                <button
                    onClick={handleUpload}
                    disabled={selectedFiles.length === 0 || isUploading}
                    aria-label={isUploading ? 'Uploading images' : 'Upload selected images'}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedFiles.length === 0 || isUploading
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                >
                    {isUploading ? (
                        <span className="flex items-center justify-center">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Uploading {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}...
                        </span>
                    ) : (
                        `Upload ${selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Image${selectedFiles.length !== 1 ? 's' : ''}`
                    )}
                </button>
            </div>
        </div>
    );
}
