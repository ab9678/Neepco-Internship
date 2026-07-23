import { useState } from "react";

import { getFileUrl } from "../../../utils/fileUrl";
import ImageLightbox from "./ImageLightbox";

// Renders a post's images in a Facebook/Instagram-style responsive grid
// (1 image = full width, 2-4 = grid, 5+ = grid with "+N" overlay on the last tile).
const PostImageGrid = ({ images = [] }) => {
    const [lightboxIndex, setLightboxIndex] = useState(null);

    if (!images.length) return null;

    const urls = images.map((img) => getFileUrl(img));
    const count = urls.length;
    const visible = urls.slice(0, 4);
    const remaining = count - 4;

    const gridClass =
        count === 1
            ? "grid-cols-1"
            : count === 2
            ? "grid-cols-2"
            : count === 3
            ? "grid-cols-2"
            : "grid-cols-2";

    return (
        <>
            <div className={`grid gap-1 overflow-hidden rounded-xl ${gridClass}`}>
                {visible.map((url, i) => {
                    // In a 3-image layout, make the first tile span both rows.
                    const spanFirstOfThree =
                        count === 3 && i === 0 ? "row-span-2" : "";

                    return (
                        <button
                            key={url + i}
                            type="button"
                            onClick={() => setLightboxIndex(i)}
                            className={`relative block overflow-hidden bg-gray-100 ${spanFirstOfThree}`}
                        >
                            <img
                                src={url}
                                alt={`Post attachment ${i + 1}`}
                                className={`h-full w-full object-cover ${
                                    count === 1
                                        ? "max-h-[520px] w-full"
                                        : "aspect-square"
                                }`}
                                loading="lazy"
                            />

                            {i === 3 && remaining > 0 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xl font-semibold text-white">
                                    +{remaining}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {lightboxIndex !== null && (
                <ImageLightbox
                    images={urls}
                    index={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onIndexChange={setLightboxIndex}
                />
            )}
        </>
    );
};

export default PostImageGrid;
