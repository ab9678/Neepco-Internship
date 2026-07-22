import api from "./api";

const commentService = {
    getComments(postId) {
        return api.get(`/comments/${postId}`);
    },

    createComment(postId, content) {
        return api.post(`/comments/${postId}`, { content });
    },

    editComment(id, content) {
        return api.put(`/comments/${id}`, { content });
    },

    deleteComment(id) {
        return api.delete(`/comments/${id}`);
    },
};

export default commentService;