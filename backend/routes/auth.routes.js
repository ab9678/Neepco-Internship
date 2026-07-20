import express from "express";
import { requestRegistrationOTP, verifyRegistrationOTP, login, verifyLoginOTP, getCurrentUser} from "../controllers/auth.controller.js";
import generateToken from "../utils/generateToken.js";
import protect from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/register", requestRegistrationOTP);
router.post("/register/verify", verifyRegistrationOTP);
router.post("/login", login);
router.post("/login/verify", verifyLoginOTP);
router.get("/me", protect, getCurrentUser);
export default router;