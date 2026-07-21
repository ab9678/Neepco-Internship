import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCurrentUser = async () => {
        try {

            const { data } = await authService.getCurrentUser();

            setUser(data.user);

        } catch (error) {

            setUser(null);
            localStorage.removeItem("token");

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token) {
            fetchCurrentUser();
        } else {
            setLoading(false);
        }

    }, []);

    const logout = () => {

        localStorage.removeItem("token");
        setUser(null);

    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                logout,
                fetchCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);