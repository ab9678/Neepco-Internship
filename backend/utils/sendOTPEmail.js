import transporter from "../config/mail.js";

const sendOTPEmail = async (email, otp) => {
    await transporter.sendMail({
        from: `"NEEPCO ISNS" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Verification Code",
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>NEEPCO Internal Social Networking System</h2>

                <p>Your One-Time Password (OTP) is:</p>

                <h1 style="letter-spacing:4px;">${otp}</h1>

                <p>This OTP is valid for <strong>5 minutes</strong>.</p>

                <p>If you did not request this code, please ignore this email.</p>
            </div>
        `,
    });
};

export default sendOTPEmail;