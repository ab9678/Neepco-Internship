import { useEffect, useState } from "react";

import MainLayout from "../../layouts/MainLayout";
import FeedList from "../../components/feed/FeedList";
import CreatePostModal from "../../components/feed/CreatePostModal";
import postService from "../../services/post.service";

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            setLoading(true);

            const { data } = await postService.getAllPosts();

            if (data.success) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <MainLayout>
            <div className="mx-auto max-w-2xl space-y-5">
                <CreatePostModal onPostCreated={fetchPosts} />

                <FeedList
                    posts={posts}
                    loading={loading}
                />
            </div>
        </MainLayout>
    );
};

export default FeedPage;