import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { getAllPosts } from "../../services/post.service";

const FeedList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await getAllPosts();

            if (data.success) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

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