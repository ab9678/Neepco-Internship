import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaKey, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";

import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

import authService from "../../services/auth.service";

const RegisterOTP = () => {

    const navigate = useNavigate();

    const identifier = sessionStorage.getItem(
        "registerIdentifier"
    );

    const [formData, setFormData] = useState({
        otp: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!identifier) {
            navigate("/register");
        }

    }, []);

    const handleChange = (e) => {

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.otp.trim()) {
            return toast.error("OTP is required.");
        }

        if (!formData.password.trim()) {
            return toast.error("Password is required.");
        }

        setLoading(true);

        try {

            const payload = {
                otp: formData.otp.trim(),
                password: formData.password,
            };

            if (identifier.includes("@")) {
                payload.companyEmail = identifier;
            } else {
                payload.employeeId = identifier;
            }

            const { data } =
                await authService.verifyRegister(payload);

            toast.success(data.message);

            sessionStorage.removeItem(
                "registerIdentifier"
            );

            navigate("/login");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Registration failed."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout>

            <AuthCard>

                <AuthHeader
                    title="Verify Registration"
                    subtitle="Enter the OTP and create your password"
                />

                <form onSubmit={handleSubmit}>

                    <AuthInput
                        label="OTP"
                        name="otp"
                        placeholder="Enter OTP"
                        value={formData.otp}
                        onChange={handleChange}
                        icon={<FaKey />}
                        required
                    />

                    <AuthInput
                        label="Create Password"
                        name="password"
                        type="password"
                        placeholder="Create Password"
                        value={formData.password}
                        onChange={handleChange}
                        icon={<FaLock />}
                        required
                    />

                    <AuthButton loading={loading}>
                        Complete Registration
                    </AuthButton>

                </form>

            </AuthCard>

        </AuthLayout>

    );

};

export default RegisterOTP;