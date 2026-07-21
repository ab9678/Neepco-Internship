import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const createComment = async (req, res) => {
    try {

        const { postId } = req.params;
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment content is required."
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        const comment = await Comment.create({
            post: postId,
            author: req.user._id,
            content: content.trim(),
        });

        return res.status(201).json({
            success: true,
            message: "Comment added successfully.",
            comment,
        });

    } catch (error) {

        console.error("Create Comment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

export const getComments = async (req, res) => {
    try {

        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        const comments = await Comment.find({ post: postId })
            .populate({
                path: "author",
                populate: {
                    path: "employee",
                    select: "firstName lastName employeeId department designation profilePicture"
                }
            })
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: comments.length,
            comments,
        });

    } catch (error) {

        console.error("Get Comments Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

export const editComment = async (req, res) => {
    try {

        const { id } = req.params;
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment content is required."
            });
        }

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own comments."
            });
        }

        comment.content = content.trim();
        comment.isEdited = true;

        await comment.save();

        return res.status(200).json({
            success: true,
            message: "Comment updated successfully.",
            comment,
        });

    } catch (error) {

        console.error("Edit Comment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

export const deleteComment = async (req, res) => {
    try {

        const { id } = req.params;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        const isOwner = comment.author.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this comment."
            });
        }

        await comment.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully."
        });

    } catch (error) {

        console.error("Delete Comment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};