import { useState } from "react";
import CommentCard from "./CommentCard";
import CommentInput from "./CommentInput";

const CommentSection = ({
    comments = [],
    onAddComment,
    loading = false,
}) => {
    const [showComments, setShowComments] = useState(false);

    return (
        <div className="mt-4 border-t border-gray-200 pt-4">
            <button
                onClick={() => setShowComments(!showComments)}
                className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
                {showComments
                    ? "Hide Comments"
                    : `View Comments (${comments.length})`}
            </button>

            {showComments && (
                <>
                    <div className="space-y-2">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <CommentCard
                                    key={comment._id}
                                    comment={comment}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">
                                No comments yet.
                            </p>
                        )}
                    </div>

                    <CommentInput
                        onSubmit={onAddComment}
                        loading={loading}
                    />
                </>
            )}
        </div>
    );
};

export default CommentSection;