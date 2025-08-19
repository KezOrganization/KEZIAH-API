// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { User } from '../Models/User_Mod.js';
import { Admin } from '../Models/admin_Mod.js';

export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check User collection first
    let user = await User.findById(decoded.id).select('-password');

    // If not found, check Admin collection
    if (!user) {
      user = await Admin.findById(decoded.id).select('-password');
    }

    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Token failed or expired' });
  }
};



export const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized, user missing' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied. Admins only.' });
  next();
};
