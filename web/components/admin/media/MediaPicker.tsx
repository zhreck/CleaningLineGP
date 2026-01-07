'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import MediaUpload from './MediaUpload';
import MediaGallery from './MediaGallery';
import { listImages } from '@/lib/mediaApi';

/**
 * Props for MediaPicker component
 */
type MediaPickerProps = {
    open: boolean;
    multiple?: boolean;
    initialSelection?: string[];
    onSelect: (urls: string[]) => void;
    onClose: () => void;
};

/**
 * Tab type for the media picker
 */
type TabType = 'upload' | 'library';

/**
 * MediaPicker Component
 * Modal component for uploading and selecting images from media library
 */
export default function MediaPicker({
    open,
    multiple = false,
    initialSelection = [],
    onSelect,
    onClose,
}: MediaPickerProps) {
    const [activeTab, setActiveTab] = useState<TabType>('library');
    const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    /**
     * Load images from API
     */
    const loadImages = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const imageList = await listImages();
            setImages(imageList);
        } catch (err: any) {
            console.error('Error loading images:', err);
            setError(err.message || 'Failed to load images');
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Load images when modal opens
     */
    useEffect(() => {
        if (open) {
            loadImages();
            // Set initial selection when modal opens
            setSelectedUrls(initialSelection);
        }
    }, [open, loadImages, initialSelection]);

    /**
     * Handle image uploaded
     * Adds new image to list, auto-selects it, and immediately adds to form
     */
    const handleImageUploaded = useCallback((url: string) => {
        setImages((prev) => [url, ...prev]);
        // Auto-select newly uploaded image
        setSelectedUrls((prev) => {
            const updated = [...prev, url];
            // Schedule onSelect to run after render completes
            setTimeout(() => {
                onSelect(updated);
            }, 0);
            return updated;
        });
        setActiveTab('library');
    }, [onSelect]);

    /**
     * Handle toggle selection
     * Manages single vs multiple selection modes
     */
    const handleToggleSelect = useCallback((url: string) => {
        setSelectedUrls((prev) => {
            if (multiple) {
                // Multiple selection mode: toggle the URL
                if (prev.includes(url)) {
                    return prev.filter((u) => u !== url);
                } else {
                    return [...prev, url];
                }
            } else {
                // Single selection mode: replace with new selection or deselect
                if (prev.includes(url)) {
                    return [];
                } else {
                    return [url];
                }
            }
        });
    }, [multiple]);

    /**
     * Handle confirm selection
     * Calls onSelect with selected URLs and closes modal
     */
    const handleConfirmSelection = useCallback(() => {
        onSelect(selectedUrls);
        setSelectedUrls([]);
        onClose();
    }, [selectedUrls, onSelect, onClose]);

    /**
     * Handle close
     * Resets state and closes modal
     */
    const handleClose = useCallback(() => {
        setSelectedUrls([]);
        setActiveTab('library');
        onClose();
    }, [onClose]);

    /**
     * Handle refresh
     * Reloads the image list
     */
    const handleRefresh = useCallback(() => {
        loadImages();
    }, [loadImages]);

    /**
     * Handle escape key and focus management
     */
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                handleClose();
            }
        };

        if (open) {
            // Store the currently focused element
            previousFocusRef.current = document.activeElement as HTMLElement;

            document.addEventListener('keydown', handleEscape);
            // Prevent background scrolling
            document.body.style.overflow = 'hidden';

            // Focus the modal after a short delay to ensure it's rendered
            setTimeout(() => {
                modalRef.current?.focus();
            }, 100);
        } else {
            // Return focus to the previously focused element when closing
            if (previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [open, handleClose]);

    /**
     * Focus trap implementation
     */
    useEffect(() => {
        if (!open || !modalRef.current) return;

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            const focusableElements = modalRef.current?.querySelectorAll(
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );

            if (!focusableElements || focusableElements.length === 0) return;

            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener('keydown', handleTabKey);

        return () => {
            document.removeEventListener('keydown', handleTabKey);
        };
    }, [open]);

    // Don't render if not open
    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="media-picker-title"
        >
            {/* Modal Container */}
            <div
                ref={modalRef}
                tabIndex={-1}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] m-4 md:m-0 flex flex-col focus:outline-none"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2
                        id="media-picker-title"
                        className="text-xl font-semibold text-gray-900 dark:text-white"
                    >
                        Media Picker
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label="Close modal"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700" role="tablist">
                    <button
                        onClick={() => setActiveTab('upload')}
                        role="tab"
                        aria-selected={activeTab === 'upload'}
                        aria-controls="upload-panel"
                        aria-label="Upload File tab"
                        tabIndex={activeTab === 'upload' ? 0 : -1}
                        className={`flex-1 md:flex-none px-4 md:px-6 py-3 font-medium text-sm md:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${activeTab === 'upload'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        Upload File
                    </button>
                    <button
                        onClick={() => setActiveTab('library')}
                        role="tab"
                        aria-selected={activeTab === 'library'}
                        aria-controls="library-panel"
                        aria-label="Media Library tab"
                        tabIndex={activeTab === 'library' ? 0 : -1}
                        className={`flex-1 md:flex-none px-4 md:px-6 py-3 font-medium text-sm md:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${activeTab === 'library'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        Media Library
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    {activeTab === 'upload' ? (
                        <div
                            className="p-6"
                            role="tabpanel"
                            id="upload-panel"
                            aria-labelledby="upload-tab"
                        >
                            <MediaUpload onUploaded={handleImageUploaded} />
                        </div>
                    ) : (
                        <div
                            role="tabpanel"
                            id="library-panel"
                            aria-labelledby="library-tab"
                        >
                            <MediaGallery
                                images={images}
                                selected={selectedUrls}
                                onToggleSelect={handleToggleSelect}
                                onRefresh={handleRefresh}
                                isLoading={isLoading}
                            />
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* Footer with Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleClose}
                        aria-label="Close media picker"
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 order-2 sm:order-1"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleConfirmSelection}
                        disabled={selectedUrls.length === 0}
                        aria-label={`Select ${selectedUrls.length} image${selectedUrls.length !== 1 ? 's' : ''}`}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 order-1 sm:order-2 ${selectedUrls.length === 0
                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        Select {selectedUrls.length > 0 && `(${selectedUrls.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
}
