import express from "express";
import { requestOtp, verifyOtp, adminLogin, logout} from "../Controllers/UserAuthentication.js";

const router = express.Router();

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/admin-login", adminLogin);
router.post("/logout", logout);




export default router;
