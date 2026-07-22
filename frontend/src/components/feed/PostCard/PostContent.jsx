const PostContent = ({ post }) => {
    return (
        <div className="mt-4 space-y-3">
            {post.content && (
                <p className="whitespace-pre-wrap break-words text-gray-800 leading-relaxed">
                    {post.content}
                </p>
            )}

            {post.image && (
                <div className="overflow-hidden rounded-xl border border-gray-200">
                    <img
                        src={post.image}
                        alt="Post"
                        className="w-full object-cover"
                    />
                </div>
            )}
        </div>
    );
};

export default PostContent;