import express from "express";
import { requestRegistrationOTP, verifyRegistrationOTP } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", requestRegistrationOTP);
router.post("/register/verify", verifyRegistrationOTP);
export default router;