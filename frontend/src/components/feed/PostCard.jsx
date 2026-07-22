import { useAuth } from "../../contexts/AuthContext";

import PostHeader from "./PostCard/PostHeader";
import PostContent from "./PostCard/PostContent";
import PostActions from "./PostCard/PostActions";
import CommentSection from "./PostCard/CommentSection/CommentSection";

const PostCard = ({ post }) => {
    const { user } = useAuth();

    const handleLike = () => {
        console.log("Like:", post._id);
    };

    const handleComment = () => {
        console.log("Comment:", post._id);
    };

    const handleEdit = () => {
        console.log("Edit:", post._id);
    };

    const handleDelete = () => {
        console.log("Delete:", post._id);
    };

    const handleAddComment = (comment) => {
        console.log("New Comment:", comment);
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <PostHeader post={post} />

            <PostContent post={post} />

            <PostActions
                post={post}
                currentUser={user}
                onLike={handleLike}
                onComment={handleComment}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <CommentSection
                comments={post.comments || []}
                onAddComment={handleAddComment}
            />
        </div>
    );
};

export default PostCard;