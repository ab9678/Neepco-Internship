import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Fullscreen viewer for a post's images with keyboard + arrow navigation.
const ImageLightbox = ({ images, index, onClose, onIndexChange }) => {
    const goPrev = useCallback(
        (e) => {
            e?.stopPropagation();
            onIndexChange((index - 1 + images.length) % images.length);
        },
        [index, images.length, onIndexChange]
    );

    const goNext = useCallback(
        (e) => {
            e?.stopPropagation();
            onIndexChange((index + 1) % images.length);
        },
        [index, images.length, onIndexChange]
    );

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, goPrev, goNext]);

    if (index == null || !images?.length) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-white transition hover:bg-white/10"
                aria-label="Close"
            >
                <X size={24} />
            </button>

            {images.length > 1 && (
                <button
                    onClick={goPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white transition hover:bg-white/10 sm:left-4"
                    aria-label="Previous image"
                >
                    <ChevronLeft size={28} />
                </button>
            )}

            <img
                src={images[index]}
                alt={`Image ${index + 1} of ${images.length}`}
                className="max-h-[85vh] max-w-full rounded-lg object-contain"
                onClick={(e) => e.stopPropagation()}
            />

            {images.length > 1 && (
                <button
                    onClick={goNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white transition hover:bg-white/10 sm:right-4"
                    aria-label="Next image"
                >
                    <ChevronRight size={28} />
                </button>
            )}

            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                    {index + 1} / {images.length}
                </div>
            )}
        </div>
    );
};

export default ImageLightbox;
