"use client";

import MediaItem from "./MediaItem";

type MediaGalleryProps = {
    images: string[];
    selected: string[];
    onToggleSelect: (url: string) => void;
    onRefresh?: () => void;
    isLoading?: boolean;
};

export default function MediaGallery({
    images,
    selected,
    onToggleSelect,
    onRefresh,
    isLoading = false,
}: MediaGalleryProps) {
    // Loading state with skeleton placeholders
    if (isLoading) {
        return (
            <div className="w-full h-full overflow-auto p-2 sm:p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div
                            key={index}
                            className="aspect-square rounded-lg bg-slate-200 animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Empty state
    if (images.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                <svg
                    className="w-16 h-16 text-slate-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                <h3 className="text-lg font-medium text-slate-700 mb-2">
                    No images available
                </h3>
                <p className="text-sm text-slate-500">
                    Upload your first image to get started
                </p>
            </div>
        );
    }

    // Gallery grid with images
    return (
        <div className="w-full h-full overflow-auto p-2 sm:p-4">
            <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4"
                role="grid"
                aria-label="Media library images"
            >
                {images.map((url) => (
                    <MediaItem
                        key={url}
                        url={url}
                        selected={selected.includes(url)}
                        onClick={() => onToggleSelect(url)}
                    />
                ))}
            </div>
        </div>
    );
}
