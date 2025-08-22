import express from "express";
import { checkoutCart, paystackWebhook } from "../Controllers/Payment_Con.js";
import { protect } from "../Middleware/authen_users.js";

const paymentRouter = express.Router();

// User goes to checkout → Paystack
paymentRouter.post("/checkout", protect, checkoutCart);

// Paystack sends webhook events here
paymentRouter.post("/webhook", express.json({ type: "application/json" }), paystackWebhook);

export default paymentRouter;
