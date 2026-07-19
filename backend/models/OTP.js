import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },

        otp: {
            type: String,
            required: true,
            trim: true,
        },

        purpose: {
            type: String,
            enum: ["registration", "login", "password_reset"],
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
            expires: 0,
        },

        isUsed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;