import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import LoginOTP from "./pages/auth/LoginOTP";
import Register from "./pages/auth/Register";
import RegisterOTP from "./pages/auth/RegisterOTP";

import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />

            <Route path="/login/verify" element={<LoginOTP />} />

            <Route path="/register" element={<Register />} />

            <Route path="/register/verify" element={<RegisterOTP />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;