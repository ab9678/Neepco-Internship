import Post from "../models/Post.js";
import fs from "fs";
import path from "path";

export const createPost = async (req, res) => {
    try {
        const { content = "" } = req.body;

        const trimmedContent = content.trim();

        const images = req.files
            ? req.files.map(
                  (file) => `/uploads/posts/${file.filename}`
              )
            : [];

        // Require either text or at least one image
        if (!trimmedContent && images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Post must contain text or at least one image.",
            });
        }

        const post = await Post.create({
            author: req.user._id,
            content: trimmedContent,
            images,
        });

        const populatedPost = await Post.findById(post._id).populate({
            path: "author",
            populate: {
                path: "employee",
                select:
                    "firstName lastName fullName employeeId department designation",
            },
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully.",
            post: populatedPost,
        });
    } catch (error) {
        console.error("Create Post Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
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
                    select: "firstName lastName fullName employeeId department designation profilePicture",
                },
            })
            .sort({ createdAt: -1 });

        const postsWithLikeStatus = posts.map((post) => {
            const postObj = post.toObject();

            postObj.isLiked = post.likes.some(
                (like) => like.toString() === req.user._id.toString()
            );

            // ✅ New
            postObj.likesCount = post.likes.length;
            postObj.commentsCount = post.comments.length;

            return postObj;
        });

        return res.status(200).json({
            success: true,
            count: postsWithLikeStatus.length,
            posts: postsWithLikeStatus,
        });
    } catch (error) {
        console.error("Get Posts Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { content = "" } = req.body;

        const trimmedContent = content.trim();

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found.",
            });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own posts.",
            });
        }

        const newImages = req.files
            ? req.files.map(
                  (file) => `/uploads/posts/${file.filename}`
              )
            : [];

        let images;

        // `keepImages` is an optional JSON-stringified array of existing
        // image paths the client wants to retain (sent by the current
        // frontend so users can delete individual images and/or add new
        // ones in the same edit). When it's not sent at all, we fall back
        // to the original behaviour for backward compatibility: replace
        // everything if new files were uploaded, otherwise keep the
        // existing images untouched.
        if (typeof req.body.keepImages === "string") {
            let keepImages = [];

            try {
                const parsed = JSON.parse(req.body.keepImages);
                if (Array.isArray(parsed)) {
                    keepImages = parsed.filter((item) =>
                        post.images.includes(item)
                    );
                }
            } catch {
                keepImages = [];
            }

            images = [...keepImages, ...newImages].slice(0, 5);

            // Delete any image that was on the post but isn't being kept.
            const imagesToDelete = post.images.filter(
                (image) => !images.includes(image)
            );

            for (const image of imagesToDelete) {
                const imagePath = path.join(
                    process.cwd(),
                    image.replace(/^\/+/, "")
                );

                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
        } else {
            // Keep old images if no new ones were uploaded
            images = post.images;

            if (newImages.length > 0) {
                // Delete old image files
                for (const image of post.images) {
                    const imagePath = path.join(
                        process.cwd(),
                        image.replace(/^\/+/, "")
                    );

                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                }

                images = newImages;
            }
        }

        // Prevent empty posts
        if (!trimmedContent && images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Post must contain text or at least one image.",
            });
        }

        post.content = trimmedContent;
        post.images = images;
        post.isEdited = true;

        await post.save();

        const updatedPost = await Post.findById(post._id).populate({
            path: "author",
            populate: {
                path: "employee",
                select:
                    "firstName lastName fullName employeeId department designation",
            },
        });

        const updatedPostObj = updatedPost.toObject();

        updatedPostObj.isLiked = updatedPost.likes.some(
            (like) => like.toString() === req.user._id.toString()
        );

        updatedPostObj.likesCount = updatedPost.likes.length;
        updatedPostObj.commentsCount = updatedPost.comments.length;

        return res.status(200).json({
            success: true,
            message: "Post updated successfully.",
            post: updatedPostObj,
        });
    } catch (error) {
        console.error("Update Post Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
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
                message: "Post not found.",
            });
        }

        if (
            post.author.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this post.",
            });
        }

        // Delete all uploaded images from disk
        for (const image of post.images) {
            const imagePath = path.join(
                process.cwd(),
                image.replace(/^\/+/, "")
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await post.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully.",
        });
    } catch (error) {
        console.error("Delete Post Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
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
                message: "Post not found.",
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
            message: "Internal Server Error.",
        });
    }
};