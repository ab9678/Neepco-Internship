import express from "express";
import {
    createPost,
    getAllPosts,
    updatePost,
    deletePost,
    toggleLike,
} from "../controllers/post.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { postUpload } from "../config/multer.js";
import handleUploadError from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    postUpload.array("images", 5),
    handleUploadError,
    createPost
);

router.get("/", authMiddleware, getAllPosts);

router.put(
    "/:id",
    authMiddleware,
    postUpload.array("images", 5),
    handleUploadError,
    updatePost
);

router.delete("/:id", authMiddleware, deletePost);

router.patch("/:id/like", authMiddleware, toggleLike);

export default router;