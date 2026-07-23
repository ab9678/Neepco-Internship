import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";

export const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB, matches backend limit
export const MAX_IMAGES = 5; // matches postUpload.array("images", 5)

/**
 * Shared image picker + preview strip for creating/editing posts.
 *
 * `items` is a flat list the parent controls, each shaped as:
 *   { key, url, onRemove }
 * so this component doesn't need to know whether an image is an
 * already-uploaded (existing) image or a newly-selected file.
 */
const ImagePicker = ({
    items,
    remainingSlots,
    onFilesSelected,
    error,
    processing = false,
}) => {
    const inputRef = useRef(null);

    const handleChange = (e) => {
        const files = Array.from(e.target.files || []);
        onFilesSelected(files);
        // Reset the input so selecting the same file again re-triggers onChange.
        e.target.value = "";
    };

    return (
        <div className="space-y-2">
            {items.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {items.map((item) => (
                        <div
                            key={item.key}
                            className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                        >
                            <img
                                src={item.url}
                                alt="Selected"
                                className="h-full w-full object-cover"
                            />

                            <button
                                type="button"
                                onClick={item.onRemove}
                                disabled={processing}
                                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-90 transition hover:bg-black/80 disabled:opacity-50"
                                aria-label="Remove image"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {remainingSlots > 0 && (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-sm text-gray-600 transition hover:border-blue-400 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <ImagePlus size={18} />
                    <span>
                        {processing
                            ? "Optimizing photo" +
                              (remainingSlots > 1 ? "s" : "") +
                              "..."
                            : `Add photo${
                                  remainingSlots > 1 ? "s" : ""
                              } (${remainingSlots} of ${MAX_IMAGES} left)`}
                    </span>
                </button>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={ALLOWED_IMAGE_TYPES.join(",")}
                multiple
                disabled={processing}
                className="hidden"
                onChange={handleChange}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default ImagePicker;
