import { Send } from "lucide-react";
import { useState } from "react";

const CommentInput = ({ onSubmit, loading = false }) => {
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        const trimmed = comment.trim();

        if (!trimmed) return;

        onSubmit(trimmed);
        setComment("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="mt-3 flex items-end gap-2">
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Write a comment..."
                className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-full bg-blue-600 p-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <Send size={18} />
            </button>
        </div>
    );
};

export default CommentInput;