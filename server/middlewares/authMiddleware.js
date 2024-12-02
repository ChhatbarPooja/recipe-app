// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');

  // Check if token doesn't exist
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Extract token (remove 'Bearer ' from string)
  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload
    req.user = await UserModel.findById(decoded.user.id).select('-password');

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;
