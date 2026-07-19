import express from "express";
import { requestRegistrationOTP } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", requestRegistrationOTP);

export default router;