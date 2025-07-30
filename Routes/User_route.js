import express from 'express';
import { 
  register,
  verifyOTP,
  login,
  forgotPassword,
  resetPassword, getUserProfile, updateUserProfile, deleteUserAccount}  from '../Controllers/UserAuthentication.js';

  import { protect, adminOnly } from '../Middleware/authen_users.js';
const userRoute = express.Router();

// @route   POST /api/auth/register
userRoute.post('/register', register);

// @route   POST /api/auth/verify-otp
userRoute.post('/verify-otp', verifyOTP);

// @route   POST /api/auth/login
userRoute.post('/login', login);

// @route   POST /api/auth/forgot-password
userRoute.post('/forgot-password', forgotPassword);

// @route   POST /api/auth/reset-password/:token
userRoute.put('/reset-password/:token', resetPassword);

userRoute.get('/profile', protect, getUserProfile);
userRoute.put('/profile', protect, updateUserProfile);
userRoute.delete('/profile', protect, deleteUserAccount);

export default userRoute;
