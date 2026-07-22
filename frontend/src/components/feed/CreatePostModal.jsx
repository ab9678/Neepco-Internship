import { useState } from "react";
import { Plus, X } from "lucide-react";

import postService from "../../services/post.service";

const CreatePostModal = ({
    isOpen,
    onOpen,
    onClose,
    onPostCreated,
}) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) return;

        try {
            setLoading(true);

            const { data } = await postService.createPost({
                content,
            });

            if (data.success) {
                setContent("");
                onClose();

                if (onPostCreated) {
                    onPostCreated();
                }
            }
        } catch (error) {
            console.error("Create Post Error:", error);
        } finally {
            setLoading(false);
        }
    };

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
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                Create Post
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
                                placeholder="What's on your mind?"
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