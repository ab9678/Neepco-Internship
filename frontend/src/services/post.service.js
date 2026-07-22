import api from "./api";

const postService = {
    getAllPosts: () => api.get("/posts"),

    createPost: (data) => api.post("/posts", data),

    updatePost: (id, data) => api.put(`/posts/${id}`, data),

    deletePost: (id) => api.delete(`/posts/${id}`),

    toggleLike: (id) => api.patch(`/posts/${id}/like`),
};

export default postService;