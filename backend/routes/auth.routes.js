import express from "express";
import { requestRegistrationOTP, verifyRegistrationOTP, login, verifyLoginOTP } from "../controllers/auth.controller.js";
import generateToken from "../utils/generateToken.js";
const router = express.Router();

router.post("/register", requestRegistrationOTP);
router.post("/register/verify", verifyRegistrationOTP);
router.post("/login", login);
router.post("/login/verify", verifyLoginOTP);

export default router;