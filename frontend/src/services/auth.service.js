import api from "./api";

const authService = {

    register(data) {
        return api.post("/auth/register", data);
    },

    verifyRegister(data) {
        return api.post("/auth/register/verify", data);
    },

    login(data) {
        return api.post("/auth/login", data);
    },

    verifyLogin(data) {
        return api.post("/auth/login/verify", data);
    },

    getCurrentUser() {
        return api.get("/auth/me");
    }

};

export default authService;