import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaKey } from "react-icons/fa";
import toast from "react-hot-toast";

import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

import authService from "../../services/auth.service";
import { useAuth } from "../../contexts/AuthContext";

const LoginOTP = () => {

    const navigate = useNavigate();

    const { fetchCurrentUser } = useAuth();

    const identifier = sessionStorage.getItem(
        "loginIdentifier"
    );

    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!identifier) {
            navigate("/login");
        }

    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!otp.trim())
            return toast.error("OTP is required.");

        setLoading(true);

        try {

            const payload = {
                otp: otp.trim()
            };

            if (identifier.includes("@")) {
                payload.companyEmail = identifier;
            } else {
                payload.employeeId = identifier;
            }

            const { data } =
                await authService.verifyLogin(payload);

            localStorage.setItem(
                "token",
                data.token
            );

            await fetchCurrentUser();

            sessionStorage.removeItem(
                "loginIdentifier"
            );

            toast.success("Login Successful");

            navigate("/dashboard");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "OTP Verification Failed."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout>

            <AuthCard>

                <AuthHeader
                    title="Verify Login"
                    subtitle="Enter the OTP sent to your company email"
                />

                <form onSubmit={handleSubmit}>

                    <AuthInput
                        label="OTP"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) =>
                            setOtp(e.target.value)
                        }
                        icon={<FaKey />}
                        required
                    />

                    <AuthButton loading={loading}>
                        Verify OTP
                    </AuthButton>

                </form>

            </AuthCard>

        </AuthLayout>

    );

};

export default LoginOTP;