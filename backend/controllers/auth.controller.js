import bcrypt from "bcrypt";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import generateOTP from "../utils/generateOTP.js";
import sendOTPEmail from "../utils/sendOTPEmail.js";
import generateToken from "../utils/generateToken.js";

export const requestRegistrationOTP = async (req, res) => {
    try {
        const { employeeId, companyEmail } = req.body;
        console.log(req.body);
        console.log(employeeId);
        console.log(companyEmail);
        console.log("Requesting registration OTP...");
        // Employee ID or Company Email is required
        if (!employeeId && !companyEmail) {
            return res.status(400).json({
                success: false,
                message: "Employee ID or Company Email is required.",
            });
        }

        // Find employee
        console.log(req.body);

        const employee = await Employee.findOne({
            employeeId: req.body.employeeId,
        });

        console.log(employee);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found.",
            });
        }

        // Check registration status
        if (employee.isRegistered) {
            return res.status(400).json({
                success: false,
                message: "Employee is already registered.",
            });
        }

        // Remove previous registration OTPs
        await OTP.deleteMany({
            employee: employee._id,
            purpose: "registration",
        });

        // Generate OTP
        const otp = generateOTP();

        // Expiry after 5 minutes
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Save OTP
        await OTP.create({
            employee: employee._id,
            otp,
            purpose: "registration",
            expiresAt,
        });

        // Send OTP email
        await sendOTPEmail(employee.companyEmail, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully.",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};


export const verifyRegistrationOTP = async (req, res) => {
    try {
        const { employeeId, companyEmail, otp, password } = req.body;

        // Check required fields
        if ((!employeeId && !companyEmail) || !otp || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Employee ID or Company Email, OTP and Password are required.",
            });
        }

        // Find employee
        const employee = await Employee.findOne({
            $or: [
                employeeId ? { employeeId } : null,
                companyEmail ? { companyEmail } : null,
            ].filter(Boolean),
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found.",
            });
        }

        // Already registered?
        if (employee.isRegistered) {
            return res.status(400).json({
                success: false,
                message: "Employee is already registered.",
            });
        }

        // Find latest OTP
        const otpRecord = await OTP.findOne({
            employee: employee._id,
            purpose: "registration",
            isUsed: false,
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(404).json({
                success: false,
                message: "OTP not found.",
            });
        }

        // Check expiry
        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired.",
            });
        }

        // Compare OTP
        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        await User.create({
            employee: employee._id,
            password: hashedPassword,
        });

        // Update employee
        employee.isRegistered = true;
        await employee.save();

        // Mark OTP used
        otpRecord.isUsed = true;
        await otpRecord.save();

        return res.status(201).json({
            success: true,
            message: "Registration completed successfully.",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};


export const login = async (req, res) => {
    try {

        const { employeeId, companyEmail, password } = req.body;

        if ((!employeeId && !companyEmail) || !password) {
            return res.status(400).json({
                success: false,
                message: "Employee ID or Company Email and Password are required."
            });
        }

        const employee = await Employee.findOne({
            $or: [
                employeeId ? { employeeId } : null,
                companyEmail ? { companyEmail } : null,
            ].filter(Boolean)
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found."
            });
        }

        if (!employee.isRegistered) {
            return res.status(400).json({
                success: false,
                message: "Employee has not registered yet."
            });
        }

        const user = await User.findOne({
            employee: employee._id
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password."
            });
        }

        await OTP.deleteMany({
            employee: employee._id,
            purpose: "login",
            isUsed: false
        });

        const otp = generateOTP();

        const otpDocument = await OTP.create({
            employee: employee._id,
            otp,
            purpose: "login",
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendOTPEmail(
            employee.companyEmail,
            otp,
            "Login OTP"
        );

        return res.status(200).json({
            success: true,
            message: "Login OTP sent successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });

    }
};

export const verifyLoginOTP = async (req, res) => {
    try {

        const { employeeId, companyEmail, otp } = req.body;

        if ((!employeeId && !companyEmail) || !otp) {
            return res.status(400).json({
                success: false,
                message: "Employee ID or Company Email and OTP are required."
            });
        }

        const employee = await Employee.findOne({
            $or: [
                employeeId ? { employeeId } : null,
                companyEmail ? { companyEmail } : null
            ].filter(Boolean)
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found."
            });
        }

        const user = await User.findOne({
            employee: employee._id
        }).populate("employee");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const otpRecord = await OTP.findOne({
            employee: employee._id,
            purpose: "login",
            isUsed: false
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(404).json({
                success: false,
                message: "OTP not found."
            });
        }

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired."
            });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });
        }

        otpRecord.isUsed = true;
        await otpRecord.save();

        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });

    }
};

export const getCurrentUser = async (req, res) => {

    return res.status(200).json({
        success: true,
        user: req.user
    });

};


