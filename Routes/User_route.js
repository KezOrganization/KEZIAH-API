import express from "express";
import { requestOtp, verifyOtp, adminLogin} from "../Controllers/UserAuthentication.js";

const router = express.Router();

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/admin-login", adminLogin);




export default router;
