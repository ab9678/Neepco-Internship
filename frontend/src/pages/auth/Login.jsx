import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserTie, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";

import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

import authService from "../../services/auth.service";

const Login = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        identifier: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.identifier.trim())
            return toast.error("Employee ID or Company Email is required.");

        if (!formData.password.trim())
            return toast.error("Password is required.");

        setLoading(true);

        try {

            const payload = {
                password: formData.password
            };

            if (formData.identifier.includes("@")) {
                payload.companyEmail = formData.identifier.trim();
            } else {
                payload.employeeId = formData.identifier.trim();
            }

            const { data } = await authService.login(payload);

            toast.success(data.message);

            sessionStorage.setItem(
                "loginIdentifier",
                formData.identifier.trim()
            );

            navigate("/login/verify");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Login Failed."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout>

            <AuthCard>

                <AuthHeader
                    title="Sign In"
                    subtitle="Welcome back!"
                />

                <form onSubmit={handleSubmit}>

                    <AuthInput
                        label="Employee ID or Company Email"
                        name="identifier"
                        placeholder="Enter Employee ID or Email"
                        value={formData.identifier}
                        onChange={handleChange}
                        icon={<FaUserTie />}
                        required
                    />

                    <AuthInput
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                        icon={<FaLock />}
                        required
                    />

                    <AuthButton loading={loading}>
                        Sign In
                    </AuthButton>

                </form>

                <p className="mt-6 text-center text-sm text-slate-600">

                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Register
                    </Link>

                </p>

            </AuthCard>

        </AuthLayout>

    );

};

export default Login;