import Post from "../models/Post.js";

export const createPost = async (req, res) => {
    try {
        const { content } = req.body;

        // Validation
        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Post content is required."
            });
        }

        const post = await Post.create({
            author: req.user._id,
            content: content.trim(),
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully.",
            post,
        });

    } catch (error) {
        console.error("Create Post Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

export const getAllPosts = async (req, res) => {
    try {

        const posts = await Post.find()
            .populate({
                path: "author",
                populate: {
                    path: "employee",
                    select: "firstName lastName employeeId department designation profilePicture"
                }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: posts.length,
            posts,
        });

    } catch (error) {
        console.error("Get Posts Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

export const updatePost = async (req, res) => {
    try {

        const { id } = req.params;
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Post content is required."
            });
        }

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        // Owner check
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own posts."
            });
        }

        post.content = content.trim();
        post.isEdited = true;

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post updated successfully.",
            post
        });

    } catch (error) {
        console.error("Update Post Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

export const deletePost = async (req, res) => {
    try {

        const { id } = req.params;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        // Owner or Admin can delete
        if (
            post.author.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this post."
            });
        }

        await post.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully."
        });

    } catch (error) {
        console.error("Delete Post Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

export const toggleLike = async (req, res) => {
    try {

        const { id } = req.params;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        const userId = req.user._id.toString();

        const alreadyLiked = post.likes.some(
            (like) => like.toString() === userId
        );

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                (like) => like.toString() !== userId
            );
        } else {
            post.likes.push(req.user._id);
        }

        await post.save();

        return res.status(200).json({
            success: true,
            message: alreadyLiked
                ? "Post unliked successfully."
                : "Post liked successfully.",
            likesCount: post.likes.length,
            isLiked: !alreadyLiked,
        });

    } catch (error) {
        console.error("Toggle Like Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};