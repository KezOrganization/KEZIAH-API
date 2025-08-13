import { User } from "../Models/User_Mod.js";
import { Admin } from "../Models/admin_Mod.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateToken from "../Configs/Token.js";
import { sendOtpEmail } from "../Configs/Email_services.js";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    let user = await User.findOne({ email });

    // If new user, create them
    if (!user) {
      user = new User({ email });
    }

    // Generate OTP and expiry
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = { code: otp, expiresAt: otpExpiry };
    await user.save();

    // Send OTP
    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error sending OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    // Find user by OTP
    const user = await User.findOne({ "otp.code": otp });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.otp.expiresAt || user.otp.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Mark as verified
    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    // Generate JWT
    const token = generateToken(user._id, "user");

    res.json({
      message: "Authentication successful",
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error verifying OTP" });
  }
};


export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
