import { BrowserRouter, Routes, Route } from "react-router-dom";
import FeedPage from "../pages/feed/FeedPage";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<FeedPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;