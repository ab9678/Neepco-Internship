import axios from "axios";

const env = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {};

const getApiBaseUrl = () => {
    if (env.VITE_API_BASE_URL) {
        return env.VITE_API_BASE_URL;
    }

    if (typeof window !== "undefined") {
        return `${window.location.protocol}//${window.location.hostname}:5000/api`;
    }

    return "http://localhost:5000/api";
};

const api = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;