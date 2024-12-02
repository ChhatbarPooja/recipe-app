// routes/authRoute.js
import express from 'express';
import {
  loginController,
  registerController,
  forgotPasswordController,
  resetPasswordController,
  getUserProfileController,
  updateUserController,
  changePasswordController,
  updateUserStatusController
} from '../controllers/authController.js';

import { authMiddleware } from '../utils/authMiddleware.js';
import uploadSingle from '../middlewares/uploadMiddleware.js';
const authRoute = express.Router();

// Register a new user
authRoute.post('/register', registerController);
authRoute.get('/userDetails/:id?',getUserProfileController)
authRoute.put('/userDetails/:id', uploadSingle, updateUserController);
authRoute.put('/update-status', updateUserStatusController)

// Login route
authRoute.post('/login', loginController);

// Forgot password route
authRoute.post('/forgot-password', forgotPasswordController);

// Reset password route
authRoute.post('/reset-password/:token', resetPasswordController);
authRoute.put('/change-password', authMiddleware, changePasswordController);


// Set up storage for Multer

export default authRoute;
