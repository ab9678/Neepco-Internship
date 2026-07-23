import { useEffect, useState } from "react";
import { X } from "lucide-react";

import postService from "../../services/post.service";
import { getFileUrl } from "../../utils/fileUrl";
import { compressImage } from "../../utils/compressImage";
import ImagePicker, {
    ALLOWED_IMAGE_TYPES,
    MAX_IMAGE_SIZE_BYTES,
    MAX_IMAGES,
} from "./ImagePicker";

const EditPostModal = ({
    open,
    onClose,
    post,
    onUpdated,
}) => {
    const [content, setContent] = useState("");
    // Existing (already-uploaded) image paths the user still wants to keep.
    const [keptImages, setKeptImages] = useState([]);
    // Newly selected files to upload alongside the kept images.
    const [newFiles, setNewFiles] = useState([]);
    const [imageError, setImageError] = useState("");
    const [compressing, setCompressing] = useState(false);
    const [loading, setLoading] = useState(false);

    const previewUrls = newFiles.map((file) => URL.createObjectURL(file));

    useEffect(() => {
        if (post) {
            setContent(post.content || "");
            setKeptImages(post.images || []);
            setNewFiles([]);
            setImageError("");
        }
    }, [post]);

    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newFiles]);

    const totalImages = keptImages.length + newFiles.length;

    const handleFilesSelected = async (files) => {
        setImageError("");

        const candidates = [];

        for (const file of files) {
            if (
                keptImages.length + newFiles.length + candidates.length >=
                MAX_IMAGES
            ) {
                setImageError(`You can attach up to ${MAX_IMAGES} images.`);
                break;
            }

            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                setImageError(
                    "Only JPEG, JPG, PNG and WEBP images are allowed."
                );
                continue;
            }

            candidates.push(file);
        }

        if (!candidates.length) return;

        setCompressing(true);

        try {
            const accepted = [];

            for (const file of candidates) {
                const compressed = await compressImage(file);

                if (compressed.size > MAX_IMAGE_SIZE_BYTES) {
                    setImageError(
                        "One of your images is still over 5 MB after compression."
                    );
                    continue;
                }

                accepted.push(compressed);
            }

            if (accepted.length) {
                setNewFiles((prev) => [...prev, ...accepted]);
            }
        } finally {
            setCompressing(false);
        }
    };

    const handleRemoveKept = (path) => {
        setKeptImages((prev) => prev.filter((p) => p !== path));
        setImageError("");
    };

    const handleRemoveNewFile = (index) => {
        setNewFiles((prev) => prev.filter((_, i) => i !== index));
        setImageError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent && totalImages === 0) {
            setImageError("Write something or keep at least one photo.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("content", trimmedContent);
            formData.append("keepImages", JSON.stringify(keptImages));
            newFiles.forEach((file) => formData.append("images", file));

            const { data } = await postService.updatePost(
                post._id,
                formData
            );

            if (data.success) {
                onUpdated?.(data.post);
                onClose();
            }
        } catch (error) {
            console.error("Update Post Error:", error);
            setImageError(
                error.response?.data?.message ||
                    "Failed to update post. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!open || !post) return null;

    const pickerItems = [
        ...keptImages.map((path) => ({
            key: path,
            url: getFileUrl(path),
            onRemove: () => handleRemoveKept(path),
        })),
        ...newFiles.map((file, index) => ({
            key: `new-${file.name}-${index}`,
            url: previewUrls[index],
            onRemove: () => handleRemoveNewFile(index),
        })),
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Edit Post
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <textarea
                        rows={6}
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                        className="w-full resize-none rounded-xl border border-gray-300 p-4 outline-none focus:border-blue-500"
                    />

                    <ImagePicker
                        items={pickerItems}
                        remainingSlots={MAX_IMAGES - totalImages}
                        onFilesSelected={handleFilesSelected}
                        error={imageError}
                        processing={compressing}
                    />

                    <button
                        type="submit"
                        disabled={loading || compressing}
                        className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading
                            ? "Updating..."
                            : "Update Post"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPostModal;
