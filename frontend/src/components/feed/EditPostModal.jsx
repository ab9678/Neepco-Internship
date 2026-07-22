import { useEffect, useState } from "react";
import { X } from "lucide-react";

import postService from "../../services/post.service";

const EditPostModal = ({
    open,
    onClose,
    post,
    onUpdated,
}) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (post) {
            setContent(post.content);
        }
    }, [post]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) return;

        try {
            setLoading(true);

            const { data } = await postService.updatePost(
                post._id,
                {
                    content: content.trim(),
                }
            );

            if (data.success) {
                onUpdated?.(data.post);
                onClose();
            }
        } catch (error) {
            console.error("Update Post Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!open || !post) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
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

                    <button
                        type="submit"
                        disabled={loading}
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