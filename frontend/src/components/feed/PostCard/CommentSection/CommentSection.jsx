import { useState } from "react";

import commentService from "../../../../services/comment.service";
import CommentCard from "./CommentCard";
import CommentInput from "./CommentInput";

const CommentSection = ({
    postId,
    commentsCount = 0,
    onCommentCountChange,
    onAddComment,
}) => {
    const [showComments, setShowComments] = useState(false);

    // IMPORTANT:
    // Do NOT initialize with post.comments because those are only ObjectIds.
    const [commentList, setCommentList] = useState([]);

    const [loading, setLoading] = useState(false);

    const fetchComments = async () => {
        try {
            setLoading(true);

            const { data } = await commentService.getComments(postId);

            if (data.success) {
                setCommentList(data.comments);
                onCommentCountChange?.(data.count);
            }
        } catch (error) {
            console.error("Fetch Comments Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleComments = async () => {
        if (!showComments) {
            await fetchComments();
            setShowComments(true);
        } else {
            setShowComments(false);
        }
    };

    const handleAddComment = async (content) => {
        const comment = await onAddComment(content);

        if (comment) {
            setCommentList((prev) => {
                const updated = [...prev, comment];
                onCommentCountChange?.(updated.length);
                return updated;
            });
        }
    };

    const handleEditComment = async (commentId, content) => {
        try {
            const { data } = await commentService.editComment(
                commentId,
                content
            );

            if (data.success) {
                setCommentList((prev) =>
                    prev.map((comment) =>
                        comment._id === commentId
                            ? data.comment
                            : comment
                    )
                );
            }
        } catch (error) {
            console.error("Edit Comment Error:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const { data } = await commentService.deleteComment(commentId);

            if (data.success) {
                setCommentList((prev) => {
                    const updated = prev.filter(
                        (comment) => comment._id !== commentId
                    );

                    onCommentCountChange?.(
                        data.commentsCount ?? updated.length
                    );

                    return updated;
                });
            }
        } catch (error) {
            console.error("Delete Comment Error:", error);
        }
    };

    return (
        <div className="mt-4 border-t border-gray-200 pt-4">
            <button
                onClick={handleToggleComments}
                className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
                {showComments
                    ? "Hide Comments"
                    : `View Comments (${commentsCount})`}
            </button>

            {showComments && (
                <>
                    <div className="space-y-2">
                        {commentList.length > 0 ? (
                            commentList.map((comment) => (
                                <CommentCard
                                    key={comment._id}
                                    comment={comment}
                                    onEdit={handleEditComment}
                                    onDelete={handleDeleteComment}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">
                                No comments yet.
                            </p>
                        )}
                    </div>

                    <CommentInput
                        onSubmit={handleAddComment}
                        loading={loading}
                    />
                </>
            )}
        </div>
    );
};

export default CommentSection;