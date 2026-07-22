import PostCard from "./PostCard";

const FeedList = ({ posts, loading }) => {
    if (loading) {
        return (
            <p className="text-center text-gray-500">
                Loading posts...
            </p>
        );
    }

    if (posts.length === 0) {
        return (
            <p className="text-center text-gray-500">
                No posts yet.
            </p>
        );
    }

    return (
        <div className="space-y-5">
            {posts.map((post) => (
                <PostCard
                    key={post._id}
                    post={post}
                />
            ))}
        </div>
    );
};

export default FeedList;