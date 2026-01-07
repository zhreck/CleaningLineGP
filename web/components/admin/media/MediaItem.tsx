"use client";

import { useState } from "react";

type MediaItemProps = {
    url: string;
    selected: boolean;
    onClick: () => void;
    onDelete?: (url: string) => void;
};

export default function MediaItem({
    url,
    selected,
    onClick,
    onDelete,
}: MediaItemProps) {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    /**
     * Handle keyboard interaction
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div
            onClick={onClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-pressed={selected}
            aria-label={`Select image ${url.split('/').pop()}`}
            className={`
        relative aspect-square rounded-lg overflow-hidden cursor-pointer
        transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400
        ${selected
                    ? "ring-4 ring-blue-500 ring-offset-2"
                    : "ring-1 ring-slate-200 hover:ring-slate-300 hover:shadow-md"
                }
      `}
        >
            {/* Image or Error Placeholder */}
            {imageError ? (
                <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center">
                    <svg
                        className="w-12 h-12 text-slate-400"
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
                    <span className="text-xs text-slate-500 mt-2">Failed to load</span>
                </div>
            ) : (
                <img
                    src={url}
                    alt={`Product image: ${url.split('/').pop()}`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                />
            )}

            {/* Selection Overlay and Checkmark */}
            {selected && (
                <>
                    {/* Blue overlay */}
                    <div className="absolute inset-0 bg-blue-500/20" />

                    {/* Checkmark icon */}
                    <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                        <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </>
            )}

            {/* Optional Delete Button */}
            {onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(url);
                    }}
                    className="
            absolute top-2 left-2 bg-red-500 hover:bg-red-600
            rounded-full p-1 opacity-0 hover:opacity-100
            transition-opacity duration-200
          "
                    aria-label="Delete image"
                >
                    <svg
                        className="w-4 h-4 text-white"
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
            )}
        </div>
    );
}
