import axios from "axios";
import { Cart } from "../Models/Cart_Mod.js";
import crypto from "crypto";

export const checkoutCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email; // make sure email is in user model
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    let totalAmount = 0;
    cart.items.forEach(item => {
      totalAmount += item.product.price * item.quantity;
    });

    // Paystack expects amount in kobo (i.e. cents * 100)
    const paystackAmount = totalAmount * 100;

    // Call Paystack API to initialize payment
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: userEmail,
        amount: paystackAmount,
        metadata: {
          userId: userId.toString(),
          cartId: cart._id.toString(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      message: "Payment initialized",
      authorizationUrl: response.data.data.authorization_url,
      reference: response.data.data.reference,
    });
  } catch (error) {
    console.error("Checkout error:", error.response?.data || error.message);
    res.status(500).json({ message: "Server error" });
  }
};



export const paystackWebhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).send("Invalid signature");
    }

    const event = req.body;

    if (event.event === "charge.success") {
      const metadata = event.data.metadata;
      const userId = metadata.userId;
      const cartId = metadata.cartId;

      // ✅ Clear cart after successful payment
      await Cart.deleteOne({ _id: cartId, user: userId });

      console.log(`Payment successful for user ${userId}, cart cleared`);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.sendStatus(500);
  }
};
