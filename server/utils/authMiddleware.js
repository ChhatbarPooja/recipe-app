import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Bearer token
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    console.log(decoded.user.id)
    req.user = await UserModel.findById(decoded.user.id).select('-password'); // Attach user data to req
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};