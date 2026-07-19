import bcrypt from "bcrypt";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import generateOTP from "../utils/generateOTP.js";
import sendOTPEmail from "../utils/sendOTPEmail.js";

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