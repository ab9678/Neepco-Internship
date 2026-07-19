import dotenv from "dotenv";
import transporter from "./config/mail.js";

dotenv.config();

const testMail = async () => {
    try {
        const info = await transporter.sendMail({
            from: `"NEEPCO ISNS" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Sends to yourself
            subject: "Nodemailer Test",
            text: "Congratulations! Your email configuration is working successfully.",
        });

        console.log("Email sent successfully!");
        console.log("Message ID:", info.messageId);
    } catch (error) {
        console.error("Failed to send email:");
        console.error(error);
    }
};

testMail();