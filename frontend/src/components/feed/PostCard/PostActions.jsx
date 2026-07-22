import {
    Heart,
    MessageCircle,
    Pencil,
    Trash2,
} from "lucide-react";

const PostActions = ({
    post,
    onLike,
    onComment,
    onEdit,
    onDelete,
    currentUser,
}) => {
    const isOwner = currentUser?._id === post.author?._id;
    const isAdmin = currentUser?.role === "admin";

    return (
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
            <div className="flex items-center gap-6">
                <button
                    onClick={onLike}
                    className="flex items-center gap-2 text-gray-600 transition hover:text-red-500"
                >
                    <Heart
                        size={20}
                        fill={post.isLiked ? "currentColor" : "none"}
                    />
                    <span>{post.likes.length}</span>
                </button>

                <button
                    onClick={onComment}
                    className="flex items-center gap-2 text-gray-600 transition hover:text-blue-600"
                >
                    <MessageCircle size={20} />
                    <span>{post.comments?.length || 0}</span>
                </button>
            </div>

            {(isOwner || isAdmin) && (
                <div className="flex items-center gap-3">
                    {isOwner && (
                        <button
                            onClick={onEdit}
                            className="text-gray-600 transition hover:text-blue-600"
                        >
                            <Pencil size={18} />
                        </button>
                    )}

                    <button
                        onClick={onDelete}
                        className="text-gray-600 transition hover:text-red-600"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostActions;