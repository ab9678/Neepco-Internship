import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";
import toast from "react-hot-toast";

import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

import authService from "../../services/auth.service";

const Register = () => {

    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!identifier.trim()) {
            return toast.error("Employee ID or Company Email is required.");
        }

        setLoading(true);

        try {

            const payload = {};

            if (identifier.includes("@")) {
                payload.companyEmail = identifier.trim();
            } else {
                payload.employeeId = identifier.trim();
            }

            const { data } = await authService.register(payload);

            toast.success(data.message);

            sessionStorage.setItem(
                "registerIdentifier",
                identifier.trim()
            );

            navigate("/register/verify");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to send OTP."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout>

            <AuthCard>

                <AuthHeader
                    title="Register"
                    subtitle="Register using your Employee ID or Company Email"
                />

                <form onSubmit={handleSubmit}>

                    <AuthInput
                        label="Employee ID or Company Email"
                        name="identifier"
                        placeholder="Enter Employee ID or Company Email"
                        value={identifier}
                        onChange={(e) =>
                            setIdentifier(e.target.value)
                        }
                        icon={<FaUserTie />}
                        required
                    />

                    <AuthButton loading={loading}>
                        Send OTP
                    </AuthButton>

                </form>

                <p className="mt-6 text-center text-sm text-slate-600">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Sign In
                    </Link>

                </p>

            </AuthCard>

        </AuthLayout>

    );

};

export default Register;