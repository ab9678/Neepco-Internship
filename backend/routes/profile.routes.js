import express from "express";

import protect from "../middleware/auth.middleware.js";
import handleUploadError from "../middleware/upload.middleware.js";

import { profileUpload } from "../config/multer.js";

import {
    getMyProfile,
    updateProfile,
    updateProfilePicture,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);

router.put("/", protect, updateProfile);

router.put(
    "/picture",
    protect,
    profileUpload.single("profilePicture"),
    handleUploadError,
    updateProfilePicture
);

export default router;