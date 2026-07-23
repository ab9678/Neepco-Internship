// Client-side image compression: downscales oversized images and re-encodes
// them at a reasonable quality before upload, purely in the browser via
// createImageBitmap + <canvas>. No backend or new dependency involved.
//
// Falls back to the original file untouched if:
//  - the file is already small (not worth the CPU cost)
//  - compression fails for any reason (unsupported format, decode error)
//  - the "compressed" result somehow ends up larger than the original

const MAX_DIMENSION = 1920; // longest edge, in pixels
const JPEG_QUALITY = 0.82;
const SKIP_COMPRESSION_BELOW_BYTES = 300 * 1024; // 300 KB

const getScaledDimensions = (width, height, maxDimension) => {
    if (width <= maxDimension && height <= maxDimension) {
        return { width, height };
    }

    const ratio =
        width > height ? maxDimension / width : maxDimension / height;

    return {
        width: Math.round(width * ratio),
        height: Math.round(height * ratio),
    };
};

const canvasToBlob = (canvas, type, quality) =>
    new Promise((resolve) => canvas.toBlob(resolve, type, quality));

const withNewExtension = (fileName, mimeType) => {
    const base = fileName.replace(/\.[^/.]+$/, "");
    const ext =
        mimeType === "image/png"
            ? "png"
            : mimeType === "image/webp"
            ? "webp"
            : "jpg";

    return `${base}.${ext}`;
};

/**
 * @param {File} file
 * @returns {Promise<File>} compressed file, or the original if compression
 *   wasn't needed/possible.
 */
export async function compressImage(file) {
    if (!file.type?.startsWith("image/")) return file;
    if (file.size <= SKIP_COMPRESSION_BELOW_BYTES) return file;

    try {
        const bitmap = await createImageBitmap(file);

        const { width, height } = getScaledDimensions(
            bitmap.width,
            bitmap.height,
            MAX_DIMENSION
        );

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(bitmap, 0, 0, width, height);
        bitmap.close?.();

        // Keep PNGs as PNG so transparency (screenshots, logos, etc.)
        // survives; re-encode everything else as JPEG for better compression.
        const outputType =
            file.type === "image/png" ? "image/png" : "image/jpeg";

        const blob = await canvasToBlob(canvas, outputType, JPEG_QUALITY);

        if (!blob || blob.size >= file.size) {
            return file;
        }

        return new File([blob], withNewExtension(file.name, outputType), {
            type: outputType,
            lastModified: Date.now(),
        });
    } catch (error) {
        console.error("Image compression failed, using original file:", error);
        return file;
    }
}

/**
 * Compresses a batch of files, preserving order.
 * @param {File[]} files
 * @returns {Promise<File[]>}
 */
export async function compressImages(files) {
    return Promise.all(files.map((file) => compressImage(file)));
}
