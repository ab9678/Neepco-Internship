import fs from "fs";
import path from "path";

import User from "../models/User.js";

/*
    GET /api/profile/me
    Private
*/
export const getMyProfile = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile.",
        });
    }
};

/*
    PUT /api/profile
    Private
*/
export const updateProfile = async (req, res) => {
    try {
        const { bio } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        user.bio = bio?.trim() || "";

        await user.save();

        await user.populate("employee");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update profile.",
        });
    }
};

/*
    PUT /api/profile/picture
    Private
*/
export const updateProfilePicture = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image.",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Delete previous profile picture (optional)
        if (user.profilePicture) {

            const oldFile = path.join(
                process.cwd(),
                user.profilePicture.replace(/^\//, "")
            );

            if (fs.existsSync(oldFile)) {
                fs.unlinkSync(oldFile);
            }
        }

        user.profilePicture = `/uploads/profiles/${req.file.filename}`;

        await user.save();

        await user.populate("employee");

        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully.",
            user,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to upload profile picture.",
        });
    }
};