import express from "express";
import protect from "../middleware/auth.middleware.js";
import { createComment, getComments, editComment, deleteComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/:postId", protect, createComment);
router.get("/:postId", protect, getComments);
router.put("/:id", protect, editComment);
router.delete("/:id", protect, deleteComment);

export default router;