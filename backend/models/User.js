import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["employee", "admin"],
            default: "employee",
            required: true,
        },

        profilePicture: {
            type: String,
            default: "",
            trim: true,
        },

        bio: {
            type: String,
            default: "",
            trim: true,
            maxlength: 250,
        },

        isVerified: {
            type: Boolean,
            default: true,
        },

        lastLogin: {
            type: Date,
            default: null,
        },

        lastPasswordChanged: {
            type: Date,
            default: Date.now,
        },

        refreshToken: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;