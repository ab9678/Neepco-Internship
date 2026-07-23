import PostImageGrid from "./PostImageGrid";

const PostContent = ({ post }) => {
    return (
        <div className="mt-4 space-y-3">
            {post.content && (
                <p className="whitespace-pre-wrap break-words text-gray-800 leading-relaxed">
                    {post.content}
                </p>
            )}

            <PostImageGrid images={post.images} />
        </div>
    );
};

export default PostContent;
