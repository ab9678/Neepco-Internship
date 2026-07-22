import MainLayout from "../../layouts/MainLayout";
import FeedList from "../../components/feed/FeedList";

const FeedPage = () => {
    return (
        <MainLayout>
            <div className="mx-auto max-w-2xl">
                <FeedList />
            </div>
        </MainLayout>
    );
};

export default FeedPage;