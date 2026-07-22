import { useState } from "react";

import { useAuth } from "../../contexts/AuthContext";
import postService from "../../services/post.service";
import commentService from "../../services/comment.service";
import PostHeader from "./PostCard/PostHeader";
import PostContent from "./PostCard/PostContent";
import PostActions from "./PostCard/PostActions";
import CommentSection from "./PostCard/CommentSection/CommentSection";
import EditPostModal from "./EditPostModal";

const PostCard = ({ post, onPostsChanged }) => {
    const { user } = useAuth();

    const [postData, setPostData] = useState(post);
    const [loading, setLoading] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const handleLike = async () => {
        if (loading) return;

        try {
            setLoading(true);

            const { data } = await postService.toggleLike(postData._id);

            if (data.success) {
                const updatedLikes = data.isLiked
                    ? [...postData.likes, user._id]
                    : postData.likes.filter((id) => id !== user._id);

                setPostData((prev) => ({
                    ...prev,
                    likes: updatedLikes,
                    likesCount: data.likesCount,
                    isLiked: data.isLiked,
                }));
            }
        } catch (error) {
            console.error("Like Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleComment = () => {};

    const handleEdit = () => {
        setEditOpen(true);
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmed) return;

        try {
            setLoading(true);

            const { data } = await postService.deletePost(postData._id);

            if (data.success) {
                onPostsChanged?.();
            }
        } catch (error) {
            console.error("Delete Error:", error);
            alert("Failed to delete post.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (content) => {
        try {
            const { data } = await commentService.createComment(
                postData._id,
                content
            );

            if (data.success) {
                setPostData((prev) => ({
                    ...prev,
                    commentsCount: data.commentsCount,
                }));

                return data.comment;
            }

            return null;
        } catch (error) {
            console.error("Comment Error:", error);
            return null;
        }
    };

    const handleCommentCountChange = (count) => {
        setPostData((prev) => ({
            ...prev,
            commentsCount: count,
        }));
    };

    const handlePostUpdated = (updatedPost) => {
        setPostData(updatedPost);
        setEditOpen(false);
    };

    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <PostHeader post={postData} />

                <PostContent post={postData} />

                <PostActions
                    post={postData}
                    currentUser={user}
                    onLike={handleLike}
                    onComment={handleComment}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                <CommentSection
                    postId={postData._id}
                    comments={postData.comments || []}
                    commentsCount={postData.commentsCount ?? 0}
                    onCommentCountChange={handleCommentCountChange}
                    onAddComment={handleAddComment}
                />
            </div>

            <EditPostModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                post={postData}
                onUpdated={handlePostUpdated}
            />
        </>
    );
};

export default PostCard;