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