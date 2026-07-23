import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

import postService from "../../services/post.service";
import { compressImage } from "../../utils/compressImage";
import ImagePicker, {
    ALLOWED_IMAGE_TYPES,
    MAX_IMAGE_SIZE_BYTES,
    MAX_IMAGES,
} from "./ImagePicker";

const CreatePostModal = ({
    isOpen,
    onOpen,
    onClose,
    onPostCreated,
}) => {
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]); // File[]
    const [imageError, setImageError] = useState("");
    const [compressing, setCompressing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Object URLs for previewing selected files; revoked on change/unmount.
    const previewUrls = files.map((file) => URL.createObjectURL(file));

    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    const resetForm = () => {
        setContent("");
        setFiles([]);
        setImageError("");
    };

    const handleFilesSelected = async (newFiles) => {
        setImageError("");

        // Filter by type/count up front so we don't waste time compressing
        // files we're going to reject anyway.
        const candidates = [];

        for (const file of newFiles) {
            if (files.length + candidates.length >= MAX_IMAGES) {
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
                setFiles((prev) => [...prev, ...accepted]);
            }
        } finally {
            setCompressing(false);
        }
    };

    const handleRemoveFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setImageError("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent && files.length === 0) {
            setImageError("Write something or add at least one photo.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("content", trimmedContent);
            files.forEach((file) => formData.append("images", file));

            const { data } = await postService.createPost(formData);

            if (data.success) {
                resetForm();
                onClose();

                if (onPostCreated) {
                    onPostCreated();
                }
            }
        } catch (error) {
            console.error("Create Post Error:", error);
            setImageError(
                error.response?.data?.message ||
                    "Failed to create post. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const pickerItems = files.map((file, index) => ({
        key: `${file.name}-${index}`,
        url: previewUrls[index],
        onRemove: () => handleRemoveFile(index),
    }));

    return (
        <>
            <button
                onClick={onOpen}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white p-4 transition hover:bg-gray-50"
            >
                <Plus size={20} />
                <span>Create Post</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                Create Post
                            </h2>

                            <button
                                onClick={handleClose}
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
                                placeholder="What's on your mind?"
                                value={content}
                                onChange={(e) =>
                                    setContent(e.target.value)
                                }
                                className="w-full resize-none rounded-xl border border-gray-300 p-4 outline-none focus:border-blue-500"
                            />

                            <ImagePicker
                                items={pickerItems}
                                remainingSlots={MAX_IMAGES - files.length}
                                onFilesSelected={handleFilesSelected}
                                error={imageError}
                                processing={compressing}
                            />

                            <button
                                type="submit"
                                disabled={loading || compressing}
                                className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? "Posting..." : "Post"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreatePostModal;
